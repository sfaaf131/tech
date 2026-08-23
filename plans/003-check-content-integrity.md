# Plan 003: Extend check.ts over pages, related slugs, and dates

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 8001878..HEAD -- scripts/check.ts src/lib/site.ts src/lib/notes.ts src/lib/lab.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tests
- **Planned at**: commit `8001878`, 2026-08-23

## Why this matters

`scripts/check.ts` is the verification baseline (`npm test`). It already scans
`site`, `cooperateCopy`, `experiments`, and `notes` for `bannedOfferCopy` and
for copy that claims a note arrived. Home, footer, form hints, and other
`src/app` / `src/components` strings are invisible to that scan. `note.related`
is an untyped string with no resolve check. Dates are formatted with
`new Date(\`${iso}T12:00:00\`)` (host-local), which can shift the calendar day
outside UTC.

## Current state

- `scripts/check.ts` 67–88 — `publicText` join of lib copy only; `bannedOfferCopy` loop; `llegó|llega a` regex; `/no guarda/i` on cooperate copy.
- `src/lib/notes.ts` — `related?: string` (currently `"este-sitio"` on two notes). `src/app/notas/[slug]/page.tsx` uses `experimentBySlug(item.related)` and silently omits the link if missing.
- `src/lib/site.ts` 27–33 — `formatDate` uses `` new Date(`${iso}T12:00:00`) `` then `timeZone: "America/Santiago"`.
- AGENTS.md: keep explicit slug/count asserts when adding content; this plan **adds** checks, does not remove the length/slug asserts.
- `bannedOfferCopy` in `src/lib/site.ts`: `"sweat equity"`, `"venture studio"`, `"cotizador"`, `"cemprendedor"`.

## Commands you will need

| Purpose | Command    | Expected on success |
|---------|------------|---------------------|
| Tests   | `npm test` | prints `ok`, exit 0 |

## Scope

**In scope**:
- `scripts/check.ts`
- `src/lib/site.ts` — `formatDate` parse only (keep `es-CL` output)

**Out of scope**:
- Rewriting pages to extract copy into lib
- Replacing the explicit `experiments.length === 2` / notes slug asserts
- Sitemap `lastModified` (rejected as lower leverage)
- Adding Jest/Playwright

## Git workflow

- Current workspace branch. Imperative commit subjects.

## Steps

### Step 1: Make `formatDate` timezone-stable

In `src/lib/site.ts`, parse the ISO date as UTC noon so the calendar day does not depend on the host TZ:

```
new Date(`${iso}T12:00:00Z`)
```

Keep `DateTimeFormat("es-CL", { … timeZone: "America/Santiago" })`.
UTC noon on that date is still that date in Santiago.

**Verify**: `npx tsx -e 'import { formatDate } from "./src/lib/site.ts"; console.log(formatDate("2026-08-14"));'`
→ contains `2026` and a Spanish/abbreviated August (`ago` or similar).

### Step 2: Resolve `related` and ISO dates in `scripts/check.ts`

After the existing notes asserts (~line 57):

- For every note with `related`, `assert.ok(experimentBySlug(note.related), …)`.
- For every note `date` and every experiment `opened`, assert `/^\d{4}-\d{2}-\d{2}$/` and `!Number.isNaN(Date.parse(\`${iso}T12:00:00Z\`))`.

`experimentBySlug` is already imported in `check.ts`.

### Step 3: Scan UI source for banned / arrival copy

Using `node:fs` / `node:path` (already fine in this tsx script), walk `src/app` and `src/components` for `.ts`/`.tsx` files. Concatenate lowercase text.

- For each `bannedOfferCopy` entry, assert it is absent from that blob (in addition to the existing `publicText` scan).
- Assert the blob does not match `/llegó|llega a/` (same regex as today). If a **comment** or a test string inside a component would trip this, quote the file and STOP rather than weakening the regex.

Do not walk `scripts/` (this file will mention banned words in asserts).

### Step 4: Run the suite

**Verify**: `npm test` → `ok`

## Test plan

- Pattern: existing `assert.equal` / `assert.ok` blocks at the top of `scripts/check.ts`.
- New cases: related slug resolves; ISO dates; UI tree banned-copy scan.

## Done criteria

- [ ] `npm test` exits 0
- [ ] `formatDate` uses a `Z` (UTC) parse
- [ ] `related` and ISO dates are asserted
- [ ] `src/app` + `src/components` are scanned for banned copy
- [ ] `plans/README.md` row 003 updated

## STOP conditions

- The UI scan fails on an existing legitimate Spanish phrase that is not banned copy — report the string; do not delete product copy to silence the test.
- You would need to add a filesystem walker dependency.

## Maintenance notes

- Adding a note: set `related` to a real experiment slug or omit it; CI will fail on typos.
- Adding a page: banned factory words in JSX will now fail `npm test`.
