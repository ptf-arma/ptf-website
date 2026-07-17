# Paramarines.net — Site Builder Context

> Handoff doc for building the new **paramarines.net** website. This site is
> separate from Billet (the personnel platform); it links to and pulls live
> data from a unit's Billet portal. Written to be dropped into the new site's
> repo and handed to a fresh Claude instance. (This file currently lives in the
> Billet repo for convenience — move it to the new project.)

## What we're building

A brand-new marketing/landing site for the **Paramarines** Arma 3 milsim unit.
It replaces their old Invision Community + PERSCOM setup. The new site owns the
**public face** (landing, media/gallery, news); **Billet** owns everything
personnel (roster, ORBAT, ranks, applications, member files, events).

The two are stitched together so it feels like one product:

```
paramarines.net              ← THIS site. Landing, media, news. You build it.
   │  "Enlist"      ────────▶ https://billet.paramarines.net/apply
   │  "Member Login"────────▶ https://billet.paramarines.net/login
   │  Roster (rendered here) ← fetched from Billet's public API (below)
   │
   └── Billet portal links back here via a header link (configured in Billet).
```

**Billet base URL:** during build/dev, use the live subdomain
`https://paramarines.billet.gg` (works today). The unit also plans a custom
domain `https://billet.paramarines.net` that will serve the identical portal
later. **Treat the Billet base URL as a single config value** (e.g.
`BILLET_BASE` / `NEXT_PUBLIC_BILLET_BASE`) so swapping subdomain → custom
domain is a one-line change. Never hardcode it in multiple places. Likewise put
the unit **slug** (`paramarines`) in config — the API is slug-addressed and the
same code should work for any unit.

## The three connection points

| UI element | Destination |
|---|---|
| **Enlist / Apply** button | `${BILLET_BASE}/apply` |
| **Member Login** button | `${BILLET_BASE}/login` |
| **Roster** section | Rendered on this site from the public API ↓ |

`/apply` and `/login` are just links — no integration work, they're public
Billet pages themed in the unit's colors. The roster is the real work.

## Public API (v1) — read-only, CORS-enabled

Two endpoints. Both are **public, unauthenticated, GET-only**, send
`Access-Control-Allow-Origin: *`, and are cached (`s-maxage=300`,
`stale-while-revalidate=600`). Slug-addressed, so host doesn't matter.

### Roster / ORBAT

```
GET ${BILLET_BASE}/api/v1/units/{slug}/roster
```

Real response shape (verified):

```jsonc
{
  "unit": {
    "slug": "paramarines",
    "name": "Paramarines",
    "tag": "PMC",                    // may be null
    "crestUrl": "https://.../api/img/abc",  // absolute; may be null (fall back to text)
    "strength": 47,                  // active member count
    "visibility": "full"             // "structure" | "full" (see below)
  },
  "elements": [                      // the ORBAT tree, nested
    {
      "id": "elt_...",
      "name": "Command",
      "callsign": "HQ",              // may be null
      "filled": 2, "total": 3,       // counts across this element + descendants
      "billets": [
        {
          "title": "Commanding Officer",
          "callsign": null,
          "vacant": false,
          "closed": false,           // deliberately unmanned slot
          "filled": true,
          "member": {                // present ONLY in "full" visibility; else null
            "name": "J. Hawkins",
            "rankAbbr": "CPT",       // may be null
            "rankInsigniaUrl": "https://.../api/img/xyz"  // absolute; may be null
          }
        }
      ],
      "children": [ /* same element shape, recursive */ ]
    }
  ]
}
```

**Visibility** is controlled by the unit in Billet (Settings → Recruitment →
public ORBAT), three levels:
- `off` → the endpoint returns **HTTP 403** `{ "error": "..." }`. Render a
  "roster on Billet →" link instead of a table.
- `structure` → org chart with slots and fill status, but **every `member` is
  `null`** (names withheld). `filled`/`vacant`/`total` still populated.
- `full` → `member` objects included (name, rank, insignia).

For a public recruiting roster you want **full** — remind the unit owner to set
it. Design the render to degrade gracefully at each level.

