DEPLOY.md

# Deploying Archvino on a VPS

This document describes a recommended, repeatable process to deploy the Archvino static site to a VPS (Ubuntu/Debian family). It includes: server prerequisites, build steps, an nginx configuration that routes only requests for `archvino.ru` to the site, TLS via Let's Encrypt, optional continuous deploy approaches, and guidance for how CMS edits (Decap/Netlify-style) become commits in the repository.

Assumptions
- You control a VPS (example: Ubuntu 22.04 LTS) reachable at a public IP.
- You control the DNS for `archvino.ru` and can add an A record pointing at the VPS IP.
- You have SSH access to the VPS and a Git remote for the project (GitHub, GitLab, etc.).
- The site is a static Astro site built into `dist/` by `npm run build`.

High-level flow
1. Prepare the VPS (user, firewall, packages).
2. Clone the repo into `/var/www/archvino` (or another chosen path).
3. Build the site (Node + npm -> `npm ci && npm run build`).
4. Configure nginx to serve the generated `dist/` directory for `archvino.ru` only.
5. Obtain TLS certs with Certbot (Let's Encrypt).
6. (Optional) Configure automated deploys (GitHub Actions -> rsync or server-side webhook).
7. Configure the CMS editing flow (recommended: editor commits to remote Git provider; fallback: self-hosted Decap proxy + manual git commits).

Detailed step-by-step

1) Create a non-root deploy user and secure the server

Run as your initial admin account (not `root`):

```sh
# example: create a deploy user, give sudo
sudo adduser deploy
sudo usermod -aG sudo deploy

# set up firewall (allow SSH and nginx later)
sudo apt update && sudo apt install -y ufw
sudo ufw allow OpenSSH
sudo ufw enable
```

Copy your SSH public key into `/home/deploy/.ssh/authorized_keys` (use `ssh-copy-id` or manually append the key). After that, connect as the `deploy` user for the rest of the steps where indicated.

2) Install OS packages (nginx, git, build tools, certbot)

Run as root or sudo:

```sh
sudo apt update
sudo apt install -y git build-essential curl nginx certbot python3-certbot-nginx
```

Install Node.js (recommended LTS — Node 20+):

```sh
# NodeSource installer for Node 20 (adjust to 18 if you prefer)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# verify
node -v
npm -v
```

3) Prepare the app directory and clone the repo

```sh
sudo mkdir -p /var/www/archvino
sudo chown deploy:deploy /var/www/archvino
sudo chmod 755 /var/www/archvino

# switch to deploy user
sudo -i -u deploy
cd /var/www/archvino

# clone (SSH recommended) - replace repo URL with your remote
git clone git@github.com:gavril-s/archvino.git .

# if you prefer https:
# git clone https://github.com/gavril-s/archvino.git .
```

4) Build the site

Build must be done as the `deploy` user (so files in `dist/` are owned correctly):

```sh
# inside /var/www/archvino as deploy
npm ci
npm run build

# after success a `dist/` directory should exist
ls -la dist
```

5) nginx configuration (serves only archvino.ru)

Create a dedicated site file (this will not affect other nginx vhosts):

```sh
sudo tee /etc/nginx/sites-available/archvino <<'NGINX'
server {
    listen 80;
    listen [::]:80;
    server_name archvino.ru www.archvino.ru;

    root /var/www/archvino/dist;
    index index.html;

    # If someone hits /admin (no trailing slash) redirect to the directory
    location = /admin { return 301 /admin/; }

    # Ensure the admin client can load its single-page entry
    location /admin/ {
        try_files $uri $uri/ /admin/index.html;
    }

    # Serve static site files normally; fall back to index for client side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache policy: short for HTML, long for static assets
    location ~* \.(?:html?|xml|json)$ {
        add_header Cache-Control "public, max-age=0, must-revalidate";
        try_files $uri =404;
    }

    location ~* \.(?:css|js|jpg|jpeg|gif|png|svg|webp|avif|woff2|woff|ttf|otf)$ {
        access_log off;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files $uri =404;
    }

    # Security headers (basic)
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy "no-referrer-when-downgrade";
}
NGINX

sudo ln -s /etc/nginx/sites-available/archvino /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Notes:
- The server block's `server_name` is restricted to `archvino.ru` and `www.archvino.ru`, so it will not match requests for other hosts. Do not set `default_server` here.
- `try_files $uri $uri/ /index.html` is safe for a prerendered Astro build and also allows client-side route fallback if needed. If you prefer strict 404 behavior, replace the fallback with `=404`.

6) Obtain TLS with Certbot (Let’s Encrypt)

Run certbot's nginx plugin to obtain and install certificates:

```sh
sudo certbot --nginx -d archvino.ru -d www.archvino.ru

