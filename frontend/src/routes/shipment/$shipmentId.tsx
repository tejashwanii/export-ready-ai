import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  FileImage,
  FileText,
  Package,
  RefreshCw,
  ShieldCheck,
  Upload,
} from "lucide-react";

import { ApiRequestError } from "@/services/apiClient";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getShipmentById } from "@/services/shipmentService";

const documents = [
  { name: "Commercial Invoice", icon: FileText },
  { name: "Packing List", icon: FileText },
  { name: "Certificate of Origin", icon: ShieldCheck },
  { name: "Product Images", icon: FileImage },
];

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

  const isNotFound = error instanceof ApiRequestError && error.status === 404;

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
                <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {documents.map((document) => {
                    const Icon = document.icon;
                    return (
                      <Card key={document.name}>
                        <CardContent className="flex items-center gap-3 p-5">
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand/10 text-brand">
                            <Icon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-sm font-medium">{document.name}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Not Uploaded</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold tracking-tight">AI Readiness</h2>
                <Card className="mt-4 border-brand/20 bg-brand/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-brand" />
                      Export Readiness
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Upload documents to begin AI analysis.
                    </p>
                  </CardContent>
                </Card>
              </section>

              <section>
                <h2 className="text-xl font-semibold tracking-tight">Actions</h2>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <Button disabled>
                    <Upload />
                    Upload Documents
                  </Button>
                  <Button disabled variant="outline">
                    <ShieldCheck />
                    Analyze Shipment
                  </Button>
                </div>
              </section>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
