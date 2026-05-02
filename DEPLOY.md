DEPLOY.md

# Production Deployment for archvino.ru

This repository is deployed manually to a VPS. There is no required CI pipeline.

Production target:
- Domain: `archvino.ru`
- Repository: `git@github.com:gavril-s/archvino.git`
- Branch: direct commits to `master`
- App path on server: `/var/www/archvino`
- Web root: `/var/www/archvino/dist`

The production flow is:
1. Push changes directly to `master` in `gavril-s/archvino`.
2. SSH to the VPS.
3. Pull `master` on the server.
4. Run `npm ci`.
5. Run `npm run build:prod`.
6. Reload nginx if its config changed.

`npm run build:prod` is required in production because it builds the site and then writes the production CMS config to `dist/admin/config.yml`. That is what makes `/admin` work against the GitHub backend in production without modifying the tracked development config.

Before the first production deploy, confirm `public/admin/config.production.yml` targets `gavril-s/archvino` on branch `master`. If it still says `main`, the CMS auth flow may succeed while content saves fail.

## One-Time VPS Setup

Commands in this section require `sudo` unless noted otherwise.

1. Install base packages:

```sh
sudo apt update
sudo apt install -y git curl nginx certbot python3-certbot-nginx docker.io docker-compose-plugin
```

2. Install Node.js 20:

```sh
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
npm -v
```

3. Create the app directory and give it to the deploy user:

```sh
sudo mkdir -p /var/www/archvino
sudo chown deploy:deploy /var/www/archvino
```

4. Clone the repository as the deploy user. No `sudo` here:

```sh
git clone git@github.com:gavril-s/archvino.git /var/www/archvino
cd /var/www/archvino
git checkout master
```

If the `deploy` user needs Docker access without `sudo`, add it once and re-login:

```sh
sudo usermod -aG docker deploy
```

## nginx Configuration

Commands in this section require `sudo`.

Create `/etc/nginx/sites-available/archvino`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name archvino.ru www.archvino.ru;

    root /var/www/archvino/dist;
    index index.html;

    location = /admin {
        return 301 /admin/;
    }

    location /admin/ {
        try_files $uri $uri/ /admin/index.html;
    }

    location /auth/ {
        proxy_pass http://127.0.0.1:3000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        proxy_buffering off;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site and validate nginx:

```sh
sudo ln -sf /etc/nginx/sites-available/archvino /etc/nginx/sites-enabled/archvino
sudo nginx -t
sudo systemctl reload nginx
```

Notes:
- `/admin` is required in production. Do not remove the `/admin` redirect or fallback.
- `/auth` is required in production. The CMS production config points at `https://archvino.ru/auth`.
- The `/auth/` block must reverse proxy to the OAuth container on `127.0.0.1:3000`.

## TLS

Commands in this section require `sudo`.

```sh
sudo certbot --nginx -d archvino.ru -d www.archvino.ru
sudo certbot renew --dry-run
```

## OAuth Proxy for `/admin`

The production CMS uses GitHub OAuth and commits to `gavril-s/archvino` on branch `master`. The proxy config lives in `ops/oauth-proxy/`.

1. Create the GitHub OAuth app:
- Homepage URL: `https://archvino.ru`
- Authorization callback URL: `https://archvino.ru/auth/callback`

2. Create the proxy environment file. No `sudo` here:

```sh
cd /var/www/archvino/ops/oauth-proxy
cp .env.example .env
```

Set these values in `.env`:
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`
- `JWT_SECRET`
- `BASE_URL=https://archvino.ru`

3. Start the proxy. If `deploy` is in the `docker` group, no `sudo` is required:

```sh
cd /var/www/archvino/ops/oauth-proxy
docker compose up -d
```

4. Optional: install the systemd unit so the proxy comes back after reboot. These commands require `sudo`:

```sh
sudo cp /var/www/archvino/ops/oauth-proxy/oauth-proxy.service /etc/systemd/system/oauth-proxy.service
sudo systemctl daemon-reload
sudo systemctl enable --now oauth-proxy.service
sudo systemctl status oauth-proxy.service
```

## Deploying an Update

This is the normal deploy path. Build on the VPS, not in CI.

Run as the `deploy` user inside `/var/www/archvino`:

```sh
git checkout master
git pull --ff-only origin master
npm ci
npm run build:prod
```

`sudo` is only needed after that if you changed nginx or systemd:

```sh
sudo nginx -t
sudo systemctl reload nginx
```

## Verification

After each deploy, verify:
1. `https://archvino.ru/` loads.
2. `https://archvino.ru/admin/` loads.
3. GitHub sign-in from `/admin/` returns through `/auth/callback`.
4. A small CMS edit can commit back to `gavril-s/archvino` on `master`.

Useful checks:

```sh
cd /var/www/archvino
git status
test -f dist/admin/index.html && printf 'admin build ok\n'
sudo nginx -t
sudo systemctl status nginx
sudo systemctl status oauth-proxy.service
```

## Troubleshooting

- `/admin` returns 404: `npm run build:prod` was not used, or nginx is missing `try_files $uri $uri/ /admin/index.html;`.
- GitHub login fails: check the OAuth app callback URL and confirm nginx forwards `/auth/` to `127.0.0.1:3000`.
- CMS loads but cannot save: verify the production config still targets `gavril-s/archvino` and that the proxy is running.
- `docker compose up -d` fails for the deploy user: either add `deploy` to the `docker` group or run Docker commands with `sudo`.
