import Image from "next/image";
import { SectionLabel } from "@/components/ui/section-label";

/** One mono key-fact readout inside the unit card. */
function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-3">
      <dt className="micro-label">{label}</dt>
      <dd className="font-mono text-sm text-ink">{value}</dd>
    </div>
  );
}

/**
 * "The Unit" — heritage + what membership feels like. Static copy section.
 */
export function UnitSection() {
  return (
    <section id="unit" className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionLabel>The Unit</SectionLabel>
        <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
          Who we are
        </h2>

        <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr] md:gap-12">
          <div className="max-w-xl space-y-4 text-ink-muted">
            <p>
              The Paramarines were a specialized breed of Marines who fought
              in WW2, phased out before the war&apos;s end. We asked
              &ldquo;what if&rdquo; and carried that amphibious/airborne
              legacy into a fictional modern setting, backed by a
              fictionalized Marine Aircraft Group 36.
            </p>
            <p>
              We are the Paramarines: an Arma 3 milsim unit built around
              rapid-deployment Marines. That means structured training, real
              progression — ranks, courses, and awards tracked in our
              personnel system — and squads that actually show up, week
              after week.
            </p>
            <p>
              Founded in 2016, the unit ran strong through 2019, went quiet,
              and relaunched in 2025. What hasn&apos;t changed is the
              balance we look for: serious enough to run a real op, relaxed
              enough to enjoy it.
            </p>
          </div>

          <div className="space-y-4">
            <div className="h-fit overflow-hidden rounded-sm border border-edge bg-surface">
              <div className="border-b border-edge bg-raised px-4 py-2.5">
                <span className="micro-label">Unit facts</span>
              </div>
              <dl className="divide-y divide-edge">
                <Readout label="Founded" value="2016" />
                <Readout label="Relaunched" value="2025" />
                <Readout label="Weekly ops" value="SAT + SUN · 8PM ET" />
              </dl>
            </div>
            <figure className="overflow-hidden rounded-sm border border-edge bg-surface">
              <Image
                src="/media/ceremony.jpg"
                alt="Unit formation at a Paramarine Task Force ceremony in Arma 3"
                width={1920}
                height={1080}
                sizes="(min-width: 768px) 28rem, 100vw"
                className="w-full object-cover"
              />
              <figcaption className="micro-label border-t border-edge px-4 py-2.5">
                We are the Paramarines
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
