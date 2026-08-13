import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <Logo />
      <p className="mt-10 text-xs font-medium tracking-[0.14em] text-copper uppercase">404</p>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Esta ruta no existe en Kondax.</h1>
      <p className="mt-3 max-w-md text-sm leading-6 text-mist">
        El flujo sigue en inicio, Empresas o Fundadores.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button href="/">Volver al inicio</Button>
        <Button href="/enterprise" tone="ghost">
          Empresas
        </Button>
        <Button href="/startups" tone="ghost">
          Fundadores
        </Button>
      </div>
    </div>
  );
}
