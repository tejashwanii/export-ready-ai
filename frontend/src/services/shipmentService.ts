import { apiClient } from "./apiClient";

export interface ShipmentCreateData {
  shipment_name: string;
  company_name: string;
  destination_country: string;
  product_name: string;
}

export interface ShipmentUpdateData {
  shipment_name?: string;
  company_name?: string;
  destination_country?: string;
  product_name?: string;
  status?: string;
}

export interface Shipment {
  id: string;
  shipment_name: string;
  company_name: string;
  destination_country: string;
  product_name: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export function createShipment(data: ShipmentCreateData): Promise<Shipment> {
  return apiClient.post<Shipment>("/shipments/", data);
}

export function getShipments(): Promise<Shipment[]> {
  return apiClient.get<Shipment[]>("/shipments/");
}

export function getShipmentById(id: string): Promise<Shipment> {
  return apiClient.get<Shipment>(`/shipments/${id}`);
}

export function updateShipment(id: string, data: ShipmentUpdateData): Promise<Shipment> {
  return apiClient.put<Shipment>(`/shipments/${id}`, data);
}

export function deleteShipment(id: string): Promise<void> {
  return apiClient.delete(`/shipments/${id}`);
}
