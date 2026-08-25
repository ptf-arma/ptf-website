/**
 * The unit's billet types — single source of truth, like schedule.ts.
 * Referenced by the homepage roles section (summary cards) and /roles (full
 * detail), so the two can't drift.
 *
 * `blurb` is the one-liner shown on the homepage card. `detail` is the
 * long-form copy shown only on /roles — the homepage deliberately stays a
 * summary so it doesn't turn into a wall of text.
 */

export type Role = {
  /** URL fragment on /roles. */
  slug: string;
  /** USMC MOS code, where the billet maps to one. */
  designation: string;
  name: string;
  /** Homepage card one-liner. */
  blurb: string;
  /** Availability + what gates it. */
  status: string;
  /** Paragraphs for the /roles page. */
  detail: string[];
};

export const roles: Role[] = [
  {
    slug: "rifleman",
    designation: "0311",
    name: "Rifleman",
    blurb: "The infantry core of every squad. Where new Marines start.",
    status: "Available",
    detail: [
      "Rifleman is what you spend most of an operation doing: hold your position in the formation, watch the sector you were assigned, and move when your team leader tells you to move. Most of what happens in an operation happens to a rifleman rather than because of one — you're not making the calls, you're executing them. Someone has to actually go where the plan says to go, hold the ground once it's taken, and cover the arc nobody else is watching, and that's most of the squad, most of the time.",
      "There's no course gating this one. Recruit training gets you here, and every new Marine starts as an 0311 rifleman regardless of what they eventually want to do. It's also where you learn what nobody teaches you once you've specialized — how a fire team actually moves and holds spacing, what a squad leader is watching for, and when a contact report turns into a flanking maneuver instead of just a firefight.",
      "It suits people who want to learn how a squad works before taking on anything else, and it suits people who are fine never specializing at all — plenty of good Marines stay riflemen for years because they'd rather follow good orders than take on a role's extra responsibility. It doesn't suit anyone who signed up expecting to run the show from day one. If you want more say over the plan than 'watch your sector and wait for the word,' this is a starting point, not a destination.",
    ],
  },
  {
    slug: "designated-marksman",
    designation: "0311",
    name: "Designated Marksman",
    blurb: "Longer-range rifle support inside the squad.",
    status: "Available · Requires Scout Sniper Course",
    detail: [
      "A designated marksman still walks with the squad — you're not off on a hill somewhere by yourself. What changes is your job inside the formation: you're carrying a rifle built for range the rest of the squad doesn't have, and your sector tends to be the one furthest out, the treeline or the ridge the riflemen next to you can't reliably reach. You still take direction from the same team leader everyone else does, and you still hold formation and spacing like anyone in the squad. Nobody hands a DM independent authority to pick targets outside the plan.",
      "The role is gated behind the Scout Sniper Course, which is where you actually learn to use that extra range for something more than looking impressive on a screenshot — range estimation, wind calls, and target discipline matter more day to day than raw accuracy.",
      "It suits someone patient enough to hold a position and wait for the right shot instead of firing at the first available one, and someone comfortable staying inside a squad's plan rather than working solo. It doesn't suit anyone picturing a lone sniper operating outside the formation — that's not how the role runs here, and a DM who freelances away from the squad is just a rifleman with a slower rate of fire and worse options up close.",
    ],
  },
  {
    slug: "hospital-corpsman",
    designation: "",
    name: "Hospital Corpsman",
    blurb: "Attached to a squad. Keeps the wounded in the fight.",
    status: "Waitlist · Requires Combat Life Saver",
    detail: [
      "A corpsman moves with the squad like everyone else — same formation, same spacing, and a sector to watch when nobody's hurt. The job really starts when someone goes down: get to them under fire if you have to, treat them according to whatever the unit's medical system models — bleeding, morphine, splints, the rest — and either get them back in the fight or stable enough to wait for extraction. Most of an operation, though, that call doesn't come. You're carrying a medical bag and covering an arc like a rifleman who happens to also be carrying a medical bag.",
      "Getting here requires Combat Life Saver. It currently runs as a waitlist rather than an open billet, so expect to wait for a slot even once you're qualified. Worth asking a recruiter where the queue stands before you set your heart on it.",
      "It suits someone who doesn't need constant action to stay engaged, and who can go from doing nothing in particular to genuinely useful in the ten seconds after someone gets hit without fumbling the handoff. It doesn't suit someone who wants to be doing something dramatic for the whole operation. A lot of being a corpsman is watching people who are perfectly fine and hoping it stays that way, then handling the ten minutes where it doesn't.",
    ],
  },
  {
    slug: "acv-crewman",
    designation: "1834",
    name: "ACV Crewman",
    blurb: "Crew an amphibious combat vehicle with 3rd Platoon.",
    status: "Available · Selective",
    detail: [
      "Crewing an ACV means you're not on foot with the rifle squads — you're inside a vehicle with 3rd Platoon, moving dismounts to and from the objective and providing fire support once they're there. Depending on your seat that's driving, gunning, or commanding, coordinating over the vehicle net with the rest of the crew and with whatever squad you're carrying that operation. A good chunk of the job is positioning: getting the vehicle somewhere it's useful without putting it somewhere it can be killed easily, then holding that spot.",
      "The role is available but selective, and it sits specifically with 3rd Platoon rather than being something any squad member can pick up as a side qualification.",
      "It suits people who'd rather work a vehicle with a small crew than run a rifle squad's dismounted routine, and who don't mind a role that lives or dies on teamwork with two or three other people instead of eight or nine. It doesn't suit anyone who wants to be moving on foot and taking ground personally — an ACV crewman's fight looks nothing like a rifleman's, and if what you actually want is infantry work, this isn't it.",
    ],
  },
  {
    slug: "pilot",
    designation: "7503/7505",
    name: "Rotary/Fixed-Wing Pilot",
    blurb: "Fly transport and close air support for MAG-36.",
    status: "Available · 2nd Lt requires a flight test",
    detail: [
      "Flying for MAG-36 means running transport and close air support for whatever ground element needs it that operation — inserting squads, standing by for extraction, or making a CAS run when someone on the ground calls it in. A meaningful chunk of the job is waiting: holding at an altitude or a rally point until the radio tells you where to be next, because the ground fight sets the schedule, not the aircraft.",
      "The role itself is open, but 2nd Lt requires a flight test — landing and flying with the precision the job actually demands, not the looser standard that gets you through a public server without anyone noticing.",
      "It suits someone who's genuinely comfortable in a support role and doesn't need to be in the fight to feel useful — a pickup executed on time matters as much as anything a rifle squad does that operation, even if it's a lot less dramatic to watch. It doesn't suit anyone who wants constant action. A pilot spends a lot of an op circling, waiting on a call that hasn't come yet, and that's a specific kind of patience not everyone actually has.",
    ],
  },
  {
    slug: "marine-special-operator",
    designation: "0372",
    name: "Marine Special Operator",
    blurb:
      "MSO. A second role on top of your billet, with its own recon operations on Thursdays. Anyone in the unit can attend selection.",
    status: "Highly selective · Open tryouts",
    detail: [
      "MSO isn't a replacement for your regular billet — it's a second role stacked on top of it, with its own recon operations run separately on Thursdays. Where a rifle squad operation is built around direct contact and holding ground, MSO recon leans the other way: getting eyes on something without being seen, moving in small numbers, and reporting back instead of engaging first. That changes what the job asks of you minute to minute — more patience, more discipline about noise and movement, less of the straightforward contact-and-react rhythm a rifle squad runs on.",
      "Selection is open to anyone already in the unit, which is generous, but it's also highly selective — showing up to tryouts doesn't mean passing them, and the standard is set high on purpose.",
      "It suits people who want more out of the unit than one operation a week and are willing to give up a second night for it. It doesn't suit anyone who isn't solid in their primary role yet — MSO is additional load on top of your existing billet, not a shortcut past it, and showing up to selection without your fundamentals down is the fastest way to not make it through.",
    ],
  },
];

/** Status dot colour: available = brand blue, waitlist = amber, selection = outline. */
export function statusDot(status: string): string {
  if (status.toLowerCase().includes("waitlist")) return "bg-opfor";
  if (status.toLowerCase().includes("highly"))
    return "border border-ink-faint/60";
  return "bg-ok";
}
