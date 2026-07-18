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
    description: "The infantry core of every squad. Where new Marines start.",
    status: "Available",
  },
  {
    designation: "0311",
    name: "Designated Marksman",
    description: "Longer-range rifle support inside the squad.",
    status: "Available · Requires Scout Sniper Course",
  },
  {
    designation: "",
    name: "Hospital Corpsman",
    description: "Attached to a squad. Keeps the wounded in the fight.",
    status: "Waitlist · Requires Combat Life Saver",
  },
  {
    designation: "1834",
    name: "ACV Crewman",
    description: "Crew an amphibious combat vehicle with 3rd Platoon.",
    status: "Available · Selective",
  },
  {
    designation: "7503/7505",
    name: "Rotary/Fixed-Wing Pilot",
    description: "Fly transport and close air support for MAG-36.",
    status: "Available · 2nd Lt requires a flight test",
  },
  {
    designation: "0372",
    name: "Marine Special Operator",
    description:
      "MSO. A second role on top of your billet, with its own recon operations on Thursdays. Anyone in the unit can attend selection.",
    status: "Highly selective · Open tryouts",
  },
];

/* Status dot: available = field blue, waitlist = amber, selection = outline. */
function statusDot(status: string) {
  if (status.toLowerCase().includes("waitlist")) return "bg-opfor";
  if (status.toLowerCase().includes("highly")) return "border border-ink-faint/60";
  return "bg-ok";
}

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
      <p className="micro-label mt-4 inline-flex items-center gap-1.5">
        <span
          aria-hidden
          className={`h-1.5 w-1.5 rounded-full ${statusDot(role.status)}`}
        />
        {role.status}
      </p>
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
        <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
          What you can be
        </h2>
        <p className="mt-4 max-w-2xl text-ink-muted">
          Everyone starts as an 0311 Rifleman. The rest are qualifications you
          earn once you&apos;re in.
        </p>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roles.map((role) => (
            <RoleCard key={role.name} role={role} />
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-edge bg-raised px-5 py-4">
          <p className="text-sm text-ink-muted">
            Courses run Saturdays, from recruit training up to JTAC.
          </p>
          <ButtonLink href={billet.applyUrl} variant="secondary" size="md">
            Apply now
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
