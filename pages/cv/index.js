import React, { useState, useEffect } from "react";

import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

import matter from 'gray-matter';

const CV = (props) => {
  const [markdownText, setMarkdownText] = useState("");

  useEffect(() => {
    async function fetchData() {
      // Import our .md file using the `slug` from the URL
      const content = await require(`raw-loader!./cv.md`)
      // Parse .md data through `matter`
      const cv = matter(content.default)
      setMarkdownText(cv.content)
    }
    fetchData();
  }, []);

  return (
    <div className='flex flex-col max-w-7xl m-auto items-center p-4 sm:pt-8 sm:pb-4 sm:px-4'>
      <h1 className="font-sans"><center>{props.cv_metadata.title}</center></h1>
      <br></br>
      <Markdown
        rehypePlugins={[rehypeRaw]}
        parserOptions={{ commonmark: true }}
        className="prose dark:prose-invert whitespace-no-wrap max-w-full print:text-xs"
      >
        {markdownText}
      </Markdown>
    </div>
  );
};

export async function getStaticProps() {
  // Import our .md file using the `slug` from the URL
  var content = await require(`raw-loader!./cv.md`);
  // Parse .md data through `matter`
  const { data } = matter(content.default)

  return {
    'props': {
      cv_metadata: await Promise.resolve(data),
      }
    };
}

export default CV;
