from dataclasses import dataclass
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.document import Document
from app.schemas.compliance import ComplianceCheckResponse, ComplianceResponse
from app.services.document_service import DocumentService


@dataclass(frozen=True)
class ComplianceRule:
    key: str
    label: str
    document_type: str
    field_name: str | None = None


class ComplianceService:
    """Evaluate shipment documents against the current compliance rule set."""

    RULES = (
        ComplianceRule("commercial_invoice_uploaded", "Commercial Invoice uploaded", "commercial_invoice"),
        ComplianceRule("packing_list_uploaded", "Packing List uploaded", "packing_list"),
        ComplianceRule("certificate_of_origin_uploaded", "Certificate of Origin uploaded", "certificate_of_origin"),
        ComplianceRule("hs_code_extracted", "HS Code extracted", "commercial_invoice", "hs_code"),
        ComplianceRule("exporter_extracted", "Exporter extracted", "commercial_invoice", "exporter"),
        ComplianceRule("importer_extracted", "Importer extracted", "commercial_invoice", "importer"),
        ComplianceRule("invoice_value_extracted", "Invoice Value extracted", "commercial_invoice", "invoice_value"),
        ComplianceRule("country_of_origin_extracted", "Country of Origin extracted", "certificate_of_origin", "country_of_origin"),
    )

    @classmethod
    def evaluate_shipment(cls, db: Session, shipment_id: UUID) -> ComplianceResponse:
        documents = DocumentService.get_documents(db, shipment_id)
        documents_by_type = {document.document_type: document for document in documents}
        checks = [cls._evaluate_rule(rule, documents_by_type) for rule in cls.RULES]
        score = round(sum(check.passed for check in checks) / len(checks) * 100)

        return ComplianceResponse(
            shipment_id=shipment_id,
            checks=checks,
            score=score,
            overall_status=cls._get_overall_status(score),
        )

    @staticmethod
    def _evaluate_rule(
        rule: ComplianceRule,
        documents_by_type: dict[str, Document],
    ) -> ComplianceCheckResponse:
        document = documents_by_type.get(rule.document_type)
        passed = document is not None

        if passed and rule.field_name is not None:
            extracted_fields = document.extracted_fields or {}
            passed = bool(extracted_fields.get(rule.field_name))

        return ComplianceCheckResponse(key=rule.key, label=rule.label, passed=passed)

    @staticmethod
    def _get_overall_status(score: int) -> str:
        if score == 100:
            return "Ready"
        if score >= 70:
            return "Ready with Warnings"
        return "Not Ready"
