import type { Metadata } from "next";
import Link from "next/link";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Beats — Marketplace de pistas",
  description: "Compra y vende beats por género. Habla directo con el productor.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <header className="site-header">
            <Link href="/" className="logo">
              Tech Beats
            </Link>
            <nav>
              <Link href="/login">Iniciar sesión</Link>
              <Link href="/registro">Registrarse</Link>
            </nav>
          </header>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
