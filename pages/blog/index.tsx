import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import env from '../../default-env';
import Loader from '../../components/Loader';
import BlogCard from '../../components/BlogCard';
import BlogFilters from '../../components/BlogFilters';

import { parsePost } from './helper';
import { BlogPost } from './models';

const calculateReadingTime = (content: string): string => {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
};

const BlogIndex = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pageMeta, setPageMeta] = useState<BlogPost>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${env.NEXT_PUBLIC_CMS_URL}/blog`)
      .then((response) => {
        const rawRes = response.data.filter((post: BlogPost) => post.meta);
        const filteredPosts = rawRes.filter(
          (post: BlogPost) => post.meta.public !== false,
        );

        const blogMd = filteredPosts.find(
          (post: BlogPost) => post.name === 'blog.md',
        );
        if (blogMd) {
          setPageMeta(parsePost(blogMd));
          setPosts(
            filteredPosts.filter((post: BlogPost) => post.name !== 'blog.md'),
          );
        }
      })
      .catch(() => {
        router.push('/404');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    posts.forEach((post) => {
      post.meta.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [posts]);

  const filteredPosts = useMemo(() => {
    let result = [...posts];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (post) => post.meta.title?.toLowerCase().includes(query)
          || post.meta.desc?.toLowerCase().includes(query)
          || post.content.toLowerCase().includes(query),
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((post) => selectedTags.every((tag) => post.meta.tags?.includes(tag)));
    }

    result.sort((a, b) => {
      const dateA = new Date(a.meta.date || '').getTime();
      const dateB = new Date(b.meta.date || '').getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [posts, searchQuery, selectedTags, sortOrder]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      <div className="mb-2">
        {pageMeta?.meta?.title && (
          <h1 className="text-4xl font-extrabold mb-2">
            {pageMeta?.meta?.title}
          </h1>
        )}
        {pageMeta?.content && (
          <div className="prose prose-lg max-w-none dark:prose-invert mx-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {pageMeta.content}
            </ReactMarkdown>
          </div>
        )}
      </div>

      <BlogFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        allTags={allTags}
        selectedTags={selectedTags}
        onTagsChange={setSelectedTags}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
        postCount={filteredPosts.length}
      />

      {filteredPosts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No posts found matching your criteria.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedTags([]);
            }}
            className="mt-4 text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <BlogCard
              key={post.slug}
              title={post.meta.title || ''}
              description={post.meta.desc || ''}
              date={post.meta.date || ''}
              slug={post.slug || ''}
              tags={post.meta.tags || []}
              readingTime={calculateReadingTime(post.content)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogIndex;
