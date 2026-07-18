import Image from "next/image";
import { billet, links } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

function CadenceCard({
  label,
  day,
  time,
  description,
}: {
  label: string;
  day: string;
  time: string;
  description: string;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-edge bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-edge bg-raised px-5 py-3">
        <span className="micro-label">{label}</span>
        <span className="font-mono text-sm text-ink">{time}</span>
      </div>
      <div className="px-5 py-4">
        <p className="font-display text-lg font-semibold text-ink">{day}</p>
        <p className="mt-2 text-sm text-ink-muted">{description}</p>
      </div>
    </div>
  );
}

/**
 * "Operations" — weekly cadence readouts + the final enlist conversion band.
 */
export function OpsSection() {
  return (
    <section id="ops" className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionLabel>Operations</SectionLabel>
        <h2 className="heading-display mt-3 text-2xl text-ink sm:text-3xl">
          How we operate
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <CadenceCard
            label="FTX"
            day="Saturdays"
            time="8PM ET"
            description="Field training — drills, quals, and pipeline course work that build toward the main op."
          />
          <CadenceCard
            label="Main operation"
            day="Sundays"
            time="8PM ET"
            description="The main event — full-scale scenario operations across the unit."
          />
        </div>

        <div className="relative mt-14 overflow-hidden rounded-sm border border-edge-bright bg-surface px-6 py-12 text-center sm:px-12">
          <Image
            src="/media/out-of-fallujah.jpg"
            alt=""
            fill
            sizes="(min-width: 72rem) 72rem, 100vw"
            className="object-cover opacity-25"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/30"
          />
          <div className="relative">
          <h3 className="heading-display text-2xl text-ink sm:text-3xl">
            Ready to ship out?
          </h3>
          <p className="mx-auto mt-4 max-w-lg text-ink-muted">
            Submit your application, then say hello in{" "}
            <span className="text-ink">#find-a-recruiter</span> on Discord —
            we&apos;ll have you ready for your first op fast.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href={billet.applyUrl} variant="primary" size="lg">
              Enlist Now
            </ButtonLink>
            <ButtonLink href={links.discord} variant="secondary" size="lg">
              Join our Discord
            </ButtonLink>
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
