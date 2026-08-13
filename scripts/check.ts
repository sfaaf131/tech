import { sealEvent, verifyChain } from "../src/lib/audit";
import { applySchema, contactSchema } from "../src/lib/schemas";
import { projectsFor } from "../src/lib/portfolio";

const lead = contactSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@empresa.cl",
  company: "Empresa Sur",
  need: "celulas",
  message: "Necesitamos automatizar el back-office de cobranza.",
});

if (!lead.success) {
  throw new Error("contact schema should accept a corporate lead");
}

const application = applySchema.safeParse({
  name: "Luis Soto",
  email: "luis@startup.cl",
  company: "RutaSur",
  idea: "Marketplace de fletes para pymes del sur de Chile con tracking en tiempo real.",
});

if (!application.success) {
  throw new Error("apply schema should accept a founder submission");
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
