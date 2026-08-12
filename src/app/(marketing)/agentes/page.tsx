import type { Metadata } from "next";
import { AgentStudio } from "@/components/agents/agent-studio";
import { PageHero, Section } from "@/components/ui/page";
import { grokModel } from "@/lib/agents";

export const metadata: Metadata = {
  title: "Agentes",
  description: `Tres agentes Kondax con ${grokModel}: cofundador, célula de ingeniería y cumplimiento.`,
};

export default function AgentesPage() {
  return (
    <>
      <PageHero
        kicker={`Motor ${grokModel}`}
        title="Agentes que estructuran, diseñan y controlan."
        description="Cofundador para incubar. Célula para armar el alcance técnico. Cumplimiento para banca y RegTech. Los tres corren sobre Grok 4.6, con supervisión humana y bitácora."
      />
      <Section>
        <AgentStudio />
      </Section>
    </>
  );
}
