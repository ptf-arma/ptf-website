import type { Metadata } from "next";
import Link from "next/link";
import { billet, links, SITE_URL } from "@/lib/config";
import {
  getLatestReplay,
  replayEmbedUrl,
  formatDuration,
  formatOperationDate,
} from "@/lib/replay";
import { ReplayEmbed, ReplayEmbedEmpty } from "@/components/replay-embed";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

const title = "Watch an Arma 3 Milsim Operation";
const description =
  "The Paramarine Task Force's most recent operation, played back on the map: every position, every contact, as it happened.";

export const metadata: Metadata = {
  // Absolute: the "· Paramarine Task Force" template would push this past the
  // ~60 characters Google renders.
  title: { absolute: title },
  description,
  alternates: { canonical: "/operations" },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/operations`,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { title, description },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: title,
  description,
  url: `${SITE_URL}/operations`,
  publisher: { "@id": `${SITE_URL}/#org` },
};

export default async function OperationsPage() {
  const replay = await getLatestReplay();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6">
        <SectionLabel>Operations</SectionLabel>
        <h1 className="heading-display mt-3 max-w-2xl text-4xl text-ink sm:text-5xl">
          Our last operation
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
          Every position, every contact, played back on the map. Recorded
          automatically while we played, not edited afterwards. This is the
          most recent one we&apos;ve released.
        </p>

        <div className="mt-8">
          {replay ? (
            <ReplayEmbed
              src={replayEmbedUrl()}
              title={replay.title}
              meta={[
                formatOperationDate(replay.startedAt),
                replay.world,
                formatDuration(replay.durationSeconds),
                replay.participants ? `${replay.participants} on the ground` : null,
              ]
                .filter(Boolean)
                .join(" · ")}
            />
          ) : (
            <ReplayEmbedEmpty portalUrl={billet.base} />
          )}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
          <p className="text-sm text-ink-muted">
            The main operation runs Sundays, 8PM Eastern. Come see one.
          </p>
          <div className="flex gap-3">
            <ButtonLink href={links.discord} variant="secondary" size="md">
              Join our Discord
            </ButtonLink>
            <ButtonLink href={billet.applyUrl} variant="primary" size="md">
              Enlist Now
            </ButtonLink>
          </div>
        </div>
        <p className="mt-6 text-sm">
          <Link
            href="/join"
            className="text-ink-muted underline decoration-edge-bright underline-offset-4 hover:text-ink"
          >
            ← How joining works
          </Link>
        </p>
      </article>
    </>
  );
}
