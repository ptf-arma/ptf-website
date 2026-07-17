import Image from "next/image";
import { billet, links } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { RosterSection } from "@/components/roster";
import { UnitSection } from "@/components/unit-section";
import { RolesSection } from "@/components/roles-section";
import { OpsSection } from "@/components/ops-section";

export default function Home() {
  return (
    <>
      {/* Hero — the primary conversion path. */}
      <section className="relative overflow-hidden">
        {/* Salvaged op screenshot, heavily darkened so the readout text owns the frame. */}
        <Image
          src="/media/op-scenic.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[75%_center] opacity-35"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/40"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent"
        />
        <div aria-hidden className="bg-grid absolute inset-0" />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
          <SectionLabel>Arma 3 · Milsim · Est. 2016</SectionLabel>
          <h1 className="heading-display mt-5 max-w-2xl text-4xl leading-[1.08] text-ink sm:text-5xl">
            Rapid-deployment Marines.
            <br />
            <span className="text-accent">Serious, immersive, relentless.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-muted sm:text-lg">
            The Paramarines were a specialized breed of WW2 Marines. We ask
            &ldquo;what if&rdquo; — and drop that airborne/amphibious legacy into
            a modern Arma 3 milsim with weekly operations, structured training,
            and a community that shows up.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href={billet.applyUrl} variant="primary" size="lg">
              Enlist Now
            </ButtonLink>
            <ButtonLink href={links.discord} variant="secondary" size="lg">
              Join our Discord
            </ButtonLink>
          </div>

          {/* Ops-cadence readout strip */}
          <dl className="mt-14 flex max-w-xl flex-wrap gap-x-10 gap-y-4 border-t border-edge pt-6">
            <div>
              <dt className="micro-label">Field training</dt>
              <dd className="mt-1 font-mono text-sm text-ink">SAT · 8PM ET</dd>
            </div>
            <div>
              <dt className="micro-label">Main operation</dt>
              <dd className="mt-1 font-mono text-sm text-ink">SUN · 8PM ET</dd>
            </div>
            <div>
              <dt className="micro-label">Voice</dt>
              <dd className="mt-1 font-mono text-sm text-ink">DISCORD + TS3</dd>
            </div>
          </dl>
        </div>
      </section>

      <UnitSection />
      <RolesSection />
      <RosterSection />
      <OpsSection />
    </>
  );
}
