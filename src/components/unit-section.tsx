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
              The Paramarines were a real WW2 outfit: Marines trained to jump
              into the South Pacific, disbanded in 1944 before they ever made a
              combat jump. We took the idea and gave it a modern setting,
              flying under a fictional Marine Aircraft Group 36.
            </p>
            <p>
              We started in 2016 and we&apos;re still here, which is rare in
              this hobby. Units usually fold when the founders burn out or the
              schedule slips. Ours held because the structure is real: you get
              trained, you get promoted, and there are enough people who show
              up that the op happens whether or not any one person makes it.
            </p>
            <p>
              Between ops it&apos;s a lot less formal. We run a{" "}
              <a
                href={links.modpack}
                className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
              >
                custom modpack
              </a>
              , argue about loadouts, and play whatever else is on sale that
              week.
            </p>

            <ul className="space-y-3 border-t border-edge pt-4">
              {[
                [
                  "Our own modpack",
                  "“Paramarine Milsim Core” on the Workshop. Armor, aircraft, boats, gear, sound. One subscribe and you're set.",
                ],
                [
                  "An organic air wing",
                  "MAG-36 pilots fly the transport and the CAS. Those are members in the cockpit.",
                ],
                [
                  "Records that stick",
                  "Rank, courses, and awards live in our personnel system. Your file follows you.",
                ],
                [
                  "A film crew",
                  "Ops get cut into films. A few are below.",
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
                <Readout label="Main op" value="SUN · 8PM ET" />
                <Readout label="Also running" value="TUE · THU · SAT" />
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
                Formation, 2021
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
