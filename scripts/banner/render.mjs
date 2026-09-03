/*
 * Draft banners for the unit's listings on milsimunits.com and similar
 * directories.
 *
 *   node scripts/banner/render.mjs                 all concepts
 *   node scripts/banner/render.mjs d-cycle         just one
 *   node scripts/banner/render.mjs --sheets        also write PNG contact sheets
 *   node scripts/banner/render.mjs --size=1000x250 a different 4:1 output
 *
 * Drafts land in public/brand/banners/ (gitignored scratch). The chosen
 * banner goes to public/brand/ptf-banner.gif and is committed — see PUBLISHED
 * below. Nothing in src/ imports either; living under public/ is what gives
 * the banner a URL to hand to a directory, which is the whole job.
 *
 * The rendering approach is lifted from scripts/op-assets: a real canvas in
 * headless Chrome, encoded with gifenc. Node has no canvas, and the concepts
 * need image filters, gradients and webfonts that only a browser gives us.
 */

import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import puppeteer from "puppeteer-core";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");
const OUT_DIR = join(ROOT, "public", "brand", "banners");

/*
 * Concepts that are no longer drafts.
 *
 * The chosen banner is published beside the other brand files rather than in
 * the drafts folder, so it has a stable address to hand to a directory:
 *
 *   https://paramarines.net/brand/ptf-banner.gif
 *
 * It is written here INSTEAD of the drafts copy, not as well as it — two
 * copies of an 800KB binary in the repo is how the published one goes stale
 * without anyone noticing. Everything under banners/ is regenerable scratch
 * and is gitignored; this file is a committed asset.
 */
const PUBLISHED = {
  "d-cycle": join(ROOT, "public", "brand", "ptf-banner.gif"),
};

/* 255 colours plus one reserved as the "unchanged" index — see page.js. */
const COLORS = 256;

/*
 * Output size. Must stay 4:1 — milsimunits.com crops to that ratio, and the
 * design space in page.js is 900x225. Override with --size=WxH.
 */
const OUT = { W: 1200, H: 300 };

/*
 * Edge is listed alongside Chrome. It is the same Chromium and it is the
 * browser actually installed on the machine this gets run from.
 */
const BROWSER_CANDIDATES = [
  process.env.CHROME_PATH,
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
].filter(Boolean);

function findBrowser() {
  const hit = BROWSER_CANDIDATES.find((p) => existsSync(p));
  if (!hit) {
    throw new Error(
      "No Chrome or Edge found. Set CHROME_PATH to a Chromium binary.\n" +
        "Tried:\n  " + BROWSER_CANDIDATES.join("\n  "),
    );
  }
  return hit;
}

/** Images travel as data URIs so the render page can live anywhere. */
const ASSETS = {
  emblem: "public/brand/ptf-emblem-652w.png",
  marpat: "public/media/marpat.jpg",
  nightDrop: "public/media/night-drop.jpg",
  haloJump: "public/media/halo-jump.jpg",
  fallujah: "public/media/out-of-fallujah.jpg",
  church: "public/media/church-holdup.jpg",
};

