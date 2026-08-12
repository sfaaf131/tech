# Kondax.tech

Incubamos con IA. Ejecutamos con células de ingeniería.

Kondax une **incubación y automatización con IA** (inspirado en CEmprendedor) con **ejecución técnica mediante células ágiles** (inspirado en Trio.dev). La marca, el producto y este repositorio viven bajo [kondax.tech](https://kondax.tech).

## Visión comercial

Tres vías de ingreso, una sola plataforma:

1. **Suscripción SaaS** — incubadora, agentes y marketplace para emprendedores.
2. **Fábrica por hora** — células de ingeniería para pymes, corporaciones y banca.
3. **Sweat equity** — participación en proyectos co-creados.

## Líneas de operación

| Audiencia | Entrada |
| --- | --- |
| Emprendedores independientes | Incubadora + marketplace de socios |
| Pymes, corporaciones y banca | Consultoría y células de alto nivel |

La fábrica cubre web/móvil, e-commerce avanzado, RPA, agentes de IA, Web3, computación espacial, BPM, process mining, motores de riesgo, RegTech, KYC/AML y Open Banking.

## Arquitectura de la web

- **Público:** marketing, cotizador inteligente y calculadora de ROI corporativo.
- **Privado (`/app`):** proyectos, células, marketplace, equity y auditoría.
- **Passport:** OAuth 2.0. GitHub/GitLab para programadores. LinkedIn para fundadores, inversores y corporativos.

### Stack

- Next.js (App Router) + TypeScript
- Node.js (APIs) y PostgreSQL (`db/schema.sql`)
- Python previsto para agentes de IA
- OpenAI / Claude
- Auth.js (NextAuth v5)

### Seguridad

TLS 1.3 en tránsito, AES-256 en reposo, logs SHA-256 encadenados, headers de seguridad y diseño preparado para SOC 2 / ISO 27001.

## Desarrollo

```bash
cp .env.example .env.local
npm install
npm run dev
```

Sin claves OAuth, Passport abre la consola en modo demostración. Con `AUTH_GITHUB_*`, `AUTH_GITLAB_*` y `AUTH_LINKEDIN_*` se activa la validación real.

```bash
npm test    # cotizador, ROI y cadena de auditoría
npm run lint
npm run build
```

El cotizador sella cada estimación (`POST /api/cotizar`). El ROI corporativo vive en `/roi`.
