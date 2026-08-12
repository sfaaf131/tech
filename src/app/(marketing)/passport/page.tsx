import type { Metadata } from "next";
import { oauthReady } from "@/auth";
import { PassportGate } from "@/components/passport/passport-gate";
import { PageHero, Section } from "@/components/ui/page";

export const metadata: Metadata = {
  title: "Passport",
};

export default function PassportPage() {
  return (
    <>
      <PageHero
        kicker="Identidad Kondax"
        title="Passport: una puerta, dos validaciones."
        description="OAuth 2.0. Los programadores demuestran identidad técnica con GitHub o GitLab. Fundadores, inversores y corporativos demuestran identidad comercial con LinkedIn. Sin esa validación no hay marketplace, equity ni consola."
      />
      <Section>
        <PassportGate oauth={oauthReady} />
      </Section>
    </>
  );
}
