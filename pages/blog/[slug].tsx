import { GetStaticPaths, GetStaticProps } from "next";

import BlogPostView, { BlogPostPageProps } from "../../components/BlogPostView";

import { parsePost, normalizeBlogSlug } from "../../helpers/blogPosts";
import { blogSlugsForBuild, findBuildPost } from "../../helpers/buildPosts";

// The site is a static export (next.config.js: output 'export'), so fallback must be
// false: only posts that exist at build time get a page. Posts published later are
// shown by the 404 page's client-side fallback until the scheduled rebuild picks them up
// (.github/workflows/cloudflare-deploy.yml).
export const getStaticPaths: GetStaticPaths = async () => ({
  // No try/catch: a CMS failure must fail the build rather than ship zero post pages.
  paths: (await blogSlugsForBuild()).map((slug) => ({ params: { slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
  params,
}) => {
  const foundPost = await findBuildPost(normalizeBlogSlug(params?.slug));
  if (!foundPost) {
    return { notFound: true };
  }
  return {
    props: {
      post: parsePost(foundPost),
    },
  };
};

export default BlogPostView;
