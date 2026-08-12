export type RoiInput = {
  fte: number;
  salaryClp: number;
  automationPct: number;
  monthlyVolume: number;
  errorRate: number;
  costPerErrorClp: number;
  complianceClp: number;
  implementationUsd: number;
  annualSaasClp: number;
};

export type RoiResult = {
  currentAnnualClp: number;
  laborClp: number;
  errorClp: number;
  automatableClp: number;
  year1SavingsClp: number;
  year3SavingsClp: number;
  kondaxYear1Clp: number;
  paybackMonths: number;
  roi3y: number;
};

const USD_TO_CLP = 950;

export function estimateRoi(input: RoiInput): RoiResult {
  const laborClp = input.fte * input.salaryClp;
  const errorClp = input.monthlyVolume * 12 * input.errorRate * input.costPerErrorClp;
  const currentAnnualClp = laborClp + errorClp + input.complianceClp;
  const automatableClp = laborClp * input.automationPct;

  const capturedLabor = automatableClp * 0.72;
  const capturedError = errorClp * 0.62;
  const capturedCompliance = input.complianceClp * 0.38;
  const grossAnnual = capturedLabor + capturedError + capturedCompliance;

  const kondaxYear1Clp =
    input.implementationUsd * USD_TO_CLP + input.annualSaasClp;
  const kondaxYearNClp = input.annualSaasClp;

  const year1SavingsClp = grossAnnual - kondaxYear1Clp;
  const year3SavingsClp = year1SavingsClp + (grossAnnual - kondaxYearNClp) * 2;
  const monthlyNet = grossAnnual / 12;
  const paybackMonths = monthlyNet > 0 ? kondaxYear1Clp / monthlyNet : Number.POSITIVE_INFINITY;
  const roi3y = kondaxYear1Clp + kondaxYearNClp * 2 > 0
    ? year3SavingsClp / (kondaxYear1Clp + kondaxYearNClp * 2)
    : 0;

  return {
    currentAnnualClp,
    laborClp,
    errorClp,
    automatableClp,
    year1SavingsClp,
    year3SavingsClp,
    kondaxYear1Clp,
    paybackMonths,
    roi3y,
  };
}
