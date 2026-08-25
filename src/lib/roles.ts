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
      "Rifleman is what most of an operation looks like. You hold your place in the formation. You watch the sector you were given. You move when your team leader says move.",
      "Most of what happens in an op happens to a rifleman rather than because of one. Someone has to go where the plan says, hold the ground once it's taken, and cover the arc nobody else is watching. That's most of the squad, most of the time.",
      "No course gates it. Recruit training gets you here and everyone starts here, whatever they're aiming at later. It's also where you learn the things nobody teaches you afterwards: how a fire team holds spacing, what a squad leader is listening for, when a contact report turns into a flank.",
      "Stay a rifleman as long as you like. Plenty of people do, for years. If you came expecting to run the show in week one, this is a starting point, not a destination.",
    ],
  },
  {
    slug: "designated-marksman",
    designation: "0311",
    name: "Designated Marksman",
    blurb: "Longer-range rifle support inside the squad.",
    status: "Available · Requires Scout Sniper Course",
    detail: [
      "A designated marksman walks with the squad. You're not off on a hill by yourself.",
      "What changes is your sector. You carry a rifle built for range the rest of the squad doesn't have, so you get the treeline, the ridge, the ground the riflemen beside you can't reach. You still hold formation. You still take direction from the same team leader as everyone else. Nobody hands a DM authority to pick targets outside the plan.",
      "The Scout Sniper Course gates the billet. Range estimation, wind, and knowing when not to shoot matter more day to day than raw accuracy.",
      "The job rewards patience. You wait for the right shot instead of taking the first one available. If you're picturing a lone sniper working away from the formation, that isn't this. A DM who freelances is a rifleman with a slower rate of fire and worse options up close.",
    ],
  },
  {
    slug: "hospital-corpsman",
    designation: "",
    name: "Hospital Corpsman",
    blurb: "Attached to a squad. Keeps the wounded in the fight.",
    status: "Waitlist · Requires Combat Life Saver",
    detail: [
      "A corpsman moves like everyone else. Same formation, same spacing, a sector to watch while nobody's hurt.",
      "The job starts when someone goes down. Get to them, under fire if you have to. Treat what the medical system models: bleeding, morphine, splints. Get them back up, or stable enough to wait for extraction.",
      "Most of an op, that call never comes. You're a rifleman carrying a medical bag.",
      "Combat Life Saver gates it, and it runs as a waitlist rather than an open billet. Ask a recruiter where the queue stands before you set your heart on it.",
      "The billet needs someone who stays switched on through long stretches of nothing. Ten seconds after a casualty isn't the moment to be fumbling. If you want to be busy for three straight hours, this is the wrong job. Most of it is watching people who are fine and hoping they stay that way.",
    ],
  },
  {
    slug: "acv-crewman",
    designation: "1834",
    name: "ACV Crewman",
    blurb: "Crew an amphibious combat vehicle with 3rd Platoon.",
    status: "Available · Selective",
    detail: [
      "ACV crew aren't on foot. You're in the vehicle with 3rd Platoon, carrying dismounts to the objective and supporting them once they're on it.",
      "Your seat decides the job: driving, gunning, or commanding. You work the vehicle net with your crew and with whatever squad you're carrying that night.",
      "Much of it's positioning. Get somewhere useful without getting somewhere you'll be killed, then hold it. A dead ACV helps nobody, and it takes its crew and its cargo with it.",
      "The billet is selective and it sits with 3rd Platoon. It isn't a side qualification you pick up alongside a rifle squad.",
      "Crewing suits people who 'd rather work a machine with two or three others than move with eight. The flip side is that your fight looks nothing like a rifleman's. If what you want is to take ground on foot, take it on foot.",
    ],
  },
  {
    slug: "pilot",
    designation: "7503/7505",
    name: "Rotary/Fixed-Wing Pilot",
    blurb: "Fly transport and close air support for MAG-36.",
    status: "Available · 2nd Lt requires a flight test",
    detail: [
      "Flying for MAG-36 means transport and close air support for whoever needs it. Insert a squad. Hold for extraction. Run CAS when someone on the ground calls for it.",
      "Much of the job is waiting. You orbit at altitude or sit at a rally point until the radio tells you where to be. The ground fight sets the schedule.",
      "The billet is open. Commissioning to 2nd Lt needs a flight test, flown to the standard the job demands rather than the one that gets you by on a public server.",
      "Support work has to be enough for you. A pickup that arrives on time matters as much as anything the rifle squads did that night, and nobody will clap. Pilots spend much of an operation circling, waiting on a call that hasn't come. That's a particular kind of patience. Not everyone has it.",
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
      "MSO doesn't replace your billet. It stacks on top, with its own recon operations on Thursdays.",
      "A rifle squad op is built around contact and holding ground. Recon runs the other way. Small numbers, eyes on the objective, report back rather than engage. That asks for patience, and for discipline about noise and movement.",
      "Selection is open to anyone in the unit. It's also highly selective. Turning up to tryouts and passing them are different things, and the standard is set high deliberately.",
      "It costs a second night a week on top of the one you already commit to. Take it if you want more of the unit than Sunday. Don't take it until you're solid in your primary role. Arriving at selection without your fundamentals is the quickest way out again.",
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
