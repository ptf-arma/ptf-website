import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/config";
import { getAars } from "@/lib/aars";

/*
 * Static pages carry a hand-maintained lastModified. A build timestamp would
 * claim every page changed on every deploy, which is false and teaches crawlers
 * to ignore the field. Update the date here when a page's content changes.
 *
 * After-action reports are appended from Billet instead, since there will
 * eventually be dozens a year and their real modified dates come with them.
 * getAars() returns [] while Billet's endpoint is absent, so the sitemap simply
 * carries the static pages until it ships.
 */
const staticPages: MetadataRoute.Sitemap = [
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
    url: `${SITE_URL}/operations`,
    lastModified: "2026-08-25",
    changeFrequency: "weekly",
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const aars = await getAars(1000);
  return [
    ...staticPages,
    ...aars.map((aar) => ({
      url: `${SITE_URL}/operations/${aar.slug}`,
      lastModified: aar.updated_at.slice(0, 10),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
