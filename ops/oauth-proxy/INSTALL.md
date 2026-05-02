Deploying the OAuth proxy (Archvino)
===================================

This file contains concrete steps to deploy the OAuth proxy used by the CMS in production.

Prerequisites
- A VPS with Docker and Docker Compose installed (or Docker Engine + Compose plugin).
- The Archvino repo checked out at `/var/www/archvino` on the server.
- Nginx installed and serving the site for `archvino.ru`.

Steps

1) Copy the example env file and fill secrets

```sh
cd /var/www/archvino/ops/oauth-proxy
cp .env.example .env
# Edit .env and set the values
nano .env
```

Important values:
- GITHUB_CLIENT_ID — OAuth application client id
- GITHUB_CLIENT_SECRET — OAuth application client secret (keep secret)
- JWT_SECRET — strong random string used by the proxy to sign its own tokens
- BASE_URL — https://archvino.ru

2) Start the proxy with docker compose

```sh
# run as a user with permission to use Docker (deploy)
cd /var/www/archvino/ops/oauth-proxy
docker compose up -d
```

3) Configure nginx to forward `/auth` to the proxy

- Include `ops/oauth-proxy/nginx-auth-snippet.conf` inside your site config (or copy its contents to the server block):

```nginx
include /var/www/archvino/ops/oauth-proxy/nginx-auth-snippet.conf;
```

- Reload nginx: `sudo nginx -t && sudo systemctl reload nginx`

4) Configure GitHub OAuth App

- In the GitHub OAuth app settings, set the callback URL to `https://archvino.ru/auth/callback`.

5) (Optional) Install the systemd unit to auto-run on boot

```sh
sudo cp /var/www/archvino/ops/oauth-proxy/oauth-proxy.service /etc/systemd/system/oauth-proxy.service
sudo systemctl daemon-reload
sudo systemctl enable --now oauth-proxy.service
sudo systemctl status oauth-proxy.service
```

6) Verify flow

- Visit: https://archvino.ru/admin
- Click sign in → it should redirect to GitHub and return to the site via `/auth/callback` and finish the flow.
- If sign-in succeeds, the CMS will be able to create direct commits to the configured `repo` on `master` as defined in `public/admin/config.production.yml`.

Security notes
- Never commit `.env` with real secrets. Use `.env.example` only in the repo.
- Restrict access to the OAuth proxy management endpoints if you add any.
