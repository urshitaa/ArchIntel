import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Github,
  FileCode,
  Cpu,
  Network,
  ShieldCheck,
  Sparkles,
  Layers,
  Boxes,
  Workflow,
  Database,
  Terminal,
} from "lucide-react";

export type PipelineStep = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  logs: string[];
  /** ms */
  duration: number;
};

const STEPS: PipelineStep[] = [
  {
    id: "validate",
    label: "Validating repository",
    icon: Github,
    duration: 450,
    logs: [
      "GET https://api.github.com/repos/{repo}",
      "→ 200 OK · public · default branch=main",
      "✓ access verified",
    ],
  },
  {
    id: "meta",
    label: "Fetching GitHub metadata",
    icon: Database,
    duration: 600,
    logs: [
      "stars=124,302  forks=26,841  watchers=1,284",
      "license=MIT  contributors=3,142",
      "✓ metadata indexed",
    ],
  },
  {
    id: "tree",
    label: "Parsing repository tree",
    icon: FileCode,
    duration: 700,
    logs: [
      "walking 1,284 files across 187 directories…",
      "languages: ts(64%) js(18%) css(9%) mdx(6%) other(3%)",
      "✓ tree mapped · 486k LOC",
    ],
  },
  {
    id: "frameworks",
    label: "Detecting frameworks",
    icon: Cpu,
    duration: 500,
    logs: [
      "signature scan: react@18 · next@15 · tailwind@3",
      "tooling: eslint · prettier · vitest · swc",
      "✓ stack confidence 0.97",
    ],
  },
  {
    id: "graph",
    label: "Building dependency graph",
    icon: Network,
    duration: 800,
    logs: [
      "resolving import edges (esm + cjs)…",
      "1,284 nodes · 4,217 edges · 12 clusters",
      "✓ graph compiled",
    ],
  },
  {
    id: "arch",
    label: "Scanning architecture",
    icon: Layers,
    duration: 600,
    logs: [
      "layers: ui · routes · services · data",
      "patterns: app-router · server components · edge",
      "✓ architecture model ready",
    ],
  },
  {
    id: "apis",
    label: "Extracting APIs & routes",
    icon: Workflow,
    duration: 500,
    logs: [
      "found 38 routes · 12 server actions · 4 middlewares",
      "✓ api surface mapped",
    ],
  },
  {
    id: "embed",
    label: "Generating embeddings",
    icon: Boxes,
    duration: 750,
    logs: [
      "chunking 1,284 files → 18,420 chunks",
      "embedding · model=text-embed-3-large · dim=3072",
      "✓ vectors stored",
    ],
  },
  {
    id: "summary",
    label: "Creating AI summaries",
    icon: Sparkles,
    duration: 700,
    logs: [
      "summarizing modules · streaming…",
      "drafting 4 explanation styles per file",
      "✓ summaries ready",
    ],
  },
  {
    id: "ws",
    label: "Preparing workspace",
    icon: ShieldCheck,
    duration: 400,
    logs: ["assembling panels · pre-warming graph", "✓ workspace ready"],
  },
];

