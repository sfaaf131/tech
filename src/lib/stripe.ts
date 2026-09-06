import Stripe from "stripe";

let cached: Stripe | null = null;

/**
 * Devuelve el cliente de Stripe, construyéndolo la primera vez que se usa.
 *
 * No se construye al importar el módulo a propósito: Next.js importa las rutas
 * de API durante el build para recolectar sus metadatos, así que lanzar en
 * tiempo de import hacía fallar el build entero cuando STRIPE_SECRET_KEY no
 * estaba definida en el entorno de despliegue.
 */
export function getStripe(): Stripe {
  if (cached) return cached;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("Falta STRIPE_SECRET_KEY en las variables de entorno.");
  }

  cached = new Stripe(key, {
    apiVersion: "2026-08-26.dahlia",
  });

  return cached;
}

/**
 * Comisión de la plataforma sobre cada venta, en base 10000 (ej: 1000 = 10%).
 * El resto llega directo a la cuenta de Stripe Connect del productor.
 */
export const PLATFORM_FEE_BASIS_POINTS = 1000;

export function calculatePlatformFeeCents(amountCents: number): number {
  return Math.round((amountCents * PLATFORM_FEE_BASIS_POINTS) / 10000);
}
