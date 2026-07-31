import { CheckCircle2, TriangleAlert, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MappedRegulation } from "@/utils/regulationMapper";

interface RegulationCardProps {
  regulation: MappedRegulation;
}

const validationDisplay = {
  verified: {
    label: "Requirement satisfied",
    className: "bg-success/10 text-success",
    Icon: CheckCircle2,
  },
  low_confidence: {
    label: "Requires review",
    className: "bg-amber-500/10 text-amber-700",
    Icon: TriangleAlert,
  },
  missing: {
    label: "Required information missing",
    className: "bg-destructive/10 text-destructive",
    Icon: XCircle,
  },
} as const;

export function RegulationCard({ regulation }: RegulationCardProps) {
  const status = validationDisplay[regulation.validationStatus];

  return (
    <Card>
      <CardHeader className="gap-3 pb-3 sm:flex-row sm:items-start sm:justify-between">
        <CardTitle className="text-base">{regulation.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Requirement</p>
          <p className="mt-1 font-medium">{regulation.title}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Authority</p>
          <p className="mt-1 text-muted-foreground">{regulation.authority}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Mapped Trade Requirement
          </p>
          <p className="mt-1 text-muted-foreground">{regulation.mappedTradeRequirement}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Why ExportPilot checked this
          </p>
          <p className="mt-1 text-muted-foreground">{regulation.purpose}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Current Validation
          </p>
          <span className={`mt-1 flex w-fit items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${status.className}`}>
            <status.Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {status.label}
          </span>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Business Impact
          </p>
          <p className="mt-1 text-muted-foreground">{regulation.businessImpact}</p>
        </div>
      </CardContent>
    </Card>
  );
}
