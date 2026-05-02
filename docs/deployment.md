# Deployment Guide

This document covers the complete deployment process for the Archvino static site.

## Overview

Archvino is a static Astro site that builds to the `dist/` directory. The site is deployed to a VPS running nginx and served at https://archvino.ru.

## Build Process

### Build Commands

```bash
# Development build (uses local CMS config)
npm run build

# Production build (configures Decap CMS for GitHub backend first)
npm run build:prod
```

The production build (`npm run build:prod`) automatically runs:
1. `astro build` - Builds the static site
2. `cms:configure:prod` - Copies `public/admin/config.production.yml` to `dist/admin/config.yml`

### Static Output

The build process generates a `dist/` directory containing:
- `index.html` - Main entry point
- `admin/` - CMS admin panel static assets
- Static assets (CSS, JS, images, fonts) with content-hashed filenames
- Generated pages for all routes

All files are static HTML/CSS/JS with no server-side rendering required.

## Deployment to Production Server

### Server Prerequisites

- Ubuntu/Debian VPS with SSH access
- nginx installed
- Node.js 20+ (for building)
- Git installed

### Quick Deploy Steps

1. **Connect to server:**
   ```bash
   ssh deploy@YOUR_VPS_IP
   ```

2. **Navigate to app directory:**
   ```bash
   cd /var/www/archvino
   ```

3. **Pull latest changes from `master` and build:**
   ```bash
   git pull --ff-only origin master
   npm ci
   npm run build:prod
   ```

4. **Reload nginx:**
   ```bash
   sudo systemctl reload nginx
   ```

### Deploy Model

This repository is deployed manually on the VPS. There is no required CI pipeline.

## Admin Panel Protection

The `/admin` route is protected using an OAuth proxy that handles GitHub authentication.

### OAuth Proxy Setup

The OAuth proxy allows editors to authenticate via GitHub without exposing client secrets. Located in `ops/oauth-proxy/`.

**Files:**
- `docker-compose.yml` - Docker configuration for the proxy
- `oauth-proxy.service` - Systemd service unit
- `nginx-auth-snippet.conf` - nginx configuration snippet
- `INSTALL.md` - Detailed installation instructions

**Quick setup:**

1. Create a GitHub OAuth App:
   - Go to GitHub Settings → Developer settings → OAuth Apps → New OAuth App
   - Application name: Archvino CMS
   - Homepage URL: https://archvino.ru
   - Authorization callback URL: https://archvino.ru/auth/callback

2. Deploy the OAuth proxy using Docker:
   ```bash
   cd ops/oauth-proxy
   cp .env.example .env
   # Edit .env with your GitHub Client ID and Secret
    docker compose up -d
   ```

3. Configure nginx to route `/auth` to the proxy (see `nginx-auth-snippet.conf`)

### CMS Backend Configuration

- **Development:** Uses `public/admin/config.yml` with the local Decap backend (`decap-server`)
- **Production:** `npm run build:prod` writes `public/admin/config.production.yml` into `dist/admin/config.yml` after the Astro build

The production config is intended to point to the GitHub repository and OAuth proxy, with commits going directly to `master`:
```yaml
backend:
  name: github
  repo: gavril-s/archvino
  branch: master

auth_endpoint: https://archvino.ru/auth
```

## Environment Configuration

### Build-time Configuration

Environment variables are embedded at build time. For this static site, configuration is managed through:

1. **CMS Config Files:**
   - `public/admin/config.yml` - Development Decap config used by the local admin UI
   - `public/admin/config.production.yml` - Production source config copied into `dist/admin/config.yml` by `npm run build:prod`

2. **Switching between configs:**
   ```bash
   # Development build
   npm run build
   
   # Production build (auto-configures CMS)
   npm run build:prod
   
    # Manual production config injection after a build
    npm run build && npm run cms:configure:prod
   ```

### Runtime Configuration

The public site is static, but the production CMS also depends on runtime configuration for the OAuth proxy (`ops/oauth-proxy/.env`) on the VPS.

## Production Build Differences

| Aspect | Development Build | Production Build |
|--------|------------------|------------------|
| Command | `npm run build` | `npm run build:prod` |
| CMS Config | `public/admin/config.yml` (local backend) | `dist/admin/config.yml` generated from `config.production.yml` |
| Auth | Local decap-server | OAuth proxy via GitHub |
| Target | Local development | Production VPS |

### Verifying Production Build

After running `npm run build:prod`, verify:

1. Check that `dist/admin/config.yml` contains the production GitHub backend settings
2. Confirm `dist/admin/index.html` exists
3. Test the admin panel at https://archvino.ru/admin

## Nginx Configuration

Basic nginx configuration for serving the static site:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name archvino.ru www.archvino.ru;

    root /var/www/archvino/dist;
    index index.html;

    # Admin route with SPA fallback
    location = /admin { return 301 /admin/; }
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

    # Main site with SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache policy
    location ~* \.(?:html?|xml|json)$ {
        add_header Cache-Control "public, max-age=0, must-revalidate";
    }

    location ~* \.(?:css|js|jpg|jpeg|gif|png|svg|webp|avif|woff2|woff|ttf|otf)$ {
        access_log off;
        add_header Cache-Control "public, max-age=2592000, immutable";
    }

    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
}
```

## Quick Reference

| Command | Description |
|---------|-------------|
| `npm run build` | Build for development |
| `npm run build:prod` | Build for production |
| `npm run preview` | Preview built site locally |
| `npm run cms:proxy` | Run local CMS proxy (dev) |

### Server Commands

```bash
# Build on server
cd /var/www/archvino && npm run build:prod

# Reload nginx
sudo systemctl reload nginx

# Check nginx config
sudo nginx -t

# View logs
sudo tail -F /var/log/nginx/access.log
sudo tail -F /var/log/nginx/error.log
```

## Rollback

To rollback to a previous version:

```bash
cd /var/www/archvino
git fetch --all
git checkout <commit-sha>
npm ci
npm run build:prod
sudo systemctl reload nginx
```

## Related Documentation

- [DEPLOY.md](../DEPLOY.md) - Detailed VPS deployment guide
- [ops/oauth-proxy/README.md](../ops/oauth-proxy/README.md) - OAuth proxy setup
- [ops/oauth-proxy/INSTALL.md](../ops/oauth-proxy/INSTALL.md) - OAuth proxy installation
