import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { enterPortal } from "@/app/(private)/actions";
import { Button, Card, Kicker, Section } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

export default async function AccesoPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await auth();
  if (session?.user) {
    redirect("/dashboard");
  }
  const next = (await searchParams).next ?? "/dashboard";

  return (
    <Section className="max-w-3xl">
      <Kicker>Portal privado</Kicker>
      <h1 className="font-display mt-4 text-4xl md:text-5xl">Entra al dashboard Kondax.</h1>
      <p className="mt-4 max-w-xl text-mist leading-7">
        Vista cliente B2B: sprints, horas y entregables. Vista socio: avance técnico del
        producto y hitos del acuerdo de equity.
      </p>
      <Card className="mt-10">
        <form action={enterPortal} className="space-y-4">
          <input type="hidden" name="next" value={next} />
          <label className="block text-sm">
            Nombre
            <input name="name" className="field mt-2" placeholder="Cómo te llamamos en el portal" />
          </label>
          <fieldset>
            <legend className="text-sm">Tipo de portal</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              <label className="cursor-pointer">
                <input type="radio" name="portal" value="b2b" defaultChecked className="peer sr-only" />
                <span className="inline-block rounded-full border border-line px-3 py-1.5 text-sm peer-checked:border-signal peer-checked:text-signal">
                  Cliente B2B
                </span>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="portal" value="startup" className="peer sr-only" />
                <span className="inline-block rounded-full border border-line px-3 py-1.5 text-sm peer-checked:border-signal peer-checked:text-signal">
                  Socio / startup
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
