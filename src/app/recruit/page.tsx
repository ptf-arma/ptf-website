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
        {/* Heading rides along in the left rail on wide screens — the phases
            are long enough that you lose track of which one you're in. */}
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
 * Tickable-looking checklist. Static markup — nothing to persist. Two-up on
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
  [
    "PRT",
    "Paramarine Recruit Training. The course that gets you onto the roster.",
  ],
  ["FTX", "Field Training Exercise. Tuesday night drills with your squad."],
  [
    "MSO",
    "Marine Special Operator. A certification and a second billet on top of your normal one, running Thursday recon.",
  ],
  ["ORBAT", "Order of battle. The roster, and who sits in which squad."],
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
    "The three Ds: direction, distance, description. “Contact, bearing 158, 200 meters, enemy squad.”",
  ],
  [
    "Spacing",
    "How far you keep from the person next to you. Too close and one grenade gets both of you.",
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
    "Leave of absence. Filed as a Personnel Action Request on the portal, so time away doesn't cost you your slot.",
  ],
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
            You&apos;ve applied. This is what happens next, in order, with the
            parts you have to do yourself called out. Work through it and your
            first Sunday will go fine.
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
        title="Apply, then go find a recruiter"
        effort="10 minutes"
      >
        <p>
          Applying is the easy part. What people forget is telling anyone they
          did it. An application nobody has been told about can sit for days,
          and those are days you&apos;re not training.
        </p>
        <Checklist>
          <Check title="Submit your application on the personnel portal">
            Takes about five minutes. The profile you create is your service
            record, so your rank, courses, and awards all hang off it.
          </Check>
          <Check title="Join the Discord under the same name you applied with">
            Recruiters match the two by hand. A different handle is the most
            common reason an application goes quiet.
          </Check>
          <Check title="Post in #find-a-recruiter">
            That&apos;s the channel for applications. Say you&apos;ve applied
            and roughly when you&apos;re free in the evenings. You don&apos;t
            need an appointment and there&apos;s no script for it.
          </Check>
          <Check title="Then keep talking in #recruit-chat">
            Once your application is in, ask everything else there. The people
            answering were recruits themselves not long ago.
          </Check>
          <Check title="Set your own Discord nickname">
            Your roles come across automatically from your portal record. The
            nickname doesn&apos;t, so that one&apos;s on you.
          </Check>
        </Checklist>
        <p>
          Once you&apos;re accepted you get put in a squad and a fire team,
          with a channel of your own. Your fire team leader and squad leader
          are responsible for you from then on. They&apos;re who you ask when
          something goes wrong, and they&apos;re who notices when you stop
          showing up. If you end up in a slot that isn&apos;t working out, talk
          to your squad leader about moving.
        </p>
      </Phase>

      <Phase
        n="02"
        when="Before training"
        title="Set up your game"
        effort="An hour, plus the download"
      >
        <p>
          Get this done before your first training night rather than during it.
          The modpack is a big download, and it&apos;s the usual reason someone
          misses the night they meant to start. Kick it off the day you apply.
        </p>
        <Checklist>
          <Check title="Arma 3, updated, on PC">
            The base game and nothing else. No DLC or creator DLC is required,
            so there&apos;s nothing further to buy. Arma leans on your CPU more
            than your graphics card, so a sixty-player op will run worse than
            anything you&apos;ve played solo.
          </Check>
          <Check title="Subscribe to the modpack collection">
            <a
              href={links.modpack}
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              Paramarine Milsim Core
            </a>{" "}
            on the Steam Workshop. Subscribe to the collection and let Steam
            pull down everything in it, dependencies included. A dependency
            that didn&apos;t download is usually what&apos;s wrong when someone
            can&apos;t get past the loading screen.
          </Check>
          <Check title="Load PTF Core in the Arma 3 launcher">
            Tick PTF Core and say yes when the launcher asks about its
            dependencies. That&apos;s it. No preset to import, no load order to
            sort out by hand, no launch parameters.
          </Check>
          <Check title="Install TFAR and its TeamSpeak plugin">
            TFAR (Task Force Arrowhead Radio) gives you a working radio in game
            and runs the audio through TeamSpeak. The Workshop mod is only half
            of it. There&apos;s a TeamSpeak plugin that installs separately,
            and skipping it means loading in unable to hear anyone or reach
            anyone. Install it, then check it&apos;s listed under your
            TeamSpeak profile. If it isn&apos;t there, it didn&apos;t load.
          </Check>
          <Check title="Set the controls PRT expects you to have bound">
            Configure → Controls: throw on double-G, Use Action 1 on Left Shift
            + Space, Last Help unbound. Configure → Addons: cTab interfaces on
            J, Ctrl + J, and Alt + J, with zoom on Up and Down. Addon Options:
            DUI Squad Radar showing bearing always, compass style classic.
          </Check>
          <Check title="Learn six keys before you learn anything else">
            Hold Left Windows to interact with people and objects. Hold Ctrl +
            Left Windows to interact with yourself: markers, earplugs, team
            colors, most of ACE. H opens the medical menu. Ctrl + P opens your
            radio, and Caps Lock transmits on it. Ctrl + Tab switches your own
            voice between whisper, talk, and shout. PRT covers the rest.
          </Check>
          <Check title="Connect to TeamSpeak">
            All in-game voice runs through TeamSpeak at{" "}
            <span className="font-mono text-ink">{links.teamspeak}</span>.
            Discord handles text and planning either side of the op. If you
            only get one of them working before your first night, make it
            TeamSpeak.
          </Check>
          <Check title="Join the unit on units.arma3.com">
            <a
              href={links.arma3units}
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              Our page is here
            </a>
            . Join it and our server shows up in your Arma 3 launcher by
            itself, with no address to type in.
          </Check>
          <Check title="Join the server once, on your own, before op night">
            Loading in cold is the only way to know your mods work. You can get
            in from the launcher once you&apos;ve joined the unit on
            units.arma3.com, from the Arma main menu with our modpack loaded,
            or with the details posted in #unit-information. Better to find
            that out midweek than at 7:58 on Sunday.
          </Check>
        </Checklist>
        <p>
          If something throws an error, screenshot it and post it in
          #recruit-chat instead of fighting it alone. Somebody has almost
          certainly hit the same thing.
        </p>
      </Phase>

      <Phase
        n="03"
        when="Friday, 8PM ET"
        title="Paramarine Recruit Training"
        effort="About 90 minutes"
      >
        <p>
          PRT is what gets you onto the roster properly. It covers movement and
          formations, spacing, basic radio work, and the way our briefings and
          chain of command run. Nobody expects you to show up already knowing
          it.
        </p>
        <p className="rounded-sm border border-edge bg-raised px-5 py-4 text-ink">
          You don&apos;t need to pass PRT before your first op, so come out on
          Sunday either way. You do have thirty days from joining to get it
          done, which is four Fridays.
        </p>
        <Checklist>
          <Check title="Show up Friday at 8PM ET">
            PRT runs on its own night, recruits only. Take the first one you
            can make. The thirty days start when you join, not when you get
            around to booking it.
          </Check>
          <Check title="Come with your mods loaded and your controls bound">
            It starts on time and an instructor runs it live. Give yourself ten
            minutes at the front so you&apos;re not the reason it starts late.
          </Check>
          <Check title="Rules and Regulations come from your recruiter">
            Those get covered in your recruitment interview, not at PRT.
          </Check>
        </Checklist>
        <p>
          It runs about ninety minutes in one sitting. An instructor takes you
          through unit structure, the controls and addon options above, ACE
          interaction, medical, comms and contact reports, navigation, stances
          and movement, weapons, and airborne operations. It&apos;s a lot of
          ground, which is why someone teaches it instead of handing you a
          document.
        </p>
        <p>
          Before and after PRT you&apos;re an 0311 Rifleman in a rifle squad.
          Everyone starts there.{" "}
          <Link
            href="/roles"
            className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
          >
            Marksman, corpsman, armor crew, pilot, and JTAC
          </Link>{" "}
          all come later, through courses.
        </p>
      </Phase>

      <Phase
        n="04"
        when="Sunday, 8PM ET"
        title="Your first operation"
        effort="Two to three hours"
      >
        <p>
          The op is what the rest of the week is built around. Two to three
          hours, sometimes longer, and plenty of it is walking and listening
          rather than shooting. That&apos;s closer to the real thing than most
          games get, and it&apos;s what people stay for.
        </p>
        <Checklist>
          <Check title="Sign up in advance">
            Sign up on the calendar in the portal, or from the embed in the
            attendance channels on Discord. Leadership builds the squads off
            that list, so late sign-ups get fitted in wherever there&apos;s
            room.
          </Check>
          <Check title="Take a rifleman loadout until PRT is done">
            You can deploy before you&apos;ve passed PRT. Until it&apos;s
            signed off, run a rifleman loadout regardless of what else is on
            the rack. The specialist kit sits behind the courses that teach it.
          </Check>
        </Checklist>
        <dl className="mt-6 max-w-2xl space-y-3 rounded-sm border border-edge bg-surface p-5 font-mono text-sm">
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">T-30</dt>
            <dd className="text-ink-muted">
              Recruits, be on. Game up, mods loaded, sitting in TeamSpeak.
              Half an hour gives somebody time to sort out a dead plugin with
              you.
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">T-10</dt>
            <dd className="text-ink-muted">
              Most of the unit rolls in. Get on the server, into your
              squad&apos;s channel, and check your radio.
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">8:00</dt>
            <dd className="text-ink-muted">
              Briefing: the situation, the mission, and how it&apos;s being
              run. Ask your questions here.
            </dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-16 shrink-0 text-ink-faint">After</dt>
            <dd className="text-ink-muted">
              Insertion, movement, contact, consolidation, debrief.
            </dd>
          </div>
        </dl>
        <h3 className="mt-8 font-display text-base font-semibold text-ink">
          Five things to get right on the night
        </h3>
        <ul className="max-w-2xl list-disc space-y-2 pl-6">
          <li>
            <span className="text-ink">Hold your spacing.</span> Bunching up
            feels safer. It&apos;s also how a whole fire team goes down to one
            grenade.
          </li>
          <li>
            <span className="text-ink">Stay off the net.</span> Listen for the
            first hour. When you do key up: direction, distance, description.
            Then let go of the key.
          </li>
          <li>
            <span className="text-ink">Follow your team leader.</span>{" "}
            They&apos;ve got three or four people to move and a squad leader to
            answer to. Move when they move.
          </li>
          <li>
            <span className="text-ink">Don&apos;t freelance.</span> Going after
            something you spotted, on your own, without telling anyone, wrecks
            the op for everybody else.
          </li>
          <li>
            <span className="text-ink">Ask afterwards, not during.</span>{" "}
            Debrief questions get real answers. Questions in the middle of a
            firefight step on traffic other people need.
          </li>
        </ul>
        <p>
          Dying early isn&apos;t a failure and it happens to everybody. Stay in
          voice, watch how the rest of it plays out, and come back next week.
        </p>
      </Phase>

      <Phase n="05" when="First month" title="After your first op" effort="Ongoing">
        <p>
          Sunday, 8 until 11, is the night to build your week around. The rest
          of the calendar is there if you want it. Tuesdays your squad or
          platoon trains, and the whole unit trains together on the third
          Tuesday of the month. Thursdays are recon, which needs the MSO
          certification. Saturdays are attendee&apos;s choice, meaning
          whichever course the most people there need is the one that gets
          taught. Show up and ask for yours, or somebody else&apos;s gets run
          instead.
        </p>
        <Checklist>
          <Check title="Show up on Sundays, and say when you can't">
            We expect 75% attendance at operations and 50% at training.
            It&apos;s deliberately not everything, because people have jobs. If
            you&apos;re going to be away, file a Personnel Action Request on
            the portal. A recorded absence is fine; going quiet is what causes
            problems.
          </Check>
          <Check title="Ask for the Saturday course you want">
            Every course you pass is another billet you can be slotted into,
            and the one that runs is the one the most attendees need.
          </Check>
          <Check title="Keep an eye on your service record">
            Promotions have real requirements: time in grade, points, and
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
            Passing PRT makes you eligible for promotion to Private, which is
            the line between recruit and Marine.
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
            Ask your fire team leader or squad leader first. Sorting this out
            is part of the job, and they&apos;d rather hear about it midweek
            than watch you miss Sunday. If they&apos;re not around, post in
            #recruit-chat or your squad channel.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
            <p className="text-sm text-ink-muted">
              Everyone in the unit did this once. Most of them recently enough
              to remember it.
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
