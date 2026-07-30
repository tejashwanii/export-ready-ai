from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.compliance import ComplianceResponse
from app.services.compliance_service import ComplianceService
from app.services.shipment_service import ShipmentService


router = APIRouter(prefix="/shipments/{shipment_id}", tags=["Compliance"])


@router.get("/compliance", response_model=ComplianceResponse)
def get_compliance(shipment_id: UUID, db: Session = Depends(get_db)) -> ComplianceResponse:
    if ShipmentService.get_shipment(db, shipment_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shipment not found")

    return ComplianceService.evaluate_shipment(db, shipment_id)
