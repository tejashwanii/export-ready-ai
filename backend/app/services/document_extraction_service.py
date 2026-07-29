import logging
from datetime import datetime, timezone
from io import BytesIO
from pathlib import Path

import fitz
import pytesseract
from PIL import Image
from sqlalchemy.orm import Session

from app.models.document import Document
from app.services.field_extraction_service import FieldExtractionService

logger = logging.getLogger(__name__)


class DocumentExtractionService:
    """Extract readable text from uploaded documents using PyMuPDF and OCR fallback."""

    @staticmethod
    def extract_text_from_file(source_path: Path, extension: str) -> str | None:
        if extension.lower() == ".pdf":
            return DocumentExtractionService._extract_from_pdf(source_path)

        if extension.lower() in {".png", ".jpg", ".jpeg"}:
            return DocumentExtractionService._extract_from_image(source_path)

        return None

    @staticmethod
    def _extract_from_pdf(source_path: Path) -> str | None:
        try:
            document = fitz.open(source_path)
            extracted_text_parts: list[str] = []
            for page in document:
                page_text = page.get_text() or ""
                if page_text.strip():
                    extracted_text_parts.append(page_text.strip())

            if extracted_text_parts:
                logger.info("Extracted text from PDF using PyMuPDF: %s", source_path)
                return "\n\n".join(extracted_text_parts)

            logger.info("PyMuPDF returned no text for %s; falling back to OCR", source_path)
            return DocumentExtractionService._ocr_pdf(source_path)
        except Exception as exc:
            logger.exception("PyMuPDF extraction failed for %s", source_path, exc_info=exc)
            return DocumentExtractionService._ocr_pdf(source_path)

    @staticmethod
    def _ocr_pdf(source_path: Path) -> str | None:
        try:
            document = fitz.open(source_path)
            text_parts: list[str] = []
            for page_number in range(len(document)):
                page = document.load_page(page_number)
                image_matrix = fitz.Matrix(2, 2)
                pix = page.get_pixmap(matrix=image_matrix, alpha=False)
                image_bytes = pix.tobytes("png")
                image = Image.open(BytesIO(image_bytes))
                text = pytesseract.image_to_string(image)
                if text.strip():
                    text_parts.append(text.strip())

            if text_parts:
                logger.info("OCR extraction succeeded for %s", source_path)
                return "\n\n".join(text_parts)

            logger.warning("OCR returned no text for %s", source_path)
            return None
        except Exception as exc:
            logger.exception("OCR extraction failed for %s", source_path, exc_info=exc)
            return None

    @staticmethod
    def _extract_from_image(source_path: Path) -> str | None:
        try:
            image = Image.open(source_path)
            text = pytesseract.image_to_string(image)
            if text.strip():
                logger.info("OCR extraction succeeded for %s", source_path)
                return text.strip()
            logger.warning("OCR returned no text for %s", source_path)
            return None
        except Exception as exc:
            logger.exception("OCR extraction failed for %s", source_path, exc_info=exc)
            return None

    @staticmethod
    def extract_and_store(db: Session, document: Document, source_path: Path, extension: str) -> None:
        extracted_text = DocumentExtractionService.extract_text_from_file(source_path, extension)
        document.extracted_text = extracted_text
        document.extracted_fields = FieldExtractionService.extract_fields(
            document.document_type,
            extracted_text,
        )
        document.extracted_at = datetime.now(timezone.utc) if extracted_text is not None else None
        db.add(document)
        db.commit()
        db.refresh(document)
        if extracted_text is None:
            logger.warning("No text extracted for document %s", document.id)
        else:
            logger.info("Stored extracted text and fields for document %s", document.id)
