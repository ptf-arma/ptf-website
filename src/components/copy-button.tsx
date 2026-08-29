"use client";

import { useState } from "react";

/**
 * Copies `value` to the clipboard and says so.
 *
 * Clipboard access is refused often enough — insecure origins, permissions,
 * older mobile browsers — that the failure needs a visible answer rather than
 * a button that silently does nothing. On failure it shows the value's
 * `title`, so the address is still reachable by hand.
 */
export function CopyButton({
  value,
  label = "Copy link",
  variant = "secondary",
}: {
  value: string;
  label?: string;
  variant?: "primary" | "secondary";
}) {
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

  const base =
    "inline-flex items-center justify-center gap-2 rounded-sm px-4 py-2 font-display text-sm font-semibold uppercase tracking-[0.08em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
  const skin =
    variant === "primary"
      ? "bg-accent text-white hover:bg-accent/90"
      : "border border-edge-bright text-ink hover:border-ink-muted";

  return (
    <button type="button" onClick={copy} title={value} className={`${base} ${skin}`}>
      {state === "ok" ? "Copied" : state === "failed" ? "Copy failed" : label}
    </button>
  );
}
