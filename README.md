## Static content for sradams.co.uk

Build found [here](https://sradams.co.uk)

### Front-end

The whole point of this project is to look into JS based frameworks. This site is currently setup with Next.js.
I've recently been through a whole site rewrite including aspects such as pulling the homepage text from you Github README and substituting `scss` for tailwind. Previously I had a ton of fun looking into CSS and global themes as well as setting up a Markdown based blog. My music page allowed me to tinker with iframes as well as juggling the iframe properties with the global theme.
The sandbox page is as it says on the tin, quick, messy, web-based applets.
These are all aspects I want to reincorporate into my site but for now I'm keeping it simple.

### Hosting

I've moved from a GCP based setup to a CloudFlare Pages deployment. I had fun setting up the pipelines and resources on GCP but quickly realised how overkill it was (especially when my free credits expired!). I did have a year or so hosted on Vercel and had no issues at all but wanted to play with Pages so that's where it currently lives.

### CI/CD

Originally solely integrated and deployed using CircleCI pipelines. But now the prod deployment is completed with really simple Github integrations with CloudFlare.

## TODOs

- prod CD with metric based alerting (potentially Sentry)
- terraform infra resources (I'd like some backend functionality)
- reintroduce my sandbox!
