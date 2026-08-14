import type { Metadata, Viewport } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import { Shell } from "@/components/layout/shell";
import { site } from "@/lib/site";
import "./globals.css";

const sans = Space_Grotesk({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.host} — ${site.tagline}`,
    template: `%s · ${site.host}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author }],
  creator: site.author,
  keywords: ["Kondax", "lab personal", "Agustín Saez", "Santiago", "experimentos"],
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    title: `${site.host} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.host,
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.host} — ${site.tagline}`,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#fcfcfc",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
