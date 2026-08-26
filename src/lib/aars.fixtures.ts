/**
 * Sample AARs for local development, used only when AAR_FIXTURES=1.
 *
 * These are invented illustrations of the shape in docs/aar-api-contract.md,
 * NOT real operations. They exist so the /operations pages can be built and
 * reviewed before Billet's endpoint ships. Never enable this flag in
 * production — publishing fictional operations as if they were real history
 * would be worse than an empty page.
 */

import type { Aar } from "@/lib/aars";

export const fixtureAars: Aar[] = [
  {
    slug: "sample-operation-iron-tide",
    title: "SAMPLE — Operation Iron Tide",
    operation_date: "2026-08-23",
    published_at: "2026-08-25T14:02:00Z",
    updated_at: "2026-08-25T14:02:00Z",
    terrain: "Altis",
    operation_type: "Amphibious assault",
    summary:
      "Sample fixture data. Two platoons landed south of Kavala against dug-in armour, with MAG-36 running CAS.",
    participants: 42,
    image: null,
    author: { name: "Sample Author", rank: "Capt" },
    body_format: "markdown",
    body: [
      "This is fixture data used to build the operations pages before the Billet endpoint exists. It is not a real operation.",
      "",
      "## Situation",
      "",
      "Sample prose describing the enemy disposition and the ground.",
      "",
      "## Execution",
      "",
      "Sample prose walking through the phases of the assault.",
      "",
      "## Lessons",
      "",
      "- Sample lesson one",
      "- Sample lesson two",
    ].join("\n"),
  },
  {
    slug: "sample-recon-patrol-livonia",
    title: "SAMPLE — Recon Patrol, Northern Livonia",
    operation_date: "2026-08-20",
    published_at: "2026-08-21T09:15:00Z",
    updated_at: "2026-08-21T09:15:00Z",
    terrain: "Livonia",
    operation_type: "Recon patrol",
    summary:
      "Sample fixture data. An MSO element moved to observe a crossing point and withdrew without contact.",
    participants: 8,
    image: null,
    author: { name: "Sample Author", rank: "SSgt" },
    body_format: "markdown",
    body: [
      "Fixture data. Not a real operation.",
      "",
      "The element crossed the line of departure before first light and held an observation post through the morning.",
    ].join("\n"),
  },
];
