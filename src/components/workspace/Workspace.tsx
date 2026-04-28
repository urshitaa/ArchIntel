import { useState } from "react";
import { motion } from "framer-motion";
import {
  Github,
  Star,
  GitFork,
  Eye,
  RefreshCcw,
  Save,
  ShieldCheck,
  Cpu,
  Sparkles,
  Download,
  Copy,
  Share2,
  ChevronRight,
  FileCode,
  Network,
  MessageSquare,
  Layers,
  Boxes,
  GitBranch,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { CountUp } from "@/components/landing/CountUp";
import type { FileNode, RepoMeta } from "./data";
import { fileTree, summaryStyles } from "./data";
import { FileTree } from "./FileTree";
import { DependencyGraph } from "./DependencyGraph";
import { AskAI } from "./AskAI";
import { TechStack } from "./TechStack";
import { toast } from "sonner";

const cardBase =
  "glass relative rounded-2xl p-4 transition-shadow duration-300 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.35),var(--shadow-elevated)]";

function Panel({
  title,
  icon: Icon,
  className = "",
  delay = 0,
  children,
  action,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  delay?: number;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={`${cardBase} ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-primary">
          <Icon className="h-3 w-3" />
          {title}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

export function Workspace({ repo }: { repo: RepoMeta }) {
  const [selected, setSelected] = useState<FileNode | null>(
    fileTree[0].children?.[0]?.children?.[0] ?? null,
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      {/* 1. Repository Overview */}
      <Panel
        title="Repository"
        icon={Github}
        className="lg:col-span-7"
        delay={0}
        action={
          <div className="flex gap-1">
            <SmallBtn icon={Star} label="Star" onClick={() => toast.success("Starred repo")} />
            <SmallBtn icon={RefreshCcw} label="Re-analyze" onClick={() => toast("Re-analyzing…")} />
            <SmallBtn icon={Save} label="Save" onClick={() => toast.success("Report saved")} />
          </div>
        }
      >
        <RepoOverview repo={repo} />
      </Panel>

      {/* 5. Tech Stack */}
      <Panel title="Tech Stack" icon={Layers} className="lg:col-span-5" delay={0.05}>
        <TechStack repo={repo} />
      </Panel>

      {/* 2. File Tree */}
      <Panel title="Project Tree" icon={FileCode} className="lg:col-span-3 lg:row-span-2" delay={0.1}>
        <div className="h-[420px]">
          <FileTree nodes={fileTree} selectedPath={selected?.path ?? null} onSelect={setSelected} />
        </div>
        {selected && (
          <div className="mt-3 rounded-md border border-border/60 bg-surface/50 p-2 text-[11px] text-muted-foreground">
            <span className="text-foreground">{selected.type === "folder" ? "Folder" : "File"}:</span>{" "}
            {selected.summary}
          </div>
        )}
      </Panel>

      {/* 3. File / Module Detail */}
      <Panel title="Module Detail" icon={Boxes} className="lg:col-span-5" delay={0.15}>
        <FileDetail node={selected} />
      </Panel>

      {/* 7. Ask AI */}
      <Panel title="Ask AI" icon={MessageSquare} className="lg:col-span-4" delay={0.2}>
        <div className="h-[300px]">
          <AskAI />
        </div>
      </Panel>

      {/* 4. Summary (multi-style tabs) */}
      <Panel title="AI Summary" icon={Sparkles} className="lg:col-span-5" delay={0.25}>
        <SummaryTabs />
      </Panel>

      {/* 6. Dependency Graph */}
      <Panel title="Dependency Graph" icon={Network} className="lg:col-span-7" delay={0.3}>
        <div className="h-[320px]">
          <DependencyGraph />
        </div>
      </Panel>

      {/* 8. File Preview */}
      <Panel title="Preview" icon={FileCode} className="lg:col-span-7" delay={0.35}>
        <FilePreview node={selected} />
      </Panel>

      {/* 9. Summary Comparison */}
      <Panel title="Summary Comparison" icon={GitBranch} className="lg:col-span-5" delay={0.4}>
        <SummaryCompare />
      </Panel>

      {/* 10. Export */}
      <Panel title="Export & Share" icon={Download} className="lg:col-span-12" delay={0.45}>
        <ExportPanel />
      </Panel>
    </div>
  );
}

function SmallBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[10.5px] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground hover:shadow-[0_0_12px_hsl(var(--primary)/0.25)]"
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-surface/50 px-2.5 py-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-2.5 w-2.5" />
        {label}
      </div>
      <div className="mt-0.5 font-mono text-base font-semibold">
        <CountUp to={value} suffix={suffix} />
      </div>
    </div>
  );
}

function RepoOverview({ repo }: { repo: RepoMeta }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <Github className="h-3 w-3" /> {repo.owner}
            <ChevronRight className="h-3 w-3" />
          </div>
          <h2 className="mt-0.5 truncate text-xl font-semibold tracking-tight">{repo.name}</h2>
          <p className="mt-1 max-w-md text-[12.5px] leading-relaxed text-muted-foreground">
            Production-grade React framework with hybrid app router, server components, and edge runtime support.
            Modular, well-tested, plugin-driven architecture.
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1.5">
          <div className="flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
            <ShieldCheck className="h-3 w-3" /> Health A+
          </div>
          <div className="flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground">
            <Cpu className="h-3 w-3 text-primary" /> AI Score{" "}
            <b className="ml-0.5 text-foreground">94</b>
          </div>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-4 gap-2">
        <Stat icon={Star} label="Stars" value={124} suffix="k" />
        <Stat icon={GitFork} label="Forks" value={26} suffix="k" />
        <Stat icon={Eye} label="Watchers" value={1284} />
        <Stat icon={FileCode} label="Files" value={1284} />
        <Stat icon={Layers} label="LOC" value={486} suffix="k" />
        <Stat icon={Users} label="Contributors" value={3142} />
        <Stat icon={Clock} label="Last commit" value={2} suffix="h" />
        <Stat icon={GitBranch} label="Branches" value={142} />
      </div>
    </div>
  );
}

function FileDetail({ node }: { node: FileNode | null }) {
  const [tab, setTab] = useState<"summary" | "deps" | "dependents" | "code">("summary");
  if (!node || node.type === "folder")
    return (
      <div className="flex h-[260px] items-center justify-center text-xs text-muted-foreground">
        Select a file in the project tree to inspect it.
      </div>
    );

  const tabs = [
    { id: "summary" as const, label: "Summary" },
    { id: "deps" as const, label: "Dependencies" },
    { id: "dependents" as const, label: "Dependents" },
    { id: "code" as const, label: "Code" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-sm text-foreground">{node.name}</span>
        <Badge>{node.ext}</Badge>
        <Badge>{node.size}</Badge>
        <Badge>
          <CountUp to={node.loc ?? 0} /> LOC
        </Badge>
        <span className="ml-auto text-[10.5px] text-muted-foreground">{node.modified}</span>
      </div>

      <div className="mt-3 flex gap-1 border-b border-border/60">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative px-2.5 py-1.5 text-[11.5px] transition-colors ${
              tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
            {tab === t.id && (
              <motion.span
                layoutId="filedetail-tab"
                className="absolute -bottom-px left-0 right-0 h-px bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="mt-3 min-h-[160px]">
        {tab === "summary" && (
          <div>
            <p className="text-[12.5px] leading-relaxed text-muted-foreground">{node.summary}</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <KV k="Exports" v={node.exports?.join(", ") || "—"} />
              <KV k="Imports" v={node.imports?.join(", ") || "—"} />
            </div>
          </div>
        )}
        {tab === "deps" && (
          <ul className="space-y-1">
            {(node.imports ?? []).map((d) => (
              <li
                key={d}
                className="flex items-center justify-between rounded-md border border-border/60 bg-surface/50 px-2.5 py-1.5 text-[11.5px]"
              >
                <span className="font-mono">{d}</span>
                <span className="text-[10px] text-primary">imported</span>
              </li>
            ))}
          </ul>
        )}
        {tab === "dependents" && (
          <div className="text-[12px] text-muted-foreground">
            Used by <b className="text-foreground">{Math.max(2, (node.loc ?? 0) % 11)}</b> other modules in the
            codebase.
          </div>
        )}
        {tab === "code" && (
          <pre className="overflow-x-auto rounded-md border border-border/60 bg-[#0b1220] p-3 font-mono text-[11px] leading-relaxed text-foreground/90">
            <code>{node.preview}</code>
          </pre>
        )}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      {children}
    </span>
  );
}

function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-surface/50 p-2">
      <div className="text-[9.5px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-0.5 truncate font-mono text-[11px] text-foreground">{v}</div>
    </div>
  );
}

const summaryTabsList = [
  { id: "easy" as const, label: "Super Easy" },
  { id: "concise" as const, label: "Concise" },
  { id: "detailed" as const, label: "Detailed" },
  { id: "technical" as const, label: "Full Technical" },
];

function SummaryTabs() {
  const [tab, setTab] = useState<keyof typeof summaryStyles>("concise");
  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {summaryTabsList.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative rounded-md px-2.5 py-1 text-[11px] transition-colors ${
              tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="summary-pill"
                className="absolute inset-0 rounded-md bg-primary/15"
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
      <motion.p
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-3 rounded-md border border-border/60 bg-surface/50 p-3 text-[12.5px] leading-relaxed text-muted-foreground"
      >
        {summaryStyles[tab]}
      </motion.p>
    </div>
  );
}

function SummaryCompare() {
  return (
    <div className="space-y-2">
      {summaryTabsList.map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-md border border-border/60 bg-surface/50 p-2.5"
        >
          <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary">
            <Sparkles className="h-2.5 w-2.5" /> {t.label}
          </div>
          <p className="text-[11.5px] leading-relaxed text-muted-foreground">{summaryStyles[t.id]}</p>
        </motion.div>
      ))}
    </div>
  );
}

function FilePreview({ node }: { node: FileNode | null }) {
  if (!node || node.type === "folder")
    return (
      <div className="flex h-[200px] items-center justify-center text-xs text-muted-foreground">
        Pick a file to preview its contents and key insights.
      </div>
    );
  const bullets = [
    `Defines ${node.exports?.length ?? 0} export${(node.exports?.length ?? 0) === 1 ? "" : "s"}`,
    `Imports ${node.imports?.length ?? 0} dependenc${(node.imports?.length ?? 0) === 1 ? "y" : "ies"}`,
    `${node.loc ?? 0} lines of code, ${node.size} on disk`,
    `Last modified ${node.modified}`,
  ];
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1.2fr_1fr]">
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <FileCode className="h-3 w-3 text-primary" /> {node.path}
        </div>
        <pre className="overflow-x-auto rounded-md border border-border/60 bg-[#0b1220] p-3 font-mono text-[11px] leading-relaxed text-foreground/90">
          <code>{node.preview}</code>
        </pre>
      </div>
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Sparkles className="h-3 w-3 text-primary" /> Key points
        </div>
        <ul className="space-y-1.5">
          {bullets.map((b) => (
            <li
              key={b}
              className="flex items-start gap-1.5 rounded-md border border-border/60 bg-surface/50 p-2 text-[11.5px] text-muted-foreground"
            >
              <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const exportFormats = ["Markdown", "PDF", "HTML", "JSON"] as const;
const exportToggles = ["Repo Overview", "Tech Stack", "Tree Structure", "Summaries", "Graph"];

function ExportPanel() {
  const [format, setFormat] = useState<(typeof exportFormats)[number]>("Markdown");
  const [enabled, setEnabled] = useState<Set<string>>(new Set(exportToggles));

  const toggle = (k: string) =>
    setEnabled((s) => {
      const n = new Set(s);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div>
        <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Format</div>
        <div className="flex flex-wrap gap-1">
          {exportFormats.map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`rounded-md border px-2.5 py-1 text-[11px] transition-colors ${
                format === f
                  ? "border-primary/60 bg-primary/15 text-primary"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="mb-2 text-[10px] uppercase tracking-wider text-muted-foreground">Include</div>
        <ul className="grid grid-cols-1 gap-1">
          {exportToggles.map((t) => {
            const on = enabled.has(t);
            return (
              <li key={t}>
                <button
                  onClick={() => toggle(t)}
                  className={`flex w-full items-center justify-between rounded-md border px-2.5 py-1.5 text-[11px] transition-colors ${
                    on
                      ? "border-primary/40 bg-primary/10 text-foreground"
                      : "border-border bg-surface text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>{t}</span>
                  <span
                    className={`flex h-3.5 w-3.5 items-center justify-center rounded-sm border ${
                      on ? "border-primary bg-primary text-primary-foreground" : "border-border"
                    }`}
                  >
                    {on && <CheckCircle2 className="h-3 w-3" />}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="flex flex-col justify-end gap-2">
        <button
          onClick={() => toast.success(`Exported ${enabled.size} sections as ${format}`)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02]"
        >
          <Download className="h-3.5 w-3.5" /> Generate Report
        </button>
        <button
          onClick={() => {
            navigator.clipboard?.writeText("https://codebase-explainer.app/r/demo");
            toast.success("Share link copied");
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs hover:border-primary/40"
        >
          <Copy className="h-3.5 w-3.5" /> Copy Share Link
        </button>
        <button
          onClick={() => toast.success("Shared with team")}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-xs hover:border-primary/40"
        >
          <Share2 className="h-3.5 w-3.5" /> Share to Team
        </button>
      </div>
    </div>
  );
}
