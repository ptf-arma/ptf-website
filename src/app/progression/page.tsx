/* eslint-disable @next/next/no-img-element */
import type { Metadata } from "next";
import Link from "next/link";
import { billet, SITE_URL } from "@/lib/config";
import { getAwards, getRanks, type BilletRank } from "@/lib/billet";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata: Metadata = {
  title: "Ranks & Progression",
  description:
    "The Paramarine Task Force rank structure, promotion requirements, and awards — live from our personnel system. Real progression in an Arma 3 milsim unit.",
  alternates: { canonical: "/progression" },
  openGraph: {
    title: "Ranks & Progression — Paramarine Task Force",
    description:
      "Rank tracks, promotion requirements, and awards — live from our personnel system.",
    url: `${SITE_URL}/progression`,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

/** Compact "140d TIG · 162 pts · 10 courses" requirements summary. */
function requirementsSummary(rank: BilletRank): string | null {
  const req = rank.requirements;
  if (!req) return null;
  const parts: string[] = [];
  if (req.timeInGradeDays) parts.push(`${req.timeInGradeDays}d in grade`);
  if (req.pointsRequired) parts.push(`${req.pointsRequired} pts`);
  if (req.qualifications?.length)
    parts.push(
      req.qualifications.length === 1
        ? req.qualifications[0]
        : `${req.qualifications.length} courses`,
    );
  return parts.length ? parts.join(" · ") : null;
}

function RankRow({ rank }: { rank: BilletRank }) {
  const summary = requirementsSummary(rank);
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-2">
      <span className="flex min-w-0 items-center gap-2.5">
        {rank.insigniaUrl ? (
          <img
            src={rank.insigniaUrl}
            alt=""
            className="h-5 w-5 shrink-0 object-contain"
            loading="lazy"
          />
        ) : (
          <span aria-hidden className="h-5 w-5 shrink-0" />
        )}
        <span className="truncate text-sm text-ink">{rank.name}</span>
        {rank.abbr ? <span className="micro-label">{rank.abbr}</span> : null}
      </span>
      {summary ? (
        <span className="shrink-0 font-mono text-xs text-ink-faint">{summary}</span>
      ) : null}
    </li>
  );
}

export default async function ProgressionPage() {
  const [ranks, awards] = await Promise.all([getRanks(), getAwards()]);

  return (
    <>
      <section>
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6">
          <SectionLabel>Progression</SectionLabel>
          <h1 className="heading-display mt-3 max-w-2xl text-4xl text-ink sm:text-5xl">
            Ranks, schools, and awards
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            Promotions have requirements — time in grade, points, courses
            completed. Everything below is pulled live from the personnel
            system, so it&apos;s current.
          </p>
        </div>
      </section>

      {ranks ? (
        <section className="border-t border-edge">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <SectionLabel>Rank structure</SectionLabel>
            <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
              Four tracks
            </h2>
            <div className="mt-10 grid items-start gap-4 md:grid-cols-2">
              {ranks.tracks.map((track) => (
                <div
                  key={track.name}
                  className="overflow-hidden rounded-sm border border-edge bg-surface"
                >
                  <div className="border-b border-edge bg-raised px-4 py-2.5">
                    <h3 className="font-display text-base font-semibold text-ink">
                      {track.name}
                    </h3>
                  </div>
                  <ul className="divide-y divide-edge">
                    {[...track.ranks]
                      .sort((a, b) => a.order - b.order)
                      .map((rank) => (
                        <RankRow key={rank.id} rank={rank} />
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {awards && awards.awards.length > 0 ? (
        <section className="border-t border-edge">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <SectionLabel>Decorations</SectionLabel>
            <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
              Awards of the task force
            </h2>
            <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {awards.awards.map((award) => (
                <li
                  key={award.id}
                  className="flex flex-col items-center gap-3 rounded-sm border border-edge bg-surface p-5 text-center"
                >
                  {award.imageUrl ? (
                    <img
                      src={award.imageUrl}
                      alt={`${award.name} medal`}
                      className="h-16 object-contain"
                      loading="lazy"
                    />
                  ) : null}
                  <span className="text-sm text-ink">{award.name}</span>
                  {award.description ? (
                    <span className="text-xs text-ink-faint">{award.description}</span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
            <p className="text-sm text-ink-muted">
              Every service record starts the same way — with an application.
            </p>
            <ButtonLink href={billet.applyUrl} variant="primary" size="md">
              Enlist Now
            </ButtonLink>
          </div>
          <p className="mt-6 text-sm">
            <Link
              href="/join"
              className="text-ink-muted underline decoration-edge-bright underline-offset-4 hover:text-ink"
            >
              How joining works →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
