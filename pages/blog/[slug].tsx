import React from "react";
import Link from "next/link";
import axios from "axios";
import { GetStaticPaths, GetStaticProps } from "next";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { VscArrowLeft } from "react-icons/vsc";

import env from "../../default-env";
import MarkdownImg from "../../components/MarkdownImg";
import Loader from "../../components/Loader";

import { BlogPost } from "../../models/blogPosts";
import { parsePost, normalizeBlogSlug } from "../../helpers/blogPosts";

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

interface BlogPostPageProps {
  post: BlogPost;
}

function BlogPostPage({ post }: BlogPostPageProps) {
  if (!post) {
    return <Loader />;
  }

  const readingTime = calculateReadingTime(post.content);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 mb-8 transition-colors"
      >
        <VscArrowLeft />
        <span>Back to Blog</span>
      </Link>

      <article>
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold mb-4">{post.meta.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
            <time dateTime={post.meta.date}>
              {new Date(post.meta.date || "").toLocaleDateString("en-GB", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <span className="text-gray-400">•</span>
            <span>{readingTime}</span>
          </div>

          {post.meta.tags && post.meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="prose dark:prose-invert max-w-none prose-img:rounded-lg prose-a:text-blue-600 dark:prose-a:text-blue-400">
          <Markdown
            rehypePlugins={[rehypeRaw, rehypeSanitize] as never[]}
            components={{
              img: MarkdownImg,
            }}
          >
            {post.content}
          </Markdown>
        </div>
      </article>

      <footer className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <VscArrowLeft />
          <span>Back to Blog</span>
        </Link>
      </footer>
    </div>
  );
}

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

export default BlogPostPage;
