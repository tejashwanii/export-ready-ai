from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict

DocumentType = Literal[
    "commercial_invoice",
    "packing_list",
    "certificate_of_origin",
    "product_images",
]


class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    shipment_id: UUID
    document_type: DocumentType
    original_filename: str
    stored_filename: str
    file_path: str
    uploaded_at: datetime
    extracted_fields: dict[str, str] | None
