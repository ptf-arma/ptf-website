/* eslint-disable @next/next/no-img-element */
import { billet } from "@/lib/config";
import {
  buildReportingTree,
  countOpenBillets,
  getRoster,
  type BilletElement,
  type BilletMember,
} from "@/lib/billet";
import { SectionLabel } from "@/components/ui/section-label";
import { ButtonLink } from "@/components/ui/button";

/** Senior filled billet in an element (billets are listed leader-first). */
function leaderOf(element: BilletElement): BilletMember | null {
  const b = element.billets.find((slot) => slot.filled && slot.member);
  return b?.member ?? null;
}

/** One box in the org chart, with childless sub-elements folded in as rows. */
function ChartBox({
  element,
  folded,
}: {
  element: BilletElement;
  folded: BilletElement[];
}) {
  const leader = leaderOf(element);
  const empty = element.filled === 0;
  return (
    <div className="w-44 rounded-sm border border-edge bg-surface px-3 py-2 text-left">
      <p className="flex items-center gap-1.5 truncate font-display text-sm font-semibold text-ink">
        {element.patchUrl ? (
          <img
            src={element.patchUrl}
            alt=""
            className="h-4 w-4 shrink-0 object-contain"
            loading="lazy"
          />
        ) : null}
        {element.name}
      </p>
      {element.callsign ? (
        <p className="micro-label mt-0.5">{element.callsign}</p>
      ) : null}
      {leader ? (
        <p className="mt-1 truncate font-mono text-xs text-ink-muted">
          {leader.rankAbbr ? `${leader.rankAbbr} ` : ""}
          {leader.name}
        </p>
      ) : null}
      <p
        className={`mt-1 font-mono text-xs ${empty ? "text-ink-faint" : "text-ink-muted"}`}
      >
        {element.filled}/{element.total}
      </p>
      {folded.length > 0 ? (
        <ul className="mt-1.5 space-y-0.5 border-t border-edge pt-1.5">
          {folded.map((sub) => (
            <li
              key={sub.id}
              className="flex items-center justify-between gap-2 text-xs"
            >
              <span className="truncate text-ink-muted">{sub.name}</span>
              <span className="shrink-0 font-mono text-ink-faint">
                {sub.filled}/{sub.total}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * Recursive chart node. Children that lead elements of their own get boxes
 * and connector lines; childless children fold into the parent box as rows
 * (a platoon box lists its HQ and vehicle sections, an HQ box its staff
 * sections).
 *
 * Layout follows US ORBAT convention: the top echelons fan out horizontally,
 * everything below stacks vertically with a left spine (keeps the chart
 * narrow instead of wide).
 */
function ChartNode({ element, depth }: { element: BilletElement; depth: number }) {
  const boxChildren = element.children.filter((c) => c.children.length > 0);
  const foldedChildren = element.children.filter((c) => c.children.length === 0);
  // Horizontal through the platoon row (HQ → Company/MAG → platoons);
  // squads and below stack vertically under their platoon.
  const vertical = depth >= 3;
  return (
    <li>
      <ChartBox element={element} folded={foldedChildren} />
      {boxChildren.length > 0 ? (
        <ul className={vertical ? "vtree" : "branch"}>
          {boxChildren.map((child) => (
            <ChartNode key={child.id} element={child} depth={depth + 1} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/**
 * The live ORBAT section, rendered as a military-style org chart (pure CSS,
 * no JS). Reporting lines come from Billet's element nesting: the deeper the
 * elements are nested in Billet, the deeper this chart draws — restructure
 * there and this follows automatically.
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
  // combat only — filter any top-level "S<number>-..." element out, then
  // re-parent the rest along their reporting lines into the real hierarchy.
  const combatElements = buildReportingTree(
    roster.elements.filter((el) => !/^S\d+\b/.test(el.name.trim())),
  );
  const openBillets = countOpenBillets(combatElements);

  return (
    <section id="roster" className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <SectionLabel>Live ORBAT</SectionLabel>
            <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
              Order of battle
            </h2>
            <p className="mt-4 max-w-2xl text-ink-muted">
              The task force&apos;s combat structure, live from the personnel
              system.
            </p>
          </div>
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

        {/* Org chart. w-max + overflow lets wide echelons scroll sideways. */}
        <div className="mt-10 overflow-x-auto pb-2">
          <ul className="orbat-tree mx-auto w-max min-w-full">
            <li>
              {/* Unit-level root box */}
              <div className="flex w-44 items-center gap-3 rounded-sm border border-edge-bright bg-raised px-3 py-2.5">
                {roster.unit.crestUrl ? (
                  <img
                    src={roster.unit.crestUrl}
                    alt=""
                    className="h-9 w-9 shrink-0 object-contain"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-semibold text-ink">
                    {roster.unit.tag ?? roster.unit.name}
                  </p>
                  <p className="micro-label mt-0.5">
                    {roster.unit.strength} active
                  </p>
                </div>
              </div>
              <ul className="branch">
                {combatElements.map((el) => (
                  <ChartNode key={el.id} element={el} depth={1} />
                ))}
              </ul>
            </li>
          </ul>
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
          Synced from Billet · updates every 5 minutes · billet-level detail on
          the{" "}
          <a href={billet.base} className="hover:text-ink">
            full portal →
          </a>
        </p>
      </div>
    </section>
  );
}
