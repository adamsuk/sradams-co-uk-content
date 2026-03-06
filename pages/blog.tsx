import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import cn from 'classnames';

import SideBar from '../components/SideBar';
import Loader from '../components/Loader';
import env from '../default-env';

interface BlogMeta {
  slug?: string;
  title?: string;
  description?: string;
  date?: string;
}

interface BlogPost {
  name: string;
  slug?: string;
  meta: BlogMeta;
  content: string;
  error?: boolean;
}

interface MarkdownPageProps {
  index: number;
  items: BlogPost[];
}

function MarkdownPage({ index, items }: MarkdownPageProps) {
  const [title, setTitle] = useState('');
  const [markdownText, setMarkdownText] = useState('');

  const phpStreams: Record<string, string> = {
    'page://': `${env.NEXT_PUBLIC_CMS_URL}/user/pages/`,
  };

  useEffect(() => {
    let post = items[index].content;
    // eslint-disable-next-line no-restricted-syntax
    for (const [stream, url] of Object.entries(phpStreams)) {
      const regex = new RegExp(stream, 'g');
      post = post.replace(regex, url);
    }
    window.scrollTo(window.scrollX, 1);
    setTitle(items[index].meta.title || '');
    setMarkdownText(post);
  }, [index, items]);

  return (
    <div>
      <div className="text-4xl font-extrabold text-center pb-4">
        {title}
      </div>
      <Markdown
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rehypePlugins={[rehypeRaw, rehypeSanitize] as any}
        className="prose dark:prose-invert whitespace-no-wrap max-w-full"
        disallowedElements={['h2']}
      >
        {markdownText}
      </Markdown>
    </div>
  );
}

interface BlogItemProps {
  item: BlogPost;
}

function BlogItem({ item }: BlogItemProps) {
  return (
    <button type="button" className="w-full">
      <h3 className="border-b border-gray-300">{String(item.meta.title)}</h3>
      <br />
      <p className="text-sm text-left">{String(item.meta.description)}</p>
      <br />
      <p className="text-xs text-right">{item.meta.date}</p>
    </button>
  );
}

interface BlogProps {
  className?: string;
}

function Blog({ className = '' }: BlogProps) {
  const [itemIndex, setItemIndex] = useState(0);
  const [blog, setBlog] = useState<BlogPost[] | undefined>();

  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${env.NEXT_PUBLIC_CMS_URL}/blog`)
      .then((response) => {
        const rawRes = response.data.filter((post: BlogPost) => post.meta);
        setBlog(rawRes.filter((post: BlogPost) => post.name !== 'blog.md'));
      });
  }, []);

  useEffect(() => {
    if ((blog as unknown as { error?: boolean })?.error) {
      router.push('/404');
    }
  }, [(blog as unknown as { error?: boolean })?.error]);

  useEffect(() => {
    if (router.query?.post) {
      const index = blog?.findIndex(
        (item) => item.slug === router.query.post,
      );
      if (index !== undefined && index !== -1) {
        setItemIndex(index);
      }
    }
  }, [router.query]);

  return (
    <div className={cn('flex flex-1 flex-col w-full', { 'h-full': !blog })}>
      {blog ? (
        <div className="w-full pt-7">
          <SideBar
            sidebarItems={blog}
            SidebarItem={BlogItem}
            error={false}
            className={className}
            index={itemIndex}
          >
            {MarkdownPage}
          </SideBar>
        </div>
      ) : <Loader />}
    </div>
  );
}

export default Blog;
