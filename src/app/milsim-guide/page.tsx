import type { Metadata } from "next";
import Link from "next/link";
import { billet, links, SITE_URL } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata: Metadata = {
  // Absolute, so the "· Paramarine Task Force" template doesn't push this past
  // the ~60 characters Google will render before truncating.
  title: { absolute: "What Is Arma 3 Milsim? A Beginner's Guide" },
  description:
    "What Arma 3 milsim involves: how an operation runs, radio and squad structure, modpacks, and how to pick a unit worth joining.",
  alternates: { canonical: "/milsim-guide" },
  openGraph: {
    title: "What Is Arma 3 Milsim? A Beginner's Guide",
    description:
      "What military simulation actually is, what an operation feels like, and how to choose your first Arma 3 milsim unit.",
    url: `${SITE_URL}/milsim-guide`,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    title: "What Is Arma 3 Milsim? A Beginner's Guide",
    description:
      "What military simulation actually is, what an operation feels like, and how to choose your first Arma 3 milsim unit.",
  },
};

const articleJsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "What Is Arma 3 Milsim? A Beginner's Guide",
  description:
    "What military simulation actually is, what an operation feels like, how squads and radio nets work, the roles you can play, and how to choose your first Arma 3 milsim unit.",
  author: { "@type": "Organization", name: "Paramarine Task Force" },
  publisher: { "@id": `${SITE_URL}/#org` },
  mainEntityOfPage: `${SITE_URL}/milsim-guide`,
  image: `${SITE_URL}/og.jpg`,
  // Google's Article guidance expects both. Bump dateModified when the guide
  // is substantively rewritten, not for typo fixes.
  datePublished: "2026-07-18",
  dateModified: "2026-08-25",
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
      <article className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6">
        <SectionLabel>Guide</SectionLabel>
        <h1 className="heading-display mt-3 max-w-2xl text-4xl text-ink sm:text-5xl">
          What is Arma 3 milsim?
        </h1>
        <p className="max-w-2xl mt-5 text-lg leading-relaxed text-ink-muted">
          Milsim is Arma 3 played as a team, with a plan, in a unit that keeps
          the same people week to week. If you&apos;ve only played public
          servers, it&apos;s a different game. Here&apos;s what to expect
          before you sign up anywhere.
        </p>

        <div className="max-w-2xl mt-6 space-y-4 leading-relaxed text-ink-muted">
          <H2>How strict does it get?</H2>
          <p>
            &ldquo;Milsim&rdquo; covers a wide spectrum, and the word alone
            tells you almost nothing. At one end are co-op groups: no ranks,
            no attendance, jump in when you feel like it, barely
            distinguishable from a public server except the same people tend
            to show up. At the other end are units that run drill nights,
            expect real-world rank courtesies in voice chat, and hold
            briefings that last as long as the operation itself. Both exist.
            Both have players who genuinely prefer them.
          </p>
          <p>
            Most units, ours included, sit in the middle: chain of command
            and radio discipline while the op is running, ordinary
            conversation either side of it. In practice that tends to mean
            nobody stands on ceremony in the general Discord channel, and
            everybody takes direction from their fire team leader once the
            operation starts. That&apos;s the balance most people are
            actually after. Enough structure to make the game work, without a
            second job&apos;s worth of formality bolted onto it.
          </p>
          <p>
            Figure out where a unit sits before you apply. Too loose and
            operations turn into the same disorganized scramble as a public
            server, just with extra steps. Too rigid and it stops being fun
            for anyone who isn&apos;t already fully committed. Ask what a
            normal week actually looks like rather than taking anyone&apos;s
            word for how &ldquo;hardcore&rdquo; or &ldquo;casual&rdquo; they
            are. Those words mean something different in every Discord.
          </p>

          <H2>What actually separates milsim from a public server</H2>
          <p>
            Public Arma 3 servers run the same game, technically. Same
            weapons, same terrain, same ballistics model. What&apos;s
            different is everything around the shooting. On a public server
            you spawn in, grab a loadout, and go fight whoever&apos;s
            nearest. There&apos;s no real plan because there&apos;s no one
            to plan with. Half the server leaves after the first firefight, and
            the other half is on a different continent&apos;s server browser
            entry for a reason.
          </p>
          <p>
            Milsim replaces that with persistence. The same roster shows up
            week after week, so a plan survives past the first three minutes.
            The person next to you knows what &ldquo;flank the treeline on my
            mark&rdquo; means. They won&apos;t wander off to loot bodies.
            Positions are assigned before the op starts, not fought over. One
            person is in charge, and everyone else agreed to that by joining.
          </p>
          <p>
            The other real difference is what death costs. On a public
            server, dying just means you respawn thirty seconds later.
            Units handle it differently. Some run limited respawns or respawn
            waves. Others put you out for the rest of the operation once your
            character is gone. Either way the cost is high enough
            to change how people move. Nobody sprints across open ground on
            the assumption the AI will probably miss, because it might not,
            and that might be the last thing that character does all night.
            Worth asking a unit how they handle it, since it shapes the
            feel of an operation more than almost any other single rule.
          </p>

          <H2>Walking through an operation, step by step</H2>
          <p>
            The rough shape is the same everywhere, even when the vocabulary
            differs from unit to unit.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="text-ink">Warning order.</span> Hours or days
              before the op, leadership puts out a short heads-up: mission
              type, rough area, what to bring. Enough for squad leaders to
              start thinking, not a full plan yet.
            </li>
            <li>
              <span className="text-ink">Briefing.</span> The unit forms up
              and gets the actual order: situation (who&apos;s out there and
              why it matters), mission (the one sentence that defines
              success), and execution (routes, phasing, who&apos;s doing
              what). Questions get asked here, not once everyone&apos;s
              already moving.
            </li>
            <li>
              <span className="text-ink">Insertion and movement.</span> You
              load into vehicles or helicopters, or you start walking. Fire
              teams hold formation and squads hold spacing. The element moves
              at the pace of its most careful member. Bunching up is how a
              unit loses half its strength to one machine gun.
            </li>
            <li>
              <span className="text-ink">Actions on contact.</span> The plan
              survives until someone shoots at you. After that it&apos;s
              drills: return fire, call contact over the radio with a
              direction and distance, get people into cover, and the team
              leader decides whether to push, flank, or pull back. This is
              the part that separates a unit that trains from one that
              doesn&apos;t. A trained fire team has run it so many times
              it&apos;s closer to muscle memory than decision-making.
            </li>
            <li>
              <span className="text-ink">Consolidation.</span> Once the
              objective is taken or the fight is over, you reorganize: check
              ammo, check casualties, re-establish security so nobody
              counterattacks into a group that&apos;s still celebrating.
            </li>
            <li>
              <span className="text-ink">Debrief.</span> Back at base, or in
              Discord afterward, leadership runs through what worked and what
              didn&apos;t. This is also where most of the arguing happens,
              and that&apos;s normal. People disagree about whose fault the
              ambush was.
            </li>
          </ul>
          <p>
            Two to three hours is typical for a main operation. Some of that
            is combat. A lot of it is walking, waiting, and talking on the
            radio, which is a more honest description of infantry work than
            most games bother giving you.
          </p>

          <H2>Radio discipline</H2>
          <p>
            Most units run separate radio nets by level of command. Your fire
            team and squad leader share a squad net. Squad leaders and above
            talk to each other on a platoon or command net. You don&apos;t
            hear the platoon net, and platoon doesn&apos;t hear every
            rifleman. That separation is what stops sixty people on one server
            turning into noise.
          </p>
          <p>
            Brevity is the whole point. A call like &ldquo;contact,
            treeline, two hundred meters, machine gun&rdquo; gives a team
            leader direction, range, and threat type in about two seconds.
            The same information delivered as a rambling description of what
            you think you saw takes ten times as long and usually arrives
            after the situation has already changed. Units teach standard
            call formats for contact reports, situation reports, and requests
            for fire, specifically so people aren&apos;t inventing phrasing
            under pressure.
          </p>
          <p>
            This is also the first thing new players get wrong. Talking over
            the squad leader, narrating your own kills, or keying up to ask
            questions mid-firefight are habits carried over from public
            servers that don&apos;t fit here. Most of it fixes itself within
            a session or two, once you&apos;ve actually heard what
            disciplined traffic sounds like.
          </p>

          <H2>Squad and fire team structure</H2>
          <p>
            The basic building block is the fire team, usually three or four
            people. A rifle squad is normally two fire teams plus a
            squad leader, so somewhere around seven to nine people. Multiple
            squads make up a platoon, run by a platoon leader coordinating
            over the command net, sometimes with a platoon sergeant handling
            logistics and stragglers.
          </p>
          <p>
            Positions inside that structure aren&apos;t interchangeable. A
            fire team leader is responsible for their three or four people
            specifically: where they move, what they&apos;re watching, whether
            they&apos;ve taken casualties. They report up to the squad leader. The squad leader owns the bigger picture: the
            objective, the route, when to commit the second team. A
            rifleman watches an assigned sector and follows the team
            leader. Chasing a target you spotted yourself is how a fire team
            loses a member and its formation at once.
          </p>
          <p>
            Specialists slot into this structure rather than operating
            outside it. A squad&apos;s machine gunner still takes orders
            from the team leader; a corpsman attached to a squad still moves
            and holds cover like everyone else, just with a different job
            once someone goes down. Nobody in a working squad is out there
            making independent calls. That&apos;s what the chain of command is
            for.
          </p>

          <H2>Roles</H2>
          <p>
            Everyone starts as a rifleman. It&apos;s the best place to learn.
            You watch how a squad works before you&apos;re responsible for
            anything beyond your own sector.
          </p>
          <p>After that, most units offer some version of these:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="text-ink">Marksman.</span> Precision fire,
              attached to a squad rather than working alone.
            </li>
            <li>
              <span className="text-ink">Corpsman.</span> Keeps people in the
              fight after they&apos;re hit.
            </li>
            <li>
              <span className="text-ink">Machine gunner.</span> The fire
              team&apos;s suppression.
            </li>
            <li>
              <span className="text-ink">Engineer.</span> Breaching, mines,
              fortifications.
            </li>
            <li>
              <span className="text-ink">Armor crew and pilots.</span> Where
              the unit runs its own vehicles and aircraft.
            </li>
            <li>
              <span className="text-ink">JTAC.</span> Talks aircraft onto
              targets from the ground. More radio procedure than spotting.
            </li>
          </ul>
          <p>
            In a decent unit these are qualifications you earn on a course,
            not roles you pick off a list on day one. That matters. A unit
            that lets brand-new members fly attack helicopters on request has
            a training pipeline in name only, and it shows in how the
            operations run.
          </p>

          <H2>Mods and modpacks</H2>
          <p>
            Arma 3 out of the box is a sandbox. The modpack is what turns it
            into a specific unit&apos;s version of milsim. It&apos;s a curated
            set of mods bundled together, usually as one Steam Workshop
            collection, so you subscribe once instead of hunting down forty
            mods yourself.
          </p>
          <p>
            A modpack changes more than it looks like from the outside:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>Uniforms and factions matching the unit&apos;s setting.</li>
            <li>Weapon and attachment overhauls.</li>
            <li>A reworked interface.</li>
            <li>
              Mission frameworks that mission-makers build operations around.
            </li>
            <li>
              Usually ACE3 or something like it, which rewrites medical
              treatment, weapon handling, and how you interact with anything.
            </li>
          </ul>
          <p>
            Running one is also how a unit stays consistent week to week.
            Everyone&apos;s in the same uniforms, on the same keybinds, under
            the same medical system.
          </p>
          <p>
            Installing one is normally just subscribing to a Steam Workshop
            collection, letting it download, and pointing your Arma 3
            launcher at it. It can run to tens of gigabytes and take a while
            over a slow connection, which is worth knowing before your first
            scheduled op rather than during it.
          </p>

          <H2>Common mistakes in your first few operations</H2>
          <p>
            Bunching up is the classic one. New players cluster together
            because it feels safer, and one grenade or one burst of machine
            gun fire turns a bunched fire team into a casualty report.
            Spacing feels unnatural at first and is one of the first things
            training tries to fix.
          </p>
          <p>
            Talking on the radio like it&apos;s a public server is another.
            Narrating every kill, asking questions mid-contact, or keying up
            to chat during a firefight steps on traffic that actually
            matters. Listening for a session or two before transmitting much
            usually solves it on its own.
          </p>
          <p>
            Freelancing is the third. Moving to engage something without
            telling anyone, or deciding the plan is wrong and doing your own
            thing, breaks the one thing that separates milsim from a public
            server. Everyone works off a shared plan. A mediocre plan carried
            out together beats a good idea carried out alone.
          </p>
          <p>
            None of this reflects badly on new players. It&apos;s habits
            from other kinds of play that don&apos;t map cleanly onto this
            one, and any unit that actually trains recruits has seen every
            version of it more times than it can count.
          </p>

          <H2>Time commitment and what &ldquo;attendance&rdquo; really means</H2>
          <p>
            Most units run one main operation a week at a fixed time, plus
            some combination of training nights, courses, or secondary
            operations on other days. The main operation is the one
            attendance gets measured against. Miss too many in a row and
            expect a conversation about whether the schedule works for you,
            even in units that don&apos;t formally track it.
          </p>
          <p>
            The extra nights, meaning training, schools, and specialized
            operations, are usually optional, there for people who want to qualify for
            a new role or simply want to play more. A unit that expects
            every member at every event on the calendar is unusual and worth
            asking about directly, since that&apos;s a considerably bigger
            weekly commitment than &ldquo;milsim&rdquo; implies by default.
          </p>
          <p>
            Realistically, budget two to three hours for the main operation
            and expect it to run long sometimes. Operations don&apos;t always
            wrap up on schedule. Time zone matters more than almost
            anything else here. A great unit whose op runs at an hour you
            can&apos;t reliably make isn&apos;t a great unit for you.
          </p>

          <H2>What to expect from training</H2>
          <p>
            Nearly every unit that isn&apos;t purely casual runs a recruit
            course before letting you into a full operation. It covers
            movement: formations, spacing, working as part of a fire team
            instead of as an individual. Then basic radio procedure. Then how
            that particular unit runs its briefings and chain of command,
            which varies even where the underlying skills don&apos;t.
          </p>
          <p>
            It&apos;s shorter and less intimidating than it sounds. A few
            hours, sometimes split over two sessions, run by existing members
            rather than a separate instructor cadre. Nobody expects you to
            arrive knowing formations or brevity codes. That&apos;s the point
            of the course.
          </p>
          <p>
            After training you go into a real operation in a rifle squad,
            usually as a rifleman, with a team leader watching how you get on.
            Specialist roles come later, through further courses, once
            you&apos;ve got an operation or two behind you.
          </p>

          <H2>What you need</H2>
          <p>
            Arma 3 on PC, a working microphone, and whatever modpack the unit
            runs. That&apos;s the floor. You don&apos;t need prior experience,
            and you don&apos;t need a headset better than whatever came in the
            box.
          </p>
          <p>
            One thing worth knowing about the hardware. Arma leans harder on
            your CPU than your graphics card. A sixty-player operation with a
            lot of AI is the worst case, not the average. If the game runs
            acceptably in singleplayer, expect a large op to run worse.
          </p>
          <p>
            Voice runs through Discord, TeamSpeak, or both, separate from the
            in-game radio. One is for the community, the other is simulated
            through mods during the operation. Any unit worth joining teaches
            recruits from scratch. If an application reads like it expects you
            to arrive fluent in formations and brevity codes, that tells you
            how they treat new players.
          </p>

          <H2>How to pick one</H2>
          <p>Five things worth checking:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <span className="text-ink">How long it&apos;s been running.</span>{" "}
              Most units fold inside a year. Five or ten means the leadership
              and the schedule hold up. Ask directly if the &ldquo;founded&rdquo;
              date on a Discord banner isn&apos;t obviously old.
            </li>
            <li>
              <span className="text-ink">The time slot.</span> Ops run at a
              fixed hour in a fixed timezone. If that&apos;s 3AM where you
              live, nothing else about the unit matters, no matter how good
              everything else looks.
            </li>
            <li>
              <span className="text-ink">Whether progression is tracked.</span>{" "}
              Ask where ranks and course completions live. If the answer is
              &ldquo;Discord roles,&rdquo; adjust expectations. That usually
              means promotions are informal and easy to forget about.
            </li>
            <li>
              <span className="text-ink">Signs of life.</span> Recent videos,
              screenshots, a Discord with traffic in it. No recent media
              usually means no recent ops, whatever the member count says.
            </li>
            <li>
              <span className="text-ink">The people.</span> Sit in their
              Discord for a week before applying. That&apos;s what
              you&apos;re actually joining, far more than any mission set or
              modpack.
            </li>
          </ul>

          <H2>How joining usually works</H2>
          <p>
            Most units follow the same pattern: application, a conversation
            with a recruiter, a training course, then your first op in a
            rifle squad. The application itself is usually short: a form
            asking for basic information and maybe your availability, not an
            essay. The recruiter conversation that follows is where the
            modpack gets installed and most of your actual questions get
            answered, so it&apos;s worth showing up to that step rather than
            letting the application sit unanswered. Figure one to two weeks
            from application to your first operation, depending on
            when training runs.{" "}
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
