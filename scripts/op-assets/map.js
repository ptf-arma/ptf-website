/*
 * Terrain drawing. Injected into the headless browser as a plain script, so it
 * declares globals rather than exporting — see render.mjs.
 *
 * Two coordinate spaces meet here and they do not agree:
 *   - Billet's terrain paths are world coords with y already flipped for SVG
 *     (y increases downward).
 *   - Frame entity coords are raw Arma (y increases north).
 * The view works in terrain space; entY() converts an entity's y into it.
 * Getting this backwards puts the whole operation out to sea, which is the
 * quickest way to notice it.
 */

/** Fit `bbox` (terrain space) into a W×H canvas, widening it to the canvas aspect. */
function makeView(T, bbox, W, H) {
  const [x0, y0, x1, y1] = bbox;
  const ar = W / H;
  let cw = x1 - x0;
  let ch = y1 - y0;
  const cx = (x0 + x1) / 2;
  const cy = (y0 + y1) / 2;
  if (cw / ch < ar) cw = ch * ar;
  else ch = cw / ar;
  const k = W / cw;
  return {
    k,
    cx,
    cy,
    W,
    H,
    S: T.worldSize,
    tx(x) {
      return (x - cx) * k + W / 2;
    },
    ty(y) {
      return (y - cy) * k + H / 2;
    },
    /** Transform the context so raw terrain path data draws in place. */
    apply(ctx) {
      ctx.translate(W / 2, H / 2);
      ctx.scale(k, k);
      ctx.translate(-cx, -cy);
    },
  };
}

/** Arma y (north-up) into terrain space (y-down). */
function entY(V, y) {
  return V.S - y;
}

function drawTerrain(ctx, T, V) {
  const P = (s) => new Path2D(s);
  const lw = 1 / V.k;

  ctx.fillStyle = "#08111c";
  ctx.fillRect(0, 0, V.W, V.H);

  ctx.save();
  V.apply(ctx);

  if (T.land) {
    ctx.fillStyle = "#161b1e";
    ctx.fill(P(T.land));
  }
  // Elevation bands stack, so each one lightens the ground it covers.
  for (const b of T.bands) {
    ctx.fillStyle = "rgba(255,255,255,0.032)";
    ctx.fill(P(b.path));
  }
  for (const s of T.surfaces) {
    ctx.fillStyle =
      s.cls === "forest"
        ? "rgba(88,138,78,0.18)"
        : s.cls === "sand"
          ? "rgba(190,170,120,0.10)"
          : "rgba(205,205,205,0.07)";
    ctx.fill(P(s.path));
  }
  ctx.lineWidth = lw * 0.9;
  ctx.strokeStyle = "rgba(255,255,255,0.055)";
  for (const c of T.contours) ctx.stroke(P(c.path));

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const r of T.roads) {
    ctx.strokeStyle =
      r.cls === "main"
        ? "rgba(232,218,182,0.45)"
        : r.cls === "road"
          ? "rgba(222,212,188,0.28)"
          : "rgba(200,195,180,0.15)";
    ctx.lineWidth = (r.cls === "main" ? 3.2 : r.cls === "road" ? 2.2 : 1.4) * lw;
    ctx.stroke(P(r.path));
  }

  // Buildings are [x, y, rotation, width, height] rather than paths.
  ctx.fillStyle = "rgba(255,255,255,0.17)";
  for (const [bx, by, dir, bw, bh] of T.buildings) {
    ctx.save();
    ctx.translate(bx, by);
    ctx.rotate((dir * Math.PI) / 180);
    ctx.fillRect(-bw / 2, -bh / 2, bw, bh);
    ctx.restore();
  }

  ctx.restore();
}
