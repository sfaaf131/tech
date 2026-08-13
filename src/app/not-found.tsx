import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo />
      <p className="mt-10 text-xs font-medium tracking-[0.14em] text-copper uppercase">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Esta ruta no existe en Kondax.</h1>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-lg bg-signal px-4 py-2.5 text-sm font-medium text-signal-ink">
          Volver al inicio
        </Link>
        <Link href="/enterprise" className="rounded-lg border border-line px-4 py-2.5 text-sm">
          Enterprise
        </Link>
      </div>
    </div>
  );
}
