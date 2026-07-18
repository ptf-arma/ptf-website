import Image from "next/image";
import { billet, links } from "@/lib/config";

const community = [
  { label: "Discord", href: links.discord },
  { label: "Steam Group", href: links.steam },
  { label: "Modpack", href: links.modpack },
  { label: "Arma 3 Units", href: links.arma3units },
  { label: "Patreon", href: links.patreon },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-edge bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <Image
            src="/brand/ptf-logo-horizontal-reversed-800w.png"
            alt="Paramarine Task Force"
            width={800}
            height={203}
            className="h-9 w-auto"
          />
          <p className="mt-3 max-w-md text-sm text-ink-muted">
            A serious, fun, and immersive Arma 3 milsim unit. TeamSpeak:{" "}
            <span className="font-mono text-ink-faint">{links.teamspeak}</span>
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {community.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="micro-label hover:text-ink"
            >
              {item.label}
            </a>
          ))}
          <a href="/milsim-guide" className="micro-label hover:text-ink">
            Milsim Guide
          </a>
          <a href="/progression" className="micro-label hover:text-ink">
            Ranks &amp; Awards
          </a>
          <a href="/join" className="micro-label hover:text-ink">
            How to Join
          </a>
          <a href={billet.applyUrl} className="micro-label hover:text-ink">
            Enlist
          </a>
        </nav>
      </div>
      <div className="border-t border-edge">
        <p className="mx-auto max-w-6xl px-4 py-4 text-xs text-ink-faint sm:px-6">
          © {2026} Paramarine Task Force. Personnel systems powered by Billet.
        </p>
      </div>
    </footer>
  );
}
