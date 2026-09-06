import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Falta STRIPE_SECRET_KEY en las variables de entorno.");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-08-26.dahlia",
});

/**
 * Comisión de la plataforma sobre cada venta, en base 10000 (ej: 1000 = 10%).
 * El resto llega directo a la cuenta de Stripe Connect del productor.
 */
export const PLATFORM_FEE_BASIS_POINTS = 1000;

export function calculatePlatformFeeCents(amountCents: number): number {
  return Math.round((amountCents * PLATFORM_FEE_BASIS_POINTS) / 10000);
}
