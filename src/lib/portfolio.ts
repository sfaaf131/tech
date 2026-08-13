export type PortalKind = "b2b" | "startup";

export type Sprint = {
  name: string;
  status: "hecho" | "en curso" | "siguiente";
  deliverable: string;
  hours?: number;
};

export type DemoProject = {
  id: string;
  name: string;
  kind: PortalKind;
  status: string;
  summary: string;
  cell?: string;
  equity?: string;
  hoursMonth?: number;
  sprints: Sprint[];
};

export const demoProjects: DemoProject[] = [
  {
    id: "onboarding-banca",
    name: "Motor de onboarding",
    kind: "b2b",
    status: "Sprint 3 de 6",
    summary:
      "Célula dedicada para un banco regional: KYC, expedientes y handoff al core. Horas medibles, evidencias por sprint.",
    cell: "Lead · 2 ingeniería · QA",
    hoursMonth: 142,
    sprints: [
      {
        name: "01 · Descubrimiento",
        status: "hecho",
        deliverable: "Mapa de proceso, riesgos y criterio de done.",
        hours: 48,
      },
      {
        name: "02 · Identidad",
        status: "hecho",
        deliverable: "Flujo de captura, validación documental y pistas de auditoría.",
        hours: 120,
      },
      {
        name: "03 · Orquestación",
        status: "en curso",
        deliverable: "Agente de análisis documental + RPA sobre el core legado.",
        hours: 142,
      },
      {
        name: "04 · Integración",
        status: "siguiente",
        deliverable: "API hacia el core y ambientes segregados.",
      },
    ],
  },
  {
    id: "logistica-pymes",
    name: "Plataforma de logística",
    kind: "startup",
    status: "MVP 70%",
    summary:
      "Kondax actúa como socio tecnológico. El fundador aporta industria; la célula construye producto y arquitectura de IA.",
    equity: "12% reservado a Kondax · hito 2 de 4",
    sprints: [
      {
        name: "Hito 1 · Fundación",
        status: "hecho",
        deliverable: "Identidad, arquitectura, diseño de producto y repositorio.",
      },
      {
        name: "Hito 2 · MVP operable",
        status: "en curso",
        deliverable: "Órdenes, tracking y panel del operador.",
      },
      {
        name: "Hito 3 · Automatización",
        status: "siguiente",
        deliverable: "Agente de ruteo y alertas operativas.",
      },
      {
        name: "Hito 4 · Escala",
        status: "siguiente",
        deliverable: "Pagos, SLA y despliegue productivo.",
      },
    ],
  },
];

export function projectsFor(kind: PortalKind) {
  return demoProjects.filter((project) => project.kind === kind);
}
