# kondax.tech

Public workshop. Not Kursox. Not a factory. No portal, no auth, no cotizador.

## Commands

Node `>=20.9`. From the repo root:

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run ci
```

`npm run ci` is what Vercel runs as `buildCommand`. `typecheck` runs `next typegen` first so `tsc` works on a clean checkout.

## Content

Edit `src/lib/lab.ts` and `src/lib/notes.ts`. Then bump the count and slug asserts in `scripts/check.ts`. Public copy stays Spanish. `bannedOfferCopy` in `src/lib/site.ts` must stay absent from published text.

## Cooperate

`saveCooperation` always returns `{ stored: "pending" }`. Do not persist. Do not add DATABASE_URL theater. Public copy must not claim the note arrived — see `cooperateCopy` in `src/lib/cooperate.ts`. Honeypot and too-fast stay silent 200. Rate limit increments only after a valid parse.

## Don't

Do not reintroduce the factory catalog, venture-studio copy, Prisma, or next-auth.
