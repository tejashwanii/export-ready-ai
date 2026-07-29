"""Convert legacy Python dictionary strings in documents.extracted_fields to JSON."""

import argparse
import ast
import json
import sqlite3
from pathlib import Path


DEFAULT_DATABASE_PATH = Path(__file__).resolve().parents[1] / "exportpilot.db"


def repair_legacy_extracted_fields(database_path: Path) -> int:
    """Repair legacy dictionary strings and return the number of updated records."""
    with sqlite3.connect(database_path) as connection:
        rows = connection.execute(
            "SELECT id, extracted_fields FROM documents WHERE extracted_fields IS NOT NULL"
        ).fetchall()
        repaired_count = 0

        for document_id, extracted_fields in rows:
            if not isinstance(extracted_fields, str):
                continue

            try:
                json.loads(extracted_fields)
                continue
            except json.JSONDecodeError:
                pass

            try:
                legacy_fields = ast.literal_eval(extracted_fields)
            except (SyntaxError, ValueError):
                print(f"Skipped document {document_id}: extracted_fields is not parseable")
                continue

            if not isinstance(legacy_fields, dict):
                print(f"Skipped document {document_id}: extracted_fields is not a dictionary")
                continue

            connection.execute(
                "UPDATE documents SET extracted_fields = ? WHERE id = ?",
                (json.dumps(legacy_fields), document_id),
            )
            repaired_count += 1

        connection.commit()
    return repaired_count


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--database-path",
        type=Path,
        default=DEFAULT_DATABASE_PATH,
        help="Path to the SQLite database file.",
    )
    arguments = parser.parse_args()
    repaired_count = repair_legacy_extracted_fields(arguments.database_path)
    print(f"Repaired {repaired_count} legacy extracted_fields record(s).")


if __name__ == "__main__":
    main()
