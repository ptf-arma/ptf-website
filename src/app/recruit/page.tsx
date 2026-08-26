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
  ["PRT", "Paramarine Recruit Training. The course that gets you on the roster."],
  ["FTX", "Field Training Exercise. Tuesday night drills with your squad."],
  [
    "MSO",
    "Marine Special Operator. A certification and a second billet on top of your normal one. Runs Thursday recon.",
  ],
  ["ORBAT", "Order of battle. Who sits in which squad."],
  ["Billet", "Your job in the unit. Rifleman, corpsman, pilot, and so on."],
  ["Net", "A radio channel. Squad net for your squad, command net for leadership."],
  ["FTL / SL", "Fire team leader and squad leader. Whose calls you follow."],
  [
    "Contact report",
    "Direction, distance, description. “Contact, bearing 158, 200 meters, enemy squad.”",
  ],
  [
    "Spacing",
    "How far you keep from the man next to you. Too close and one grenade gets both of you.",
  ],
  ["ACE3", "The mod that rewrites medical, weapon handling, and interaction."],
  [
    "TFAR",
    "Task Force Arrowhead Radio. The in-game radio, carried over TeamSpeak.",
  ],
  ["AAR", "After-action review. The debrief."],
  ["LOA", "Leave of absence. Filed as a Personnel Action Request on the portal."],
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
            You&apos;ve applied. Here&apos;s the rest of it: what to install,
            where to be, and what your first Sunday looks like.
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
          Applying is the easy part. Telling somebody you applied is the part
          people skip, and an application nobody knows about just sits there.
        </p>
        <Checklist>
          <Check title="Apply on the personnel portal">
            About five minutes. That profile is your service record from here
            on.
          </Check>
          <Check title="Join the Discord under the name you applied with">
            Recruiters match the two by hand. Different handle, slower start.
          </Check>
          <Check title="Post in #find-a-recruiter">
            Say you applied and when you&apos;re around in the evenings.
            Somebody picks it up from there.
          </Check>
          <Check title="Ask the rest in #recruit-chat">
            That&apos;s the channel for it once your application is in.
          </Check>
          <Check title="Set your Discord nickname">
            Roles come across from the portal by themselves. The nickname
            doesn&apos;t.
          </Check>
        </Checklist>
        <p>
          Once you&apos;re accepted you get a squad and a fire team. From then
          on your fire team leader and squad leader are the two people
          responsible for you. Ask them first when something goes wrong. If the
          slot turns out to be a bad fit, say so and you&apos;ll get moved.
        </p>
      </Phase>

      <Phase
        n="02"
        when="Before training"
        title="Set up your game"
        effort="An hour, plus the download"
      >
        <p>
          Start this the day you apply. The modpack is a big download and
          it&apos;s the usual reason somebody misses the night they meant to
          start.
        </p>
        <Checklist>
          <Check title="Arma 3 on PC, updated">
            No DLC needed. Arma runs on your CPU more than your graphics card,
            so a sixty-player op will run worse than anything you&apos;ve
            played solo.
          </Check>
          <Check title="Subscribe to Paramarine Milsim Core">
            <a
              href={links.modpack}
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              The collection is here
            </a>
            . Let Steam pull the whole thing down, dependencies included. A
            dependency that didn&apos;t download is what&apos;s usually wrong
            when somebody can&apos;t get past the loading screen.
          </Check>
          <Check title="Load PTF Core in the launcher">
            Tick it, then say yes to the dependency prompt. No preset, no load
            order, no launch parameters.
          </Check>
          <Check title="Install TFAR, then its TeamSpeak plugin">
            The Workshop mod is half of it. The plugin installs separately on
            the TeamSpeak side, and without it you load in deaf. Check it shows
            under your TeamSpeak profile.
          </Check>
          <Check title="Connect to TeamSpeak">
            <span className="font-mono text-ink">{links.teamspeak}</span>. All
            in-game voice runs through it. Discord is for text.
          </Check>
          <Check title="Join the unit on units.arma3.com">
            <a
              href={links.arma3units}
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              Our page is here
            </a>
            . Do that and the server shows up in your launcher on its own.
          </Check>
          <Check title="Get on the server once before Sunday">
            Loading in cold is the only way to know your mods work. In from the
            launcher, from Arma&apos;s main menu, or with the details in
            #unit-information.
          </Check>
        </Checklist>
        <p>
          Screenshot any errors and post them in #recruit-chat. Somebody has
          seen it before.
        </p>
      </Phase>

      <Phase
        n="03"
        when="Friday, 8PM ET"
        title="Paramarine Recruit Training"
        effort="About 90 minutes"
      >
        <p>
          PRT is the course that gets you on the roster. An instructor runs it
          live: movement and formations, spacing, radio work, medical, and how
          our briefings and chain of command run. Ninety minutes, one sitting.
          Nobody expects you to know any of it beforehand.
        </p>
        <p className="rounded-sm border border-edge bg-raised px-5 py-4 text-ink">
          You don&apos;t need PRT before your first op, so come out Sunday
          either way. You get thirty days from joining to pass it. That&apos;s
          four Fridays.
        </p>
        <Checklist>
          <Check title="Take the first Friday you can make">
            The thirty days run from the day you join.
          </Check>
          <Check title="Show up with your mods already loaded">
            It starts on time.
          </Check>
          <Check title="Rules and Regs come from your recruiter">
            Those get covered in your interview, not at PRT.
          </Check>
        </Checklist>
        <p>
          Before and after PRT you&apos;re an 0311 Rifleman in a rifle squad.
          Everyone starts there.{" "}
          <Link
            href="/roles"
            className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
          >
            Marksman, corpsman, armor crew, pilot, JTAC
          </Link>
          : all of it comes later, through courses.
        </p>
      </Phase>

      <Phase
        n="04"
        when="Sunday, 8PM ET"
        title="Your first operation"
        effort="Two to three hours"
      >
        <p>
          Two to three hours, sometimes longer. A fair amount of it is walking
          and waiting.
        </p>
        <Checklist>
          <Check title="Sign up in advance">
            Calendar in the portal, or the embed in the attendance channels on
            Discord. Squads get built off that list.
          </Check>
          <Check title="Rifleman loadout until PRT is done">
            Whatever else is on the rack, take a rifleman kit until you pass.
          </Check>
        </Checklist>
        <dl className="mt-6 max-w-2xl space-y-3 rounded-sm border border-edge bg-surface p-5 font-mono text-sm">
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">T-30</dt>
            <dd className="text-ink-muted">
              Recruits on early. Game up, mods loaded, sitting in TeamSpeak.
              Gives somebody time to fix a dead plugin with you.
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">T-10</dt>
            <dd className="text-ink-muted">
              Most of the unit rolls in. Get on the server. TFAR moves you into
              its TeamSpeak channel by itself. Check your radio.
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
              Insert, move, contact, consolidate, debrief.
            </dd>
          </div>
        </dl>
        <h3 className="mt-8 font-display text-base font-semibold text-ink">
          Four things to get right on the night
        </h3>
        <ul className="max-w-2xl list-disc space-y-2 pl-6">
          <li>
            <span className="text-ink">Hold your spacing.</span> Bunching up
            feels safer. It&apos;s how a fire team goes down to one grenade.
          </li>
          <li>
            <span className="text-ink">Stay off the net.</span> Listen first.
            When you key up: direction, distance, description.
          </li>
          <li>
            <span className="text-ink">Follow your team leader.</span>{" "}
            They&apos;ve got three or four people to move and a squad leader to
            answer to.
          </li>
          <li>
            <span className="text-ink">Don&apos;t freelance.</span> Going after
            something on your own, without telling anyone, wrecks it for
            everybody else.
          </li>
        </ul>
        <p>
          Dying isn&apos;t the end of your night. You respawn at base and catch
          a bird back out to wherever your squad got to. It happens to people
          who have been here ten years.
        </p>
      </Phase>

      <Phase n="05" when="First month" title="After your first op" effort="Ongoing">
        <p>
          Sunday 8 to 11 is the night to plan around. The rest is there if you
          want it. Tuesdays your squad or platoon trains, and the whole unit
          trains together on the third Tuesday of the month. Thursdays are
          recon, MSO certification required. Saturdays are attendee&apos;s
          choice, so whichever course the most people there need is the one
          that gets taught.
        </p>
        <Checklist>
          <Check title="Show up Sundays, and say when you can't">
            75% attendance at ops, 50% at training. Not everything, because
            people have jobs. File a Personnel Action Request on the portal
            when you&apos;ll be out.
          </Check>
          <Check title="Ask for the Saturday course you want">
            Every course you pass is another billet you can be slotted into.
          </Check>
          <Check title="Watch your service record">
            Time in grade, points, course completions, all of it tracked.{" "}
            <Link
              href="/progression"
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              Thresholds are here
            </Link>
            .
          </Check>
          <Check title="Stop being a recruit">
            Passing PRT makes you eligible for Private. That promotion is the
            line between recruit and Marine.
          </Check>
        </Checklist>
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
            Ask your fire team leader or squad leader. If they&apos;re not
            around, post in #recruit-chat or your squad channel. Midweek is
            better than five minutes before an op.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
            <p className="text-sm text-ink-muted">
              Everyone in the unit did this once.
            </p>
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
