#!/usr/bin/env node
/*
 * Fetch the CMS blog list once per build and refuse to build a blog-less site.
 *
 *   node scripts/cms-snapshot.js             writes .cms/blog.json + .cms/blog.sha256
 *   node scripts/cms-snapshot.js --hash-only prints the sha256 of the live list
 *
 * `npm run build` runs this first and points next build at the snapshot (CMS_SNAPSHOT),
 * so getStaticPaths/getStaticProps read one file instead of calling the CMS per post.
 * The hash is of the raw response body; the deploy workflow publishes it as
 * /cms-content.sha256 and the scheduled check compares it with --hash-only.
 */
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

try {
  // Optional: the scheduled check runs this without node_modules installed.
  // eslint-disable-next-line global-require
  require('dotenv').config();
} catch (error) {
  // no dotenv; use the environment as-is
}

const CMS_URL = (process.env.NEXT_PUBLIC_CMS_URL || 'https://blog.sradams.co.uk/api').replace(/\/$/, '');
const OUT_DIR = path.join(__dirname, '..', '.cms');
const RETRY_DELAYS_MS = [5000, 15000];

const sleep = (ms) => new Promise((resolve) => { setTimeout(resolve, ms); });

/** Public posts with a slug, excluding the blog index page (blog.md). */
function publicPosts(posts) {
  if (!Array.isArray(posts)) return [];
  return posts.filter(
    (post) => post
      && post.meta
      && post.meta.public !== false
      && post.slug
      && post.name !== 'blog.md',
  );
}

/** Parse and validate a CMS /blog body. Throws unless it has at least one public post. */
function validateBlogList(body) {
  let posts;
  try {
    posts = JSON.parse(body);
  } catch (error) {
    throw new Error(`CMS /blog did not return JSON: ${String(body).slice(0, 200)}`);
  }
  const count = publicPosts(posts).length;
  if (count === 0) {
    throw new Error('CMS /blog returned no public posts; refusing to build a blog-less site.');
  }
  return { posts, count };
}

const sha256 = (text) => crypto.createHash('sha256').update(text).digest('hex');

async function fetchBlogList(fetchImpl = fetch, delays = RETRY_DELAYS_MS) {
  const url = `${CMS_URL}/blog`;
  let lastError;
  for (let attempt = 0; attempt <= delays.length; attempt += 1) {
    try {
      // eslint-disable-next-line no-await-in-loop
      const res = await fetchImpl(url);
      // eslint-disable-next-line no-await-in-loop
      const body = await res.text();
      if (!res.ok) throw new Error(`CMS /blog returned HTTP ${res.status}: ${body.slice(0, 200)}`);
      validateBlogList(body);
      return body;
    } catch (error) {
      lastError = error;
      if (attempt < delays.length) {
        console.warn(`${error.message} (retrying in ${delays[attempt] / 1000}s)`);
        // eslint-disable-next-line no-await-in-loop
        await sleep(delays[attempt]);
      }
    }
  }
  throw lastError;
}

async function main(argv = process.argv.slice(2)) {
  const body = await fetchBlogList();
  const hash = sha256(body);
  if (argv.includes('--hash-only')) {
    process.stdout.write(`${hash}\n`);
    return;
  }
  const { count } = validateBlogList(body);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, 'blog.json'), body);
  fs.writeFileSync(path.join(OUT_DIR, 'blog.sha256'), `${hash}\n`);
  console.log(`CMS snapshot: ${count} public posts, sha256 ${hash}`);
}

if (require.main === module) {
  main().catch((error) => {
    console.error(`::error::${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  publicPosts, validateBlogList, fetchBlogList, sha256,
};
