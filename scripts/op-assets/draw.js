/*
 * The operation layer: enemy presence and friendly movement, drawn over the
 * terrain. Injected as a plain script alongside map.js.
 *
 * Everything here composites with 'lighter' (additive). Overlapping passes
 * therefore accumulate, which is the point — the places a squad sat for twenty
 * minutes glow, and a single transit line barely registers. It also means the
 * alphas are deliberately tiny; at ordinary values a three-hour operation
 * saturates to white and reads as nothing at all.
 */

const OP_DEFAULTS = {
  dim: 0.6, // knock the terrain back so movement carries the image
  groundWide: 0.075, // soft underglow beneath each track
  groundThin: 0.22, // the bright hairline on top
  airA: 0.13, // aircraft, deliberately fainter than boots
  enemyA: 0.07,
  enemyR: 2.4,
};

/** One Path2D across many polyline segments, in canvas space. */
function segPath(V, segs) {
  const p = new Path2D();
  for (const s of segs) {
    p.moveTo(V.tx(s[0][0]), V.ty(s[0][1]));
    for (let i = 1; i < s.length; i++) p.lineTo(V.tx(s[i][0]), V.ty(s[i][1]));
  }
  return p;
}

/** Flatten the terrain so the operation layer reads on top of it. */
function dimTerrain(ctx, V, dim) {
  ctx.fillStyle = "rgba(8,12,20," + dim + ")";
  ctx.fillRect(0, 0, V.W, V.H);
}

/** Every enemy position across the operation, as accumulated heat. */
function drawEnemyHeat(ctx, V, pts, opts) {
  const o = { ...OP_DEFAULTS, ...opts };
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = "rgba(224,80,45," + o.enemyA + ")";
  for (let i = 0; i < pts.length; i += 2) {
    ctx.beginPath();
    ctx.arc(V.tx(pts[i]), V.ty(pts[i + 1]), o.enemyR, 0, 7);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

/** Friendly movement for the whole operation: {ground, air} segment lists. */
function drawTracks(ctx, V, segs, opts) {
  const o = { ...OP_DEFAULTS, ...opts };
  ctx.globalCompositeOperation = "lighter";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  if (segs.air.length) {
    ctx.strokeStyle = "rgba(120,180,255," + o.airA + ")";
    ctx.lineWidth = 1.1;
    ctx.stroke(segPath(V, segs.air));
  }
  const pg = segPath(V, segs.ground);
  ctx.strokeStyle = "rgba(60,130,215," + o.groundWide + ")";
  ctx.lineWidth = 6;
  ctx.stroke(pg);
  ctx.strokeStyle = "rgba(110,180,255," + o.groundThin + ")";
  ctx.lineWidth = 1.6;
  ctx.stroke(pg);

  ctx.globalCompositeOperation = "source-over";
}

/** Top and bottom scrims, so overlaid type stays legible over any terrain. */
function drawScrims(ctx, W, H, topH, botH) {
  let g = ctx.createLinearGradient(0, 0, 0, topH);
  g.addColorStop(0, "rgba(11,13,18,0.86)");
  g.addColorStop(1, "rgba(11,13,18,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, topH);

  g = ctx.createLinearGradient(0, H, 0, H - botH);
  g.addColorStop(0, "rgba(11,13,18,0.97)");
  g.addColorStop(0.5, "rgba(11,13,18,0.80)");
  g.addColorStop(1, "rgba(11,13,18,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, H - botH, W, botH);
}
