/*
 * Everything that runs inside the headless browser for the unit banner.
 * render.mjs injects this and calls the globals at the bottom.
 *
 * Four concepts, one canvas size (900x200 — the size of the banner the unit
 * already runs on milsimunits.com, so any of these is a drop-in replacement).
 *
 * All colour and type comes from src/app/globals.css. Nothing here invents a
 * brand value; if the kit changes, these change with it.
 */

/*
 * Design space. Every coordinate in this file is in these units, and the
 * whole thing is drawn through a scale transform on the way out — so the
 * output resolution below can change without touching a single number.
 *
 * 900x225 is 4:1, the ratio milsimunits.com asks for. The earlier 900x200
 * was 4.5:1, which their cropper trimmed from the right and took the end of
 * the call to action with it.
 */
const W = 900;
const H = 225;

/* Output pixels. 1200x300 is the same 4:1, with headroom for a wide or
 * high-density display. setOutput() overrides it. */
let OUT_W = 1200;
let OUT_H = 300;

const BG = "#0b0d12";
const INK = "#e7e9ed";
const INK_MUTED = "#9aa3b0";
const INK_FAINT = "#6f7683";
const SCARLET = "#e03127";
const EDGE = "rgba(255,255,255,0.07)";
const EDGE_BRIGHT = "rgba(255,255,255,0.18)";

const DISPLAY = '"Saira Condensed",ui-sans-serif,system-ui,sans-serif';
const MONO = '"JetBrains Mono",ui-monospace,monospace';

/* Facts, all of them from src/lib/config.ts and src/lib/schedule.ts. */
const SITE = "PARAMARINES.NET";
const DISCORD = "DISCORD.GG/PARAMARINES";

/*
 * The call to action, in the same words and the same two tones the operation
 * share cards use (scripts/op-assets/page.js says "Watch the full op at").
 * A visitor who meets the banner in a directory and the op card on Discord
 * should be looking at one campaign, not two designs that happen to share a
 * logo.
 *
 * It promises something the site has to keep true: `npm run op:assets`
 * rebuilds the operations page after each published replay, and the banner
 * is now making a claim about freshness on its behalf.
 */
const CTA_LEAD = "SEE OUR MOST RECENT OP AT ";
const CTA_URL = "PARAMARINES.NET/OPERATIONS";

const IMAGES = {};
let GRAIN = null;

/**
 * Per-photograph grading.
 *
 * One global grade cannot serve these. The night drop is already almost black,
 * and knocking it back further leaves a flat navy rectangle with the canopies
 * invisible — it needs lifting, not dimming. The Fallujah lift is the
 * opposite: a pale hazy sky that takes over the banner and leaves the mark
 * nowhere to sit, so it gets pushed down and tinted toward brand navy to bring
 * it into the same night as everything else.
 */
const GRADES = {
  nightDrop: { sat: 0.85, bright: 1.42, contrast: 1.2, dim: 0.05 },
  /* Contrast rather than brightness: the jumpers are dark silhouettes against
   * a mid-grey hillside, so separation is what makes them read, not exposure. */
  /*
   * inset: this screenshot has a white frame baked into it, measured at
   * exactly 26px on all four sides. 28 clears it plus the anti-aliased
   * transition row. It is the only one of the four with a border.
   */
  haloJump: { sat: 0.45, bright: 0.78, contrast: 1.28, dim: 0.34, inset: 28 },
  fallujah: { sat: 0.4, bright: 0.66, contrast: 1.22, dim: 0.36, dimRgb: "19,42,82" },
  /*
   * The odd one out: it is already cold and blue, and the fog IS the picture.
   * Graded down like the others it collapsed into murk, so this one keeps its
   * exposure and leans on contrast to pull the squad off the treeline.
   */
  church: { sat: 0.6, bright: 0.94, contrast: 1.32, dim: 0.16 },
};

/* ------------------------------------------------------------- primitives */

function canvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return c;
}

/** Deterministic PRNG — the grain must be identical on every frame and run. */
function mulberry32(a) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * A fixed grain plate, composited over every finished frame.
 *
 * It does two jobs. It hides the banding a 255-colour GIF palette puts across
 * a gradient sky, and because the pattern is positionally fixed it is
 * identical frame to frame — so it costs nothing in the frame differ below.
 * Random-per-frame noise would look the same and make every pixel change.
 */
