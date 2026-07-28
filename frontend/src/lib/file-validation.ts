export const acceptedDocumentFileTypes = ["application/pdf", "image/jpeg", "image/png"] as const;

export const acceptedDocumentFileExtensions = [".pdf", ".jpg", ".jpeg", ".png"] as const;

export const documentFileAcceptAttribute = [
  ...acceptedDocumentFileTypes,
  ...acceptedDocumentFileExtensions,
].join(",");

export function validateDocumentFile(file: File): string | null {
  const extension = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
  const hasAcceptedMimeType = acceptedDocumentFileTypes.includes(
    file.type as (typeof acceptedDocumentFileTypes)[number],
  );
  const hasAcceptedExtension = acceptedDocumentFileExtensions.includes(
    extension as (typeof acceptedDocumentFileExtensions)[number],
  );

  if (!hasAcceptedMimeType && !hasAcceptedExtension) {
    return "Upload a PDF, JPG, JPEG, or PNG file.";
  }

  return null;
}
