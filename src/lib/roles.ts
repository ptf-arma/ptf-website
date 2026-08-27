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
  /** Gets a full card on the homepage; the rest render as compact chips. */
  featured?: boolean;
};

export const roles: Role[] = [
  {
    slug: "rifleman",
    designation: "0311",
    name: "Rifleman",
    blurb: "The infantry core of every squad. Where new Marines start.",
    status: "Available",
    featured: true,
    detail: [
      "Rifleman is what most of an operation looks like. You hold your place in the formation. You watch the sector you were given. You move when your team leader says move.",
      "Most of what happens in an op happens to a rifleman rather than because of one. Someone has to go where the plan says, hold the ground once it's taken, and cover the arc nobody else is watching. That's most of the squad, most of the time.",
      "No course gates it. Recruit training gets you here and everyone starts here, whatever they're aiming at later. It's also where you learn the things nobody teaches you afterwards: how a fire team holds spacing, what a squad leader is listening for, when a contact report turns into a flank.",
      "Stay a rifleman as long as you like. Plenty of people do, for years. If you came expecting to run the show in week one, this is a starting point, not a destination.",
    ],
  },
  {
    slug: "automatic-rifleman",
    designation: "0311",
    name: "Automatic Rifleman",
    blurb: "The fire team's automatic weapon. Suppression is the job.",
    status: "Available · Entry level",
    featured: true,
    detail: [
      "Each fire team carries one automatic rifle. The job is suppression: keeping the enemy's heads down while the rest of the team moves.",
      "You carry more ammunition than anyone else in the team and you're expected to manage it — short bursts, a clear arc of fire, and enough left for when the team actually needs it.",
      "No course gates it. If the slot's open, you can take the gun on your first op.",
    ],
  },
  {
    slug: "grenadier",
    designation: "0311",
    name: "Grenadier",
    blurb: "A rifleman with an underbarrel grenade launcher.",
    status: "Available · Entry level",
    featured: true,
    detail: [
      "A rifleman with an underbarrel grenade launcher. Your rounds arc, so you cover the ground rifles can't reach: trenches, rooftops, the far side of cover. You also carry smoke for marking and screening, which gets used more often than the HE does.",
      "The main skill is judgment about when to fire. HE lands near friendlies if you're careless with it.",
      "No course gates it. Entry level, whenever the slot's open.",
    ],
  },
  {
    slug: "machine-gunner",
    designation: "0331",
    name: "Machine Gunner",
    blurb: "The squad's belt-fed medium machine gun.",
    status: "When available · Entry level",
    detail: [
      "The belt-fed medium gun, run as the squad's base of fire. A well-sited gun can lock down a road or a treeline, so where you put it matters more than how much you shoot.",
      "You hold your sector and displace on order.",
      "Entry level, no course, but the slot only exists when the operation's structure includes a gun. Ask what's being carried before you plan your night around it.",
    ],
  },
  {
    slug: "mortarman",
    designation: "0341",
    name: "Mortarman",
    blurb: "Indirect fire support, on call over the radio.",
    status: "When available · Entry level",
    detail: [
      "Indirect fire support from behind the line. Fire missions come in over the radio as grids and corrections; you plot them, lay the tube, and adjust until the rounds land where the ground element needs them.",
      "Expect long stretches of waiting and short stretches where accuracy matters a lot. The people you're supporting are close to the impacts.",
      "Entry level when it runs, but it only runs when the operation calls for mortars.",
    ],
  },
  {
    slug: "designated-marksman",
    designation: "0311",
    name: "Designated Marksman",
    blurb: "Longer-range rifle support inside the squad.",
    status: "Available · Requires exceptional range score",
    detail: [
      "A designated marksman walks with the squad. You're not off on a hill by yourself.",
      "What changes is your sector. You carry a rifle built for range the rest of the squad doesn't have, so you get the treeline, the ridge, the ground the riflemen beside you can't reach. You still hold formation. You still take direction from the same team leader as everyone else. Nobody hands a DM authority to pick targets outside the plan.",
      "An exceptional score on the shooting range gates the billet. Range estimation, wind, and knowing when not to shoot matter more day to day than raw accuracy.",
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
    slug: "heavy-antitank",
    designation: "0352",
    name: "Heavy Antitank",
    blurb: "Shoulder-fired launcher for enemy armor.",
    status: "Available · Requires qualification",
    detail: [
      "You carry the launcher that deals with enemy armor, and only a few rounds for it, so each shot has to be worth taking.",
      "Most of the work is positioning: a flank the vehicle isn't watching, a clear backblast area, and a way out afterwards. Between armor threats you fight as a rifleman with a heavier pack.",
      "A qualification gates the billet — the weapon system, target identification, and shot discipline.",
    ],
  },
  {
    slug: "combat-engineer",
    designation: "1371",
    name: "Combat Engineer",
    blurb: "Demolitions, breaching, and mine clearance.",
    status: "Available · Requires qualification",
    detail: [
      "Engineers handle demolitions, breaching, and clearing mines and IEDs. You get called forward for a locked compound, a wire obstacle, or a road that might be seeded.",
      "It's careful, procedural work, usually with a squad waiting on you to finish. The rest of the op you fight as a rifleman.",
      "A qualification gates it, covering charges, breaching, and clearance procedure.",
    ],
  },
  {
    slug: "fireteam-leader",
    designation: "0311",
    name: "Fireteam Leader",
    blurb: "Runs a fire team of three.",
    status: "When available · Requires qualifications",
    detail: [
      "A fireteam leader runs a team of three. The squad leader gives you a task — take that building, watch that flank — and you decide how your team executes it: who moves, who covers, where everyone's looking.",
      "In contact, the squad leader talks to you, and your riflemen act on what you pass down.",
      "Qualifications gate it, and beyond those it depends on an open slot. It's also the usual first step toward squad leader.",
    ],
  },
  {
    slug: "jtac",
    designation: "",
    name: "JTAC",
    blurb: "Controls aircraft for the ground force.",
    status: "When available · Requires qualifications",
    detail: [
      "A JTAC controls aircraft for the ground force: talking a pilot's eyes onto a target, keeping them clear of friendlies, and clearing them to engage.",
      "It's radio work and it has to be precise, because a mistake here puts ordnance on the wrong grid.",
      "Qualifications gate it, and slots depend on whether the operation carries air.",
    ],
  },
  {
    slug: "acv-crewman",
    designation: "1834",
    name: "ACV Crewman",
    blurb: "Crew an amphibious combat vehicle with 3rd Platoon.",
    status: "Available · Selective",
    featured: true,
    detail: [
      "ACV crew aren't on foot. You're in the vehicle with 3rd Platoon, carrying dismounts to the objective and supporting them once they're on it.",
      "Your seat decides the job: driving, gunning, or commanding. You work the vehicle net with your crew and with whatever squad you're carrying that night.",
      "Much of it's positioning. Get somewhere useful without getting somewhere you'll be killed, then hold it. A dead ACV helps nobody, and it takes its crew and its cargo with it.",
      "The billet is selective and it sits with 3rd Platoon. It isn't a side qualification you pick up alongside a rifle squad.",
      "Crewing suits people who'd rather work a machine with two or three others than move with eight. The flip side is that your fight looks nothing like a rifleman's. If what you want is to take ground on foot, take it on foot.",
    ],
  },
  {
    slug: "pilot",
    designation: "7503/7505",
    name: "Rotary/Fixed-Wing Pilot",
    blurb: "Fly transport and close air support for MAG-36.",
    status: "Available · 2nd Lt requires a flight test",
    featured: true,
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
    featured: true,
    detail: [
      "MSO doesn't replace your billet. It stacks on top, with its own recon operations on Thursdays.",
      "A rifle squad op is built around contact and holding ground. Recon runs the other way. Small numbers, eyes on the objective, report back rather than engage. That asks for patience, and for discipline about noise and movement.",
      "Selection is open to anyone in the unit. It's also highly selective. Turning up to tryouts and passing them are different things, and the standard is set high deliberately.",
      "It costs a second night a week on top of the one you already commit to. Take it if you want more of the unit than Sunday. Don't take it until you're solid in your primary role. Arriving at selection without your fundamentals is the quickest way out again.",
    ],
  },
  {
    slug: "operations-staff",
    designation: "",
    name: "Operations Staff",
    blurb: "Zeus. Builds and runs the unit's operations.",
    status: "Highly selective · Skill and availability",
    detail: [
      "Operations staff build and run the operations instead of playing them. Missions get made ahead of time — terrain, enemy composition, objectives — and during the op you're in the Zeus seat, running the enemy and adjusting as the night unfolds.",
      "It takes time outside op nights, since every mission is built on your own time before Sunday.",
      "Skill and availability gate it. A weak Zeus costs the whole unit its evening, so the standard is high.",
    ],
  },
];

/**
 * Status dot colour: available = green, gated by availability (waitlist /
 * when available) = amber, selection-gated = outline.
 */
export function statusDot(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("waitlist") || s.includes("when available")) return "bg-opfor";
  if (s.includes("highly")) return "border border-ink-faint/60";
  return "bg-ok";
}
