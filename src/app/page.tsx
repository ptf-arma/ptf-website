import Image from "next/image";
import Link from "next/link";
import { billet, links } from "@/lib/config";
import { getDiscordCounts } from "@/lib/discord";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { LocalTime } from "@/components/local-time";
import { RosterSection } from "@/components/roster";
import { UnitSection } from "@/components/unit-section";
import { RolesSection } from "@/components/roles-section";
import { MediaSection } from "@/components/media-section";
import { OpsSection } from "@/components/ops-section";

export default async function Home() {
  const discord = await getDiscordCounts();

  return (
    <>
      {/* Hero — the primary conversion path. */}
      <section className="relative overflow-hidden">
        {/* Salvaged op screenshot, heavily darkened so the readout text owns
            the frame. Cap the requested width on small screens — this is the
            LCP image and it renders at 40% opacity anyway. */}
        <Image
          src="/media/church-holdup.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1920px"
          className="object-cover object-[50%_30%] opacity-40"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-bg via-bg/85 to-bg/40"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-bg to-transparent"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-24 sm:px-6 sm:pt-28">
          <SectionLabel>Arma 3 · Milsim · 10 Years Strong</SectionLabel>
          <h1 className="heading-display mt-5 max-w-2xl text-5xl leading-[1.05] text-ink sm:text-6xl">
            Rapid-deployment Marines.
            <br />
            <span className="text-accent">Serious, fun, and immersive.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
            The Paramarines were a specialized breed of WW2 Marines. We ask
            &ldquo;what if&rdquo; — and drop that airborne/amphibious legacy
            into a modern Arma 3 milsim. Ten years of operations, our own
            modpack, and a community that shows up week after week.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
            <ButtonLink href={billet.applyUrl} variant="primary" size="lg">
              Enlist Now
            </ButtonLink>
            <ButtonLink href={links.discord} variant="secondary" size="lg">
              Join our Discord
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-ink-muted">
            {discord ? (
              <>
                <span className="font-mono text-ink">{discord.members}</span>{" "}
                on Discord ·{" "}
                <span className="font-mono text-ink">{discord.online}</span>{" "}
                online now ·{" "}
              </>
            ) : null}
            no application needed to say hi in{" "}
            <span className="text-ink">#find-a-recruiter</span>
          </p>

          {/* How joining works — three steps, no mystery. */}
          <ol className="mt-12 grid max-w-2xl gap-4 border-t border-edge pt-6 sm:grid-cols-3">
            {[
              ["01", "Apply", "Five minutes on our personnel portal."],
              ["02", "Meet a recruiter", "Say hi in #find-a-recruiter on Discord."],
              ["03", "Train & deploy", "Recruit training, then your first op."],
            ].map(([n, title, body]) => (
              <li key={n}>
                <span className="micro-label">{n}</span>
                <p className="mt-1 font-display text-base font-semibold text-ink">
                  {title}
                </p>
                <p className="mt-0.5 text-sm text-ink-muted">{body}</p>
              </li>
            ))}
          </ol>
          <p className="mt-4 text-sm">
            <Link
              href="/join"
              className="text-ink-muted underline decoration-edge-bright underline-offset-4 hover:text-ink"
            >
              Everything you need to know before applying →
            </Link>
          </p>

          {/* Ops-cadence readout strip */}
          <dl className="mt-12 flex max-w-2xl flex-wrap gap-x-10 gap-y-4 border-t border-edge pt-6">
            <div>
              <dt className="micro-label">Field training</dt>
              <dd className="mt-1 font-mono text-sm text-ink">SAT · 8PM ET</dd>
              <dd className="font-mono text-xs text-ink-faint">
                <LocalTime weekday={6} hourEt={20} />
              </dd>
            </div>
            <div>
              <dt className="micro-label">Main operation</dt>
              <dd className="mt-1 font-mono text-sm text-ink">SUN · 8PM ET</dd>
              <dd className="font-mono text-xs text-ink-faint">
                <LocalTime weekday={0} hourEt={20} />
              </dd>
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
      <MediaSection />
      <OpsSection />
    </>
  );
}
