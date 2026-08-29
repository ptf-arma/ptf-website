/**
 * The unit's most recently published operation replay, from Billet.
 *
 * Publishing is decided in Billet, per recording. Nothing here can make a
 * replay public, and an absent one is the normal state rather than an error,
 * so every consumer renders around null instead of failing.
 */

import { billet } from "@/lib/config";
import WORLD_LABELS from "@/lib/world-labels.json";

/**
 * Operations run Sunday 8PM Eastern, which is already Monday in UTC — the
 * 24 August recording is Sunday the 23rd to everyone who was on it. Dates are
 * therefore read in the unit's zone, not the server's and not UTC.
 */
const UNIT_TZ = "America/New_York";

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

/**
 * "3h" / "2h 45m" / "40m". Replays run long, so hours read better than raw
 * minutes. Rounds to whole minutes first and carries the hour, since rounding
 * each part separately renders 10776s as "2h 60m".
 */
export function formatDuration(seconds: number): string {
  const totalMinutes = Math.round(seconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  if (h === 0) return `${m}m`;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** "23 August 2026" from an ISO timestamp, in the unit's timezone. */
export function formatOperationDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: UNIT_TZ,
  });
}

/*
 * Billet reports the terrain by its Arma class name, lowercase: "islapera",
 * "enoch". Title-casing alone gets "Islapera" and "Enoch", so the terrains the
 * unit actually plays are named in world-labels.json. Anything unlisted falls
 * back to title-case, which is right for single-word maps and no worse than
 * the raw id for the rest. The table is JSON because the asset renderer needs
 * the same labels and cannot import TypeScript.
 */
const LABELS: Record<string, string> = WORLD_LABELS;

export function formatWorld(world: string | null): string | null {
  if (!world) return null;
  const key = world.trim().toLowerCase();
  if (LABELS[key]) return LABELS[key];
  return key
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
