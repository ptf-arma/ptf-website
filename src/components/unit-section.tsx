import Image from "next/image";
import { links } from "@/lib/config";
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
              Ten years on, PTF stands among the most historic and
              well-known units in Arma 3. Very few units last a decade —
              fewer still do it well. That longevity comes from structured
              training, real progression tracked in our personnel system,
              and squads that actually show up, week after week.
            </p>
            <p>
              It also comes from craft and camaraderie. We field a
              sophisticated{" "}
              <a
                href={links.modpack}
                className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
              >
                in-house modpack
              </a>{" "}
              tuned for our campaigns, and when the op is over the unit
              doesn&apos;t log off — we game together across other titles in
              the downtime.
            </p>

            {/* Concrete differentiators — verifiable, not boilerplate. */}
            <ul className="space-y-3 border-t border-edge pt-4">
              {[
                [
                  "Our own modpack",
                  "“Paramarine Milsim Core” on the Steam Workshop — armor, aviation, boats, equipment, and custom sound, one-click subscribe.",
                ],
                [
                  "An organic air wing",
                  "MAG-36 flies our rotary and fixed-wing support — CAS and air assaults flown by unit pilots, not AI.",
                ],
                [
                  "Real progression",
                  "Ranks, a 17-course school pipeline, and awards — all tracked in our personnel system, not a spreadsheet.",
                ],
                [
                  "A film crew",
                  "Our operations become cinematic films — see the media section below.",
                ],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3">
                  <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ok" />
                  <p className="text-sm">
                    <span className="font-display font-semibold text-ink">{title}.</span>{" "}
                    <span className="text-ink-muted">{body}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <div className="h-fit overflow-hidden rounded-sm border border-edge bg-surface">
              <div className="border-b border-edge bg-raised px-4 py-2.5">
                <span className="micro-label">Unit facts</span>
              </div>
              <dl className="divide-y divide-edge">
                <Readout label="Founded" value="2016" />
                <Readout label="Celebrating" value="10 YEARS" />
                <Readout label="Weekly ops" value="SAT + SUN · 8PM ET" />
                <Readout label="Off-duty" value="GAME NIGHTS" />
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
