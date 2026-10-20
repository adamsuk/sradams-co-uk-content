import React, { useId } from 'react';

import { ActivitySource, SourceMetrics } from './ActivitySource';
import { FeaturedBody, cardShell, featuredHeading } from './FeaturedItem';

interface SourceCardProps {
  source: ActivitySource | null;
  /** Whether the metrics are showing. Owned by the page so it carries across cycles. */
  showMetrics: boolean;
  onToggle: () => void;
  className?: string;
}

function Chevron({ back }: { back: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 shrink-0">
      <path
        d={back ? 'M13 5l-6 5 6 5' : 'M7 5l6 5-6 5'}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * One card for the cycled source: the featured item first, with a button that swaps the
 * body to this week's metrics and back. A source with no featured item shows its metrics.
 */
function SourceCard({
  source, showMetrics, onToggle, className = '',
}: SourceCardProps) {
  const panelId = useId();
  if (!source) return null;
  const { featured } = source;
  const metrics = showMetrics || !featured;
  const heading = metrics || !featured
    ? `${source.label} · This week`
    : featuredHeading(featured, source.label);

  return (
    <section aria-label={heading} className={`${cardShell} ${className}`} data-testid="source-card">
      <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
        {heading}
      </p>
      <div id={panelId} className="mt-3">
        {metrics
          ? <SourceMetrics source={source} hideLabel />
          : <FeaturedBody featured={featured} sourceId={source.id} />}
      </div>
      {featured && (
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={metrics}
          aria-controls={panelId}
          className="mt-3 inline-flex items-center gap-1 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-500 dark:text-gray-400 dark:hover:text-gray-100"
        >
          {metrics ? <Chevron back /> : null}
          {metrics ? 'Back' : 'This week\'s metrics'}
          {metrics ? null : <Chevron back={false} />}
        </button>
      )}
    </section>
  );
}

export default SourceCard;
