import { usdToClp } from "@/lib/site";

export function clp(value: number) {
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function usd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function usdAsClp(valueUsd: number) {
  return clp(valueUsd * usdToClp);
}

export function compact(value: number) {
  return new Intl.NumberFormat("es-CL", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export function months(value: number) {
  if (!Number.isFinite(value) || value <= 0) return "inmediato";
  if (value < 1) return `${Math.round(value * 30)} días`;
  return `${value.toFixed(1)} meses`;
}
