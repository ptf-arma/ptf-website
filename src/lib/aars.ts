/**
 * After-action reports, served from Billet.
 *
 * The endpoints this expects are specified in docs/aar-api-contract.md and do
 * NOT exist yet — Billet returns 404 for /aars today. Everything here is
 * written against that contract and falls back to an empty list until it
 * ships, so the pages render (empty) rather than erroring in the meantime.
 *
 * Set AAR_FIXTURES=1 locally to render sample data without a live endpoint.
 */

import { billet } from "@/lib/config";
import { fixtureAars } from "@/lib/aars.fixtures";

export type AarBodyFormat = "markdown" | "html" | "text";

/** Card-level fields — everything the list endpoint returns. */
export type AarSummary = {
  slug: string;
  title: string;
  operation_date: string;
  published_at: string;
  updated_at: string;
  terrain?: string | null;
  operation_type?: string | null;
  summary: string;
  participants?: number | null;
  image?: string | null;
  author?: { name: string; rank?: string | null } | null;
};

/** A single AAR, with the prose. */
export type Aar = AarSummary & {
  body_format: AarBodyFormat;
  body: string;
};

type AarListResponse = {
  pagination?: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
  aars: AarSummary[];
};

// Match the roster's ISR window; AARs change far less often but there's no
// reason for them to be fresher than the rest of the Billet-backed pages.
const REVALIDATE_SECONDS = 300;

const useFixtures = process.env.AAR_FIXTURES === "1";

async function fetchJson<T>(url: string): Promise<T | null> {
  try {
    const res = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** Newest first. Empty array when the endpoint is absent or the unit has none. */
export async function getAars(limit = 50): Promise<AarSummary[]> {
  if (useFixtures) return fixtureAars.slice(0, limit);
  const data = await fetchJson<AarListResponse>(
    `${billet.base}/api/v1/units/${billet.slug}/aars?per_page=${limit}`,
  );
  if (!data?.aars?.length) return [];
  return [...data.aars].sort((a, b) =>
    b.operation_date.localeCompare(a.operation_date),
  );
}

/** Null when the slug is unknown, unpublished, or the endpoint is absent. */
export async function getAar(slug: string): Promise<Aar | null> {
  if (useFixtures) return fixtureAars.find((a) => a.slug === slug) ?? null;
  return fetchJson<Aar>(
    `${billet.base}/api/v1/units/${billet.slug}/aars/${encodeURIComponent(slug)}`,
  );
}

/** e.g. "23 August 2026" — matches how dates read elsewhere on the site. */
export function formatOperationDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