function makeGrain() {
  /* Built at output resolution and composited after the scale transform is
   * dropped, so the grain stays one pixel per pixel however the design is
   * scaled. Scaled-up grain would smear into blotches. */
  const c = canvas(OUT_W, OUT_H);
  const x = c.getContext("2d");
  const img = x.createImageData(OUT_W, OUT_H);
  const rand = mulberry32(0x50544620);
  for (let i = 0; i < img.data.length; i += 4) {
    const v = rand() * 255;
    img.data[i] = v;
    img.data[i + 1] = v;
    img.data[i + 2] = v;
    img.data[i + 3] = 12;
  }
  x.putImageData(img, 0, 0);
  return c;
}

/**
 * Cover-fit an image into a box around a focal point.
 *
 * `inset` trims that many pixels off every side of the SOURCE before fitting.
 * halo-jump.jpg carries a baked-in white border, which is invisible at any
 * crop that over-fills the box but sits right on the banner edge when the
 * frame is exactly full width. Trimming at the source keeps zoom and focus
 * meaning what they say, instead of over-zooming to hide it.
 */
function cover(ctx, img, x, y, w, h, fx, fy, zoom, inset) {
  fx = fx ?? 0.5;
  fy = fy ?? 0.5;
  zoom = zoom ?? 1;
  inset = inset ?? 0;
  const sw = img.naturalWidth - inset * 2;
  const sh = img.naturalHeight - inset * 2;
  const ir = sw / sh;
  let dw = w * zoom;
  let dh = dw / ir;
  if (dh < h * zoom) {
    dh = h * zoom;
    dw = dh * ir;
  }
  ctx.drawImage(
    img, inset, inset, sw, sh,
    x + (w - dw) * fx, y + (h - dh) * fy, dw, dh,
  );
}

/**
 * A photo, graded to sit in the site's night palette.
 *
 * Arma screenshots are bright and saturated; dropped straight into a banner
 * they fight the mark and leave no contrast for type. Desaturating and
 * darkening also shrinks the colour count, which is the whole budget in GIF.
 */
function photo(ctx, key, x, y, w, h, o) {
  const img = IMAGES[key];
  if (!img) return;
  const g = GRADES[key] || {};
  o = o || {};
  const val = (n, d) => o[n] ?? g[n] ?? d;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.filter =
    "saturate(" + val("sat", 0.62) + ") brightness(" + val("bright", 0.85) +
    ") contrast(" + val("contrast", 1.06) + ")";
  cover(ctx, img, x, y, w, h, o.fx, o.fy, o.zoom, val("inset", 0));
  ctx.filter = "none";
  ctx.fillStyle = "rgba(" + val("dimRgb", "11,13,18") + "," + val("dim", 0.34) + ")";
  ctx.fillRect(x, y, w, h);
  ctx.restore();
}

/** Knocks the top of a bright sky down so overlaid type keeps its contrast. */
function skyScrim(ctx, x, w, h, a) {
  const g = ctx.createLinearGradient(0, 0, 0, h);
  g.addColorStop(0, "rgba(11,13,18," + a + ")");
  g.addColorStop(1, "rgba(11,13,18,0)");
  ctx.fillStyle = g;
  ctx.fillRect(x, 0, w, h);
}

/** Horizontal scrim so type stays legible over any photograph. */
function scrimLeft(ctx, x, w, a) {
  const g = ctx.createLinearGradient(x, 0, x + w, 0);
  g.addColorStop(0, "rgba(11,13,18," + a + ")");
  g.addColorStop(0.62, "rgba(11,13,18," + a * 0.55 + ")");
  g.addColorStop(1, "rgba(11,13,18,0)");
  ctx.fillStyle = g;
  ctx.fillRect(x, 0, w, H);
}

