from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from app.core.config import get_settings

settings = get_settings()

engine_options: dict[str, object] = {}
if settings.database_url.startswith("sqlite"):
    engine_options["connect_args"] = {"check_same_thread": False}

engine = create_engine(settings.database_url, **engine_options)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    """Base class for future SQLAlchemy models."""


def initialize_database() -> None:
    """Create tables and ensure extraction columns exist for existing databases."""

    Base.metadata.create_all(bind=engine)
    with engine.begin() as connection:
        inspector = inspect(connection)
        if not inspector.has_table("documents"):
            return

        existing_columns = {column["name"] for column in inspector.get_columns("documents")}
        if "extracted_text" not in existing_columns:
            connection.execute(text("ALTER TABLE documents ADD COLUMN extracted_text TEXT"))
        if "extracted_at" not in existing_columns:
            connection.execute(text("ALTER TABLE documents ADD COLUMN extracted_at DATETIME"))


def get_db():
    """Provide a database session for future request dependencies."""

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
