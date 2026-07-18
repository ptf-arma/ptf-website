"use client";

import { useEffect, useState } from "react";
import { billet } from "@/lib/config";

/**
 * The viewer's Billet session, shared across the parent domain — the browser
 * sends the portal cookie because site and portal live on *.paramarines.net.
 * One fetch per page load (module-level promise shared by all components).
 */
export type BilletMemberStatus = "member" | "applicant" | "discharged" | "none";

export type BilletSession =
  | { signedIn: false }
  | {
      signedIn: true;
      member: {
        name: string;
        avatarUrl: string | null;
        /** True only for active personnel of this unit. */
        isMember: boolean;
        status: BilletMemberStatus;
        /** Set for members. */
        rankAbbr: string | null;
      };
    };

/** Active personnel of this unit — the Enlist CTA is pointless for them. */
export function isUnitMember(session: BilletSession | null): boolean {
  return session?.signedIn === true && session.member.isMember === true;
}

/** Mid-application: nudge them to finish rather than start over. */
export function isApplicant(session: BilletSession | null): boolean {
  return session?.signedIn === true && session.member.status === "applicant";
}

let sessionPromise: Promise<BilletSession> | null = null;

function fetchSession(): Promise<BilletSession> {
  sessionPromise ??= fetch(`${billet.base}/api/v1/session`, {
    credentials: "include",
  })
    .then((res) => (res.ok ? res.json() : { signedIn: false }))
    .catch(() => ({ signedIn: false as const }));
  return sessionPromise;
}

/** null while loading; then the session state. */
export function useBilletSession(): BilletSession | null {
  const [session, setSession] = useState<BilletSession | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchSession().then((s) => {
      if (!cancelled) setSession(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return session;
}
