import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, ShieldCheck, XCircle } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { RecommendationsCard } from "@/components/shipment/RecommendationsCard";
import { RegulationIntelligence } from "@/components/shipment/RegulationIntelligence";
import { getShipmentCompliance } from "@/services/complianceService";
import { getShipmentDocuments, type UploadedShipmentDocument } from "@/services/uploadService";

interface ShipmentIntelligenceProps {
  shipmentId: string;
}

const extractedInformation = [
  { key: "invoice_number", label: "Invoice Number" },
  { key: "exporter", label: "Exporter" },
  { key: "importer", label: "Importer" },
  { key: "product_name", label: "Product Name" },
  { key: "hs_code", label: "HS Code" },
  { key: "quantity", label: "Quantity" },
  { key: "invoice_value", label: "Invoice Value" },
  { key: "currency", label: "Currency" },
  { key: "country_of_origin", label: "Country of Origin" },
] as const;

function getExtractedValue(documents: UploadedShipmentDocument[], key: string) {
  const preferredDocument = documents.find(
    (document) => document.documentType === "commercial-invoice",
  );
  const preferredValue = preferredDocument?.extractedFields?.[key];

  if (preferredValue) {
    return preferredValue;
  }

  return documents
    .map((document) => document.extractedFields?.[key])
    .find((value): value is string => Boolean(value));
}

function IntelligenceSkeleton() {
  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <Skeleton className="h-52 w-full" />
      <Skeleton className="h-52 w-full" />
      <Skeleton className="h-64 w-full lg:col-span-2" />
    </div>
  );
}

export function ShipmentIntelligence({ shipmentId }: ShipmentIntelligenceProps) {
  const complianceQuery = useQuery({
    queryKey: ["shipment-compliance", shipmentId],
    queryFn: () => getShipmentCompliance(shipmentId),
    retry: false,
  });
  const documentsQuery = useQuery({
    queryKey: ["shipment-documents", shipmentId],
    queryFn: () => getShipmentDocuments(shipmentId),
  });

  if (complianceQuery.isLoading || documentsQuery.isLoading) {
    return <IntelligenceSkeleton />;
  }

  if (complianceQuery.isError || documentsQuery.isError) {
    return (
      <Card className="mt-4 border-destructive/30">
        <CardContent className="p-6 text-sm text-muted-foreground">
          Shipment intelligence could not be loaded. Please refresh the page and try again.
        </CardContent>
      </Card>
    );
  }

  const compliance = complianceQuery.data;
  const documents = documentsQuery.data ?? [];

  if (!compliance) {
    return null;
  }

  return (
    <div className="mt-4 grid gap-4 lg:grid-cols-2">
      <Card className="border-brand/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-brand" />
            Readiness
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-3xl font-semibold tracking-tight">{compliance.score}%</p>
              <p className="mt-1 text-sm text-muted-foreground">Readiness Score</p>
            </div>
            <span className="rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
              {compliance.overall_status}
            </span>
          </div>
          <Progress value={compliance.score} className="mt-5" aria-label="Readiness score" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Compliance Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {compliance.checks.map((check) => (
              <li key={check.key} className="flex items-center gap-2">
                {check.passed ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                )}
                <span>{check.label}</span>
                <span className={check.passed ? "ml-auto text-xs font-medium text-success" : "ml-auto text-xs font-medium text-destructive"}>
                  {check.passed ? "PASS" : "FAIL"}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <RegulationIntelligence complianceChecks={compliance.checks} />

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Extracted Information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {extractedInformation.map((field) => (
            <div key={field.key}>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {field.label}
              </p>
              <p className="mt-1 break-words text-sm font-medium">
                {getExtractedValue(documents, field.key) ?? "Not available"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      <RecommendationsCard shipmentId={shipmentId} />
    </div>
  );
}
