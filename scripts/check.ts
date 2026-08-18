import assert from "node:assert/strict";
import nextConfig from "../next.config";
import { POST } from "../src/app/api/cooperar/route";
import robots from "../src/app/robots";
import sitemap from "../src/app/sitemap";
import {
  asIntent,
  cooperateCopy,
  cooperateFieldIds,
  cooperateFieldOrder,
  honeypotName,
  presetFromSearch,
} from "../src/lib/cooperate";
import {
  experimentBySlug,
  experiments,
  experimentsSorted,
  isOpenExperimentSlug,
  openExperiments,
  statusLabel,
} from "../src/lib/lab";
import { noteBySlug, notes, notesSorted } from "../src/lib/notes";
import { clientIp, limited, retryAfterSec } from "../src/lib/rate-limit";
import {
  cooperateIntents,
  cooperateSchema,
  isEmptyGreeting,
  isHoneypot,
  isTooFast,
  normalizeNote,
  parseJsonObject,
} from "../src/lib/schemas";
import { bannedOfferCopy, formatDate, nav, site } from "../src/lib/site";
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
assert.equal(isOpenExperimentSlug("este-sitio"), true);
assert.equal(isOpenExperimentSlug("missing"), false);
assert.equal(experimentsSorted()[0]?.status, "abierto");
assert.equal(statusLabel("abierto"), "en curso");
assert.equal(statusLabel("pausa"), "en pausa");
assert.equal(statusLabel("cerrado"), "cerrado");
assert.match(formatDate("2026-08-14"), /ago|2026/i);

assert.equal(notes.length, 3);
assert.equal(new Set(notes.map((item) => item.slug)).size, 3);
assert.ok(noteBySlug("se-borro-la-factory"));
assert.ok(noteBySlug("kursox-no-es-esto"));
assert.ok(noteBySlug("en-blanco-a-proposito"));
assert.deepEqual(
  notesSorted().map((item) => item.slug),
  [...notes].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug)).map((item) => item.slug),
);

const publicText = [
  site.tagline,
  site.description,
  cooperateCopy.pageLead,
  cooperateCopy.successTitle,
  cooperateCopy.successDetail,
  cooperateCopy.emailHint,
  ...experiments.flatMap((item) => [item.title, item.summary, item.open, ...item.body]),
  ...notes.flatMap((item) => [item.title, item.summary, ...item.body]),
]
  .join("\n")
  .toLowerCase();

for (const banned of bannedOfferCopy) {
  assert.equal(publicText.includes(banned), false, `public copy still has "${banned}"`);
}

assert.equal(publicText.includes("en el banco"), false);
assert.equal(publicText.includes("bitácora"), false);
assert.equal(/llegó|llega a/.test(publicText), false, "public copy still claims the note arrived");
assert.match(cooperateCopy.pageLead, /no guarda/i);
assert.match(cooperateCopy.successDetail, /no guarda/i);

assert.deepEqual([...cooperateIntents], ["entrar", "nota", "proponer"]);
assert.equal(asIntent("entrar"), "entrar");
assert.equal(asIntent("factory"), "");
assert.deepEqual(presetFromSearch({ intento: "nota" }), { presetExperiment: "", presetIntent: "nota" });
assert.deepEqual(presetFromSearch({ exp: "este-sitio" }), {
  presetExperiment: "este-sitio",
  presetIntent: "entrar",
});
assert.deepEqual(presetFromSearch({ experimento: "missing", intento: "proponer" }), {
  presetExperiment: "",
  presetIntent: "proponer",
});
assert.equal(honeypotName, "company_website");
assert.ok(isHoneypot({ [honeypotName]: "x" }));
assert.deepEqual([...cooperateFieldOrder], ["intent", "experiment", "name", "email", "message", "link"]);
assert.equal(cooperateFieldIds.experiment, "coop-experiment");

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