function scrimBottom(ctx, h, a) {
  const g = ctx.createLinearGradient(0, H, 0, H - h);
  g.addColorStop(0, "rgba(11,13,18," + a + ")");
  g.addColorStop(1, "rgba(11,13,18,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, H - h, W, h);
}

/** The .bg-grid utility from globals.css: 44px tactical grid, radially masked. */
function tacticalGrid(ctx, x, y, w, h, cx, cy) {
  const g = canvas(w, h);
  const gx = g.getContext("2d");
  gx.strokeStyle = "rgba(255,255,255,0.055)";
  gx.lineWidth = 1;
  for (let i = 0; i <= w; i += 44) {
    gx.beginPath();
    gx.moveTo(i + 0.5, 0);
    gx.lineTo(i + 0.5, h);
    gx.stroke();
  }
  for (let i = 0; i <= h; i += 44) {
    gx.beginPath();
    gx.moveTo(0, i + 0.5);
    gx.lineTo(w, i + 0.5);
    gx.stroke();
  }
  const m = gx.createRadialGradient(
    w * (cx ?? 0.3), h * (cy ?? 0.2), 0,
    w * (cx ?? 0.3), h * (cy ?? 0.2), Math.max(w, h) * 0.8,
  );
  m.addColorStop(0, "rgba(0,0,0,1)");
  m.addColorStop(1, "rgba(0,0,0,0)");
  gx.globalCompositeOperation = "destination-in";
  gx.fillStyle = m;
  gx.fillRect(0, 0, w, h);
  ctx.drawImage(g, x, y);
}

/** The MARPAT swatch, at the same near-subliminal weight the site uses. */
function marpat(ctx, x, y, w, h, alpha) {
  const img = IMAGES.marpat;
  if (!img) return;
  ctx.save();
  ctx.beginPath();
  ctx.rect(x, y, w, h);
  ctx.clip();
  ctx.globalAlpha = alpha ?? 0.05;
  ctx.filter = "saturate(0.5) brightness(0.8)";
  const tile = 300;
  for (let ty = y; ty < y + h; ty += tile) {
    for (let tx = x; tx < x + w; tx += tile) ctx.drawImage(img, tx, ty, tile, tile);
  }
  ctx.filter = "none";
  ctx.restore();
}

/** The shield, drawn to a target height. Returns the width it occupied. */
function emblem(ctx, x, y, h) {
  const img = IMAGES.emblem;
  if (!img) return 0;
  const w = (img.naturalWidth / img.naturalHeight) * h;
  ctx.drawImage(img, x, y, w, h);
  return w;
}

function mono(ctx, text, x, y, px, color, spacing, align) {
  ctx.font = "400 " + px + "px " + MONO;
  ctx.letterSpacing = (spacing ?? 1.6) + "px";
  ctx.fillStyle = color;
  const w = ctx.measureText(text).width;
  ctx.fillText(text, align === "right" ? x - w : x, y);
  ctx.letterSpacing = "0px";
  return w;
}

function display(ctx, text, x, y, px, fill, spacing) {
  ctx.font = "600 " + px + "px " + DISPLAY;
  ctx.letterSpacing = (spacing ?? 0) + "px";
  ctx.fillStyle = fill;
  ctx.fillText(text, x, y);
  const w = ctx.measureText(text).width;
  ctx.letterSpacing = "0px";
  return w;
}

function measureDisplay(ctx, text, px, spacing) {
  ctx.font = "600 " + px + "px " + DISPLAY;
  ctx.letterSpacing = (spacing ?? 0) + "px";
  const w = ctx.measureText(text).width;
  ctx.letterSpacing = "0px";
  return w;
}

/**
 * The specular sheen from .anniv-text in globals.css, as a canvas fill.
 *
 * The site already sweeps a highlight through gold type on the anniversary
 * banner; borrowing it here means the animation is a brand motif the unit
 * already owns rather than a new one invented for a GIF.
 */
function sheen(ctx, x0, x1, p) {
  if (p === null) return INK;
  const span = x1 - x0;
  return sheenAt(ctx, x0 - span * 0.5 + span * 2 * p, Math.sin(Math.PI * p));
}

const SHEEN_REST = [231, 233, 237]; // INK
const SHEEN_DIP = [167, 175, 188];

/** The same highlight, positioned absolutely — used when a light pass drives it. */
function sheenAt(ctx, c, dip) {
  /*
   * The base has to drop below INK for the pass to register at all: a
   * highlight running from #e7e9ed to #ffffff is a difference nobody can see,
   * which is how the first draft ended up with an invisible sheen. But a
   * constant dimmed base makes the wordmark visibly drop a stop the instant
   * the pass begins, so the dip is eased in and out across the pass instead.
   */
  dip = dip ?? 1;
  const base =
    "rgb(" +
    SHEEN_REST.map((v, i) => Math.round(v + (SHEEN_DIP[i] - v) * dip)).join(",") +
    ")";
  const g = ctx.createLinearGradient(c - 130, 0, c + 130, 0);
  g.addColorStop(0, base);
  g.addColorStop(0.5, "#ffffff");
  g.addColorStop(1, base);
  return g;
}

/** A vertical wipe edge: a scarlet line with a short glow trailing it. */
function wipeEdge(ctx, x) {
  if (x <= 0 || x >= W) return;
  const g = ctx.createLinearGradient(x - 26, 0, x, 0);
  g.addColorStop(0, "rgba(224,49,39,0)");
  g.addColorStop(1, "rgba(224,49,39,0.30)");
  ctx.fillStyle = g;
  ctx.fillRect(x - 26, 0, 26, H);
  ctx.fillStyle = SCARLET;
  ctx.fillRect(x - 2, 0, 2, H);
}

/* ------------------------------------------------------------------ chrome */

/**
 * The two-tone call to action, right-aligned so it ends at `right`.
 *
 * The URL is set larger than its lead-in rather than both at one size: the
 * line is long enough that at a single size it reads as a sentence to skim
 * past, and the part worth remembering is the address.
 */
function drawCta(ctx, right, y, leadPx, urlPx) {
  ctx.font = "400 " + urlPx + "px " + MONO;
  ctx.letterSpacing = "1.2px";
  const wUrl = ctx.measureText(CTA_URL).width;
  ctx.font = "400 " + leadPx + "px " + MONO;
  ctx.letterSpacing = "1.6px";
  const wLead = ctx.measureText(CTA_LEAD).width;

  const x = right - (wLead + wUrl);
  /* Muted rather than faint: this is the banner's actual ask, and faint grey
   * loses to a treeline at this size. */
  ctx.fillStyle = INK_MUTED;
  ctx.fillText(CTA_LEAD, x, y);
  ctx.font = "400 " + urlPx + "px " + MONO;
  ctx.letterSpacing = "1.2px";
  ctx.fillStyle = SCARLET;
  ctx.fillText(CTA_URL, x + wLead, y);
  ctx.letterSpacing = "0px";
  return wLead + wUrl;
}

/** Stacked wordmark, two lines. Returns the block width. */
function wordmarkStacked(ctx, x, yTop, px, fill) {
  const gap = px * 0.92;
  display(ctx, "PARAMARINE", x, yTop, px, fill, 0.5);
  display(ctx, "TASK FORCE", x, yTop + gap, px, fill, 0.5);
  return Math.max(
    measureDisplay(ctx, "PARAMARINE", px, 0.5),
    measureDisplay(ctx, "TASK FORCE", px, 0.5),
  );
}

/* ---------------------------------------------------------------- concepts */

/*
 * A — NIGHT DROP
 * One photograph, the mark and the wordmark locked left, a status readout
 * right. The only motion is the brand sheen crossing the wordmark and the
 * readout stepping through four facts.
 */
function drawNightDrop(ctx, ms, total) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  photo(ctx, "nightDrop", 0, 0, W, H, { fx: 0.5, fy: 0.82, zoom: 1.3 });
  scrimLeft(ctx, 0, 600, 0.94);
  scrimBottom(ctx, 86, 0.7);

  const ew = emblem(ctx, 34, 44, 124);
  const tx = 34 + ew + 24;

  /* The sheen runs once at the top of the loop, then rests. */
  const p = ms < 1700 ? ms / 1700 : null;
  const wmW = Math.max(
    measureDisplay(ctx, "PARAMARINE", 42, 0.5),
    measureDisplay(ctx, "TASK FORCE", 42, 0.5),
  );
  wordmarkStacked(ctx, tx, 102, 42, sheen(ctx, tx, tx + wmW, p));

  ctx.fillStyle = SCARLET;
  ctx.fillRect(tx + 2, 157, 96, 2);

  const lines = [
    "OPERATIONS · SUNDAYS 2000 ET",
    "ARMA 3 MILSIM · EST. 2016",
    "RECRUITING · APPLY ONLINE",
  ];
  /* Split the loop evenly, so the list can change length without the last
   * line running across the loop boundary. */
  const i = Math.min(lines.length - 1, Math.floor(ms / (total / lines.length)));

  /* Both addresses ride the pixels, as they do on the operation cards. */
  mono(ctx, DISCORD, 866, 82, 11, INK_FAINT, 2.2, "right");
  const lw = mono(ctx, lines[i], 866, 118, 13, INK_MUTED, 1.4, "right");
  if (Math.floor(ms / 700) % 2 === 0) {
    ctx.fillStyle = SCARLET;
    ctx.fillRect(866 - lw - 12, 107, 7, 12);
  }
  mono(ctx, SITE, 866, 158, 15, SCARLET, 2.4, "right");
}

