import { useMemo, useState } from "react";
import { ChevronRight, Folder, FolderOpen, FileCode, FileText, FileJson, Search } from "lucide-react";
import { motion } from "framer-motion";
import type { FileNode } from "./data";
import { flattenFiles } from "./data";

function iconFor(node: FileNode) {
  if (node.type === "folder") return null;
  if (node.ext === "json") return FileJson;
  if (node.ext === "md") return FileText;
  return FileCode;
}

export function FileTree({
  nodes,
  selectedPath,
  onSelect,
  rootName = "beginner-html-site-styled",
}: {
  nodes: FileNode[];
  selectedPath: string | null;
  onSelect: (n: FileNode) => void;
  rootName?: string;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [q, setQ] = useState("");

  const matchedPaths = useMemo(() => {
    if (!q.trim()) return null;
    const all = flattenFiles(nodes);
    const matches = all.filter((n) => n.name.toLowerCase().includes(q.toLowerCase()));
    const set = new Set<string>();
    matches.forEach((m) => {
      const parts = m.path.split("/");
      for (let i = 1; i <= parts.length; i++) set.add(parts.slice(0, i).join("/"));
    });
    return set;
  }, [q, nodes]);

  const renderTree = (items: FileNode[], level: number, parentIsLast: boolean[]) => {
    return items.map((node, index) => {
      if (matchedPaths && !matchedPaths.has(node.path)) return null;
      
      const isLast = index === items.length - 1;
      const isOpen = open[node.path] ?? !!matchedPaths ?? true;
      const isSelected = selectedPath === node.path;
      const Icon = iconFor(node);

      // Lines
      const lines = [];
      for (let i = 0; i < level; i++) {
        lines.push(
          <div
            key={i}
            className={`absolute top-0 bottom-0 w-px ${parentIsLast[i] ? "bg-transparent" : "bg-[#2dd4bf]/40"}`}
            style={{ left: `${i * 20 + 9}px` }}
          />
        );
      }

      return (
        <div key={node.path} className="relative">
          {lines}
          
          <div
            className="absolute border-l border-b border-[#2dd4bf]/40 rounded-bl-[4px]"
            style={{
              left: `${level * 20 + 9}px`,
              top: 0,
              width: "10px",
              height: "20px",
            }}
          />

          <button
            onClick={() => {
              if (node.type === "folder") setOpen((o) => ({ ...o, [node.path]: !isOpen }));
              onSelect(node);
            }}
            style={{ paddingLeft: `${(level + 1) * 20 + 4}px` }}
            className={`group flex w-full items-center gap-2 rounded-md py-1.5 pr-2 text-left text-[12.5px] transition-colors ${
              isSelected
                ? "bg-[#2dd4bf]/10 text-[#2dd4bf] font-medium"
                : "text-slate-300 hover:text-white hover:bg-white/5"
            }`}
          >
            {node.type === "folder" ? (
              <Folder className={`h-4 w-4 shrink-0 ${isSelected ? "text-[#2dd4bf]" : "text-[#2dd4bf]/80"}`} fill="currentColor" fillOpacity={isOpen ? 0.4 : 0.1} />
            ) : (
              Icon && <Icon className={`h-4 w-4 shrink-0 ${isSelected ? "text-[#2dd4bf]" : "text-[#2dd4bf]/60"}`} />
            )}
            <span className="truncate">{node.name}</span>
            {isSelected && (
              <motion.span
                layoutId="tree-dot"
                className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_hsl(var(--primary))]"
              />
            )}
          </button>
          
          {node.type === "folder" && isOpen && node.children && (
            <div className="relative">
              {renderTree(node.children, level + 1, [...parentIsLast, isLast])}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 py-2">
        <Search className="h-4 w-4 text-slate-500" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search files..."
          className="w-full bg-transparent text-sm outline-none text-slate-200 placeholder:text-slate-500"
        />
      </div>
      <div className="-mx-1 flex-1 overflow-y-auto pr-1">
        <div className="py-2">
          {/* Root node */}
          <div className="flex items-center gap-2 py-1.5 px-2 text-slate-200">
            <div className="w-5 h-5 rounded-[4px] border border-white/20 flex items-center justify-center shrink-0">
              <FileCode className="h-3 w-3 text-slate-400" />
            </div>
            <span className="text-sm font-medium">{rootName}</span>
          </div>
          <div className="relative mt-1">
            {/* Main vertical line dropping from root */}
            <div className="absolute top-0 bottom-0 left-[9px] w-px bg-[#2dd4bf]/40" />
            {renderTree(nodes, 0, [false])}
          </div>
        </div>
      </div>
    </div>
  );
}