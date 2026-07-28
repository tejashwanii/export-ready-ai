import type { ShipmentDocumentType } from "@/services/uploadService";

const requiredDocuments: { type: ShipmentDocumentType; label: string }[] = [
  { type: "commercial-invoice", label: "Commercial Invoice" },
  { type: "packing-list", label: "Packing List" },
  { type: "certificate-of-origin", label: "Certificate of Origin" },
  { type: "product-images", label: "Product Images" },
];

export type ReadinessRiskLevel = "Low" | "Medium" | "High";

export interface ExportReadinessReport {
  score: number;
  riskLevel: ReadinessRiskLevel;
  summary: string;
  checklist: { label: string; isUploaded: boolean }[];
  recommendations: string[];
}

export function getExportReadinessReport(
  uploadedDocumentTypes: readonly ShipmentDocumentType[],
): ExportReadinessReport {
  const uploadedTypes = new Set(uploadedDocumentTypes);
  const checklist = requiredDocuments.map((document) => ({
    label: document.label,
    isUploaded: uploadedTypes.has(document.type),
  }));
  const uploadedCount = checklist.filter((document) => document.isUploaded).length;
  const missingCount = checklist.length - uploadedCount;
  const score = (uploadedCount / checklist.length) * 100;

  return {
    score,
    riskLevel: score === 100 ? "Low" : score >= 50 ? "Medium" : "High",
    summary:
      missingCount === 0
        ? "All required documents uploaded."
        : `${missingCount} document${missingCount === 1 ? "" : "s"} missing.`,
    checklist,
    recommendations: [
      ...(missingCount > 0 ? ["Upload missing documents."] : []),
      "Verify shipment information.",
      "Complete documentation before export.",
    ],
  };
}
