export type RegulationAuthority =
  | "DGFT"
  | "ICEGATE"
  | "India-Singapore CECA"
  | "Singapore Customs";

export interface RegulationKnowledge {
  id: string;
  title: string;
  authority: RegulationAuthority;
  complianceCheckKey: string;
  supportingCheckKey?: string;
  mappedTradeRequirement: string;
  purpose: string;
  businessImpact: string;
}

export const regulationKnowledge: RegulationKnowledge[] = [
  {
    id: "commercial-invoice",
    title: "Commercial Invoice",
    authority: "DGFT",
    complianceCheckKey: "commercial_invoice_uploaded",
    mappedTradeRequirement: "Export declaration documentation",
    purpose: "Required for export declaration and customs processing.",
    businessImpact: "Shipment cannot proceed without this document.",
  },
  {
    id: "packing-list",
    title: "Packing List",
    authority: "DGFT",
    complianceCheckKey: "packing_list_uploaded",
    mappedTradeRequirement: "Shipment package documentation",
    purpose: "Supports shipment verification and customs processing.",
    businessImpact: "Customs handling may be delayed without package details.",
  },
  {
    id: "certificate-of-origin",
    title: "Certificate of Origin",
    authority: "India-Singapore CECA",
    complianceCheckKey: "certificate_of_origin_uploaded",
    mappedTradeRequirement: "Preferential tariff eligibility under CECA",
    purpose: "Required to claim preferential tariff benefits under CECA.",
    businessImpact: "Importer may lose preferential tariff benefits.",
  },
  {
    id: "hs-code",
    title: "HS Code",
    authority: "ICEGATE",
    complianceCheckKey: "hs_code_extracted",
    supportingCheckKey: "commercial_invoice_uploaded",
    mappedTradeRequirement: "Customs product classification",
    purpose: "Used for customs classification of exported goods.",
    businessImpact: "Incorrect classification may delay customs clearance.",
  },
  {
    id: "country-of-origin",
    title: "Country of Origin",
    authority: "India-Singapore CECA",
    complianceCheckKey: "country_of_origin_extracted",
    supportingCheckKey: "certificate_of_origin_uploaded",
    mappedTradeRequirement: "Country-of-origin verification for tariff eligibility",
    purpose: "Supports verification of preferential tariff eligibility.",
    businessImpact: "Importer may lose preferential tariff benefits.",
  },
  {
    id: "exporter-details",
    title: "Exporter Details",
    authority: "DGFT",
    complianceCheckKey: "exporter_extracted",
    supportingCheckKey: "commercial_invoice_uploaded",
    mappedTradeRequirement: "Export declaration party information",
    purpose: "Identifies the exporting party for export documentation.",
    businessImpact: "Export documentation may require correction or be delayed.",
  },
  {
    id: "importer-details",
    title: "Importer Details",
    authority: "Singapore Customs",
    complianceCheckKey: "importer_extracted",
    supportingCheckKey: "commercial_invoice_uploaded",
    mappedTradeRequirement: "Import declaration information",
    purpose: "Required by Singapore Customs for import declaration.",
    businessImpact: "Import declaration may be rejected or delayed.",
  },
];
