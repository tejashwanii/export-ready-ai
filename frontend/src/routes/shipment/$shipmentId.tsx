import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Download,
  FileImage,
  FileText,
  Package,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { ApiRequestError } from "@/services/apiClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UploadCard } from "@/components/shipment/UploadCard";
import { ShipmentIntelligence } from "@/components/shipment/ShipmentIntelligence";
import { Skeleton } from "@/components/ui/skeleton";
import { getExportReadinessReport } from "@/lib/readiness";
import { downloadExportReadinessReport } from "@/services/reportService";
import { getShipmentById } from "@/services/shipmentService";
import {
  getShipmentDocuments,
  type ShipmentDocumentType,
  type UploadedShipmentDocument,
} from "@/services/uploadService";

const documents = [
  { name: "Commercial Invoice", icon: FileText, type: "commercial-invoice" },
  { name: "Packing List", icon: FileText, type: "packing-list" },
  { name: "Certificate of Origin", icon: ShieldCheck, type: "certificate-of-origin" },
  { name: "Product Images", icon: FileImage, type: "product-images" },
] satisfies { name: string; icon: typeof FileText; type: ShipmentDocumentType }[];

export const Route = createFileRoute("/shipment/$shipmentId")({
  head: () => ({
    meta: [{ title: "Shipment Details | ExportPilot AI" }],
  }),
  component: ShipmentDetails,
});

function formatCreatedDate(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function DetailsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-9 w-64" />
      <Card className="p-6">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      </Card>
    </div>
  );
}

