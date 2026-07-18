/* eslint-disable @next/next/no-img-element */
import { billet } from "@/lib/config";
import {
  countOpenBillets,
  getRoster,
  type BilletElement,
  type BilletSlot,
} from "@/lib/billet";
import { SectionLabel } from "@/components/ui/section-label";
import { ButtonLink } from "@/components/ui/button";

/** One slot row inside an element card. */
function SlotRow({ slot }: { slot: BilletSlot }) {
  if (slot.closed) {
    return (
      <li className="flex items-center justify-between gap-3 px-4 py-2.5 opacity-40">
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
        <span
          className={`truncate text-sm ${open ? "text-ink-faint" : "text-ink"}`}
        >
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

/** A card for one ORBAT element (and its children, nested). */
function ElementCard({ element, depth = 0 }: { element: BilletElement; depth?: number }) {
  return (
    <div className={depth > 0 ? "mt-3 ml-4 border-l border-edge pl-4" : ""}>
      <div className="break-inside-avoid overflow-hidden rounded-sm border border-edge bg-surface">
        <div className="flex items-center justify-between gap-3 border-b border-edge bg-raised px-4 py-2.5">
          <div className="flex min-w-0 items-center gap-2.5">
            <h3 className="truncate font-display text-base font-semibold tracking-wide text-ink">
              {element.name}
            </h3>
            {element.callsign ? (
              <span className="micro-label">{element.callsign}</span>
            ) : null}
          </div>
          <span className="shrink-0 font-mono text-xs text-ink-faint">
            {element.filled}/{element.total}
          </span>
        </div>
        {element.billets.length > 0 ? (
          <ul className="divide-y divide-edge/60">
            {element.billets.map((slot, i) => (
              <SlotRow key={`${slot.title}-${i}`} slot={slot} />
            ))}
          </ul>
        ) : null}
      </div>
      {element.children.map((child) => (
        <ElementCard key={child.id} element={child} depth={depth + 1} />
      ))}
    </div>
  );
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
          <h2 className="heading-display mt-3 text-2xl text-ink sm:text-3xl">
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

  const openBillets = countOpenBillets(roster.elements);

  return (
    <section id="roster" className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel>Live ORBAT</SectionLabel>
            <h2 className="heading-display mt-3 text-2xl text-ink sm:text-3xl">
              The roster
            </h2>
            <p className="mt-4 max-w-2xl text-ink-muted">
              Our live order of battle, straight from the personnel system.
              {openBillets > 0 ? (
                <>
                  {" "}
                  <span className="text-ink">
                    {openBillets} billets are open right now
                  </span>{" "}
                  — one of them could be yours.
                </>
              ) : null}
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
                <dd className="font-mono text-2xl text-ink">{roster.unit.strength}</dd>
              </div>
              <div>
                <dt className="micro-label">Open billets</dt>
                <dd className="font-mono text-2xl text-ink">{openBillets}</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* CSS columns instead of grid: balances wildly different tree heights. */}
        <div className="mt-10 md:columns-2 md:gap-4">
          {roster.elements.map((el) => (
            <div key={el.id} className="mb-4">
              <ElementCard element={el} />
            </div>
          ))}
        </div>

        {/* The one conversion point for the whole roster — a single strip
            instead of a hundred red links. */}
        {openBillets > 0 ? (
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-surface px-5 py-4">
            <p className="text-sm text-ink-muted">
              <span className="font-mono text-ink">{openBillets}</span> open
              billets across the task force — pick where you fit.
            </p>
            <ButtonLink href={billet.applyUrl} variant="primary" size="md">
              Enlist Now
            </ButtonLink>
          </div>
        ) : null}
        <p className="micro-label mt-6">
          Synced from Billet · updates every 5 minutes ·{" "}
          <a href={billet.base} className="hover:text-ink">
            full portal →
          </a>
        </p>
      </div>
    </section>
  );
}
