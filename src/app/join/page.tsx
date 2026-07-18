import type { Metadata } from "next";
import Link from "next/link";
import { billet, links, SITE_URL } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { LocalTime } from "@/components/local-time";

export const metadata: Metadata = {
  title: "How to Join",
  description:
    "How to join the Paramarine Task Force, a 10-year Arma 3 milsim unit: what you need, how the application works, and what your first weeks look like.",
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
    body: "About five minutes on our personnel portal (Billet). You'll create a profile — it becomes your service record, tracking your rank, courses, and awards from day one.",
  },
  {
    n: "02",
    title: "Meet a recruiter on Discord",
    body: "Join our Discord and say hello in #find-a-recruiter. A recruiter walks you through the unit, answers questions, and gets you set up with the modpack. No appointment needed.",
  },
  {
    n: "03",
    title: "Paramarine Recruit Training",
    body: "PRT teaches you everything — movement, comms, formations — no prior milsim experience expected. Most recruits complete it around a weekend schedule.",
  },
  {
    n: "04",
    title: "Your first operation",
    body: "Slot into a rifle squad for the Sunday main op. From there, the 17-course school pipeline is open: marksmanship, armor, aviation, medical, JTAC.",
  },
];

// NOTE: answers below are drawn from unit facts on record; the unit should
// fact-check anything about requirements before treating this as policy.
const faqs = [
  {
    q: "Do I need milsim experience?",
    a: "No. Every Marine starts with Paramarine Recruit Training (PRT), which teaches movement, communications, and how our operations run. Plenty of members joined with zero milsim background.",
  },
  {
    q: "What do I need to play?",
    a: "Arma 3 on PC, a working microphone, and our modpack — the “Paramarine Milsim Core” collection on the Steam Workshop, which installs with one click. We use Discord and TeamSpeak for voice.",
  },
  {
    q: "When does the unit play?",
    a: "Field Training Exercises on Saturdays and the Main Operation on Sundays, both at 8PM Eastern. Members attend what they can — the main op is the weekly centerpiece.",
  },
  {
    q: "I'm not in North America — can I still join?",
    a: "If Saturday and Sunday 8PM Eastern works in your timezone, absolutely. We have members outside North America; check what that time is for you locally before applying.",
  },
  {
    q: "What role do I start in?",
    a: "Everyone starts as an 0311 Rifleman in a rifle squad. Specializations — designated marksman, corpsman, armor crew, pilot, special operations — are progression paths you qualify into through the school pipeline.",
  },
  {
    q: "Is there real rank progression?",
    a: "Yes. Ranks, course completions, and awards are tracked in our personnel system with formal promotion requirements — your service record is real, not a forum title.",
  },
  {
    q: "How serious is “milsim” here?",
    a: "Serious enough to run a real operation — briefings, chain of command, radio discipline — and relaxed enough to enjoy it. We've kept that balance for ten years, and we play other games together between ops.",
  },
  {
    q: "What happens right after I apply?",
    a: "A recruiter picks up your application, reaches out on Discord, and schedules you into recruit training. The fastest path is applying and then saying hello in #find-a-recruiter right away.",
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

export default function JoinPage() {
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
            From application to your first operation in four steps — here&apos;s
            exactly what to expect.
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
            Ops run SAT + SUN · 8PM ET{" "}
            <LocalTime weekday={0} hourEt={20} className="text-ink-faint" />
          </p>
        </div>
      </section>

      <section className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionLabel>FAQ</SectionLabel>
          <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
            Before you apply
          </h2>
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
              Ready? Applications take about five minutes.
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
