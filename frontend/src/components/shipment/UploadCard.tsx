import { type LucideIcon, CheckCircle2, Upload } from "lucide-react";
import { type ChangeEvent, useRef, useState } from "react";

import { documentFileAcceptAttribute, validateDocumentFile } from "@/lib/file-validation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { type ShipmentDocumentType, uploadShipmentDocument } from "@/services/uploadService";

interface UploadCardProps {
  shipmentId: string;
  documentType: ShipmentDocumentType;
  title: string;
  icon: LucideIcon;
  onUploadSuccess: (documentType: ShipmentDocumentType, fileName: string) => void;
}

export function UploadCard({
  shipmentId,
  documentType,
  title,
  icon: Icon,
  onUploadSuccess,
}: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const validationError = validateDocumentFile(file);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setErrorMessage(null);
    setIsUploading(true);

    try {
      const uploadedDocument = await uploadShipmentDocument({ shipmentId, documentType, file });
      setUploadedFileName(uploadedDocument.fileName);
      onUploadSuccess(documentType, uploadedDocument.fileName);
    } catch {
      setErrorMessage("We couldn't upload this file. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
            <Icon className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium">{title}</p>
            {uploadedFileName ? (
              <div className="mt-1 flex items-center gap-1.5 text-xs text-success">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>Uploaded</span>
              </div>
            ) : (
              <p className="mt-1 text-xs text-muted-foreground">Not Uploaded</p>
            )}
          </div>
        </div>

        {uploadedFileName ? (
          <p className="mt-4 truncate text-xs text-muted-foreground" title={uploadedFileName}>
            {uploadedFileName}
          </p>
        ) : null}
        {errorMessage ? (
          <p className="mt-4 text-xs text-destructive" role="alert">
            {errorMessage}
          </p>
        ) : null}

        <input
          ref={inputRef}
          className="sr-only"
          type="file"
          accept={documentFileAcceptAttribute}
          onChange={handleFileSelection}
          aria-label={`Upload ${title}`}
        />
        <Button
          className="mt-4 w-full"
          size="sm"
          variant="outline"
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
        >
          <Upload />
          {isUploading ? "Uploading..." : uploadedFileName ? "Replace file" : "Upload"}
        </Button>
      </CardContent>
    </Card>
  );
}
