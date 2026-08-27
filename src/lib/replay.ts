/**
 * The unit's most recently published operation replay, from Billet.
 *
 * Publishing is decided in Billet, per recording. Nothing here can make a
 * replay public, and an absent one is the normal state rather than an error,
 * so every consumer renders around null instead of failing.
 */

import { billet } from "@/lib/config";

export type LatestReplay = {
  id: string;
  title: string;
  world: string | null;
  startedAt: string;
  durationSeconds: number;
  participants: number | null;
};

// Matches the roster's ISR window. A replay changes at most weekly, but there
// is no reason for it to be fresher than the rest of the Billet-backed pages.
const REVALIDATE_SECONDS = 300;

export async function getLatestReplay(): Promise<LatestReplay | null> {
  try {
    const res = await fetch(
      `${billet.base}/api/v1/units/${billet.slug}/replays/latest`,
      { next: { revalidate: REVALIDATE_SECONDS } },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { replay: LatestReplay | null };
    return data.replay ?? null;
  } catch {
    return null;
  }
}

/** The framable player for that replay, served by Billet. */
export function replayEmbedUrl(): string {
  return `${billet.base}/embed/replay/${billet.slug}`;
}

/** "3h 0m" — replays run long, so hours read better than raw minutes. */
export function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.round((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
