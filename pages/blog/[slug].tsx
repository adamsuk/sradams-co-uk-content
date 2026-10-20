import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";

import env from "../../default-env";
import BlogPostView, { BlogPostPageProps } from "../../components/BlogPostView";

import { BlogPost } from "../../models/blogPosts";
import { parsePost, normalizeBlogSlug } from "../../helpers/blogPosts";

// The site is a static export (next.config.js: output 'export'), so fallback must be
// false: only posts that exist at build time get a page. Posts published later are
// shown by the 404 page's client-side fallback until the scheduled rebuild picks them up
// (.github/workflows/cloudflare-deploy.yml).
export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const response = await axios.get(`${env.NEXT_PUBLIC_CMS_URL}/blog`);
    const posts: BlogPost[] = response.data;

    const paths = posts
      .filter((post) => post.meta && post.meta.public !== false && post.slug)
      .map((post) => ({
        params: { slug: normalizeBlogSlug(post.slug) },
      }));

    return {
      paths,
      fallback: false,
    };
  } catch {
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps<BlogPostPageProps> = async ({
  params,
}) => {
  const slug = normalizeBlogSlug(params?.slug);

  try {
    const response = await axios.get(`${env.NEXT_PUBLIC_CMS_URL}/blog`);
    const posts: BlogPost[] = response.data;
    const foundPost = posts.find(
      (post) => normalizeBlogSlug(post.slug) === slug,
    );

    if (!foundPost || !foundPost.meta || foundPost.meta.public === false) {
      return { notFound: true };
    }

    return {
      props: {
        post: parsePost(foundPost),
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default BlogPostView;