/*
 * B — READOUT
 * No photography at all: gunmetal, the tactical grid, the MARPAT texture and
 * type. This is the concept that looks most like the website, and the one
 * that stays legible when a directory shrinks it.
 */
function drawReadout(ctx, ms, total) {
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  marpat(ctx, 0, 0, W, H, 0.055);
  tacticalGrid(ctx, 0, 0, W, H, 0.22, 0.3);

  /*
   * One pass of light crosses the banner near the top of the loop and then
   * the frame rests. The first draft swept continuously for the whole seven
   * seconds; it was barely visible and cost 1.3MB, because a wide gradient
   * touching most of the canvas defeats the frame differ. Confining the pass
   * to a short window and a narrower band is the same gesture for a fifth of
   * the bytes.
   */
  const PASS = 2200;
  const running = ms < PASS;
  const cx = -140 + (W + 280) * (running ? ms / PASS : 0);
  if (running) {
    const g = ctx.createLinearGradient(cx - 105, 0, cx + 105, 0);
    g.addColorStop(0, "rgba(150,175,215,0)");
    g.addColorStop(0.5, "rgba(160,185,225,0.15)");
    g.addColorStop(1, "rgba(150,175,215,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  const ew = emblem(ctx, 40, 40, 140);
  const tx = 40 + ew + 28;

  /* The same pass lights the wordmark as it goes by. */
  const fill = running ? sheenAt(ctx, cx, Math.sin(Math.PI * (ms / PASS))) : INK;
  display(ctx, "PARAMARINE TASK FORCE", tx, 104, 46, fill, 0.5);
  ctx.fillStyle = SCARLET;
  ctx.fillRect(tx + 2, 120, 70, 2);
  mono(ctx, "ARMA 3 MILSIM   ·   EST. 2016", tx + 2, 148, 12, INK_FAINT, 2.2);
  mono(ctx, DISCORD, tx + 2, 178, 12, INK_MUTED, 1.8);

  /* Right-hand readout panel, in Billet's label/value idiom. */
  const px0 = 646;
  const py0 = 50;
  const pw = 214;
  const ph = 128;
  ctx.fillStyle = "rgba(22,26,35,0.55)";
  ctx.fillRect(px0, py0, pw, ph);
  ctx.strokeStyle = EDGE;
  ctx.lineWidth = 1;
  ctx.strokeRect(px0 + 0.5, py0 + 0.5, pw - 1, ph - 1);

  /*
   * Only the nights that are open to the whole unit. schedule.ts also lists
   * Thursday and Friday, but those are MSO-cert and recruits-only
   * respectively, so counting them here overstates what a visitor can turn up
   * to.
   */
  const rows = [
    ["OPS", "SUN 2000 ET"],
    ["TRAIN", "TUE & SAT"],
    ["EST", "2016"],
  ];
  rows.forEach(([k, v], n) => {
    const y = py0 + 28 + n * 26;
    mono(ctx, k, px0 + 14, y, 10, INK_FAINT, 2);
    mono(ctx, v, px0 + pw - 14, y, 11, INK_MUTED, 1.2, "right");
  });

  const y = py0 + 28 + 3 * 26;
  mono(ctx, "STATUS", px0 + 14, y, 10, INK_FAINT, 2);
  const rw = mono(ctx, "RECRUITING", px0 + pw - 14, y, 11, INK, 1.2, "right");
  ctx.globalAlpha = Math.floor(ms / 800) % 2 === 0 ? 1 : 0.28;
  ctx.fillStyle = SCARLET;
  ctx.beginPath();
  ctx.arc(px0 + pw - 18 - rw - 9, y - 4, 3.2, 0, 7);
  ctx.fill();
  ctx.globalAlpha = 1;

  mono(ctx, SITE, px0 + pw, 200, 13, SCARLET, 2.2, "right");
}

/*
 * C — TRIPTYCH
 * The layout the unit already has — two photo panels around a centre mark —
 * rebuilt in the site's palette and type, with the TeamSpeak address swapped
 * for Discord. The safest option: nobody has to relearn the banner.
 */
function drawTriptych(ctx, ms, total) {
  const P = W / 3;
  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);

  const left = [
    { key: "haloJump", fx: 0.52, fy: 0.5, zoom: 1.05 },
    { key: "fallujah", fx: 0.62, fy: 0.55, zoom: 1.1 },
  ];
  const right = [
    { key: "nightDrop", fx: 0.62, fy: 0.8, zoom: 1.1 },
    { key: "fallujah", fx: 0.28, fy: 0.5, zoom: 1.2 },
  ];

  /* The two photo panels change on their own clocks, 3s apart. */
  const panel = (x, set, offset) => {
    const cycle = 6000;
    const at = (ms + offset) % cycle;
    const i = Math.floor((ms + offset) / cycle) % set.length;
    const j = (i + 1) % set.length;
    const cur = set[i];
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, 0, P, H);
    ctx.clip();
    photo(ctx, cur.key, x, 0, P, H, { fx: cur.fx, fy: cur.fy, zoom: cur.zoom });
    if (at > cycle - 600) {
      const w = ((at - (cycle - 600)) / 600) * P;
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, 0, w, H);
      ctx.clip();
      const nx = set[j];
      photo(ctx, nx.key, x, 0, P, H, { fx: nx.fx, fy: nx.fy, zoom: nx.zoom });
      ctx.restore();
      if (w > 1 && w < P) {
        ctx.fillStyle = SCARLET;
        ctx.fillRect(x + w - 2, 0, 2, H);
      }
    }
    ctx.restore();
  };

  panel(0, left, 0);
  panel(2 * P, right, 3000);

  /* Centre panel: solid, so the mark never sits on a moving picture. */
  ctx.fillStyle = BG;
  ctx.fillRect(P, 0, P, H);
  marpat(ctx, P, 0, P, H, 0.07);
  tacticalGrid(ctx, P, 0, P, H, 0.5, 0.5);

  const img = IMAGES.emblem;
  const ew = img ? (img.naturalWidth / img.naturalHeight) * 106 : 0;
  emblem(ctx, P + (P - ew) / 2, 30, 106);
  ctx.textAlign = "center";
  display(ctx, "PARAMARINE TASK FORCE", P + P / 2, 176, 25, INK, 1.6);
  ctx.textAlign = "left";
  ctx.fillStyle = SCARLET;
  ctx.fillRect(P + P / 2 - 24, 188, 48, 2);

  /* Panel 1 carries the addresses, as the current banner does. */
  scrimBottom(ctx, 96, 0.8);
  const gTop = ctx.createLinearGradient(0, 0, 0, 74);
  gTop.addColorStop(0, "rgba(11,13,18,0.8)");
  gTop.addColorStop(1, "rgba(11,13,18,0)");
  ctx.fillStyle = gTop;
  ctx.fillRect(0, 0, P, 74);
  ctx.fillRect(2 * P, 0, P, 74);

  /*
   * Panel 3 sets three lines of type over a picture that changes underneath
   * them, so it gets its own scrim rather than relying on whichever
   * photograph happens to be showing.
   */
  const g3 = ctx.createLinearGradient(2 * P, 0, 2 * P + P * 0.9, 0);
  g3.addColorStop(0, "rgba(11,13,18,0.86)");
  g3.addColorStop(1, "rgba(11,13,18,0)");
  ctx.fillStyle = g3;
  ctx.fillRect(2 * P, 0, P, H);

  mono(ctx, SITE, 22, 36, 14, INK, 2.4);
  mono(ctx, DISCORD, 22, 172, 12, INK_MUTED, 1.8);

  /* Panel 3 keeps the unit's own line, set properly. */
  display(ctx, "IMPROVISE.", 2 * P + 22, 74, 27, INK, 0.5);
  display(ctx, "ADAPT.", 2 * P + 22, 106, 27, INK, 0.5);
  display(ctx, "OVERCOME.", 2 * P + 22, 138, 27, INK, 0.5);
  ctx.fillStyle = SCARLET;
  ctx.fillRect(2 * P + 24, 150, 88, 2);

  ctx.strokeStyle = EDGE_BRIGHT;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(P + 0.5, 0);
  ctx.lineTo(P + 0.5, H);
  ctx.moveTo(2 * P + 0.5, 0);
  ctx.lineTo(2 * P + 0.5, H);
  ctx.stroke();
}

