import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, ZoomIn, ZoomOut, X } from "lucide-react";
import { dependencies } from "./data";

type Node = { id: string; x: number; y: number; type: "center" | "direct" | "transitive" };

export function DependencyGraph({ data }: { data?: any[] }) {
  const [filter, setFilter] = useState<"all" | "direct" | "transitive">("all");
  const [zoom, setZoom] = useState(1);
  const [hover, setHover] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);

  const fallbackDependencies = dependencies;
  const actualData = data && data.length > 0 ? data : fallbackDependencies;

  const visible = actualData.filter((d) => filter === "all" || d.type === filter);

  const nodes: Node[] = useMemo(() => {
    const cx = 230;
    const cy = 165;
    const r = 120;
    return [
      { id: "package", x: cx, y: cy, type: "center" },
      ...visible.map((d, i) => {
        const angle = (i / visible.length) * Math.PI * 2 - Math.PI / 2;
        return {
          id: d.name,
          x: cx + Math.cos(angle) * r,
          y: cy + Math.sin(angle) * r,
          type: d.type as "direct" | "transitive",
        };
      }),
    ];
  }, [visible]);

  const edges = useMemo(() => {
    const out: { from: string; to: string }[] = [];
    visible.forEach((d) => {
      out.push({ from: "package", to: d.name });
      (d.deps || []).forEach((dep: string) => {
        if (visible.find((v) => v.name === dep)) out.push({ from: d.name, to: dep });
      });
    });
    return out;
  }, [visible]);

  const isHi = (id: string) =>
    !hover ? false : id === hover || edges.some((e) => (e.from === hover && e.to === id) || (e.to === hover && e.from === id));

  const findNode = (id: string) => nodes.find((n) => n.id === id)!;
  const selectedDep = selected ? actualData.find((d) => d.name === selected) : null;

  return (
    <div className="relative h-full">
      <div className="absolute left-2 top-2 z-10 flex gap-1.5">
        {(["all", "direct", "transitive"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-md border px-2 py-0.5 text-[10px] capitalize transition-colors ${
              filter === f
                ? "border-primary/60 bg-primary/15 text-primary"
                : "border-border bg-surface text-muted-foreground hover:text-foreground"
            }`}
          >
            <Filter className="mr-1 inline h-2.5 w-2.5" />
            {f}
          </button>
        ))}
      </div>
      <div className="absolute right-2 top-2 z-10 flex gap-1">
        <button
          onClick={() => setZoom((z) => Math.min(1.6, z + 0.15))}
          className="rounded-md border border-border bg-surface p-1 text-muted-foreground hover:text-foreground"
        >
          <ZoomIn className="h-3 w-3" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.6, z - 0.15))}
          className="rounded-md border border-border bg-surface p-1 text-muted-foreground hover:text-foreground"
        >
          <ZoomOut className="h-3 w-3" />
        </button>
      </div>

      <svg viewBox="0 0 460 330" className="h-full w-full">
        <defs>
          <radialGradient id="centerGrad">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        <g style={{ transform: `scale(${zoom})`, transformOrigin: "230px 165px" }}>
          {edges.map((e, i) => {
            const a = findNode(e.from);
            const b = findNode(e.to);
            const hi = hover && (e.from === hover || e.to === hover);
            return (
              <motion.line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="hsl(var(--primary))"
                strokeOpacity={hi ? 0.9 : 0.25}
                strokeWidth={hi ? 1.6 : 1}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: i * 0.03 }}
              />
            );
          })}

          {nodes.map((n, i) => {
            const isCenter = n.type === "center";
            const hi = isHi(n.id);
            const isSel = selected === n.id;
            const r = isCenter ? 26 : 16;
            return (
              <motion.g
                key={n.id}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, type: "spring", stiffness: 220, damping: 20 }}
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setHover(n.id)}
                onMouseLeave={() => setHover(null)}
                onClick={() => !isCenter && setSelected(n.id)}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r + 6}
                  fill="hsl(var(--primary))"
                  opacity={hi || isSel ? 0.25 : 0}
                  className="transition-opacity"
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r}
                  fill={isCenter ? "url(#centerGrad)" : "hsl(var(--surface-2))"}
                  stroke={isSel ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.5)"}
                  strokeWidth={isSel ? 2 : 1}
                />
                <text
                  x={n.x}
                  y={n.y + r + 12}
                  textAnchor="middle"
                  className="fill-foreground"
                  style={{ font: "10px Inter, sans-serif", opacity: hi || !hover ? 1 : 0.4 }}
                >
                  {n.id}
                </text>
                {n.type === "transitive" && (
                  <circle cx={n.x + r - 3} cy={n.y - r + 3} r={3} fill="hsl(var(--muted-foreground))" />
                )}
              </motion.g>
            );
          })}
        </g>
      </svg>

      {selectedDep && (
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          className="absolute bottom-2 right-2 w-56 rounded-xl border border-border bg-surface/95 p-3 backdrop-blur-md shadow-[var(--shadow-elevated)]"
        >
          <div className="mb-1 flex items-center justify-between">
            <span className="font-mono text-xs text-foreground">{selectedDep.name}</span>
            <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3 w-3" />
            </button>
          </div>
          <div className="text-[10px] text-muted-foreground">
            v{selectedDep.version} • <span className="text-primary">{selectedDep.type}</span>
          </div>
          <div className="mt-2 text-[10px] text-muted-foreground">
            Depends on: {selectedDep.deps.length ? selectedDep.deps.join(", ") : "—"}
          </div>
        </motion.div>
      )}
    </div>
  );
}