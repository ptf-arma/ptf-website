/*
 * Everything that runs inside the headless browser. render.mjs injects this
 * after map.js and draw.js and calls the three globals below.
 */

const INK = "#e7e9ed";
const INK_MUTED = "#9aa3b0";
const INK_FAINT = "#8b93a0";
const ACCENT = "#e03127";
const FRIENDLY = "#4a8fe0";
const HOSTILE = "#e0502d";

const MONO = '"JetBrains Mono",ui-monospace,monospace';
const DISPLAY = "Saira,ui-sans-serif,system-ui,sans-serif";

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

  x.letterSpacing = "4px";
  x.font = "500 19px " + MONO;
  x.fillStyle = INK_MUTED;
  x.fillText("PARAMARINE TASK FORCE", 56, 60);

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

  x.letterSpacing = "3px";
  x.font = "500 21px " + MONO;
  x.fillStyle = ACCENT;
  const domain = "PARAMARINES.NET";
  x.fillText(domain, W - 54 - x.measureText(domain).width, 533);

  x.letterSpacing = "2px";
  x.font = "500 17px " + MONO;
  x.strokeStyle = FRIENDLY;
  x.lineWidth = 3;
  x.beginPath();
  x.moveTo(58, 575);
  x.lineTo(84, 575);
  x.stroke();
  x.fillStyle = INK_FAINT;
  x.fillText("OUR MOVEMENT", 94, 581);
  x.fillStyle = HOSTILE;
  x.beginPath();
  x.arc(292, 574, 4.5, 0, 7);
  x.fill();
  x.fillStyle = INK_FAINT;
  x.fillText("ENEMY PRESENCE", 306, 581);

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

    drawScrims(ox, W, H, 54, 70);

    ox.letterSpacing = "2.5px";
    ox.font = "500 10px " + MONO;
    ox.fillStyle = INK_FAINT;
    ox.fillText("PARAMARINE TASK FORCE", 16, 22);
    ox.letterSpacing = "0px";
    ox.font = "700 25px " + DISPLAY;
    ox.fillStyle = INK;
    ox.fillText(info.title, 15, 45);

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
    ox.letterSpacing = "2px";
    ox.fillStyle = ACCENT;
    const domain = "PARAMARINES.NET";
    ox.fillText(domain, W - 15 - ox.measureText(domain).width, H - 12);

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
