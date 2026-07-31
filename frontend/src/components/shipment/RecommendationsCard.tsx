import { useQuery } from "@tanstack/react-query";
import { CheckCircle2, Info, TriangleAlert } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getShipmentRecommendations } from "@/services/recommendationService";

interface RecommendationsCardProps {
  shipmentId: string;
}

export function RecommendationsCard({ shipmentId }: RecommendationsCardProps) {
  const recommendationsQuery = useQuery({
    queryKey: ["shipment-recommendations", shipmentId],
    queryFn: () => getShipmentRecommendations(shipmentId),
    retry: false,
  });

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Info className="h-5 w-5 text-blue-600" />
          AI Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recommendationsQuery.isLoading ? <Skeleton className="h-24 w-full" /> : null}

        {recommendationsQuery.isError ? (
          <p className="text-sm text-muted-foreground">
            Recommendations could not be loaded. Please refresh the page and try again.
          </p>
        ) : null}

        {recommendationsQuery.data ? (
          <ul className="space-y-3">
            {recommendationsQuery.data.recommendations.map((recommendation) => {
              const isSuccess = recommendation.level === "success";

              return (
                <li
                  key={recommendation.message}
                  className={
                    isSuccess
                      ? "flex gap-3 rounded-lg bg-success/10 p-3 text-sm text-success"
                      : "flex gap-3 rounded-lg bg-orange-500/10 p-3 text-sm text-orange-700"
                  }
                >
                  {isSuccess ? (
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  ) : (
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  )}
                  <span>{recommendation.message}</span>
                </li>
              );
            })}
          </ul>
        ) : null}
      </CardContent>
    </Card>
  );
}
