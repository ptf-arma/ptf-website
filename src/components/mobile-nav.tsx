"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Hamburger nav for < md viewports. Renders a full-width panel under the
 * header; closes on any link tap.
 */
export function MobileNav({
  items,
}: {
  items: { label: string; href: string }[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
        className="grid h-10 w-10 place-items-center border border-edge-bright text-ink"
      >
        <span aria-hidden className="font-mono text-lg leading-none">
          {open ? "✕" : "≡"}
        </span>
      </button>

      {open ? (
        <nav className="absolute inset-x-0 top-full border-b border-edge bg-bg/95 backdrop-blur">
          <ul className="mx-auto max-w-6xl px-4 py-2 sm:px-6">
            {items.map((item) => (
              <li key={item.href} className="border-b border-edge last:border-b-0">
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 font-display text-base font-semibold uppercase tracking-[0.08em] text-ink-muted hover:text-ink"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
