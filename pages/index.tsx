import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import env from '../default-env';
import Loader from '../components/Loader';
import LatestPost, { useLatestPost } from '../components/LatestPost';
import GithubWeek from '../components/GithubWeek';
import MarkdownImg from '../components/MarkdownImg';
import ProfilePhoto from '../components/ProfilePhoto';
import RecentActivity from '../components/RecentActivity';

interface HomepageProps {
  className?: string;
}

/** The personal introduction, without the badge catalogues that follow it. */
export function profileIntro(markdown: string): string {
  const marker = markdown.search(/\n#{2,3} /);
  if (marker === -1) return markdown.trim();
  return markdown.slice(0, marker).trim();
}

function Homepage({ className = '' }: HomepageProps) {
  const router = useRouter();
  const [markdownText, setMarkdownText] = useState('');
  const [githubProfile, setGithubProfile] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [renderReady, setRenderReady] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);
  const latestPost = useLatestPost();

  const isPreview = useCallback(() => {
    if (router.query.githubProfile) {
      setPreviewMode(true);
    } else {
      setPreviewMode(false);
    }
  }, [router.query.githubProfile]);

  useEffect(() => {
    if (!router.isReady) {
      setRenderReady(false);
      return;
    }
    setGithubProfile(
      (router.query.githubProfile as string) || env.NEXT_PUBLIC_GITHUB_PROFILE,
    );
    isPreview();
  }, [router, isPreview]);

  useEffect(() => {
    if (!githubProfile) return undefined;
    const inTest = typeof navigator !== 'undefined' && /jsdom/i.test(navigator.userAgent);
    if (inTest) {
      setPhotoReady(true);
      return undefined;
    }
    setPhotoReady(false);
    const image = new Image();
    const ready = () => setPhotoReady(true);
    image.onload = ready;
    image.onerror = ready;
    image.src = `https://github.com/${githubProfile}.png`;
    return undefined;
  }, [githubProfile]);

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

  if (!githubProfile || !renderReady || !photoReady || latestPost === undefined) return <Loader />;

  return (
    <div className={className}>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-8 pt-4">
        {previewMode && <div>{previewBanner}</div>}
        <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
          <div className="mx-auto w-full max-w-[16rem] sm:mx-0 sm:w-64 sm:shrink-0">
            {githubProfile && <ProfilePhoto login={githubProfile} />}
          </div>
          <details className="group relative min-w-[12rem] flex-1">
            <summary
              className="flex cursor-pointer list-none items-center gap-2 text-sm font-medium marker:hidden [&::-webkit-details-marker]:hidden"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="h-4 w-4 shrink-0 text-gray-500 transition-transform group-open:rotate-90 dark:text-gray-400"
              >
                <path
                  d="M7 5l6 5-6 5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {'This week\'s metrics'}
            </summary>
            <div
              className="absolute left-0 right-0 top-full z-10 mt-2 max-h-80 space-y-4 overflow-auto bg-white dark:bg-gray-950"
            >
              <RecentActivity plain />
              <GithubWeek plain />
            </div>
          </details>
        </div>
        <section
          aria-label="Profile"
          className="rounded-2xl border border-gray-200 bg-gray-50 p-5 dark:border-gray-700 dark:bg-gray-900/40"
        >
          {renderReady ? (
            <Markdown
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              rehypePlugins={[rehypeRaw, rehypeSanitize] as any}
              remarkPlugins={[remarkGfm]}
              className="prose dark:prose-invert max-w-none prose-headings:mb-2 prose-headings:mt-0 prose-p:my-2 prose-ul:my-2"
              components={{
                img: MarkdownImg,
              }}
            >
              {profileIntro(markdownText)}
            </Markdown>
          ) : (
            <div className="animate-pulse space-y-3" data-testid="intro-skeleton" aria-hidden="true">
              <div className="h-8 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-full rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-11/12 rounded bg-gray-200 dark:bg-gray-700" />
              <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
            </div>
          )}
        </section>
        <LatestPost post={latestPost} />
        {previewMode && <div>{previewBanner}</div>}
      </div>
    </div>
  );
}

export default Homepage;
