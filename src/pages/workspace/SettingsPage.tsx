import { useState } from "react";
import { Download, Copy, Share2, Settings, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Panel } from "@/components/workspace/Shared";

const exportFormats = ["Markdown", "PDF", "HTML", "JSON"] as const;
const exportToggles = ["Repo Overview", "Tech Stack", "Tree Structure", "Summaries", "Graph"];

export function SettingsPage() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Panel title="Export & Share" icon={Settings} className="lg:col-span-12" delay={0.1}>
        <ExportPanel />
      </Panel>
    </div>
  );
}

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
