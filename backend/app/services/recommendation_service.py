from uuid import UUID

from sqlalchemy.orm import Session

from app.schemas.recommendation import RecommendationItem, RecommendationResponse
from app.services.compliance_service import ComplianceService


class RecommendationService:
    """Create actionable shipment recommendations from compliance results."""

    FAILED_CHECK_RECOMMENDATIONS = {
        "commercial_invoice_uploaded": "Upload Commercial Invoice.",
        "packing_list_uploaded": "Upload Packing List.",
        "certificate_of_origin_uploaded": "Upload Certificate of Origin.",
        "hs_code_extracted": "Add HS Code to Commercial Invoice.",
        "exporter_extracted": "Add Exporter information.",
        "importer_extracted": "Add Importer information.",
        "invoice_value_extracted": "Verify Invoice Value.",
        "country_of_origin_extracted": "Add Country of Origin.",
    }
    READY_RECOMMENDATIONS = (
        "Shipment appears ready for export.",
        "Verify information before customs submission.",
        "Download Export Readiness Report.",
    )

    @classmethod
    def get_recommendations(cls, db: Session, shipment_id: UUID) -> RecommendationResponse:
        compliance = ComplianceService.evaluate_shipment(db, shipment_id)
        failed_checks = [check for check in compliance.checks if not check.passed]

        if not failed_checks:
            recommendations = [
                RecommendationItem(level="success", message=message)
                for message in cls.READY_RECOMMENDATIONS
            ]
        else:
            recommendations = [
                RecommendationItem(
                    level="warning",
                    message=cls.FAILED_CHECK_RECOMMENDATIONS.get(
                        check.key,
                        f"Resolve the following compliance requirement: {check.label}.",
                    ),
                )
                for check in failed_checks
            ]

        return RecommendationResponse(
            shipment_id=shipment_id,
            recommendations=recommendations,
        )
