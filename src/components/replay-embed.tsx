"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/button";

/**
 * The unit's latest operation replay, embedded from Billet.
 *
 * Click to load, the same shape as video-card.tsx and for a stronger reason:
 * a two hour recording is tens of megabytes of position data, so mounting the
 * iframe on page load would cost every visitor that whether or not they ever
 * press play, and wreck the vitals of a page we want ranking.
 */
export function ReplayEmbed({
  src,
  title,
  meta,
  poster,
}: {
  src: string;
  title: string;
  meta: string;
  /**
   * The rendered share card, when one has been generated for this replay. It
   * already carries the title, the date and the map, so the text overlay is
   * dropped when it is present rather than printed on top of itself.
   */
  poster?: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="overflow-hidden rounded-sm border border-edge bg-surface">
        <iframe
          src={src}
          title={`${title} replay`}
          loading="lazy"
          className="aspect-video w-full"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-sm border border-edge bg-surface">
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group relative flex aspect-video w-full flex-col items-center justify-center gap-3 px-6 text-center transition-colors hover:bg-raised"
      >
        {poster && (
          <>
            {/* Not next/image: this is a fixed-size local asset that is already
                exactly the size it renders at, so optimisation buys nothing. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={poster}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <span
              aria-hidden
              className="absolute inset-0 bg-bg/50 transition-colors group-hover:bg-bg/35"
            />
            <span className="sr-only">
              {title}. {meta}.
            </span>
            <span className="absolute right-3 top-3 rounded-sm bg-bg/70 px-2 py-1 text-xs text-ink-faint">
              Loads on click
            </span>
          </>
        )}

        <span
          aria-hidden
          className="relative grid h-14 w-14 place-items-center rounded-full border border-edge-bright bg-bg/80 pl-1 font-display text-xl font-semibold text-ink"
        >
          ▶
        </span>

        {!poster && (
          <>
            <span className="font-display text-lg font-semibold text-ink">
              {title}
            </span>
            <span className="micro-label text-ink-muted">{meta}</span>
            <span className="text-sm text-ink-faint">
              Loads on click. It&apos;s a large recording.
            </span>
          </>
        )}
      </button>
    </div>
  );
}

/** Shown when nothing is published, so the section never renders empty. */
export function ReplayEmbedEmpty({ portalUrl }: { portalUrl: string }) {
  return (
    <div className="rounded-sm border border-edge bg-surface px-5 py-8 text-center">
      <p className="text-ink-muted">
        No replay published yet. Operations are recorded, and the most recent
        one appears here once it&apos;s released.
      </p>
      <div className="mt-4 flex justify-center">
        <ButtonLink href={portalUrl} variant="secondary" size="md">
          Personnel portal
        </ButtonLink>
      </div>
    </div>
  );
}
