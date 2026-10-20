import React, { useEffect, useState } from 'react';
import axios from 'axios';
import cn from 'classnames';

import env from '../default-env';
import BlogPostView from '../components/BlogPostView';
import Loader from '../components/Loader';
import { BlogPost } from '../models/blogPosts';
import { blogSlugFromPath, findPublicPost, parsePost } from '../helpers/blogPosts';

interface Custom404Props {
  className?: string;
}

type FallbackState = 'checking' | 'missing' | BlogPost;

/**
 * Blog posts are pre-rendered at build time (static export), so a post published since
 * the last deploy has no page yet and lands here. Look it up in the CMS and render it
 * client-side until the next scheduled rebuild creates the static page.
 */
function useBlogPostFallback(): FallbackState {
  // Start as 'checking' on server and client alike so hydration matches; the effect
  // settles non-blog paths to 'missing' straight away.
  const [state, setState] = useState<FallbackState>('checking');

  useEffect(() => {
    const slug = blogSlugFromPath(window.location.pathname);
    if (!slug) {
      setState('missing');
      return undefined;
    }

    let cancelled = false;
    axios
      .get<BlogPost[]>(`${env.NEXT_PUBLIC_CMS_URL}/blog`)
      .then((res) => {
        const post = findPublicPost(res.data, slug);
        if (!cancelled) {
          setState(post ? parsePost(post) : 'missing');
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState('missing');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

function Custom404({ className = '' }: Custom404Props) {
  const fallback = useBlogPostFallback();

  if (fallback === 'checking') {
    return <Loader />;
  }

  if (fallback !== 'missing') {
    return <BlogPostView post={fallback} />;
  }

  return (
    <div className={cn(className, 'relative top-1/2 translate-y-[-50%]')}>
      <div className="justify-center items-center w-full p-3 md:p-7">
        <div className="flex flex-col m-auto text-center content-center md:max-w-[35%]">
          <div className="text-[10rem]">😭</div>
          <br />
          <h1>Uh oh ...</h1>
          <br />
          <div>
            You&apos;ve either clicked a TBC link or chanced it with a path that
            doesn&apos;t exist.
          </div>
          <div>Either way no page here.</div>
        </div>
      </div>
    </div>
  );
}

export default Custom404;
