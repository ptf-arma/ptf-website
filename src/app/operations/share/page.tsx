import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/config";
import { getLatestReplay } from "@/lib/replay";
import { getOpAssets, opAssetsAreStale, formatBytes } from "@/lib/op-assets";
import { CopyButton } from "@/components/copy-button";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

const OPERATIONS_URL = `${SITE_URL}/operations`;

/*
 * Stable aliases, rewritten onto the current replay's files in next.config.ts.
 * These are what somebody embeds elsewhere: the address stays put while the
 * operation behind it changes every week.
 */
const EMBED_PNG = `${SITE_URL}/operations/share/embed.png`;
const EMBED_GIF = `${SITE_URL}/operations/share/embed.gif`;

export const metadata: Metadata = {
  title: { absolute: "Share this operation · Paramarine Task Force" },
  description: "Share assets for the unit's latest operation.",
  // A tool for our own recruiters, not a page anyone should arrive at cold.
  robots: { index: false, follow: true },
};

function Asset({
  heading,
  href,
  filename,
  bytes,
  embedUrl,
  children,
}: {
  heading: string;
  href: string;
  filename: string;
  bytes: number;
  embedUrl: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-sm border border-edge bg-surface p-5">
      <div className="overflow-hidden rounded-sm border border-edge bg-bg">
        {children}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <h2 className="mr-auto font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink">
          {heading}
        </h2>
        <CopyButton value={embedUrl} label="Copy image link" />
        <a
          href={href}
          download={filename}
          className="inline-flex items-center justify-center gap-2 rounded-sm border border-edge-bright px-4 py-2 font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Download · {formatBytes(bytes)}
        </a>
      </div>
    </section>
  );
}

export default async function SharePage() {
  const replay = await getLatestReplay();
  const assets = getOpAssets(replay?.id);
  const stale = opAssetsAreStale(replay?.id);

  return (
    <article className="mx-auto max-w-3xl px-4 pb-20 pt-20 sm:px-6">
      <SectionLabel>Recruiting</SectionLabel>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="heading-display text-4xl text-ink sm:text-5xl">
          Share this operation
        </h1>
        <CopyButton value={OPERATIONS_URL} label="Copy link" variant="primary" />
      </div>

      {assets ? (
        <>
          <p className="mt-4 text-sm text-ink-faint">
            {assets.title} · {assets.date}
          </p>

          <div className="mt-8 space-y-6">
            <Asset
              heading="Still card"
              href={assets.card}
              filename="paramarines-operation-card.png"
              bytes={assets.cardBytes}
              embedUrl={EMBED_PNG}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assets.card}
                alt={`${assets.title}: friendly movement and enemy positions drawn on the map`}
                width={1200}
                height={630}
                className="w-full"
              />
            </Asset>

            <Asset
              heading={`Animation · ${assets.gifSeconds}s`}
              href={assets.gif}
              filename="paramarines-operation.gif"
              bytes={assets.gifBytes}
              embedUrl={EMBED_GIF}
            >
              {/* A plain img: Next's optimiser would strip the animation. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={assets.gif}
                alt={`${assets.title}: the operation playing back, friendly units moving across the map`}
                width={assets.gifWidth}
                height={assets.gifHeight}
                className="w-full"
              />
            </Asset>
          </div>
        </>
      ) : (
        <div className="mt-8 rounded-sm border border-edge bg-surface px-5 py-8">
          <p className="text-ink-muted">
            {stale
              ? "A newer operation has been published, but its share assets haven't been generated yet. They arrive with the next deploy."
              : "No operation has been published yet. The card and the animation appear here once one is released."}
          </p>
          <div className="mt-4">
            <ButtonLink href="/operations" variant="secondary" size="md">
              Back to the replay
            </ButtonLink>
          </div>
        </div>
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
