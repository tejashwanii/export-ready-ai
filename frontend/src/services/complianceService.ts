import { apiClient } from "./apiClient";

export interface ComplianceCheck {
  key: string;
  label: string;
  passed: boolean;
}

export interface ShipmentCompliance {
  shipment_id: string;
  checks: ComplianceCheck[];
  score: number;
  overall_status: "Ready" | "Ready with Warnings" | "Not Ready";
}

export function getShipmentCompliance(shipmentId: string): Promise<ShipmentCompliance> {
  return apiClient.get<ShipmentCompliance>(`/shipments/${shipmentId}/compliance`);
}
