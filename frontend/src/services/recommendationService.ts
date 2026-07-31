import { apiClient } from "./apiClient";

export interface Recommendation {
  level: "success" | "warning";
  message: string;
}

export interface ShipmentRecommendations {
  shipment_id: string;
  recommendations: Recommendation[];
}

export function getShipmentRecommendations(shipmentId: string): Promise<ShipmentRecommendations> {
  return apiClient.get<ShipmentRecommendations>(`/shipments/${shipmentId}/recommendations`);
}
