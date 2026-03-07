# sradams.co.uk

Personal site built with Next.js and Tailwind CSS. Live at [sradams.co.uk](https://sradams.co.uk).

## Overview

A statically exported Next.js site. Pages cover a homepage, blog, CV, and a sandbox for quick web experiments. The homepage bio is pulled dynamically from my GitHub profile README.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · React 18

## Quick Start

Requires Node >= 18.17.0.

```bash
npm install
npm run dev       # http://localhost:3000
```

Other useful commands:

```bash
npm run build     # production build (static export to /out)
npm run test      # jest + react testing library
npm run lint      # eslint (airbnb config)
npm run lint:fix  # auto-fix lint issues
```

## Deployment

Hosted on **Cloudflare Pages** with a direct GitHub integration — pushes to `main` trigger a deploy automatically. The build command is `next build` and the output directory is `out`.

A `vercel.json` is still present for cache-control headers if you ever want to run it on Vercel, but it's not the active deployment target.

### Docker

A multi-stage Dockerfile is included if you want to run it in a container:

```bash
docker build -t sradams-co-uk .
docker run -p 3000:3000 sradams-co-uk
```

> Note: the Dockerfile targets an older Node version — worth updating if you use it seriously.

## Notes

- Static export (`output: 'export'` in `next.config.js`) — no server-side runtime, no API routes.
- Husky + lint-staged run ESLint on staged files before every commit.
- Commitizen is configured for conventional commits (`npx cz`).
