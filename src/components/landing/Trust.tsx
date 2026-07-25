import { motion } from "framer-motion";
import { Landmark, Scale, Ship, Building2, Globe2, FileBadge } from "lucide-react";

const sources = [
  { icon: Landmark, name: "DGFT", note: "Directorate General of Foreign Trade" },
  { icon: Scale, name: "CBIC", note: "Central Board of Indirect Taxes" },
  { icon: Ship, name: "ICEGATE", note: "Indian Customs EDI Gateway" },
  { icon: Globe2, name: "Singapore Customs", note: "TradeNet regulations" },
  { icon: Building2, name: "Enterprise Singapore", note: "Trade facilitation" },
  { icon: FileBadge, name: "CECA", note: "India–Singapore agreement" },
];

export function Trust() {
  return (
    <section className="border-y border-border/60 bg-surface">
      <div className="mx-auto max-w-7xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">Verified sources</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Built on Official Government Sources
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every recommendation is grounded in current India and Singapore trade regulations.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {sources.map((s, i) => (
            <motion.div
              key={s.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
              className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-5 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft text-brand">
                <s.icon className="h-5 w-5" />
              </span>
              <div className="text-sm font-semibold text-foreground">{s.name}</div>
              <div className="text-[11px] leading-tight text-muted-foreground">{s.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}