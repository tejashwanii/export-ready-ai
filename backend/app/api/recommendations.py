from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.recommendation import RecommendationResponse
from app.services.recommendation_service import RecommendationService
from app.services.shipment_service import ShipmentService


router = APIRouter(prefix="/shipments/{shipment_id}", tags=["Recommendations"])


@router.get("/recommendations", response_model=RecommendationResponse)
def get_recommendations(
    shipment_id: UUID,
    db: Session = Depends(get_db),
) -> RecommendationResponse:
    if ShipmentService.get_shipment(db, shipment_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shipment not found")

    return RecommendationService.get_recommendations(db, shipment_id)