### Stats (for a hero strip)

```
GET ${BILLET_BASE}/api/v1/units/{slug}/stats
```

```jsonc
{
  "unit": { "slug": "paramarines", "name": "Paramarines", "tag": "PMC", "crestUrl": "..." },
  "strength": 47,                 // active members
  "opsConducted": 128,            // completed scheduled operations
  "lastOpAt": "2026-07-12T19:00:00.000Z",  // ISO or null
  "establishedAt": "2025-03-04"   // YYYY-MM-DD
}
```

Great for a landing hero: *"47 active Marines · 128 operations conducted."*

### Error handling contract
- `404 { error }` — unknown unit (or a demo unit).
- `403 { error }` — roster visibility is `off`.
- Anything non-200 → hide the dynamic section and show a static link to
  `${BILLET_BASE}` rather than a broken UI.

## How to fetch (pick per your stack)

- **Server-side / SSR (preferred — Next.js, Astro, SvelteKit, any backend):**
  fetch on the server, cache it, render into HTML. No CORS needed, faster,
  SEO-friendly. Cache ~5 min (the API already sets `s-maxage=300`; honor it or
  set your own `revalidate`).
- **Static / client-side:** `fetch()` from the browser works too — the API
  sends `Access-Control-Allow-Origin: *`. The roster pops in after load and
  isn't in the initial HTML (fine for a logged-out roster; worse for SEO).

Either way: **cache, and handle failure gracefully** (stale-while-revalidate,
or a cached last-good copy, or the static link fallback).

## Reference: minimal SSR roster fetch (adapt to your framework)

```ts
const BILLET_BASE = process.env.BILLET_BASE ?? "https://paramarines.billet.gg";
const SLUG = process.env.BILLET_SLUG ?? "paramarines";

export async function getRoster() {
  const res = await fetch(`${BILLET_BASE}/api/v1/units/${SLUG}/roster`, {
    next: { revalidate: 300 }, // Next.js ISR; use your framework's equivalent
  });
  if (!res.ok) return null;    // 403 (private) / 404 → caller shows a link instead
  return res.json();
}
// Render: walk `elements` recursively; for each billet show title + (member?.name
// ?? "Vacant"); use rankInsigniaUrl as <img>, fall back to rankAbbr text.
```

## Match Billet's look (so the seam disappears)

Billet is dark, tactical, monospace-accented. Use these exact tokens on the new
site and the crossover to the portal feels seamless. Dark theme (primary):

```css
--color-bg: #0a0b0d;          --color-ink: #e4e6e9;
--color-surface: #101215;     --color-ink-muted: #9aa1aa;
--color-raised: #16181c;      --color-ink-faint: #7f858e;
--color-edge: #23262b;        --color-accent: #ffb000;   /* signature amber */
--color-edge-bright: #383c44; --color-ok: #4cc26e;  --color-opfor: #ff5a48;
```

Fonts (Google Fonts): **Chakra Petch** (display/headings, weights 500/600/700),
**IBM Plex Mono** (labels, numbers, "readout" bits), **Inter** (body). Billet's
aesthetic: uppercase mono micro-labels, thin edges, amber accents, generous
dark space. The unit's crest/banner come back as image URLs from the API.

## What the unit owner must set in Billet (tell them)
1. Settings → **Website & domain** → "Your website" = `https://paramarines.net`
   (adds a back-link from the portal to this site).
2. Settings → Recruitment → **public ORBAT = full** (so the roster API returns
   names).
3. Upload a **crest** and **banner** (they flow through the API as image URLs).

## Out of scope for this site
- No auth, no member-only data, no writes. Anything interactive (applying,
  member files, events, promotions) lives in the Billet portal — you only
  **link** to it. The public API is read-only public data only.

## Not yet decided
- **The stack for this site.** Recommendation: something with SSR (Next.js /
  Astro) to get the roster into the HTML and dodge CORS — but static + client
  fetch is fully supported. Pick based on the owner's comfort; keep
  `BILLET_BASE` and `SLUG` as config either way.
