from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.shipment import Shipment
from app.schemas.shipment import ShipmentCreate, ShipmentUpdate


class ShipmentService:
    @staticmethod
    def create_shipment(db: Session, shipment_data: ShipmentCreate) -> Shipment:
        shipment = Shipment(**shipment_data.model_dump())
        db.add(shipment)
        db.commit()
        db.refresh(shipment)
        return shipment

    @staticmethod
    def get_shipment(db: Session, shipment_id: UUID) -> Shipment | None:
        return db.get(Shipment, shipment_id)

    @staticmethod
    def get_all_shipments(db: Session) -> list[Shipment]:
        return list(db.scalars(select(Shipment)).all())

    @staticmethod
    def update_shipment(
        db: Session,
        shipment_id: UUID,
        shipment_data: ShipmentUpdate,
    ) -> Shipment | None:
        shipment = db.get(Shipment, shipment_id)
        if shipment is None:
            return None

        for field, value in shipment_data.model_dump(exclude_unset=True).items():
            setattr(shipment, field, value)

        db.commit()
        db.refresh(shipment)
        return shipment

    @staticmethod
    def delete_shipment(db: Session, shipment_id: UUID) -> bool:
        shipment = db.get(Shipment, shipment_id)
        if shipment is None:
            return False

        db.delete(shipment)
        db.commit()
        return True