# test renewal (dry-run)
sudo certbot renew --dry-run
```

Certbot will update the nginx config to redirect HTTP -> HTTPS and configure `listen 443 ssl` for this vhost. After success, your site will be served over HTTPS.

7) Automating deploys (recommended options)

Option A — recommended: CI builds and deploys artifacts to the VPS (GitHub Actions example)

1. Create an SSH keypair on your CI runner (private key stored as `VPS_SSH_KEY` secret in GitHub) and add the public key to `/home/deploy/.ssh/authorized_keys` on the VPS.
2. Add a small GitHub Actions workflow that runs `npm ci && npm run build` and then rsyncs `dist/` to `/var/www/archvino/dist` on the server.

Example (GitHub Actions):

```yaml
# .github/workflows/deploy.yml
name: Build and deploy
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      - name: Install deps and build
        run: npm ci && npm run build
      - name: Sync to VPS
        env:
          SSH_PRIVATE_KEY: ${{ secrets.VPS_SSH_KEY }}
        run: |
          mkdir -p ~/.ssh
          echo "$SSH_PRIVATE_KEY" > ~/.ssh/id_rsa
          chmod 600 ~/.ssh/id_rsa
          rsync -avz --delete dist/ deploy@YOUR_VPS_IP:/var/www/archvino/dist/
```

After this, Git pushes to main will build and update files on the VPS. Nginx serves the new content immediately.

Option B — simpler: server-side `git pull` deploy and manual rebuild

On the VPS create a small `deploy.sh` script at `/var/www/archvino/deploy.sh`:

```sh
#!/usr/bin/env bash
set -e
cd /var/www/archvino
git fetch --all
git reset --hard origin/main
npm ci
npm run build
# ensure correct ownership
chown -R deploy:deploy /var/www/archvino/dist
systemctl reload nginx || true

echo "Deployed at $(date -u)"
```

Make it executable: `chmod +x /var/www/archvino/deploy.sh`.

You can run this script manually after pushing to the remote, or trigger it from a webhook service (GitHub webhooks -> webhook receiver on VPS) that runs the script. If you add a webhook, secure the endpoint and require a secret.

8) CMS editing workflows and how CMS edits get saved to Git

There are two practical ways to let editors modify content and have the changes end up in your Git repository.

Recommended (production-grade): CMS uses a Git provider backend (GitHub/GitLab) and commits directly to the remote repo

- Configure `public/admin/config.yml` (the Decap/Netlify CMS admin config) to use a Git backend (or Git Gateway) pointing at your remote repository. When properly configured with OAuth (or Git Gateway), the CMS will create commits and optionally pull requests on the remote repo.
- Example backend (illustrative; follow Decap/Netlify CMS docs for exact auth setup):

```yaml
backend:
  name: github
  repo: your-org/archvino
  branch: main
```

- With this setup: editors sign in via the OAuth flow, the CMS pushes commits to the canonical Git provider, and your CI (GitHub Actions) handles building and deploying the updated site to the VPS.

Notes: setting up the Git provider auth (OAuth app or Git Gateway) requires configuration at the Git provider and in the CMS. The Decap documentation walks through these steps for GitHub/GitLab/Bitbucket.

Fallback (self-hosted CMS proxy writing to local files on the VPS)

- If you prefer to host the CMS proxy (Decap) on the VPS and allow editors to edit content directly on the server, you can run the Decap file-proxy with `local_backend: true`.
- Steps:
  1. Install `decap-server` globally (or run with `npx`) on the VPS: `sudo npm i -g decap-server` or run with `npx decap-server`.
  2. Start it from `/var/www/archvino` so it writes to the repo files (the config uses `src/content` and `src/assets`). Example:

```sh
# run as deploy user from /var/www/archvino
npx decap-server --port 8081 --config public/admin/config.yml
```

  3. When editors use the admin UI, Decap will create/modify files under `/var/www/archvino/src/content` and `/var/www/archvino/src/assets`.
  4. You must commit those changes to Git and push them to your remote (either manually or via an automated commit hook).

Systemd unit example to keep the Decap proxy running (optional):

```ini
[Unit]
Description=Decap CMS proxy
After=network.target

