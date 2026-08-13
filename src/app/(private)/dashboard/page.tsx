import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { projectsFor } from "@/lib/portfolio";
import { SprintBoard } from "@/components/product/sprint-board";
import { Card, Kicker, Status } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  const portal = session?.user.portal ?? "b2b";
  const projects = projectsFor(portal);
  const current = projects[0];
  const done = current?.sprints.filter((item) => item.status === "hecho").length ?? 0;
  const total = current?.sprints.length ?? 1;
  const progress = Math.round((done / total) * 100);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Kicker>{portal === "startup" ? "Vista socio" : "Vista cliente B2B"}</Kicker>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Hola{session?.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}.
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-mist">
            {portal === "startup"
              ? "Avance técnico, hitos de software y entregables del acuerdo de sweat equity."
              : "Sprints, horas de célula y entregables del proyecto en curso."}
          </p>
        </div>
        <Status tone="live">{current?.status}</Status>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-xs font-medium tracking-[0.14em] text-copper uppercase">Avance</p>
          <p className="mt-3 text-3xl font-semibold">{progress}%</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-3">
            <div className="h-full bg-paper" style={{ width: `${progress}%` }} />
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium tracking-[0.14em] text-copper uppercase">
            {portal === "startup" ? "Equity" : "Célula"}
          </p>
          <p className="mt-3 text-sm leading-6">{portal === "startup" ? current?.equity : current?.cell}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-medium tracking-[0.14em] text-copper uppercase">
            {portal === "startup" ? "Proyecto" : "Horas del mes"}
          </p>
          <p className="mt-3 text-3xl font-semibold">
            {portal === "startup" ? current?.name : (current?.hoursMonth ?? "—")}
          </p>
        </Card>
      </div>

      {current ? (
        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tablero</h2>
            <Link href="/proyectos" className="text-sm text-mist hover:text-paper">
              Ver detalle →
            </Link>
          </div>
          <SprintBoard project={current} />
        </div>
      ) : null}
    </div>
  );
}
