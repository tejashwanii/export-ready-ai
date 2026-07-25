import { motion } from "framer-motion";
import { Upload, ScanText, BookOpenCheck, ShieldCheck, PackageCheck } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload Documents", desc: "Invoices, packing lists, certificates." },
  { icon: ScanText, title: "AI Extracts Data", desc: "Structured fields from unstructured docs." },
  { icon: BookOpenCheck, title: "Checks Regulations", desc: "Live DGFT, CBIC & Singapore rules." },
  { icon: ShieldCheck, title: "Compliance Assessment", desc: "Prioritized issues & explanations." },
  { icon: PackageCheck, title: "Broker Ready", desc: "Hand-off with a clean shipment file." },
];

export function HowItWorks() {
  return (
    <section id="how" className="border-y border-border/60 bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            From raw documents to broker-ready in five steps
          </h2>
        </div>

        <div className="relative mt-14">
          <div className="absolute left-0 right-0 top-10 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent lg:block" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-primary-foreground shadow-sm">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[11px] font-medium tracking-widest text-muted-foreground">
                    STEP {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-5 text-sm font-semibold text-foreground">{s.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}