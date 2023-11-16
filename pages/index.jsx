import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

import axios from 'axios';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import env from '../default-env';
import Loader from '../components/Loader';

function Homepage({ className }) {
  const router = useRouter();
  const [markdownText, setMarkdownText] = useState('');
  const [githubProfile, setGithubProfile] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [renderReady, setRenderReady] = useState(false);

  const isPreview = () => (
    router.query.githubProfile ? setPreviewMode(true) : setPreviewMode(false)
  );

  useEffect(() => {
    if (!router.isReady) {
      setRenderReady(false);
    } else {
      setGithubProfile(
        router.query.githubProfile || env.NEXT_PUBLIC_GITHUB_PROFILE,
      );
      isPreview();
    }
  }, [router, isPreview]);

  const fetchGithubProfile = (branch = 'main') => axios(
    `https://raw.githubusercontent.com/${githubProfile}/${githubProfile}/${branch}/README.md`,
  );

  useEffect(() => {
    setRenderReady(false);
    async function fetchData() {
      try {
        await fetchGithubProfile().then((res) => {
          setMarkdownText(res.data);
          setRenderReady(true);
        });
      } catch (error) {
        try {
          // try master
          await fetchGithubProfile('master').then((res) => {
            setMarkdownText(res.data);
            setRenderReady(true);
          });
        } catch (e) {
          router.push('/404');
        }
      }
    }
    if (githubProfile) {
      fetchData();
    }
  }, [githubProfile]);

  const previewBanner = (
    <div className="w-full bg-slate-500 dark:bg-white text-white dark:text-black text-center text-base sm:text-xl md:text-2xl py-1 md:py-3">
      PREVIEW MODE - GitHub Profile:
      {' '}
      {githubProfile}
    </div>
  );

  if (!renderReady) return <Loader />;

  return (
    <div className={className}>
      <div className="flex flex-col pt-7 pb-2 h-full justify-between">
        {previewMode && <div className="pb-4">{previewBanner}</div>}
        <div className="relative container px-4 sm:px-7 mb-auto flex flex-wrap flex-col md:flex-row md:px-0 w-full max-w-7xl mx-auto justify-between">
          <div className="visible md:hidden relative w-full overflow-y-hidden">
            <hr />
            <br />
            <div className="flex flex-col items-center justify-center mx-auto w-auto h-auto max-w-[400px] max-h-[400px]">
              {githubProfile && (
                <img
                  alt="ME!"
                  className="mx-auto rounded-full items-center justify-center w-full h-full"
                  src={`https://github.com/${githubProfile}.png`}
                />
              )}
            </div>
            <br />
            <hr />
          </div>

          <div className="flex-1 flex-col max-w-full md:w-3/5 items-center overflow-y-hidden md:pr-7">
            <Markdown
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
              remarkPlugins={[remarkGfm]}
              parserOptions={{ commonmark: true }}
              className="prose dark:prose-invert whitespace-no-wrap max-w-full"
            >
              {markdownText}
            </Markdown>
          </div>

          <div className="hidden md:block relative md:w-2/5 w-full overflow-y-hidden">
            <div className="items-center justify-center max-h-[80%] md:w-3/10 md:pr-7 md:fixed">
              {githubProfile && (
                <img
                  alt="ME!"
                  className="mx-auto rounded-full items-center justify-center"
                  src={`https://github.com/${githubProfile}.png`}
                />
              )}
            </div>
          </div>
        </div>
        {previewMode && <div className="pt-4">{previewBanner}</div>}
      </div>
    </div>
  );
}

Homepage.defaultProps = {
  className: '',
};

Homepage.propTypes = {
  className: PropTypes.string,
};

export default Homepage;
