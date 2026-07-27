import { Link, createFileRoute } from "@tanstack/react-router";
import { type ChangeEvent, type FormEvent, useState } from "react";
import { ArrowLeft, PackagePlus } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createShipment } from "@/services/shipmentService";

type ShipmentFormData = {
  shipmentName: string;
  companyName: string;
  destinationCountry: string;
  productName: string;
};

type ShipmentFormErrors = Partial<Record<keyof ShipmentFormData, string>>;

const initialFormData: ShipmentFormData = {
  shipmentName: "",
  companyName: "",
  destinationCountry: "",
  productName: "",
};

export const Route = createFileRoute("/create-shipment")({
  head: () => ({
    meta: [{ title: "Create Shipment | ExportPilot AI" }],
  }),
  component: CreateShipment,
});

export function CreateShipment() {
  const [formData, setFormData] = useState<ShipmentFormData>(initialFormData);
  const [errors, setErrors] = useState<ShipmentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const field = name as keyof ShipmentFormData;

    setFormData((currentData) => ({ ...currentData, [field]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [field]: undefined }));
    setSuccessMessage(null);
    setErrorMessage(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: ShipmentFormErrors = {};
    const fieldLabels: Record<keyof ShipmentFormData, string> = {
      shipmentName: "Shipment name",
      companyName: "Company name",
      destinationCountry: "Destination country",
      productName: "Product name",
    };

    for (const field of Object.keys(formData) as (keyof ShipmentFormData)[]) {
      if (!formData[field].trim()) {
        nextErrors[field] = `${fieldLabels[field]} is required.`;
      }
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      await createShipment({
        shipment_name: formData.shipmentName.trim(),
        company_name: formData.companyName.trim(),
        destination_country: formData.destinationCountry.trim(),
        product_name: formData.productName.trim(),
      });
      setFormData(initialFormData);
      setSuccessMessage("Shipment created successfully.");
    } catch {
      setErrorMessage("We couldn't create the shipment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-background px-6 py-12 text-foreground sm:py-16">
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </Link>

        <section className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-[0_20px_60px_-20px_rgba(37,99,235,0.25)] sm:p-10">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand">
              <PackagePlus className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-medium text-brand">Shipment workspace</p>
              <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
                Create a new shipment
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                Add the core details to begin preparing your export shipment.
              </p>
            </div>
          </div>

          <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
            {successMessage ? (
              <p
                role="status"
                className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success"
              >
                {successMessage}
              </p>
            ) : null}
            {errorMessage ? (
              <p
                role="alert"
                className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                {errorMessage}
              </p>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="shipmentName">Shipment Name</Label>
              <Input
                id="shipmentName"
                name="shipmentName"
                value={formData.shipmentName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.shipmentName)}
                aria-describedby={errors.shipmentName ? "shipmentName-error" : undefined}
                placeholder="e.g. Mumbai to Singapore electronics export"
              />
              {errors.shipmentName ? (
                <p id="shipmentName-error" className="text-sm text-destructive">
                  {errors.shipmentName}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.companyName)}
                aria-describedby={errors.companyName ? "companyName-error" : undefined}
                placeholder="e.g. Acme Exports Pvt. Ltd."
              />
              {errors.companyName ? (
                <p id="companyName-error" className="text-sm text-destructive">
                  {errors.companyName}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="destinationCountry">Destination Country</Label>
              <Input
                id="destinationCountry"
                name="destinationCountry"
                value={formData.destinationCountry}
                onChange={handleChange}
                aria-invalid={Boolean(errors.destinationCountry)}
                aria-describedby={
                  errors.destinationCountry ? "destinationCountry-error" : undefined
                }
                placeholder="e.g. Singapore"
              />
              {errors.destinationCountry ? (
                <p id="destinationCountry-error" className="text-sm text-destructive">
                  {errors.destinationCountry}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="productName">Product Name</Label>
              <Input
                id="productName"
                name="productName"
                value={formData.productName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.productName)}
                aria-describedby={errors.productName ? "productName-error" : undefined}
                placeholder="e.g. Consumer electronics"
              />
              {errors.productName ? (
                <p id="productName-error" className="text-sm text-destructive">
                  {errors.productName}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
              <Link
                to="/"
                className="inline-flex h-10 items-center justify-center rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand px-4 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:translate-y-[-1px] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-sm"
              >
                <PackagePlus className="h-4 w-4" />
                {isSubmitting ? "Creating Shipment..." : "Create Shipment"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
