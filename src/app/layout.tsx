import type { Metadata, Viewport } from "next";
import { Geist_Mono, Space_Grotesk } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const space = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name}.tech — ${site.tagline}`,
    template: `%s · ${site.name}.tech`,
  },
  description: site.description,
  applicationName: "Kondax",
  keywords: [
    "Kondax",
    "factoría de software",
    "células de ingeniería",
    "process mining",
    "BPM",
    "agentes de IA",
    "RPA",
    "sweat equity",
    "venture studio",
  ],
  openGraph: {
    title: `${site.name}.tech`,
    description: site.description,
    url: site.url,
    siteName: "Kondax.tech",
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name}.tech`,
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
    <html
      lang="es"
      className={`${space.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-paper">{children}</body>
    </html>
  );
}
