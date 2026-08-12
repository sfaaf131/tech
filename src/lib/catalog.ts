export const audiences = [
  {
    id: "emprendedor",
    label: "Emprendedor independiente",
    summary:
      "Incubadora, agentes de IA y marketplace de socios para pasar de idea a compañía.",
    href: "/incubadora",
  },
  {
    id: "pyme",
    label: "Pyme",
    summary:
      "Consultoría tecnológica y células de producto para digitalizar operación sin armar un área de TI.",
    href: "/enterprise",
  },
  {
    id: "enterprise",
    label: "Gran corporación",
    summary:
      "BPM, process mining, automatización e integración con el stack existente.",
    href: "/enterprise",
  },
  {
    id: "banca",
    label: "Banca y finanzas",
    summary:
      "Motores de riesgo, RegTech, KYC/AML, Open Banking y controles de auditoría.",
    href: "/enterprise",
  },
] as const;

export type AudienceId = (typeof audiences)[number]["id"];

export const services = [
  {
    id: "web",
    name: "Desarrollo web",
    group: "producto",
    hours: 320,
    blurb: "Plataformas, portales y sistemas transaccionales con Next.js.",
  },
  {
    id: "mobile",
    name: "Desarrollo móvil",
    group: "producto",
    hours: 400,
    blurb: "Apps nativas o multiplataforma con diseño de sesión y biometría.",
  },
  {
    id: "ecommerce",
    name: "E-commerce avanzado",
    group: "producto",
    hours: 480,
    blurb: "Catálogo, pagos, OMS, suscripciones y operaciones de fulfillment.",
  },
  {
    id: "rpa",
    name: "Automatización de procesos (RPA)",
    group: "automation",
    hours: 200,
    blurb: "Bots, orquestación y handoff humano para back-office.",
  },
  {
    id: "agents",
    name: "Agentes de IA autónomos",
    group: "automation",
    hours: 280,
    blurb: "Agentes autónomos con Grok 4.6, herramientas, memoria y supervisión humana.",
  },
  {
    id: "web3",
    name: "Web3",
    group: "emerging",
    hours: 360,
    blurb: "Wallets, contratos, identidad on-chain e integraciones híbridas.",
  },
  {
    id: "spatial",
    name: "Computación espacial",
    group: "emerging",
    hours: 500,
    blurb: "Experiencias 3D, visionado industrial y gemelos digitales.",
  },
  {
    id: "bpm",
    name: "BPM y flujos corporativos",
    group: "enterprise",
    hours: 360,
    blurb: "Modelado, ejecución y gobierno de procesos de punta a punta.",
  },
  {
    id: "mining",
    name: "Process mining",
    group: "enterprise",
    hours: 240,
    blurb: "Descubrimiento de cuellos de botella desde logs reales.",
  },
  {
    id: "risk",
    name: "Motores de riesgo con ML",
    group: "banking",
    hours: 400,
    blurb: "Scoring, monitoreo y explicabilidad para crédito y fraude.",
  },
  {
    id: "regtech",
    name: "RegTech y cumplimiento",
    group: "banking",
    hours: 440,
    blurb: "Políticas, evidencias, reportes regulatorios y controles.",
  },
  {
    id: "kyc",
    name: "KYC / AML e identidad",
    group: "banking",
    hours: 380,
    blurb: "Onboarding, screening, casos de alerta y pistas de auditoría.",
  },
  {
    id: "openbanking",
    name: "Open Banking",
    group: "banking",
    hours: 420,
    blurb: "APIs, consentimientos, agregación de cuentas y PSD2-like.",
  },
] as const;

export type ServiceId = (typeof services)[number]["id"];

export const serviceGroups = [
  { id: "producto", label: "Producto digital" },
  { id: "automation", label: "Automatización e IA" },
  { id: "emerging", label: "Tecnologías emergentes" },
  { id: "enterprise", label: "Flujos corporativos" },
  { id: "banking", label: "Banca y regulación" },
] as const;

export const scopes = [
  { id: "mvp", label: "MVP", factor: 0.55, weeksHint: 6 },
  { id: "producto", label: "Producto", factor: 1, weeksHint: 12 },
  { id: "plataforma", label: "Plataforma", factor: 1.65, weeksHint: 24 },
] as const;

export type ScopeId = (typeof scopes)[number]["id"];

export const timelines = [
  { id: "4", label: "4 semanas", weeks: 4, factor: 1.35 },
  { id: "8", label: "8 semanas", weeks: 8, factor: 1.1 },
  { id: "12", label: "12 semanas", weeks: 12, factor: 1 },
  { id: "24", label: "24 semanas", weeks: 24, factor: 0.92 },
] as const;

export type TimelineId = (typeof timelines)[number]["id"];

export const audienceRateUsd: Record<AudienceId, number> = {
  emprendedor: 55,
  pyme: 75,
  enterprise: 95,
  banca: 125,
};

export const audienceFactor: Record<AudienceId, number> = {
  emprendedor: 0.85,
  pyme: 1,
  enterprise: 1.25,
  banca: 1.45,
};

export const saasPlans = [
  {
    id: "launch",
    name: "Launch",
    priceClp: 19990,
    cadence: "mes",
    audience: "Emprendedores y solopreneurs",
    points: [
      "Agente Cofundador con Grok 4.6 para estructurar el negocio",
      "Hasta 3 iniciativas activas",
      "Marketplace de socios en modo lectura",
      "Passport con validación comercial",
    ],
  },
  {
    id: "studio",
    name: "Studio",
    priceClp: 49990,
    cadence: "mes",
    audience: "Equipos que ya operan",
    points: [
      "Todo Launch",
      "Matching de socios y células",
      "Cotizaciones y sprints de fábrica con tarifa preferente",
      "Sala de equity para co-creación",
    ],
  },
  {
    id: "cell",
    name: "Cell",
    priceClp: 189000,
    cadence: "mes",
    audience: "Pymes con roadmap continuo",
    points: [
      "Retainer de célula (lead + ingeniería)",
      "Backlog, QA y despliegue",
      "Automatizaciones e integraciones",
      "Reportes de horas y auditoría de cambios",
    ],
  },
  {
    id: "sovereign",
    name: "Sovereign",
    priceClp: null,
    cadence: "a medida",
    audience: "Corporaciones y banca",
    points: [
      "Células dedicadas y residencia de datos",
      "BPM, riesgo, KYC/AML y Open Banking",
      "Controles SOC 2 / ISO 27001",
      "Logs inmutables y evidencias de cumplimiento",
    ],
  },
] as const;

export const roles = [
  {
    id: "programador",
    label: "Programador",
    validation: "technical" as const,
    providers: ["github", "gitlab"],
    requirement:
      "Validación técnica obligatoria con GitHub o GitLab. Revisamos identidad de ingeniería, no solo un correo.",
  },
  {
    id: "fundador",
    label: "Fundador",
    validation: "commercial" as const,
    providers: ["linkedin"],
    requirement:
      "Validación comercial con LinkedIn. El Passport confirma trayectoria y red antes de abrir marketplace y equity.",
  },
  {
    id: "inversor",
    label: "Inversor",
    validation: "commercial" as const,
    providers: ["linkedin"],
    requirement:
      "Validación comercial con LinkedIn para deal-flow, salas de equity y diligencia de proyectos co-creados.",
  },
  {
    id: "corporativo",
    label: "Corporativo / banca",
    validation: "commercial" as const,
    providers: ["linkedin"],
    requirement:
      "LinkedIn corporativo y, en producción, dominio de correo verificado. Acceso a ROI, células y controles.",
  },
] as const;

export type RoleId = (typeof roles)[number]["id"];
