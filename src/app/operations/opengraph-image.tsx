import { ImageResponse } from "next/og";
import { getLatestReplay, formatDuration, formatOperationDate,
  formatWorld } from "@/lib/replay";

/*
 * Share card for the replay page.
 *
 * Recruits find this unit through Discord and Reddit, where a link is a card
 * before it is a page. Every other page here shares one static og.jpg, so a
 * post about last Sunday's operation looked identical to a post about the
 * rank ladder. This one carries the operation itself: what it was called,
 * where it ran, how long, how many turned out.
 *
 * This is now the FALLBACK card. When scripts/op-assets has been run for the
 * live replay, page.tsx points the metadata at a rendered map instead and this
 * route is not used. It still matters: it needs no build step, so it is always
 * current, and it covers the window between an operation being published in
 * Billet and somebody regenerating the assets.
 *
 * Typographic on purpose, for the same reason. Drawing the board needs 50MB of
 * frame data and a real canvas, neither of which belongs in a route a crawler
 * can hit; the facts are what make somebody click and they are already here.
 */

export const alt = "The Paramarine Task Force's most recent Arma 3 operation";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const replay = await getLatestReplay();

  const meta = replay
    ? [
        formatOperationDate(replay.startedAt),
        formatWorld(replay.world),
        formatDuration(replay.durationSeconds),
        replay.participants ? `${replay.participants} players` : null,
      ]
        .filter(Boolean)
        .join("   ·   ")
    : "Operations every Sunday, 8PM Eastern";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b0d12",
          padding: "72px",
          color: "#e7e9ed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              letterSpacing: "0.22em",
              color: "#6f7683",
            }}
          >
            PARAMARINE TASK FORCE
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 8,
              fontSize: 26,
              letterSpacing: "0.18em",
              color: "#4a7fd4",
            }}
          >
            LAST OPERATION
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 82, fontWeight: 700, lineHeight: 1.05 }}>
            {replay ? replay.title : "Watch an operation"}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 30,
              color: "#9aa3b0",
              letterSpacing: "0.04em",
            }}
          >
            {meta}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            borderTop: "2px solid rgba(255,255,255,0.12)",
            paddingTop: 24,
            fontSize: 24,
            color: "#6f7683",
          }}
        >
          <div style={{ display: "flex" }}>
            Every position, every contact, played back on the map
          </div>
          <div style={{ display: "flex", color: "#e03127", letterSpacing: "0.14em" }}>
            PARAMARINES.NET
          </div>
        </div>
      </div>
    ),
    size,
  );
}
