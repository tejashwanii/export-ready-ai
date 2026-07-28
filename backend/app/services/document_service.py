import logging
from datetime import datetime, timezone
from pathlib import Path
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.document import Document
from app.schemas.document import DocumentType
from app.services.document_extraction_service import DocumentExtractionService

UPLOADS_DIRECTORY = Path(__file__).resolve().parents[2] / "uploads"
logger = logging.getLogger(__name__)


class DocumentService:
    @staticmethod
    def get_documents(db: Session, shipment_id: UUID) -> list[Document]:
        statement = (
            select(Document)
            .where(Document.shipment_id == shipment_id)
            .order_by(Document.uploaded_at.desc())
        )
        return list(db.scalars(statement).all())

    @staticmethod
    def save_document(
        db: Session,
        shipment_id: UUID,
        document_type: DocumentType,
        original_filename: str,
        extension: str,
        file_content: bytes,
    ) -> Document:
        shipment_directory = UPLOADS_DIRECTORY / str(shipment_id)
        shipment_directory.mkdir(parents=True, exist_ok=True)

        stored_filename = f"{document_type}{extension}"
        absolute_file_path = shipment_directory / stored_filename
        relative_file_path = str(Path("uploads") / str(shipment_id) / stored_filename)

        existing_document = db.scalar(
            select(Document).where(
                Document.shipment_id == shipment_id,
                Document.document_type == document_type,
            )
        )
        if existing_document is not None:
            previous_file_path = UPLOADS_DIRECTORY.parent / existing_document.file_path
            if previous_file_path != absolute_file_path and previous_file_path.exists():
                previous_file_path.unlink()

        absolute_file_path.write_bytes(file_content)

        if existing_document is None:
            document = Document(
                shipment_id=shipment_id,
                document_type=document_type,
                original_filename=original_filename,
                stored_filename=stored_filename,
                file_path=relative_file_path,
            )
            db.add(document)
        else:
            document = existing_document
            document.original_filename = original_filename
            document.stored_filename = stored_filename
            document.file_path = relative_file_path
            document.uploaded_at = datetime.now(timezone.utc)

        db.commit()
        db.refresh(document)

        try:
            DocumentExtractionService.extract_and_store(
                db=db,
                document=document,
                source_path=absolute_file_path,
                extension=extension,
            )
        except Exception as exc:  # pragma: no cover - defensive guard for background processing
            logger.exception("Unexpected error during document extraction for %s", document.id, exc_info=exc)

        return document
