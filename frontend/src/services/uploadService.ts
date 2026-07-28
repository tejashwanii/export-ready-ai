export type ShipmentDocumentType =
  "commercial-invoice" | "packing-list" | "certificate-of-origin" | "product-images";

export interface UploadedShipmentDocument {
  id: string;
  shipmentId: string;
  documentType: ShipmentDocumentType;
  originalFilename: string;
  storedFilename: string;
  filePath: string;
  uploadedAt: string;
}

interface UploadShipmentDocumentInput {
  shipmentId: string;
  documentType: ShipmentDocumentType;
  file: File;
}

const API_BASE_URL = "http://127.0.0.1:8000";

const backendDocumentTypes: Record<ShipmentDocumentType, string> = {
  "commercial-invoice": "commercial_invoice",
  "packing-list": "packing_list",
  "certificate-of-origin": "certificate_of_origin",
  "product-images": "product_images",
};

type DocumentApiResponse = {
  id: string;
  shipment_id: string;
  document_type: string;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  uploaded_at: string;
};

function toUploadedDocument(document: DocumentApiResponse): UploadedShipmentDocument {
  const documentType = Object.entries(backendDocumentTypes).find(
    ([, backendDocumentType]) => backendDocumentType === document.document_type,
  )?.[0] as ShipmentDocumentType | undefined;

  if (!documentType) {
    throw new Error("Received an unsupported document type from the server.");
  }

  return {
    id: document.id,
    shipmentId: document.shipment_id,
    documentType,
    originalFilename: document.original_filename,
    storedFilename: document.stored_filename,
    filePath: document.file_path,
    uploadedAt: document.uploaded_at,
  };
}

export async function uploadShipmentDocument({
  shipmentId,
  documentType,
  file,
}: UploadShipmentDocumentInput): Promise<UploadedShipmentDocument> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("document_type", backendDocumentTypes[documentType]);

  const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/documents`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("The document upload failed.");
  }

  return toUploadedDocument((await response.json()) as DocumentApiResponse);
}

export async function getShipmentDocuments(
  shipmentId: string,
): Promise<UploadedShipmentDocument[]> {
  const response = await fetch(`${API_BASE_URL}/shipments/${shipmentId}/documents`, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("The document list could not be loaded.");
  }

  const documents = (await response.json()) as DocumentApiResponse[];
  return documents.map(toUploadedDocument);
}
