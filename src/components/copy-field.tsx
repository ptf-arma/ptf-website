"use client";

import { useState } from "react";

/**
 * A block of text a recruiter is meant to take somewhere else, with a button
 * that puts it on the clipboard.
 *
 * The text stays selectable either way — clipboard access is refused often
 * enough (permissions, insecure origins, older mobile browsers) that a copy
 * button which is the only route to the text is a trap.
 */
export function CopyField({ label, value }: { label: string; value: string }) {
  const [state, setState] = useState<"idle" | "ok" | "failed">("idle");

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setState("ok");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 2500);
  }

  return (
    <div className="rounded-sm border border-edge bg-surface">
      <div className="flex items-center justify-between gap-3 border-b border-edge px-4 py-2">
        <span className="micro-label text-ink-faint">{label}</span>
        <button
          type="button"
          onClick={copy}
          className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-muted transition-colors hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          {state === "ok" ? "Copied" : state === "failed" ? "Select it instead" : "Copy"}
        </button>
      </div>
      <p className="px-4 py-3 font-mono text-sm leading-relaxed text-ink-muted select-all">
        {value}
      </p>
    </div>
  );
}