export function ShipmentDetails() {
  const { shipmentId } = Route.useParams();
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [isDownloadingReport, setIsDownloadingReport] = useState(false);
  const [reportDownloadError, setReportDownloadError] = useState<string | null>(null);
  const {
    data: shipment,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["shipment", shipmentId],
    queryFn: () => getShipmentById(shipmentId),
    retry: false,
  });
  const { data: uploadedDocuments = [] } = useQuery({
    queryKey: ["shipment-documents", shipmentId],
    queryFn: () => getShipmentDocuments(shipmentId),
  });

  const isNotFound = error instanceof ApiRequestError && error.status === 404;
  const readinessReport = getExportReadinessReport(
    uploadedDocuments.map((document) => document.documentType),
  );

  function handleUploadSuccess(uploadedDocument: UploadedShipmentDocument) {
    queryClient.setQueryData<UploadedShipmentDocument[]>(
      ["shipment-documents", shipmentId],
      (currentDocuments = []) => [
        uploadedDocument,
        ...currentDocuments.filter(
          (document) => document.documentType !== uploadedDocument.documentType,
        ),
      ],
    );
    void queryClient.invalidateQueries({ queryKey: ["shipment-documents", shipmentId] });
    void queryClient.invalidateQueries({ queryKey: ["shipment-compliance", shipmentId] });
    void queryClient.invalidateQueries({ queryKey: ["shipment-recommendations", shipmentId] });
    setHasAnalyzed(false);
  }

  async function handleAnalyzeShipment() {
    setIsAnalyzing(true);
    await new Promise((resolve) => window.setTimeout(resolve, 2500));
    setHasAnalyzed(true);
    setIsAnalyzing(false);
  }

  async function handleDownloadReport() {
    if (!shipment) {
      return;
    }

    setIsDownloadingReport(true);
    setReportDownloadError(null);

    try {
      await downloadExportReadinessReport(shipment, readinessReport);
    } catch {
      setReportDownloadError("We couldn't generate the report. Please try again.");
    } finally {
      setIsDownloadingReport(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>

        <section className="mt-8" aria-live="polite">
          {isLoading ? <DetailsSkeleton /> : null}

          {!isLoading && isNotFound ? (
            <Card className="mx-auto max-w-lg">
              <CardContent className="p-8 text-center">
                <Package className="mx-auto h-10 w-10 text-muted-foreground" />
                <h1 className="mt-4 text-xl font-semibold">Shipment not found</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  This shipment may have been removed or the link is incorrect.
                </p>
                <Button asChild className="mt-5">
                  <Link to="/dashboard">Return to dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {!isLoading && isError && !isNotFound ? (
            <Card className="mx-auto max-w-lg border-destructive/30">
              <CardContent className="p-8 text-center">
                <h1 className="text-xl font-semibold">Couldn&apos;t load this shipment</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Please check your connection and try again.
                </p>
                <Button className="mt-5" variant="outline" onClick={() => refetch()}>
                  <RefreshCw />
                  Try again
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {shipment ? (
            <div className="space-y-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-brand">Shipment workspace</p>
                  <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                    {shipment.shipment_name}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">{shipment.company_name}</p>
                </div>
                <Badge variant="secondary" className="w-fit capitalize">
                  {shipment.status}
                </Badge>
              </div>

              <section>
                <h2 className="text-xl font-semibold tracking-tight">Shipment Information</h2>
                <Card className="mt-4">
                  <CardContent className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Shipment Name</p>
                      <p className="mt-1 font-medium">{shipment.shipment_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Company Name</p>
                      <p className="mt-1 font-medium">{shipment.company_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Destination Country</p>
                      <p className="mt-1 font-medium">{shipment.destination_country}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Product Name</p>
                      <p className="mt-1 font-medium">{shipment.product_name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Status</p>
                      <p className="mt-1 font-medium capitalize">{shipment.status}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                      <div>
                        <p className="text-xs text-muted-foreground">Created Date</p>
                        <p className="mt-1 font-medium">{formatCreatedDate(shipment.created_at)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </section>

              <section>
                <h2 className="text-xl font-semibold tracking-tight">Documents</h2>
                <div id="documents" className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {documents.map((document) => (
                    <UploadCard
                      key={document.type}
                      shipmentId={shipment.id}
                      documentType={document.type}
                      title={document.name}
                      icon={document.icon}
                      serverFileName={
                        uploadedDocuments.find(
                          (uploadedDocument) => uploadedDocument.documentType === document.type,
                        )?.originalFilename
                      }
                      onUploadSuccess={handleUploadSuccess}
                    />
                  ))}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold tracking-tight">Shipment Intelligence</h2>
                <ShipmentIntelligence shipmentId={shipment.id} />
              </section>

              <section>
                <h2 className="text-xl font-semibold tracking-tight">AI Readiness</h2>
                {hasAnalyzed ? (
                  <Card className="mt-4 border-brand/20">
                    <CardHeader className="gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <ShieldCheck className="h-5 w-5 text-brand" />
                          Export Readiness
                        </CardTitle>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {readinessReport.summary}
                        </p>
                      </div>
                      <span className="rounded-lg bg-brand/10 px-3 py-2 text-lg font-semibold text-brand">
                        {readinessReport.score}%
                      </span>
                    </CardHeader>
                    <CardContent className="grid gap-6 border-t border-border/70 pt-6 lg:grid-cols-3">
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Readiness Score
                        </p>
                        <p className="mt-2 text-3xl font-semibold tracking-tight">
                          {readinessReport.score}%
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground">
                          Risk Level:{" "}
                          <span className="font-medium text-foreground">
                            {readinessReport.riskLevel}
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Document Checklist
                        </p>
                        <ul className="mt-3 space-y-2 text-sm">
                          {readinessReport.checklist.map((document) => (
                            <li key={document.label} className="flex items-center gap-2">
                              {document.isUploaded ? (
                                <CheckCircle2 className="h-4 w-4 text-success" />
                              ) : (
                                <XCircle className="h-4 w-4 text-destructive" />
                              )}
                              {document.label}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Recommendations
                        </p>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                          {readinessReport.recommendations.map((recommendation) => (
                            <li key={recommendation} className="flex gap-2">
                              <span className="text-brand">•</span>
                              {recommendation}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="mt-4 border-brand/20 bg-brand/5">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-brand" />
                        Export Readiness
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Upload documents and analyze this shipment to view its readiness report.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </section>

              <section>
                <h2 className="text-xl font-semibold tracking-tight">Actions</h2>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Button
                    type="button"
                    onClick={() =>
                      document.getElementById("documents")?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Upload Documents
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isAnalyzing}
                    onClick={handleAnalyzeShipment}
                  >
                    <ShieldCheck />
                    {isAnalyzing ? "Analyzing Shipment..." : "Analyze Shipment"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={!hasAnalyzed || isDownloadingReport}
                    onClick={handleDownloadReport}
                  >
                    <Download />
                    {isDownloadingReport ? "Preparing Report..." : "Download Report"}
                  </Button>
                </div>
                {reportDownloadError ? (
                  <p className="mt-3 text-sm text-destructive" role="alert">
                    {reportDownloadError}
                  </p>
                ) : null}
              </section>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
