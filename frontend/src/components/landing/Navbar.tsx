import { motion } from "framer-motion";
import { Rocket } from "lucide-react";
import { Link } from "@tanstack/react-router";

const links = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Why ExportPilot", href: "#why" },
 
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <a href="#" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-primary-foreground shadow-sm">
            <Rocket className="h-4 w-4" />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">
            ExportPilot <span className="text-brand">AI</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button className="hidden rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
            Login
          </button>
          <Link
            to="/dashboard"
            className="inline-flex items-center rounded-md bg-foreground px-3.5 py-1.5 text-sm font-medium text-background shadow-sm transition-transform hover:scale-[1.02]"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
