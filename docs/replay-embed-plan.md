# Publishing operation replays on paramarines.net

Plan, not a spec. Spans two repos. Written 2026-08-25 against the billet repo
at the same date.

> **Status, 2026-08-29.** Phases 1–5 have shipped. Billet serves the public
> `replays/latest`, `/frames` and `/terrain` endpoints, and `/operations`
> embeds the player click-to-load.
>
> One assumption below turned out to be wrong and is worth correcting where you
> read it: "the facts are what make somebody click, so the share card should be
> typographic rather than a map render." Because `/terrain` is public, the board
> *can* be drawn outside Billet — `scripts/op-assets/render.mjs` renders both a
> map share card and an animated playback from the same data, and the card is
> now the poster, the social preview and the pre-click state that phase 4 asked
> for. The typographic card survives as the fallback for when those assets
> haven't been regenerated yet.
>
> Player names are stripped as this document recommends. The SteamID64 is not —
> see item 7 of `billet-api-wishlist.md`.

## Start with the latest operation only

Showing just the most recent operation is a much smaller build than a library,
and it removes the two hardest problems in this document rather than solving
them.

**No permanent URLs.** One address — `/operations/latest`, or a section on the
homepage. The frozen-slug requirement disappears, because nothing is addressed
by slug.

**No retention hazard.** The worst risk below is that retention deletes a
recording Google has indexed, 404ing the best content on the site. If the only
public replay is always the newest one, old recordings can expire exactly as
they do today and nothing breaks.

It also fixes a problem this site actually has. The media section shows two
films from 2018, while the milsim guide tells readers to judge a unit by whether
its media is recent. A replay of last Sunday's operation is the strongest
possible answer to that, and it stays true without anyone maintaining it.

**What it costs: the SEO thesis.** The case for AARs was accumulation — fifty
indexed pages a year, each unique. One URL whose content churns weekly does not
accumulate. It earns links, shares, and credibility with a prospective recruit
reading the page; it does not build the content moat that UNITAF and the 506th
have. Those are different goals and it is worth being clear which one is being
bought.

**Recommended sequencing.** Build latest-only first regardless of whether the
archive ever follows. It exercises the whole pipeline — public flag, public
frames endpoint, terrain access, framable page, CSP — against one recording
instead of a library. If something about serving replays publicly turns out to
be impractical, that is discovered in the cheapest possible way. The archive is
then an extension: add the slug column, a list endpoint, and per-recording
pages.

Still needed even for latest-only: `is_public` on `aar_recordings`, defaulting
to false. "Most recent" must mean "most recent recording somebody chose to
publish", or one bad night becomes the unit's shop window.

---

## The decision that shapes everything: embed, don't port

Billet's replay is not a small component.

| Piece | Size | Note |
|---|---|---|
| `components/unit/aar-player.tsx` | 922 lines | chunked loading, 10Hz clock, interpolation, 1×–64× |
| `components/unit/toc-map.tsx` | 3,771 lines | vector SVG board: roads, building footprints, pan/zoom |
| `/api/toc/terrain` | server route | terrain geometry, authenticated, not static files |

Copying ~4,700 lines of client code plus a terrain service into ptf-website
would create a fork that rots the first time either side changes. Billet
already owns the player, the terrain data, and the frame store.

**So: Billet gains a public, framable replay page. paramarines.net embeds it.**

The corollary matters for SEO. Iframe content is not indexed as part of the
host page, so the ranking value has to come from the wrapper — title, date,
terrain, participants, and written context on `/operations/<slug>`. The replay
is what earns links and shares; the prose around it is what ranks. A replay
with no words around it is still a thin page.

## Current gating

- `/api/aar/frames` — `403 not a member`. Members get their own side only;
  `canManage` gets the full picture. Events are filtered the same way.
- `/api/toc/terrain` — authenticated via `getCurrentUser`.
- `/api/v1/units/[slug]/{roster,stats,ranks,awards}` — already public and
  unauthenticated. This is the established pattern to follow.

## Phases

### 1 — Visibility model (Billet)

Add to `aar_recordings`: `slug` (URL-safe, unique per unit, frozen at first
publish), `is_public` (boolean, **default false**).

Publishing is a deliberate act by a human. Same rule as the AAR contract: the
filter runs server-side, and an unlisted state is not privacy.

### 2 — Public read endpoints (Billet)

Under the existing v1 namespace:

    GET /api/v1/units/{unit}/replays                    list, public only
    GET /api/v1/units/{unit}/replays/{slug}             metadata
    GET /api/v1/units/{unit}/replays/{slug}/frames      windowed, as today
    GET /api/v1/units/{unit}/replays/{slug}/terrain     or a public terrain variant

Reuse the existing windowing (`from`/`to`, `MAX_WINDOW_SECONDS`) unchanged.
Rate-limit these: a public frames endpoint is scrapeable, and frames are the
expensive thing here.

### 3 — Embeddable page (Billet)

    /embed/replay/{unit}/{slug}

Minimal chrome, no auth, no nav. Must send
`Content-Security-Policy: frame-ancestors https://paramarines.net` — if Billet
sets a blanket `X-Frame-Options: DENY` today, this route needs an exception.
Include a version in the path or a query param so a player change can't
silently break every embed already in the wild.

### 4 — Wrapper page (paramarines.net)

`/operations/<slug>` already exists and renders an empty state. It gains:

- the replay, **click-to-load** — see below
- a poster image for the card, the social preview, and the pre-click state
- the written context that carries the ranking

### 5 — Load behaviour

**Use the pattern already in this repo.** `components/video-card.tsx` renders a
thumbnail and only swaps in the iframe on click, precisely so a heavy embed
costs nothing until wanted. A replay is far heavier than a YouTube frame — the
player's own comment says a two-hour op is "tens of MB of JSON" — so eager
loading would wreck Core Web Vitals on the one page we want ranking.

Thumbnail first, iframe on click. Same component shape, same reasoning.

## Three decisions that are not technical

**1. Player names.** Every frame tuple is
`[side, x, y, dir, isPlayer, name, inVehicle, vehClass?]`. Names are in the
data. The roster is already public so names are not new, but a public replay
showing exactly where a named person was, and when they went down, is a
different thing from a name on a roster. Options: publish as-is, substitute
callsign or role, or make it opt-out per member. Pick one before shipping.

**2. Which side the public sees.** Members currently see friendly only;
`canManage` sees everything. For a finished operation the full picture is more
interesting and gives away nothing that matters. Recommend full, but it is a
choice.

**3. Which recordings.** Not all of them. Bandwidth aside, most ops are not
worth watching. A handful of good ones, deliberately chosen, beats a dump.

## Risks

- **Bandwidth and cost.** Tens of MB per replay, served publicly, uncached by
  default. Consider a downsampled public variant — one frame every 3–5 seconds
  instead of every second — which would cut the payload several-fold and is
  imperceptible at anything above 1× playback.
- **Retention.** `aar_recordings.bytes` exists because storage got expensive.
  Anything public needs pinning so retention cannot delete a URL that search
  engines have indexed.
- **Coupling.** A Billet player change can break the embed. Version the URL.
- **Thin page.** If the replay ships without prose, the page has a heavy iframe
  and almost no text. That ranks badly. The written context is not optional.

## Sequencing

Phases 1–3 are Billet work and block everything else. Phase 4–5 on this side
is small — the `/operations` route, data layer, and sitemap already exist and
already tolerate an empty list.

Nothing here needs the written-prose AAR from `aar-api-contract.md`. The two
can ship independently, though a page with both would be strongest.
