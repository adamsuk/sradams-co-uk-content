import fs from 'fs';
import path from 'path';
import axios from 'axios';

import env from '../default-env';
import { BlogPost } from '../models/blogPosts';
import { normalizeBlogSlug } from './blogPosts';

// Build-time access to the CMS blog list. Only imported by getStaticPaths/getStaticProps,
// so it never reaches the client bundle.
//
// `npm run build` runs scripts/cms-snapshot.js first and sets CMS_SNAPSHOT, so the whole
// build reads one validated snapshot instead of calling the CMS once per post. Without
// it (next dev, or next build run directly) the list is fetched from the CMS.

let snapshot: BlogPost[] | undefined;

export const resetBuildPostsCache = (): void => {
  snapshot = undefined;
};

export async function loadBlogPostsForBuild(): Promise<BlogPost[]> {
  const file = process.env.CMS_SNAPSHOT;
  if (file) {
    if (!snapshot) {
      snapshot = JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')) as BlogPost[];
    }
    return snapshot;
  }
  const response = await axios.get<BlogPost[]>(`${env.NEXT_PUBLIC_CMS_URL}/blog`);
  return response.data;
}

/** Public posts that get a static page. */
export const publicBuildPosts = (posts: BlogPost[] | undefined): BlogPost[] => (
  Array.isArray(posts) ? posts : []
).filter((post) => post.meta && post.meta.public !== false && post.slug);

/**
 * Slugs to pre-render. Throws (failing the build) when the CMS has no public posts,
 * so a CMS outage can never publish a blog-less site.
 */
export async function blogSlugsForBuild(): Promise<string[]> {
  const posts = publicBuildPosts(await loadBlogPostsForBuild())
    .filter((post) => post.name !== 'blog.md');
  if (posts.length === 0) {
    throw new Error('CMS /blog returned no public posts; refusing to build a blog-less site.');
  }
  return posts.map((post) => normalizeBlogSlug(post.slug));
}

export async function findBuildPost(slug: string): Promise<BlogPost | undefined> {
  return publicBuildPosts(await loadBlogPostsForBuild())
    .find((post) => normalizeBlogSlug(post.slug) === slug);
}
