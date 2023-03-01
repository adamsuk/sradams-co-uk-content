import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

import PropTypes from 'prop-types';

import axios from 'axios';

import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import SideBar from '../components/SideBar';
import env from '../default-env';

function MarkdownPage({ index, items }) {
  const [title, setTitle] = useState('');
  const [markdownText, setMarkdownText] = useState('');

  const phpStreams = {
    'page://': `${env.NEXT_PUBLIC_CMS_URL}/user/pages/`,
  };

  // TODO: url param change on blog change
  // if (items[index]?.header?.slug) {
  //   router.push(`/blog?post=${items[index].header.slug}`, undefined, {
  //     shallow: true,
  //   });
  // }

  useEffect(() => {
    let post = items[index].content;
    // eslint-disable-next-line no-restricted-syntax
    for (const [stream, url] of Object.entries(phpStreams)) {
      const regex = new RegExp(stream, 'g');
      post = post.replace(regex, url);
    }
    window.scrollTo(window.scrollX, 1);
    setTitle(items[index].header.title);
    setMarkdownText(post);
  }, [index, items]);

  return (
    <div>
      <div className="text-4xl font-extrabold text-center pb-4">
        {title}
      </div>
      <Markdown
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        parserOptions={{ commonmark: true }}
        className="prose dark:prose-invert whitespace-no-wrap max-w-full"
      >
        {markdownText}
      </Markdown>
    </div>
  );
}

MarkdownPage.propTypes = {
  index: PropTypes.number.isRequired,
  items: PropTypes.shape({
    header: PropTypes.shape({
      slug: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      date: PropTypes.string,
    }),
    // eslint-disable-next-line react/forbid-prop-types
    content: PropTypes.object,
  }).isRequired,
};

function BlogItem({ item }) {
  return (
    <button type="button" className="w-full">
      <h3 className="border-b border-gray-300">{item.header.title}</h3>
      <br />
      <p className="text-sm text-left">{item.header.description}</p>
      <br />
      <p className="text-xs text-right">{item.header.date}</p>
    </button>
  );
}

BlogItem.propTypes = {
  item: PropTypes.shape({
    header: PropTypes.shape({
      title: PropTypes.string,
      description: PropTypes.string,
      date: PropTypes.string,
    }),
  }).isRequired,
};

function Blog({ className }) {
  const [itemIndex, setItemIndex] = useState(0);
  const [grav, setGrav] = useState();

  const router = useRouter();

  useEffect(() => {
    axios
      .get(`${env.NEXT_PUBLIC_CMS_URL}/?return-as=json`, {
        headers: {
          ...(process.env.NEXT_PUBLIC_ENV === 'production' && { 'Access-Control-Allow-Origin': '*' }),
        },
      })
      .then((response) => setGrav(response.data));
  }, []);

  useEffect(() => {
    if (grav?.error) {
      router.push('/404');
    }
  }, [grav?.error]);

  useEffect(() => {
    if (router.query?.post) {
      const index = grav?.children.findIndex(
        (item) => item.header.slug === router.query.post,
      );
      if (index !== -1) {
        setItemIndex(index);
      }
    }
  }, [router.query]);

  return (
    <div className="pt-7">
      {grav && (
        <SideBar
          sidebarItems={grav.children}
          SidebarItem={BlogItem}
          error={grav.error}
          className={className}
          slug={router.query}
          index={itemIndex}
        >
          {MarkdownPage}
        </SideBar>
      )}
    </div>
  );
}

Blog.defaultProps = {
  className: '',
};

Blog.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
};

export default Blog;
