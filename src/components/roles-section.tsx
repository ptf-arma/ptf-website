import { billet } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";
import { SectionLabel } from "@/components/ui/section-label";

type Role = {
  designation: string;
  name: string;
  description: string;
  status: string;
};

const roles: Role[] = [
  {
    designation: "0311",
    name: "Rifleman",
    description:
      "Infantry at the core of every squad — the standard billet for new Marines.",
    status: "Available",
  },
  {
    designation: "0311",
    name: "Designated Marksman",
    description:
      "Extended-range rifle support inside the squad, built for precision under pressure.",
    status: "Available · Requires Scout Sniper Course",
  },
  {
    designation: "",
    name: "Hospital Corpsman",
    description:
      "Attached to a squad to administer medical aid in the field.",
    status: "Waitlist · Requires Combat Life Saver",
  },
  {
    designation: "1834",
    name: "ACV Crewman",
    description:
      "Crew an ACV with 3rd Platoon, running armor in support of the infantry.",
    status: "Available · Selective",
  },
  {
    designation: "7503/7505",
    name: "Rotary/Fixed-Wing Pilot",
    description:
      "Fly rotary or fixed-wing airframes with our Marine Aircraft Group.",
    status: "Available · 2nd Lt requires a flight test",
  },
  {
    designation: "0372",
    name: "Paramarine Special Operator",
    description:
      "A secondary role earned by attending the PSO selection event.",
    status: "Highly selective",
  },
];

function RoleCard({ role }: { role: Role }) {
  return (
    <div className="rounded-sm border border-edge bg-surface p-5">
      {role.designation ? (
        <span className="micro-label">{role.designation}</span>
      ) : null}
      <h3 className="mt-1 font-display text-base font-semibold text-ink">
        {role.name}
      </h3>
      <p className="mt-2 text-sm text-ink-muted">{role.description}</p>
      <p className="micro-label mt-4">{role.status}</p>
    </div>
  );
}

/**
 * "Roles" — the available billet types plus the training pipeline hook.
 */
export function RolesSection() {
  return (
    <section id="roles" className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionLabel>Roles</SectionLabel>
        <h2 className="heading-display mt-3 text-2xl text-ink sm:text-3xl">
          What you can be
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <RoleCard key={role.name} role={role} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
          <p className="text-sm text-ink-muted">
            Every Marine starts with recruit training. From there, specialize
            as far as you want — marksmanship, armor, aviation, medical, JTAC.
          </p>
          <ButtonLink href={billet.applyUrl} variant="secondary" size="md">
            Apply now
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