/*
 * D — CYCLE
 * Full-bleed photography wiped one to the next, with a fixed mark block and a
 * progress rule along the bottom. The wipe is deliberate: a crossfade would
 * change every pixel of every frame and triple the file size.
 */
function drawCycle(ctx, ms, total) {
  const shots = [
    { key: "nightDrop", fx: 0.58, fy: 0.82, zoom: 1.3,
      line: "OPERATIONS · SUNDAYS 2000 ET" },
    /*
     * Sitting the halo frame high in the source is deliberate: the banner
     * shows about a quarter of a 16:9 screenshot, and the tail of the Osprey
     * is the thing that makes the picture legible at a glance. Framed on the
     * jumpers alone it reads as specks on a hillside.
     */
    /*
     * zoom 1 is as wide as this can go: the source is 16:9 and the banner is
     * 4.5:1, so a full-width frame still only shows ~40% of the screenshot's
     * height (427 of 1080 rows). There is no framing that holds the top of
     * the tail and the jump stick at once, so this one sits low enough to put
     * the jumpers in shot and keeps the 8283/MAG-36 tail markings above them.
     *
     * Losing the pan that zoom 1.12 bought is fine here: the roundel now
     * falls mid-height rather than at the baseline, so it is no longer behind
     * the address line.
     */
    { key: "haloJump", fx: 0.5, fy: 0.4, zoom: 1.0,
      line: "RECRUITING · APPLY ONLINE" },
    /*
     * A 2.42:1 source, so this one gives up more of its height to the strip
     * than the 16:9 screenshots do (54% against 40%). Framed low: the church
     * itself sits behind the wordmark block, and what the open right-hand
     * side needs to carry is the squad moving through the treeline.
     */
    { key: "church", fx: 0.5, fy: 0.88, zoom: 1.0,
      line: "ARMA 3 MILSIM · EST. 2016" },
  ];
  const step = total / shots.length;
  const i = Math.min(shots.length - 1, Math.floor(ms / step));
  const j = (i + 1) % shots.length;
  const at = ms - i * step;
  const WIPE = 560;

  const shot = (s) =>
    photo(ctx, s.key, 0, 0, W, H, { fx: s.fx, fy: s.fy, zoom: s.zoom });

  ctx.fillStyle = BG;
  ctx.fillRect(0, 0, W, H);
  shot(shots[i]);

  let wx = 0;
  if (at > step - WIPE) {
    wx = ((at - (step - WIPE)) / WIPE) * W;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, wx, H);
    ctx.clip();
    shot(shots[j]);
    ctx.restore();
    wipeEdge(ctx, wx);
  }

  skyScrim(ctx, 0, W, 108, 0.5);
  scrimLeft(ctx, 0, 560, 0.92);
  /*
   * Deep enough that the address line holds up over the brightest frame in
   * the cycle — the white fuselage — rather than only over the night ones.
   */
  scrimBottom(ctx, 116, 0.95);

  const ew = emblem(ctx, 32, 40, 120);
  const tx = 32 + ew + 22;
  /* Baselines set so the two-line block centres on the shield beside it. */
  wordmarkStacked(ctx, tx, 96, 40, INK);
  ctx.fillStyle = SCARLET;
  ctx.fillRect(tx + 2, 149, 90, 2);

  /* The caption belongs to the picture behind it, so it flips with the wipe. */
  const caption = wx > 300 ? shots[j] : shots[i];
  mono(ctx, caption.line, 32, 197, 12, INK_MUTED, 1.6);
  drawCta(ctx, 868, 197, 11, 14);

  const by = H - 3;
  ctx.fillStyle = "rgba(255,255,255,0.12)";
  ctx.fillRect(0, by, W, 2);
  ctx.fillStyle = SCARLET;
  ctx.fillRect(0, by, W * (ms / total), 2);
}

