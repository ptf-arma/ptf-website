import type { Metadata } from "next";
import Link from "next/link";
import { billet, links, SITE_URL } from "@/lib/config";
import { roles, statusDot } from "@/lib/roles";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

const title = "Arma 3 Milsim Roles: What Each Billet Actually Does";
const description =
  "Rifleman, marksman, corpsman, ACV crew, pilot, and MSO: what each role does during an operation, what gates it, and who it suits.";

export const metadata: Metadata = {
  // Absolute: the "· Paramarine Task Force" template would push this past the
  // ~60 characters Google renders.
  title: { absolute: title },
  description,
  alternates: { canonical: "/roles" },
  openGraph: {
    title,
    description,
    url: `${SITE_URL}/roles`,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: { title, description },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description,
  author: { "@type": "Organization", name: "Paramarine Task Force" },
  publisher: { "@id": `${SITE_URL}/#org` },
  mainEntityOfPage: `${SITE_URL}/roles`,
  image: `${SITE_URL}/og.jpg`,
  datePublished: "2026-08-25",
  dateModified: "2026-08-25",
};

export default function RolesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6">
        <SectionLabel>Roles</SectionLabel>
        <h1 className="heading-display mt-3 max-w-2xl text-4xl text-ink sm:text-5xl">
          What each billet actually does
        </h1>
        <p className="max-w-2xl mt-5 text-lg leading-relaxed text-ink-muted">
          Everyone joins as an 0311 Rifleman and stays there until they&apos;ve
          got a few operations behind them. Everything else on this page is a
          qualification you earn afterwards, on a course or through selection.
          Worth reading before you decide what you&apos;re aiming at.
        </p>

        <nav
          aria-label="Roles on this page"
          className="mt-8 flex flex-wrap gap-2 border-y border-edge py-4"
        >
          {roles.map((role) => (
            <a
              key={role.slug}
              href={`#${role.slug}`}
              className="micro-label rounded-sm border border-edge bg-surface px-2.5 py-1 text-ink-muted transition-colors hover:border-edge-bright hover:text-ink"
            >
              {role.name}
            </a>
          ))}
        </nav>

        {roles.map((role) => (
          <section key={role.slug} id={role.slug} className="scroll-mt-24">
            <h2 className="heading-display mt-12 text-2xl text-ink sm:text-3xl">
              {role.name}
            </h2>
            <p className="micro-label mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
              {role.designation ? <span>{role.designation}</span> : null}
              <span className="inline-flex items-center gap-1.5">
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 rounded-full ${statusDot(role.status)}`}
                />
                {role.status}
              </span>
            </p>
            <div className="max-w-2xl mt-4 space-y-4 leading-relaxed text-ink-muted">
              {role.detail.map((para) => (
                <p key={para.slice(0, 40)}>{para}</p>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
          <p className="text-sm text-ink-muted">
            Courses run Saturdays. You pick a direction once you&apos;re in.
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
