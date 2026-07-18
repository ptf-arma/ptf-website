import Image from "next/image";
import { billet, links } from "@/lib/config";
import { getStats } from "@/lib/billet";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { LocalTime } from "@/components/local-time";

function CadenceCard({
  label,
  day,
  time,
  weekday,
  description,
}: {
  label: string;
  day: string;
  time: string;
  weekday: number;
  description: string;
}) {
  return (
    <div className="overflow-hidden rounded-sm border border-edge bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-edge bg-raised px-4 py-2.5">
        <span className="micro-label">{label}</span>
        <span className="font-mono text-sm text-ink">
          {time}{" "}
          <LocalTime weekday={weekday} hourEt={20} className="text-xs text-ink-faint" />
        </span>
      </div>
      <div className="px-4 py-4">
        <h3 className="font-display text-base font-semibold text-ink">{day}</h3>
        <p className="mt-2 text-sm text-ink-muted">{description}</p>
      </div>
    </div>
  );
}

/**
 * "Operations" — weekly cadence readouts + the final enlist conversion band.
 * Live op stats from Billet render once the unit has conducted operations
 * (hidden while opsConducted is 0 — no leading with a zero).
 */
export async function OpsSection() {
  const stats = await getStats();
  const showOps = stats !== null && stats.opsConducted > 0;
  return (
    <section id="ops" className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionLabel>Operations</SectionLabel>
        <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
          How we operate
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <CadenceCard
            label="FTX"
            day="Saturdays"
            time="8PM ET"
            weekday={6}
            description="Field training — drills, quals, and pipeline course work that build toward the main op."
          />
          <CadenceCard
            label="Main operation"
            day="Sundays"
            time="8PM ET"
            weekday={0}
            description="The main event — full-scale scenario operations across the unit."
          />
        </div>

        {/* Live op tempo from the personnel system — appears once ops resume. */}
        {showOps ? (
          <dl className="mt-6 flex flex-wrap gap-x-10 gap-y-3 rounded-sm border border-edge bg-surface px-5 py-4">
            <div>
              <dt className="micro-label">Operations conducted</dt>
              <dd className="mt-1 font-mono text-lg text-ink">{stats.opsConducted}</dd>
            </div>
            {stats.lastOpAt ? (
              <div>
                <dt className="micro-label">Last operation</dt>
                <dd className="mt-1 font-mono text-lg text-ink">
                  {new Date(stats.lastOpAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </dd>
              </div>
            ) : null}
          </dl>
        ) : null}

        {/* border-edge-bright is deliberate: this closing band is the one
            emphasized card on the page. */}
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
