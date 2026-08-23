# Plan 002: Stop rejecting real notes that start with a greeting

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 8001878..HEAD -- src/lib/schemas.ts scripts/check.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `8001878`, 2026-08-23

## Why this matters

`isEmptyGreeting` rejects any message under 12 words that **starts with** a
token from `greetings` (`hola`, `oportunidad`, `conectemos`, …). Real Spanish
notes often start with "Hola," and still meet the 40-character minimum. Those
notes get "Eso es un saludo…" and never reach the (already non-persisting) store.
The door is the product; a false rejection is a closed door.

Verified against HEAD `8001878` (these currently fail `cooperateSchema`):

- `Hola vi el sitio y quiero proponer mejoras concretas`
- `Hola, vi un error en el select del formulario de cooperar`
- `Oportunidad de corregir el footer del taller público`

## Current state

`src/lib/schemas.ts` lines 10–38:

```
const greetings = [
  "hola", "hello", "hi", "conectemos", "colaboremos", "hagamos algo",
  "busco socio", "oportunidad", "synergy", "crezcamos juntos",
];

export function isEmptyGreeting(message: string) {
  const normalized = normalizeNote(message);
  if (!normalized) return true;
  const words = normalized.split(" ");
  if (words.length >= 12) return false;
  return greetings.some((item) => normalized === item || normalized.startsWith(`${item} `));
}
```

`normalizeNote` lowercases, strips diacritics, and drops non-letters.

`scripts/check.ts` 262–271 expects this networking line to **fail**:

```
"Hola, conectemos y veamos si podemos hacer algo juntos pronto."
```

That line is fluff, but it is not greeting-only. After this plan it should **pass**
if it still meets the 40-character minimum. Replace that assert with greeting-only
cases, and add the three real-note examples above as **passing**.

Existing must-keep rejects (lines 273–277): `"hola"`, `"hello"`, `""`, `" "`, `"conectemos"`.

## Commands you will need

| Purpose | Command    | Expected on success |
|---------|------------|---------------------|
| Tests   | `npm test` | prints `ok`, exit 0 |

## Scope

**In scope**:
- `src/lib/schemas.ts` — `isEmptyGreeting` only (do not loosen `min(40)`, do not remove the greetings list)
- `scripts/check.ts` — greeting asserts only

**Out of scope**:
- Route honeypot / too-fast behavior
- Changing `greetings` into a spam ML classifier
- Copy changes on the cooperate page

## Git workflow

- Current workspace branch. Imperative commit subjects.
- Do not push unless asked.

## Steps

### Step 1: Rewrite `isEmptyGreeting`

Keep `normalizeNote`. New rule:

1. Empty after normalize → greeting (reject).
2. Repeatedly strip a **leading** greeting token (longest match first, so `"hagamos algo"` wins over nothing, and `"crezcamos juntos"` / `"busco socio"` stay phrases).
3. After stripping, if nothing remains → reject.
4. If anything remains → **not** a greeting (the 40-char schema min still applies).

Do **not** keep the `words.length >= 12` bypass as the thing that saves real notes. The prefix rule is what hurts; removing it is the fix.

**Verify** with a one-off (do not leave the script in the repo):

```
npx tsx -e 'import { isEmptyGreeting, cooperateSchema } from "./src/lib/schemas.ts";
const fail = ["hola","hello",""," ","conectemos","Hola, conectemos"];
const pass = [
  "Hola vi el sitio y quiero proponer mejoras concretas",
  "Hola, vi un error en el select del formulario de cooperar",
  "Oportunidad de corregir el footer del taller público",
  "Vi la puerta. El select de experimento no se entiende en el celular.",
];
for (const s of fail) if (!isEmptyGreeting(s) && s.trim()) throw new Error("should reject: "+s);
for (const s of pass) {
  if (isEmptyGreeting(s)) throw new Error("should allow: "+s);
}
console.log("ok");
'
```

Expected: `ok`

### Step 2: Update `scripts/check.ts`

- Keep rejects for `hola`, `hello`, empty, `conectemos`.
- Add rejects for stacked greetings: `"Hola, conectemos"`, `"hi hello"`.
- Change the old `"Hola, conectemos y veamos…"` case to **success: true** (or delete it).
- Add schema success asserts for the three real notes listed in "Why this matters" (`intent: "nota"`, valid name/email).
- Keep the Spanish error-message assert when a true greeting is rejected (`/objeto|saludo/i`).

**Verify**: `npm test` → `ok`

## Test plan

- Pattern: existing `isEmptyGreeting` / `cooperateSchema.safeParse` blocks in `scripts/check.ts`.
- Cases: pure greeting, stacked greetings, real note starting with Hola, real note starting with Oportunidad, existing non-greeting note.

## Done criteria

- [ ] `npm test` exits 0
- [ ] The three real notes in "Why this matters" parse successfully
- [ ] `"hola"` / `"conectemos"` still fail
- [ ] `plans/README.md` row 002 updated

## STOP conditions

- Removing the 40-character minimum to "fix" greetings.
- Deleting the greetings list entirely (pure greetings must still fail).

## Maintenance notes

- Adding a greeting token that is also a common content word (like `oportunidad`) is now safe: it only rejects when the message is that token, or that token plus more greetings.
- Reviewers: confirm the longest-match strip order so `"busco socio"` is one token.
