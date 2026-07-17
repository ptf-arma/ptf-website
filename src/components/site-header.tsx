import Image from "next/image";
import Link from "next/link";
import { billet, links } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";

const nav = [
  { label: "The Unit", href: "#unit" },
  { label: "Roles", href: "#roles" },
  { label: "Roster", href: "#roster" },
  { label: "Operations", href: "#ops" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-bg/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/media/patch.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <span className="font-display font-bold tracking-wide text-ink">
            PARAMARINE TASK FORCE
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="micro-label hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink
            href={links.discord}
            variant="ghost"
            size="md"
            className="hidden sm:inline-flex"
          >
            Discord
          </ButtonLink>
          <ButtonLink href={billet.loginUrl} variant="secondary" size="md">
            Log In
          </ButtonLink>
          <ButtonLink href={billet.applyUrl} variant="primary" size="md">
            Enlist
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
