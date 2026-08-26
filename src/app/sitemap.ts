import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";

/*
 * lastModified is hand-maintained rather than stamped at build time. A build
 * timestamp would claim every page changed on every deploy, which is false and
 * teaches crawlers to ignore the field. Update the date here when a page's
 * content actually changes.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: "2026-08-25",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/join`,
      lastModified: "2026-08-25",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/recruit`,
      lastModified: "2026-08-25",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/roles`,
      lastModified: "2026-08-25",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/progression`,
      lastModified: "2026-07-18",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/milsim-guide`,
      lastModified: "2026-08-25",
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];
}
