"use client";

/* eslint-disable @next/next/no-img-element */
import { billet } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import {
  isApplicant,
  isUnitMember,
  useBilletSession,
} from "@/lib/use-billet-session";

/**
 * Header account/CTA cluster, driven by the Billet session:
 * - Signed out (or unknown): Log In + the Enlist CTA.
 * - Unit member: their chip only — Enlist would be meaningless.
 * - Applicant: chip + "Finish applying" instead of Enlist.
 * - Signed in but unaffiliated (discharged/none): chip + Enlist.
 */
export function HeaderActions() {
  const session = useBilletSession();

  if (session?.signedIn) {
    const member = isUnitMember(session);
    const applicant = isApplicant(session);
    return (
      <>
        {member ? null : (
          <ButtonLink href={billet.applyUrl} variant="primary" size="md">
            {applicant ? "Finish applying" : "Enlist"}
          </ButtonLink>
        )}
        <a
          href={billet.base}
          title="Open your Billet portal"
          className="inline-flex items-center gap-2.5 rounded-sm border border-edge-bright py-1.5 pl-2.5 pr-3 transition-colors hover:border-ink-muted"
        >
          {session.member.avatarUrl ? (
            <img
              src={session.member.avatarUrl}
              alt=""
              className="h-6 w-6 rounded-full object-cover"
            />
          ) : (
            <span
              aria-hidden
              className="grid h-6 w-6 place-items-center rounded-full bg-ok font-mono text-xs text-white"
            >
              {session.member.name.charAt(0)}
            </span>
          )}
          <span className="hidden max-w-32 truncate font-display text-sm font-semibold text-ink sm:inline">
            {session.member.rankAbbr ? `${session.member.rankAbbr} ` : ""}
            {session.member.name}
          </span>
          <span className="micro-label border-l border-edge pl-2.5">
            Billet →
          </span>
        </a>
      </>
    );
  }

  return (
    <>
      <ButtonLink
        href={billet.loginUrl}
        variant="ghost"
        size="md"
        className="hidden sm:inline-flex"
      >
        Log In
      </ButtonLink>
      <ButtonLink href={billet.applyUrl} variant="primary" size="md">
        Enlist
      </ButtonLink>
    </>
  );
}
