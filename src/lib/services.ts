export const deliverySteps = [
  {
    n: "01",
    title: "Mapear el flujo",
    text: "Process mining y BPM: cómo se trabaja de verdad, dónde se pierde tiempo y qué sistemas no se hablan. El mapa es el primer entregable.",
  },
  {
    n: "02",
    title: "Automatizar lo repetible",
    text: "RPA y orquestación sobre lo que ya existe. El bot no rediseña la empresa: quita la carga manual del proceso que ya medimos.",
  },
  {
    n: "03",
    title: "Poner inteligencia",
    text: "Agentes y analítica donde hay decisión, documento o excepción. Una persona supervisa; el agente no inventa el flujo.",
  },
  {
    n: "04",
    title: "Instalar la célula",
    text: "Un equipo senior se queda con el dominio: producto, integración y operación. Horas, sprint o proyecto. Sin headcount permanente inflado.",
  },
] as const;

export const services = [
  {
    id: "flujo",
    n: "01",
    name: "Process mining y BPM",
    tag: "Diagnóstico",
    blurb:
      "Primero el flujo real: cuellos de botella, handoffs y sistemas. Sin mapa no hay robot ni agente que valga.",
    outcomes: [
      "Mapa as-is y to-be con dueños de cada paso",
      "Tiempos, retrabajo y excepciones medidos",
      "Criterio de done para el primer sprint de automatización",
    ],
  },
  {
    id: "rpa",
    n: "02",
    name: "RPA y orquestación",
    tag: "Automatización",
    blurb:
      "Bots sobre lo que ya existe. Eliminamos tareas manuales repetitivas sin reescribir el core de un día para otro.",
    outcomes: [
      "Robots en back-office, finanzas u operaciones",
      "Colas, reintentos y control de excepciones",
      "Bitácora auditable de cada ejecución",
    ],
  },
  {
    id: "agentes",
    n: "03",
    name: "Agentes de IA",
    tag: "Inteligencia",
    blurb:
      "Atención, análisis documental y procesamiento de datos. El agente trabaja el flujo; una persona supervisa.",
    outcomes: [
      "Clasificación y extracción sobre expedientes reales",
      "Atención o triaje con handoff a un humano",
      "Guardrails, evidencias y criterio de escalamiento",
    ],
  },
  {
    id: "analitica",
    n: "04",
    name: "Analítica operativa",
    tag: "Decisión",
    blurb:
      "Métricas del proceso para decidir dónde automatizar después. No un dashboard decorativo.",
    outcomes: [
      "Tablero del flujo: SLA, cola y cuellos de botella",
      "Alertas cuando el proceso se desvía",
      "Prioridad del siguiente sprint con números, no con ocurrencias",
    ],
  },
  {
    id: "integracion",
    n: "05",
    name: "Integración y modernización",
    tag: "Sistemas",
    blurb:
      "APIs, legado y nube. Conectamos lo nuevo con los sistemas que ya mueven el negocio.",
    outcomes: [
      "Contratos de API y ambientes segregados",
      "Puentes al core, ERP o CRM sin apagarlos",
      "Deuda técnica atacada por tramos, no por big bang",
    ],
  },
  {
    id: "celulas",
    n: "06",
    name: "Células de ingeniería",
    tag: "Equipo",
    blurb:
      "Lead, frontend, backend, IA y QA. Un equipo senior que se queda con el dominio, no un ticket rotativo.",
    outcomes: [
      "Composición visible: roles, horas y capacidad",
      "Sprints con entregable y evidencia en el portal",
      "Continuidad del conocimiento, no rotación de contratistas",
    ],
  },
  {
    id: "producto",
    n: "07",
    name: "Producto web y móvil",
    tag: "Interfaz",
    blurb:
      "Portales, apps y MVPs. La misma célula que automatiza también construye el producto que el cliente usa.",
    outcomes: [
      "Portales de cliente, operador o socio",
      "Apps transaccionales listas para crecer",
      "MVP de founder con la misma fábrica B2B",
    ],
  },
] as const;

export const needIds = [
  "flujo",
  "rpa",
  "agentes",
  "analitica",
  "integracion",
  "celulas",
  "producto",
  "otro",
] as const;

export type NeedId = (typeof needIds)[number];
export type ServiceId = (typeof services)[number]["id"];

export const contactNeeds = [
  ...services.map((service) => ({ id: service.id, label: service.name })),
  { id: "otro" as const, label: "Otra necesidad" },
];

export const commercialTerms = [
  {
    title: "Por hora",
    body: "Célula con capacidad mensual. Sirve cuando el flujo ya está claro y el trabajo es continuo.",
  },
  {
    title: "Por sprint",
    body: "Dos a cuatro semanas, un entregable y un criterio de done. El modo habitual para el primer mapa o el primer bot.",
  },
  {
    title: "Por proyecto",
    body: "Alcance cerrado: un proceso de punta a punta, un producto o una modernización. Precio y hitos en contrato.",
  },
] as const;
