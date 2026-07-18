import Image from "next/image";
import { SectionLabel } from "@/components/ui/section-label";

/**
 * "Media" — proof of life: op screenshots + the unit's cinematic films.
 * Video cards are thumbnail links to YouTube (no iframe weight); thumbnails
 * come from i.ytimg.com (allowed in next.config remotePatterns).
 */

const films = [
  {
    id: "GstgoRjBylA",
    title: "Calm Before the Storm",
    kind: "Amphibious film",
  },
  {
    id: "w3IZoN5j53E",
    title: "Here Comes the Thunder",
    kind: "MAG-36 aviation film",
  },
];

const shots = [
  {
    src: "/media/halo-jump.jpg",
    alt: "Paramarines free-falling from a MAG-36 Osprey high over the coast",
    caption: "Airborne insertion · MAG-36",
    wide: true,
  },
  {
    src: "/media/night-drop.jpg",
    alt: "A mass night parachute drop silhouetted over the treeline",
    caption: "Night jump",
    wide: false,
  },
  {
    src: "/media/flight-line.jpg",
    alt: "Pilots walking the flight line past armed Hornets",
    caption: "The flight line",
    wide: false,
  },
];

export function MediaSection() {
  return (
    <section id="media" className="border-t border-edge">
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <SectionLabel>Media</SectionLabel>
        <h2 className="heading-display mt-3 text-3xl text-ink sm:text-4xl">
          See us in the field
        </h2>

        {/* Screenshots: one feature-wide + two standard */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {shots.map((shot) => (
            <figure
              key={shot.src}
              className={`overflow-hidden rounded-sm border border-edge bg-surface ${
                shot.wide ? "sm:col-span-2" : ""
              }`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                width={1920}
                height={1080}
                sizes={shot.wide ? "(min-width: 72rem) 72rem, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                className="w-full object-cover"
              />
              <figcaption className="micro-label border-t border-edge px-4 py-2.5">
                {shot.caption}
              </figcaption>
            </figure>
          ))}
        </div>

        {/* Unit films */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {films.map((film) => (
            <a
              key={film.id}
              href={`https://www.youtube.com/watch?v=${film.id}`}
              className="group overflow-hidden rounded-sm border border-edge bg-surface transition-colors hover:border-edge-bright"
            >
              <div className="relative">
                <Image
                  src={`https://i.ytimg.com/vi/${film.id}/hqdefault.jpg`}
                  alt={`${film.title} — ${film.kind}`}
                  width={480}
                  height={360}
                  sizes="(min-width: 640px) 50vw, 100vw"
                  className="aspect-video w-full object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 grid place-items-center bg-bg/30 transition-colors group-hover:bg-bg/10"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-full border border-edge-bright bg-bg/80 pl-1 font-display text-lg text-ink">
                    ▶
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-edge px-4 py-2.5">
                <span className="font-display text-sm font-semibold text-ink">
                  {film.title}
                </span>
                <span className="micro-label shrink-0">{film.kind}</span>
              </div>
            </a>
          ))}
        </div>

        <p className="mt-6 font-mono text-xs text-ink-faint">
          As heard on{" "}
          <a
            href="https://soundcloud.com/armahosts-llc"
            className="text-ink-muted hover:text-ink"
          >
            RadioArma — EP #06: Paramarine Task Force
          </a>
        </p>
      </div>
    </section>
  );
}
