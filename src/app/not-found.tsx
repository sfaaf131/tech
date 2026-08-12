import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid-bg flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-[11px] tracking-[0.22em] text-copper uppercase">
        404
      </p>
      <h1 className="font-display mt-4 text-4xl">Esta ruta no existe en Kondax.</h1>
      <Link href="/" className="mt-8 rounded-full bg-signal px-5 py-2.5 text-sm text-signal-ink">
        Volver al inicio
      </Link>
    </div>
  );
}
