import type { Metadata } from "next";
import { Saira_Condensed, JetBrains_Mono, Barlow } from "next/font/google";
import "./globals.css";
import { SITE_URL, links } from "@/lib/config";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

// Organization schema for search engines (milsim-unit discovery).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Paramarine Task Force",
  alternateName: "Paramarines",
  url: SITE_URL,
  logo: `${SITE_URL}/brand/ptf-emblem-326w.png`,
  foundingDate: "2016",
  description:
    "A serious, fun, and immersive Arma 3 milsim unit — rapid-deployment Marines with weekly operations and structured training.",
  sameAs: [links.discord, links.steam, links.arma3units, links.patreon],
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
const description =
  "A serious, fun, and immersive Arma 3 milsim unit. WW2 Paramarines reimagined in a modern setting — rapid-deployment Marines with air support. Weekly operations, structured training, real camaraderie. Enlist today.";

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
  robots: { index: true, follow: true },
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
