# kondax.tech

Taller público de Agustín Saez C. en Santiago. Experimentos, notas y una puerta para cooperar.

No es la landing de Kursox. No es una factory.

## Rutas

- `/` — la puerta
- `/experimentos` — lo que está en el banco
- `/notas` — recortes fechados
- `/cooperar` — entrar, dejar nota, o proponer trabajo conjunto

El formulario valida en español, tiene honeypot y rate limit. Sin `DATABASE_URL` responde `{ stored: "pending" }`. No hay portal ni auth.

## Local

```bash
npm install
npm test
npm run dev
```
