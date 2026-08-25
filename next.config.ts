import type { NextConfig } from "next";

const LEGACY = "https://legacy.paramarines.net";

/*
 * The old Invision forum lived on this domain until the 2026-08-25 cutover and
 * now sits on legacy.paramarines.net. Its URLs were almost all of the shape
 * /index.php?/forums/… — pathname /index.php, everything else in the query —
 * so that one rule covers the bulk of them. Next forwards the query string to
 * the destination automatically, which is what preserves the deep link.
 *
 * The bare-path entries below catch the handful of Invision routes that can be
 * reached without the index.php prefix. Deliberately absent: /articles, which
 * belongs to this site now — old article URLs carried the index.php prefix and
 * are already handled by the rule above.
 */
const INVISION_PATHS = [
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
  "login",
  "register",
  "lostpassword",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/index.php",
        destination: `${LEGACY}/index.php`,
        permanent: true,
      },
      ...INVISION_PATHS.flatMap((p) => [
        { source: `/${p}`, destination: `${LEGACY}/index.php?/${p}/`, permanent: true },
        {
          source: `/${p}/:path*`,
          destination: `${LEGACY}/index.php?/${p}/:path*`,
          permanent: true,
        },
      ]),
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
