import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact/contact-form";
import { PageHero, Section } from "@/components/ui/page";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Habla con Kondax para incubar, armar una célula o revisar un ROI corporativo.",
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        kicker="Conversación"
        title="Cuéntanos el problema. Armamos la célula o la incubación."
        description={`Emprendedores, pymes, corporaciones y banca. Si ya sellaste un cotizador o un ROI, pégalo aquí. También puedes escribir a ${site.email}.`}
      />
      <Section>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4 text-sm leading-7 text-mist">
            <p>Qué pasa después del mensaje:</p>
            <ul className="space-y-3 text-paper">
              <li>1. Validamos identidad con Passport cuando corresponde.</li>
              <li>2. Cruzamos el alcance con la matriz de la fábrica.</li>
              <li>3. Proponemos SaaS, horas o sweat equity — no un combo opaco.</li>
            </ul>
          </div>
          <Suspense fallback={<p className="text-mist">Cargando formulario…</p>}>
            <ContactForm />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
