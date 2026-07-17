import { billet, billetImage } from "@/lib/config";

/**
 * Typed client for Billet's public v1 API (read-only, unauthenticated).
 * Error contract: 403 = roster visibility off, 404 = unknown unit.
 * Any non-200 -> return null; callers render a static "view on Billet" link
 * instead of a broken UI.
 */

export type BilletMember = {
  name: string;
  rankAbbr: string | null;
  rankInsigniaUrl: string | null;
};

export type BilletSlot = {
  title: string;
  callsign: string | null;
  vacant: boolean;
  closed: boolean;
  filled: boolean;
  member: BilletMember | null;
};

export type BilletElement = {
  id: string;
  name: string;
  callsign: string | null;
  filled: number;
  total: number;
  billets: BilletSlot[];
  children: BilletElement[];
};

export type RosterResponse = {
  unit: {
    slug: string;
    name: string;
    tag: string | null;
    crestUrl: string | null;
    strength: number;
    visibility: "structure" | "full";
  };
  elements: BilletElement[];
};

export type StatsResponse = {
  unit: {
    slug: string;
    name: string;
    tag: string | null;
    crestUrl: string | null;
  };
  strength: number;
  opsConducted: number;
  lastOpAt: string | null;
  establishedAt: string;
};

// The API sets s-maxage=300; match it with ISR so the roster is at most 5 min stale.
const REVALIDATE_SECONDS = 300;

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

export async function getRoster(): Promise<RosterResponse | null> {
  const data = await fetchJson<RosterResponse>(billet.rosterApi);
  if (!data) return null;
  // Billet reports image URLs with an internal host; rewrite to the public base.
  return {
    ...data,
    unit: { ...data.unit, crestUrl: billetImage(data.unit.crestUrl) },
    elements: data.elements.map(rewriteElementImages),
  };
}

function rewriteElementImages(el: BilletElement): BilletElement {
  return {
    ...el,
    billets: el.billets.map((b) => ({
      ...b,
      member: b.member
        ? { ...b.member, rankInsigniaUrl: billetImage(b.member.rankInsigniaUrl) }
        : null,
    })),
    children: el.children.map(rewriteElementImages),
  };
}

export async function getStats(): Promise<StatsResponse | null> {
  const data = await fetchJson<StatsResponse>(billet.statsApi);
  if (!data) return null;
  return {
    ...data,
    unit: { ...data.unit, crestUrl: billetImage(data.unit.crestUrl) },
  };
}

/** Count open (vacant, not deliberately closed) billets across the tree. */
export function countOpenBillets(elements: BilletElement[]): number {
  let n = 0;
  for (const el of elements) {
    n += el.billets.filter((b) => b.vacant && !b.closed).length;
    n += countOpenBillets(el.children);
  }
  return n;
}
