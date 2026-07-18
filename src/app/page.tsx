import Image from "next/image";
import Link from "next/link";
import { billet, links } from "@/lib/config";
import { getStats } from "@/lib/billet";
import { getDiscordCounts, inviteCodeFromUrl } from "@/lib/discord";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";
import { LocalTime } from "@/components/local-time";
import { VideoCard } from "@/components/video-card";
import { HeroMeta } from "@/components/hero-meta";
import { RosterSection } from "@/components/roster";
import { UnitSection } from "@/components/unit-section";
import { RolesSection } from "@/components/roles-section";
import { MediaSection } from "@/components/media-section";
import { OpsSection } from "@/components/ops-section";

export default async function Home() {
  // Invite code comes from Billet config when set, so rotating the Discord
  // invite in Billet keeps the live member counts working.
  const stats = await getStats();
  const discord = await getDiscordCounts(
    inviteCodeFromUrl(stats?.discordInviteUrl),
  );

  return (
    <>
      {/* Anniversary band — a decade deserves a little shine. */}
      <div className="border-b border-edge bg-surface/70">
        <p className="mx-auto flex max-w-6xl items-center justify-center gap-3 px-4 py-2.5 text-center font-display text-sm font-semibold uppercase tracking-[0.14em]">
          <span aria-hidden className="text-opfor">
            ★
          </span>
          <span className="anniv-text">Celebrating ten years · 2016–2026</span>
          <span aria-hidden className="text-opfor">
            ★
          </span>
        </p>
      </div>

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
        <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-20 pt-24 sm:px-6 sm:pt-28 lg:grid-cols-[1fr_minmax(0,24rem)] lg:gap-16">
          <div>
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
          <HeroMeta
            members={discord?.members ?? null}
            online={discord?.online ?? null}
          />

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
            {stats ? (
              <div>
                <dt className="micro-label">Recruiting</dt>
                <dd className="mt-1 flex items-center gap-1.5 font-mono text-sm text-ink">
                  <span
                    aria-hidden
                    className={`h-1.5 w-1.5 rounded-full ${
                      stats.recruitingOpen ? "bg-ok" : "border border-ink-faint/60"
                    }`}
                  />
                  {stats.recruitingOpen ? "OPEN" : "CLOSED"}
                </dd>
              </div>
            ) : null}
          </dl>
          </div>

          {/* The classic, front and center for the anniversary — with two
              archive stills so the column reads as a decade scrapbook. */}
          <div className="lg:self-center">
            <p className="micro-label">
              From the archives · <span className="text-opfor">the classic</span>
            </p>
            <div className="mt-3">
              <VideoCard
                id="O-5Mq7MldqI"
                title="We are the Paramarines — Deployment"
                thumbQuality="maxresdefault"
                sizes="(min-width: 1024px) 24rem, 100vw"
                priority
              />
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <Image
                src="/media/archive-inspection.jpg"
                alt="A Major inspecting a formation of Marines at a desert firebase, 2017"
                width={1366}
                height={768}
                sizes="(min-width: 1024px) 12rem, 50vw"
                className="aspect-video w-full rounded-sm border border-edge object-cover"
              />
              <Image
                src="/media/archive-rainbow.jpg"
                alt="A Huey landing on a carrier deck beneath a rainbow, 2017"
                width={1600}
                height={900}
                sizes="(min-width: 1024px) 12rem, 50vw"
                className="aspect-video w-full rounded-sm border border-edge object-cover"
              />
            </div>
          </div>
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
