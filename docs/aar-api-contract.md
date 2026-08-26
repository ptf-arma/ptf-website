# AAR API contract (Billet → paramarines.net)

Draft for the Billet side to implement. The website consumes it; nothing here
is built yet. Written 2026-08-25.

## Why

Every Arma milsim site that outranks us wins on published operational history —
UNITAF exposes ~33,000 AARs, the 506th ~190,000 forum posts. Our TOC already
writes AARs into Billet, so the content exists; it is simply not reachable by a
crawler. Exposing it turns an internal byproduct into indexable pages at close
to zero marginal writing cost, and gives the site the proof-of-life our own
milsim guide tells readers to look for.

## Scope

Two read-only, unauthenticated endpoints under the existing public API, which
already serves `roster`, `stats`, `ranks` and `awards` at
`/api/v1/units/{unit}/…`. Same conventions, same base.

    GET /api/v1/units/{unit}/aars           list
    GET /api/v1/units/{unit}/aars/{slug}    single

## Visibility — the load-bearing rule

**The public API must return only AARs explicitly marked public, and the
default for a new AAR must be private.**

This is a publishing decision made per AAR inside Billet by a human, never an
inference. An internal AAR can name individuals, criticise performance, or
describe tactics the unit would rather not advertise. Filtering must happen
server-side in the query; do not return everything and expect the website to
filter, and do not rely on an `unlisted` state to provide privacy.

If an AAR is later unpublished, the endpoint should 404 it. The website will
drop it from the sitemap on the next revalidate.

## List response

    GET /api/v1/units/ptf/aars?page=1&per_page=20

    {
      "unit":       { "slug": "ptf", "name": "Paramarine Task Force" },
      "pagination": { "page": 1, "per_page": 20, "total": 137, "total_pages": 7 },
      "aars": [
        {
          "slug":            "operation-iron-tide",
          "title":           "Operation Iron Tide",
          "operation_date":  "2026-08-23",
          "published_at":    "2026-08-25T14:02:00Z",
          "updated_at":      "2026-08-25T14:02:00Z",
          "terrain":         "Altis",
          "operation_type":  "Amphibious assault",
          "summary":         "Plain-text excerpt, no markup, <= 300 chars.",
          "participants":    42,
          "image":           "https://ptf.billet.gg/api/img/<uuid>",
          "author":          { "name": "M. Ryan", "rank": "Capt" }
        }
      ]
    }

Sorted by `operation_date` descending. `per_page` defaults to 20, caps at 100.

## Single response

Identical fields, plus the prose:

    GET /api/v1/units/ptf/aars/operation-iron-tide

    {
      "unit": { … }, "slug": "…", "title": "…", … ,
      "body_format": "markdown",
      "body": "The platoon crossed the line of departure at 0400…"
    }

## Field reference

| Field | Type | Required | Notes |
|---|---|---|---|
| `slug` | string | yes | URL-safe, stable, unique per unit. Never reuse or change — it becomes a public URL. |
| `title` | string | yes | Plain text, no markup. |
| `operation_date` | date `YYYY-MM-DD` | yes | When the op ran, not when the AAR was written. Drives sort order and display. |
| `published_at` | ISO 8601 | yes | First made public. Maps to schema.org `datePublished`. |
| `updated_at` | ISO 8601 | yes | Last edit. Maps to `dateModified`. |
| `terrain` | string | no | Map name, e.g. "Altis", "Livonia". Long-tail search value — worth populating. |
| `operation_type` | string | no | e.g. "Amphibious assault", "Recon patrol". |
| `summary` | string | yes | Plain text, no markup, <= 300 chars. Used for meta description, cards, and OG. If absent the site would have to derive one, which loses editorial control. |
| `participants` | integer | no | Headcount. |
| `image` | URL | no | Absolute. Must resolve on a host allowed by next.config remotePatterns — `ptf.billet.gg` and `billet.paramarines.net` already are. |
| `author` | object | no | `{ name, rank }`. See PII note. |
| `body_format` | enum | yes (single) | `markdown` \| `html` \| `text`. |
| `body` | string | yes (single) | The prose. |

## Body format

AARs are freeform prose, so the format has to be declared rather than guessed.

**`markdown` is strongly preferred.** It renders predictably, carries no script
risk, and degrades to readable plain text.

If `html` is unavoidable, the payload must be **sanitised server-side** to a
narrow allowlist — `p, br, strong, em, ul, ol, li, blockquote, h2, h3, a, code,
pre` — with `a` restricted to `http`/`https`. The website will sanitise again on
render regardless, but an API that emits arbitrary HTML is a stored-XSS vector
for every consumer, not just us.

`text` is acceptable: the site will render it with paragraph breaks preserved.

## Pagination, caching, errors

- Standard query params `page` and `per_page`.
- An `ETag` or `Last-Modified` on the list endpoint would let the site skip
  refetching unchanged data. Nice to have, not required — the site caches with
  ISR regardless.
- `404` for an unknown or unpublished slug. `200` with an empty `aars` array
  when a unit has none — not a 404.
- Errors as JSON, never HTML: `{ "error": { "code": "not_found", "message": "…" } }`.

## PII

The public roster already exposes names and ranks, so `author` is consistent
with what is published today. Body prose is different: it can name individuals
in the context of mistakes. That is an editorial matter for whoever ticks
"public", not something the API can solve, but it is the reason the default
must be private.

## Non-goals

No authentication, no write access, no comments, no per-member filtering. If
private AARs ever need to reach the site, that is a separate authenticated
endpoint and a separate decision.

## Open questions for Billet

1. Does the TOC record already have a stable slug, or does one need generating
   from the title? If generated, it must be frozen at first publish.
2. Is `terrain` captured as a field today, or only mentioned in prose? It is the
   most valuable optional field for search — worth adding if missing.
3. What does the TOC store the prose as — markdown, rich-text HTML, or plain?
