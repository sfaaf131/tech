import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/auth";
import { projectsFor } from "@/lib/portfolio";
import { deliverySteps } from "@/lib/services";
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
  const activeIndex = Math.max(current?.sprints.findIndex((item) => item.status === "en curso") ?? 0, 0);
  const activeStep = deliverySteps[activeIndex];

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
              ? "El mismo método que en empresas: mapear, automatizar, inteligencia, célula. Los hitos desbloquean participación, no una factura."
              : "Sprints de la célula sobre el flujo. Horas de capacidad y entregable, no un estado de cuenta."}
          </p>
        </div>
        <Status tone="live">{current?.status}</Status>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <p className="text-[0.8125rem] font-medium tracking-[0.12em] text-copper uppercase">Avance</p>
          <p className="mt-3 text-3xl font-semibold tabular-nums">{progress}%</p>
          <p className="mt-1 text-xs text-mist">
            {done} de {total} pasos del método
          </p>
          <div
            className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-3"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Avance del proyecto"
          >
            <div className="h-full bg-paper" style={{ width: `${progress}%` }} />
          </div>
        </Card>
        <Card className="p-5">
          <p className="text-[0.8125rem] font-medium tracking-[0.12em] text-copper uppercase">
            {portal === "startup" ? "Equity" : "Célula"}
          </p>
          <p className="mt-3 text-sm leading-6">
            {portal === "startup" ? current?.equity : current?.cell}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-[0.8125rem] font-medium tracking-[0.12em] text-copper uppercase">
            {portal === "startup" ? "Hito en curso" : "Horas de célula (mes)"}
          </p>
          {portal === "startup" ? (
            <>
              <p className="mt-3 text-3xl font-semibold tabular-nums">
                {activeIndex + 1}/{total}
              </p>
              <p className="mt-1 text-xs text-mist">{activeStep?.title}</p>
            </>
          ) : (
            <>
              <p className="mt-3 text-3xl font-semibold tabular-nums">{current?.hoursMonth ?? "—"}</p>
              <p className="mt-1 text-xs text-mist">Capacidad cargada, no una factura</p>
            </>
          )}
        </Card>
      </div>

      {current ? (
        <ol className="mt-8 grid gap-3 sm:grid-cols-4">
          {deliverySteps.map((step, index) => {
            const sprint = current.sprints[index];
            return (
              <li key={step.n} className="rounded-xl border border-line bg-ink-2 p-4">
                <p className="text-xs font-medium text-copper">{step.n}</p>
                <p className="mt-1 text-sm font-medium">{step.title}</p>
                {sprint ? <p className="mt-2 text-xs text-mist">{sprint.status}</p> : null}
              </li>
            );
          })}
        </ol>
      ) : null}

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
