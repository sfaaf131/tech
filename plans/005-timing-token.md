# Plan 005: Set the timing token on mount; tolerate small clock skew

> **Executor instructions**: Follow this plan step by step. Run every
> verification command and confirm the expected result before moving to the
> next step. If anything in the "STOP conditions" section occurs, stop and
> report — do not improvise. When done, update the status row for this plan
> in `plans/README.md` — unless a reviewer dispatched you and told you they
> maintain the index.
>
> **Drift check (run first)**: `git diff --stat 8001878..HEAD -- src/components/forms/cooperate-form.tsx src/lib/schemas.ts src/app/api/cooperar/route.ts scripts/check.ts`
> If any in-scope file changed since this plan was written, compare the
> "Current state" excerpts against the live code before proceeding; on a
> mismatch, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: MED
- **Depends on**: plans/001-keep-cooperate-note.md
- **Category**: bug
- **Planned at**: commit `8001878`, 2026-08-23

## Why this matters

Too-fast and missing `t` return a silent HTTP 200 (`{ ok: true, stored: "pending" }`)
before Zod runs. That is **by design** for bots (AGENTS.md). Two honest cases
reuse that path:

1. `startedAt` stays `""` until `onInput` / radio `onChange`. Autofill or
   paste-and-submit can send empty `t` → silent 200 → success UI (and, before
   001, a lost note).
2. `started > now` is treated as too-fast. A client clock a few seconds or
   minutes ahead never reaches validation.

Do not tip bots (no 4xx for too-fast). Fix the client token and only treat
**large** future skew as a bot.

## Current state

`src/components/forms/cooperate-form.tsx`:

```
const startedAt = useRef("");
function markStarted() {
  if (!startedAt.current) startedAt.current = String(Date.now());
}
```

Submit sends `t: startedAt.current`. `onInput={markStarted}` on the form.

`src/lib/schemas.ts` `isTooFast` (118–127):

- missing / empty / NaN / `<= 0` / `started > now` / elapsed `< 3000` → true (too fast)
- `scripts/check.ts` 328: `isTooFast({ t: now + 10_000 }, now)` is currently **true**

`src/app/api/cooperar/route.ts` 20–21: `isHoneypot(body) || isTooFast(body)` → silent 200.

AGENTS.md: honeypot and too-fast stay silent 200. Rate limit increments only after a valid parse.

## Commands you will need

| Purpose | Command    | Expected on success |
|---------|------------|---------------------|
| Tests   | `npm test` | prints `ok`, exit 0 |

## Scope

**In scope**:
- `src/components/forms/cooperate-form.tsx` — `startedAt` initialization
- `src/lib/schemas.ts` — `isTooFast` future-skew branch
- `scripts/check.ts` — `isTooFast` asserts

**Out of scope**:
- Changing silent 200 to 4xx
- Server-side issued timestamps / cookies
- Rate-limit store
- Showing a different success banner for bots (would tip them)

## Git workflow

- Current workspace branch. Imperative commit subjects.

## Steps

### Step 1: Initialize `startedAt` when the form mounts

```
const startedAt = useRef(String(Date.now()));
```

Keep `markStarted` as a no-op-if-set helper for the radio handler, or leave it — it must not reset the clock on every keystroke.

A visitor who opens `/cooperar` and submits after 3s will send a real elapsed time even if no `input` event fired (autofill).

Bots that POST with a fabricated `t` in the past are unchanged.

### Step 2: Tolerate small future skew in `isTooFast`

After parsing `started` as a finite positive number:

- If `started > now` **and** `started - now` is greater than **5 minutes** (`5 * 60 * 1000`) → too fast (bot / garbage).
- If `started > now` but within 5 minutes → **not** too fast (clock skew). Do not use a huge elapsed time; just skip the "future" reject and skip the `< 3000` check when start is in the future (treat as "clock ahead, allow").
- Existing rules stay: missing `t`, empty string, non-numeric, `<= 0`, and `now - started < 3000` when `started <= now`.

### Step 3: Update `scripts/check.ts`

Current block ~320–328. Change:

- `isTooFast({ t: now + 10_000 }, now)` → **false** (10s skew is allowed)
- Add `isTooFast({ t: now + 6 * 60 * 1000 }, now)` → **true** (6 minutes ahead is a bot)
- Keep `isTooFast({ t: now - 500 }, now) === true`
- Keep `isTooFast({ t: String(now - 4000) }, now) === false`
- Keep empty / missing `t` → true

The route test that POSTs `{ ...valid, t: Date.now() }` as too-fast (elapsed ~0) must still get 200 + `stored: "pending"`.

**Verify**: `npm test` → `ok`

## Test plan

- Pattern: existing `isTooFast` asserts in `scripts/check.ts`.
- Cases: 10s future (allow), 6min future (reject), 500ms past (reject), 4s past (allow), empty `t` (reject).

## Done criteria

- [ ] Form ref is initialized with `Date.now()` at mount
- [ ] 10s clock skew is not too-fast; 6min is
- [ ] Missing `t` still too-fast; route still silent 200
- [ ] `npm test` exits 0
- [ ] `plans/README.md` row 005 updated

## STOP conditions

- You would return 400 for too-fast / honeypot (violates AGENTS.md).
- You would add cookies, signed tokens, or a server clock endpoint.

## Maintenance notes

- The 3s floor still applies when the client clock is behind or aligned. Only small *ahead* skew is forgiven.
- Reviewers: do not lower the 5-minute window to seconds; NTP error can be larger than 10s on some devices.
