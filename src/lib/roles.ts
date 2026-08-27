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
      "Every fire team carries one automatic rifle, and somebody has to be behind it.",
      "The job is suppression. When your team moves, you're the reason the enemy's heads are down while they do it. You don't have to hit anyone for the gun to be working — you have to make the other side stop shooting long enough for your team to close the distance.",
      "That takes discipline more than aggression. Bursts, not belts. A position with a clear arc. Enough ammunition left for the moment it actually matters, which is usually later than you think.",
      "It's an entry-level billet — no course gates it, and you can take the gun on your first op if the slot's open. It's also the fastest way to learn how fire and movement actually works, because you're half of it.",
    ],
  },
  {
    slug: "grenadier",
    designation: "0311",
    name: "Grenadier",
    blurb: "Underbarrel launcher. HE into the ground rifles can't touch.",
    status: "Available · Entry level",
    featured: true,
    detail: [
      "A grenadier is a rifleman with an underbarrel launcher and a different set of problems to solve.",
      "Rifles shoot flat. Your rounds arc, which means you own the ground nobody else can touch: behind the wall, in the ditch, on the far side of the ridge line. You also carry smoke for marking and screening, which gets asked for more often than HE does.",
      "The judgment is the job. An arcing round near friendlies is a decision, not a reflex, and a grenadier who lobs HE at everything is a liability the squad has to manage.",
      "Entry level, no course. If you like having an answer for the awkward piece of terrain, this is a good place to start.",
    ],
  },
  {
    slug: "machine-gunner",
    designation: "0331",
    name: "Machine Gunner",
    blurb: "The medium gun. Belt-fed, heavier, and the squad's base of fire.",
    status: "When available · Entry level",
    detail: [
      "The medium machine gun is not a bigger automatic rifle. It's the weapon the rest of the plan gets built around when it's on the ground.",
      "Where the gun goes decides what it's worth. A well-sited gun locks down a road, a treeline, an entire avenue of approach. A badly sited one is a heavy thing you carried a long way for nothing. You'll spend more time thinking about positioning than shooting.",
      "It's entry level — no course gates it — but the slot only exists when the operation's structure calls for it. Ask what the squad's carrying before you plan your night around it.",
      "The gun rewards patience and punishes wandering. You displace when you're told, not when you're bored. If you want to move constantly, stay on a rifle.",
    ],
  },
  {
    slug: "mortarman",
    designation: "0341",
    name: "Mortarman",
    blurb: "Indirect fire from behind the line, on call for the squads.",
    status: "When available · Entry level",
    detail: [
      "Mortarmen fight the same battle as everyone else, usually without seeing any of it.",
      "A fire mission comes over the radio as a grid and a description. Your job is to turn that into rounds landing where the squad on the ground needs them — plotting, laying the tube, adjusting off their corrections. The people you're supporting are close to the impacts, and they're trusting your arithmetic.",
      "Most of the night is waiting by the tube. Then a call comes and the next ninety seconds matter more than anything else you'll do that op.",
      "Entry level when it runs, but it runs when the operation calls for it rather than every week. It suits people who like precision under time pressure and don't need to see the fight to feel part of it.",
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
      "An exceptional score on the shooting range gates the billet — not a course, a standard. Shoot to it consistently and the rifle's yours to ask for. Range estimation, wind, and knowing when not to shoot matter more day to day than raw accuracy.",
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
    blurb: "The launcher that answers armor. Few rounds, no second chances.",
    status: "Available · Requires qualification",
    detail: [
      "When something tracked and angry shows up, the squad's rifles stop mattering and you start.",
      "You carry a launcher and a very small number of rounds, which means every shot is a decision made before you took the tube off your shoulder. Positioning does most of the work: a flank the vehicle isn't watching, a backblast area that won't cook your own team, a route out for after you've announced exactly where you are.",
      "A qualification gates the billet — the weapon system, target identification, and the discipline of not taking a bad shot just because a tank is frightening.",
      "Between armor threats you're a rifleman with a heavy pack. The billet suits people who can carry a lot, wait a long time, and be exactly right once.",
    ],
  },
  {
    slug: "combat-engineer",
    designation: "1371",
    name: "Combat Engineer",
    blurb: "Demolitions, breaching, and the mines everyone else walks past.",
    status: "Available · Requires qualification",
    detail: [
      "Engineers get called forward when the plan meets something the plan didn't expect: a locked compound, a wire obstacle, a road that might be seeded.",
      "The work is demolitions, breaching, and clearing mines and IEDs — deliberate, procedural work, usually done while an entire squad waits on you and the clock feels personal.",
      "A qualification gates it. Charges sized wrong and mines cleared casually both end the same way, so the course is less about explosives and more about doing the same careful sequence every single time.",
      "The rest of the op you fight as a rifleman. It suits methodical people who like being the answer to a specific, occasional, high-stakes question.",
    ],
  },
  {
    slug: "fireteam-leader",
    designation: "0311",
    name: "Fireteam Leader",
    blurb: "Three Marines to run. The first rung of leading anything.",
    status: "When available · Requires qualifications",
    detail: [
      "A fireteam leader runs three Marines, and it's the first billet where other people's nights depend on your decisions.",
      "The squad leader gives you intent — take that building, watch that flank. Your job is to turn it into what your three actually do: who moves, who covers, where the spacing went. In contact, the squad leader talks to you, not to your riflemen. You're the joint the squad bends at.",
      "Qualifications gate it, and beyond those it's about slots — teams need leading when there are teams to lead, so the billet opens with the roster rather than on demand.",
      "It suits people who talk when it matters and shut up when it doesn't. If you want it as a stepping stone to squad leader, good — that's exactly what it is. But you have to want the three Marines first.",
    ],
  },
  {
    slug: "jtac",
    designation: "",
    name: "JTAC",
    blurb: "The voice that puts aircraft onto targets for the ground force.",
    status: "When available · Requires qualifications",
    detail: [
      "A JTAC is the link between the squads on the ground and everything MAG-36 has in the air.",
      "The job is talking a pilot's eyes onto a target they can't sort out from altitude — position, description, friendlies, cleared hot. Done well, it looks effortless. Done sloppily, ordnance lands on the wrong grid, and there's no billet in the unit where a mistake costs more.",
      "That's why it's gated the way it is: qualifications first, and then availability, because an op only carries so many controllers and the air only checks in when the mission brings it.",
      "It suits people who are precise on the radio under pressure and honest about what they can't see. Most of the night is holding the picture in your head so it's ready the moment someone needs it.",
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
    blurb: "Zeus. Build the operations everyone else plays, then run them live.",
    status: "Highly selective · Skill and availability",
    detail: [
      "Operations staff don't play the op. They run it.",
      "Before Sunday, that's mission-making: terrain, enemy composition, objectives, the reasons things are where they are. During the op it's Zeus — playing the enemy live, adjusting when the platoon does something the plan didn't predict, keeping the night hard without making it unfair. The unit's best evenings were somebody's spreadsheet the Tuesday before.",
      "Skill and availability gate it. Skill, because a bad Zeus can waste forty people's night at once. Availability, because building a mission is homework, done on your own time, every time.",
      "It suits people who'd rather author the fight than win it. You give up playing to take it — the trade is that every firefight in the op is one you wrote.",
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
