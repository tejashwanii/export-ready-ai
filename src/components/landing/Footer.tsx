import { Rocket } from "lucide-react";

const cols = [
  { title: "Quick Links", items: ["Features", "How It Works", "Why ExportPilot", "Roadmap"] },
  { title: "Resources", items: ["Documentation", "Regulations", "Changelog", "Support"] },
  { title: "Company", items: ["Privacy", "Terms", "Contact", "Security"] },
];

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-primary-foreground">
              <Rocket className="h-4 w-4" />
            </span>
            <span className="text-sm font-semibold tracking-tight text-foreground">
              ExportPilot <span className="text-brand">AI</span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-muted-foreground">
            AI-powered cross-border compliance intelligence for India–Singapore exports.
          </p>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <div className="text-xs font-semibold uppercase tracking-widest text-foreground">
              {c.title}
            </div>
            <ul className="mt-4 space-y-2.5">
              {c.items.map((i) => (
                <li key={i}>
                  <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-6 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} ExportPilot AI. All rights reserved.</div>
          <div>Made for Indian exporters · India · Singapore</div>
        </div>
      </div>
    </footer>
  );
}