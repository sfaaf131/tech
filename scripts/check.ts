import { sealEvent, verifyChain } from "../src/lib/audit";
import { applySchema, contactSchema, isHoneypot, parseJsonObject } from "../src/lib/schemas";
import { contactNeeds, deliverySteps, needIds, services } from "../src/lib/services";
import { projectsFor, safePortalPath } from "../src/lib/portfolio";

if (needIds.length !== services.length + 1) {
  throw new Error("needIds should be the service catalog plus 'otro'");
}

if (needIds[needIds.length - 1] !== "otro") {
  throw new Error("the last need id should be 'otro'");
}

for (const [index, service] of services.entries()) {
  if (needIds[index] !== service.id) {
    throw new Error(`needIds[${index}] should match services[${index}].id`);
  }
}

if (contactNeeds.length !== needIds.length) {
  throw new Error("contact form options should match needIds");
}

const lead = contactSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@empresa.cl",
  company: "Empresa Sur",
  need: "flujo",
  message: "Necesitamos mapear el back-office de cobranza y automatizar el cuello de botella.",
});

if (!lead.success) {
  throw new Error("contact schema should accept a corporate lead");
}

const missing = contactSchema.safeParse({});
if (missing.success) {
  throw new Error("contact schema should reject an empty payload");
}

const missingFields = missing.error.flatten().fieldErrors;
for (const field of ["name", "email", "company", "need", "message"] as const) {
  const message = missingFields[field]?.[0];
  if (!message || /expected|received|invalid_type/i.test(message)) {
    throw new Error(`${field} should fail with a Spanish message, got: ${message ?? "(none)"}`);
  }
}

const badNeed = contactSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@empresa.cl",
  company: "Empresa Sur",
  need: "web3",
  message: "Necesitamos automatizar el back-office de cobranza.",
});
if (badNeed.success) {
  throw new Error("contact schema should reject a need that is not in the catalog");
}

const badNeedMessage = badNeed.error.flatten().fieldErrors.need?.[0];
if (!badNeedMessage || /expected|received|invalid_type|invalid_value|invalid_enum/i.test(badNeedMessage)) {
  throw new Error(`need should fail in Spanish, got: ${badNeedMessage ?? "(none)"}`);
}

const emptyRole = contactSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@empresa.cl",
  company: "Empresa Sur",
  role: "",
  need: "flujo",
  message: "Necesitamos mapear el back-office de cobranza y automatizar el cuello.",
});
if (!emptyRole.success || emptyRole.data.role !== undefined) {
  throw new Error("empty optional contact role should become undefined");
}

const application = applySchema.safeParse({
  name: "Luis Soto",
  email: "luis@startup.cl",
  company: "RutaSur",
  idea: "Marketplace de fletes para pymes del sur de Chile con tracking en tiempo real.",
  market: "Logística de pymes en el sur de Chile",
  traction: "Tres operadores con carta de intención firmada.",
  partner: "on",
});

if (!application.success) {
  throw new Error("apply schema should accept a founder submission");
}

const applyMissing = applySchema.safeParse({});
if (applyMissing.success) {
  throw new Error("apply schema should reject an empty payload");
}
const applyFields = applyMissing.error.flatten().fieldErrors;
for (const field of ["name", "email", "company", "idea", "market", "traction", "partner"] as const) {
  const message = applyFields[field]?.[0];
  if (!message || /expected|received|invalid_type/i.test(message)) {
    throw new Error(`${field} should fail with a Spanish message, got: ${message ?? "(none)"}`);
  }
}

if (parseJsonObject(null) !== null || parseJsonObject([]) !== null) {
  throw new Error("parseJsonObject should reject null and arrays");
}
if (!isHoneypot({ company_website: "https://spam.test" })) {
  throw new Error("filled honeypot should be detected");
}
if (isHoneypot({ company_website: " " }) || isHoneypot({ name: "Ana" })) {
  throw new Error("empty honeypot must not block a real lead");
}

if (safePortalPath("//evil.com") !== "/dashboard") {
  throw new Error("protocol-relative next should be rejected");
}
if (safePortalPath("/proyectos") !== "/proyectos") {
  throw new Error("/proyectos should be allowed");
}
if (safePortalPath("/acceso") !== "/dashboard") {
  throw new Error("login next should not loop on /acceso");
}

if (projectsFor("b2b").length < 1 || projectsFor("startup").length < 1) {
  throw new Error("each portal kind should have a demo project");
}

for (const kind of ["b2b", "startup"] as const) {
  const project = projectsFor(kind)[0];
  if (project.sprints.length !== deliverySteps.length) {
    throw new Error(`${kind} demo must follow the four delivery steps`);
  }
  for (const [index, step] of deliverySteps.entries()) {
    if (!project.sprints[index].name.includes(step.title)) {
      throw new Error(`${kind} sprint ${index} should be named after "${step.title}"`);
    }
  }
}

if (
  projectsFor("startup").some(
    (project) => project.hoursMonth != null || project.sprints.some((sprint) => sprint.hours != null),
  )
) {
  throw new Error("startup portal must not show hours or billing");
}

const first = sealEvent("test", { ok: true });
const second = sealEvent("test.2", { ok: true }, first.hash);
if (!verifyChain([first, second])) {
  throw new Error("audit chain should verify");
}

console.log("kondax checks ok", { lead: lead.data.need, apply: application.data.company });
