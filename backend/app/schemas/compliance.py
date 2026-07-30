from typing import Literal
from uuid import UUID

from pydantic import BaseModel


class ComplianceCheckResponse(BaseModel):
    key: str
    label: str
    passed: bool


class ComplianceResponse(BaseModel):
    shipment_id: UUID
    checks: list[ComplianceCheckResponse]
    score: int
    overall_status: Literal["Ready", "Ready with Warnings", "Not Ready"]
