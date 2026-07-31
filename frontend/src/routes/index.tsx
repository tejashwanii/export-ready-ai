import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { ComplianceLayers } from "@/components/landing/ComplianceLayers";
import { WhyExportPilot } from "@/components/landing/WhyExportPilot";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ExportPilot AI — Broker-Ready Export Compliance" },
      {
        name: "description",
        content:
          "ExportPilot AI helps Indian MSMEs identify compliance issues before customs filing using official India and Singapore regulations.",
      },
      { property: "og:title", content: "ExportPilot AI — Broker-Ready Export Compliance" },
      {
        property: "og:description",
        content:
          "Pre-shipment compliance intelligence for Indian exporters — document validation, HS code intelligence, CECA eligibility, and explainable AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <ComplianceLayers />
        <WhyExportPilot />
      </main>
      <Footer />
    </div>
  );
}
