import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { projectsFor } from "@/lib/portfolio";
import { Card, Kicker } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  const portal = session?.user.portal ?? "b2b";
  const projects = projectsFor(portal);
  const current = projects[0];

  return (
    <div>
      <Kicker>{portal === "startup" ? "Vista socio" : "Vista cliente B2B"}</Kicker>
      <h1 className="font-display mt-3 text-3xl md:text-4xl">Resumen del engagement.</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-mist">
        {portal === "startup"
          ? "Monitoreo de avance técnico, hitos de software y entregables del acuerdo de sweat equity."
          : "Seguimiento de sprints, horas de célula y entregables del proyecto en curso."}
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="font-mono text-[11px] tracking-[0.16em] text-copper uppercase">Estado</p>
          <p className="font-display mt-3 text-2xl">{current?.status ?? "—"}</p>
        </Card>
        <Card>
          <p className="font-mono text-[11px] tracking-[0.16em] text-copper uppercase">
            {portal === "startup" ? "Equity" : "Célula"}
          </p>
          <p className="mt-3 text-sm leading-6 text-paper">
            {portal === "startup" ? current?.equity : current?.cell}
          </p>
        </Card>
        <Card>
          <p className="font-mono text-[11px] tracking-[0.16em] text-copper uppercase">
            {portal === "startup" ? "Proyecto" : "Horas del mes"}
          </p>
          <p className="font-display mt-3 text-2xl">
            {portal === "startup" ? current?.name : (current?.hoursMonth ?? "—")}
          </p>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
          <h2 className="font-display text-2xl">{current?.name}</h2>
          <p className="mt-3 text-sm leading-6 text-mist">{current?.summary}</p>
          <Link href="/proyectos" className="mt-6 inline-block text-sm text-signal hover:text-paper">
            Ver sprints y entregables →
          </Link>
        </Card>
      </div>
    </div>
  );
}
