"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Click-to-play video card: renders as a lightweight thumbnail until clicked,
 * then swaps in a YouTube iframe (privacy-enhanced domain) that autoplays —
 * the viewer never leaves the site. The click is the user gesture, so
 * autoplay with sound is permitted.
 */
export function VideoCard({
  id,
  title,
  chip,
  thumbQuality = "hqdefault",
  sizes,
  priority = false,
}: {
  id: string;
  title: string;
  chip?: string;
  thumbQuality?: "maxresdefault" | "hqdefault";
  sizes: string;
  priority?: boolean;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="overflow-hidden rounded-sm border border-edge bg-surface">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="aspect-video w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play: ${title}`}
          className="group relative block w-full cursor-pointer"
        >
          <Image
            src={`https://i.ytimg.com/vi/${id}/${thumbQuality}.jpg`}
            alt=""
            width={thumbQuality === "maxresdefault" ? 1280 : 480}
            height={thumbQuality === "maxresdefault" ? 720 : 360}
            sizes={sizes}
            priority={priority}
            className="aspect-video w-full object-cover"
          />
          <span
            aria-hidden
            className="absolute inset-0 grid place-items-center bg-bg/25 transition-colors group-hover:bg-bg/10"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full border border-edge-bright bg-bg/80 pl-1 font-display text-xl text-ink">
              ▶
            </span>
          </span>
        </button>
      )}
      <div className="flex items-center justify-between gap-3 border-t border-edge px-4 py-2.5">
        <span className="font-display text-sm font-semibold text-ink">{title}</span>
        {chip ? <span className="micro-label shrink-0">{chip}</span> : null}
      </div>
    </div>
  );
}
