## Static content for sradams.co.uk

Build found [here](https://www.sradams.co.uk)

### Front-end
The whole point of this project is to look into JS based frameworks. This site is currently setup with Next.js
I've had a ton of fun looking into CSS and global themes as well as setting up a Markdown based blog. My music page allowed me to tinker with iframes as well as juggling the iframe properties with the global theme.
The sandbox page is as it says on the tin, quick, messy, web-based applets.

### Hosting
I've moved from a GCP based setup to a Vercel deployment. I had fun setting up the pipelines and resources on GCP but quickly realised how overkill it was (especially when my free credits expired!). So this is all currently hosted on Vercel.

### CI/CD
Originally solely integrated and deployed using CircleCI pipelines. This still remains but the prod deployment is completed with Github integrations. My drive to keep CircleCI is due to control and ease of future CLI integrations in the future.

# TODOs
- CSS/Next.js grids on global theme
- prod CD with metric based alerting
- container CI deployment (vercel project link)
- terraform infra resources (I'd like some backend functionality)
- next.js tinkering
