import { motion } from "framer-motion";
import { ArrowRight, PlayCircle, FileText, ShieldCheck, Gauge, PackageCheck, Sparkles } from "lucide-react";

const flow = [
  { icon: FileText, title: "Invoice", meta: "INV-2081 · 12 items", tone: "text-foreground" },
  { icon: Sparkles, title: "AI Compliance Check", meta: "24 checks passed · 2 warnings", tone: "text-brand" },
  { icon: Gauge, title: "Customs Readiness", meta: "Score 96 / 100", tone: "text-warning" },
  { icon: PackageCheck, title: "Broker Ready", meta: "Ready to file · ICEGATE", tone: "text-success" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,var(--color-background))]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at top, black 40%, transparent 75%)",
          }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 pb-24 pt-20 lg:grid-cols-2 lg:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-brand" />
            Pre-shipment compliance intelligence
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Prepare Broker-Ready
            <br />
            Export Shipments with{" "}
            <span className="bg-gradient-to-br from-brand to-foreground bg-clip-text text-transparent">
              AI
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            ExportPilot AI helps Indian MSMEs identify compliance issues before customs filing
            using official India and Singapore regulations — enabling faster, more confident exports.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:translate-y-[-1px] hover:shadow-md">
              Start New Shipment
              <ArrowRight className="h-4 w-4" />
            </button>
            <button className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-accent">
              <PlayCircle className="h-4 w-4" />
              Watch Demo
            </button>
          </div>
          <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> DGFT & CBIC aligned
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand" /> CECA-ready
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-warning" /> Explainable AI
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          <div className="rounded-2xl border border-border bg-card/80 p-4 shadow-[0_20px_60px_-20px_rgba(37,99,235,0.25)] backdrop-blur-xl">
            <div className="mb-3 flex items-center justify-between px-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted" />
                <span className="h-2.5 w-2.5 rounded-full bg-muted" />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground">
                shipments / SHP-4021
              </span>
            </div>
            <div className="space-y-2.5">
              {flow.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.4 }}
                  className="flex items-center gap-3 rounded-xl border border-border/70 bg-background p-4"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${s.tone}`}>
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.meta}</div>
                  </div>
                  {i === flow.length - 1 ? (
                    <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-medium text-success">
                      Ready
                    </span>
                  ) : (
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                      Step {i + 1}
                    </span>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
          <div className="absolute -right-4 -top-4 hidden rounded-xl border border-border bg-card px-3 py-2 text-xs shadow-lg lg:block">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-success" />
              <span className="font-medium text-foreground">Live checks</span>
              <span className="text-muted-foreground">· 24 rules</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}