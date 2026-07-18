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
  patchUrl: string | null;
  /**
   * Reporting line. Billet keeps this even for elements that are NOT nested
   * in the ORBAT tree — top-level siblings can still point at their parent.
   */
  reportsToElementId: string | null;
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
  /** Operations in the trailing 30 days. */
  ops30d: number;
  lastOpAt: string | null;
  establishedAt: string;
  recruitingOpen: boolean;
  discordInviteUrl: string | null;
  /** Unit-configured facts (Billet Settings); all nullable until filled. */
  keyFacts: {
    opSchedule: string | null;
    region: string | null;
    realismLevel: string | null;
    ageRequirement: string | null;
  };
};

export type BilletRank = {
  id: string;
  name: string;
  abbr: string | null;
  insigniaUrl: string | null;
  order: number;
  requirements: {
    timeInGradeDays?: number;
    pointsRequired?: number;
    qualifications?: string[];
  } | null;
};

export type RanksResponse = {
  unit: StatsResponse["unit"];
  tracks: { name: string; ranks: BilletRank[] }[];
};

export type BilletAward = {
  id: string;
  name: string;
  abbr: string | null;
  imageUrl: string | null;
  description: string | null;
};

export type AwardsResponse = {
  unit: StatsResponse["unit"];
  awards: BilletAward[];
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
    patchUrl: billetImage(el.patchUrl),
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

export async function getRanks(): Promise<RanksResponse | null> {
  const data = await fetchJson<RanksResponse>(
    `${billet.base}/api/v1/units/${billet.slug}/ranks`,
  );
  if (!data) return null;
  return {
    ...data,
    tracks: data.tracks.map((t) => ({
      ...t,
      ranks: t.ranks.map((r) => ({
        ...r,
        insigniaUrl: billetImage(r.insigniaUrl),
      })),
    })),
  };
}

export async function getAwards(): Promise<AwardsResponse | null> {
  const data = await fetchJson<AwardsResponse>(
    `${billet.base}/api/v1/units/${billet.slug}/awards`,
  );
  if (!data) return null;
  return {
    ...data,
    awards: data.awards.map((a) => ({
      ...a,
      imageUrl: billetImage(a.imageUrl),
    })),
  };
}

/**
 * Re-parent top-level elements along their reporting lines.
 *
 * The API's `children` nesting only captures elements nested in Billet's
 * ORBAT tree; `reportsToElementId` carries the reporting line even for
 * top-level siblings. This merges the two: any root whose reportsToElementId
 * resolves to another element is adopted as that element's child, and the
 * adopted subtree's counts roll up into every ancestor so a parent box
 * reflects its whole command (the API's filled/total only cover nested
 * descendants).
 */
export function buildReportingTree(roots: BilletElement[]): BilletElement[] {
  const clone = (el: BilletElement): BilletElement => ({
    ...el,
    billets: [...el.billets],
    children: el.children.map(clone),
  });
  const forest = roots.map(clone);

  const byId = new Map<string, BilletElement>();
  const parentOf = new Map<string, BilletElement>();
  const index = (el: BilletElement, parent: BilletElement | null) => {
    byId.set(el.id, el);
    if (parent) parentOf.set(el.id, parent);
    el.children.forEach((c) => index(c, el));
  };
  forest.forEach((r) => index(r, null));

  // Snapshot API counts before any mutation so roll-ups are order-independent
  // (an adopted parent must contribute its own API counts, not inflated ones).
  const apiCounts = new Map<string, { filled: number; total: number }>();
  for (const [id, el] of byId) {
    apiCounts.set(id, { filled: el.filled, total: el.total });
  }

  const remaining: BilletElement[] = [];
  const adoptedRoots: BilletElement[] = [];
  for (const root of forest) {
    const target = root.reportsToElementId
      ? byId.get(root.reportsToElementId)
      : undefined;
    if (target && target !== root) {
      target.children.push(root);
      parentOf.set(root.id, target);
      adoptedRoots.push(root);
    } else {
      remaining.push(root);
    }
  }

  // Roll each adopted subtree's API counts into its (new) ancestors.
  for (const root of adoptedRoots) {
    const counts = apiCounts.get(root.id)!;
    let ancestor = parentOf.get(root.id);
    let hops = 0;
    while (ancestor && hops < 100) {
      ancestor.filled += counts.filled;
      ancestor.total += counts.total;
      ancestor = parentOf.get(ancestor.id);
      hops += 1; // cycle guard — malformed data must not hang the build
    }
  }

  return remaining;
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
