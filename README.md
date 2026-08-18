# kondax.tech

Taller público de Agustín Saez C. en Santiago. Experimentos, notas y una forma de cooperar.

No es la landing de Kursox. No es una factory.

## Rutas

- `/` — la puerta
- `/experimentos` — lo que está publicado
- `/notas` — recortes fechados
- `/cooperar` — entrar, dejar nota, o proponer trabajo conjunto

El formulario valida en español, tiene honeypot y rate limit. `DATABASE_URL` no persiste: el POST responde `{ stored: "pending" }`. La copy pública no finge que el envío llegó al correo. No hay portal ni auth.

## Local

Node 20.9+.

```bash
npm ci
npm run lint
npm run typecheck
npm test
npm run build
npm run dev
```
