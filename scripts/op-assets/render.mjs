/*
 * Builds the shareable assets for the latest published replay:
 *
 *   public/operations/<replay-id>/card.png   1200×630 social card
 *   public/operations/<replay-id>/op.gif     ~12s animated playback
 *   public/operations/manifest.json          what the site reads
 *
 * Run it after publishing a replay in Billet, then commit and deploy:
 *
 *   npm run op:assets
 *
 * WHY THIS IS A SCRIPT AND NOT A ROUTE
 * The whole operation is ~50MB of frame data across six windowed requests, and
 * drawing it needs a real canvas (Path2D over Billet's terrain paths). Neither
 * belongs in a serverless function that a crawler can hit. Publishing a replay
 * is already a deliberate human act in Billet; regenerating these is the same
 * act. If the assets are missing or stale, the site falls back to the
 * typographic card on its own — see src/lib/op-assets.ts.
 *
 * PRIVACY
 * Frames carry a SteamID64 per player. It is used here only to group a
 * player's positions into one track, and is never written to any output. Do
 * not persist it. (Billet exposing it publicly at all is a separate problem —
 * see docs/billet-api-wishlist.md.)
 */

import { mkdirSync, writeFileSync, readFileSync, rmSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";
import WORLD_LABELS from "../../src/lib/world-labels.json" with { type: "json" };

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT_DIR = join(ROOT, "public", "operations");

const BILLET_BASE =
  process.env.NEXT_PUBLIC_BILLET_BASE ?? "https://billet.paramarines.net";
const BILLET_SLUG = process.env.NEXT_PUBLIC_BILLET_SLUG ?? "ptf";
const API = `${BILLET_BASE}/api/v1/units/${BILLET_SLUG}/replays/latest`;

/** Billet caps a frames request at 1800s; the whole op is fetched in windows. */
const WINDOW_SECONDS = 1800;

const CARD = { W: 1200, H: 630 };
const GIF = { W: 640, FRAMES: 156, FPS: 13, COLORS: 128 };

/** Speeds above this are aircraft or fast vehicles, drawn separately. */
const AIR_SPEED_MS = 18;

/*
 * Operations run Sunday 8PM Eastern, which is already Monday in UTC. Reading
 * the date or the weekday in UTC therefore names the wrong night — the 24
 * August recording is Sunday the 23rd as far as anyone who was there is
 * concerned. Everything user-facing is formatted in the unit's zone.
 */
const UNIT_TZ = "America/New_York";

/* ---------------------------------------------------------------- helpers */

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

function findChrome() {
  const hit = CHROME_CANDIDATES.find((p) => existsSync(p));
  if (!hit) {
    throw new Error(
      "No Chrome found. Set CHROME_PATH to a Chrome or Chromium binary.\n" +
        "Tried:\n  " + CHROME_CANDIDATES.join("\n  "),
    );
  }
  return hit;
}

const fmtDuration = (s) => {
  const m = Math.round(s / 60);
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${m}m`;
  return r === 0 ? `${h}h` : `${h}h ${r}m`;
};

function formatWorld(world) {
  if (!world) return null;
  const key = world.trim().toLowerCase();
  if (WORLD_LABELS[key]) return WORLD_LABELS[key];
  return key
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/*
 * Billet names most recordings "Unit Operation", which is useless on a card
 * somebody is deciding whether to click. When the title carries no
 * information, build one from the day and the terrain instead.
 */
const GENERIC_TITLES = new Set(["", "unit operation", "operation", "untitled"]);

function operationTitle(replay, worldLabel) {
  const given = (replay.title ?? "").trim();
  if (!GENERIC_TITLES.has(given.toLowerCase())) return given;
  const day = new Date(replay.startedAt).toLocaleDateString("en-GB", {
    weekday: "long",
    timeZone: UNIT_TZ,
  });
  return worldLabel ? `${day} on ${worldLabel}` : `${day} operation`;
}

/* ------------------------------------------------------------------ fetch */

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

/**
 * Pull every frame window and reduce as we go.
 *
 * Returns per-player ground tracks and a per-frame snapshot. Both are needed:
 * the card wants continuous movement lines, the GIF wants who was where at a
 * given moment.
 */
async function fetchOperation(durationSeconds, worldSize) {
  const tracks = new Map(); // steamid -> [[t,x,y]] — local grouping only
  const perFrame = []; // [t, friendlyXY[], enemyXY[]]
  const pad = 500;
  const inBounds = (x, y) =>
    x >= -pad && x <= worldSize + pad && y >= -pad && y <= worldSize + pad;

  for (let s = 0; s < durationSeconds; s += WINDOW_SECONDS) {
    const { frames } = await getJSON(
      `${API}/frames?from=${s}&to=${s + WINDOW_SECONDS}`,
    );
    for (const [t, entities] of frames) {
      const friendly = [];
      const enemy = [];
      for (const e of entities) {
        const side = e[0];
        const x = e[1];
        const y = worldSize - e[2]; // Arma y-up into terrain space
        if (!inBounds(x, y)) continue;
        if (side === "e") {
          enemy.push(Math.round(x), Math.round(y));
          continue;
        }
        if (side !== "w" || e[4] !== 1) continue;
        friendly.push(Math.round(x), Math.round(y));
        const id = e[13];
        if (!id) continue;
        let tr = tracks.get(id);
        if (!tr) tracks.set(id, (tr = []));
        tr.push([t, Math.round(x), Math.round(y)]);
      }
      perFrame.push([t, friendly, enemy]);
    }
    process.stdout.write(".");
  }
  process.stdout.write("\n");
  return { tracks: [...tracks.values()], perFrame };
}

/* ------------------------------------------------------------ derivations */

/**
 * Split each player's track into polyline segments, separating boots from
 * aircraft. Without the split, six helicopter runs draw straight lines the
 * length of the image and flatten everything the infantry did.
 */
function segmentTracks(tracks) {
  const ground = [];
  const air = [];
  for (const tr of tracks) {
    let cur = [];
    let curFast = null;
    const flush = () => {
      if (cur.length > 1) (curFast ? air : ground).push(cur);
    };
    for (let i = 0; i < tr.length; i++) {
      const [t, x, y] = tr[i];
      if (i === 0) {
        cur = [[x, y]];
        continue;
      }
      const [pt, px, py] = tr[i - 1];
      const dt = t - pt;
      const d = Math.hypot(x - px, y - py);
      // A gap or a teleport is a break, not a movement.
      if (dt > 15 || d > 900) {
        flush();
        cur = [[x, y]];
        curFast = null;
        continue;
      }
      const fast = dt > 0 && d / dt > AIR_SPEED_MS;
      if (curFast === null) curFast = fast;
      if (fast !== curFast) {
        flush();
        cur = [[px, py]];
        curFast = fast;
      }
      cur.push([x, y]);
      }
    flush();
  }
  return { ground, air };
}

/**
 * Frame the image on where the fighting actually happened.
 *
 * A fixed crop cannot work — the next operation will be on another terrain and
 * another corner of it. Simply keeping the densest bins does not work either:
 * a staging area where fifty people idle for an hour outweighs the objective
 * they then spent two hours taking, and a bounding box around both is most of
 * the map and mostly empty water.
 *
 * So: bin the ground movement, discard the sparse bins (which severs the thin
 * trails linking one area to another), and find connected regions in what's
 * left. Then pick between them by enemy presence rather than by size — the
 * staging area is the biggest blob of friendly movement on the map and the one
 * place nothing happened. Where the enemy was is the operation.
 */
function chooseCrop(groundSegs, enemyPts, worldSize, aspect) {
  const BINS = 96;
  const bin = worldSize / BINS;
  const idx = (bxi, byi) => byi * BINS + bxi;
  const counts = new Map();
  let total = 0;
  for (const seg of groundSegs) {
    for (const [x, y] of seg) {
      const bxi = Math.floor(x / bin);
      const byi = Math.floor(y / bin);
      if (bxi < 0 || bxi >= BINS || byi < 0 || byi >= BINS) continue;
      const k = idx(bxi, byi);
      counts.set(k, (counts.get(k) ?? 0) + 1);
      total++;
    }
  }
  if (!total) return [0, 0, worldSize, worldSize];

  // Sparse bins are transit, not presence. Dropping them disconnects regions
  // that a single squad walking between them would otherwise join.
  const floor = Math.max(4, total * 0.0012);
  const live = new Set();
  for (const [k, n] of counts) if (n >= floor) live.add(k);
  if (!live.size) for (const [k] of counts) live.add(k);

  // Flood fill over the surviving bins, 8-connected.
  const seen = new Set();
  let best = null;
  for (const start of live) {
    if (seen.has(start)) continue;
    const stack = [start];
    seen.add(start);
    let mass = 0;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    while (stack.length) {
      const k = stack.pop();
      const bxi = k % BINS;
      const byi = Math.floor(k / BINS);
      mass += counts.get(k) ?? 0;
      x0 = Math.min(x0, bxi * bin);
      y0 = Math.min(y0, byi * bin);
      x1 = Math.max(x1, (bxi + 1) * bin);
      y1 = Math.max(y1, (byi + 1) * bin);
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = bxi + dx;
          const ny = byi + dy;
          if (nx < 0 || nx >= BINS || ny < 0 || ny >= BINS) continue;
          const nk = idx(nx, ny);
          if (live.has(nk) && !seen.has(nk)) {
            seen.add(nk);
            stack.push(nk);
          }
        }
      }
    }
    let contact = 0;
    for (let i = 0; i < enemyPts.length; i += 2) {
      const ex = enemyPts[i];
      const ey = enemyPts[i + 1];
      if (ex >= x0 && ex <= x1 && ey >= y0 && ey <= y1) contact++;
    }
    // Contact decides it; mass only breaks ties (and carries an op that
    // somehow met no opposition at all).
    if (!best || contact > best.contact || (contact === best.contact && mass > best.mass)) {
      best = { mass, contact, x0, y0, x1, y1 };
    }
  }

  let { x0, y0, x1, y1 } = best;
  const padding = Math.max(400, (x1 - x0 + y1 - y0) * 0.09);
  x0 -= padding;
  y0 -= padding;
  x1 += padding;
  y1 += padding;

  // Widen to the target aspect around the centre.
  let w = x1 - x0;
  let h = y1 - y0;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  if (w / h < aspect) w = h * aspect;
  else h = w / aspect;
  return [cx - w / 2, cy - h / 2, cx + w / 2, cy + h / 2];
}

/**
 * The stretch worth animating: from just before the unit arrives in frame to
 * just after the last contact. An operation's first hour is briefing and
 * staging, which is dead air in a twelve-second loop.
 */
function chooseWindow(perFrame, crop, durationSeconds) {
  const [x0, y0, x1, y1] = crop;
  const inside = (a, i) => a[i] >= x0 && a[i] <= x1 && a[i + 1] >= y0 && a[i + 1] <= y1;
  let arrival = null;
  let lastContact = null;
  for (const [t, friendly, enemy] of perFrame) {
    let f = 0;
    for (let i = 0; i < friendly.length; i += 2) if (inside(friendly, i)) f++;
    let e = 0;
    for (let i = 0; i < enemy.length; i += 2) if (inside(enemy, i)) e++;
    if (arrival === null && f >= 5) arrival = t;
    if (e > 3) lastContact = t;
  }
  const start = Math.max(0, (arrival ?? 0) - 240);
  const end = Math.min(durationSeconds, (lastContact ?? durationSeconds) + 120);
  return end - start < 300 ? [0, durationSeconds] : [start, end];
}

/* ----------------------------------------------------------------- render */

function buildPage(gifencSource) {
  const inject = (f) => readFileSync(join(HERE, f), "utf8");
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Saira:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
</head><body style="margin:0">
<script>var exports={},module={exports:exports};</script>
<script>${gifencSource}</script>
<script>window.gifenc=module.exports;</script>
<script>${inject("map.js")}</script>
<script>${inject("draw.js")}</script>
<script>${inject("page.js")}</script>
</body></html>`;
}

/* ------------------------------------------------------------------- main */

async function main() {
  const chrome = findChrome();
  console.log(`Chrome:  ${chrome}`);
  console.log(`Billet:  ${API}`);

  const { replay } = await getJSON(API);
  if (!replay) {
    console.error("No published replay. Nothing to build.");
    process.exitCode = 1;
    return;
  }
  const worldSize = replay.worldSize ?? 10240;
  const worldLabel = formatWorld(replay.world);
  const title = operationTitle(replay, worldLabel);
  console.log(`Replay:  ${replay.id}`);
  console.log(`Title:   ${title}${replay.title === title ? "" : `  (Billet said "${replay.title}")`}`);

  console.log("Terrain…");
  const terrain = await getJSON(`${API}/terrain`);
  if (terrain.status !== "ready") {
    console.error(`Terrain not ready (status: ${terrain.status}).`);
    process.exitCode = 1;
    return;
  }

  process.stdout.write(`Frames (${Math.ceil(replay.durationSeconds / WINDOW_SECONDS)} windows) `);
  const { tracks, perFrame } = await fetchOperation(replay.durationSeconds, worldSize);
  console.log(`         ${perFrame.length} frames, ${tracks.length} players tracked`);

  // Every enemy position across the op, thinned — the card wants presence, not
  // a plot of all ~120k of them. Also what tells the crop where the fight was.
  const enemyHeat = [];
  for (let i = 0; i < perFrame.length; i += 10) {
    const en = perFrame[i][2];
    for (let j = 0; j < en.length; j += 2) enemyHeat.push(en[j], en[j + 1]);
  }

  const segs = segmentTracks(tracks);
  const crop = chooseCrop(segs.ground, enemyHeat, worldSize, CARD.W / CARD.H);
  const [gifFrom, gifTo] = chooseWindow(perFrame, crop, replay.durationSeconds);
  console.log(`Crop:    ${crop.map(Math.round).join(", ")}`);
  console.log(`GIF:     ${fmtDuration(gifFrom)} → ${fmtDuration(gifTo)} of the operation`);

  const info = {
    title,
    date: new Date(replay.startedAt).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: UNIT_TZ,
    }),
    duration: fmtDuration(replay.durationSeconds),
    participants: replay.participants,
  };

  const gifenc = readFileSync(
    join(ROOT, "node_modules", "gifenc", "dist", "gifenc.js"),
    "utf8",
  );
  const pageFile = join(OUT_DIR, ".render.html");
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(pageFile, buildPage(gifenc));

  const browser = await puppeteer.launch({
    executablePath: chrome,
    headless: true,
    protocolTimeout: 600000,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--force-device-scale-factor=1",
      "--no-first-run",
      "--no-default-browser-check",
      "--js-flags=--max-old-space-size=4096",
    ],
  });

  let card, gifB64, gifMeta;
  try {
    const page = await browser.newPage();
    page.on("pageerror", (e) => console.error("  [page]", e.message));
    await page.goto(pathToFileURL(pageFile).href, { waitUntil: "networkidle0" });
    const fonts = await page.evaluate(() => window.loadFonts());
    if (!fonts.includes("Saira")) {
      console.warn("  ! Saira did not load; the card will use a fallback face.");
    }

    console.log("Card…");
    card = await page.evaluate(
      (t, s, e, c, i, d) => window.renderCard(t, s, e, c, i, d),
      terrain, segs, enemyHeat, crop, info, CARD,
    );

    console.log("GIF…");
    const out = await page.evaluate(
      (t, tr, pf, c, i, cfg) => window.renderGif(t, tr, pf, c, i, cfg),
      terrain, tracks, perFrame, crop, info,
      { ...GIF, H: Math.round(GIF.W / (CARD.W / CARD.H)), from: gifFrom, to: gifTo },
    );
    gifB64 = out.data;
    gifMeta = out.meta;
  } finally {
    await browser.close();
  }

  const dir = join(OUT_DIR, replay.id);
  mkdirSync(dir, { recursive: true });
  const cardBuf = Buffer.from(card.split(",")[1], "base64");
  const gifBuf = Buffer.from(gifB64, "base64");
  writeFileSync(join(dir, "card.png"), cardBuf);
  writeFileSync(join(dir, "op.gif"), gifBuf);
  rmSync(pageFile, { force: true });

  // One published replay at a time; drop assets for any earlier one.
  for (const entry of readdirSync(OUT_DIR, { withFileTypes: true })) {
    if (entry.isDirectory() && entry.name !== replay.id) {
      rmSync(join(OUT_DIR, entry.name), { recursive: true, force: true });
      console.log(`Pruned:  ${entry.name}`);
    }
  }

  const manifest = {
    id: replay.id,
    title,
    world: worldLabel,
    date: info.date,
    startedAt: replay.startedAt,
    durationSeconds: replay.durationSeconds,
    participants: replay.participants,
    card: `/operations/${replay.id}/card.png`,
    gif: `/operations/${replay.id}/op.gif`,
    cardBytes: cardBuf.length,
    gifBytes: gifBuf.length,
    gifSeconds: Number(gifMeta.seconds.toFixed(1)),
    gifWidth: gifMeta.W,
    gifHeight: gifMeta.H,
    generatedAt: new Date().toISOString(),
  };
  writeFileSync(join(OUT_DIR, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

  const mb = (n) => (n / 1048576).toFixed(2) + " MB";
  console.log(`\n  card.png  ${mb(cardBuf.length)}  ${CARD.W}×${CARD.H}`);
  console.log(`  op.gif    ${mb(gifBuf.length)}  ${gifMeta.W}×${gifMeta.H}, ${manifest.gifSeconds}s`);
  console.log(`\nCommit public/operations and deploy.`);
}

main().catch((e) => {
  console.error(`\n${e.stack ?? e}`);
  process.exitCode = 1;
});
