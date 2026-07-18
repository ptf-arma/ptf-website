import type { Metadata } from "next";
import Link from "next/link";
import { billet, links, SITE_URL } from "@/lib/config";
import { getStats } from "@/lib/billet";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { LocalTime } from "@/components/local-time";

export const metadata: Metadata = {
  title: "How to Join",
  description:
    "How to join the Paramarine Task Force, a 10-year Arma 3 milsim unit: what you need, how the application works, and what your first weeks look like. Main op Sundays 8PM ET.",
  alternates: { canonical: "/join" },
  openGraph: {
    title: "How to Join the Paramarine Task Force",
    description:
      "What you need, how the application works, and what your first weeks in our Arma 3 milsim unit look like.",
    url: `${SITE_URL}/join`,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
};

const steps = [
  {
    n: "01",
    title: "Submit your application",
    body: "Five minutes on the personnel portal. The profile you create becomes your service record — rank, courses, and awards all hang off it.",
  },
  {
    n: "02",
    title: "Meet a recruiter on Discord",
    body: "Post in #find-a-recruiter. Someone will walk you through the unit, answer questions, and get the modpack installed. No appointment needed.",
  },
  {
    n: "03",
    title: "Paramarine Recruit Training",
    body: "PRT covers movement, comms, and formations. Nobody expects you to arrive knowing this — that's what the course is for.",
  },
  {
    n: "04",
    title: "Your first operation",
    body: "You'll slot into a rifle squad for the Sunday op. After that, Saturday courses open up: marksmanship, armor, aviation, medical, JTAC.",
  },
];

// NOTE: answers below are drawn from unit facts on record; the unit should
// fact-check anything about requirements before treating this as policy.
const faqs = [
  {
    q: "Do I need milsim experience?",
    a: "No. Recruit training covers movement, communications, and how our ops run. A lot of the unit arrived having never done this before.",
  },
  {
    q: "What do I need to play?",
    a: "Arma 3 on PC, a microphone, and our modpack — “Paramarine Milsim Core” on the Steam Workshop, which installs in one click. Voice is on Discord and TeamSpeak.",
  },
  {
    q: "When does the unit play?",
    a: "Sunday 8PM Eastern is the main operation and the one to build your week around. Field training runs Tuesdays, specialized courses Saturdays, and MSO recon ops Thursdays — all 8PM Eastern.",
  },
  {
    q: "Do I have to attend everything?",
    a: "No. Sunday is the operation everyone turns out for. Tuesday and Saturday are there when you want to train or qualify for something new.",
  },
  {
    q: "I'm not in North America — can I still join?",
    a: "Yes, as long as 8PM Eastern lands somewhere you can play. We have members outside North America. Work out what that time is locally before you apply.",
  },
  {
    q: "What role do I start in?",
    a: "0311 Rifleman, in a rifle squad. Marksman, corpsman, armor crew, pilot, and MSO all come later, through courses and selection.",
  },
  {
    q: "What is MSO?",
    a: "Marine Special Operator — a second role on top of your normal billet, running its own recon operations on Thursdays. Selection is demanding and the standard is high, but anyone in the unit can try out.",
  },
  {
    q: "Is the rank structure real?",
    a: "Yes. Promotions have requirements: time in grade, points, and course completions, all tracked in the personnel system. See the ranks page for the exact thresholds.",
  },
  {
    q: "How strict is it?",
    a: "Chain of command, briefings, and radio discipline during the op. Outside of it, it's a group of people who have been playing games together for ten years.",
  },
  {
    q: "What happens right after I apply?",
    a: "A recruiter picks up your application and reaches out on Discord to schedule recruit training. Posting in #find-a-recruiter right after you apply speeds it up.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default async function JoinPage() {
  // Unit-configured key facts (schedule, region, realism, age) come from
  // Billet Settings; the block below renders only for facts that are set.
  const stats = await getStats();
  const keyFacts: [string, string][] = stats
    ? (
        [
          ["Schedule", stats.keyFacts.opSchedule],
          ["Region", stats.keyFacts.region],
          ["Realism level", stats.keyFacts.realismLevel],
          ["Age requirement", stats.keyFacts.ageRequirement],
        ] as [string, string | null][]
      ).filter((f): f is [string, string] => f[1] !== null)
    : [];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section className="relative">
        <div className="mx-auto max-w-6xl px-4 pb-16 pt-20 sm:px-6">
          <SectionLabel>Recruitment</SectionLabel>
          <h1 className="heading-display mt-3 max-w-2xl text-4xl text-ink sm:text-5xl">
            How to join the task force
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
            Four steps from application to your first operation. Usually a week
            or two, depending on when training runs.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href={billet.applyUrl} variant="primary" size="lg">
              Start your application
            </ButtonLink>
            <ButtonLink href={links.discord} variant="secondary" size="lg">
              Ask questions on Discord
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionLabel>The pipeline</SectionLabel>
          <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
            Application to first op
          </h2>
          <ol className="mt-10 grid gap-4 md:grid-cols-2">
            {steps.map((step) => (
              <li
                key={step.n}
                className="rounded-sm border border-edge bg-surface p-5"
              >
                <span className="micro-label">{step.n}</span>
                <h3 className="mt-1 font-display text-base font-semibold text-ink">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 font-mono text-xs text-ink-faint">
            Main op SUN · 8PM ET{" "}
            <LocalTime weekday={0} hourEt={20} className="text-ink-faint" /> ·
            FTX TUE · Recon THU (MSO) · Courses SAT
          </p>
        </div>
      </section>

      <section className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
            Before you apply
          </h2>
          {keyFacts.length > 0 ? (
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-3 rounded-sm border border-edge bg-surface px-5 py-4">
              {keyFacts.map(([label, value]) => (
                <div key={label}>
                  <dt className="micro-label">{label}</dt>
                  <dd className="mt-1 font-mono text-sm text-ink">{value}</dd>
                </div>
              ))}
            </dl>
          ) : null}
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="rounded-sm border border-edge bg-surface p-5"
              >
                <h3 className="font-display text-base font-semibold text-ink">
                  {f.q}
                </h3>
                <p className="mt-2 text-sm text-ink-muted">{f.a}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
            <p className="text-sm text-ink-muted">
              Applications take about five minutes.
            </p>
            <div className="flex gap-3">
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
              ← Back to the unit
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
