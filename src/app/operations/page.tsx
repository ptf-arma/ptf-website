import type { Metadata } from "next";
import Link from "next/link";
import { billet, links, SITE_URL } from "@/lib/config";
import { getAars, formatOperationDate, type AarSummary } from "@/lib/aars";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

const title = "Arma 3 Milsim After-Action Reports";
const description =
  "After-action reports from Paramarine Task Force Arma 3 operations: mission type, terrain, and how each one played out.";

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

const collectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: title,
  description,
  url: `${SITE_URL}/operations`,
  publisher: { "@id": `${SITE_URL}/#org` },
};

function AarRow({ aar }: { aar: AarSummary }) {
  return (
    <li>
      <Link
        href={`/operations/${aar.slug}`}
        className="group block px-1 py-5 transition-colors hover:bg-raised sm:px-2"
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h2 className="font-display text-lg font-semibold text-ink">
            {aar.title}
          </h2>
          <span className="micro-label shrink-0 text-ink-faint">
            {formatOperationDate(aar.operation_date)}
          </span>
        </div>
        {aar.operation_type || aar.terrain || aar.participants ? (
          <p className="micro-label mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-ink-muted">
            {aar.operation_type ? <span>{aar.operation_type}</span> : null}
            {aar.terrain ? <span>{aar.terrain}</span> : null}
            {aar.participants ? (
              <span>{aar.participants} participants</span>
            ) : null}
          </p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          {aar.summary}
        </p>
      </Link>
    </li>
  );
}

export default async function OperationsPage() {
  const aars = await getAars();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-20 sm:px-6">
        <SectionLabel>Operations</SectionLabel>
        <h1 className="heading-display mt-3 text-4xl text-ink sm:text-5xl">
          After-action reports
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          What happened on each operation: the mission, the terrain, who
          showed up, and how it went. Written up by the people who ran it.
        </p>

        {aars.length > 0 ? (
          <ul className="mt-10 divide-y divide-edge border-y border-edge">
            {aars.map((aar) => (
              <AarRow key={aar.slug} aar={aar} />
            ))}
          </ul>
        ) : (
          <div className="mt-10 rounded-sm border border-edge bg-surface px-5 py-8 text-center">
            <p className="text-ink-muted">
              No reports yet. They&apos;ll appear here as operations get
              written up.
            </p>
          </div>
        )}

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
