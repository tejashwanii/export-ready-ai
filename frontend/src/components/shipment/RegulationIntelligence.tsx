import { CheckCircle2, Info, ShieldCheck, TriangleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { regulationKnowledge } from "@/config/regulationKnowledge";
import type { ComplianceCheck } from "@/services/complianceService";
import {
  getAuthorityCoverage,
  getRegulationCoveragePercentage,
  mapRegulationKnowledge,
} from "@/utils/regulationMapper";

import { RegulationCard } from "./RegulationCard";

interface RegulationIntelligenceProps {
  complianceChecks: ComplianceCheck[];
}

export function RegulationIntelligence({ complianceChecks }: RegulationIntelligenceProps) {
  const regulations = mapRegulationKnowledge(regulationKnowledge, complianceChecks);
  const authorityCoverage = getAuthorityCoverage(regulations);
  const coverage = getRegulationCoveragePercentage(regulations);

  return (
    <div className="space-y-4 lg:col-span-2">
      <div>
        <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <ShieldCheck className="h-5 w-5 text-brand" />
          Cross-Border Compliance Intelligence
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className="rounded-full text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="About Cross-Border Compliance Intelligence"
                >
                  <Info className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs leading-relaxed" side="right">
                This section explains why ExportPilot AI performs each compliance check and how it maps to publicly available India-Singapore trade requirements. It does not represent a live integration with government systems.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Understand the authorities, purpose, and business impact behind each compliance requirement.
        </p>
      </div>

      <div className="flex gap-3 rounded-lg border border-blue-500/20 bg-blue-500/5 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
        <p>
          ExportPilot AI explains compliance using its built-in Regulation Knowledge Layer based on publicly available India-Singapore trade guidance. This prototype does not directly query government systems.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {regulations.map((regulation) => (
          <RegulationCard key={regulation.id} regulation={regulation} />
        ))}
      </div>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Trade Requirement Coverage</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Coverage reflects mapped trade requirements satisfied by the current compliance result. It is not a live authority-system status.
            </p>
          </div>
          <span className="rounded-lg bg-brand/10 px-3 py-2 text-lg font-semibold text-brand">
            {coverage}%
          </span>
        </CardHeader>
        <CardContent className="space-y-5">
          <Progress value={coverage} aria-label="Regulation coverage" />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {authorityCoverage.map((item) => (
              <div key={item.authority} className="rounded-lg border border-border/70 p-3">
                <p className="text-sm font-medium">{item.authority} Requirements</p>
                <p className={`mt-2 flex items-center gap-1 text-xs font-medium ${item.covered ? "text-success" : "text-amber-700"}`}>
                  {item.covered ? (
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <TriangleAlert className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  {item.covered
                    ? "All mapped requirements satisfied"
                    : "Some mapped requirements need attention"}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
