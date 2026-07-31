from typing import Literal
from uuid import UUID

from pydantic import BaseModel


class RecommendationItem(BaseModel):
    level: Literal["success", "warning"]
    message: str


class RecommendationResponse(BaseModel):
    shipment_id: UUID
    recommendations: list[RecommendationItem]
