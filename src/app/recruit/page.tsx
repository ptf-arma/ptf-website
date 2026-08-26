import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { billet, links, SITE_URL } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { LocalTime } from "@/components/local-time";

export const metadata: Metadata = {
  title: "New Recruit Guide",
  description:
    "Everything a new Paramarine needs between applying and their first Sunday operation: modpack setup, recruit training, and what op night actually looks like.",
  alternates: { canonical: "/recruit" },
  openGraph: {
    title: "New Recruit Guide · Paramarine Task Force",
    description:
      "From application to your first operation: setup, recruit training, and what to do on op night.",
    url: `${SITE_URL}/recruit`,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    title: "New Recruit Guide · Paramarine Task Force",
    description:
      "From application to your first operation: setup, recruit training, and what to do on op night.",
  },
};

function Phase({
  n,
  when,
  title,
  effort,
  children,
}: {
  n: string;
  when: string;
  title: string;
  effort: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        {/* Heading rides along in the left rail on wide screens. The phases
            run long enough that you lose track of which one you're in. */}
        <div className="grid gap-x-12 gap-y-6 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="micro-label">Phase {n}</span>
            <h2 className="heading-display mt-2 text-2xl text-ink sm:text-3xl">
              {title}
            </h2>
            <p className="mt-2 font-mono text-xs text-ink-faint">
              {when}
              <span className="mx-2 text-edge-bright">·</span>
              {effort}
            </p>
          </div>
          {/* Prose stays at a readable measure; the checklists below are free
              to use the full column width. */}
          <div className="space-y-4 leading-relaxed text-ink-muted [&>p]:max-w-2xl">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Tickable-looking checklist. Static markup, nothing to persist. Two-up on
 * anything wider than mobile, matching the card grids on /join.
 */
function Checklist({ children }: { children: ReactNode }) {
  return <ul className="mt-6 grid gap-3 sm:grid-cols-2">{children}</ul>;
}

function Check({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <li className="flex gap-3 rounded-sm border border-edge bg-surface p-4">
      <span
        aria-hidden
        className="mt-[3px] h-4 w-4 shrink-0 rounded-[2px] border border-edge-bright"
      />
      <div>
        <p className="font-display text-sm font-semibold text-ink">{title}</p>
        {children ? (
          <p className="mt-1 text-sm text-ink-muted">{children}</p>
        ) : null}
      </div>
    </li>
  );
}

const glossary: [string, string][] = [
  ["PRT", "Paramarine Recruit Training."],
  ["FTX", "Field Training Exercise. Tuesday night drills."],
  [
    "MSO",
    "Marine Special Operator. A certification, and a second billet on top of your normal one.",
  ],
  ["ORBAT", "Order of battle. Who sits in which squad."],
  ["Billet", "Your job in the unit."],
  ["Net", "A radio channel. Squad net, command net."],
  ["FTL / SL", "Fire team leader, squad leader."],
  [
    "Contact report",
    "Direction, distance, description. “Contact, bearing 158, 200 meters, enemy squad.”",
  ],
  ["Spacing", "How far you keep from the man next to you."],
  ["ACE3", "The mod that rewrites medical, weapon handling and interaction."],
  ["TFAR", "Task Force Arrowhead Radio. The in-game radio, carried over TeamSpeak."],
  ["AAR", "After-action review. The debrief."],
  ["PAR", "Personnel Action Request. What you file on the portal to request leave."],
];

export default function RecruitGuidePage() {
  return (
    <>
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-20 sm:px-6">
          <SectionLabel>Recruit guide</SectionLabel>
          <h1 className="heading-display mt-3 max-w-2xl text-4xl text-ink sm:text-5xl">
            New recruit guide
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            Everything between your application and your first Sunday op. Most
            of it is setup.
          </p>
          <p className="mt-4 max-w-xl text-sm text-ink-muted">
            Haven&apos;t applied yet?{" "}
            <Link
              href="/join"
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              Start there
            </Link>
            . Never done milsim at all?{" "}
            <Link
              href="/milsim-guide"
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              Read this first
            </Link>
            .
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={billet.applyUrl} variant="primary" size="lg">
              Start your application
            </ButtonLink>
            <ButtonLink href={links.discord} variant="secondary" size="lg">
              Join the Discord
            </ButtonLink>
          </div>
          <p className="mt-8 font-mono text-xs text-ink-faint">
            Application to first op: one to two weeks · Main op SUN 8PM ET{" "}
            <LocalTime weekday={0} hourEt={20} className="text-ink-faint" />
          </p>
        </div>
      </section>

      <Phase
        n="01"
        when="Day one"
        title="Apply, then find a recruiter"
        effort="10 minutes"
      >
        <p>
          We pick applications up by hand, so post in Discord once yours is in.
          Otherwise it can sit for a week.
        </p>
        <Checklist>
          <Check title="Apply on the personnel portal">
            Five minutes. This becomes your service record.
          </Check>
          <Check title="Join the Discord under the same name">
            We match applications to Discord accounts manually.
          </Check>
          <Check title="Post in #find-a-recruiter">
            Tell us you applied and when you&apos;re free in the evenings.
          </Check>
          <Check title="Ask questions in #recruit-chat" />
          <Check title="Set your own Discord nickname">
            Roles get assigned from the portal automatically. Nicknames
            don&apos;t.
          </Check>
        </Checklist>
        <p>
          Accepted recruits go into a squad and a fire team. Your fire team
          leader and squad leader handle you from there. Take problems to them,
          including if you&apos;d rather be somewhere else in the unit.
        </p>
      </Phase>

      <Phase
        n="02"
        when="Before training"
        title="Set up your game"
        effort="An hour, plus the download"
      >
        <p>
          Start the download the day you apply. It&apos;s large, and people
          miss their first night waiting on it.
        </p>
        <Checklist>
          <Check title="Arma 3 on PC, updated">
            No DLC required. Arma is CPU-heavy, so expect a full op to run
            worse than singleplayer does.
          </Check>
          <Check title="Subscribe to Paramarine Milsim Core">
            <a
              href={links.modpack}
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              The collection is here
            </a>
            . Steam pulls the dependencies with it. If you can&apos;t get past
            the loading screen, one of them didn&apos;t download.
          </Check>
          <Check title="Load PTF Core in the launcher">
            Say yes when it asks about dependencies. Nothing else to configure.
          </Check>
          <Check title="Install TFAR, then its TeamSpeak plugin">
            The plugin is separate from the mod and installs on the TeamSpeak
            side. Without it you can&apos;t hear anyone. It shows under your
            TeamSpeak profile once it&apos;s in.
          </Check>
          <Check title="Connect to TeamSpeak">
            <span className="font-mono text-ink">{links.teamspeak}</span>. All
            in-game voice runs through it.
          </Check>
          <Check title="Join the unit on units.arma3.com">
            <a
              href={links.arma3units}
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              Our page is here
            </a>
            . The server then shows up in your launcher.
          </Check>
          <Check title="Get on the server before Sunday">
            Loading in once is the only way to know your mods work. Server
            details are in #unit-information.
          </Check>
        </Checklist>
        <p>Post errors in #recruit-chat with a screenshot.</p>
      </Phase>

      <Phase
        n="03"
        when="Friday, 8PM ET"
        title="Paramarine Recruit Training"
        effort="About 90 minutes"
      >
        <p>
          PRT runs Friday nights, recruits only, and an instructor teaches it
          live. About ninety minutes. It covers movement and formations, radio
          work, and medical.
        </p>
        <p className="rounded-sm border border-edge bg-raised px-5 py-4 text-ink">
          You don&apos;t need PRT before your first op, so come out on Sunday
          either way. You have thirty days from joining to pass it.
        </p>
        <Checklist>
          <Check title="Take the first Friday you can make">
            The thirty days start when you join.
          </Check>
          <Check title="Have your mods loaded before 8">
            It starts on time.
          </Check>
          <Check title="Rules and Regs come from your recruiter">
            Covered in your interview.
          </Check>
        </Checklist>
        <p>
          You&apos;re an 0311 Rifleman either side of PRT. Everyone is.{" "}
          <Link
            href="/roles"
            className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
          >
            Marksman, corpsman, armor crew, pilot, JTAC
          </Link>{" "}
          are course qualifications you pick up later.
        </p>
      </Phase>

      <Phase
        n="04"
        when="Sunday, 8PM ET"
        title="Your first operation"
        effort="Two to three hours"
      >
        <p>
          Ops run 8 until 11, sometimes later. Expect a lot of movement and
          waiting between contacts.
        </p>
        <Checklist>
          <Check title="Sign up on the calendar">
            In the portal, or from the embed in the attendance channels. Squads
            are built off that list.
          </Check>
          <Check title="Take a rifleman loadout until you've passed PRT" />
        </Checklist>
        <dl className="mt-6 max-w-2xl space-y-3 rounded-sm border border-edge bg-surface p-5 font-mono text-sm">
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">T-30</dt>
            <dd className="text-ink-muted">
              Recruits on early. Game up, mods loaded, sitting in TeamSpeak, so
              there&apos;s time to sort out a dead plugin.
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">T-10</dt>
            <dd className="text-ink-muted">
              Most of the unit arrives. Get on the server. TFAR moves you into
              its TeamSpeak channel. Check your radio.
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">8:00</dt>
            <dd className="text-ink-muted">
              Briefing. Situation, mission, how it&apos;s being run. Ask
              questions here.
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">After</dt>
            <dd className="text-ink-muted">
              Insertion, movement, whatever contact comes, then the debrief.
            </dd>
          </div>
        </dl>
        <h3 className="mt-8 font-display text-base font-semibold text-ink">
          Four things to get right on the night
        </h3>
        <ul className="max-w-2xl list-disc space-y-2 pl-6">
          <li>
            <span className="text-ink">Hold your spacing.</span> One grenade
            should never be able to take your whole fire team.
          </li>
          <li>
            <span className="text-ink">Stay off the net.</span> When you do
            transmit: direction, distance, description.
          </li>
          <li>
            <span className="text-ink">Follow your team leader.</span>{" "}
            They&apos;re moving three or four people and answering to a squad
            leader.
          </li>
          <li>
            <span className="text-ink">Don&apos;t go after something on your
            own</span>{" "}
            without telling anyone.
          </li>
        </ul>
        <p>
          If you get killed you respawn at base and ride a helicopter back out
          to your squad.
        </p>
      </Phase>

      <Phase n="05" when="First month" title="After your first op" effort="Ongoing">
        <p>
          Sunday is the one to plan your week around. Tuesdays your squad or
          platoon trains, and the whole unit trains together on the third
          Tuesday of the month. Thursday recon needs the MSO certification.
          Saturday is attendee&apos;s choice, so the course that runs is
          whichever one the most people there need.
        </p>
        <Checklist>
          <Check title="Show up on Sundays">
            We expect 75% attendance at operations and 50% at training.
          </Check>
          <Check title="File a PAR on the portal when you'll be away" />
          <Check title="Ask for the Saturday course you want" />
          <Check title="Watch your service record">
            Promotions run on time in grade, points and course completions.{" "}
            <Link
              href="/progression"
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              Thresholds are here
            </Link>
            .
          </Check>
        </Checklist>
        <p>
          Passing PRT makes you eligible for Private, which is where you stop
          being a recruit.
        </p>
      </Phase>

      <section className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <SectionLabel>Reference</SectionLabel>
          <h2 className="heading-display mt-2 text-2xl text-ink sm:text-3xl">
            Words you&apos;ll hear in your first week
          </h2>
          <dl className="mt-6 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
            {glossary.map(([term, def]) => (
              <div key={term}>
                <dt className="font-mono text-sm text-ink">{term}</dt>
                <dd className="mt-1 text-sm text-ink-muted">{def}</dd>
              </div>
            ))}
          </dl>

          <h3 className="mt-10 font-display text-base font-semibold text-ink">
            When something breaks
          </h3>
          <p className="mt-2 max-w-2xl text-sm text-ink-muted">
            Ask your fire team leader or squad leader, or post in #recruit-chat.
            Don&apos;t leave it until five minutes before an op.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
            <p className="text-sm text-ink-muted">Still stuck on something?</p>
            <div className="flex gap-3">
              <ButtonLink href={links.discord} variant="secondary" size="md">
                Ask on Discord
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
              &larr; How joining works
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
