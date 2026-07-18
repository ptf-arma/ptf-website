"use client";

import { billet } from "@/lib/config";
import { useBilletSession } from "@/lib/use-billet-session";

/**
 * The line under the hero CTAs. Prospects see Discord social proof and the
 * no-pressure recruiter note; a signed-in member gets greeted by name — the
 * account visibly carries over from the portal.
 */
export function HeroMeta({
  members,
  online,
}: {
  members: number | null;
  online: number | null;
}) {
  const session = useBilletSession();

  if (session?.signedIn) {
    return (
      <p className="mt-4 text-sm text-ink-muted">
        Welcome back,{" "}
        <span className="font-mono text-ink">{session.member.name}</span> —{" "}
        <a href={billet.base} className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink">
          your portal
        </a>{" "}
        is one click away
        {online ? (
          <>
            {" "}
            · <span className="font-mono text-ink">{online}</span> online now
          </>
        ) : null}
      </p>
    );
  }

  return (
    <p className="mt-4 text-sm text-ink-muted">
      {members ? (
        <>
          <span className="font-mono text-ink">{members}</span> on Discord ·{" "}
          <span className="font-mono text-ink">{online}</span> online now ·{" "}
        </>
      ) : null}
      no application needed to say hi in{" "}
      <span className="text-ink">#find-a-recruiter</span>
    </p>
  );
}
