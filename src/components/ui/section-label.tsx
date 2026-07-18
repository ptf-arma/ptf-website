import type { ReactNode } from "react";

/** Uppercase mono eyebrow label with a field-blue tick. */
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span aria-hidden className="h-3 w-[3px] bg-ok" />
      <span className="micro-label">{children}</span>
    </div>
  );
}
