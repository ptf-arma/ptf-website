import type { NextConfig } from "next";

const LEGACY = "https://legacy.paramarines.net";

/*
 * The old Invision forum lived on this domain until the 2026-08-25 cutover and
 * now sits on legacy.paramarines.net. Its URLs were all of the shape
 * /index.php?/forums/… — pathname /index.php, everything else in the query —
 * because it ran friendly URLs without mod_rewrite. The single /index.php rule
 * below therefore covers every real inbound link. Next percent-encodes the
 * forwarded query (?/forums/ becomes ?%2Fforums%2F); Invision serves both forms
 * identically, verified against the live host.
 *
 * The bare paths below are courtesy redirects for anyone typing a URL by hand.
 * They are exact matches only: a destination query string cannot interpolate
 * :path* — Next emits a literal __ESC_COLON_path* instead — and legacy 404s on
 * clean paths anyway, so a deep bare path has nowhere useful to land.
 *
 * Deliberately absent: /articles, which belongs to this site now.
 */
const ARCHIVE_PATHS = [
  "forums",
  "topic",
  "profile",
  "calendar",
  "gallery",
  "staff",
  "leaderboard",
  "discover",
  "messenger",
  "search",
  "perscom",
  "custom-gear",
  "database",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/index.php",
        destination: `${LEGACY}/index.php`,
        permanent: true,
      },
      ...ARCHIVE_PATHS.map((p) => ({
        source: `/${p}`,
        destination: `${LEGACY}/index.php?/${p}/`,
        permanent: true,
      })),
      // Account routes belong to Billet now, not the archived forum — someone
      // typing these wants to sign in or enlist today, not read old threads.
      {
        source: "/login",
        destination: "https://billet.paramarines.net/",
        permanent: true,
      },
      { source: "/register", destination: "/join", permanent: true },
    ];
  },
  images: {
    // Billet serves unit crests/insignia from its /api/img/ path. Allow the
    // current portal host and the planned custom domain. (The API sometimes
    // reports a localhost host in the URL; lib/config#billetImage rewrites it
    // to BILLET_BASE before it reaches <Image>.)
    remotePatterns: [
      { protocol: "https", hostname: "ptf.billet.gg", pathname: "/api/img/**" },
      {
        protocol: "https",
        hostname: "billet.paramarines.net",
        pathname: "/api/img/**",
      },
      // YouTube thumbnails for the unit-film cards in the media section.
      { protocol: "https", hostname: "i.ytimg.com", pathname: "/vi/**" },
    ],
  },
};

export default nextConfig;
