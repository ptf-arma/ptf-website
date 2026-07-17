/**
 * Single source of truth for external URLs and unit config.
 *
 * BILLET_BASE and BILLET_SLUG are the only two values that change when the unit
 * moves its portal from ptf.billet.gg to a custom domain (billet.paramarines.net).
 * Never hardcode Billet URLs anywhere else — derive them from here.
 */

const stripTrailingSlash = (s: string) => s.replace(/\/+$/, "");

export const BILLET_BASE = stripTrailingSlash(
  process.env.NEXT_PUBLIC_BILLET_BASE ?? "https://ptf.billet.gg",
);

export const BILLET_SLUG = process.env.NEXT_PUBLIC_BILLET_SLUG ?? "ptf";

export const SITE_URL = stripTrailingSlash(
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://paramarines.net",
);

/** Derived Billet links + API endpoints. */
export const billet = {
  base: BILLET_BASE,
  slug: BILLET_SLUG,
  applyUrl: `${BILLET_BASE}/apply`,
  loginUrl: `${BILLET_BASE}/login`,
  rosterApi: `${BILLET_BASE}/api/v1/units/${BILLET_SLUG}/roster`,
  statsApi: `${BILLET_BASE}/api/v1/units/${BILLET_SLUG}/stats`,
} as const;

/**
 * Billet's API returns image URLs pointing at its internal/dev host
 * (e.g. https://0.0.0.0:3000/api/img/<uuid>). The image itself is served fine
 * from BILLET_BASE on the same path — so rewrite the origin to BILLET_BASE.
 * Returns null for missing/invalid URLs so callers can fall back to text.
 */
export function billetImage(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    return `${BILLET_BASE}${u.pathname}${u.search}`;
  } catch {
    return null;
  }
}

/** Off-site community links, salvaged from the old paramarines.net. */
export const links = {
  discord: "https://discord.com/invite/paramarines",
  teamspeak: "ts.Paramarines.net",
  steam: "https://steamcommunity.com/groups/ParamarineTaskForce",
  arma3units: "https://units.arma3.com/unit/paramarines",
  patreon: "https://www.patreon.com/paramarinetaskforce",
  modpack:
    "https://steamcommunity.com/sharedfiles/filedetails/?id=2314277189",
} as const;
