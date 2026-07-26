import { Fragment } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const cards: { flag: string; title: string; items: string[]; caption: string }[] = [
  {
    flag: "🇮🇳",
    title: "India",
    items: ["DGFT", "CBIC", "ICEGATE"],
    caption: "Export Requirements",
  },
  {
    flag: "🤝",
    title: "CECA",
    items: ["Rules of Origin", "Certificate of Origin", "Tariff Eligibility"],
    caption: "Bilateral Agreement",
  },
  {
    flag: "🇸🇬",
    title: "Singapore",
    items: ["Singapore Customs", "TradeNet", "Enterprise Singapore"],
    caption: "Import Requirements",
  },
];

export function ComplianceLayers() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brand">Compliance layers</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          One Shipment. Three Compliance Layers.
        </h2>
      </div>

      <div className="mt-12 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr_auto_1fr]">
        {cards.map((c, i) => (
          <Fragment key={c.title}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none" aria-hidden>{c.flag}</span>
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {c.title}
                </span>
              </div>
              <ul className="mt-5 space-y-2">
                {c.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-lg border border-border/70 bg-background px-3 py-2 text-sm font-medium text-foreground"
                  >
                    {it}
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-border pt-4 text-xs font-medium uppercase tracking-widest text-brand">
                {c.caption}
              </div>
            </motion.div>
            {i < cards.length - 1 && (
              <div className="flex items-center justify-center">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-brand shadow-sm">
                  <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
                </span>
              </div>
            )}
          </Fragment>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-surface p-5 text-center text-sm text-muted-foreground">
        Combined into one{" "}
        <span className="font-semibold text-foreground">AI-powered Export Readiness Assessment</span>.
      </div>
    </section>
  );
}