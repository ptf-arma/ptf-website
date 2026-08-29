/*
 * Everything that runs inside the headless browser. render.mjs injects this
 * after map.js and draw.js and calls the three globals below.
 */

const INK = "#e7e9ed";
const INK_MUTED = "#9aa3b0";
const INK_FAINT = "#8b93a0";
const ACCENT = "#e03127";

const MONO = '"JetBrains Mono",ui-monospace,monospace';
const DISPLAY = "Saira,ui-sans-serif,system-ui,sans-serif";

/*
 * The card has room for the instruction; the GIF's bottom strip has to share
 * with the clock and the Discord address, so it carries the URL alone.
 */
const CTA_LEAD = "Watch the full op at ";
const CTA_URL = "paramarines.net/operations";
const DISCORD = "discord.gg/paramarines";

/** Right-aligned two-tone line ending at `right`. Returns its total width. */
function drawCta(ctx, right, y, px, lead) {
  ctx.letterSpacing = "0.5px";
  ctx.font = "500 " + px + "px " + MONO;
  const wLead = lead ? ctx.measureText(lead).width : 0;
  const wUrl = ctx.measureText(CTA_URL).width;
  const startX = right - (wLead + wUrl);
  if (lead) {
    ctx.fillStyle = INK_MUTED;
    ctx.fillText(lead, startX, y);
  }
  ctx.fillStyle = ACCENT;
  ctx.fillText(CTA_URL, startX + wLead, y);
  return wLead + wUrl;
}

/**
 * The horizontal lockup, handed in as a data URI by render.mjs.
 *
 * These images get saved and reposted somewhere we are not, so the mark and
 * both addresses are burned into the pixels rather than left to the post
 * around them.
 */
let BRAND = null;

window.loadBrand = async (dataUri) => {
  const img = new Image();
  img.src = dataUri;
  await img.decode();
  BRAND = img;
  return img.naturalWidth + "x" + img.naturalHeight;
};

/**
 * Draw the lockup at a given width, returning the height it occupied. Falls
 * back to the wordmark as text so a missing asset costs the mark, not the
 * whole render.
 */
function drawBrand(ctx, x, y, width) {
  if (!BRAND) {
    ctx.letterSpacing = width > 200 ? "4px" : "2.5px";
    ctx.font = "500 " + (width > 200 ? 19 : 10) + "px " + MONO;
    ctx.fillStyle = INK_MUTED;
    ctx.fillText("PARAMARINE TASK FORCE", x, y + (width > 200 ? 22 : 12));
    return width > 200 ? 30 : 16;
  }
  const h = (BRAND.naturalHeight / BRAND.naturalWidth) * width;
  ctx.drawImage(BRAND, x, y, width, h);
  return h;
}

/**
 * Canvas text does not trigger a webfont fetch the way laid-out text does, so
 * every face has to be asked for explicitly before the first fillText.
 */
window.loadFonts = async () => {
  await Promise.all([
    document.fonts.load("700 76px Saira"),
    document.fonts.load("700 25px Saira"),
    document.fonts.load("500 24px " + MONO),
    document.fonts.load("500 19px " + MONO),
    document.fonts.load("500 11px " + MONO),
  ]);
  await document.fonts.ready;
  return [...document.fonts]
    .filter((f) => f.status === "loaded")
    .map((f) => f.family)
    .join(",");
};

function canvas(W, H) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  return c;
}

const pad2 = (n) => String(n).padStart(2, "0");
const clock = (s) =>
  pad2(Math.floor(s / 3600)) + ":" + pad2(Math.floor((s % 3600) / 60)) + ":" + pad2(Math.floor(s % 60));

/* ------------------------------------------------------------------- card */

window.renderCard = (T, segs, enemyHeat, crop, info, size) => {
  const { W, H } = size;
  const c = canvas(W, H);
  const x = c.getContext("2d");
  const V = makeView(T, crop, W, H);

  drawTerrain(x, T, V);
  dimTerrain(x, V, 0.52);
  drawEnemyHeat(x, V, enemyHeat);
  drawTracks(x, V, segs);
  drawScrims(x, W, H, 140, 344);

  drawBrand(x, 54, 38, 300);

  x.letterSpacing = "0px";
  x.font = "700 76px " + DISPLAY;
  x.fillStyle = INK;
  x.fillText(info.title, 54, 490);

  const meta = [info.date, info.duration, info.participants ? info.participants + " players" : null]
    .filter(Boolean)
    .join("   ·   ");
  x.letterSpacing = "1px";
  x.font = "500 24px " + MONO;
  x.fillStyle = INK_MUTED;
  x.fillText(meta, 57, 533);

  /*
   * The instruction goes on the lower line and the Discord address opposite
   * the meta, not the other way round. Measured at 1200px: the full
   * "Watch the full op at …" is 588px, which overruns the date/duration/count
   * line by 114px but clears the legend by 82px. Shortening the title's meta
   * would be the wrong fix — that line grows with the map name.
   */
  x.letterSpacing = "0.5px";
  x.font = "500 17px " + MONO;
  x.fillStyle = INK_FAINT;
  x.fillText(DISCORD, W - 54 - x.measureText(DISCORD).width, 533);

  drawCta(x, W - 54, 581, 20, CTA_LEAD);

  /*
   * No legend. Blue lines against red dots does not need decoding, and a card
   * is a reason to click rather than a diagram to study — the six labelled
   * elements it took to explain itself were competing with the map they were
   * explaining. The page the card links to reads the board properly.
   */

  return c.toDataURL("image/png");
};

/* -------------------------------------------------------------------- gif */

