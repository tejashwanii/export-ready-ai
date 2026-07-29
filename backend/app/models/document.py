import ast
import json
import logging
from datetime import datetime, timezone
from uuid import UUID, uuid4

from sqlalchemy import JSON, DateTime, ForeignKey, String, Text, UniqueConstraint, Uuid
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.types import TypeDecorator

from app.database import Base

logger = logging.getLogger(__name__)


class ExtractedFieldsType(TypeDecorator[dict[str, str] | None]):
    """Read legacy Python dictionary strings from the JSON database column."""

    impl = JSON
    cache_ok = True

    def process_bind_param(
        self,
        value: dict[str, str] | None,
        dialect: object,
    ) -> dict[str, str] | None:
        return value

    def result_processor(self, dialect: object, coltype: object):
        """Bypass SQLAlchemy's JSON decoder so legacy strings can be handled first."""

        def process(value: object) -> dict[str, str] | None:
            return self.process_result_value(value, dialect)

        return process

    def process_result_value(self, value: object, dialect: object) -> dict[str, str] | None:
        if value is None:
            return None
        if isinstance(value, dict):
            return value
        if not isinstance(value, str):
            logger.warning("Unexpected extracted_fields value type: %s", type(value).__name__)
            return {}

        try:
            parsed_value = json.loads(value)
        except json.JSONDecodeError:
            try:
                parsed_value = ast.literal_eval(value)
            except (SyntaxError, ValueError):
                logger.warning("Unable to parse legacy extracted_fields value")
                return {}

        if not isinstance(parsed_value, dict):
            logger.warning("Extracted_fields value is not a JSON object")
            return {}
        return parsed_value


class Document(Base):
    """Metadata for a document uploaded for an export shipment."""

    __tablename__ = "documents"
    __table_args__ = (UniqueConstraint("shipment_id", "document_type"),)

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    shipment_id: Mapped[UUID] = mapped_column(
        Uuid,
        ForeignKey("shipments.id", ondelete="CASCADE"),
        nullable=False,
    )
    document_type: Mapped[str] = mapped_column(String, nullable=False)
    original_filename: Mapped[str] = mapped_column(String, nullable=False)
    stored_filename: Mapped[str] = mapped_column(String, nullable=False)
    file_path: Mapped[str] = mapped_column(String, nullable=False)
    uploaded_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    extracted_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    extracted_fields: Mapped[dict[str, str] | None] = mapped_column(ExtractedFieldsType(), nullable=True)
    extracted_at: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )
