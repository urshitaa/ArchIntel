import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { FileCode, Boxes } from "lucide-react";
import { Panel, Badge, KV } from "@/components/workspace/Shared";
import { FileTree } from "@/components/workspace/FileTree";
import { fileTree as fallbackTree } from "@/components/workspace/data";
import { CountUp } from "@/components/landing/CountUp";
import { motion } from "framer-motion";

export function OverviewPage() {
  const { analysisResult } = useOutletContext<any>();
  
  const dynamicTree = analysisResult?.files ? buildTree(analysisResult.files) : fallbackTree;
  
  const [selected, setSelected] = useState<any | null>(
    dynamicTree[0]?.children?.[0]?.children?.[0] ?? dynamicTree[0] ?? null,
  );

  function buildTree(flatFiles: {path: string, size: number, language: string}[]): any[] {
    const root: any[] = [];
    for (const file of flatFiles) {
      const parts = file.path.split(/[/\\]/);
      let currentLevel = root;
      let currentPath = "";
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        currentPath += (currentPath ? "/" : "") + part;
        const isFile = i === parts.length - 1;
        let node = currentLevel.find((n) => n.name === part);
        if (!node) {
          node = {
            name: part,
            type: isFile ? "file" : "folder",
            path: currentPath,
            size: isFile ? (file.size / 1024).toFixed(1) + " KB" : undefined,
            ext: isFile ? part.split(".").pop() : undefined,
            children: isFile ? undefined : [],
            summary: isFile ? `File written in ${file.language}` : "Folder",
            preview: isFile ? "Code preview not loaded." : undefined,
          };
          currentLevel.push(node);
        }
        if (!isFile && node.children) {
          currentLevel = node.children;
        }
      }
    }
    return root;
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Left Column: Architecture Tree & Insights */}
      <div className="flex flex-col gap-6 lg:col-span-5">
        <div className="rounded-xl border border-white/5 bg-[#0b1121]/50 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Architecture</h2>
          <div className="rounded-xl border border-white/5 bg-[#0f172a] p-4 h-[400px] overflow-y-auto custom-scrollbar">
            <FileTree nodes={dynamicTree} selectedPath={selected?.path ?? null} onSelect={setSelected} rootName={analysisResult?.repository?.name || "beginner-html-site-styled"} />
          </div>
        </div>

        <div className="rounded-xl border border-white/5 bg-[#0b1121]/50 p-6">
          <h3 className="text-sm font-semibold text-white mb-3">Architecture Insights</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {analysisResult?.repository?.description || "This is a simple static website with HTML, CSS, and image assets. No build process or framework detected."}
          </p>
        </div>
      </div>

      {/* Right Column: Module Detail */}
      <div className="lg:col-span-7">
        <div className="rounded-xl border border-white/5 bg-[#0b1121]/50 p-6 h-full">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Boxes className="h-5 w-5 text-[#2dd4bf]" />
            Module Detail
          </h2>
          <div className="rounded-xl border border-white/5 bg-[#0f172a] p-5 h-[calc(100%-2rem)]">
            <FileDetail node={selected} />
          </div>
        </div>
      </div>
    </div>
  );
}

function FileDetail({ node }: { node: any | null }) {
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

      <div className="mt-3 min-h-[400px]">
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
            {(node.imports ?? []).map((d: string) => (
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
