import logging
import re


logger = logging.getLogger(__name__)


class FieldExtractionService:
    """Extract document-specific structured fields from OCR text."""

    @classmethod
    def extract_fields(cls, document_type: str, extracted_text: str | None) -> dict[str, str]:
        """Return the fields supported for the supplied document type."""
        if not extracted_text or document_type == "product_images":
            return {}

        extractors = {
            "commercial_invoice": cls._extract_commercial_invoice,
            "packing_list": cls._extract_packing_list,
            "certificate_of_origin": cls._extract_certificate_of_origin,
        }
        extractor = extractors.get(document_type)
        if extractor is None:
            logger.warning("No field extractor configured for document type %s", document_type)
            return {}

        try:
            fields = extractor(extracted_text)
            logger.info("Extracted %d fields from %s", len(fields), document_type)
            return fields
        except Exception as exc:  # pragma: no cover - defensive guard for malformed OCR text
            logger.exception("Field extraction failed for document type %s", document_type, exc_info=exc)
            return {}

    @classmethod
    def _extract_commercial_invoice(cls, text: str) -> dict[str, str]:
        fields = cls._collect_fields(
            text,
            {
                "invoice_number": (r"invoice\s*(?:number|no\.?|#)",),
                "invoice_date": (r"invoice\s*date", "date"),
                "exporter": (r"exporter\s*(?:name|details)?", "seller", "consignor"),
                "importer": (r"importer\s*(?:name|details)?", "buyer", "consignee"),
                "product_name": (r"product\s*(?:name|description)?", r"goods\s*description", r"description\s*of\s*goods", r"item\s*description", "commodity"),
                "hs_code": (r"hs\s*(?:code|n\.?\s*code)?", r"h\.?s\.?\s*(?:code|n)", r"tariff\s*code", r"customs\s*code"),
                "quantity": (r"(?:total\s*)?quantity", r"qty\.?"),
                "invoice_value": (r"invoice\s*(?:value|amount|total)", r"(?:grand\s*)?total\s*(?:invoice\s*)?(?:value|amount)", r"amount\s*payable"),
                "currency": ("currency",),
                "destination_country": (r"destination\s*(?:country)?", r"country\s*of\s*destination", r"final\s*destination"),
                "country_of_origin": (r"country\s*of\s*origin", r"origin\s*country"),
            },
        )

        if "currency" not in fields and "invoice_value" in fields:
            currency = cls._currency_from_value(fields["invoice_value"])
            if currency:
                fields["currency"] = currency

        return fields

    @classmethod
    def _extract_packing_list(cls, text: str) -> dict[str, str]:
        return cls._collect_fields(
            text,
            {
                "gross_weight": (r"gross\s*weight",),
                "net_weight": (r"net\s*weight",),
                "number_of_packages": (r"number\s*of\s*packages", r"no\.?\s*of\s*packages", r"total\s*packages", "packages"),
            },
        )

    @classmethod
    def _extract_certificate_of_origin(cls, text: str) -> dict[str, str]:
        return cls._collect_fields(
            text,
            {
                "certificate_number": (r"certificate\s*(?:number|no\.?|#)", r"certificate\s*of\s*origin\s*(?:number|no\.?|#)"),
                "country_of_origin": (r"country\s*of\s*origin", r"origin\s*country"),
            },
        )

    @classmethod
    def _collect_fields(cls, text: str, field_labels: dict[str, tuple[str, ...]]) -> dict[str, str]:
        return {
            field_name: value
            for field_name, labels in field_labels.items()
            if (value := cls._find_labeled_value(text, labels))
        }

    @staticmethod
    def _find_labeled_value(text: str, labels: tuple[str, ...]) -> str | None:
        labels_pattern = "|".join(f"(?:{label})" for label in labels)
        pattern = re.compile(
            rf"^\s*(?:{labels_pattern})(?:\s*[:#-]\s*|\s+)(?P<value>.+?)\s*$",
            re.IGNORECASE,
        )
        lines = [line.strip() for line in text.splitlines()]

        for index, line in enumerate(lines):
            match = pattern.match(line)
            if match and (value := FieldExtractionService._clean_value(match.group("value"))):
                return value

            if re.fullmatch(rf"\s*(?:{labels_pattern})\s*[:#-]?\s*", line, re.IGNORECASE):
                for next_line in lines[index + 1 :]:
                    if next_line:
                        return FieldExtractionService._clean_value(next_line)

        return None

    @staticmethod
    def _clean_value(value: str) -> str | None:
        cleaned_value = re.sub(r"\s+", " ", value).strip(" :#-\t")
        return cleaned_value or None

    @staticmethod
    def _currency_from_value(value: str) -> str | None:
        match = re.search(r"\b(USD|EUR|GBP|INR|AED|JPY|CNY|AUD|CAD|CHF|SGD)\b|\$", value, re.IGNORECASE)
        if not match:
            return None

        currency = match.group(0).upper()
        return "USD" if currency == "$" else currency
