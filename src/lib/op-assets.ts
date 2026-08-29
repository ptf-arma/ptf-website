/**
 * The pre-rendered share assets for the latest operation.
 *
 * `scripts/op-assets/render.mjs` draws these from Billet's frame and terrain
 * data and writes them into public/operations, along with the manifest read
 * here. Nothing at request time touches Billet's frames — that is 50MB and a
 * headless browser, which is why this is a committed artifact rather than a
 * route.
 *
 * The manifest names the replay it was built from. If Billet has since
 * published a newer one and nobody has re-run the script, the assets are stale
 * and every accessor below returns null rather than describing last month's
 * operation as this week's. Callers fall back to the generated typographic
 * card, which is always current because it carries no map.
 */

import manifestJson from "../../public/operations/manifest.json";

export type OpAssets = {
  /** Billet replay id these assets were rendered from. */
  id: string;
  title: string;
  world: string | null;
  /** Already formatted for display, in the unit's timezone. */
  date: string;
  startedAt: string;
  durationSeconds: number;
  participants: number | null;
  /** Site-absolute paths under /operations. */
  card: string;
  gif: string;
  cardBytes: number;
  gifBytes: number;
  gifSeconds: number;
  gifWidth: number;
  gifHeight: number;
  generatedAt: string;
};

// The cast is deliberate: the JSON is generated, and a checked-in placeholder
// with null fields would otherwise narrow these types to null at build time.
const manifest = manifestJson as unknown as Partial<OpAssets>;

function isComplete(m: Partial<OpAssets>): m is OpAssets {
  return Boolean(m.id && m.card && m.gif && m.title);
}

/**
 * Assets for `replayId`, or null if they were never built or are for an
 * older replay.
 */
export function getOpAssets(replayId: string | null | undefined): OpAssets | null {
  if (!replayId) return null;
  if (!isComplete(manifest)) return null;
  return manifest.id === replayId ? manifest : null;
}

/** True when assets exist but describe a replay Billet has since superseded. */
export function opAssetsAreStale(replayId: string | null | undefined): boolean {
  return Boolean(replayId && isComplete(manifest) && manifest.id !== replayId);
}

/** "4.8 MB" — for telling a recruiter what they are about to download. */
export function formatBytes(bytes: number): string {
  return bytes >= 1048576
    ? `${(bytes / 1048576).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}
