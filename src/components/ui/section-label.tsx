import type { ReactNode } from "react";

/** Billet-style uppercase mono eyebrow label with an amber tick. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="h-3 w-[3px] bg-ok" />
      <span className="micro-label">{children}</span>
    </div>
  );
}
