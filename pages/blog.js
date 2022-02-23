import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router'

import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'
import { VscClose, VscChevronRight, VscChevronDown } from "react-icons/vsc";

import { useMediaQuery } from 'react-responsive'

import path from 'path';
import fs from 'fs';
import matter from 'gray-matter';

// decending
var publishDateSort = (a, b) => {
  b = b.published_date.split('-').join();
  a = a.published_date.split('-').join();
  return a > b ? -1 : a < b ? 1 : 0;
};

var printTagsFromMeta = (post_metadata) => {
  if (post_metadata.tags) {
    return post_metadata.tags.join(', ');
  } else {
    return 'N/A'
  }
}

var getUniqueTagsFromMeta = (posts_metadata) => {
  var all_unique_tags = []
  posts_metadata.map((post_metadata) => {
    var unique_post_tags = [...new Set(post_metadata.tags)]
    all_unique_tags = [...new Set([...unique_post_tags, ...all_unique_tags])]
  })
  return all_unique_tags
}

const Blog = (props) => {
  const [markdownText, setMarkdownText] = useState("");
  const [postMetadata, setPostMetadata] = useState(props.posts_metadata.sort(publishDateSort));
  const [sideActive, setSideActive] = useState(true);
  const [postIndex, setPostIndex] = useState(0);

  const router = useRouter();

  // figure out if its a large screen
  // TODO: link to tailwind breakpoints
  const isLargeScreen = useMediaQuery(
    { minDeviceWidth: 768 },
  )

  useEffect(() => {
    async function fetchData() {
      // Import our .md file using the `slug` from the URL
      const content = await require(`raw-loader!./../blog/${postMetadata[postIndex].slug}.md`)
      // Parse .md data through `matter`
      const post = matter(content.default)
      setMarkdownText(`# ${postMetadata[postIndex].title}\r\n${post.content}`)
      window.scrollTo(window.scrollX, 1)
    }
    fetchData();
  }, [postIndex, postMetadata]);

  const toggleSide = () => {
    setSideActive(!sideActive);
  }

  const changePost = (i, isSmallScreen=false) => () => {
    setPostIndex(i)
    if (isSmallScreen) {
      toggleSide()
    }
  }
  
  useEffect(() => {
    setSideActive(true);
  }, [router])

  return (
    <>
      <div className="pt-7">
        {(!sideActive) &&
          <>
            <div className="hidden lg:block z-30 items-center justify-center lg:fixed rounded-r-lg bg-gray-200 dark:bg-gray-700">
              <button>
                <VscChevronRight size={36} onClick={toggleSide}/>
              </button>
            </div>
            <div className="visible lg:hidden z-30 items-center justify-center fixed rounded-r-lg bg-gray-200 dark:bg-gray-700">
              <button>
                <VscChevronDown size={36} onClick={toggleSide}/>
              </button>
            </div>
          </>
        }
      </div>
      <div className={`relative container mb-auto flex flex-wrap flex-col md:flex-row md:px-0 max-w-screen w-full justify-between ${sideActive ? "lg:flex-row" : "md:max-w-7xl mx-auto"}`}>
        <div className={`${sideActive ? "visible" : "hidden"} relative md:w-2/5 w-full overflow-y-hidden`}>
          <div className="fixed flex flex-col overflow-y rounded-r-lg bg-gray-200 dark:bg-gray-800 max-h-[80%] h-[80%] md:w-1/3 w-full p-3">
            {(sideActive) && 
              <>
                <div className={`${isLargeScreen ? '' : 'hidden'} flex w-full items-end justify-end`}>
                  <button>
                    <VscClose size={36} onClick={toggleSide}/>
                  </button>
                </div>
                <div className="flex-1 h-full w-full overflow-y-scroll no-scrollbar items-center text-center">
                  {postMetadata.map((post, index) => (
                    <div key={`${post.slug}-div1`} className={`hover:bg-white hover:dark:bg-gray-600 p-2 ${index==(postMetadata.length - 1) ? "" : "border-b-4 border-gray-300"}`}>
                      <div key={`${post.slug}-div2`} className="">
                        <a key={`${post.slug}-a`} onClick={changePost(index, !isLargeScreen)}>
                          <button type="button" className="w-full">
                            <h3 className="border-b border-gray-300">{post.title}</h3>
                            <br></br>
                            <p className="text-sm text-left">{post.description}</p>
                            <br></br>
                            <p className="text-xs text-right">{post.date}</p>
                          </button>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            }
          </div>
        </div>

        <div className={`${sideActive ? "hidden md:block" : ""} flex-1 flex-col max-w-screen w-full mx-auto items-center overflow-y-hidden pb-4 px-7`}>
          <Markdown 
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            parserOptions={{ commonmark: true }}
            className="prose dark:prose-invert whitespace-no-wrap max-w-full"
          >
            {markdownText}
          </Markdown>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps() {
  // TODO: make this more defensive and check path first
  var files = fs.readdirSync("./blog");

  let posts_metadata = new Array();

  // loop over all files found in that directory
  for (var file of files) {
    if (path.parse(file).ext == '.md') {
      // Import our .md file using the `slug` from the URL
      var content = await require(`raw-loader!./../blog/${file}`);
      var stats = fs.statSync(`./blog/${file}`);
      // Parse .md data through `matter`
      const { data } = matter(content.default)
      
      posts_metadata.push({
        slug: path.parse(file).name,
        published_date: data.date,
        ...data
      });
    };
  };

  return {
    'props': {
      blogTitle: 'Welcome to my blog!',
      posts_metadata: await Promise.all(posts_metadata),
      githubUsername: "adamsuk",
      }
    };
}

export default Blog;
