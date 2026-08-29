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

## 7. Replay frames leak SteamID64 — please strip it

`GET /api/v1/units/{slug}/replays/latest/frames` is public and unauthenticated,
and every player tuple ends with the player's SteamID64:

```jsonc
["w",-1768,-1965,134,1,"",1,"b",0,"","R",6,"2:940","76561198135400563"]
//   ^ name is correctly blank                            ^ but this is not
```

The name field is blanked, and /operations tells readers "you can see what a
squad did; you can't see who was in it" — which is not true while the ID is
there. A SteamID64 resolves straight to a profile at
`steamcommunity.com/profiles/<id>`, so the public replay currently says where a
named person was, when they moved and when they stopped, for 53 people.

Nothing on this side needs it. `scripts/op-assets/render.mjs` uses it only to
group one player's positions into one line, and never writes it out. A stable
per-recording surrogate (`"p7"`, or a hash salted per replay) would serve that
identically. Field 12 is the *group* id, so it cannot substitute — several
players share one.

This is the only item here that is a disclosure rather than a feature.

## 8. Replay extras (all small, all optional)

- **`GET .../replays/latest/events`** — 404 today. The player draws contact and
  casualty marks on its own timeline, so the data exists. Exposing it would let
  the share card and the animation mark where the fighting actually happened,
  instead of inferring it from where the enemy was standing.
- **An editable replay title.** Every recording comes back as
  `"Unit Operation"`, which is dead weight on a social card somebody is deciding
  whether to click. The renderer currently substitutes "Sunday on Isla Pera"
  from the date and terrain; a real name entered at publish time would beat it.
- **`GET .../replays`** (the list) — 404. Not needed while the site shows only
  the latest, but it is the first thing an archive would want.
- **The embed's frame headers contradict each other.**
  `/embed/replay/{unit}` sends both `X-Frame-Options: DENY` and
  `Content-Security-Policy: frame-ancestors *`. Browsers ignore XFO when
  frame-ancestors is present, so the embed works — but it is one header cleanup
  away from breaking every embed at once. Dropping XFO on that route and
  naming the real ancestors in CSP would make the intent explicit.

## Priority order (site impact)
1. **#7 strip the SteamID** — not a feature request. It is public now, and the
   site makes a promise about it that the API does not keep.
2. **#3 recruitment availability** — removes hardcoded-drift risk on the
   most conversion-critical section.
3. **#4 operations feed** — activity proof; the site already hides op stats
   until `opsConducted > 0`, this makes the section rich.
4. **#1 + #2 ranks/awards** — unlocks a whole progression page.
5. **#8 replay extras, #5, #6** — cleanups.
