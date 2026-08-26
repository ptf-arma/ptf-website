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
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <span className="micro-label">Phase {n}</span>
          <span className="font-mono text-xs text-ink-faint">{when}</span>
          <span className="font-mono text-xs text-ink-faint">{effort}</span>
        </div>
        <h2 className="heading-display mt-2 text-2xl text-ink sm:text-3xl">
          {title}
        </h2>
        <div className="mt-5 space-y-4 leading-relaxed text-ink-muted">
          {children}
        </div>
      </div>
    </section>
  );
}

/** Tickable-looking checklist. Static markup — nothing to persist. */
function Checklist({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-6 divide-y divide-edge rounded-sm border border-edge bg-surface">
      {children}
    </ul>
  );
}

function Check({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <li className="flex gap-3 p-4">
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
  [
    "PRT",
    "Paramarine Recruit Training. The course that gets you onto the roster.",
  ],
  ["FTX", "Field Training Exercise. Tuesday night drills with your squad."],
  [
    "MSO",
    "Marine Special Operator. A certification and a second billet on top of your normal one, running Thursday recon.",
  ],
  ["ORBAT", "Order of battle — the roster, showing who sits in which squad."],
  ["Billet", "Your job in the unit. Rifleman, corpsman, pilot, and so on."],
  [
    "Net",
    "A radio channel. Squad net for your squad, command net for leadership.",
  ],
  [
    "FTL / SL",
    "Fire team leader and squad leader. The two people whose calls you follow.",
  ],
  [
    "Contact report",
    "The three Ds — direction, distance, description. “Contact, bearing 158, 200 meters, enemy squad.”",
  ],
  [
    "Spacing",
    "The distance you hold from the person next to you. Too close and one grenade takes both of you.",
  ],
  [
    "ACE3",
    "The mod that rewrites medical, weapon handling, and interaction. Most of it runs through one self-interact key.",
  ],
  [
    "TFAR",
    "Task Force Arrowhead Radio. The in-game radio, carried over TeamSpeak. Needs a TeamSpeak plugin as well as the mod.",
  ],
  ["AAR", "After-action review. The debrief where the op gets pulled apart."],
  [
    "LOA",
    "Leave of absence. Filed as a Personnel Action Request on the portal, so being away does not cost you your slot.",
  ],
];

export default function RecruitGuidePage() {
  return (
    <>
      <section className="relative">
        <div className="mx-auto max-w-3xl px-4 pb-12 pt-20 sm:px-6">
          <SectionLabel>Recruit guide</SectionLabel>
          <h1 className="heading-display mt-3 text-4xl text-ink sm:text-5xl">
            New recruit guide
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">
            You applied. Here is everything that happens next, in the order it
            happens, with the parts you have to do yourself marked clearly.
            Work through it top to bottom and you will be stood in a formation
            on a Sunday night with nothing to apologise for.
          </p>
          <p className="mt-4 text-sm text-ink-muted">
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
        title="Apply, then go find a recruiter"
        effort="10 minutes"
      >
        <p>
          The application is the easy half. The half people forget is telling
          somebody they made it. Applications sit unread far longer than they
          need to when nobody has said hello in Discord, and every day one sits
          there is a day you are not training.
        </p>
        <Checklist>
          <Check title="Submit your application on the personnel portal">
            Five minutes. The profile you create is your service record — rank,
            courses, and awards all hang off it from here on.
          </Check>
          <Check title="Join the Discord under the same name you applied with">
            Recruiters match one to the other by hand. A different handle is
            the most common reason an application goes quiet.
          </Check>
          <Check title="Post in #find-a-recruiter">
            That channel is for applications. Say you have applied and roughly
            when you are free in the evenings. No appointment needed and no
            particular form of words — someone picks it up and takes you from
            there.
          </Check>
          <Check title="Then keep talking in #recruit-chat">
            Once your application is in, that is where you ask everything else.
            Nothing you can ask at this stage is a stupid question, and the
            people answering were recruits recently enough to know it.
          </Check>
          <Check title="Set your own Discord nickname">
            That one is on you. Your roles are handled automatically from your
            portal record, so they will appear on their own — the nickname
            will not.
          </Check>
        </Checklist>
        <p>
          When you are accepted you get assigned to a squad and a fire team,
          with a channel of your own to sit in. From that point your fire team
          leader and squad leader are the two people responsible for you.
          Not a recruiting desk somewhere — them. They are who you ask when
          something goes wrong, and they are who notices when you go missing.
          If the slot you landed in turns out to be the wrong one, that is a
          conversation with your squad leader, not a problem you are stuck
          with.
        </p>
      </Phase>

      <Phase
        n="02"
        when="Before training"
        title="Set up your game"
        effort="An hour, plus the download"
      >
        <p>
          Do this before your first training session rather than during it. The
          modpack is a large download and it is the single most common reason a
          recruit misses the night they were meant to start. Set it going the
          day you apply and forget about it.
        </p>
        <Checklist>
          <Check title="Arma 3, updated, on PC">
            The base game and nothing else. No DLC or creator DLC is required
            to run with us, so there is nothing further to buy. Worth knowing
            that Arma leans on your CPU far harder than your graphics card — a
            sixty-player operation will run worse than anything you have tried
            in singleplayer.
          </Check>
          <Check title="Subscribe to the modpack collection">
            <a
              href={links.modpack}
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              Paramarine Milsim Core
            </a>{" "}
            on the Steam Workshop. Subscribe to the collection and let Steam
            pull down everything in it, dependencies included — a mod that
            quietly failed to fetch one of its dependencies is the usual
            reason somebody bounces off the loading screen.
          </Check>
          <Check title="Load PTF Core in the Arma 3 launcher">
            Tick PTF Core and say yes when the launcher offers to load its
            dependencies. That is the whole of it — no preset file to import,
            no load order to arrange by hand, no launch parameters to type in.
          </Check>
          <Check title="Install TFAR and its TeamSpeak plugin">
            We run TFAR — Task Force Arrowhead Radio — which puts a real radio
            in your hands in game and carries the audio over TeamSpeak. The
            Workshop mod is only half of it. TFAR also has a TeamSpeak plugin
            that installs separately, and without it you will load in able to
            hear nobody and reach nobody. Install the plugin on the TeamSpeak
            side, then check it is listed under your TeamSpeak profile. If it
            is not showing there, it is not loaded, whatever the installer
            told you.
          </Check>
          <Check title="Set the controls PRT expects you to have bound">
            Under Configure → Controls: throw on double-G, Use Action 1 on
            Left Shift + Space, and Last Help unbound. Under Configure →
            Addons: the cTab interfaces on J, Ctrl + J, and Alt + J, with zoom
            on Up and Down. Under Addon Options: DUI Squad Radar set to show
            bearing always, compass style classic.
          </Check>
          <Check title="Learn six keys before you learn anything else">
            Hold Left Windows to interact with people and objects. Hold Ctrl +
            Left Windows to interact with yourself — markers, earplugs, team
            colours, most of ACE. H opens the medical menu. Ctrl + P opens
            your radio, and holding Caps Lock transmits on it. Ctrl + Tab
            cycles your own voice between whisper, talk, and shout. Everything
            else PRT teaches you.
          </Check>
          <Check title="Connect to TeamSpeak">
            Every voice comm in game runs through TeamSpeak, at{" "}
            <span className="font-mono text-ink">{links.teamspeak}</span>.
            Discord is for text, planning, and everything either side of the
            operation. If you only get one of the two working before your
            first night, make it TeamSpeak.
          </Check>
          <Check title="Join the unit on units.arma3.com">
            <a
              href={links.arma3units}
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              Our page is here
            </a>
            . Join it and our server turns up in your Arma 3 launcher on its
            own, with no address to type in anywhere.
          </Check>
          <Check title="Join the server once, on your own, before op night">
            Loading in cold is the only real proof your mods work. Three ways
            in: the launcher, once you have joined the unit on units.arma3.com;
            the Arma main menu, with our modpack loaded; or the details posted
            in #unit-information on Discord. Finding out at 7:58 on a Sunday
            that none of it works is a poor way to meet your squad.
          </Check>
        </Checklist>
        <p>
          If any of this throws an error, screenshot it and put it in
          #recruit-chat rather than grinding at it alone. Mod problems are
          nearly always something someone else has already hit, and usually
          fixed in one reply.
        </p>
      </Phase>

      <Phase
        n="03"
        when="Friday, 8PM ET"
        title="Paramarine Recruit Training"
        effort="About 90 minutes"
      >
        <p>
          PRT is the course that turns an application into a Marine on the
          roster. It covers movement and formations, holding spacing, basic
          radio procedure, and how our briefings and chain of command work.
          Nobody expects you to arrive knowing any of it. That is the entire
          point of running the course.
        </p>
        <p className="rounded-sm border border-edge bg-raised px-5 py-4 text-ink">
          You do not have to pass PRT before your first operation — turn up on
          Sunday either way. You do have thirty days from joining to get it
          done. That is four Fridays, so missing one is nothing and missing
          all of them is a problem.
        </p>
        <Checklist>
          <Check title="Turn up on Friday at 8PM ET">
            PRT runs on its own night, for recruits only. Take the first one
            you can make rather than the first one that suits, because the
            thirty days run from the day you join, not from the day you get
            round to it.
          </Check>
          <Check title="Arrive with your mods loaded and your controls already bound">
            The session starts on time and an instructor teaches it live. Ten
            minutes of buffer is the difference between a calm start and
            holding up everybody else.
          </Check>
          <Check title="Expect the Rules and Regulations from your recruiter">
            Those get walked through in your recruitment interview rather than
            at PRT. Read them when they land.
          </Check>
        </Checklist>
        <p>
          Ninety minutes, near enough, in one sitting, taught by an instructor
          rather than handed to you as a document to read. It covers unit
          structure, the controls and addon options you need set, ACE
          interaction, medical, comms and contact reports, navigation, stances
          and movement, weapons, and airborne operations. That is a lot for one
          evening, and it is why it is taught rather than written down.
        </p>
        <p>
          Either side of PRT you are an 0311 Rifleman in a rifle squad. That is
          where everyone starts, whatever they are aiming at later —{" "}
          <Link
            href="/roles"
            className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
          >
            marksman, corpsman, armor crew, pilot, and JTAC
          </Link>{" "}
          all come afterwards, through courses.
        </p>
      </Phase>

      <Phase
        n="04"
        when="Sunday, 8PM ET"
        title="Your first operation"
        effort="Two to three hours"
      >
        <p>
          The op is the thing everything else is arranged around. Two to three
          hours, occasionally longer, and a fair amount of it is walking and
          listening rather than shooting. That is a more honest version of
          infantry work than most games give you, and it is the part people end
          up staying for.
        </p>
        <Checklist>
          <Check title="Sign up in advance">
            Ops are signed up for on the calendar in the personnel portal, or
            straight from the embed in the attendance channels on Discord,
            whichever you have open. Leadership builds the squads off that
            list, so signing up late means being fitted in rather than planned
            for.
          </Check>
          <Check title="Take a rifleman loadout until PRT is done">
            You can deploy before you have passed PRT, and you should. Until
            it is signed off you run as a rifleman, whatever else is sitting
            on the rack — not a punishment, just the order things are learned
            in. The specialist kit sits behind the courses that teach it.
          </Check>
        </Checklist>
        <dl className="mt-6 space-y-3 rounded-sm border border-edge bg-surface p-5 font-mono text-sm">
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">T-30</dt>
            <dd className="text-ink-muted">
              Recruits, be here. Game launched, mods loaded, in TeamSpeak.
              Half an hour is enough for somebody to fix a silent plugin with
              you. Ten minutes is not.
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">T-10</dt>
            <dd className="text-ink-muted">
              When most of the unit shows up. On the server, in your
              squad&apos;s channel, radio checked.
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">8:00</dt>
            <dd className="text-ink-muted">
              Briefing: the situation, the mission, and how it is being
              executed. Ask your questions here.
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">After</dt>
            <dd className="text-ink-muted">
              Insertion, movement, contact, consolidation, then the debrief.
            </dd>
          </div>
        </dl>
        <h3 className="mt-8 font-display text-base font-semibold text-ink">
          Five things to get right on the night
        </h3>
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <span className="text-ink">Hold your spacing.</span> Standing close
            to your fire team feels safer and is the fastest way to lose all
            four of you to one grenade.
          </li>
          <li>
            <span className="text-ink">Stay off the net.</span> Listen for the
            first hour. When you do key up, use the three Ds — direction,
            distance, description — and then stop talking.
          </li>
          <li>
            <span className="text-ink">Follow your team leader.</span> They have
            three or four people to move and a squad leader to answer to. Move
            when they move.
          </li>
          <li>
            <span className="text-ink">Don&apos;t freelance.</span> Chasing
            something you spotted, alone, without telling anyone, is the one
            habit that breaks an operation for everybody else.
          </li>
          <li>
            <span className="text-ink">Ask afterwards, not during.</span>{" "}
            Questions in the debrief are welcome and get proper answers.
            Questions mid-firefight step on traffic other people need.
          </li>
        </ul>
        <p>
          Getting killed early is not a failure and it happens to everyone. Stay
          in voice, watch how the rest of the op plays out, and turn up again
          next week.
        </p>
      </Phase>

      <Phase n="05" when="First month" title="After your first op" effort="Ongoing">
        <p>
          Sunday, 8 until 11, is the one to build your week around. The rest of
          the calendar is there when you want it. Tuesdays your own squad or
          platoon trains, with the whole unit training together on the third
          Tuesday of the month. Thursdays are recon, which needs the MSO
          certification before you can attend. Saturdays are attendee&apos;s
          choice: whichever course the most people who turn up need is the one
          that runs. Which means turning up is itself how you get the course
          you want — sit it out and somebody else&apos;s qualification gets
          taught instead of yours.
        </p>
        <Checklist>
          <Check title="Turn up to Sundays, and say so when you can't">
            The expectation is 75% attendance at operations and 50% at
            training. That is a real number rather than a vague sense of
            commitment, and it is deliberately not 100% — people have jobs.
            When you are going to be away, file a Personnel Action Request on
            the portal instead of going quiet. A recorded absence costs you
            nothing. An unexplained one is the kind that gets noticed.
          </Check>
          <Check title="Say which Saturday course you need">
            Every course you pass is a new billet you can be slotted into, and
            the one that runs is the one the most attendees need. Ask for
            yours.
          </Check>
          <Check title="Watch your service record">
            Promotions have real requirements — time in grade, points, and
            course completions, all tracked in the portal.{" "}
            <Link
              href="/progression"
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              The thresholds are here
            </Link>
            .
          </Check>
          <Check title="Stop being a recruit">
            Passing PRT is what makes you eligible for promotion to Private.
            That promotion is the line between recruit and Marine, and it is
            the reason the course is the first thing on your calendar rather
            than something to get round to.
          </Check>
        </Checklist>
      </Phase>

      <section className="border-t border-edge">
        <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
          <SectionLabel>Reference</SectionLabel>
          <h2 className="heading-display mt-2 text-2xl text-ink sm:text-3xl">
            Words you will hear in your first week
          </h2>
          <dl className="mt-6 grid gap-x-8 gap-y-4 sm:grid-cols-2">
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
          <p className="mt-2 text-sm text-ink-muted">
            Ask your fire team leader or squad leader. Getting you working is
            part of what they signed up for, and they would rather hear about
            it on Thursday than watch you miss Sunday. If they are not around,
            post in #recruit-chat or your squad&apos;s channel — somebody in
            there has hit the same thing.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
            <p className="text-sm text-ink-muted">
              Everyone in the unit went through this, most of them recently
              enough to remember it.
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
