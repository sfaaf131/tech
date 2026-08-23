# Plan 004: Gate the Entrar CTA on isOpenExperimentSlug

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 8001878..HEAD -- src/app/experimentos/[slug]/page.tsx src/lib/lab.ts src/lib/schemas.ts scripts/check.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: plans/003-check-content-integrity.md
- **Category**: bug
- **Planned at**: commit `8001878`, 2026-08-23

## Why this matters

The experiment detail banner already respects `status` (abierto / pausa / cerrado).
The primary button "Entrar a este experimento" renders whenever `openToJoin` is
true, even if `status` is `pausa` or `cerrado`. The API uses
`isOpenExperimentSlug`, which requires **both** `status === "abierto"` and
`openToJoin`. Today both published experiments are open, so this is latent —
it becomes a contradictory door the first time someone pauses an experiment
without flipping `openToJoin`.

## Current state

`src/lib/lab.ts`:

```
export function openExperiments() {
  return experiments.filter((item) => item.status === "abierto" && item.openToJoin);
}
export function isOpenExperimentSlug(slug: string) {
  return openExperiments().some((item) => item.slug === slug);
}
```

`src/app/experimentos/[slug]/page.tsx` 78–81:

```
{item.openToJoin ? (
  <Link className="button" href={`/cooperar?intento=entrar&experimento=${item.slug}`}>
    Entrar a este experimento
  </Link>
) : null}
```

`src/lib/schemas.ts` 88–93 — `entrar` + closed slug → Spanish error "Ese experimento no está abierto."

`src/lib/cooperate.ts` `presetFromSearch` — any catalog slug can become `presetExperiment` and defaults intent to `entrar`. Out of scope for this plan (finding was MED/low). Do not change presets here.

Both fixtures in `experiments` currently have `status: "abierto"` and `openToJoin: true`. Do **not** invent a third published experiment just to test UI. Characterization belongs in `scripts/check.ts` against the helper, not a fake page render.

## Commands you will need

| Purpose | Command    | Expected on success |
|---------|------------|---------------------|
| Tests   | `npm test` | prints `ok`, exit 0 |

## Scope

**In scope**:
- `src/app/experimentos/[slug]/page.tsx`
- `scripts/check.ts` — helper/content invariants only

**Out of scope**:
- Adding or changing published experiments/notes
- `presetFromSearch` closed-slug behavior
- Cooperate form select options (already uses `openExperiments()` when intent is `entrar`)

## Git workflow

- Current workspace branch. Imperative commit subjects.

## Steps

### Step 1: Use the same predicate as the API

In `src/app/experimentos/[slug]/page.tsx`, import `isOpenExperimentSlug` from `@/lib/lab` (it already imports other helpers from there). Replace `item.openToJoin` on the CTA with `isOpenExperimentSlug(item.slug)`.

Leave `statusBanner` as-is.

### Step 2: Content + helper asserts

In `scripts/check.ts`, after the existing lab asserts:

- For each experiment: if `openToJoin` is true, assert `status === "abierto"` (content invariant: do not publish a joinable paused/closed row).
- Keep `isOpenExperimentSlug("este-sitio") === true` and `isOpenExperimentSlug("missing") === false`.

Do not add a live paused fixture to `src/lib/lab.ts`.

**Verify**: `npm test` → `ok`

## Test plan

- Pattern: existing `openExperiments` / `isOpenExperimentSlug` asserts in `scripts/check.ts` ~48–54.
- New case: every `openToJoin: true` experiment is `abierto`.

## Done criteria

- [ ] CTA uses `isOpenExperimentSlug(item.slug)`
- [ ] `item.openToJoin` is not the CTA gate
- [ ] `npm test` exits 0
- [ ] No new experiment/note rows
- [ ] `plans/README.md` row 004 updated

## STOP conditions

- You would add dummy published content to exercise pausa/cerrado.
- `isOpenExperimentSlug` is changed to ignore `status` instead of the CTA being fixed.

## Maintenance notes

- To pause an experiment: set `status: "pausa"` **and** `openToJoin: false`. CI will fail if `openToJoin` stays true.
- The page banner still explains pausa/cerrado; only the join button is gated.
