"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { track } from "@vercel/analytics";

/**
 * Records which page a visitor was reading when they left to enlist, open the
 * personnel portal, or join Discord. Pageviews alone can't answer whether the
 * guide or the roles page actually produces recruits.
 *
 * This listens on the document rather than wiring a handler into each button.
 * The enlist and Discord CTAs appear in roughly a dozen places across the
 * header, hero, sections, footer, and 404, and a delegated listener can't miss
 * one — or fall out of date when a new CTA is added.
 *
 * `track` is a no-op when custom events aren't enabled for the project, so this
 * is safe to ship regardless of plan.
 */
export function OutboundTracking() {
  const pathname = usePathname();

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href") ?? "";
      // Order matters: /apply is also on the billet host, and is the one that
      // actually represents an application starting.
      const name = href.includes("/apply")
        ? "enlist_click"
        : href.includes("discord.")
          ? "discord_click"
          : href.includes("billet.")
            ? "portal_click"
            : null;

      if (name) track(name, { from: pathname });
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, [pathname]);

  return null;
}
