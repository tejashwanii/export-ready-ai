from pathlib import Path
from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.document import DocumentResponse, DocumentType
from app.services.document_service import DocumentService
from app.services.shipment_service import ShipmentService

router = APIRouter(prefix="/shipments/{shipment_id}/documents", tags=["Documents"])

ALLOWED_CONTENT_TYPES = {"application/pdf", "image/jpeg", "image/png"}
ALLOWED_EXTENSIONS = {".pdf", ".jpg", ".jpeg", ".png"}


def validate_upload(file: UploadFile) -> str:
    extension = Path(file.filename or "").suffix.lower()
    if file.content_type not in ALLOWED_CONTENT_TYPES or extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PDF, JPG, JPEG, and PNG files are supported.",
        )
    return extension


@router.post("", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    shipment_id: UUID,
    file: UploadFile = File(...),
    document_type: DocumentType = Form(...),
    db: Session = Depends(get_db),
):
    if ShipmentService.get_shipment(db, shipment_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shipment not found")

    extension = validate_upload(file)
    return DocumentService.save_document(
        db=db,
        shipment_id=shipment_id,
        document_type=document_type,
        original_filename=file.filename or f"{document_type}{extension}",
        extension=extension,
        file_content=await file.read(),
    )


@router.get("", response_model=list[DocumentResponse])
def get_documents(shipment_id: UUID, db: Session = Depends(get_db)):
    if ShipmentService.get_shipment(db, shipment_id) is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shipment not found")

    return DocumentService.get_documents(db, shipment_id)
