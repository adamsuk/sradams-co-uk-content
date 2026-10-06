import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import env from '../default-env';
import { normalizeBlogSlug } from '../helpers/blogPosts';
import { BlogPost } from '../models/blogPosts';

const WORDS_PER_MINUTE = 200;
const shell = 'block w-full rounded-2xl border border-gray-200 bg-gray-50 p-6 dark:border-gray-700 dark:bg-gray-900/40 md:p-8';

export function newestPost(posts: BlogPost[]): BlogPost | null {
  const published = posts.filter((post) => (
    post?.meta
    && post.meta.public !== false
    && post.name !== 'blog.md'
    && post.meta.title
  ));
  published.sort((left, right) => (
    Date.parse(right.meta.date || '') - Date.parse(left.meta.date || '')
  ));
  return published[0] ?? null;
}

function readingTime(content: string): string {
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
  return `${minutes} min read`;
}

/** Starts with the page, so it is not waiting on the GitHub profile. */
export function useLatestPost(): BlogPost | null | undefined {
  const [post, setPost] = useState<BlogPost | null | undefined>(undefined);

  useEffect(() => {
    let cancel = false;
    axios.get(`${env.NEXT_PUBLIC_CMS_URL}/blog`)
      .then((response) => {
        if (cancel) return;
        setPost(Array.isArray(response.data) ? newestPost(response.data) : null);
      })
      .catch(() => {
        if (!cancel) setPost(null);
      });
    return () => {
      cancel = true;
    };
  }, []);

  return post;
}

function LatestPostSkeleton() {
  return (
    <div className={shell} data-testid="latest-post-skeleton" aria-hidden="true">
      <div className="h-3 w-24 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-3 h-4 w-11/12 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-3 h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-1 h-3 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-3 h-3 w-32 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

function LatestPost({ post }: { post: BlogPost | null | undefined }) {
  if (post === undefined) return <LatestPostSkeleton />;
  if (!post?.meta.title) return null;

  const slug = normalizeBlogSlug(post.slug || post.name);
  const date = post.meta.date || '';

  return (
    <Link
      href={`/blog/${slug}`}
      className={`${shell} text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md`}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        Latest post
      </p>
      <h2 className="mt-1 line-clamp-2 text-base font-semibold text-gray-900 dark:text-gray-100">
        {post.meta.title}
      </h2>
      {post.meta.desc && (
        <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-400">
          {post.meta.desc}
        </p>
      )}
      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        {date && (
          <time dateTime={date}>
            {new Date(date).toLocaleDateString('en-GB', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </time>
        )}
        {date ? ' · ' : ''}
        {readingTime(post.content || '')}
      </p>
    </Link>
  );
}

export default LatestPost;
