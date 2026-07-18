/* eslint-disable @next/next/no-img-element */
import { billet } from "@/lib/config";
import {
  countOpenBillets,
  getRoster,
  type BilletElement,
  type BilletMember,
  type BilletSlot,
} from "@/lib/billet";
import { SectionLabel } from "@/components/ui/section-label";
import { ButtonLink } from "@/components/ui/button";

/** One slot row inside an expanded element. */
function SlotRow({ slot }: { slot: BilletSlot }) {
  if (slot.closed) {
    return (
      <li className="flex items-center justify-between gap-3 px-4 py-2 opacity-40">
        <span className="text-sm text-ink-faint">{slot.title}</span>
        <span className="micro-label">Closed</span>
      </li>
    );
  }

  const open = slot.vacant;
  return (
    <li className="flex items-center justify-between gap-3 px-4 py-2">
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${
            open ? "border border-ink-faint/60" : "bg-ok"
          }`}
        />
        <span className={`truncate text-sm ${open ? "text-ink-faint" : "text-ink"}`}>
          {slot.title}
        </span>
        {slot.callsign ? (
          <span className="micro-label hidden sm:inline">{slot.callsign}</span>
        ) : null}
      </span>

      {slot.member ? (
        <span className="flex shrink-0 items-center gap-2">
          {slot.member.rankInsigniaUrl ? (
            <img
              src={slot.member.rankInsigniaUrl}
              alt=""
              className="h-4 w-4 object-contain"
              loading="lazy"
            />
          ) : slot.member.rankAbbr ? (
            <span className="micro-label text-ink-faint">{slot.member.rankAbbr}</span>
          ) : null}
          <span className="font-mono text-sm text-ink">{slot.member.name}</span>
        </span>
      ) : open ? (
        <span className="micro-label shrink-0">Open</span>
      ) : (
        <span className="micro-label shrink-0">Filled</span>
      )}
    </li>
  );
}

/** Thin manning bar: filled portion in field blue. */
function FillBar({ filled, total }: { filled: number; total: number }) {
  const pct = total > 0 ? Math.round((filled / total) * 100) : 0;
  return (
    <span className="hidden h-1 w-16 overflow-hidden rounded-full bg-edge sm:block">
      <span className="block h-full bg-ok" style={{ width: `${pct}%` }} />
    </span>
  );
}

/**
 * One ORBAT element as a collapsible block (native <details> — no JS).
 * Collapsed rows are uniform, so the section reads as a tidy manning table
 * instead of a wall of mostly-empty slot lists.
 */
function ElementBlock({ element, depth = 0 }: { element: BilletElement; depth?: number }) {
  const hasContent = element.billets.length > 0 || element.children.length > 0;

  const summaryInner = (
    <>
      <span className="flex min-w-0 items-center gap-2.5">
        <span
          aria-hidden
          className="text-[10px] text-ink-faint transition-transform group-open:rotate-90"
        >
          ▶
        </span>
        <span
          className={`truncate font-display font-semibold text-ink ${
            depth === 0 ? "text-base" : "text-sm"
          }`}
        >
          {element.name}
        </span>
        {element.callsign ? (
          <span className="micro-label hidden sm:inline">{element.callsign}</span>
        ) : null}
      </span>
      <span className="flex shrink-0 items-center gap-3">
        <FillBar filled={element.filled} total={element.total} />
        <span className="font-mono text-xs text-ink-faint">
          {element.filled}/{element.total}
        </span>
      </span>
    </>
  );

  if (!hasContent) {
    return (
      <div className="flex items-center justify-between gap-3 px-4 py-2.5">
        {summaryInner}
      </div>
    );
  }

  return (
    <details className={`group ${depth === 0 ? "" : "border-t border-edge"}`}>
      <summary className="flex cursor-pointer select-none list-none items-center justify-between gap-3 px-4 py-2.5 transition-colors hover:bg-raised/70 [&::-webkit-details-marker]:hidden">
        {summaryInner}
      </summary>
      <div className="border-t border-edge">
        {element.billets.length > 0 ? (
          <ul className="divide-y divide-edge">
            {element.billets.map((slot, i) => (
              <SlotRow key={`${slot.title}-${i}`} slot={slot} />
            ))}
          </ul>
        ) : null}
        {element.children.length > 0 ? (
          <div className="ml-4 border-l border-edge">
            {element.children.map((child) => (
              <ElementBlock key={child.id} element={child} depth={depth + 1} />
            ))}
          </div>
        ) : null}
      </div>
    </details>
  );
}

/** Collect unique members across the tree (first billet title wins). */
function collectMembers(
  elements: BilletElement[],
  seen = new Map<string, { member: BilletMember; title: string }>(),
) {
  for (const el of elements) {
    for (const b of el.billets) {
      if (b.member && !seen.has(b.member.name)) {
        seen.set(b.member.name, { member: b.member, title: b.title });
      }
    }
    collectMembers(el.children, seen);
  }
  return seen;
}

/**
 * The live ORBAT section. Server component: fetches from Billet with ISR.
 * Degrades to a static portal link when the API is unavailable or private.
 */
export async function RosterSection() {
  const roster = await getRoster();

  if (!roster) {
    return (
      <section id="roster" className="border-t border-edge">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <SectionLabel>Live ORBAT</SectionLabel>
          <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
            The roster
          </h2>
          <p className="mt-4 max-w-2xl text-ink-muted">
            Our full order of battle lives on the personnel portal.
          </p>
          <div className="mt-6">
            <ButtonLink href={billet.base} variant="secondary" size="md">
              View the roster on Billet
            </ButtonLink>
          </div>
        </div>
      </section>
    );
  }

  // The unit keeps a separate Staff Roster (S-sections: S1 Personnel, S3
  // Operations, ...) alongside the Combat Roster. The public ORBAT shows
  // combat only — filter any top-level "S<number>-..." element out.
  const combatElements = roster.elements.filter(
    (el) => !/^S\d+\b/.test(el.name.trim()),
  );
  const openBillets = countOpenBillets(combatElements);
  const members = [...collectMembers(combatElements).values()];

  return (
    <section id="roster" className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel>Live ORBAT</SectionLabel>
            <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
              The roster
            </h2>
            <p className="mt-4 max-w-2xl text-ink-muted">
              Our live order of battle, straight from the personnel system —
              expand an element to see its billets.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {roster.unit.crestUrl ? (
              <img
                src={roster.unit.crestUrl}
                alt={`${roster.unit.name} crest`}
                className="h-14 w-14 object-contain"
              />
            ) : null}
            <dl className="flex gap-6">
              <div>
                <dt className="micro-label">Active</dt>
                <dd className="font-mono text-xl text-ink">{roster.unit.strength}</dd>
              </div>
              <div>
                <dt className="micro-label">Open billets</dt>
                <dd className="font-mono text-xl text-ink">{openBillets}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* The people, up front — the structure below is collapsed by default. */}
        {members.length > 0 ? (
          <div className="mt-10">
            <p className="micro-label">Leadership</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {members.map(({ member, title }) => (
                <li
                  key={member.name}
                  className="flex items-center gap-2 rounded-sm border border-edge bg-surface px-3 py-1.5"
                >
                  {member.rankInsigniaUrl ? (
                    <img
                      src={member.rankInsigniaUrl}
                      alt=""
                      className="h-4 w-4 object-contain"
                      loading="lazy"
                    />
                  ) : member.rankAbbr ? (
                    <span className="micro-label">{member.rankAbbr}</span>
                  ) : null}
                  <span className="font-mono text-sm text-ink">{member.name}</span>
                  <span className="hidden text-xs text-ink-faint sm:inline">
                    {title}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {/* Uniform collapsed rows → a manning table, not a wall of slots. */}
        <div className="mt-8 grid items-start gap-4 md:grid-cols-2">
          {combatElements.map((el) => (
            <div
              key={el.id}
              className="overflow-hidden rounded-sm border border-edge bg-surface"
            >
              <ElementBlock element={el} />
            </div>
          ))}
        </div>

        {openBillets > 0 ? (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
            <p className="text-sm text-ink-muted">
              <span className="font-mono text-ink">{openBillets}</span> open
              billets across the task force — pick where you fit.
            </p>
            <ButtonLink href={billet.applyUrl} variant="primary" size="md">
              Enlist Now
            </ButtonLink>
          </div>
        ) : null}
        <p className="mt-6 font-mono text-xs text-ink-faint">
          Synced from Billet · updates every 5 minutes ·{" "}
          <a href={billet.base} className="hover:text-ink">
            full portal →
          </a>
        </p>
      </div>
    </section>
  );
}
