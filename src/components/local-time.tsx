"use client";

import { useSyncExternalStore } from "react";

/**
 * Renders the viewer's local equivalent of a weekly Eastern-time slot, e.g.
 * "≈ Sun 01:00 your time" for SAT 8PM ET viewed from CET. Renders nothing on
 * the server and for viewers already on US Eastern time.
 */

const cache = new Map<string, string | null>();

function computeLabel(weekday: number, hourEt: number): string | null {
  const key = `${weekday}-${hourEt}`;
  if (cache.has(key)) return cache.get(key)!;

  let label: string | null = null;
  try {
    const viewerZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (viewerZone !== "America/New_York") {
      // Find a UTC instant that renders as the requested ET weekday+hour
      // (DST-safe), then format that instant in the viewer's zone.
      const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const now = Date.now();
      outer: for (let d = 0; d < 8; d++) {
        for (let h = 0; h < 24; h++) {
          const probe = new Date(now + d * 86400000);
          probe.setUTCHours(h, 0, 0, 0);
          const parts = new Intl.DateTimeFormat("en-US", {
            timeZone: "America/New_York",
            weekday: "short",
            hour: "numeric",
            hour12: false,
          }).formatToParts(probe);
          const wd = parts.find((p) => p.type === "weekday")?.value;
          const hr = Number(parts.find((p) => p.type === "hour")?.value) % 24;
          if (wd === weekdays[weekday] && hr === hourEt) {
            label = new Intl.DateTimeFormat(undefined, {
              weekday: "short",
              hour: "numeric",
              minute: "2-digit",
            }).format(probe);
            break outer;
          }
        }
      }
    }
  } catch {
    label = null;
  }
  cache.set(key, label);
  return label;
}

const emptySubscribe = () => () => {};

export function LocalTime({
  weekday, // 0=Sun ... 6=Sat (in ET)
  hourEt,
  className = "",
}: {
  weekday: number;
  hourEt: number;
  className?: string;
}) {
  const label = useSyncExternalStore(
    emptySubscribe,
    () => computeLabel(weekday, hourEt),
    () => null, // server snapshot: render nothing, avoid hydration mismatch
  );

  if (!label) return null;
  return <span className={className}>≈ {label} your time</span>;
}
