import React from 'react';

export interface FeaturedRoute {
  width: number;
  height: number;
  points: Array<[number, number]>;
}

export interface Featured {
  heading: string;
  title: string;
  subtitle: string;
  description: string;
  url: string;
  image: string;
  details: string[];
  route?: FeaturedRoute;
  link?: { label: string; detail: string; url: string };
  video?: { youtubeId: string; title: string };
}

function clean(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.replace(/\s+/g, ' ').trim().slice(0, max);
}

function https(value: unknown): string {
  if (typeof value !== 'string') return '';
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

function routeFrom(value: unknown): FeaturedRoute | undefined {
  if (!value || typeof value !== 'object') return undefined;
  const row = value as Record<string, unknown>;
  const width = Number(row.width);
  const height = Number(row.height);
  if (!(width > 0 && width <= 1000 && height > 0 && height <= 1000)) return undefined;
  if (!Array.isArray(row.points)) return undefined;
  const points = row.points.flatMap((point): Array<[number, number]> => {
    if (!Array.isArray(point) || point.length !== 2) return [];
    const [x, y] = point.map(Number);
    if (!Number.isFinite(x) || !Number.isFinite(y)) return [];
    return [[Math.min(Math.max(x, 0), width), Math.min(Math.max(y, 0), height)]];
  }).slice(0, 300);
  return points.length >= 2 ? { width, height, points } : undefined;
}

/** Re-checks the feed's optional card. Anything unexpected is dropped, never rendered. */
export function featuredFromFeed(value: unknown): Featured | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const row = value as Record<string, unknown>;
  const title = clean(row.title, 160);
  if (!title) return null;
  const featured: Featured = {
    heading: clean(row.heading, 40),
    title,
    subtitle: clean(row.subtitle, 160),
    description: clean(row.description, 280),
    url: https(row.url),
    image: https(row.image),
    details: Array.isArray(row.details)
      ? row.details.map((detail) => clean(detail, 60)).filter(Boolean).slice(0, 4)
      : [],
  };
  const route = routeFrom(row.route);
  if (route) featured.route = route;
  if (row.link && typeof row.link === 'object') {
    const link = row.link as Record<string, unknown>;
    const label = clean(link.label, 160);
    if (label) featured.link = { label, detail: clean(link.detail, 120), url: https(link.url) };
  }
  if (row.video && typeof row.video === 'object') {
    const video = row.video as Record<string, unknown>;
    if (typeof video.youtubeId === 'string' && /^[A-Za-z0-9_-]{11}$/.test(video.youtubeId)) {
      featured.video = { youtubeId: video.youtubeId, title: clean(video.title, 160) };
    }
  }
  return featured;
}

function RouteMap({ route, label }: { route: FeaturedRoute; label: string }) {
  const points = route.points.map(([x, y]) => `${x},${y}`).join(' ');
  const [startX, startY] = route.points[0];
  const [endX, endY] = route.points[route.points.length - 1];
  return (
    <svg
      role="img"
      aria-label={`Route of ${label}`}
      viewBox={`0 0 ${route.width} ${route.height}`}
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
    >
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={startX} cy={startY} r="4" className="fill-emerald-500" />
      <circle cx={endX} cy={endY} r="4" className="fill-rose-500" />
    </svg>
  );
}

function Visual({ featured }: { featured: Featured }) {
  // The site's spacing scale is custom, so sizes are explicit. A small square beside the
  // title on phones and tablets; full width above it in the narrow desktop sidebar.
  const frame = 'flex w-[6rem] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 lg:landscape:w-full';
  if (featured.route) {
    return (
      <div className={`${frame} h-[6rem] p-1 text-orange-600 dark:text-orange-400 lg:landscape:aspect-square lg:landscape:h-auto lg:landscape:p-2`} data-testid="featured-route">
        <RouteMap route={featured.route} label={featured.title} />
      </div>
    );
  }
  if (featured.image) {
    return (
      <div className={frame}>
        <img
          src={featured.image}
          alt={featured.title}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="block h-auto max-h-[9rem] w-full object-contain lg:landscape:max-h-[20rem]"
        />
      </div>
    );
  }
  return null;
}

const HIDE_SUBTITLE = new Set(['intervals']);

/** "Currently reading · Reading" says it twice, so the source label only adds new words. */
export function featuredHeading(featured: Featured, source?: string): string {
  const title = featured.heading || 'Featured';
  const repeats = source && title.toLowerCase().includes(source.toLowerCase().replace(/s$/, ''));
  return source && !repeats ? `${title} · ${source}` : title;
}

/**
 * The visual and its title line. Dates, distances, plays and the top track live in the
 * metrics view, and an activity's subtitle is that kind of line, so it is left out.
 */
export function FeaturedBody({ featured, sourceId }: { featured: Featured; sourceId?: string }) {
  const showSubtitle = Boolean(featured.subtitle) && !HIDE_SUBTITLE.has(sourceId ?? '');
  return (
    <>
      <div className="flex items-start gap-3 lg:landscape:flex-col">
        <Visual featured={featured} />
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            {featured.url ? (
              <a href={featured.url} className="hover:underline" rel="noopener noreferrer" target="_blank">
                {featured.title}
              </a>
            ) : featured.title}
          </h2>
          {showSubtitle && (
            <p className="mt-1 truncate text-sm text-gray-600 dark:text-gray-400">{featured.subtitle}</p>
          )}
        </div>
      </div>
      {featured.video && (
        <div className="mt-3 hidden aspect-video w-full overflow-hidden rounded-xl sm:block">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${featured.video.youtubeId}`}
            title={featured.video.title || featured.title}
            loading="lazy"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      )}
    </>
  );
}

export const cardShell = 'block w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-left text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100';

interface FeaturedItemProps {
  featured: Featured | null | undefined;
  source?: string;
  /** Feed id of the source, for example "intervals". */
  sourceId?: string;
  className?: string;
}

/** A standalone featured card. Renders nothing when the source has none. */
function FeaturedItem({
  featured, source, sourceId, className = '',
}: FeaturedItemProps) {
  if (!featured) return null;
  const heading = featuredHeading(featured, source);
  return (
    <section aria-label={heading} className={`${cardShell} ${className}`} data-testid="featured-item">
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {heading}
      </p>
      <FeaturedBody featured={featured} sourceId={sourceId} />
    </section>
  );
}

export default FeaturedItem;
