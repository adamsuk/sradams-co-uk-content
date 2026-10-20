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
import { fallbackPicture, useActivitySources } from '../components/ActivitySource';
import SourceCard from '../components/SourceCard';
import MarkdownImg from '../components/MarkdownImg';
import ProfilePhoto from '../components/ProfilePhoto';

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
  const sources = useActivitySources();
  const [sourceIndex, setSourceIndex] = useState(0);
  const activeSource = sources?.[sourceIndex] ?? null;
  const showMetrics = Boolean(activeSource);
  // The metrics view stays open across cycles: someone who opened it is comparing weeks
  // across sources. Cycling is only ever a click on the photo, so nothing moves on its own.
  const [metricsOpen, setMetricsOpen] = useState(false);
  const cycleSource = () => {
    if (!sources || sources.length < 2) return;
    setSourceIndex((index) => (index + 1) % sources.length);
  };

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
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 pb-4 pt-4">
        {previewMode && <div>{previewBanner}</div>}
        <div className="flex flex-col gap-6 lg:landscape:grid lg:landscape:grid-cols-[minmax(16rem,22rem)_minmax(0,1fr)] lg:landscape:items-start lg:landscape:gap-x-4">
          <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6 lg:landscape:max-w-[22rem] lg:landscape:flex-col lg:landscape:gap-4">
            {githubProfile && (
              <div className="mx-auto w-full max-w-[16rem] shrink-0 sm:mx-[0px] sm:w-[14rem] md:w-[16rem] lg:landscape:w-full lg:landscape:max-w-[22rem]">
                <ProfilePhoto
                  login={activeSource ? undefined : githubProfile}
                  src={activeSource?.profilePicture || undefined}
                  label={activeSource?.label}
                  fallbackSrc={fallbackPicture(sources, githubProfile)}
                  onCycle={sources && sources.length > 1 ? cycleSource : undefined}
                />
              </div>
            )}
            {showMetrics && (
              <SourceCard
                source={activeSource}
                showMetrics={metricsOpen}
                onToggle={() => setMetricsOpen((open) => !open)}
                className="min-w-0 sm:max-w-[500px] sm:flex-1 lg:landscape:max-w-none"
              />
            )}
          </div>
          <div className="flex min-w-0 flex-col gap-4">
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
          </div>
        </div>
        {previewMode && <div>{previewBanner}</div>}
      </div>
    </div>
  );
}

export default Homepage;
