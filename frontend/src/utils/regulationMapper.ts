import type { ComplianceCheck } from "@/services/complianceService";
import type { RegulationAuthority, RegulationKnowledge } from "@/config/regulationKnowledge";

export type RegulationValidationStatus = "verified" | "low_confidence" | "missing";

export interface MappedRegulation extends RegulationKnowledge {
  validationStatus: RegulationValidationStatus;
}

export interface AuthorityCoverage {
  authority: RegulationAuthority;
  covered: boolean;
}

function isCheckPassed(checks: Map<string, boolean>, key: string) {
  return checks.get(key) === true;
}

export function mapRegulationKnowledge(
  knowledge: RegulationKnowledge[],
  complianceChecks: ComplianceCheck[],
): MappedRegulation[] {
  const checks = new Map(complianceChecks.map((check) => [check.key, check.passed]));

  return knowledge.map((regulation) => ({
    ...regulation,
    validationStatus: isCheckPassed(checks, regulation.complianceCheckKey)
      ? "verified"
      : regulation.supportingCheckKey && isCheckPassed(checks, regulation.supportingCheckKey)
        ? "low_confidence"
        : "missing",
  }));
}

export function getAuthorityCoverage(regulations: MappedRegulation[]): AuthorityCoverage[] {
  const authorities = Array.from(new Set(regulations.map((regulation) => regulation.authority)));

  return authorities.map((authority) => {
    const authorityRegulations = regulations.filter(
      (regulation) => regulation.authority === authority,
    );
    return {
      authority,
      covered: authorityRegulations.every(
        (regulation) => regulation.validationStatus === "verified",
      ),
    };
  });
}

export function getRegulationCoveragePercentage(regulations: MappedRegulation[]) {
  if (regulations.length === 0) {
    return 0;
  }

  const coveredCount = regulations.filter(
    (regulation) => regulation.validationStatus === "verified",
  ).length;
  return Math.round((coveredCount / regulations.length) * 100);
}
