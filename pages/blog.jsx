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
  const [markdownText, setMarkdownText] = useState('');

  const phpStreams = {
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
    setMarkdownText(`# ${items[index].header.title}\r\n${post}`);
  }, [index, items]);

  return (
    <Markdown
      rehypePlugins={[rehypeRaw, rehypeSanitize]}
      parserOptions={{ commonmark: true }}
      className="prose dark:prose-invert whitespace-no-wrap max-w-full"
    >
      {markdownText}
    </Markdown>
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

function Blog({ children, className, error }) {
  const [itemIndex, setItemIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (error) {
      router.push('/404');
    }
  }, [error]);

  // TODO: allow for params to set blog post
  // const changeRouting = ({ index, items }) => {
  //   if (items[index]?.header?.slug) {
  //     router.push(`/blog/?post=${items[index].header.slug}`, undefined, {
  //       shallow: true,
  //     });
  //   }
  // };

  useEffect(() => {
    if (router.query?.post) {
      const index = children.findIndex(
        (item) => item.header.slug === router.query.post,
      );
      if (index !== -1) {
        setItemIndex(index);
      }
    }
  }, [router.query]);

  return (
    <div className="pt-7">
      <SideBar
        sidebarItems={children}
        SidebarItem={BlogItem}
        error={error}
        className={className}
        slug={router.query}
        index={itemIndex}
      >
        {MarkdownPage}
      </SideBar>
    </div>
  );
}

export async function getStaticProps() {
  const grav = await axios
    .get('https://grav.sradams.co.uk/?return-as=json')
    .then((response) => response.data)
    .catch((error) => {
      console.log(error);
    });

  return {
    props: {
      ...grav,
    },
  };
}

Blog.defaultProps = {
  className: '',
  error: null,
};

Blog.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.array.isRequired,
  className: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  error: PropTypes.object,
};

export default Blog;
