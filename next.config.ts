import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
