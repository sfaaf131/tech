import { sealEvent, verifyChain } from "../src/lib/audit";
import { applySchema, contactSchema } from "../src/lib/schemas";
import { contactNeeds, needIds, services } from "../src/lib/services";
import { projectsFor } from "../src/lib/portfolio";

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

const application = applySchema.safeParse({
  name: "Luis Soto",
  email: "luis@startup.cl",
  company: "RutaSur",
  idea: "Marketplace de fletes para pymes del sur de Chile con tracking en tiempo real.",
  market: "",
  traction: "",
});

if (!application.success) {
  throw new Error("apply schema should accept a founder submission");
}

if (application.data.market !== undefined || application.data.traction !== undefined) {
  throw new Error("empty optional apply fields should become undefined");
}

if (projectsFor("b2b").length < 1 || projectsFor("startup").length < 1) {
  throw new Error("each portal kind should have a demo project");
}

const first = sealEvent("test", { ok: true });
const second = sealEvent("test.2", { ok: true }, first.hash);
if (!verifyChain([first, second])) {
  throw new Error("audit chain should verify");
}

console.log("kondax checks ok", { lead: lead.data.need, apply: application.data.company });
