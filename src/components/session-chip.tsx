"use client";

/* eslint-disable @next/next/no-img-element */
import { billet } from "@/lib/config";
import { useBilletSession } from "@/lib/use-billet-session";

/**
 * Header account state. Logged out (or unknown): the familiar Log In button.
 * Logged in: the member's avatar + name, linking straight into the portal —
 * the account visibly carries over from Billet.
 */
export function SessionChip({ className = "" }: { className?: string }) {
  const session = useBilletSession();

  if (session?.signedIn) {
    return (
      <a
        href={billet.base}
        className={`inline-flex items-center gap-2 rounded-sm border border-edge-bright px-3 py-2 font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink transition-colors hover:border-ink-muted ${className}`}
      >
        {session.member.avatarUrl ? (
          <img
            src={session.member.avatarUrl}
            alt=""
            className="h-5 w-5 rounded-full object-cover"
          />
        ) : (
          <span
            aria-hidden
            className="grid h-5 w-5 place-items-center rounded-full bg-ok font-mono text-[10px] text-white"
          >
            {session.member.name.charAt(0)}
          </span>
        )}
        <span className="max-w-32 truncate">{session.member.name}</span>
        <span aria-hidden className="text-ink-faint">
          →
        </span>
      </a>
    );
  }

  return (
    <a
      href={billet.loginUrl}
      className={`inline-flex items-center justify-center rounded-sm px-4 py-2 font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink-muted transition-colors hover:text-ink ${className}`}
    >
      Log In
    </a>
  );
}
