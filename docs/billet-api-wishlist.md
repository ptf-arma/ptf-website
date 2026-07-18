# Billet public API wishlist (v1) — for paramarines.net

The site treats Billet as the source of truth. The old paramarines.net has
stale data (ranks, awards), so instead of copying it, these additions would
let the site render always-current data. All endpoints follow the existing
pattern: public, GET-only, slug-addressed, CORS `*`, `s-maxage=300`.

Already shipped (thanks): `reportsToElementId`, `patchUrl` on roster elements.

## 1. Ranks — `GET /api/v1/units/{slug}/ranks`
Drives a "Ranks & Progression" page (unique SEO content; showcases the
"real progression" pitch with live data).
```jsonc
{
  "tracks": [
    {
      "name": "Enlisted",                  // Officer | Warrant | Enlisted | Medical...
      "ranks": [
        {
          "name": "Private First Class",
          "abbr": "PFC",
          "paygrade": "E-2",
          "insigniaUrl": "https://.../api/img/...",
          "order": 2,
          "requirements": {                 // optional block
            "promotionPoints": 15,
            "timeInGradeDays": 14,
            "courses": ["IMC"]
          }
        }
      ]
    }
  ]
}
```

## 2. Awards — `GET /api/v1/units/{slug}/awards`
Same page; medal artwork + citations. (The old site's award images/citations
exist but are stale — serve them live instead.)
```jsonc
{ "awards": [ { "name": "Navy Cross", "imageUrl": "...", "citation": "For extraordinary heroism...", "criteria": "Awarded by CO/XO for ..." } ] }
```

## 3. Recruitment availability — extend roster billets or a new endpoint
The site's role cards currently hardcode statuses ("Waitlist · Selective")
that WILL drift. Expose per-MOS/role recruiting state:
```jsonc
// GET /api/v1/units/{slug}/recruitment
{ "roles": [ { "title": "0311 Rifleman", "status": "open" | "waitlist" | "closed", "selective": false, "prerequisites": ["SSC"], "description": "..." } ] }
```

## 4. Operations feed — `GET /api/v1/units/{slug}/operations?limit=5`
Drives a "Recent operations" strip (freshness signal + credibility) and
lets the site show op recaps without a CMS. Respect a per-op public flag.
```jsonc
{ "operations": [ { "name": "Operation Highgrass III", "date": "2026-07-12", "type": "main" | "ftx", "attendance": 21, "summary": "optional 1-2 sentence public AAR" } ] }
```

## 5. Stats fixes/additions — existing `/stats` endpoint
- `establishedAt` currently returns the Billet record-creation date
  (2026-07-03). Add an overridable "founded" field so the API can say 2016.
- Consider `discordInviteCode` (the site currently hardcodes it to fetch
  live member counts from Discord's invite API).

## 6. Schedule — `GET /api/v1/units/{slug}/schedule` (nice-to-have)
Recurring events (FTX/Main Op day + time + timezone) so the site's schedule
readouts and Event structured data are config-driven rather than hardcoded.

## Priority order (site impact)
1. **#3 recruitment availability** — removes hardcoded-drift risk on the
   most conversion-critical section.
2. **#4 operations feed** — activity proof; the site already hides op stats
   until `opsConducted > 0`, this makes the section rich.
3. **#1 + #2 ranks/awards** — unlocks a whole progression page.
4. **#5, #6** — cleanups.