export function AnalysisPipeline({
  repoFull,
  analysisPromise,
  onDone,
}: {
  repoFull: string;
  analysisPromise?: Promise<any>;
  onDone: () => void;
}) {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<{ stepId: string; line: string; tone: "muted" | "primary" | "ok" }[]>([
    { stepId: "_", line: `$ codebase-explainer analyze ${repoFull}`, tone: "muted" },
  ]);
  const logRef = useRef<HTMLDivElement>(null);

  // Run the pipeline.
  useEffect(() => {
    let cancelled = false;
    const total = STEPS.reduce((s, x) => s + x.duration, 0);
    let elapsed = 0;

    const run = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        if (cancelled) return;
        setActive(i);
        const step = STEPS[i];
        const per = step.duration / step.logs.length;
        for (let j = 0; j < step.logs.length; j++) {
          await new Promise((r) => setTimeout(r, per));
          if (cancelled) return;
          const line = step.logs[j];
          const tone: "muted" | "primary" | "ok" = line.startsWith("✓")
            ? "ok"
            : line.startsWith("→")
              ? "primary"
              : "muted";
          setLogs((l) => [...l, { stepId: step.id, line, tone }]);
          elapsed += per;
          setProgress(Math.min(99, Math.round((elapsed / total) * 100)));
        }
      }
      if (cancelled) return;
      if (analysisPromise) {
        setLogs((l) => [...l, { stepId: "_wait", line: "waiting for backend analysis...", tone: "muted" }]);
        try {
          await analysisPromise;
        } catch (e) {
          setLogs((l) => [...l, { stepId: "_wait", line: "analysis failed", tone: "muted" }]);
        }
      }
      setProgress(100);
      await new Promise((r) => setTimeout(r, 350));
      if (!cancelled) onDone();
    };
    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll terminal.
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [logs]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[60] overflow-hidden bg-background"
      role="status"
      aria-live="polite"
    >
      {/* Ambient layers */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-40" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_30%,hsl(var(--primary)/0.18),transparent_70%)]" />
      <ScanLine />

      <div className="relative mx-auto flex h-full max-w-7xl flex-col px-6 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 neon-border"
            >
              <Sparkles className="h-4 w-4 text-primary" />
            </motion.div>
            <div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-primary">
                AI Analysis
              </div>
              <div className="font-mono text-sm">{repoFull}</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-[11px] text-muted-foreground sm:inline-flex">
              <span className="h-1.5 w-1.5 rounded-full bg-primary blink" />
              streaming · model=gpt-codebase-1
            </div>
            <div className="font-mono text-xl tabular-nums tracking-tight text-primary">
              {progress.toString().padStart(2, "0")}%
            </div>
          </div>
        </div>

        {/* Headline */}
        <div className="mt-7">
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
            Exploring the codebase…
          </h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            We’re reading every file, mapping dependencies, and generating
            human-friendly explanations.
          </p>

          {/* progress bar */}
          <div className="mt-4 h-1 w-full overflow-hidden rounded-full bg-surface">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))] shadow-[0_0_18px_hsl(var(--primary)/0.6)]"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "easeOut", duration: 0.2 }}
            />
          </div>
        </div>

        {/* Body grid */}
        <div className="mt-6 grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12">
          {/* Steps */}
          <div className="glass relative overflow-hidden rounded-2xl p-4 lg:col-span-4">
            <div className="mb-3 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-primary">
              <Workflow className="h-3 w-3" /> Pipeline
            </div>
            <ul className="space-y-1.5">
              {STEPS.map((s, i) => {
                const done = i < active;
                const isActive = i === active;
                return (
                  <motion.li
                    key={s.id}
                    layout
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.025 }}
                    className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-[12.5px] transition-colors ${
                      isActive
                        ? "bg-primary/10 text-foreground ring-1 ring-primary/30"
                        : done
                          ? "text-muted-foreground"
                          : "text-muted-foreground/55"
                    }`}
                  >
                    <span className="relative flex h-4 w-4 items-center justify-center">
                      {done ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : isActive ? (
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40" />
                      )}
                      {isActive && (
                        <motion.span
                          className="absolute inset-0 rounded-full bg-primary/30 blur-md"
                          animate={{ scale: [0.6, 1.4, 0.6], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 1.6, repeat: Infinity }}
                        />
                      )}
                    </span>
                    <s.icon className="h-3.5 w-3.5" />
                    <span className="flex-1">{s.label}</span>
                    {done && <span className="font-mono text-[10px] text-primary/70">ok</span>}
                  </motion.li>
                );
              })}
            </ul>
          </div>

          {/* Terminal */}
          <div className="glass relative flex flex-col overflow-hidden rounded-2xl lg:col-span-5">
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-2">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
                <span className="ml-3 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Terminal className="h-3 w-3" /> analysis.log
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">
                {logs.length - 1} events
              </span>
            </div>
            <div
              ref={logRef}
              className="relative flex-1 overflow-y-auto px-4 py-3 font-mono text-[11.5px] leading-relaxed"
              style={{ maxHeight: 360 }}
            >
              <AnimatePresence initial={false}>
                {logs.map((l, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18 }}
                    className={
                      l.tone === "ok"
                        ? "text-primary"
                        : l.tone === "primary"
                          ? "text-foreground"
                          : "text-muted-foreground"
                    }
                  >
                    <span className="mr-2 select-none text-muted-foreground/40">
                      {String(i).padStart(3, "0")}
                    </span>
                    {l.line}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="mt-1 text-primary">
                <span className="select-none text-muted-foreground/40 mr-2">
                  {String(logs.length).padStart(3, "0")}
                </span>
                <span className="blink">▍</span>
              </div>
            </div>
          </div>

          {/* Live graph */}
          <div className="glass relative overflow-hidden rounded-2xl p-4 lg:col-span-3">
            <div className="mb-2 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-primary">
              <Network className="h-3 w-3" /> Live graph
            </div>
            <LiveGraph progress={progress} />
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10.5px]">
              <Stat label="files" value={Math.round((progress / 100) * 1284)} />
              <Stat label="edges" value={Math.round((progress / 100) * 4217)} />
              <Stat label="chunks" value={Math.round((progress / 100) * 18420)} />
              <Stat label="modules" value={Math.round((progress / 100) * 142)} />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-md border border-border/60 bg-surface/50 px-2 py-1.5">
      <div className="text-[9.5px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="font-mono text-[12px] tabular-nums text-foreground">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

function ScanLine() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 h-24 bg-[linear-gradient(180deg,transparent,hsl(var(--primary)/0.06)_45%,hsl(var(--primary)/0.18)_50%,hsl(var(--primary)/0.06)_55%,transparent)]"
      initial={{ y: -120 }}
      animate={{ y: ["-15%", "115%"] }}
      transition={{ duration: 5.2, ease: "easeInOut", repeat: Infinity }}
    />
  );
}

/** Procedurally drawn graph that fills in as progress increases. */
function LiveGraph({ progress }: { progress: number }) {
  const N = 22;
  const nodes = Array.from({ length: N }, (_, i) => {
    // deterministic pseudo-random
    const a = (i * 137.508) % 360;
    const r = 30 + ((i * 19) % 55);
    const cx = 90 + Math.cos((a * Math.PI) / 180) * r;
    const cy = 95 + Math.sin((a * Math.PI) / 180) * r;
    return { x: cx, y: cy };
  });
  const edges: [number, number][] = [];
  for (let i = 1; i < N; i++) {
    edges.push([Math.max(0, i - 1 - (i % 3)), i]);
    if (i % 4 === 0 && i > 4) edges.push([i - 4, i]);
  }
  const visEdges = Math.round((progress / 100) * edges.length);
  const visNodes = Math.round((progress / 100) * N);

  return (
    <svg viewBox="0 0 180 190" className="h-44 w-full">
      <defs>
        <radialGradient id="lg-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="90" cy="95" r="70" fill="url(#lg-glow)" />
      {edges.slice(0, visEdges).map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke="hsl(var(--primary) / 0.55)"
          strokeWidth={0.8}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.45 }}
        />
      ))}
      {nodes.slice(0, visNodes).map((n, i) => (
        <motion.circle
          key={i}
          cx={n.x}
          cy={n.y}
          r={i === 0 ? 3.2 : 1.8}
          fill={i === 0 ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.85)"}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </svg>
  );
}