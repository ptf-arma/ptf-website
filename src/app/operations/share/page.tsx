import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/config";
import { getLatestReplay } from "@/lib/replay";
import { getOpAssets, opAssetsAreStale, formatBytes } from "@/lib/op-assets";
import { CopyField } from "@/components/copy-field";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

const OPERATIONS_URL = `${SITE_URL}/operations`;

export const metadata: Metadata = {
  title: { absolute: "Share this operation · Paramarine Task Force" },
  description: "Assets and post text for sharing the unit's latest operation.",
  // A tool for our own recruiters, not a page anyone should arrive at from a
  // search. Keeping it out of the index also keeps it out of the sitemap's way.
  robots: { index: false, follow: true },
};

/** A downloadable asset with a preview of what it actually looks like. */
function AssetBlock({
  heading,
  note,
  href,
  filename,
  bytes,
  children,
}: {
  heading: string;
  note: string;
  href: string;
  filename: string;
  bytes: number;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-sm border border-edge bg-surface p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-md">
          <h2 className="heading-display text-xl text-ink">{heading}</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">{note}</p>
        </div>
        <a
          href={href}
          download={filename}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-edge-bright px-4 py-2 font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Download · {formatBytes(bytes)}
        </a>
      </div>
      <div className="mt-4 overflow-hidden rounded-sm border border-edge bg-bg">
        {children}
      </div>
    </section>
  );
}

export default async function SharePage() {
  const replay = await getLatestReplay();
  const assets = getOpAssets(replay?.id);
  const stale = opAssetsAreStale(replay?.id);

  const redditTitle = assets
    ? `We record every operation from the command post. This is ${assets.participants ?? "our"} players over ${Math.round(assets.durationSeconds / 3600)} hours on ${assets.world ?? "one map"}, played back on the map.`
    : "";

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-20 sm:px-6">
      <SectionLabel>Recruiting</SectionLabel>
      <h1 className="heading-display mt-3 text-4xl text-ink sm:text-5xl">
        Share this operation
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Everything below is generated from the operation itself. Take the
        assets, post them, and point people back at the replay.
      </p>

      {!assets && (
        <div className="mt-8 rounded-sm border border-edge bg-surface px-5 py-8">
          <p className="text-ink-muted">
            {stale
              ? "A newer operation has been published in Billet, but its share assets haven't been generated yet. Until they are, there is nothing here worth posting — running npm run op:assets and deploying will fill this page in."
              : "No operation has been published yet. Once one is released and its assets are generated, the card and the animation appear here."}
          </p>
          <div className="mt-4">
            <ButtonLink href="/operations" variant="secondary" size="md">
              Back to the replay
            </ButtonLink>
          </div>
        </div>
      )}

      {assets && (
        <>
          <p className="mt-3 text-sm text-ink-faint">
            {assets.title} · {assets.date}
          </p>

          <div className="mt-8 space-y-6">
            <AssetBlock
              heading="The still card"
              note="This is what a link to the operations page already shows on its own, anywhere a link gets a preview. You only need the file if you're posting the image directly."
              href={assets.card}
              filename="paramarines-operation-card.png"
              bytes={assets.cardBytes}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assets.card}
                alt={`${assets.title}: friendly movement and enemy positions drawn on the map`}
                width={1200}
                height={630}
                className="w-full"
              />
            </AssetBlock>

            <AssetBlock
              heading="The animation"
              note={`${assets.gifSeconds} seconds, the whole operation from insertion to the last contact. This is the one to upload directly to Reddit.`}
              href={assets.gif}
              filename="paramarines-operation.gif"
              bytes={assets.gifBytes}
            >
              {/* A plain img: Next's optimiser would strip the animation. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assets.gif}
                alt={`${assets.title}: the operation playing back, friendly units moving across the map as the enemy force is reduced`}
                width={assets.gifWidth}
                height={assets.gifHeight}
                className="w-full"
              />
            </AssetBlock>
          </div>

          <h2 className="heading-display mt-14 text-2xl text-ink sm:text-3xl">
            Posting to Reddit
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-ink-muted">
            <p>
              Reddit will not play our replay inside a post. Nothing on our site
              can make it — Reddit only embeds media from its own servers and a
              short list of approved sites, and we will never be on it. So there
              are two ways to post, and they are not equally good.
            </p>
            <p>
              <strong className="text-ink">Upload the animation as an image post.</strong>{" "}
              Reddit hosts it, plays it automatically in the feed, and shows it
              at full size. Put the link in the first comment. This is what to
              do almost every time.
            </p>
            <p>
              <strong className="text-ink">Or post the link on its own.</strong>{" "}
              Reddit will pull the still card from the page. It works, and it
              takes one step, but it is a thumbnail next to a headline rather
              than something moving in front of somebody.
            </p>
            <p>
              Either way the card and the animation carry the domain, so they
              still say who we are once somebody saves the image and reposts it
              somewhere we are not.
            </p>
          </div>

          <div className="mt-6 space-y-4">
            <CopyField label="Link to post" value={OPERATIONS_URL} />
            <CopyField label="Suggested title" value={redditTitle} />
            <CopyField
              label="Suggested first comment"
              value={`The full replay is here, and you can scrub through it yourself: ${OPERATIONS_URL}`}
            />
          </div>

          <h2 className="heading-display mt-14 text-2xl text-ink sm:text-3xl">
            Everywhere else
          </h2>
          <div className="mt-4 space-y-4 leading-relaxed text-ink-muted">
            <p>
              In Discord, paste the link and stop. Discord reads the card off
              the page and renders it large, so attaching the image as well just
              posts the same picture twice.
            </p>
            <p>
              On anything that takes video, upload the animation. Anywhere else,
              the still card is a normal image and behaves like one.
            </p>
          </div>
        </>
      )}

      <p className="mt-12 text-sm">
        <Link
          href="/operations"
          className="text-ink-muted underline decoration-edge-bright underline-offset-4 hover:text-ink"
        >
          ← Back to the operation
        </Link>
      </p>
    </article>
  );
}
