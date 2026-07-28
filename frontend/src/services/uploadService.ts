export type ShipmentDocumentType =
  "commercial-invoice" | "packing-list" | "certificate-of-origin" | "product-images";

export interface UploadedShipmentDocument {
  documentType: ShipmentDocumentType;
  fileName: string;
  uploadedAt: string;
}

interface UploadShipmentDocumentInput {
  shipmentId: string;
  documentType: ShipmentDocumentType;
  file: File;
}

/**
 * Temporary frontend upload implementation. Replace with a multipart request when
 * the shipment document upload endpoint is available in the backend.
 */
export async function uploadShipmentDocument({
  documentType,
  file,
}: UploadShipmentDocumentInput): Promise<UploadedShipmentDocument> {
  await new Promise((resolve) => window.setTimeout(resolve, 700));

  return {
    documentType,
    fileName: file.name,
    uploadedAt: new Date().toISOString(),
  };
}
