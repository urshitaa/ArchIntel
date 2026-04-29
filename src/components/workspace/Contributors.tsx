import { motion } from "framer-motion";

const PEOPLE = [
  { name: "tim-pope", commits: 4821, hue: 172 },
  { name: "j-collins", commits: 3120, hue: 200 },
  { name: "sarah.k", commits: 2410, hue: 160 },
  { name: "vlad", commits: 1880, hue: 188 },
  { name: "mira", commits: 1402, hue: 215 },
  { name: "leo", commits: 1208, hue: 175 },
];

// 7×12 heatmap (weeks)
const HEAT = Array.from({ length: 7 }, (_, r) =>
  Array.from({ length: 14 }, (_, c) => (Math.sin(r * 1.3 + c * 0.7) + 1) / 2),
);

export function Contributors() {
  const max = PEOPLE[0].commits;
  return (
    <div className="space-y-3">
      <ul className="space-y-1.5">
        {PEOPLE.map((p, i) => (
          <motion.li
            key={p.name}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.04 }}
            className="flex items-center gap-2.5"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-background"
              style={{ background: `hsl(${p.hue} 70% 55%)` }}
            >
              {p.name.slice(0, 2).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between text-[11.5px]">
                <span className="truncate font-mono text-foreground">{p.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  {p.commits.toLocaleString()}
                </span>
              </div>
              <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-surface">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(p.commits / max) * 100}%` }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                  style={{ background: `linear-gradient(90deg, hsl(${p.hue} 70% 55%), hsl(var(--primary)))` }}
                />
              </div>
            </div>
          </motion.li>
        ))}
      </ul>

      <div>
        <div className="mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
          <span>Activity (12w)</span>
          <span>Bus factor: <b className="text-foreground">3</b></span>
        </div>
        <div className="grid gap-[2px]" style={{ gridTemplateColumns: `repeat(14, minmax(0, 1fr))` }}>
          {HEAT.flatMap((row, r) =>
            row.map((v, c) => (
              <motion.div
                key={`${r}-${c}`}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: (r + c) * 0.012 }}
                className="aspect-square rounded-[2px]"
                style={{
                  background: `hsl(var(--primary) / ${0.08 + v * 0.55})`,
                  boxShadow: v > 0.85 ? "0 0 6px hsl(var(--primary) / 0.6)" : undefined,
                }}
              />
            )),
          )}
        </div>
      </div>
    </div>
  );
}