import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import type { RepoMeta } from "./data";
import { guessStack } from "./data";

const tabs = ["Languages", "Frameworks", "Libraries", "Tooling"] as const;

export function TechStack({ repo }: { repo: RepoMeta }) {
  const stack = guessStack(repo);
  const [tab, setTab] = useState<(typeof tabs)[number]>("Languages");

  return (
    <div className="flex h-full flex-col">
      <div className="relative mb-3 flex gap-1 rounded-lg bg-surface p-0.5">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative flex-1 rounded-md px-2 py-1 text-[10.5px] font-medium transition-colors ${
              tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === t && (
              <motion.div
                layoutId="tech-tab"
                className="absolute inset-0 rounded-md bg-primary/15"
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              />
            )}
            <span className="relative">{t}</span>
          </button>
        ))}
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-2"
          >
            {tab === "Languages" ? (
              <Donut data={stack.languages} />
            ) : (
              <ul className="space-y-1.5">
                {(tab === "Frameworks" ? stack.frameworks : tab === "Libraries" ? stack.libraries : stack.tooling).map(
                  (n, i) => (
                    <motion.li
                      key={n}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-center justify-between rounded-md border border-border/60 bg-surface/60 px-2.5 py-1.5 text-xs"
                    >
                      <span className="font-mono">{n}</span>
                      <span className="text-[10px] text-primary">detected</span>
                    </motion.li>
                  ),
                )}
              </ul>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-3 border-t border-border/60 pt-2.5">
        <div className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">Highlights</div>
        <ul className="grid grid-cols-2 gap-1">
          {stack.highlights.map((h) => (
            <li key={h} className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <CheckCircle2 className="h-3 w-3 shrink-0 text-primary" />
              <span className="truncate">{h}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Donut({ data }: { data: { name: string; value: number; color: string }[] }) {
  const size = 130;
  const r = 50;
  const c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="hsl(var(--surface-2))" strokeWidth={14} />
        {data.map((d, i) => {
          const len = (d.value / 100) * c;
          const seg = (
            <motion.circle
              key={d.name}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={d.color}
              strokeWidth={14}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-acc}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 }}
              strokeLinecap="butt"
            />
          );
          acc += len;
          return seg;
        })}
      </svg>
      <ul className="flex-1 space-y-1">
        {data.map((d) => (
          <li key={d.name} className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="h-2 w-2 rounded-sm" style={{ background: d.color }} />
              {d.name}
            </span>
            <span className="font-mono text-foreground">{d.value}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}