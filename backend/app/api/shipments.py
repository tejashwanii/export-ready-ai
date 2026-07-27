from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.shipment import Shipment
from app.schemas.shipment import ShipmentCreate, ShipmentResponse, ShipmentUpdate
from app.services.shipment_service import ShipmentService

router = APIRouter(prefix="/shipments", tags=["Shipments"])


@router.post("/", response_model=ShipmentResponse, status_code=status.HTTP_201_CREATED)
def create_shipment(
    shipment_data: ShipmentCreate,
    db: Session = Depends(get_db),
) -> Shipment:
    return ShipmentService.create_shipment(db, shipment_data)


@router.get("/", response_model=list[ShipmentResponse])
def get_all_shipments(db: Session = Depends(get_db)) -> list[Shipment]:
    return ShipmentService.get_all_shipments(db)


@router.get("/{shipment_id}", response_model=ShipmentResponse)
def get_shipment(shipment_id: UUID, db: Session = Depends(get_db)) -> Shipment:
    shipment = ShipmentService.get_shipment(db, shipment_id)
    if shipment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found",
        )
    return shipment


@router.put("/{shipment_id}", response_model=ShipmentResponse)
def update_shipment(
    shipment_id: UUID,
    shipment_data: ShipmentUpdate,
    db: Session = Depends(get_db),
) -> Shipment:
    shipment = ShipmentService.update_shipment(db, shipment_id, shipment_data)
    if shipment is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found",
        )
    return shipment


@router.delete("/{shipment_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_shipment(
    shipment_id: UUID,
    db: Session = Depends(get_db),
) -> Response:
    if not ShipmentService.delete_shipment(db, shipment_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Shipment not found",
        )
    return Response(status_code=status.HTTP_204_NO_CONTENT)
