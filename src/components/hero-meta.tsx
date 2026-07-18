"use client";

import { billet } from "@/lib/config";
import {
  isApplicant,
  isUnitMember,
  useBilletSession,
} from "@/lib/use-billet-session";

/**
 * The line under the hero CTAs, tailored to who's reading:
 * - Prospect: Discord social proof + the no-pressure recruiter note.
 * - Member: greeted by rank and name, portal one click away.
 * - Applicant: nudged to finish what they started.
 */
export function HeroMeta({
  members,
  online,
}: {
  members: number | null;
  online: number | null;
}) {
  const session = useBilletSession();

  if (session?.signedIn && isUnitMember(session)) {
    return (
      <p className="mt-4 text-sm text-ink-muted">
        Welcome back,{" "}
        <span className="font-mono text-ink">
          {session.member.rankAbbr ? `${session.member.rankAbbr} ` : ""}
          {session.member.name}
        </span>{" "}
        —{" "}
        <a
          href={billet.base}
          className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
        >
          your portal
        </a>{" "}
        is one click away
        {online ? (
          <>
            {" "}
            · <span className="font-mono text-ink">{online}</span> on Discord
            right now
          </>
        ) : null}
      </p>
    );
  }

  if (isApplicant(session)) {
    return (
      <p className="mt-4 text-sm text-ink-muted">
        Your application is in progress —{" "}
        <a
          href={billet.applyUrl}
          className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
        >
          pick up where you left off
        </a>
        , then say hi in{" "}
        <span className="text-ink">#find-a-recruiter</span>
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
