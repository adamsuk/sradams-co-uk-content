import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';

import matter from 'gray-matter';

function CV({ className, cvMetadata }) {
  const [markdownText, setMarkdownText] = useState('');

  useEffect(() => {
    async function fetchData() {
      // TODO: change this functionality and pull from Grav
      // Import our .md file using the `slug` from the URL
      // eslint-disable-next-line max-len
      // eslint-disable-next-line import/no-unresolved, import/no-webpack-loader-syntax, global-require
      const content = await require('raw-loader!./cv.md');
      // Parse .md data through `matter`
      const cv = matter(content.default);
      setMarkdownText(cv.content);
    }
    fetchData();
  }, []);

  return (
    <div className={className}>
      <div className="flex flex-col max-w-7xl m-auto items-center pb-4 pt-8 px-4 print:pt-1 print:text-black">
        <h1 className="font-sans">
          <center>{cvMetadata.title}</center>
        </h1>
        <br />
        <Markdown
          rehypePlugins={[rehypeRaw]}
          parserOptions={{ commonmark: true }}
          className="prose dark:prose-invert whitespace-no-wrap max-w-full print:hidden"
        >
          {markdownText}
        </Markdown>
        <Markdown className="hidden prose whitespace-no-wrap max-w-full print:text-2xs print:block">
          {markdownText}
        </Markdown>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  // Import our .md file using the `slug` from the URL
  // eslint-disable-next-line max-len
  // eslint-disable-next-line import/no-unresolved, import/no-webpack-loader-syntax, global-require
  const content = await require('raw-loader!./cv.md');
  // Parse .md data through `matter`
  const { data } = matter(content.default);

  return {
    props: {
      cvMetadata: await Promise.resolve(data),
    },
  };
}

CV.defaultProps = {
  className: '',
};

CV.propTypes = {
  className: PropTypes.string,
  cvMetadata: PropTypes.shape({
    title: PropTypes.string,
  }).isRequired,
};

export default CV;
