import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import { Shell } from "@/components/layout/shell";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Kondax — taller de Agustín Saez C.",
    template: "%s · Kondax",
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author }],
  creator: site.author,
  keywords: ["Kondax", "taller", "lab personal", "Agustín Saez", "Santiago", "experimentos"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kondax — taller de Agustín Saez C.",
    description: site.description,
    url: site.url,
    siteName: site.host,
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kondax — taller de Agustín Saez C.",
    description: site.description,
  },
  robots: {
    index: site.robotsIndex,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#fcfcfc",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.author,
  url: site.url,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Santiago",
    addressCountry: "CL",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  inLanguage: "es-CL",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-CL" className={sans.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
