import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { enterPortal } from "@/app/(private)/actions";
import { safePortalPath } from "@/lib/portfolio";
import { Button, Card, Kicker, Section } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

export default async function AccesoPage({ searchParams }: PageProps<"/acceso">) {
  const session = await auth();
  const next = safePortalPath((await searchParams).next);
  if (session?.user) {
    redirect(next);
  }

  return (
    <Section className="max-w-xl">
      <Kicker>Portal privado</Kicker>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight">Portal: horas, sprints e hitos.</h1>
      <p className="mt-4 leading-7 text-mist">
        Vista cliente B2B: sprints, horas y entregables. Vista socio: avance técnico y hitos del
        acuerdo de equity.
      </p>
      <Card className="mt-10">
        <form action={enterPortal} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <label className="block text-sm font-medium">
            Nombre
            <input
              name="name"
              className="field mt-2 font-normal"
              placeholder="Cómo te llamamos en el portal"
            />
          </label>
          <fieldset>
            <legend className="text-sm font-medium">Tipo de portal</legend>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <label className="cursor-pointer">
                <input type="radio" name="portal" value="b2b" defaultChecked className="peer sr-only" />
                <span className="flex min-h-11 items-center justify-center rounded-lg border border-line px-3 py-2.5 text-center text-sm font-normal peer-checked:border-paper peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-paper">
                  Cliente B2B
                </span>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="portal" value="startup" className="peer sr-only" />
                <span className="flex min-h-11 items-center justify-center rounded-lg border border-line px-3 py-2.5 text-center text-sm font-normal peer-checked:border-paper peer-checked:bg-paper peer-checked:text-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-3 peer-focus-visible:outline-paper">
                  Socio / fundador
                </span>
              </label>
            </div>
          </fieldset>
          <Button type="submit">Entrar</Button>
        </form>
      </Card>
    </Section>
  );
}