const withLink = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "nota",
  message: "La home se entiende. El footer podría repetir que no es una agencia.",
  link: "https://lab.cl/x",
});
assert.equal(withLink.success, true);
if (withLink.success) assert.equal(withLink.data.link, "https://lab.cl/x");

const empty = cooperateSchema.safeParse({});
assert.equal(empty.success, false);
if (!empty.success) {
  const fields = empty.error.flatten().fieldErrors;
  for (const field of ["name", "email", "intent", "message"] as const) {
    const message = fields[field]?.[0];
    assert.ok(message, `${field} should have an error`);
    assert.equal(
      /expected|received|invalid_type|invalid_value|invalid_enum|too big/i.test(message),
      false,
      `${field} should fail in Spanish, got: ${message}`,
    );
  }
}

assert.equal(
  cooperateSchema.safeParse({
    name: "A",
    email: "ana@lab.cl",
    intent: "nota",
    message: "La home se entiende. El footer podría repetir que no es una agencia.",
  }).success,
  false,
);
assert.equal(
  cooperateSchema.safeParse({
    name: " ",
    email: "ana@lab.cl",
    intent: "nota",
    message: "La home se entiende. El footer podría repetir que no es una agencia.",
  }).success,
  false,
);

const longName = cooperateSchema.safeParse({
  name: "A".repeat(81),
  email: "ana@lab.cl",
  intent: "nota",
  message: "La home se entiende. El footer podría repetir que no es una agencia.",
});
assert.equal(longName.success, false);
if (!longName.success) {
  const message = longName.error.flatten().fieldErrors.name?.[0] ?? "";
  assert.ok(message);
  assert.equal(/expected|received|invalid_type|too big/i.test(message), false, message);
}

const longMessage = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "nota",
  message: "x".repeat(1201),
});
assert.equal(longMessage.success, false);
if (!longMessage.success) {
  assert.match(longMessage.error.flatten().fieldErrors.message?.[0] ?? "", /larga|Córtala/);
}

const unknownExperiment = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "nota",
  experiment: "factory",
  message: "La home se entiende. El footer podría repetir que no es una agencia.",
});
assert.equal(unknownExperiment.success, false);
if (!unknownExperiment.success) {
  const message = unknownExperiment.error.flatten().fieldErrors.experiment?.[0] ?? "";
  assert.match(message, /publicado|experimento/i);
  assert.equal(/expected|invalid_enum|invalid_value/i.test(message), false, message);
}

const badLink = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "nota",
  message: "La home se entiende. El footer podría repetir que no es una agencia.",
  link: "nota",
});
assert.equal(badLink.success, false);
if (!badLink.success) {
  assert.match(badLink.error.flatten().fieldErrors.link?.[0] ?? "", /enlace/i);
}

const longLink = cooperateSchema.safeParse({
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "nota",
  message: "La home se entiende. El footer podría repetir que no es una agencia.",
  link: `https://lab.cl/${"x".repeat(240)}`,
});
assert.equal(longLink.success, false);
if (!longLink.success) {
  const message = longLink.error.flatten().fieldErrors.link?.[0] ?? "";
  assert.match(message, /largo/i);
  assert.equal(/too big|expected/i.test(message), false, message);
}

assert.equal(
  cooperateSchema.safeParse({
    name: "Ana Pérez",
    email: "ana@lab.cl",
    intent: "nota",
    message: "La home se entiende. El footer podría repetir que no es una agencia.",
    link: "javascript:alert(1)",
  }).success,
  false,
);

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
assert.equal(isEmptyGreeting("hello"), true);
assert.equal(isEmptyGreeting(""), true);
assert.equal(isEmptyGreeting(" "), true);
assert.equal(isEmptyGreeting("conectemos"), true);
assert.equal(
  isEmptyGreeting("Vi la puerta. El select de experimento no se entiende en el celular."),
  false,
);
assert.equal(normalizeNote("ÁÉ hola!"), "ae hola");

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

