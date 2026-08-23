# Plan 001: Keep the cooperate note after "success"

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 8001878..HEAD -- src/components/forms/cooperate-form.tsx src/lib/cooperate.ts src/lib/site.ts scripts/check.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `8001878`, 2026-08-23

## Why this matters

`saveCooperation` never persists. The success copy tells the visitor to copy
the note and email `team@kondax.tech`. After a 200, the form unmounts, so the
text they are told to copy is gone. "Dejar otra" remounts an empty form.
The door's honest path (email the author) is broken at the moment it is offered.

## Current state

- `src/lib/store.ts` — `saveCooperation` always returns `{ stored: "pending" }`. Do not persist.
- `src/lib/cooperate.ts` — public copy. `successDetail` currently:

```
Este formulario no guarda. Copia el texto y mándalo a ${site.email}. Si hay encaje, respondo. Si no, no invento una reunión.
```

- `src/components/forms/cooperate-form.tsx` — client form. On any HTTP 200 it sets `status` to `"ok"` (lines 84–85) and then **replaces the entire form** with a banner (lines 92–106). Inputs are uncontrolled; values are not kept in state.
- `src/lib/site.ts` — `site.email` is the only canonical address. The form's network-error fallback hardcodes `team@kondax.tech` at line 80.
- AGENTS.md: public copy must not claim the note arrived. Honeypot and too-fast stay silent 200. Do not add DATABASE_URL theater.
- Spanish UI. Match existing classes: `banner`, `lede ok`, `actions`, `button`, `button ghost`, `hint`. No new CSS framework.

## Commands you will need

| Purpose   | Command             | Expected on success      |
|-----------|---------------------|--------------------------|
| Tests     | `npm test`          | prints `ok`, exit 0      |
| Lint      | `npm run lint`      | exit 0                   |
| Typecheck | `npm run typecheck` | exit 0                   |

## Scope

**In scope**:
- `src/components/forms/cooperate-form.tsx`
- `src/lib/cooperate.ts` (success copy only, if the wording must mention the preview / mailto)
- `scripts/check.ts` (assert success copy still says the form does not save; assert no hardcoded `team@kondax.tech` in the form)

**Out of scope**:
- `src/lib/store.ts` — do not persist
- `src/app/api/cooperar/route.ts` — do not change silent-200 behavior
- New dependencies (no clipboard libraries)
- Finding 006 (intent radio focus) and finding 007 (CSP)

## Git workflow

- Work on the current workspace branch. Do not rename it.
- Commit style (from `git log`): imperative sentence, why not what. Example: `Be honest about the cooperate door and gate deploys with ci.`
- Do not push unless the operator asked.

## Steps

### Step 1: Capture the submitted fields before the success swap

In `CooperateForm`, keep a small state object set from `FormData` on submit (name, email, intent, experiment, message, link). On `"ok"`, do **not** drop that data.

### Step 2: Success UI keeps the note and offers copy + mailto

When `status === "ok"`, render:

1. Existing `successTitle` / `successDetail` (must still say the form does not save; must not say the note arrived).
2. A read-only preview of the submitted message (and name/email if useful).
3. A `type="button"` that copies a plain-text draft to the clipboard via `navigator.clipboard.writeText`. Announce "Copiado" with `aria-live="polite"`.
4. A `mailto:` link using `site.email` (import from `@/lib/site`), with subject and body built from the captured fields. Use `encodeURIComponent`.
5. Existing actions: "Volver al taller" and "Dejar otra" (clears status **and** the captured draft so the form is empty again).

Draft text to copy / put in mailto body (Spanish, plain text), something like:

```
Nombre: …
Correo: …
Intento: …
Experimento: …   (or "ninguno")
Enlace: …        (omit line if empty)

…
```

The last block is the message.

If `navigator.clipboard` is missing, the mailto and the visible preview are enough — do not add a polyfill.

### Step 3: Stop hardcoding the email in the error fallback

Replace the literal `team@kondax.tech` in the error string with `site.email`.

### Step 4: Copy / email asserts

In `scripts/check.ts`:

- Keep the existing `/no guarda/i` asserts on `cooperateCopy.successDetail` and `pageLead`.
- Assert `src/components/forms/cooperate-form.tsx` source does not contain the literal `team@kondax.tech` (it must use `site.email`).
- Do not require a browser test in CI.

**Verify**: `npm test` → `ok`

## Test plan

- `scripts/check.ts` remains the only test runner. Pattern: existing copy asserts around lines 80–88.
- Cases: success copy still denies persistence; form file has no hardcoded mailbox.

## Done criteria

- [ ] `npm test` exits 0
- [ ] `npm run lint` exits 0
- [ ] `npm run typecheck` exits 0
- [ ] Success path still shows the submitted message
- [ ] Copy and mailto use `site.email`
- [ ] Store still returns `{ stored: "pending" }`
- [ ] `plans/README.md` row 001 updated

## STOP conditions

- Store or route is changed to persist or to email automatically.
- Success copy starts claiming the note arrived (`llegó`, `llega a tu correo`, etc.).
- A clipboard library is added.

## Maintenance notes

- If persistence is ever added (it should not be), this success UI still makes sense as a receipt.
- Reviewers: the silent-200 bot path will also show this UI (by design). Plan 005 reduces false silent-200s from empty `t`.
