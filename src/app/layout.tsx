import type { Metadata } from "next";
import { Saira_Condensed, JetBrains_Mono, Barlow } from "next/font/google";
import "./globals.css";
import { SITE_URL, links } from "@/lib/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Structured data: Organization + the two recurring weekly events.
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Paramarine Task Force",
      alternateName: "Paramarines",
      url: SITE_URL,
      logo: `${SITE_URL}/brand/ptf-emblem-326w.png`,
      foundingDate: "2016",
      description:
        "A serious, fun, and immersive Arma 3 milsim unit — rapid-deployment Marines with weekly operations and structured training.",
      sameAs: [links.discord, links.steam, links.arma3units, links.patreon],
    },
    {
      "@type": "Event",
      name: "PTF Field Training Exercise (FTX)",
      description:
        "Weekly Arma 3 field training — drills, qualifications, and course work with the Paramarine Task Force.",
      organizer: { "@id": `${SITE_URL}/#org` },
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      location: { "@type": "VirtualLocation", url: SITE_URL },
      eventSchedule: {
        "@type": "Schedule",
        byDay: "https://schema.org/Saturday",
        startTime: "20:00:00-05:00",
        repeatFrequency: "P1W",
      },
    },
    {
      "@type": "Event",
      name: "PTF Main Operation",
      description:
        "The weekly main event — a full-scale Arma 3 milsim operation across the Paramarine Task Force.",
      organizer: { "@id": `${SITE_URL}/#org` },
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      location: { "@type": "VirtualLocation", url: SITE_URL },
      eventSchedule: {
        "@type": "Schedule",
        byDay: "https://schema.org/Sunday",
        startTime: "20:00:00-05:00",
        repeatFrequency: "P1W",
      },
    },
  ],
};

// Display / headings — brand kit: Saira Condensed.
const saira = Saira_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-saira",
  display: "swap",
});

// Labels, numbers, "readout" bits — brand kit: JetBrains Mono.
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Body copy — brand kit: Barlow.
const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-barlow",
  display: "swap",
});

const title = "Paramarine Task Force — Arma 3 Milsim Unit";
// SERP-safe length (~155 chars), leads with the 10-year proof point.
const description =
  "10 years of serious, fun Arma 3 milsim. Rapid-deployment Marines with our own air wing, weekly ops, and real rank progression. Enlist today.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s · Paramarine Task Force",
  },
  description,
  applicationName: "Paramarine Task Force",
  keywords: [
    "Arma 3 milsim",
    "milsim unit",
    "Arma 3 unit",
    "Paramarines",
    "Paramarine Task Force",
    "join milsim",
    "US Marines milsim",
    "Arma 3 realism unit",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Paramarine Task Force",
    title,
    description,
    url: SITE_URL,
    images: [{ url: "/og.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og.jpg"],
  },
  // Pre-launch: NEXT_PUBLIC_NOINDEX=1 keeps the dev deployment out of search
  // engines so ranking only ever accrues to the real domain. Delete the env
  // var at cutover and redeploy.
  robots: process.env.NEXT_PUBLIC_NOINDEX
    ? { index: false, follow: false }
    : { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${saira.variable} ${jetbrains.variable} ${barlow.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg text-ink">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
