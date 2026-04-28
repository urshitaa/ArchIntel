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
}: {
  nodes: FileNode[];
  selectedPath: string | null;
  onSelect: (n: FileNode) => void;
}) {
  const [open, setOpen] = useState<Record<string, boolean>>({
    src: true,
    "src/components": true,
    "src/pages": true,
  });
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

  const renderNode = (node: FileNode, depth: number) => {
    if (matchedPaths && !matchedPaths.has(node.path)) return null;
    const Icon = iconFor(node);
    const isOpen = open[node.path] ?? !!matchedPaths;
    const isSelected = selectedPath === node.path;

    return (
      <div key={node.path}>
        <button
          onClick={() => {
            if (node.type === "folder") setOpen((o) => ({ ...o, [node.path]: !isOpen }));
            onSelect(node);
          }}
          style={{ paddingLeft: 8 + depth * 14 }}
          className={`group flex w-full items-center gap-1.5 rounded-md py-1 pr-2 text-left text-[12.5px] transition-colors ${
            isSelected
              ? "bg-primary/15 text-foreground"
              : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"
          }`}
        >
          {node.type === "folder" ? (
            <>
              <ChevronRight
                className={`h-3 w-3 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
              />
              {isOpen ? (
                <FolderOpen className="h-3.5 w-3.5 shrink-0 text-primary" />
              ) : (
                <Folder className="h-3.5 w-3.5 shrink-0 text-primary/70" />
              )}
            </>
          ) : (
            <>
              <span className="w-3" />
              {Icon ? <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : null}
            </>
          )}
          <span className="truncate">{node.name}</span>
          {isSelected && (
            <motion.span
              layoutId="tree-dot"
              className="ml-auto h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]"
            />
          )}
        </button>
        {node.type === "folder" && isOpen && node.children?.map((c) => renderNode(c, depth + 1))}
      </div>
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-2 flex items-center gap-2 rounded-md border border-border/60 bg-surface px-2 py-1.5">
        <Search className="h-3 w-3 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search files..."
          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/70"
        />
      </div>
      <div className="-mx-1 flex-1 overflow-y-auto pr-1">{nodes.map((n) => renderNode(n, 0))}</div>
    </div>
  );
}