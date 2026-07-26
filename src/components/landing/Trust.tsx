import { motion } from "framer-motion";
import { Landmark, Scale, Ship, Building2, Globe2, FileBadge, Network, type LucideIcon } from "lucide-react";

type Source = { icon: LucideIcon; name: string; note: string };
type Group = { flag: string; region: string; sources: Source[] };

const groups: Group[] = [
  {
    flag: "🇮🇳",
    region: "India",
    sources: [
      { icon: Landmark, name: "DGFT", note: "Directorate General of Foreign Trade" },
      { icon: Scale, name: "CBIC", note: "Central Board of Indirect Taxes" },
      { icon: Ship, name: "ICEGATE", note: "Indian Customs EDI Gateway" },
    ],
  },
  {
    flag: "🇸🇬",
    region: "Singapore",
    sources: [
      { icon: Globe2, name: "Singapore Customs", note: "National customs authority" },
      { icon: Building2, name: "Enterprise Singapore", note: "Trade facilitation" },
      { icon: Network, name: "TradeNet", note: "Singapore trade platform" },
    ],
  },
  {
    flag: "🤝",
    region: "Bilateral Agreement",
    sources: [
      { icon: FileBadge, name: "CECA", note: "India–Singapore Comprehensive Economic Cooperation Agreement" },
    ],
  },
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
        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {groups.map((g, gi) => (
            <motion.div
              key={g.region}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: gi * 0.08 }}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm"
            >
              <div className="flex items-center gap-2 border-b border-border pb-3">
                <span className="text-lg leading-none" aria-hidden>{g.flag}</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {g.region}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-2.5">
                {g.sources.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-background p-3"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <s.icon className="h-4.5 w-4.5" />
                    </span>
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-foreground">{s.name}</div>
                      <div className="text-[11px] leading-tight text-muted-foreground">{s.note}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}