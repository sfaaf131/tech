import assert from "node:assert/strict";
import { experimentBySlug, experiments, openExperiments } from "../src/lib/lab";
import { noteBySlug, notes } from "../src/lib/notes";
import {
  cooperateSchema,
  isHoneypot,
  parseJsonObject,
} from "../src/lib/schemas";
import { bannedPublicCopy, site } from "../src/lib/site";

assert.equal(site.url, "https://kondax.tech");
assert.equal(site.email, "team@kondax.tech");
assert.match(site.tagline.toLowerCase(), /lab/);

const slugs = experiments.map((item) => item.slug);
assert.equal(new Set(slugs).size, slugs.length, "experiment slugs must be unique");
assert.ok(openExperiments().length >= 1, "the lab needs at least one open experiment");
assert.ok(experimentBySlug("este-sitio"), "the site itself should be an experiment");
assert.equal(experimentBySlug("missing"), undefined);

const noteSlugs = notes.map((item) => item.slug);
assert.equal(new Set(noteSlugs).size, noteSlugs.length, "note slugs must be unique");
assert.ok(noteBySlug("como-escribirme"));
assert.equal(noteBySlug("missing"), undefined);

const publicText = [
  site.tagline,
  site.description,
  ...experiments.flatMap((item) => [item.title, item.summary, item.ask, ...item.body]),
  ...notes.flatMap((item) => [item.title, item.summary, ...item.body]),
]
  .join("\n")
  .toLowerCase();

for (const banned of ["sweat equity", "venture studio", "cotizador", "cemprendedor"]) {
  assert.equal(publicText.includes(banned), false, `public copy still has "${banned}"`);
}

const marketingHits = bannedPublicCopy.filter((word) => {
  if (word === "célula" || word === "celula" || word === "factoría" || word === "factoria") {
    return false;
  }
  return publicText.includes(word);
});
assert.deepEqual(marketingHits, [], `banned marketing leaked: ${marketingHits.join(", ")}`);

const good = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@estudio.cl",
  intent: "entrar",
  experiment: "este-sitio",
  message: "Vi el experimento 001. Puedo revisar la copy del lab y devolver notas concretas.",
});
assert.equal(good.success, true, "valid cooperate payload should pass");

const empty = cooperateSchema.safeParse({});
assert.equal(empty.success, false, "empty payload should fail");
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
  email: "ana@estudio.cl",
  intent: "entrar",
  message: "Quiero entrar pero no dije a cuál experimento del lab.",
});
assert.equal(needsExperiment.success, false, "entrar without experiment should fail");
if (!needsExperiment.success) {
  const message = needsExperiment.error.flatten().fieldErrors.experiment?.[0];
  assert.ok(message);
  assert.match(message, /experimento/i);
}

const noteOnly = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@estudio.cl",
  intent: "nota",
  experiment: "",
  message: "La home se entiende. El footer podría repetir que no es una agencia.",
});
assert.equal(noteOnly.success, true, "empty experiment should be optional for notes");

const short = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@estudio.cl",
  intent: "nota",
  message: "Hola",
});
assert.equal(short.success, false);

assert.equal(isHoneypot({ company_website: "https://spam.test" }), true);
assert.equal(isHoneypot({ company_website: "   " }), false);
assert.equal(parseJsonObject(null), null);
assert.equal(parseJsonObject(["x"]), null);
assert.ok(parseJsonObject({ name: "Ana" }));

console.log("ok");
