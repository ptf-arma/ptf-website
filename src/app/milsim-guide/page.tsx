import type { Metadata } from "next";
import Link from "next/link";
import { billet, links, SITE_URL } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata: Metadata = {
  title: "What Is Arma 3 Milsim? A Beginner's Guide",
  description:
    "New to Arma 3 milsim? What it involves, what an operation looks like, the roles you can play, and how to pick a unit worth joining.",
  alternates: { canonical: "/milsim-guide" },
  openGraph: {
    title: "What Is Arma 3 Milsim? A Beginner's Guide",
    description:
      "What military simulation actually is, what an operation feels like, and how to choose your first Arma 3 milsim unit.",
    url: `${SITE_URL}/milsim-guide`,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Is Arma 3 Milsim? A Beginner's Guide",
  description:
    "What military simulation actually is, what an operation feels like, the roles you can play, and how to choose your first Arma 3 milsim unit.",
  author: { "@type": "Organization", name: "Paramarine Task Force" },
  publisher: { "@id": `${SITE_URL}/#org` },
  mainEntityOfPage: `${SITE_URL}/milsim-guide`,
};

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="heading-display mt-12 text-2xl text-ink sm:text-3xl">
      {children}
    </h2>
  );
}

export default function MilsimGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-4 pb-20 pt-20 sm:px-6">
        <SectionLabel>Guide</SectionLabel>
        <h1 className="heading-display mt-3 text-4xl text-ink sm:text-5xl">
          What is Arma 3 milsim?
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-muted">
          Milsim is Arma 3 played as a team, with a plan, in a unit that keeps
          the same people week to week. If you&apos;ve only played public
          servers, it&apos;s a different game. Here&apos;s what to expect
          before you sign up anywhere.
        </p>

        <div className="mt-6 space-y-4 leading-relaxed text-ink-muted">
          <H2>How strict does it get?</H2>
          <p>
            It varies enormously. Some groups are co-op with no ranks and no
            attendance. At the other extreme are units with mandatory drill,
            saluting, and hour-long briefings. Most sit in between, ours
            included: chain of command and radio discipline while the op is
            running, ordinary conversation either side of it. Work out where a
            unit sits before you apply — too loose and ops fall apart, too
            rigid and it stops being fun.
          </p>

          <H2>What an operation looks like</H2>
          <p>
            The unit forms up and gets a briefing: situation, mission, how
            it&apos;s going to run. Then you step off in squads and fire
            teams. You hold your sector, your team leader talks on squad
            radio, platoon coordinates between elements, and if the unit has
            pilots, they&apos;re overhead moving you and dropping ordnance.
            The plan lasts until first contact. Two to three hours later
            you&apos;re arguing about what happened in Discord.
          </p>

          <H2>Roles</H2>
          <p>
            Everyone starts as a rifleman, which is also the best place to
            learn. After that: marksman, corpsman, machine gunner, engineer,
            armor crew, JTAC, and pilots if the unit flies its own aircraft.
            In a decent unit these are qualifications you earn on a course,
            not roles you pick off a list.
          </p>

          <H2>What you need</H2>
          <p>
            Arma 3 on PC, a microphone, and whatever modpack the unit runs.
            You don&apos;t need experience or special hardware. Any unit worth
            joining teaches recruits from scratch — if one expects you to turn
            up already knowing everything, that tells you how they treat new
            players.
          </p>

          <H2>How to pick one</H2>
          <p>Five things worth checking:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="text-ink">How long it&apos;s been running.</span>{" "}
              Most units fold inside a year. Five or ten means the leadership
              and the schedule hold up.
            </li>
            <li>
              <span className="text-ink">The time slot.</span> Ops run at a
              fixed hour in a fixed timezone. If that&apos;s 3AM where you
              live, nothing else about the unit matters.
            </li>
            <li>
              <span className="text-ink">Whether progression is tracked.</span>{" "}
              Ask where ranks and course completions live. If the answer is
              &ldquo;Discord roles,&rdquo; adjust expectations.
            </li>
            <li>
              <span className="text-ink">Signs of life.</span> Recent videos,
              screenshots, a Discord with traffic in it. No recent media
              usually means no recent ops.
            </li>
            <li>
              <span className="text-ink">The people.</span> Sit in their
              Discord for a week before applying. That&apos;s what
              you&apos;re actually joining.
            </li>
          </ul>

          <H2>How joining usually works</H2>
          <p>
            Most units follow the same pattern: application, a conversation
            with a recruiter, a training course, then your first op in a rifle
            squad. Reckon on one to two weeks.{" "}
            <Link
              href="/join"
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              Here&apos;s how ours works
            </Link>
            , with the questions people usually ask.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
          <p className="text-sm text-ink-muted">
            Ten years in. Come see how we run it.
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
            href="/"
            className="text-ink-muted underline decoration-edge-bright underline-offset-4 hover:text-ink"
          >
            ← Meet the Paramarine Task Force
          </Link>
        </p>
      </article>
    </>
  );
}
