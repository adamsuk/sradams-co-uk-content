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

function Visual({ featured, stacked }: { featured: Featured; stacked: boolean }) {
  // The site's spacing scale is custom, so sizes are explicit.
  const frame = `flex shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800 ${stacked ? 'w-full' : 'w-[6rem]'}`;
  if (featured.route) {
    return (
      <div className={`${frame} ${stacked ? 'aspect-square p-2' : 'h-[6rem] p-1'} text-orange-600 dark:text-orange-400`} data-testid="featured-route">
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
          className={`block h-auto w-full object-contain ${stacked ? 'max-h-[20rem]' : 'max-h-[9rem]'}`}
        />
      </div>
    );
  }
  return null;
}

const shell = 'block w-full rounded-2xl border border-gray-200 bg-gray-50 text-left text-gray-800 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-100';

const HIDE_SUBTITLE = new Set(['intervals']);

/** The cycled source's featured card. Renders nothing when the source has none. */
interface FeaturedItemProps {
  featured: Featured | null | undefined;
  source?: string;
  /** Feed id of the source, for example "intervals". */
  sourceId?: string;
  /** Picture above the text, for the narrow desktop sidebar. */
  stacked?: boolean;
  className?: string;
}

function FeaturedItem({
  featured, source, sourceId, stacked = false, className = '',
}: FeaturedItemProps) {
  if (!featured) return null;
  const title = featured.heading || 'Featured';
  // "Currently reading · Reading" says it twice, so the source label only adds new words.
  const repeats = source && title.toLowerCase().includes(source.toLowerCase().replace(/s$/, ''));
  const heading = source && !repeats ? `${title} · ${source}` : title;
  // Kept minimal: the visual and its title line. Dates, distances, plays and the top
  // track are already in "This week's metrics". An activity's subtitle is that kind of line.
  const showSubtitle = Boolean(featured.subtitle) && !HIDE_SUBTITLE.has(sourceId ?? '');
  return (
    <section aria-label={heading} className={`${shell} shadow-sm ${stacked ? 'p-4' : 'p-5'} ${className}`} data-testid="featured-item">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {heading}
      </p>
      <div className={`mt-3 flex gap-3 ${stacked ? 'flex-col' : 'items-start'}`}>
        <Visual featured={featured} stacked={stacked} />
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
    </section>
  );
}

export default FeaturedItem;