[Service]
User=deploy
WorkingDirectory=/var/www/archvino
ExecStart=/usr/bin/npx decap-server --port 8081 --config public/admin/config.yml
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Save it as `/etc/systemd/system/decap.service`, then `sudo systemctl daemon-reload && sudo systemctl enable --now decap.service`.

Important cautions for the fallback approach:
- Decap with `local_backend:true` writes files to the working directory but does not automatically create Git commits. Require editors to be instructed to either (a) notify a maintainer to commit, or (b) provide a monitored process that creates commits (not recommended without review).
- If you want automatic commits, implement a file watcher that runs `git add -A && git commit -m "cms: update" && git push`, but this may create noisy commits and presents security risks. Prefer the recommended Git-provider approach for production.

9) Post-deploy verification

- Visit https://archvino.ru and https://www.archvino.ru and confirm TLS and content load.
- Visit https://archvino.ru/admin/ to verify the admin UI is reachable. If using the Git provider backend, sign-in and try a tiny change to verify commits appear in the remote repo and CI deploys them.
- On the server: `cd /var/www/archvino && git status` should be clean (unless you are running the local backend and intentionally editing files there).

10) Quick rollback

If the latest deploy is bad and you're using the `git pull` method on the server, roll back by checking out a known-good commit and rebuilding:

```sh
cd /var/www/archvino
git fetch --all
git checkout <good-commit-sha>
npm ci
npm run build
systemctl reload nginx
```

If you're using the CI/rsync approach, push the commit you want to deploy to the main branch (CI will trigger).

11) Useful commands summary

- Build locally: `npm ci && npm run build`
- Preview the built site locally: `python3 -m http.server --directory dist 4321` (for quick check)
- Check nginx config: `sudo nginx -t` and reload: `sudo systemctl reload nginx`
- Check certbot renew dry-run: `sudo certbot renew --dry-run`
- Tail logs: `sudo tail -F /var/log/nginx/error.log /var/log/nginx/access.log`

Troubleshooting hints
- 502/504 errors: not an issue for a static nginx setup; check `root` exists and files are present in `/var/www/archvino/dist`.
- 404 for admin route: ensure `/admin/index.html` exists in `dist/admin/` and nginx `location /admin/` fallback is present.
- Permission problems serving files: ensure `deploy` owns `/var/www/archvino/dist` and nginx has read access.

Security considerations
- Keep the VPS and packages updated (`apt upgrade`) on a maintenance cadence.
- Limit SSH access to known public keys and consider disabling password login.
- Use strong secrets for any webhook or SSH deploy automation.
- If running a self-hosted Decap proxy, protect it behind HTTP auth or IP restrictions (or only allow access via an internal VPN) until Git provider flow is configured.

Appendix: full minimal nginx config (copy/paste)

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name archvino.ru www.archvino.ru;

    root /var/www/archvino/dist;
    index index.html;

    location = /admin { return 301 /admin/; }

    location /admin/ {
        try_files $uri $uri/ /admin/index.html;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(?:html?|xml|json)$ {
        add_header Cache-Control "public, max-age=0, must-revalidate";
        try_files $uri =404;
    }

    location ~* \.(?:css|js|jpg|jpeg|gif|png|svg|webp|avif|woff2|woff|ttf|otf)$ {
        access_log off;
        add_header Cache-Control "public, max-age=2592000, immutable";
        try_files $uri =404;
    }

    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header Referrer-Policy "no-referrer-when-downgrade";
}
```

If you want me to: I can (pick one)
- create a `deploy.sh` and a `systemd` unit in the repo and add example GitHub Actions workflow, or
- create a minimal `decap.service` systemd unit file and test instructions for running the local CMS proxy, or
- create a fully tested GitHub Actions workflow that builds and rsyncs to your VPS (you will need to provide the `VPS_SSH_KEY` secret).

Choose which automation you prefer and I will add the scripts/workflow to the repo.
