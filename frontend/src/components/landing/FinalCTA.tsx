import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function FinalCTA() {
  return (
    <section id="roadmap" className="mx-auto max-w-7xl px-6 pb-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl border border-border bg-card p-10 shadow-sm sm:p-16"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/15 blur-3xl" />
          <div
            className="absolute inset-0 opacity-[0.4]"
            style={{
              backgroundImage:
                "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
              maskImage: "radial-gradient(ellipse at right, black, transparent 65%)",
            }}
          />
        </div>
        <div className="relative max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Ready to Prepare Your Next Broker-Ready Shipment?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Validate cross-border compliance before filing and export with confidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-3 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:translate-y-[-1px] hover:shadow-md">
              Start New Shipment <ArrowRight className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center rounded-md border border-border bg-background px-5 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent">
              Talk to sales
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}