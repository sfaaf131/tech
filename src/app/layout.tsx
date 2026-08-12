import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import { site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
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
    "incubadora",
    "células de ingeniería",
    "fábrica de software",
    "RegTech",
    "KYC",
    "Open Banking",
    "agentes de IA",
  ],
  openGraph: {
    title: `${site.name}.tech`,
    description: site.description,
    url: site.url,
    siteName: "Kondax.tech",
    locale: "es_CL",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-ink text-paper">{children}</body>
    </html>
  );
}
