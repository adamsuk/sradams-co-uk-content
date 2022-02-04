import React, { useState, useEffect } from "react";
import axios from 'axios';
import Markdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import rehypeSanitize from 'rehype-sanitize'

const Homepage = (props) => {
  const [markdownText, setMarkdownText] = useState("");
  const [githubProfileType, setGithubProfileType] = useState(Object.keys(props.githubUsernames)[0]);
  const [githubProfile, setGithubProfile] = useState(props.githubUsernames[githubProfileType]);

  useEffect(() => {
    async function fetchData() {
      const data = await axios(
        `https://raw.githubusercontent.com/${githubProfile}/${githubProfile}/main/README.md`,
      ).then((res) => setMarkdownText(res.data));
    }
    fetchData();
  }, [githubProfile]);

  const switchGithubProfile = () => {
    const totalProfiles = Object.keys(props.githubUsernames).length;
    const currentProfileIndex = Object.values(props.githubUsernames).indexOf(githubProfile);
    if (currentProfileIndex === totalProfiles - 1) {
      setGithubProfileType(Object.keys(props.githubUsernames)[0]);
      setGithubProfile(Object.values(props.githubUsernames)[0]);
    } else {
      setGithubProfileType(Object.keys(props.githubUsernames)[currentProfileIndex + 1]);
      setGithubProfile(Object.values(props.githubUsernames)[currentProfileIndex + 1]);
    }
    console.log(githubProfileType)
  }

  return (
    <>
      <div className="relative container px-7 pt-7 mb-auto flex flex-wrap flex-col md:flex-row md:px-0 w-full max-w-7xl mx-auto justify-between">
        <div className="visible md:hidden relative w-full overflow-y-hidden pb-3">
          <hr></hr>
          <br></br>
          <div
            className="flex flex-col items-center justify-center mx-auto w-auto h-auto max-w-[400px] max-h-[400px]"
            onClick={switchGithubProfile}
          >
            <img
              alt="ME!"
              className="mx-auto rounded-full items-center justify-center w-full h-full"
              src={`https://github.com/${githubProfile}.png`}
            />
            <div className="flex-1 absolute">
              <div className="w-full h-full z-10 rotate-[315deg] text-center text-2xl xs:text-4xl sm:text-6xl font-semibold">{githubProfileType}</div>
            </div>
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

        <div className="hidden md:block relative md:w-2/5 w-full overflow-y-hidden">
          <div className="items-center justify-center max-h-[80%] md:w-3/10 md:pr-7 md:fixed">
            <img
              alt="ME!"
              className="mx-auto rounded-full items-center justify-center"
              src={`https://github.com/${githubProfile}.png`}
              onClick={switchGithubProfile}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Homepage;
