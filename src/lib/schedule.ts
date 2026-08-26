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
      "Drills with your own squad or platoon, and the whole unit together on the third Tuesday of the month.",
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
    restricted: "MSO cert required",
  },
  {
    key: "prt",
    label: "Recruit training",
    day: "Fridays",
    weekday: 5,
    hourEt: 20,
    time: "8PM ET",
    schemaDay: "https://schema.org/Friday",
    description:
      "Paramarine Recruit Training. New Marines have 30 days from joining to pass it.",
    restricted: "Recruits only",
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
      "Attendee's choice: whichever course the most people who turn up need is the one that runs.",
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
