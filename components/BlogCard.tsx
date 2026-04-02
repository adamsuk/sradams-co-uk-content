import React from 'react';
import Link from 'next/link';

interface BlogCardProps {
  title: string;
  description: string;
  date: string;
  slug: string;
  tags: string[];
  readingTime: string;
}

function BlogCard({
  title,
  description,
  date,
  slug,
  tags,
  readingTime,
}: BlogCardProps) {
  const displayTags = tags.slice(0, 3);
  const remainingCount = tags.length - 3;

  return (
    <Link href={`/blog/${slug}`}>
      <article className="group flex flex-col h-full bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
        <div className="p-5 flex flex-col flex-1">
          <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {title}
          </h2>

          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 flex-1 line-clamp-3">
            {description}
          </p>

          <div className="flex flex-wrap gap-1 mb-3">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-xs rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
              >
                {tag}
              </span>
            ))}
            {remainingCount > 0 && (
              <span className="px-2 py-0.5 text-xs text-gray-500">
                +
                {remainingCount}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
            <time dateTime={date}>
              {new Date(date).toLocaleDateString('en-GB', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </time>
            <span>{readingTime}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default BlogCard;
