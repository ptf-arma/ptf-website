import Image from "next/image";
import Link from "next/link";
import { billet } from "@/lib/config";
import { ButtonLink } from "@/components/ui/button";

const nav = [
  { label: "The Unit", href: "#unit" },
  { label: "Roles", href: "#roles" },
  { label: "Roster", href: "#roster" },
  { label: "Operations", href: "#ops" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-edge bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
        {/* Official horizontal-reversed lockup (brand standards: use the
            supplied SVG on dark backgrounds; never re-typeset the wordmark). */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/brand/ptf-logo-horizontal-reversed.svg"
            alt="Paramarine Task Force"
            width={800}
            height={200}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-display text-sm font-semibold uppercase tracking-[0.08em] text-ink-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <ButtonLink href={billet.loginUrl} variant="ghost" size="md">
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
