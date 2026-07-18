/**
 * The unit's weekly schedule — single source of truth. Referenced by the
 * hero readout, the operations section, the join page, and the Event
 * structured data, so it can't drift between them.
 */
export type ScheduleEntry = {
  key: string;
  label: string;
  day: string;
  /** 0=Sun … 6=Sat, for viewer-local time conversion. */
  weekday: number;
  hourEt: number;
  time: string;
  schemaDay: string;
  description: string;
  /** Not open to the whole unit. */
  restricted?: string;
};

export const schedule: ScheduleEntry[] = [
  {
    key: "ftx",
    label: "Field training",
    day: "Tuesdays",
    weekday: 2,
    hourEt: 20,
    time: "8PM ET",
    schemaDay: "https://schema.org/Tuesday",
    description:
      "Field Training Exercise. Drills and rehearsal with your squad or platoon.",
  },
  {
    key: "recon",
    label: "Recon ops",
    day: "Thursdays",
    weekday: 4,
    hourEt: 20,
    time: "8PM ET",
    schemaDay: "https://schema.org/Thursday",
    description: "Reconnaissance operations run by the MSO element.",
    restricted: "MSO only",
  },
  {
    key: "courses",
    label: "Schools",
    day: "Saturdays",
    weekday: 6,
    hourEt: 20,
    time: "8PM ET",
    schemaDay: "https://schema.org/Saturday",
    description:
      "Specialized training courses. Qualify for a new weapon, vehicle, or billet.",
  },
  {
    key: "main-op",
    label: "Main operation",
    day: "Sundays",
    weekday: 0,
    hourEt: 20,
    time: "8PM ET",
    schemaDay: "https://schema.org/Sunday",
    description:
      "The week's operation. Everyone deploys, from rifle squads to aircrew.",
  },
];
