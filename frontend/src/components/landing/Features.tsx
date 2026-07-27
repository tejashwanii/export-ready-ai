import { motion } from "framer-motion";
import {
  FileCheck2,
  Binary,
  BadgePercent,
  ClipboardCheck,
  Lightbulb,
  FileBarChart2,
  type LucideIcon,
} from "lucide-react";

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: FileCheck2, title: "Document Validation", desc: "Upload invoices, packing lists and certificates for instant structural and field-level validation." },
  { icon: Binary, title: "HS Code Intelligence", desc: "AI-assisted HS code confidence analysis with alternate suggestions and rationale." },
  { icon: BadgePercent, title: "CECA Eligibility", desc: "Check preferential tariff eligibility under India–Singapore CECA in seconds." },
  { icon: ClipboardCheck, title: "Customs Readiness", desc: "Assess shipment readiness against both India export regulations and Singapore import requirements before filing." },
  { icon: Lightbulb, title: "Explainable AI", desc: "Every recommendation includes reasoning, supporting regulations, and the issuing authority." },
  { icon: FileBarChart2, title: "Export Readiness Report", desc: "Generate a broker-ready report with compliance findings, CECA eligibility, and evidence-backed recommendations." },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">Platform</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Everything you need before customs filing
        </h2>
        <p className="mt-3 text-muted-foreground">
          A single workspace to validate documents, check regulations, and hand a clean shipment to your broker.
        </p>
      </div>
      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.4, delay: (i % 3) * 0.08 }}
            whileHover={{ y: -4 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
              <f.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 text-base font-semibold text-foreground">{f.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}