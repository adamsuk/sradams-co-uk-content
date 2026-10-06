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
    <div className={className}>
      <div className="mx-auto w-full max-w-5xl px-5 pb-12 pt-8 md:px-10 md:pb-16 md:pt-14">
        {previewMode && <div className="pb-8">{previewBanner}</div>}
        <div className="flex flex-col gap-8 lg:landscape:grid lg:landscape:grid-cols-[16rem_minmax(0,1fr)] lg:landscape:items-center lg:landscape:gap-x-16">
          <div className="mx-auto w-full max-w-[16rem]">
            {githubProfile && <ProfilePhoto login={githubProfile} />}
          </div>
          <section
            aria-label="Profile"
            className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-6 dark:border-gray-700 dark:bg-gray-900/40 md:px-8 md:py-8"
          >
            {renderReady ? (
              <Markdown
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                rehypePlugins={[rehypeRaw, rehypeSanitize] as any}
                remarkPlugins={[remarkGfm]}
                className="prose dark:prose-invert max-w-none prose-headings:mt-0 prose-p:my-3"
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
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <RecentActivity />
          <GithubWeek />
          <div className="md:col-span-2">
            <LatestPost post={latestPost} />
          </div>
        </div>
        {previewMode && <div className="pt-8">{previewBanner}</div>}
      </div>
    </div>
  );
}

export default Homepage;