const MIME = { png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg" };

function dataUri(rel) {
  const buf = readFileSync(join(ROOT, rel));
  const ext = rel.split(".").pop().toLowerCase();
  return `data:${MIME[ext]};base64,${buf.toString("base64")}`;
}

function buildPage(gifencSource) {
  return `<!doctype html><html><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Saira+Condensed:wght@600&family=JetBrains+Mono:wght@400&display=swap" rel="stylesheet">
</head><body style="margin:0;background:#0b0d12">
<script>var exports={},module={exports:exports};</script>
<script>${gifencSource}</script>
<script>window.gifenc=module.exports;</script>
<script>${readFileSync(join(HERE, "page.js"), "utf8")}</script>
</body></html>`;
}

const kb = (n) => (n / 1024).toFixed(0) + " KB";

async function main() {
  const browser = findBrowser();
  console.log(`Browser: ${browser}`);

  const args = process.argv.slice(2);
  const wantSheets = args.includes("--sheets");
  const only = args.filter((a) => !a.startsWith("--"));

  const gifenc = readFileSync(
    join(ROOT, "node_modules", "gifenc", "dist", "gifenc.js"),
    "utf8",
  );

  mkdirSync(OUT_DIR, { recursive: true });
  const pageFile = join(OUT_DIR, ".render.html");
  writeFileSync(pageFile, buildPage(gifenc));

  const b = await puppeteer.launch({
    executablePath: browser,
    headless: true,
    protocolTimeout: 600000,
    args: [
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--force-device-scale-factor=1",
      "--no-first-run",
      "--no-default-browser-check",
    ],
  });

  try {
    const page = await b.newPage();
    page.on("pageerror", (e) => console.error("  [page]", e.message));
    page.on("console", (m) => {
      if (m.type() === "error") console.error("  [console]", m.text());
    });
    await page.goto(pathToFileURL(pageFile).href, { waitUntil: "networkidle0" });

    const fonts = await page.evaluate(() => window.loadFonts());
    if (!fonts.includes("Saira Condensed")) {
      console.warn("  ! Saira Condensed did not load — type will fall back.");
    }

    const sizeArg = args.find((a) => a.startsWith("--size="));
    if (sizeArg) {
      const [w, h] = sizeArg.slice(7).split("x").map(Number);
      if (w && h) {
        OUT.W = w;
        OUT.H = h;
      }
    }
    if (Math.abs(OUT.W / OUT.H - 4) > 0.001) {
      console.warn(`  ! ${OUT.W}x${OUT.H} is not 4:1; the layout will distort.`);
    }
    console.log(`Output:  ${await page.evaluate((w, h) => window.setOutput(w, h), OUT.W, OUT.H)}`);

    const uris = Object.fromEntries(
      Object.entries(ASSETS).map(([k, v]) => [k, dataUri(v)]),
    );
    console.log("Assets:  " + (await page.evaluate((u) => window.loadAssets(u), uris)));

    const names = await page.evaluate(() => window.conceptNames());
    const todo = only.length ? names.filter((n) => only.includes(n)) : names;
    if (!todo.length) {
      console.error(`No such concept. Available: ${names.join(", ")}`);
      process.exitCode = 1;
      return;
    }

    console.log("");
    for (const name of todo) {
      const out = await page.evaluate(
        (n, c) => window.renderBanner(n, c),
        name, COLORS,
      );
      const buf = Buffer.from(out.data, "base64");
      const dest = PUBLISHED[name] ?? join(OUT_DIR, `${name}.gif`);
      writeFileSync(dest, buf);
      console.log(
        `  ${name.padEnd(14)} ${kb(buf.length).padStart(8)}  ` +
          `${out.meta.W}x${out.meta.H}  ${out.meta.frames} frames  ` +
          `${out.meta.seconds}s  ${out.meta.staticPct}% unchanged` +
          (PUBLISHED[name] ? `\n  ${" ".repeat(14)} -> ${relative(ROOT, dest)}` : ""),
      );

      if (wantSheets) {
        const sheet = await page.evaluate((n) => window.renderSheet(n, 6), name);
        writeFileSync(
          join(OUT_DIR, `${name}-sheet.png`),
          Buffer.from(sheet.split(",")[1], "base64"),
        );
      }
    }
  } finally {
    await b.close();
    rmSync(pageFile, { force: true });
  }

  console.log(
    `\nDrafts in public/brand/banners/ (gitignored).` +
      `\nPublished banner: public/brand/ptf-banner.gif` +
      `\n  -> https://paramarines.net/brand/ptf-banner.gif once deployed.`,
  );
}

main().catch((e) => {
  console.error(`\n${e.stack ?? e}`);
  process.exitCode = 1;
});
