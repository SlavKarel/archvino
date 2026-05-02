OAuth proxy for Decap/Netlify CMS
================================

This repo includes instructions to deploy a small OAuth proxy that Netlify/Decap CMS can use to perform the GitHub OAuth server-side exchange. Running the proxy lets the client-side CMS use the GitHub backend in production without exposing client secrets.

Why you need this
- GitHub's OAuth flow requires a client secret and a server-side exchange. A static site cannot safely hold the client secret. An OAuth proxy performs the secure exchange on the server and returns the token to the CMS client.

Recommended approach
1. Create a GitHub OAuth App (for the repository owner or an organization account):
   - Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
   - Application name: Archvino CMS
   - Homepage URL: https://archvino.ru
   - Authorization callback URL: https://archvino.ru/auth/callback
   - Create the app and copy the Client ID and Client Secret.

2. Deploy the official Netlify CMS OAuth proxy
- Official reference: https://github.com/netlify/netlify-cms-oauth-provider (clone this repo on the VPS)

Using Docker (recommended)

Use the checked-in `docker-compose.yml` in this directory and adapt the environment variables through `.env`:

```yaml
version: '3.8'
services:
  oauth-proxy:
    image: netlify/netlify-cms-oauth-provider:latest
    restart: unless-stopped
    environment:
      - GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}
      - GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}
      - JWT_SECRET=${JWT_SECRET}
      - BASE_URL=https://archvino.ru
    ports:
      - "127.0.0.1:3000:3000"
```

Notes:
- Replace the env placeholders with the values from the GitHub OAuth app.
- `JWT_SECRET` should be a strong random string used by the proxy to sign tokens.
- Keep the container bound to localhost and expose it through nginx at `https://archvino.ru/auth`.

Reverse proxy setup
- Run the oauth-proxy on an internal port and configure nginx to route `/auth` to the proxy. Example (nginx):

```nginx
location /auth/ {
  proxy_pass http://127.0.0.1:3000/;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
}
```

CMS configuration
- In the site's production CMS config (`public/admin/config.production.yml`) set:

```yaml
backend:
  name: github
  repo: gavril-s/archvino
  branch: master

auth_endpoint: https://archvino.ru/auth
```

Build process
- Use the production build script so the generated site gets the GitHub-backed CMS config without modifying the tracked development config:

```sh
npm ci && npm run build:prod
```

Security notes
- Protect the proxy endpoint with a strict TLS configuration.
- Keep the GitHub client secret confidential; store it in the environment or your secret manager and keep `ops/oauth-proxy/.env` out of git.

If you want me to add a `docker-compose.yml` and a systemd unit for the proxy in this repo, tell me and I will add them.
