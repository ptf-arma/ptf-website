import type { Metadata } from "next";
import Link from "next/link";
import { billet, links, SITE_URL } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

export const metadata: Metadata = {
  title: "What Is Arma 3 Milsim? A Beginner's Guide",
  description:
    "New to Arma 3 milsim? What it involves, how an operation actually runs, radio discipline, squad structure, mods, common mistakes, and how to pick a unit worth joining.",
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
    "What military simulation actually is, what an operation feels like, how squads and radio nets work, the roles you can play, and how to choose your first Arma 3 milsim unit.",
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
            operation starts. That&apos;s the balance most people looking
            are actually after — enough structure to make the game work,
            without a second job&apos;s worth of formality bolted onto it.
          </p>
          <p>
            Work out where a unit sits before you apply. Too loose and
            operations turn into the same disorganized scramble as a public
            server, just with extra steps. Too rigid and it stops being fun
            for anyone who isn&apos;t already fully committed. Ask what a
            normal week actually looks like rather than taking anyone&apos;s
            word for how &ldquo;hardcore&rdquo; or &ldquo;casual&rdquo; they
            are — those words mean something different in every Discord.
          </p>

          <H2>What actually separates milsim from a public server</H2>
          <p>
            Public Arma 3 servers run the same game, technically. Same
            weapons, same terrain, same ballistics model. What&apos;s
            different is everything around the shooting. On a public server
            you spawn in, grab a loadout, and go fight whoever&apos;s
            nearest. There&apos;s no real plan because there&apos;s no one
            to plan with — half the server leaves after the first firefight,
            and the other half is on a different continent&apos;s server
            browser entry for a reason.
          </p>
          <p>
            Milsim replaces that with persistence. The same roster shows up
            week after week, which means a plan survives longer than the
            first three minutes, because the person next to you already
            knows what &ldquo;flank the treeline on my mark&rdquo; means and
            isn&apos;t going to wander off to loot bodies. Positions are
            assigned before the op starts, not fought over. Someone is
            explicitly in charge, and everyone else has agreed, by joining
            the unit, to do what that person says for the two or three hours
            the operation runs.
          </p>
          <p>
            The other real difference is what death costs. On a public
            server, dying just means you respawn thirty seconds later.
            Units handle it differently — some run limited respawns or
            respawn waves, others put you out for the rest of the operation
            once your character is gone. Either way the cost is high enough
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
              before the op, leadership puts out a short heads-up — mission
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
              teams hold formation, squads hold spacing, and the whole
              element moves at the pace of its most careful member — bunching
              up or rushing is how a unit loses half its strength to one
              machine gun.
            </li>
            <li>
              <span className="text-ink">Actions on contact.</span> The plan
              survives until someone shoots at you. After that it&apos;s
              drills: return fire, call contact over the radio with a
              direction and distance, get people into cover, and the team
              leader decides whether to push, flank, or pull back. This is
              the part that separates a unit that trains from one that
              doesn&apos;t — a trained fire team has run this so many times
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
              and it&apos;s normal — people disagree about whose fault the
              ambush was.
            </li>
          </ul>
          <p>
            Two to three hours is typical for a main operation. Some of that
            is combat. A lot of it is walking, waiting, and talking on the
            radio, which is a more honest description of infantry work than
            most games bother giving you.
          </p>

          <H2>Radio discipline — why it&apos;s not just flavor</H2>
          <p>
            Most units run separate radio nets for different levels of
            command: a squad net that your fire team and squad leader share,
            and a platoon or command net that only squad leaders and above
            use to talk to each other. You don&apos;t hear the platoon net,
            and platoon doesn&apos;t hear every rifleman&apos;s individual
            chatter — that separation is what keeps forty or sixty people on
            the same server from turning into unusable noise.
          </p>
          <p>
            Brevity is the whole point. A call like &ldquo;contact,
            treeline, two hundred meters, machine gun&rdquo; gives a team
            leader direction, range, and threat type in about two seconds.
            The same information delivered as a rambling description of what
            you think you saw takes ten times as long and usually arrives
            after the situation has already changed. Units teach standard
            call formats — contact reports, situation reports, requests for
            fire — specifically so people aren&apos;t inventing phrasing
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
            The basic building block is the fire team — usually three or
            four people. A rifle squad is normally two fire teams plus a
            squad leader, so somewhere around seven to nine people. Multiple
            squads make up a platoon, run by a platoon leader coordinating
            over the command net, sometimes with a platoon sergeant handling
            logistics and stragglers.
          </p>
          <p>
            Positions inside that structure aren&apos;t interchangeable. A
            fire team leader is responsible for their three or four people
            specifically — where they move, what they&apos;re watching,
            whether they&apos;ve taken casualties — and reports up to the
            squad leader. The squad leader owns the bigger picture: the
            objective, the route, when to commit the second team versus hold
            it in reserve. A rifleman&apos;s job is to watch an assigned
            sector and follow the team leader&apos;s direction rather than
            freelance — chasing a target you spotted on your own is how a
            fire team loses a member and its formation at the same time.
          </p>
          <p>
            Specialists slot into this structure rather than operating
            outside it. A squad&apos;s machine gunner still takes orders
            from the team leader; a corpsman attached to a squad still moves
            and holds cover like everyone else, just with a different job
            once someone goes down. Nobody in a working squad is out there
            making independent calls — that&apos;s what the chain of command
            exists to prevent.
          </p>

          <H2>Roles</H2>
          <p>
            Everyone starts as a rifleman, and it&apos;s genuinely the best
            place to learn — you get to watch how a squad works before
            you&apos;re responsible for anything beyond your own sector and
            rifle. After that, most units offer some version of: marksman
            (precision fire, usually attached to a squad rather than working
            solo), corpsman or medic (keeping people in the fight after
            they&apos;re hit), machine gunner (the fire team&apos;s
            suppression), engineer (breaching, mines, fortifications), armor
            crew, pilots if the unit flies its own aircraft, and JTAC — the
            person on the ground talking aircraft onto targets, which is as
            much about radio procedure as it is about spotting.
          </p>
          <p>
            In a decent unit these are qualifications you earn on a course,
            not roles you pick off a list on day one. That matters more than
            it sounds like it should — a unit that lets brand-new members
            fly attack helicopters or call in airstrikes on request usually
            has a training pipeline in name only, and it tends to show in how
            the operations actually run.
          </p>

          <H2>Mods and modpacks</H2>
          <p>
            Arma 3 out of the box is a sandbox. What turns it into a
            specific unit&apos;s version of milsim is the modpack — a
            curated collection of mods bundled together, usually distributed
            as a single Steam Workshop collection so installing it is one
            click and one download instead of hunting down forty individual
            mods yourself.
          </p>
          <p>
            A typical modpack changes more than it looks like from the
            outside: uniforms and factions matching whatever setting the
            unit uses, weapon and attachment overhauls, a reworked UI, task
            and mission frameworks that mission-makers build operations
            around, and usually something like ACE3 or a similar system that
            changes how medical treatment, weapon handling, and interaction
            with the environment all work. Running a modpack instead of
            vanilla or someone else&apos;s public mod mix is also how a unit
            keeps its look and rule set consistent operation to operation —
            everyone&apos;s in the same uniforms, using the same interaction
            keybinds, playing under the same medical system.
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
            Freelancing is the third. Spotting a target and moving to engage
            it without telling anyone, or deciding the plan is wrong and
            doing something else instead, breaks the thing that makes milsim
            different from a public server in the first place — everyone
            moving off a shared plan. A mediocre plan executed together
            usually beats a good idea executed alone.
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
            operations on other days. The main operation is usually the one
            thing attendance actually gets measured against — miss too many
            in a row and expect a conversation about whether the schedule
            works for you, even in units that don&apos;t formally track it.
          </p>
          <p>
            The extra nights — training, schools, specialized operations —
            are typically optional, there for people who want to qualify for
            a new role or simply want to play more. A unit that expects
            every member at every event on the calendar is unusual and worth
            asking about directly, since that&apos;s a considerably bigger
            weekly commitment than &ldquo;milsim&rdquo; implies by default.
          </p>
          <p>
            Realistically, budget two to three hours for the main operation
            and expect it to occasionally run long — operations don&apos;t
            always wrap up on schedule. Time zone matters more than almost
            anything else here. A great unit whose op runs at an hour you
            can&apos;t reliably make isn&apos;t a great unit for you.
          </p>

          <H2>What to expect from training</H2>
          <p>
            Nearly every unit that isn&apos;t purely casual runs some kind
            of recruit or basic course before letting new members into a
            full operation. It typically covers movement — formations,
            spacing, moving as part of a fire team rather than as an
            individual — basic radio procedure, and how the unit
            specifically runs its briefings and command structure, since
            that varies unit to unit even when the underlying skills
            don&apos;t.
          </p>
          <p>
            It&apos;s usually shorter and less intimidating than it sounds.
            A few hours, sometimes split across a couple of sessions, run by
            existing members rather than some separate instructor cadre.
            Nobody expects you to show up already knowing formations or
            brevity codes — the entire point of the course is that you
            don&apos;t, yet.
          </p>
          <p>
            After training, the normal next step is a real operation in a
            rifle squad, usually as a rifleman, with a team leader keeping
            an eye on you. Specialist roles — marksman, medic, pilot, and so
            on — come later, through further courses once you&apos;ve got a
            normal operation or two behind you.
          </p>

          <H2>What you need</H2>
          <p>
            Arma 3 on PC, a working microphone, and whatever modpack the
            unit runs. That&apos;s the actual floor. You don&apos;t need a
            powerful PC, but know that Arma leans harder on your CPU than
            your graphics card, and a sixty-player operation with a lot of
            AI is the worst case rather than the average — if the game runs
            acceptably in singleplayer, expect a large op to run worse. You
            don&apos;t need prior experience, and you don&apos;t need a
            headset better than whatever came in the box.
          </p>
          <p>
            Voice comms usually run through Discord, TeamSpeak, or both,
            separate from in-game radio — one for the community and general
            chat, in-game radio simulated through mods for the operation
            itself. Any unit worth joining teaches recruits from scratch. If
            a unit&apos;s application or Discord reads like it expects you
            to arrive already fluent in formations and brevity codes, that
            tells you something about how they treat new players, and
            it&apos;s not a good sign.
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
              &ldquo;Discord roles,&rdquo; adjust expectations — that usually
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
            rifle squad. The application itself is usually short — a form
            asking for basic information and maybe your availability, not an
            essay. The recruiter conversation that follows is where the
            modpack gets installed and most of your actual questions get
            answered, so it&apos;s worth showing up to that step rather than
            letting the application sit unanswered. Reckon on one to two
            weeks from application to your first operation, depending on
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