/* ------------------------------------------------------------- timelines */

/**
 * Frame schedules. A GIF frame carries its own delay, so a concept spends
 * frames only where something moves — holds are one long frame rather than
 * thirty identical ones.
 */
function sched(segments) {
  const out = [];
  for (const seg of segments) {
    for (let ms = seg[0]; ms < seg[1]; ms += seg[2]) out.push({ ms, delay: seg[2] });
  }
  return out;
}

const CONCEPTS = {
  "a-night-drop": {
    total: 8000,
    draw: drawNightDrop,
    frames: () => sched([[0, 1700, 66], [1700, 8000, 350]]),
  },
  "b-readout": {
    total: 7000,
    draw: drawReadout,
    frames: () => sched([[0, 2200, 62], [2200, 7000, 400]]),
  },
  "c-triptych": {
    total: 12000,
    draw: drawTriptych,
    frames: () => sched([
      [0, 5400, 600], [5400, 6000, 60],
      [6000, 8400, 600], [8400, 9000, 60],
      [9000, 11400, 600], [11400, 12000, 60],
    ]),
  },
  "d-cycle": {
    total: 8400,
    draw: drawCycle,
    frames: () => sched([
      [0, 2240, 280], [2240, 2800, 62],
      [2800, 5040, 280], [5040, 5600, 62],
      [5600, 7840, 280], [7840, 8400, 62],
    ]),
  },
};

