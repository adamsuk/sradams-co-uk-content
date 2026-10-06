import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';

import axios from 'axios';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

import env from '../default-env';
import HomeStats from '../components/HomeStats';
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
    } else {
      setGithubProfile(
        (router.query.githubProfile as string) || env.NEXT_PUBLIC_GITHUB_PROFILE,
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

  if (!githubProfile) return <Loader />;

  return (
    <div className={`${className} flex flex-1 flex-col`}>
      <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 pb-6 pt-4">
        {previewMode && <div className="pb-4">{previewBanner}</div>}
        <div className="flex flex-col md:grid md:grid-cols-[11rem_minmax(0,1fr)] md:items-center md:gap-8 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <div className="order-1 mx-auto w-full max-w-[400px] md:max-w-none">
            {githubProfile && <ProfilePhoto login={githubProfile} />}
          </div>
          <div className="order-2 md:hidden">
            <HomeStats />
            <LatestPost post={latestPost} />
          </div>
          <section
            aria-label="Profile"
            className="order-3 mt-6 rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 dark:border-gray-700 dark:bg-gray-900/40 md:order-2 md:mt-0 md:border-0 md:bg-transparent md:p-0 dark:md:bg-transparent"
          >
            {renderReady ? (
              <Markdown
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rehypePlugins={[rehypeRaw, rehypeSanitize] as any}
                remarkPlugins={[remarkGfm]}
                className="prose dark:prose-invert max-w-none"
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
        </div>
        <div className="home-board mt-6 hidden gap-4">
          <div className="home-activity h-full">
            <RecentActivity />
          </div>
          <GithubWeek />
          <LatestPost post={latestPost} />
        </div>
        {previewMode && <div className="pt-4">{previewBanner}</div>}
      </div>
    </div>
  );
}

export default Homepage;
