import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, Globe2, Package, Plus, RefreshCw } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getShipments, type Shipment } from "@/services/shipmentService";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Shipment Dashboard | ExportPilot AI" }],
  }),
  component: Dashboard,
});

function formatCreatedDate(createdAt: string) {
  const date = new Date(createdAt);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function ShipmentCard({ shipment }: { shipment: Shipment }) {
  return (
    <Card className="flex h-full flex-col border-border/80 shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="gap-4 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 space-y-2">
          <CardTitle className="truncate text-lg">{shipment.shipment_name}</CardTitle>
          <p className="text-sm text-muted-foreground">{shipment.company_name}</p>
        </div>
        <Badge variant="secondary" className="w-fit shrink-0 capitalize">
          {shipment.status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <Globe2 className="h-4 w-4 shrink-0 text-brand" />
          <div>
            <p className="text-xs text-muted-foreground">Destination</p>
            <p className="font-medium">{shipment.destination_country}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <Package className="h-4 w-4 shrink-0 text-brand" />
          <div>
            <p className="text-xs text-muted-foreground">Product</p>
            <p className="font-medium">{shipment.product_name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <CalendarDays className="h-4 w-4 shrink-0 text-brand" />
          <div>
            <p className="text-xs text-muted-foreground">Created</p>
            <p className="font-medium">{formatCreatedDate(shipment.created_at)}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="mt-auto justify-end border-t border-border/70 pt-4">
        {/* TODO: Link to the individual shipment once its detail route is available. */}
        <Button variant="outline" disabled aria-label={`Open ${shipment.shipment_name}`}>
          Open
          <ArrowRight />
        </Button>
      </CardFooter>
    </Card>
  );
}

function ShipmentCardSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>
      <div className="mt-7 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </Card>
  );
}

export function Dashboard() {
  const {
    data: shipments,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["shipments"],
    queryFn: getShipments,
  });

  return (
    <main className="min-h-screen bg-background px-6 py-10 text-foreground sm:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-brand">Shipment workspace</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
              Shipment dashboard
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Track and manage your export shipments in one place.
            </p>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link to="/create-shipment">
              <Plus />
              Create Shipment
            </Link>
          </Button>
        </div>

        <section className="mt-10" aria-live="polite">
          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, index) => (
                <ShipmentCardSkeleton key={index} />
              ))}
            </div>
          ) : null}

          {isError ? (
            <Card className="mx-auto max-w-lg border-destructive/30">
              <CardContent className="p-6 text-center">
                <h2 className="text-lg font-semibold">Couldn&apos;t load shipments</h2>
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

          {!isLoading && !isError && shipments?.length === 0 ? (
            <Card className="mx-auto max-w-lg">
              <CardContent className="p-8 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand/10 text-brand">
                  <Package className="h-6 w-6" />
                </span>
                <h2 className="mt-4 text-lg font-semibold">No shipments yet</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Create your first shipment to begin organizing your exports.
                </p>
                <Button asChild className="mt-5">
                  <Link to="/create-shipment">
                    <Plus />
                    Create Shipment
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : null}

          {!isLoading && !isError && shipments && shipments.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {shipments.map((shipment) => (
                <ShipmentCard key={shipment.id} shipment={shipment} />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