/* ---------------------------------------------------------------- loading */

window.loadFonts = async () => {
  await Promise.all([
    document.fonts.load('600 46px "Saira Condensed"'),
    document.fonts.load('600 27px "Saira Condensed"'),
    document.fonts.load('400 15px "JetBrains Mono"'),
    document.fonts.load('400 11px "JetBrains Mono"'),
  ]);
  await document.fonts.ready;
  return [...document.fonts]
    .filter((f) => f.status === "loaded")
    .map((f) => f.family)
    .join(",");
};

window.loadAssets = async (uris) => {
  const out = [];
  for (const key of Object.keys(uris)) {
    const img = new Image();
    img.src = uris[key];
    await img.decode();
    IMAGES[key] = img;
    out.push(key + " " + img.naturalWidth + "x" + img.naturalHeight);
  }
  GRAIN = makeGrain();
  return out.join(", ");
};

window.conceptNames = () => Object.keys(CONCEPTS);

/** Set the output resolution. Must keep 4:1 to match the design space. */
window.setOutput = (w, h) => {
  OUT_W = w;
  OUT_H = h;
  GRAIN = makeGrain();
  return w + "x" + h;
};

/* ----------------------------------------------------------------- render */

function paint(ctx, concept, ms) {
  ctx.save();
  /* Design units in, output pixels out. */
  ctx.setTransform(OUT_W / W, 0, 0, OUT_H / H, 0, 0);
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  concept.draw(ctx, ms, concept.total);
  ctx.restore();
  ctx.drawImage(GRAIN, 0, 0);
}

