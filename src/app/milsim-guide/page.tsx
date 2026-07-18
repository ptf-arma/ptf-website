import type { Metadata } from "next";
import Link from "next/link";
import { billet, links, SITE_URL } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata: Metadata = {
  title: "What Is Arma 3 Milsim? A Beginner's Guide",
  description:
    "New to Arma 3 milsim? What military simulation actually is, what an operation feels like, the roles you can play, and how to choose (and join) a milsim unit.",
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
          Milsim — military simulation — is Arma 3 played the way the game was
          built to be played: as a team, with a plan, in a persistent unit
          where your squad tonight is your squad next month. Here&apos;s what
          that actually means, and how to find your place in it.
        </p>

        <div className="mt-6 space-y-4 leading-relaxed text-ink-muted">
          <H2>The spectrum: from casual co-op to full simulation</H2>
          <p>
            &ldquo;Milsim&rdquo; covers a wide range. At one end, casual co-op
            groups run missions with no ranks and no expectations. At the far
            end, hardcore units run mandatory drill, strict radio etiquette,
            and multi-hour briefings. Most healthy units — ours included — sit
            deliberately in the middle: real structure, real tactics, real
            radio comms during the op, and normal human beings joking around
            in the motor pool before and after. The skill is telling the
            difference before you join: too casual and operations collapse
            into chaos; too strict and it stops being a game.
          </p>

          <H2>What an operation actually feels like</H2>
          <p>
            A typical main operation runs like this: the unit forms up, gets a
            briefing — situation, mission, execution — and steps off as
            organized squads and fire teams. Riflemen hold formation and
            sectors. Team leaders relay orders over squad radio. A platoon net
            coordinates between elements, and if the unit flies its own
            aircraft, pilots check in overhead for transport and close air
            support. Contact happens, plans survive about five minutes, and
            the fun is in adapting as a team. An op usually runs two to three
            hours, and the stories from it fuel the Discord all week.
          </p>

          <H2>The roles you can actually play</H2>
          <p>
            Everyone starts as a rifleman — the backbone of every squad, and
            genuinely the best seat for learning. From there, units offer
            specializations you qualify into through training: designated
            marksman, combat medic or corpsman, machine gunner, engineer,
            armor crew, JTAC (the one talking to aircraft), and — in units
            with an air wing — helicopter and fixed-wing pilots. Good units
            treat these as earned progressions with courses behind them, which
            is exactly what makes them feel meaningful.
          </p>

          <H2>What you need to start</H2>
          <p>
            Arma 3 on PC, a working microphone, and a unit&apos;s modpack —
            every serious unit curates one, and good units make it a one-click
            Steam Workshop subscription. You do <em>not</em> need prior
            experience, DCS-grade hardware, or military knowledge: any unit
            worth joining trains its recruits from zero. If a unit expects you
            to already know everything, that tells you something about how
            they treat new players.
          </p>

          <H2>How to choose a unit</H2>
          <p>
            Five things to check before you apply anywhere:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="text-ink">Longevity.</span> Most units die
              within a year. One that has run for five or ten says its
              leadership and culture actually work.
            </li>
            <li>
              <span className="text-ink">Schedule fit.</span> Ops happen at
              fixed times in a fixed timezone. If Saturday 8PM Eastern is 3AM
              for you, no amount of enthusiasm fixes it.
            </li>
            <li>
              <span className="text-ink">Real training, real progression.</span>{" "}
              Ask whether ranks and courses are tracked somewhere — or whether
              they&apos;re just Discord roles.
            </li>
            <li>
              <span className="text-ink">Proof of life.</span> Recent videos,
              screenshots, an active Discord. A dead media trail usually means
              a dead unit.
            </li>
            <li>
              <span className="text-ink">Tone.</span> Lurk in their Discord
              before applying. You&apos;re choosing the people more than the
              unit.
            </li>
          </ul>

          <H2>How joining works (almost everywhere)</H2>
          <p>
            The pattern is similar across the hobby: a short application, a
            chat with a recruiter, recruit training to learn the unit&apos;s
            standards, then your first operation in a rifle squad. From
            application to first op is typically one to two weeks. If
            you&apos;re curious what that looks like in practice,{" "}
            <Link
              href="/join"
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              here&apos;s exactly how it works in our unit
            </Link>
            , including the full FAQ.
          </p>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
          <p className="text-sm text-ink-muted">
            We&apos;ve been doing this for ten years — come see it firsthand.
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
