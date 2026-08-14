import assert from "node:assert/strict";
import { allowRequest } from "../src/lib/rate-limit";
import { experimentBySlug, experiments, openExperiments } from "../src/lib/lab";
import { noteBySlug, notes } from "../src/lib/notes";
import {
  cooperateIntents,
  cooperateSchema,
  isEmptyGreeting,
  isHoneypot,
  isTooFast,
  parseJsonObject,
} from "../src/lib/schemas";
import { bannedOfferCopy, nav, site } from "../src/lib/site";
import { saveCooperation } from "../src/lib/store";

assert.equal(site.url, "https://kondax.tech");
assert.equal(site.email, "team@kondax.tech");
assert.equal(site.robotsIndex, true);
assert.equal(nav.length, 3);
assert.equal(nav[0]?.href, "/experimentos");
assert.equal(nav[2]?.href, "/cooperar");

assert.equal(experiments.length, 2);
assert.equal(new Set(experiments.map((item) => item.slug)).size, 2);
assert.ok(experimentBySlug("este-sitio"));
assert.ok(experimentBySlug("la-puerta"));
assert.equal(experimentBySlug("missing"), undefined);
assert.equal(openExperiments().length, 2);

assert.equal(notes.length, 3);
assert.equal(new Set(notes.map((item) => item.slug)).size, 3);
assert.ok(noteBySlug("se-borro-la-factory"));
assert.ok(noteBySlug("kursox-no-es-esto"));
assert.ok(noteBySlug("en-blanco-a-proposito"));

const publicText = [
  site.tagline,
  site.description,
  ...experiments.flatMap((item) => [item.title, item.summary, item.open, ...item.body]),
  ...notes.flatMap((item) => [item.title, item.summary, ...item.body]),
]
  .join("\n")
  .toLowerCase();

for (const banned of bannedOfferCopy) {
  assert.equal(publicText.includes(banned), false, `public copy still has "${banned}"`);
}

assert.deepEqual([...cooperateIntents], ["entrar", "nota", "proponer"]);

const good = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "entrar",
  experiment: "este-sitio",
  message: "Vi este sitio. Puedo revisar la copy del taller y devolver notas concretas sobre fricción.",
});
assert.equal(good.success, true, "valid cooperate payload should pass");

const emptyLink = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "nota",
  experiment: "",
  message: "La home se entiende. El footer podría repetir que no es una agencia.",
  link: "",
});
assert.equal(emptyLink.success, true);
if (emptyLink.success) {
  assert.equal(emptyLink.data.link, undefined);
  assert.equal(emptyLink.data.experiment, undefined);
}

const empty = cooperateSchema.safeParse({});
assert.equal(empty.success, false);
if (!empty.success) {
  const fields = empty.error.flatten().fieldErrors;
  for (const field of ["name", "email", "intent", "message"] as const) {
    const message = fields[field]?.[0];
    assert.ok(message, `${field} should have an error`);
    assert.equal(
      /expected|received|invalid_type|invalid_value|invalid_enum/i.test(message),
      false,
      `${field} should fail in Spanish, got: ${message}`,
    );
  }
}

const needsExperiment = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "entrar",
  message: "Quiero entrar pero no dije a cuál experimento del lab está abierto.",
});
assert.equal(needsExperiment.success, false);
if (!needsExperiment.success) {
  const message = needsExperiment.error.flatten().fieldErrors.experiment?.[0];
  assert.ok(message);
  assert.match(message, /experimento/i);
}

const greeting = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "proponer",
  message: "Hola, conectemos y veamos si podemos hacer algo juntos pronto.",
});
assert.equal(greeting.success, false);
if (!greeting.success) {
  assert.match(greeting.error.flatten().fieldErrors.message?.[0] ?? "", /objeto|saludo/i);
}

assert.equal(isEmptyGreeting("hola"), true);
assert.equal(isEmptyGreeting("conectemos"), true);
assert.equal(
  isEmptyGreeting("Vi la puerta. El select de experimento no se entiende en el celular."),
  false,
);

const badEmail = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "no-es-correo",
  intent: "nota",
  message: "Quiero dejar una corrección concreta sobre el formulario de cooperar.",
});
assert.equal(badEmail.success, false);
if (!badEmail.success) {
  const message = badEmail.error.flatten().fieldErrors.email?.[0];
  assert.ok(message);
  assert.equal(/expected|received|invalid_type/i.test(message), false);
}

const badIntent = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "factory",
  message: "Quiero abrir un experimento de bitácora para un flujo real de pymes.",
});
assert.equal(badIntent.success, false);

assert.equal(isHoneypot({ company_website: "https://spam.test" }), true);
assert.equal(isHoneypot({ sitio_web: "x" }), true);
assert.equal(isHoneypot({ company_website: "   " }), false);
assert.equal(parseJsonObject(null), null);
assert.equal(parseJsonObject(["x"]), null);
assert.ok(parseJsonObject({ name: "Ana" }));

const now = Date.now();
assert.equal(isTooFast({ t: String(now - 500) }, now), true);
assert.equal(isTooFast({ t: String(now - 4000) }, now), false);

const table = new Map<string, number[]>();
for (let index = 0; index < 5; index += 1) {
  assert.equal(allowRequest(table, "a", 1000 + index), true);
}
assert.equal(allowRequest(table, "a", 1006), false);
assert.equal(allowRequest(table, "b", 1006), true);
assert.equal(allowRequest(table, "a", 1000 + 10 * 60 * 1000 + 1), true);

const previous = process.env.DATABASE_URL;
delete process.env.DATABASE_URL;
const stored = saveCooperation({
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "nota",
  message: "Una nota precisa para comprobar que el store no finge persistencia.",
});
assert.equal(stored.stored, "pending");
if (previous) process.env.DATABASE_URL = previous;

console.log("ok");