/** A single frame as a PNG, for eyeballing a concept without a GIF viewer. */
window.renderStill = (name, ms) => {
  const c = canvas(OUT_W, OUT_H);
  paint(c.getContext("2d"), CONCEPTS[name], ms);
  return c.toDataURL("image/png");
};

/** A stacked contact sheet of N moments, so motion can be checked at a glance. */
window.renderSheet = (name, count) => {
  const k = CONCEPTS[name];
  const gap = 10;
  const c = canvas(OUT_W, count * OUT_H + (count - 1) * gap);
  const x = c.getContext("2d");
  x.fillStyle = "#000";
  x.fillRect(0, 0, c.width, c.height);
  const one = canvas(OUT_W, OUT_H);
  const ox = one.getContext("2d");
  for (let i = 0; i < count; i++) {
    paint(ox, k, (k.total * i) / count);
    x.drawImage(one, 0, i * (OUT_H + gap));
  }
  return c.toDataURL("image/png");
};

/**
 * Encode one concept.
 *
 * Two things keep the file small. A single global palette is built from
 * samples spread across the loop, so the colour table is written once. And
 * every frame after the first is differenced against the one before it —
 * pixels that did not change are written as the transparent index and the
 * frame is left undisposed, so a static background compresses to nothing.
 */
window.renderBanner = (name, colors) => {
  const k = CONCEPTS[name];
  const frames = k.frames();
  const GIFEncoder = window.gifenc.GIFEncoder;
  const quantize = window.gifenc.quantize;
  const applyPalette = window.gifenc.applyPalette;

  const c = canvas(OUT_W, OUT_H);
  const ctx = c.getContext("2d", { willReadFrequently: true });

  /* Sample the loop for the palette before encoding anything. */
  const SAMPLES = 6;
  const px = OUT_W * OUT_H * 4;
  const sample = new Uint8ClampedArray(px * SAMPLES);
  for (let i = 0; i < SAMPLES; i++) {
    paint(ctx, k, (k.total * i) / SAMPLES);
    sample.set(ctx.getImageData(0, 0, OUT_W, OUT_H).data, i * px);
  }
  const palette = quantize(sample, colors - 1, { format: "rgb565" });
  /*
   * Index `colors - 1` is reserved for "unchanged". applyPalette never emits
   * it, because it only ever sees the table above.
   */
  const full = palette.concat([[0, 0, 0]]);
  const CLEAR = colors - 1;

  const enc = GIFEncoder();
  let prev = null;
  let unchanged = 0;
  let totalPx = 0;

  for (let f = 0; f < frames.length; f++) {
    paint(ctx, k, frames[f].ms);
    const data = ctx.getImageData(0, 0, OUT_W, OUT_H).data;
    const idx = applyPalette(data, palette, "rgb565");

    if (prev) {
      const cur32 = new Uint32Array(data.buffer);
      for (let i = 0; i < cur32.length; i++) {
        if (cur32[i] === prev[i]) {
          idx[i] = CLEAR;
          unchanged++;
        }
      }
      totalPx += cur32.length;
    }
    prev = new Uint32Array(new Uint8ClampedArray(data).buffer);

    enc.writeFrame(idx, OUT_W, OUT_H, {
      palette: f === 0 ? full : undefined,
      first: f === 0,
      repeat: 0,
      delay: frames[f].delay,
      transparent: f > 0,
      transparentIndex: CLEAR,
      dispose: 1,
    });
  }
  enc.finish();

  const bytes = enc.bytes();
  let s = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return {
    data: btoa(s),
    meta: {
      W: OUT_W,
      H: OUT_H,
      frames: frames.length,
      seconds: k.total / 1000,
      staticPct: totalPx ? Math.round((unchanged / totalPx) * 100) : 0,
    },
  };
};
