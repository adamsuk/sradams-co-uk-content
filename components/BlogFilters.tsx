import React from 'react';
import { VscSearch, VscArrowSwap, VscClose } from 'react-icons/vsc';

interface BlogFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  allTags: string[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  sortOrder: 'newest' | 'oldest';
  onSortChange: (order: 'newest' | 'oldest') => void;
  postCount: number;
}

function BlogFilters({
  searchQuery,
  onSearchChange,
  allTags,
  selectedTags,
  onTagsChange,
  sortOrder,
  onSortChange,
  postCount,
}: BlogFiltersProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onTagsChange(selectedTags.filter((t) => t !== tag));
    } else {
      onTagsChange([...selectedTags, tag]);
    }
  };

  const clearFilters = () => {
    onSearchChange('');
    onTagsChange([]);
  };

  const isNewest = sortOrder === 'newest';

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <VscSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSortChange(isNewest ? 'oldest' : 'newest')}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <VscArrowSwap className={!isNewest ? 'rotate-180' : ''} />
            <span className="hidden sm:inline">
              {isNewest ? 'Newest' : 'Oldest'}
            </span>
          </button>
        </div>
      </div>

      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1 text-sm rounded-full transition-colors ${
                selectedTags.includes(tag)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {(searchQuery || selectedTags.length > 0) && (
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <span>
            {postCount}
            {' '}
            {postCount === 1 ? 'post' : 'posts'}
            {' '}
            found
          </span>
          <button
            type="button"
            onClick={clearFilters}
            className="flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline"
          >
            <VscClose />
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}

export default BlogFilters;
