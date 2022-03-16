import React, { useState, useEffect, useLayoutEffect } from "react";
import { useRouter } from 'next/router'

import axios from 'axios';

import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

import SideBar from '../components/SideBar'
import env from '../default-env'

const Blog = ({ children, className, error }) => {
  const [itemIndex, setItemIndex] = useState(0);
  const router = useRouter();

  useLayoutEffect(() => {
    if (error) {
      router.push('/404')
    }
  }, [error])

  const MarkdownPage = ({ index, items }) => {
    const [markdownText, setMarkdownText] = useState("");
    
    const phpStreams = {
      "page://": `${env.NEXT_PUBLIC_CMS_URL}/user/pages/`,
    }

    useEffect(() => {
      var post = items[index].content
      for (const [stream, url] of Object.entries(phpStreams)) {
        const regex = new RegExp(stream, 'g');
        post = post.replace(regex, url)
      }
      window.scrollTo(window.scrollX, 1)
      setMarkdownText(`# ${items[index].header.title}\r\n${post}`)
    }, [index, items]);

    return (
      <Markdown 
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        parserOptions={{ commonmark: true }}
        className="prose dark:prose-invert whitespace-no-wrap max-w-full"
      >
        {markdownText}
      </Markdown>
    )
  }

  const changeRouting = ({ index, items }) => {
    if (items[index]?.header?.slug) {
      router.push(`/blog/?post=${items[index].header.slug}`, undefined, { shallow: true })
    }
  }

  const BlogItem = ({ item, index }) => {
    return (
      <button type="button" className="w-full">
        <h3 className="border-b border-gray-300">{item.header.title}</h3>
        <br></br>
        <p className="text-sm text-left">{item.header.description}</p>
        <br></br>
        <p className="text-xs text-right">{item.header.date}</p>
      </button>
    )
  }

  useEffect(() => {
    if (router.query?.post) {
      const index = children.findIndex(item => item.header.slug === router.query.post)
      if (index !== -1) {
        setItemIndex(index)
      }
    }
  }, [router.query])

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
};

export async function getStaticProps() {
  const grav = await axios.get("https://grav.sradams.co.uk/?return-as=json")
    .then(
      (response) => response.data
    )
    .catch(
      (error) => { error }
    )

  return {
    'props': {
      ...grav,
    }
  };
}

export default Blog;
