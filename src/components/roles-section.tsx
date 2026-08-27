import Link from "next/link";
import { billet } from "@/lib/config";
import { roles, statusDot, type Role } from "@/lib/roles";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

function RoleCard({ role }: { role: Role }) {
  return (
    <Link
      href={`/roles#${role.slug}`}
      className="group block rounded-sm border border-edge bg-surface p-5 transition-colors hover:border-edge-bright"
    >
      {role.designation ? (
        <span className="micro-label">{role.designation}</span>
      ) : null}
      <h3 className="mt-1 font-display text-base font-semibold text-ink">
        {role.name}
      </h3>
      <p className="mt-2 text-sm text-ink-muted">{role.blurb}</p>
      <p className="micro-label mt-4 inline-flex items-center gap-1.5">
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${statusDot(role.status)}`}
        />
        {role.status}
      </p>
    </Link>
  );
}

/**
 * "Roles" — the available billet types plus the training pipeline hook.
 * Cards are summaries; the full write-up for each billet lives on /roles.
 * Featured billets get cards; the rest render as a single chip strip so the
 * section doesn't grow with the roster.
 */
export function RolesSection() {
  const featured = roles.filter((role) => role.featured);
  const rest = roles.filter((role) => !role.featured);

  return (
    <section id="roles" className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionLabel>Roles</SectionLabel>
        <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
          What you can be
        </h2>
        <p className="mt-4 max-w-2xl text-ink-muted">
          Everyone starts as an 0311 Rifleman. Some billets are open from your
          first op; the rest you earn once you&apos;re in.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((role) => (
            <RoleCard key={role.name} role={role} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-2 rounded-sm border border-edge bg-surface px-5 py-4">
          <span className="micro-label text-ink-faint">Also on the books</span>
          <span className="flex flex-wrap gap-2">
            {rest.map((role) => (
              <Link
                key={role.slug}
                href={`/roles#${role.slug}`}
                className="micro-label inline-flex items-center gap-1.5 rounded-sm border border-edge bg-raised px-2.5 py-1 text-ink-muted transition-colors hover:border-edge-bright hover:text-ink"
              >
                <span
                  aria-hidden
                  className={`h-1.5 w-1.5 rounded-full ${statusDot(role.status)}`}
                />
                {role.name}
              </Link>
            ))}
          </span>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
          <p className="text-sm text-ink-muted">
            Courses run Saturdays, from recruit training up to JTAC.{" "}
            <Link
              href="/roles"
              className="text-ink underline decoration-edge-bright underline-offset-4 hover:decoration-ink"
            >
              What each billet actually does
            </Link>
            .
          </p>
          <ButtonLink href={billet.applyUrl} variant="secondary" size="md">
            Apply now
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
