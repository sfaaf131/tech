import { estimateQuote } from "../src/lib/quote";
import { estimateRoi } from "../src/lib/roi";
import { sealEvent, verifyChain } from "../src/lib/audit";

const quote = estimateQuote({
  audience: "banca",
  serviceIds: ["kyc", "risk"],
  scope: "producto",
  timeline: "12",
  equity: false,
});

if (quote.hours < 400) {
  throw new Error(`expected banking quote hours >= 400, got ${quote.hours}`);
}

const roi = estimateRoi({
  fte: 10,
  salaryClp: 20_000_000,
  automationPct: 0.4,
  monthlyVolume: 8000,
  errorRate: 0.02,
  costPerErrorClp: 15000,
  complianceClp: 30_000_000,
  implementationUsd: 60000,
  annualSaasClp: 2_000_000,
});

if (!Number.isFinite(roi.paybackMonths) || roi.currentAnnualClp <= 0) {
  throw new Error("roi calculation failed");
}

const first = sealEvent("test", { ok: true });
const second = sealEvent("test.2", { ok: true }, first.hash);
if (!verifyChain([first, second])) {
  throw new Error("audit chain should verify");
}

console.log("kondax math ok", {
  hours: quote.hours,
  payback: Number(roi.paybackMonths.toFixed(2)),
});
