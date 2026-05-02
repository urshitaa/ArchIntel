import { useMemo, useState, useCallback } from "react";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Handle,
  Position,
  BackgroundVariant,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Folder, FileCode, FileText, FileJson, Boxes, Settings, Image as ImageIcon, Info, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Custom Cyberpunk Node
function CyberNode({ data }: { data: any }) {
  const isFolder = data.type === "folder";
  const ext = data.label.split(".").pop()?.toLowerCase();

  const Icon = useMemo(() => {
    if (isFolder) return Folder;
    if (["json", "yaml", "yml", "env"].includes(ext)) return Settings;
    if (["md", "txt"].includes(ext)) return FileText;
    if (["png", "jpg", "jpeg", "svg", "gif"].includes(ext)) return ImageIcon;
    return FileCode;
  }, [isFolder, ext]);

  return (
    <div
      className={`relative flex items-center gap-3 rounded-lg border px-4 py-2.5 backdrop-blur-md transition-all hover:shadow-[0_0_20px_hsl(172_76%_47%/0.3)] cursor-pointer
      ${isFolder
          ? "border-[#2dd4bf]/50 bg-[#0b1121]/95 text-[#2dd4bf] shadow-[0_0_15px_hsl(172_76%_47%/0.15)] min-w-[140px]"
          : "border-slate-700 bg-slate-900/90 text-slate-300 min-w-[120px]"
        }`}
      onClick={() => data.onNodeClick?.(data)}
    >
      <Handle type="target" position={Position.Left} className="w-1 h-3 rounded-sm bg-[#2dd4bf]/40 border-none -ml-0.5" />

      <div className={`flex h-8 w-8 items-center justify-center rounded-md ${isFolder ? 'bg-[#2dd4bf]/10' : 'bg-slate-800'}`}>
        <Icon className={`h-4 w-4 ${isFolder ? 'text-[#2dd4bf]' : 'text-slate-400'}`} />
      </div>

      <div className="flex flex-col">
        <span className="text-[12.5px] font-medium tracking-tight truncate max-w-[140px]">{data.label}</span>
        {!isFolder && data.size && (
          <span className="text-[9.5px] text-slate-500 uppercase tracking-wider">{data.size}</span>
        )}
      </div>

      <Handle type="source" position={Position.Right} className="w-1 h-3 rounded-sm bg-[#2dd4bf]/40 border-none -mr-0.5" />
    </div>
  );
}

const nodeTypes = {
  cyberNode: CyberNode,
};

function buildGraph(files: any[], onNodeClick: (data: any) => void) {
  const root = { name: "root", path: "", children: {} as any, data: { type: "folder" } };

  for (const file of files) {
    const parts = file.path.split(/[/\\]/);
    let current = root;
    let currentPath = "";
    for (let i = 0; i < parts.length; i++) {
      currentPath += (currentPath ? "/" : "") + parts[i];
      if (!current.children[parts[i]]) {
        const isFile = i === parts.length - 1;
        current.children[parts[i]] = {
          name: parts[i],
          path: currentPath,
          children: {},
          data: isFile ? { ...file, type: 'file' } : { type: 'folder' }
        };
      }
      current = current.children[parts[i]];
    }
  }

  const nodes: any[] = [];
  const edges: any[] = [];
  let currentY = 0;

  function traverse(node: any, depth: number, parentId: string | null) {
    const id = node.path || "root";
    const keys = Object.keys(node.children);
    const startY = currentY;

    if (keys.length === 0) {
      currentY += 75; // vertical spacing
    } else {
      for (const key of keys) {
        traverse(node.children[key], depth + 1, id);
      }
    }

    const y = keys.length === 0 ? startY : (startY + currentY - 75) / 2;

    // Skip creating a single empty root if there are actual items
    if (id !== "root" || keys.length > 0) {
      nodes.push({
        id,
        type: 'cyberNode',
        position: { x: depth * 280, y }, // horizontal spacing
        data: {
          label: node.name || "repository",
          path: id,
          ...node.data,
          onNodeClick
        }
      });

      if (parentId) {
        edges.push({
          id: `${parentId}->${id}`,
          source: parentId,
          target: id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: 'hsl(172 76% 47% / 0.3)', strokeWidth: 1.5 }
        });
      }
    }
  }

  traverse(root, 0, null);
  return { nodes, edges };
}

export function RepositoryGraph({ data }: { data?: any[] }) {
  const [selectedNode, setSelectedNode] = useState<any>(null);

  const { initialNodes, initialEdges } = useMemo(() => {
    // If no data, provide a fallback generic set
    const filesToParse = data && data.length > 0 ? data : [
      { path: "src/index.tsx", size: "2 KB", language: "TypeScript" },
      { path: "src/App.tsx", size: "4 KB", language: "TypeScript" },
      { path: "src/components/Button.tsx", size: "1.2 KB", language: "TypeScript" },
      { path: "package.json", size: "1 KB", language: "JSON" },
      { path: "README.md", size: "3 KB", language: "Markdown" },
    ];

    const graph = buildGraph(filesToParse, (nodeData) => {
      setSelectedNode(nodeData);
    });
    return { initialNodes: graph.nodes, initialEdges: graph.edges };
  }, [data]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Update nodes/edges if data changes
  useMemo(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [initialNodes, initialEdges, setNodes, setEdges]);

  return (
    <div className="relative w-full h-full bg-[#040814] rounded-xl overflow-hidden border border-white/5 shadow-inner">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={1.5}
      >
        <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#ffffff10" />
        <div className="[&_.react-flow__controls-button]:text-lg [&_.react-flow__controls-button]:bg-[#0b1121] [&_.react-flow__controls-button]:border-b [&_.react-flow__controls-button]:border-white/10 [&_.react-flow__controls-button]:fill-[#2dd4bf] [&_.react-flow__controls-button:hover]:bg-[#132d30] [&_.react-flow__controls-button]:transition-colors">
          <Controls className="  !shadow-none overflow-hidden rounded-md border border-white/10" showInteractive={false} />
        </div>

        <MiniMap
          className="bg-[#0f172a] border border-white/10 !rounded-lg overflow-hidden"
          nodeColor={(n: any) => n.data?.type === "folder" ? "#2dd4bf" : "#475569"}
          maskColor="#0b112180"
        />
      </ReactFlow>

      {/* Selected Node Detail Overlay */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-6 right-6 w-80 rounded-xl border border-[#2dd4bf]/30 bg-[#0f172a]/95 p-5 backdrop-blur-lg shadow-[0_10px_40px_-10px_rgba(45,212,191,0.2)]"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <Info className="h-4 w-4 text-[#2dd4bf]" />
                <h3 className="text-sm font-semibold text-white">Node Metadata</h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Path</div>
                <div className="text-xs font-mono text-slate-200 break-all bg-black/30 p-1.5 rounded">{selectedNode.path}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Type</div>
                  <div className="text-xs text-white capitalize">{selectedNode.type}</div>
                </div>
                {selectedNode.type === 'file' && (
                  <>
                    {selectedNode.size && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Size</div>
                        <div className="text-xs text-white">{selectedNode.size}</div>
                      </div>
                    )}
                    {selectedNode.language && (
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Language</div>
                        <div className="text-xs text-[#2dd4bf] font-medium">{selectedNode.language}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
