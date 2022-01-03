import React, { useState, useEffect } from "react";
import axios from 'axios';
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

const Homepage = (pageProps) => {
  const [markdownText, setMarkdownText] = useState("");

  useEffect(() => {
    async function fetchData() {
      const data = await axios(
        `https://raw.githubusercontent.com/${pageProps.githubUsername}/${pageProps.githubUsername}/main/README.md`,
      ).then((res) => setMarkdownText(res.data));
    }
    fetchData();
  }, [pageProps.githubUsername]);

  return (
    <>
      <div className="relative container px-7 pt-7 mb-auto flex flex-wrap flex-col md:flex-row md:px-0 w-full max-w-7xl mx-auto justify-between">
        <div className="visible md:hidden relative w-full overflow-y-hidden pb-3">
          <hr></hr>
          <br></br>
          <div className="items-center justify-center">
            <img
              alt="ME!"
              className="mx-auto rounded-full items-center justify-center"
              src={`https://github.com/${pageProps.githubUsername}.png`}
            />
          </div>
          <br></br>
          <hr></hr>
        </div>
        
        <div className="flex-1 flex-col max-w-full md:w-3/5 items-center overflow-y-hidden pb-4 md:pr-7">
          <Markdown 
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            parserOptions={{ commonmark: true }}
            className="prose dark:prose-invert whitespace-no-wrap max-w-full"
          >
            {markdownText}
          </Markdown>
        </div>

        <div className="hidden md:block relative md:h-screen md:w-2/5 w-full overflow-y-hidden">
          <div className="items-center justify-center max-h-[80%] md:w-3/10 md:pr-7 md:fixed">
            <img
              alt="ME!"
              className="mx-auto rounded-full items-center justify-center"
              src={`https://github.com/${pageProps.githubUsername}.png`}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const homepage = () => <Homepage githubUsername={"adamsuk"}></Homepage>;

export default homepage
