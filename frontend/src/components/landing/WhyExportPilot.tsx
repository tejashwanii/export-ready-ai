import { motion } from "framer-motion";
import { Check, X } from "lucide-react";

const rows = [
  ["Problems found after filing", "Problems detected before filing"],
  ["Manual compliance checks", "AI-assisted validation"],
  ["Reactive corrections", "Evidence-backed recommendations"],
  ["Problems discovered late in the export process", "Broker-ready shipments with explainable compliance checks"],
];

export function WhyExportPilot() {
  return (
    <section id="why" className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">Why ExportPilot</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          The difference at every step
        </h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      >
        <div className="grid grid-cols-2 border-b border-border bg-surface text-xs font-medium uppercase tracking-wider text-muted-foreground">
          <div className="p-5">Current Process</div>
          <div className="flex items-center gap-2 border-l border-border p-5 text-brand">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" /> ExportPilot AI
          </div>
        </div>
        {rows.map(([a, b], i) => (
          <div
            key={i}
            className={`grid grid-cols-2 text-sm ${i < rows.length - 1 ? "border-b border-border" : ""}`}
          >
            <div className="flex items-center gap-3 p-5 text-muted-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                <X className="h-3.5 w-3.5" />
              </span>
              {a}
            </div>
            <div className="flex items-center gap-3 border-l border-border p-5 text-foreground">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success">
                <Check className="h-3.5 w-3.5" />
              </span>
              {b}
            </div>
          </div>
        ))}
      </motion.div>
    </section>
  );
}