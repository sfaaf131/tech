import type { RoiInput } from "@/lib/roi";

export const roiPresets: Record<string, RoiInput & { label: string }> = {
  pyme: {
    label: "Pyme",
    fte: 5,
    salaryClp: 1_400_000 * 12,
    automationPct: 0.28,
    monthlyVolume: 4000,
    errorRate: 0.025,
    costPerErrorClp: 18000,
    complianceClp: 12_000_000,
    implementationUsd: 28000,
    annualSaasClp: 189000 * 12,
  },
  enterprise: {
    label: "Corporación",
    fte: 18,
    salaryClp: 2_200_000 * 12,
    automationPct: 0.4,
    monthlyVolume: 22000,
    errorRate: 0.015,
    costPerErrorClp: 28000,
    complianceClp: 90_000_000,
    implementationUsd: 120000,
    annualSaasClp: 8_000_000,
  },
  banca: {
    label: "Banca",
    fte: 32,
    salaryClp: 2_600_000 * 12,
    automationPct: 0.35,
    monthlyVolume: 48000,
    errorRate: 0.012,
    costPerErrorClp: 45000,
    complianceClp: 180_000_000,
    implementationUsd: 220000,
    annualSaasClp: 18_000_000,
  },
};

export function parseRoiPreset(params: URLSearchParams) {
  const preset = params.get("preset");
  if (preset && preset in roiPresets) return preset;
  return "enterprise";
}
