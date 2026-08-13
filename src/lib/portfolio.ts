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

export const portalPaths = ["/dashboard", "/proyectos"] as const;
export type PortalPath = (typeof portalPaths)[number];

export function safePortalPath(value: unknown): PortalPath {
  if (typeof value !== "string") return "/dashboard";
  const path = value.split("?")[0];
  return (portalPaths as readonly string[]).includes(path) ? (path as PortalPath) : "/dashboard";
}

export const demoProjects: DemoProject[] = [
  {
    id: "onboarding-banca",
    name: "Motor de onboarding",
    kind: "b2b",
    status: "Paso 3 de 4 · Poner inteligencia",
    summary:
      "Célula sobre un flujo de onboarding: mapa, RPA, agente documental y equipo que se queda con el dominio. Horas de capacidad, no un estado de cuenta.",
    cell: "Lead · 2 ingeniería · QA",
    hoursMonth: 142,
    sprints: [
      {
        name: "01 · Mapear el flujo",
        status: "hecho",
        deliverable: "Mapa as-is de KYC, dueños, tiempos y criterio de done.",
        hours: 48,
      },
      {
        name: "02 · Automatizar lo repetible",
        status: "hecho",
        deliverable: "RPA de captura y validación documental sobre el core legado.",
        hours: 120,
      },
      {
        name: "03 · Poner inteligencia",
        status: "en curso",
        deliverable: "Agente de análisis de expedientes con handoff a un humano.",
        hours: 142,
      },
      {
        name: "04 · Instalar la célula",
        status: "siguiente",
        deliverable: "Lead + ingeniería + QA en el dominio; evidencias en el portal.",
      },
    ],
  },
  {
    id: "logistica-pymes",
    name: "Plataforma de logística",
    kind: "startup",
    status: "Hito 2 de 4 · Automatizar lo repetible",
    summary:
      "Kondax entra como socio técnico. El fundador aporta industria; la célula construye el producto con el mismo método que en empresas.",
    equity: "12% reservado a Kondax · hito 2 de 4",
    sprints: [
      {
        name: "01 · Mapear el flujo",
        status: "hecho",
        deliverable: "Identidad, arquitectura y mapa del operador logístico.",
      },
      {
        name: "02 · Automatizar lo repetible",
        status: "en curso",
        deliverable: "Órdenes, tracking y panel del operador — MVP operable.",
      },
      {
        name: "03 · Poner inteligencia",
        status: "siguiente",
        deliverable: "Agente de ruteo y alertas; una persona supervisa.",
      },
      {
        name: "04 · Instalar la célula",
        status: "siguiente",
        deliverable: "Equipo senior queda con el producto. Hito de equity desbloqueado.",
      },
    ],
  },
];

export function projectsFor(kind: PortalKind) {
  return demoProjects.filter((project) => project.kind === kind);
}
