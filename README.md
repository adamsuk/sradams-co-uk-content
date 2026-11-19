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

## Notes

- Static export (`output: 'export'` in `next.config.js`) — no server-side runtime, no API routes.
- Husky + lint-staged run ESLint on staged files before every commit.
- Commitizen is configured for conventional commits (`npx cz`).

## Error tracking

Front-end errors are sent to Better Stack with the Sentry browser SDK when
`NEXT_PUBLIC_SENTRY_DSN` is set. If the variable is unset, the SDK does not
initialise, so local development, tests and e2e runs send nothing.

The DSN is the one shown on the application's Ingest tab in Better Stack.
Do not commit the real value. For local testing, copy `.env.local.example` to
`.env.local`, uncomment the `NEXT_PUBLIC_SENTRY_DSN` assignment, and fill in
its value so Next.js loads the DSN for local reporting.

Because this site is statically exported in GitHub Actions, set the production
value as a repository secret named `NEXT_PUBLIC_SENTRY_DSN`
(Settings → Secrets and variables → Actions). Cloudflare Pages environment
variables are not used at build time and will not reach the client bundle.
The deploy workflow passes the secret into the production/preview `npm run build`
step; CI tests and Playwright runs do not receive it. The same step sets
`NEXT_PUBLIC_SENTRY_ENVIRONMENT` to `preview` on pull requests and
`production` otherwise, because `next build` always inlines `NODE_ENV` as
`production`.

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:2d98dadc057a3d73089171dc6ebf25ae50f93786bf0d73ba006450ddc6f99997 -->

After setting the secret, manually run the **Deploy to Cloudflare Pages** workflow
in GitHub Actions and wait for the deployment to complete. Then confirm ingest by
running `Sentry.captureMessage("test")` in the deployed site's browser console.

<!-- /coderabbit-ai-generated:v1 -->
`window.Sentry` only exposes `captureMessage`, which is enough for that check
and lets unused SDK exports be tree-shaken.