assert.equal(
  cooperateSchema.safeParse({
    name: "Ana Pérez",
    email: "ana@lab.cl",
    intent: "factory",
    message: "Quiero abrir un experimento de bitácora para un flujo real de pymes.",
  }).success,
  false,
);

assert.equal(isHoneypot({ company_website: "https://spam.test" }), true);
assert.equal(isHoneypot({ sitio_web: "x" }), true);
assert.equal(isHoneypot({ website: "x" }), true);
assert.equal(isHoneypot({ empresa: "x" }), true);
assert.equal(isHoneypot({ website: 1 }), false);
assert.equal(isHoneypot({ company_website: "   " }), false);
assert.equal(parseJsonObject(null), null);
assert.equal(parseJsonObject(["x"]), null);
assert.equal(parseJsonObject(undefined), null);
assert.equal(parseJsonObject(0), null);
assert.equal(parseJsonObject(""), null);
assert.ok(parseJsonObject({ name: "Ana" }));

const now = Date.now();
assert.equal(isTooFast({}, now), true);
assert.equal(isTooFast({ t: "nope" }, now), true);
assert.equal(isTooFast({ t: "" }, now), true);
assert.equal(isTooFast({ t: "   " }, now), true);
assert.equal(isTooFast({ t: 0 }, now), true);
assert.equal(isTooFast({ t: now - 500 }, now), true);
assert.equal(isTooFast({ t: String(now - 4000) }, now), false);
assert.equal(isTooFast({ t: now + 10_000 }, now), true);

assert.equal(limited("lim-a"), false);
assert.equal(limited("lim-a"), false);
assert.equal(limited("lim-a"), false);
assert.equal(limited("lim-a"), false);
assert.equal(limited("lim-a"), false);
assert.equal(limited("lim-a"), true);
assert.equal(limited("lim-b"), false);

const start = 1_000_000;
assert.equal(limited("lim-reset", 2, 1000, start), false);
assert.equal(limited("lim-reset", 2, 1000, start + 1), false);
assert.equal(limited("lim-reset", 2, 1000, start + 2), true);
assert.equal(limited("lim-reset", 2, 1000, start + 1001), false);

const retryAt = 5_000_000;
limited("lim-retry", 1, 10_000, retryAt);
assert.equal(retryAfterSec("lim-retry", retryAt + 1000), 9);
assert.equal(retryAfterSec("missing-retry", retryAt), 3600);

assert.equal(
  clientIp(new Request("http://x", { headers: { "x-forwarded-for": "1.1.1.1, 2.2.2.2" } })),
  "1.1.1.1",
);
assert.equal(clientIp(new Request("http://x", { headers: { "x-real-ip": "9.9.9.9" } })), "9.9.9.9");
assert.equal(clientIp(new Request("http://x")), "local");

const previous = process.env.DATABASE_URL;
delete process.env.DATABASE_URL;
const storePayload = {
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "nota" as const,
  message: "Una nota precisa para comprobar que el store no finge persistencia.",
  link: undefined,
};
assert.equal(saveCooperation(storePayload).stored, "pending");
process.env.DATABASE_URL = "postgres://x";
assert.equal(saveCooperation(storePayload).stored, "pending");
if (previous) process.env.DATABASE_URL = previous;
else delete process.env.DATABASE_URL;

const map = sitemap();
const urls = map.map((item) => item.url);
assert.ok(urls.includes("https://kondax.tech"));
assert.ok(urls.includes("https://kondax.tech/experimentos/este-sitio"));
assert.ok(urls.includes("https://kondax.tech/notas/se-borro-la-factory"));
assert.equal(
  urls.some((url) => url.includes("/api")),
  false,
);

const bots = robots();
assert.ok(bots.rules);
const rules = Array.isArray(bots.rules) ? bots.rules[0] : bots.rules;
assert.ok(String(rules?.disallow ?? "").includes("/api") || rules?.disallow?.includes("/api"));
assert.ok(String(bots.sitemap ?? "").includes("/sitemap.xml"));

