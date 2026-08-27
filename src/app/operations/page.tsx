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
  // No images here on purpose. opengraph-image.tsx generates this page's card
  // from the replay's own metadata, and an explicit images array in the
  // metadata object overrides the file convention, which would silently put
  // the generic site image back.
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/operations`,
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

        <div className="mt-14 max-w-2xl space-y-4 leading-relaxed text-ink-muted">
          <h2 className="heading-display text-2xl text-ink sm:text-3xl">
            How the recording works
          </h2>
          <p>
            Every operation records itself. The command post writes down where
            everyone is, roughly every three seconds, for as long as the op
            runs. Players and AI, both sides, vehicles and aircraft. Nobody
            edits it afterwards and nobody chooses the angles.
          </p>
          <p>
            That means what you&apos;re watching is the operation, not a
            trailer cut from it. Plans that worked and plans that fell apart
            look the same going in.
          </p>

          <h2 className="heading-display mt-10 text-2xl text-ink sm:text-3xl">
            Reading the board
          </h2>
          <p>
            Blue is us, red is whoever we were fighting. Each marker is one
            person or one vehicle, sitting on the real terrain the mission ran
            on. The panel down the side lists the vehicles in play and how many
            people are riding in each.
          </p>
          <p>
            The bar under the map is the whole operation end to end. The marks
            along it are contacts: somebody hit, somebody killed, a vehicle
            destroyed. Long quiet stretches between them are the parts nobody
            puts in a highlight reel, and they are most of an operation.
          </p>

          <h2 className="heading-display mt-10 text-2xl text-ink sm:text-3xl">
            Watching it properly
          </h2>
          <p>
            Drag the timeline to move around. Run it at 64&times; to watch the
            shape of the whole night in a couple of minutes, then drop back to
            1&times; when something starts happening. Pan and zoom the map like
            any other map.
          </p>
          <p>
            Pick one squad and follow it. Watching four markers hold spacing,
            take contact, and work a flank tells you more about how a unit
            actually fights than any amount of writing about it, including
            ours.
          </p>
          <p>
            Names are stripped from the public version. You can see what a
            squad did; you can&apos;t see who was in it.
          </p>
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
