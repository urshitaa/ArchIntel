import { motion } from "framer-motion";

const LAYERS = [
  {
    name: "Client",
    accent: "hsl(200 90% 65%)",
    nodes: ["UI Pages", "Components", "Hooks"],
  },
  {
    name: "Edge / API",
    accent: "hsl(172 76% 55%)",
    nodes: ["App Router", "Middleware", "Server Actions"],
  },
  {
    name: "Services",
    accent: "hsl(160 70% 50%)",
    nodes: ["Auth", "Billing", "Search"],
  },
  {
    name: "Data",
    accent: "hsl(220 70% 60%)",
    nodes: ["Postgres", "Redis", "Vector DB"],
  },
];

export function ArchitectureView() {
  return (
    <div className="relative">
      <div className="space-y-3">
        {LAYERS.map((layer, i) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-border/60 bg-surface/40 p-2.5"
            style={{ boxShadow: `inset 0 0 0 1px ${layer.accent}1a` }}
          >
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{ background: layer.accent, boxShadow: `0 0 8px ${layer.accent}` }}
                />
                <span className="text-[10.5px] font-medium uppercase tracking-wider text-foreground/90">
                  {layer.name}
                </span>
              </div>
              <span className="font-mono text-[9.5px] text-muted-foreground">layer.{i}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {layer.nodes.map((n, j) => (
                <motion.div
                  key={n}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 + j * 0.05 + 0.1 }}
                  whileHover={{ y: -2 }}
                  className="cursor-default rounded-md border border-border/60 bg-background/40 px-2 py-1.5 text-center text-[10.5px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {n}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Flow lines between layers */}
      <svg
        className="pointer-events-none absolute inset-x-6 top-[58px] h-[calc(100%-72px)] w-[calc(100%-48px)]"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {[0, 1, 2].map((i) => (
          <motion.line
            key={i}
            x1="50"
            y1={`${10 + i * 30}`}
            x2="50"
            y2={`${30 + i * 30}`}
            stroke="hsl(var(--primary) / 0.4)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
          />
        ))}
      </svg>
    </div>
  );
}