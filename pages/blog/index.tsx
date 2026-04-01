import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

import env from '../../default-env';
import Loader from '../../components/Loader';
import BlogCard from '../../components/BlogCard';
import BlogFilters from '../../components/BlogFilters';

interface BlogMeta {
  slug?: string;
  title?: string;
  desc?: string;
  date?: string;
  public?: boolean;
  tags?: string[];
}

interface BlogPost {
  name: string;
  slug?: string;
  meta: BlogMeta;
  content: string;
  error?: boolean;
}

function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

function BlogIndex() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [pageMeta, setPageMeta] = useState<{
    title: string;
    desc: string;
  } | null>(null);
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
          setPageMeta({
            title: blogMd.meta.title || 'Blog',
            desc: blogMd.meta.desc || '',
          });
          setPosts(
            filteredPosts.filter((post: BlogPost) => post.name !== 'blog.md'),
          );
        } else {
          setPageMeta({
            title: 'Blog',
            desc: 'Thoughts on development, technology, and more',
          });
          setPosts(filteredPosts);
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
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-center mb-2">
          {pageMeta?.title || 'Blog'}
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-400">
          {pageMeta?.desc || 'Thoughts on development, technology, and more'}
        </p>
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
}

export default BlogIndex;