function coopRequest(body: unknown, ip: string) {
  return new Request("http://localhost/api/cooperar", {
    method: "POST",
    headers: { "content-type": "application/json", "x-forwarded-for": ip },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

const valid = {
  name: "Ana Pérez",
  email: "ana@lab.cl",
  intent: "entrar" as const,
  experiment: "este-sitio",
  message: "Vi este sitio. Puedo revisar la copy del taller y devolver notas concretas sobre fricción.",
};

async function main() {
  const timeout = setTimeout(() => {
    console.error("check timed out");
    process.exit(1);
  }, 30_000);

  try {
    const redirects = await nextConfig.redirects!();
    const bySource = Object.fromEntries(redirects.map((item) => [item.source, item.destination]));
    assert.equal(bySource["/lab"], "/experimentos");
    assert.equal(bySource["/lab/:slug"], "/experimentos/:slug");
    assert.equal(bySource["/abrir"], "/cooperar");
    assert.equal(bySource["/contacto"], "/cooperar");
    assert.equal(bySource["/fabrica"], "/");
    assert.equal(bySource["/servicios"], "/");
    assert.equal(bySource["/cotizador"], "/");
    assert.equal(bySource["/app/:path*"], "/");
    assert.equal(redirects.length, 19);

    const headers = await nextConfig.headers!();
    const keys = new Set((headers[0]?.headers ?? []).map((item) => item.key));
    for (const key of [
      "Strict-Transport-Security",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "X-Frame-Options",
      "Permissions-Policy",
      "X-DNS-Prefetch-Control",
    ]) {
      assert.ok(keys.has(key), `missing header ${key}`);
    }

    const badJson = await POST(coopRequest("{", "post-json"));
    assert.equal(badJson.status, 400);
    assert.match(String((await badJson.json()).error), /JSON/);

    const arrayBody = await POST(coopRequest(["x"], "post-array"));
    assert.equal(arrayBody.status, 400);
    assert.match(String((await arrayBody.json()).error), /JSON/);

    const honeypot = await POST(
      coopRequest({ ...valid, t: Date.now() - 4000, company_website: "https://spam.test" }, "post-hp"),
    );
    assert.equal(honeypot.status, 200);
    const honeypotBody = await honeypot.json();
    assert.equal(honeypotBody.stored, "pending");
    assert.equal(honeypotBody.id, undefined);

    const tooFast = await POST(coopRequest({ ...valid, t: Date.now() }, "post-fast"));
    assert.equal(tooFast.status, 200);
    assert.equal((await tooFast.json()).stored, "pending");

    const ok = await POST(coopRequest({ ...valid, t: Date.now() - 4000 }, "post-ok"));
    assert.equal(ok.status, 200);
    const okBody = await ok.json();
    assert.equal(okBody.ok, true);
    assert.equal(okBody.stored, "pending");
    assert.equal(okBody.id, undefined);

    const missing = await POST(coopRequest({ t: Date.now() - 4000 }, "post-empty"));
    assert.equal(missing.status, 400);
    const missingBody = await missing.json();
    assert.ok(missingBody.error.fieldErrors.name);
    assert.ok(missingBody.error.fieldErrors.email);

    for (let index = 0; index < 6; index += 1) {
      const response = await POST(coopRequest({ t: Date.now() - 4000 }, "post-400-rate"));
      assert.equal(response.status, 400, "invalid bodies must not increment the cooperate bucket");
    }

    let last = 200;
    for (let index = 0; index < 6; index += 1) {
      const response = await POST(coopRequest({ ...valid, t: Date.now() - 4000 }, "post-rate"));
      last = response.status;
      if (index === 5) {
        assert.equal(response.status, 429);
        const retryAfter = Number(response.headers.get("retry-after"));
        assert.equal(Number.isInteger(retryAfter) && retryAfter > 0, true);
        assert.match(String((await response.json()).error), /envíos|Espera/i);
      }
    }
    assert.equal(last, 429);

    console.log("ok");
  } finally {
    clearTimeout(timeout);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
