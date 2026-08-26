import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { billet, links, SITE_URL } from "@/lib/config";
import { getAar, getAars, formatOperationDate } from "@/lib/aars";
import { AarBody } from "@/components/aar-body";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

type Params = { slug: string };

/** Prerenders every published AAR. Empty until Billet's endpoint ships. */
export async function generateStaticParams() {
  const aars = await getAars();
  return aars.map((aar) => ({ slug: aar.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const aar = await getAar(slug);
  if (!aar) return {};

  const image = aar.image ?? `${SITE_URL}/og.jpg`;

  return {
    title: aar.title,
    description: aar.summary,
    alternates: { canonical: `/operations/${aar.slug}` },
    openGraph: {
      title: aar.title,
      description: aar.summary,
      url: `${SITE_URL}/operations/${aar.slug}`,
      images: [{ url: image, width: 1200, height: 630 }],
    },
    // Explicit: without this it inherits the homepage's Twitter card.
    twitter: {
      title: aar.title,
      description: aar.summary,
      images: [image],
    },
  };
}

export default async function AarPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const aar = await getAar(slug);
  if (!aar) notFound();

  const image = aar.image ?? `${SITE_URL}/og.jpg`;
  const metaParts = [
    formatOperationDate(aar.operation_date),
    aar.terrain,
    aar.operation_type,
    aar.participants ? `${aar.participants} participants` : null,
  ].filter((part): part is string => Boolean(part));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: aar.title,
    description: aar.summary,
    datePublished: aar.published_at,
    dateModified: aar.updated_at,
    image,
    publisher: { "@id": `${SITE_URL}/#org` },
    mainEntityOfPage: `${SITE_URL}/operations/${aar.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-20 sm:px-6">
        <SectionLabel>After-Action Report</SectionLabel>
        <h1 className="heading-display mt-3 text-4xl text-ink sm:text-5xl">
          {aar.title}
        </h1>
        {metaParts.length > 0 && (
          <p className="micro-label mt-4">{metaParts.join(" · ")}</p>
        )}

        <AarBody format={aar.body_format} body={aar.body} />

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
          <p className="text-sm text-ink-muted">
            This is one operation. We run one every week.
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
            href="/operations"
            className="text-ink-muted underline decoration-edge-bright underline-offset-4 hover:text-ink"
          >
            ← All after-action reports
          </Link>
        </p>
      </article>
    </>
  );
}
