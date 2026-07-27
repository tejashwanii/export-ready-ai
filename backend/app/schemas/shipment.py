from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class ShipmentCreate(BaseModel):
    shipment_name: str
    company_name: str
    destination_country: str
    product_name: str


class ShipmentUpdate(BaseModel):
    shipment_name: str | None = None
    company_name: str | None = None
    destination_country: str | None = None
    product_name: str | None = None
    status: str | None = None


class ShipmentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    shipment_name: str
    company_name: str
    destination_country: str
    product_name: str
    status: str
    created_at: datetime
    updated_at: datetime
