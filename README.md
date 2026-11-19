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

Front-end errors are sent to Better Stack. When
`NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN` is unset or blank, the standalone
`@sentry/browser` client sends them: `pages/_app.tsx` calls `initSentry()`,
which initialises the SDK when `NEXT_PUBLIC_SENTRY_DSN` is set. If the DSN is
unset, the SDK does not initialise, so local development, tests and e2e runs
send nothing.

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
`production`. It also sets `NEXT_PUBLIC_SENTRY_RELEASE` from `github.sha`.
`Sentry.init` sends that value as `release` when it is non-empty. Leave it
unset locally.

Better Stack real-user monitoring (web vitals, analytics, session replays and
front-end errors) loads on every page when `NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN`
is set. The token is a public client-side value. It is inlined at build time
from a GitHub Actions repository variable of the same name
(Settings → Secrets and variables → Actions → Variables), not from a secret.
Research Scout / Scott will set `NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN`. If the
variable is unset or blank, the tag is not rendered, so local development,
tests, e2e and forks send nothing. Do not commit a token. Leave the
placeholder in `.env.local.example` empty.

The tag calls `betterstack('init')` with the same environment and release as
the Sentry SDK: `NEXT_PUBLIC_SENTRY_ENVIRONMENT` (`preview` on pull requests
and `production` otherwise) and `NEXT_PUBLIC_SENTRY_RELEASE` (the commit SHA).
`release` is omitted when that variable is unset. The deploy workflow passes
the token only into the deploy job's `npm run build` step. Jest and
Playwright do not receive it. Masking, replay and sampling are set in the
Better Stack Frontend tab, not in this repository.

The JavaScript tag and the standalone `@sentry/browser` client are mutually
exclusive. The tag embeds Sentry's browser SDK, and both would share
`window.Sentry`. When `NEXT_PUBLIC_BETTERSTACK_RUM_TOKEN` is set, the tag
handles front-end errors and the standalone client is not initialised. The
tag already calls `betterstack('init')` with the same environment and release
(`NEXT_PUBLIC_SENTRY_ENVIRONMENT` and `NEXT_PUBLIC_SENTRY_RELEASE`), so the
source maps uploaded by the deploy job still match. When the token is unset
or blank, Sentry behaves as it does today: `initSentry()` runs from
`pages/_app.tsx`, does nothing without a DSN, and initialises when a DSN is
present.

Readable stack traces need the client source maps on Better Stack. The
deploy job, after `next build` and before the Cloudflare Pages deploy, runs
`sentry-cli sourcemaps inject` and then `sourcemaps upload` on
`out/_next/static`. The upload uses the same commit SHA as
`SENTRY_RELEASE`, so the maps line up with the release the browser reports.
The four values come from the application's Advanced settings in Better
Stack. Set the names below in GitHub Actions
(Settings → Secrets and variables → Actions). Do not commit the values.

- `SENTRY_AUTH_TOKEN` — repository secret (Telemetry API token)
- `SENTRY_URL` — repository variable (source-map endpoint)
- `SENTRY_ORG` — repository variable
- `SENTRY_PROJECT` — repository variable

`SENTRY_URL`, `SENTRY_ORG`, and `SENTRY_PROJECT` may instead be repository
secrets of the same name. A variable wins when both are set. The token is
only a secret.

If `SENTRY_AUTH_TOKEN` is unset, the upload is skipped and the workflow still
succeeds, including on forks. After the upload or the skip, the job deletes
every `.map` file under `out/` and fails if any remain, so maps are never
published. Better Stack does not support publicly hosted maps.

After a local `npm run build`, strip maps the same way before treating
`out/` as deployable:

```bash
find out -type f -name '*.map' -delete
map_count="$(find out -type f -name '*.map' | wc -l)"
map_count="${map_count//[[:space:]]/}"
if [ "$map_count" != "0" ]; then
  echo "Refusing to deploy: ${map_count} .map file(s) remain in out/" >&2
  exit 1
fi
```

<!-- coderabbit-ai-generated:v1 -->

<!-- coderabbit-ai-generated-section:v1:2d98dadc057a3d73089171dc6ebf25ae50f93786bf0d73ba006450ddc6f99997 -->

After setting the secret, manually run the **Deploy to Cloudflare Pages** workflow
in GitHub Actions and wait for the deployment to complete. Then confirm ingest by
running `Sentry.captureMessage("test")` in the deployed site's browser console.

<!-- /coderabbit-ai-generated:v1 -->
When the standalone client initialises, `window.Sentry` only exposes
`captureMessage`, which is enough for that check and lets unused SDK exports
be tree-shaken. When the RUM token is set, the JavaScript tag owns error
reporting and the standalone client is not initialised.