/**
 * Plays the operation forward over `cfg.FRAMES` steps.
 *
 * Movement accumulates on its own layer that fades slightly each step, so a
 * squad leaves a tail that decays instead of a permanent line — the picture
 * stays readable at the end while still showing where everyone has been. The
 * terrain is drawn once and composited underneath.
 */
window.renderGif = (T, tracks, perFrame, crop, info, cfg) => {
  const { W, H, FRAMES, FPS, COLORS } = cfg;
  const V = makeView(T, crop, W, H);
  const { GIFEncoder, quantize, applyPalette } = window.gifenc;

  const bg = canvas(W, H);
  const bgx = bg.getContext("2d");
  drawTerrain(bgx, T, V);
  dimTerrain(bgx, V, 0.55);

  const trail = canvas(W, H);
  const tx = trail.getContext("2d");
  const out = canvas(W, H);
  const ox = out.getContext("2d", { willReadFrequently: true });

  const from = cfg.from ?? 0;
  const to = cfg.to ?? perFrame[perFrame.length - 1][0];
  const span = to - from;

  // The sweep is strictly forward, so each track keeps a cursor rather than
  // being re-scanned every step.
  const cursor = tracks.map(() => 0);
  let pfi = 0;

  const enc = GIFEncoder();
  let palette = null;
  const delay = Math.round(1000 / FPS);

  for (let f = 0; f < FRAMES; f++) {
    const tA = Math.round(from + (span * f) / FRAMES);
    const tB = Math.round(from + (span * (f + 1)) / FRAMES);

    tx.globalCompositeOperation = "destination-out";
    tx.fillStyle = "rgba(0,0,0,0.055)";
    tx.fillRect(0, 0, W, H);
    tx.globalCompositeOperation = "source-over";

    const p = new Path2D();
    for (let i = 0; i < tracks.length; i++) {
      const tr = tracks[i];
      let j = cursor[i];
      let started = false;
      let px = 0;
      let py = 0;
      while (j < tr.length && tr[j][0] < tA) j++;
      while (j < tr.length && tr[j][0] <= tB) {
        const cx = V.tx(tr[j][1]);
        const cy = V.ty(tr[j][2]);
        // A long hop is a respawn or a teleport, not a move worth drawing.
        if (started && Math.hypot(cx - px, cy - py) < 90) p.lineTo(cx, cy);
        else p.moveTo(cx, cy);
        started = true;
        px = cx;
        py = cy;
        j++;
      }
      cursor[i] = j;
    }
    tx.lineJoin = "round";
    tx.lineCap = "round";
    tx.strokeStyle = "rgba(56,124,210,0.30)";
    tx.lineWidth = 3.2;
    tx.stroke(p);
    tx.strokeStyle = "rgba(130,190,255,0.62)";
    tx.lineWidth = 1.1;
    tx.stroke(p);

    while (pfi < perFrame.length - 1 && perFrame[pfi][0] < tB) pfi++;
    const [tNow, friendly, enemy] = perFrame[pfi];

    ox.clearRect(0, 0, W, H);
    ox.drawImage(bg, 0, 0);
    ox.globalCompositeOperation = "lighter";
    ox.drawImage(trail, 0, 0);
    ox.fillStyle = "rgba(226,86,48,0.75)";
    for (let i = 0; i < enemy.length; i += 2) {
      ox.beginPath();
      ox.arc(V.tx(enemy[i]), V.ty(enemy[i + 1]), 1.5, 0, 7);
      ox.fill();
    }
    ox.globalCompositeOperation = "source-over";
    ox.fillStyle = "#cfe6ff";
    for (let i = 0; i < friendly.length; i += 2) {
      ox.beginPath();
      ox.arc(V.tx(friendly[i]), V.ty(friendly[i + 1]), 2.1, 0, 7);
      ox.fill();
    }

    // Taller top scrim than the card's proportionally: the lockup and the
    // title stack here rather than sitting on one line.
    drawScrims(ox, W, H, 96, 70);

    const brandH = drawBrand(ox, 15, 10, 150);
    ox.letterSpacing = "0px";
    ox.font = "700 25px " + DISPLAY;
    ox.fillStyle = INK;
    ox.fillText(info.title, 15, 10 + brandH + 26);

    const bx0 = 15;
    const bx1 = W - 15;
    const by = H - 30;
    ox.lineWidth = 2;
    ox.strokeStyle = "rgba(255,255,255,0.18)";
    ox.beginPath();
    ox.moveTo(bx0, by);
    ox.lineTo(bx1, by);
    ox.stroke();
    ox.strokeStyle = ACCENT;
    ox.beginPath();
    ox.moveTo(bx0, by);
    ox.lineTo(bx0 + (bx1 - bx0) * ((tB - from) / span), by);
    ox.stroke();

    ox.letterSpacing = "1px";
    ox.font = "500 11px " + MONO;
    ox.fillStyle = INK_MUTED;
    ox.fillText(clock(tNow), 15, H - 12);
    ox.letterSpacing = "0.5px";
    ox.fillStyle = INK_FAINT;
    ox.fillText(DISCORD, (W - ox.measureText(DISCORD).width) / 2, H - 12);
    drawCta(ox, W - 15, H - 12, 11, null);

    const data = ox.getImageData(0, 0, W, H).data;
    // One palette for the whole loop: the terrain never changes, and a global
    // table keeps the file far smaller than per-frame tables would.
    if (!palette) palette = quantize(data, COLORS, { format: "rgb565" });
    enc.writeFrame(applyPalette(data, palette, "rgb565"), W, H, {
      palette: f === 0 ? palette : undefined,
      delay,
    });
  }
  enc.finish();

  const bytes = enc.bytes();
  let s = "";
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    s += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK));
  }
  return { data: btoa(s), meta: { W, H, seconds: FRAMES / FPS } };
};
