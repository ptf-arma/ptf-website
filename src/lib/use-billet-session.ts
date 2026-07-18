"use client";

import { useEffect, useState } from "react";
import { billet } from "@/lib/config";

/**
 * The viewer's Billet session, shared across the parent domain — the browser
 * sends the portal cookie because site and portal live on *.paramarines.net.
 * One fetch per page load (module-level promise shared by all components).
 */
export type BilletSession =
  | { signedIn: false }
  | { signedIn: true; member: { name: string; avatarUrl: string | null } };

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
