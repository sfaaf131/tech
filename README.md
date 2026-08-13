# Kondax.tech

Factoría de software, inteligencia artificial y venture studio.

- **Empresas (B2B y pymes):** process mining, RPA, agentes de IA, analítica, integración y células de ingeniería. Cobro por hora, sprint o proyecto.
- **Fundadores:** socio tecnológico a cambio de sweat equity.

Sitio: [kondax.tech](https://kondax.tech)

## Mapa

| Ruta | Qué es |
| --- | --- |
| `/` | Inicio: dos líneas, servicios, modelo |
| `/enterprise` | Empresas: catálogo + pedir alcance |
| `/startups` | Fundadores: criterios + postulación |
| `/acceso` | Entrada al portal |
| `/dashboard` | Resumen (cliente o socio) |
| `/proyectos` | Sprints y entregables |

## Stack

Next.js (App Router), TypeScript, Tailwind CSS, Auth.js, PostgreSQL / Prisma (`prisma/schema.prisma`).

```bash
cp .env.example .env.local
npm install
npx prisma generate
npm run dev
```

Sin `DATABASE_URL` los formularios se sellan y responden; la persistencia queda pendiente. Con PostgreSQL: `npx prisma db push`.

```bash
npm test
npm run lint
npm run build
```
