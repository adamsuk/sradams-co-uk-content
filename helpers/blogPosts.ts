import env from "../default-env";
import { BlogPost } from "../models/blogPosts";

export const normalizeBlogSlug = (slug?: string | string[]): string => {
  if (!slug) {
    return "";
  }

  const value = Array.isArray(slug) ? slug[0] : slug;
  if (!value) {
    return "";
  }

  return value.replace(/^blog\./, "").replace(/^blog$/, value);
};

export const parsePost = (post: BlogPost): BlogPost => {
  let processedContent = post.content;

  const phpStreams: Record<string, string> = {
    "page://": `${env.NEXT_PUBLIC_CMS_URL}/user/pages/`,
  };

  Object.entries(phpStreams).forEach(([stream, url]) => {
    const regex = new RegExp(stream, "g");
    processedContent = processedContent.replace(regex, url);
  });

  if (processedContent.startsWith("---")) {
    const endIndex = processedContent.indexOf("---", 3);
    if (endIndex !== -1) {
      processedContent = processedContent.slice(endIndex + 3).trim();
    }
  }

  return {
    ...post,
    content: processedContent,
  };
};

export default parsePost;

/** The post slug for a `/blog/<slug>` path (ignoring query, hash and a trailing slash). */
export const blogSlugFromPath = (path?: string): string | null => {
  if (!path) {
    return null;
  }

  const match = path.split(/[?#]/)[0].match(/^\/blog\/([^/]+?)(?:\.html)?\/?$/);
  return match ? decodeURIComponent(match[1]) : null;
};

/** The public post with the given slug, if the CMS has one. */
const isPublicPostWithSlug = (post: BlogPost, slug: string): boolean => {
  if (!post.meta || post.meta.public === false || !post.slug) {
    return false;
  }
  return normalizeBlogSlug(post.slug) === slug;
};

export const findPublicPost = (
  posts: BlogPost[] | undefined,
  slug: string,
): BlogPost | undefined => (posts || []).find((post) => isPublicPostWithSlug(post, slug));
