import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";

type Severity = "critical" | "high" | "med" | "low";

const FINDINGS: { id: string; title: string; pkg: string; sev: Severity; detail: string }[] = [
  {
    id: "f1",
    title: "Outdated dependency: lodash@4.17.15",
    pkg: "lodash",
    sev: "high",
    detail: "Prototype pollution (CVE-2020-8203). Upgrade to ≥ 4.17.21.",
  },
  {
    id: "f2",
    title: ".env file referenced in repo history",
    pkg: "vcs",
    sev: "critical",
    detail: "An .env file appears in commit b73a91. Rotate any exposed keys and rewrite history.",
  },
  {
    id: "f3",
    title: "Missing SAMEORIGIN frame headers",
    pkg: "next/middleware",
    sev: "med",
    detail: "Add X-Frame-Options or CSP frame-ancestors directive.",
  },
  {
    id: "f4",
    title: "eval() usage in src/utils/format.ts",
    pkg: "src/utils/format.ts",
    sev: "low",
    detail: "eval() is dangerous. Replace with a safe parser.",
  },
];

const sevStyle: Record<Severity, string> = {
  critical: "bg-red-500/15 text-red-400 border-red-500/40",
  high: "bg-orange-500/15 text-orange-300 border-orange-500/40",
  med: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40",
  low: "bg-primary/10 text-primary border-primary/30",
};

export function SecurityInsights() {
  const [open, setOpen] = useState<string | null>("f2");
  const score = 72;
  return (
    <div>
      <div className="mb-3 flex items-center gap-3 rounded-lg border border-border/60 bg-surface/50 p-2.5">
        <div className="relative h-12 w-12 shrink-0">
          <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
            <motion.circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 94.2} 94.2`}
              initial={{ strokeDasharray: "0 94.2" }}
              animate={{ strokeDasharray: `${(score / 100) * 94.2} 94.2` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-semibold">
            {score}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-medium text-foreground">Security score</div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" /> 4 findings · 1 critical
          </div>
        </div>
      </div>

      <ul className="space-y-1.5">
        {FINDINGS.map((f) => {
          const isOpen = open === f.id;
          return (
            <li
              key={f.id}
              className="overflow-hidden rounded-lg border border-border/60 bg-surface/40"
            >
              <button
                onClick={() => setOpen(isOpen ? null : f.id)}
                className="flex w-full items-center gap-2 px-2.5 py-2 text-left"
              >
                <span
                  className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${sevStyle[f.sev]}`}
                >
                  {f.sev}
                </span>
                {f.sev === "critical" ? (
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-red-400" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
                  {f.title}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/60 bg-background/30 px-3 py-2 text-[11.5px] leading-relaxed text-muted-foreground"
                  >
                    <div className="mb-1 font-mono text-[10px] text-primary">{f.pkg}</div>
                    {f.detail}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}