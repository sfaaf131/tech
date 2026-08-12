import Link from "next/link";
import { Logo } from "@/components/brand/logo";

export default function NotFound() {
  return (
    <div className="grid-bg flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo />
      <p className="mt-10 font-mono text-[11px] tracking-[0.22em] text-copper uppercase">
        404
      </p>
      <h1 className="font-display mt-4 text-4xl">Esta ruta no existe en Kondax.</h1>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link href="/" className="rounded-full bg-signal px-5 py-2.5 text-sm text-signal-ink">
          Volver al inicio
        </Link>
        <Link href="/contacto" className="rounded-full border border-line px-5 py-2.5 text-sm">
          Contacto
        </Link>
      </div>
    </div>
  );
}
