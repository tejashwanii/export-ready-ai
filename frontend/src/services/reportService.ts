import type { ExportReadinessReport } from "@/lib/readiness";
import type { Shipment } from "@/services/shipmentService";

type JsPdfDocument = {
  setFillColor: (red: number, green: number, blue: number) => void;
  setDrawColor: (red: number, green: number, blue: number) => void;
  setTextColor: (red: number, green: number, blue: number) => void;
  setFont: (fontName: string, fontStyle?: string) => void;
  setFontSize: (size: number) => void;
  rect: (x: number, y: number, width: number, height: number, style: "F") => void;
  text: (text: string | string[], x: number, y: number) => void;
  line: (x1: number, y1: number, x2: number, y2: number) => void;
  save: (fileName: string) => void;
};

type JsPdfConstructor = new (options: { unit: "mm"; format: "a4" }) => JsPdfDocument;

declare global {
  interface Window {
    jspdf?: { jsPDF: JsPdfConstructor };
  }
}

const jsPdfScriptUrl = "https://cdn.jsdelivr.net/npm/jspdf@3.0.4/dist/jspdf.umd.min.js";

function loadJsPdf(): Promise<JsPdfConstructor> {
  if (window.jspdf?.jsPDF) {
    return Promise.resolve(window.jspdf.jsPDF);
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = jsPdfScriptUrl;
    script.async = true;
    script.onload = () => {
      if (window.jspdf?.jsPDF) {
        resolve(window.jspdf.jsPDF);
      } else {
        reject(new Error("The PDF generator did not load."));
      }
    };
    script.onerror = () => reject(new Error("The PDF generator could not be loaded."));
    document.head.appendChild(script);
  });
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value));
}

function safeFileName(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function downloadExportReadinessReport(
  shipment: Shipment,
  readinessReport: ExportReadinessReport,
): Promise<void> {
  const JsPdf = await loadJsPdf();
  const report = new JsPdf({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 20;
  let y = 20;

  const addSectionTitle = (title: string) => {
    report.setTextColor(31, 41, 55);
    report.setFont("helvetica", "bold");
    report.setFontSize(12);
    report.text(title, margin, y);
    y += 4;
    report.setDrawColor(226, 232, 240);
    report.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  report.setFillColor(37, 99, 235);
  report.rect(0, 0, pageWidth, 34, "F");
  report.setTextColor(255, 255, 255);
  report.setFont("helvetica", "bold");
  report.setFontSize(19);
  report.text("ExportPilot AI", margin, 15);
  report.setFont("helvetica", "normal");
  report.setFontSize(11);
  report.text("Export Readiness Report", margin, 23);
  y = 48;

  addSectionTitle("Shipment Information");
  report.setFont("helvetica", "normal");
  report.setFontSize(10);
  const shipmentDetails = [
    ["Shipment Name", shipment.shipment_name],
    ["Company", shipment.company_name],
    ["Destination", shipment.destination_country],
    ["Product", shipment.product_name],
    ["Generated Date", formatDate(new Date())],
  ];
  shipmentDetails.forEach(([label, value]) => {
    report.setTextColor(100, 116, 139);
    report.text(`${label}:`, margin, y);
    report.setTextColor(31, 41, 55);
    report.text(value, 62, y);
    y += 7;
  });
  y += 5;

  addSectionTitle("Export Readiness");
  report.setTextColor(37, 99, 235);
  report.setFont("helvetica", "bold");
  report.setFontSize(26);
  report.text(`${readinessReport.score}%`, margin, y + 5);
  report.setTextColor(31, 41, 55);
  report.setFontSize(10);
  report.text(`Risk Level: ${readinessReport.riskLevel}`, 65, y);
  report.setTextColor(100, 116, 139);
  report.setFont("helvetica", "normal");
  report.text(readinessReport.summary, 65, y + 7);
  y += 18;

  addSectionTitle("Document Checklist");
  report.setFont("helvetica", "normal");
  report.setFontSize(10);
  readinessReport.checklist.forEach((document) => {
    report.setTextColor(document.isUploaded ? 22 : 185, document.isUploaded ? 163 : 28, 74);
    report.text(document.isUploaded ? "PASS" : "MISSING", margin, y);
    report.setTextColor(31, 41, 55);
    report.text(document.label, 48, y);
    y += 7;
  });
  y += 5;

  addSectionTitle("Recommendations");
  report.setFont("helvetica", "normal");
  report.setFontSize(10);
  const firstMissingDocument = readinessReport.checklist.find((document) => !document.isUploaded);
  const reportRecommendations = [
    firstMissingDocument
      ? `Upload ${firstMissingDocument.label}`
      : "All required documents uploaded",
    "Verify HS Code",
    "Review shipment before customs filing",
  ];
  reportRecommendations.forEach((recommendation) => {
    report.setTextColor(37, 99, 235);
    report.text("•", margin, y);
    report.setTextColor(31, 41, 55);
    report.text(recommendation, margin + 5, y);
    y += 7;
  });

  report.setFillColor(248, 250, 252);
  report.rect(0, 278, pageWidth, 19, "F");
  report.setTextColor(100, 116, 139);
  report.setFontSize(8);
  report.text("Generated by ExportPilot AI", margin, 287);
  report.text("Prototype Version", pageWidth - margin - 29, 287);
  report.save(`${safeFileName(shipment.shipment_name) || "shipment"}-readiness-report.pdf`);
}
