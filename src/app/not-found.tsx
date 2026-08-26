import { billet } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

export default function NotFound() {
  return (
    <section className="flex flex-1 items-center">
      <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
        <SectionLabel>404 · Grid reference not found</SectionLabel>
        <h1 className="heading-display mt-4 max-w-2xl text-4xl text-ink sm:text-5xl">
          You&apos;ve wandered off the map
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted">
          This position doesn&apos;t exist, or it&apos;s been overrun. Fall back
          to the rally point.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <ButtonLink href="/" variant="secondary" size="lg">
            Return to base
          </ButtonLink>
          <ButtonLink href={billet.applyUrl} variant="primary" size="lg">
            Enlist Now
          </ButtonLink>
        </div>
        {/*
         * Most 404s here are old forum links that predate the 2026-08-25
         * cutover and don't match a redirect rule. Without this they dead-end.
         */}
        <p className="mt-8 max-w-xl text-sm text-ink-muted">
          Following a link to the old forum? It moved. The archive is at{" "}
          <a
            href="https://legacy.paramarines.net"
            className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
          >
            legacy.paramarines.net
          </a>
          .
        </p>
      </div>
    </section>
  );
}
