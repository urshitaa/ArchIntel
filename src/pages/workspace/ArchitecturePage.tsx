import { useState, useEffect } from "react";
import { Layers, Search, Filter, Play, Pause, ChevronLeft, ChevronRight, Share2, Monitor, FileText, Settings, Box, Database, Folder, File, ArrowRight, ArrowDown } from "lucide-react";
import { ReactFlow, Background, MarkerType, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useOutletContext } from "react-router-dom";
import { FileTree } from "@/components/workspace/FileTree";
import { fileTree as fallbackTree } from "@/components/workspace/data";
import { motion, AnimatePresence } from "framer-motion";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";

export function ArchitecturePage() {
  const { analysisResult } = useOutletContext<any>();
  const [loading, setLoading] = useState(false);
  const [archData, setArchData] = useState<any>(null);

  useEffect(() => {
    if (analysisResult?.files) {
      setLoading(true);
      fetchApi("/repositories/architecture", {
        method: "POST",
        body: JSON.stringify({ files: analysisResult.files.slice(0, 50) }) // limit for speed
      }).then(res => {
        setArchData(res);
      }).catch(e => {
        console.error(e);
        toast.error("Failed to load AI architecture insights");
      }).finally(() => {
        setLoading(false);
      });
    }
  }, [analysisResult]);

  const dynamicTree = analysisResult?.files ? buildTree(analysisResult.files, archData) : fallbackTree;

  const [selectedNode, setSelectedNode] = useState<any | null>(
    dynamicTree[0]?.children?.[0]?.children?.[0] ?? dynamicTree[0] ?? null,
  );

  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const [selectedHeatmapNode, setSelectedHeatmapNode] = useState<any | null>(null);

  // When archData loads, pre-select the highest complexity node
  useEffect(() => {
    if (archData?.complexity && Object.keys(archData.complexity).length > 0) {
      const sorted = Object.entries(archData.complexity).sort((a: any, b: any) => b[1].score - a[1].score);
      setSelectedHeatmapNode({ path: sorted[0][0], ...sorted[0][1] as any });
    }
  }, [archData]);

  function buildTree(flatFiles: any[], arch: any): any[] {
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
          const summary = arch?.summaries ? arch.summaries[currentPath] : null;
          const complexity = arch?.complexity ? arch.complexity[currentPath] : null;

          node = {
            name: part,
            type: isFile ? "file" : "folder",
            path: currentPath,
            size: isFile ? (file.size / 1024).toFixed(1) + " KB" : undefined,
            ext: isFile ? part.split(".").pop() : undefined,
            children: isFile ? undefined : [],
            summary: summary || (isFile ? `File written in ${file.language || 'code'}` : "Folder"),
            complexity: complexity || null,
            language: file.language,
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

  const narrativeSteps = archData?.narrative || [
    { step: 1, title: "Overview", description: "Loading architecture details...", components: ["App"] }
  ];

  const currentNarrative = narrativeSteps[activeStepIndex];

  const generateSystemArchitecture = (files: any[]) => {
    if (!files || files.length === 0) return [];
    
    const layerGroups = {
      "CLIENT": [] as any[],
      "SERVER": [] as any[],
      "DATABASE": [] as any[],
      "OTHER": [] as any[]
    };
    
    files.forEach(file => {
      const pathStr = file.path.replace(/\\/g, '/').toLowerCase();
      let assignedLayer = "OTHER";
      
      if (pathStr.includes("db") || pathStr.includes("database") || pathStr.includes("schema") || pathStr.includes("migration") || pathStr.includes("prisma")) {
        assignedLayer = "DATABASE";
      } else if (pathStr.includes("api") || pathStr.includes("server") || pathStr.includes("backend") || pathStr.includes("controller") || pathStr.includes("route") || pathStr.includes("core")) {
        assignedLayer = "SERVER";
      } else if (pathStr.includes("src") || pathStr.includes("ui") || pathStr.includes("page") || pathStr.includes("component") || pathStr.includes("client") || pathStr.includes("frontend")) {
        assignedLayer = "CLIENT";
      }
      
      const pathParts = file.path.replace(/\\/g, '/').split('/');
      let componentName = "Root Files";
      if (pathParts.length > 1) {
        componentName = pathParts[pathParts.length > 2 ? pathParts.length - 2 : 0];
      }
      if (assignedLayer === "OTHER" && pathParts.length === 1) {
        componentName = "Configuration";
      }
      
      layerGroups[assignedLayer as keyof typeof layerGroups].push({ ...file, componentName });
    });
    
    const layers: any[] = [];
    const colors = {
      "CLIENT": "bg-blue-500",
      "SERVER": "bg-emerald-500",
      "DATABASE": "bg-purple-500",
      "OTHER": "bg-slate-400"
    };
    
    let level = 0;
    Object.entries(layerGroups).forEach(([layerName, layerFiles]) => {
      if (layerFiles.length === 0) return;
      
      const compMap = new Map<string, any[]>();
      layerFiles.forEach(f => {
        if (!compMap.has(f.componentName)) compMap.set(f.componentName, []);
        compMap.get(f.componentName)!.push(f);
      });
      
      const components: any[] = [];
      compMap.forEach((items, compName) => {
        const displayItems = items.slice(0, 4).map(f => {
          const name = f.path.split(/[/\\]/).pop();
          const isFile = name.includes('.');
          return { name, type: isFile ? 'file' : 'folder', language: f.language };
        });
        
        let icon = "Folder";
        const cNameLower = compName.toLowerCase();
        if (layerName === "DATABASE") icon = "Database";
        else if (layerName === "SERVER") icon = "Settings";
        else if (layerName === "CLIENT") icon = "Monitor";
        else if (cNameLower.includes("config") || layerName === "OTHER") icon = "Box";
        
        components.push({
          name: compName.charAt(0).toUpperCase() + compName.slice(1),
          icon,
          count: items.length,
          items: displayItems,
          moreCount: items.length > 4 ? items.length - 4 : 0
        });
      });
      
      layers.push({
        name: layerName,
        level: level++,
        color: colors[layerName as keyof typeof colors],
        components: components.sort((a, b) => b.count - a.count)
      });
    });
    
    return layers;
  };
  
  const systemLayers = generateSystemArchitecture(analysisResult?.files || []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Monitor": return <Monitor className="w-4 h-4 text-blue-400" />;
      case "FileText": return <FileText className="w-4 h-4 text-slate-400" />;
      case "Settings": return <Settings className="w-4 h-4 text-emerald-500" />;
      case "Box": return <Box className="w-4 h-4 text-orange-400" />;
      case "Database": return <Database className="w-4 h-4 text-purple-400" />;
      case "Folder": return <Folder className="w-4 h-4 text-yellow-500" />;
      default: return <Layers className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="flex flex-col gap-12 pb-20 w-full max-w-6xl mx-auto">

      {loading && (
        <div className="flex items-center justify-center p-12 border border-primary/20 bg-primary/5 rounded-2xl">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          <span className="ml-4 text-primary font-medium tracking-tight">Generating AI Architecture Insights...</span>
        </div>
      )}

      {/* Collapsible Tree Architecture */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Collapsible Tree Architecture</h2>
          <p className="text-slate-400 text-sm">Explore your system in a hierarchical tree structure</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#060c14] border border-white/5 rounded-2xl p-6">

          {/* Left: Tree */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4 border-r border-white/5 pr-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-white">Architecture Tree</h3>
              <button className="text-[#2dd4bf] hover:brightness-110 transition-all"><Share2 className="w-4 h-4" /></button>
            </div>

            <div className="flex items-center gap-2 bg-[#0b1121] border border-white/10 rounded-lg px-3 py-2 text-sm focus-within:border-[#2dd4bf]/50 transition-colors">
              <Search className="w-4 h-4 text-slate-500" />
              <input type="text" placeholder="Search components..." className="bg-transparent outline-none text-white w-full placeholder:text-slate-500" />
              <button className="text-slate-500 hover:text-white"><Filter className="w-4 h-4" /></button>
            </div>

            <div className="h-[400px] overflow-y-auto custom-scrollbar pt-2">
              <FileTree nodes={dynamicTree} selectedPath={selectedNode?.path ?? null} onSelect={setSelectedNode} rootName={analysisResult?.repository?.name || "Repository"} />
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-5 xl:col-span-4 flex flex-col">
            {selectedNode ? (
              <div className="bg-[#0b1121]/50 border border-white/5 rounded-xl p-6 flex flex-col gap-6 h-full">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#2dd4bf]/10 border border-[#2dd4bf]/30 flex items-center justify-center text-[#2dd4bf]">
                    <Layers className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white line-clamp-1 break-all">{selectedNode.name}</h3>
                    <p className="text-xs text-slate-400">{selectedNode.type === 'file' ? 'File' : 'Module'}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Type</p>
                    <p className="text-sm text-slate-200">{selectedNode.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Language</p>
                    <p className="text-sm text-slate-200">{selectedNode.language || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Size</p>
                    <p className="text-sm text-slate-200">{selectedNode.size || "Unknown"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Dependencies</p>
                    <p className="text-sm text-slate-200">{Math.max(0, (selectedNode.loc ?? 1) % 5)}</p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Description</p>
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedNode.summary}
                  </p>
                </div>

                <div className="mt-auto pt-4">
                  <button className="w-full py-2.5 rounded-lg border border-[#2dd4bf]/30 text-[#2dd4bf] text-sm font-semibold hover:bg-[#2dd4bf]/10 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm border border-dashed border-white/10 rounded-xl">
                Select a node to view details
              </div>
            )}
          </div>

        </div>
      </section>

      {/* System Architecture (Layered) */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">System Architecture</h2>
          <p className="text-slate-400 text-sm">Visualizing the system layered structure based on repository files</p>
        </div>

        <div className="bg-[#060c14] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col gap-2">
          
          {systemLayers.map((layer, lIdx) => (
            <div key={lIdx} className="flex flex-col">
              <div className="flex flex-col gap-4 bg-[#0b1121]/20 p-4 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between pb-2 border-b border-white/5">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-300 tracking-wider">
                    <div className={`w-2 h-2 rounded-full ${layer.color} shadow-[0_0_10px_currentColor]`} />
                    {layer.name}
                  </div>
                  <span className="text-xs text-slate-500 font-mono">layer.{layer.level}</span>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-6 overflow-x-auto custom-scrollbar pb-4">
                  {layer.components.map((comp, cIdx) => (
                    <div key={cIdx} className="flex items-center gap-6 shrink-0">
                      <div className="flex flex-col bg-[#0b1121]/80 border border-white/10 rounded-2xl w-[280px]">
                        <div className="flex items-center justify-between p-4 border-b border-white/5">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
                                {getIcon(comp.icon)}
                             </div>
                             <span className="font-semibold text-sm text-slate-200">{comp.name}</span>
                          </div>
                          <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-xs text-slate-400 font-medium">
                             {comp.count}
                          </div>
                        </div>
                        <div className="p-4 flex flex-col gap-3 min-h-[140px]">
                          {comp.items.map((item, idx) => (
                             <div key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                                {item.type === 'folder' ? <Folder className="w-3.5 h-3.5 opacity-70" /> : <File className="w-3.5 h-3.5 opacity-70" />}
                                <span className="truncate">{item.name}</span>
                                {item.language === 'Go' && <span className="ml-auto text-emerald-500 font-mono text-[10px] font-bold">GO</span>}
                             </div>
                          ))}
                          {comp.moreCount > 0 && (
                             <div className="text-xs text-slate-500 mt-auto pt-2">
                                +{comp.moreCount} more
                             </div>
                          )}
                        </div>
                      </div>
                      {cIdx < layer.components.length - 1 && (
                        <div className="hidden md:flex items-center gap-1 text-emerald-500/50">
                          <div className="w-4 h-[1px] bg-emerald-500/50 border-dashed" />
                          <ArrowRight className="w-4 h-4 opacity-50" />
                          <div className="w-4 h-[1px] bg-emerald-500/50 border-dashed" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Vertical Layer Connector */}
              {lIdx < systemLayers.length - 1 && (
                <div className="flex justify-center py-2">
                   <div className="flex flex-col items-center gap-1 text-slate-500/50">
                      <div className="w-[1px] h-4 bg-slate-500/30 border-dashed" />
                      <ArrowDown className="w-4 h-4 opacity-50" />
                      <div className="w-[1px] h-4 bg-slate-500/30 border-dashed" />
                   </div>
                </div>
              )}
            </div>
          ))}

          {/* Legend */}
          <div className="mt-4 flex flex-wrap items-center gap-4 bg-[#0b1121]/50 border border-white/5 rounded-xl p-4">
            {systemLayers.flatMap(l => l.components).map((comp, idx) => (
              <div key={idx} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#060c14] border border-white/5 text-xs text-slate-400">
                {getIcon(comp.icon)}
                <span>{comp.name}</span>
                <span className="text-white font-medium ml-1">{comp.count}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Heatmap Architecture (Graph) */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">Architecture Heatmap</h2>
          <p className="text-slate-400 text-sm">Visualize system dependencies and complexity scores</p>
        </div>

        <div className="bg-[#060c14] border border-white/5 rounded-2xl p-6 flex flex-col relative h-[600px] w-full">
          <div className="absolute top-6 left-6 z-10 flex items-center gap-3 text-xs text-slate-400 bg-[#0b1121]/80 px-4 py-2 rounded-lg border border-white/5 backdrop-blur">
            Low
            <div className="w-32 h-1.5 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
            High
          </div>
          
          <div className="w-full h-full">
            <HeatmapFlow archData={archData} onNodeClick={setSelectedHeatmapNode} />
          </div>
        </div>

        {/* Complexity Detail Box */}
        {selectedHeatmapNode && (
          <div className="border border-white/10 bg-[#060c14] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h4 className="text-lg font-bold text-white break-all">{selectedHeatmapNode.path.split(/[/\\]/).pop()}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${selectedHeatmapNode.score > 80 ? "border-red-500/30 text-red-400 bg-red-500/10" :
                    selectedHeatmapNode.score > 60 ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" :
                      "border-green-500/30 text-green-400 bg-green-500/10"
                  }`}>
                  {selectedHeatmapNode.score > 80 ? "High" : selectedHeatmapNode.score > 60 ? "Medium" : "Low"} Complexity
                </span>
              </div>
              <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                {selectedHeatmapNode.reason || "This component has standard complexity based on its path and size."}
              </p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-1">
                <div className={`relative w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center ${selectedHeatmapNode.score > 80 ? "border-t-red-500 border-r-red-500" :
                    selectedHeatmapNode.score > 60 ? "border-t-yellow-500 border-r-yellow-500" :
                      "border-t-green-500 border-r-green-500"
                  }`}>
                  <span className="text-white font-bold text-xl">{selectedHeatmapNode.score}</span>
                </div>
                <span className="text-xs text-slate-500">Complexity Score</span>
              </div>
              <button className="px-5 py-2.5 rounded-lg border border-[#2dd4bf]/30 text-[#2dd4bf] text-sm font-semibold hover:bg-[#2dd4bf]/10 transition-colors">
                View Insights
              </button>
            </div>
          </div>
        )}
      </section>

    </div>
  );
}

function HeatmapFlow({ archData, onNodeClick }: { archData: any, onNodeClick: (node: any) => void }) {
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<any[]>([]);

  useEffect(() => {
    if (!archData?.complexity) return;

    // Sort by complexity score desc to get top items
    const entries = Object.entries(archData.complexity)
      .map(([path, data]: any) => ({ path, name: path.split(/[/\\]/).pop(), ...data }))
      .sort((a: any, b: any) => b.score - a.score)
      .slice(0, 12); // Limit to top 12 components

    // Categorize into tiers based on path names
    const tiers = {
      client: [] as any[],
      gateway: [] as any[],
      services: [] as any[],
      database: [] as any[]
    };

    entries.forEach((item: any) => {
      const p = item.path.toLowerCase();
      if (p.includes('db') || p.includes('schema') || p.includes('model') || p.includes('redis') || p.includes('storage')) {
        tiers.database.push(item);
      } else if (p.includes('api') || p.includes('router') || p.includes('main') || p.includes('gateway') || p.includes('core')) {
        tiers.gateway.push(item);
      } else if (p.includes('src') || p.includes('ui') || p.includes('page') || p.includes('components')) {
        tiers.client.push(item);
      } else {
        tiers.services.push(item);
      }
    });

    // Fallback: if client/gateway is empty, redistribute
    if (tiers.client.length === 0 && tiers.services.length > 2) {
      tiers.client.push(tiers.services.shift());
    }
    if (tiers.gateway.length === 0 && tiers.services.length > 0) {
      tiers.gateway.push(tiers.services.shift());
    }

    const newNodes: any[] = [];
    const newEdges: any[] = [];
    let nodeId = 1;

    // Helper to add nodes for a tier
    const addTierNodes = (items: any[], yPos: number) => {
      const spacingX = 200;
      const startX = -((items.length - 1) * spacingX) / 2;
      const tierNodeIds: string[] = [];

      items.forEach((item, idx) => {
        const id = `node-${nodeId++}`;
        tierNodeIds.push(id);

        let colorObj = { bg: "bg-green-500/10", border: "border-green-500/50", text: "text-green-400" };
        let edgeColor = "#22c55e";
        if (item.score > 80) { colorObj = { bg: "bg-red-500/10", border: "border-red-500/50", text: "text-red-400" }; edgeColor = "#ef4444"; }
        else if (item.score > 60) { colorObj = { bg: "bg-yellow-500/10", border: "border-yellow-500/50", text: "text-yellow-400" }; edgeColor = "#eab308"; }

        newNodes.push({
          id,
          position: { x: startX + idx * spacingX, y: yPos },
          data: { label: item.name, item, edgeColor, colorObj },
          type: 'heatmapNode'
        });
      });
      return tierNodeIds;
    };

    const clientIds = addTierNodes(tiers.client, 50);
    const gatewayIds = addTierNodes(tiers.gateway, 180);
    const serviceIds = addTierNodes(tiers.services, 320);
    const dbIds = addTierNodes(tiers.database, 460);

    // Connect Client -> Gateway
    clientIds.forEach(c => {
      gatewayIds.forEach(g => {
        newEdges.push({ id: `e-${c}-${g}`, source: c, target: g, type: 'smoothstep', style: { stroke: newNodes.find(n => n.id === g).data.edgeColor, strokeWidth: 2, strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed, color: newNodes.find(n => n.id === g).data.edgeColor } });
      });
    });

    // Connect Gateway -> Services
    gatewayIds.forEach(g => {
      serviceIds.forEach(s => {
        newEdges.push({ id: `e-${g}-${s}`, source: g, target: s, type: 'smoothstep', style: { stroke: newNodes.find(n => n.id === s).data.edgeColor, strokeWidth: 2, strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed, color: newNodes.find(n => n.id === s).data.edgeColor } });
      });
    });

    // Connect Services -> DB
    serviceIds.forEach(s => {
      dbIds.forEach(d => {
        newEdges.push({ id: `e-${s}-${d}`, source: s, target: d, type: 'smoothstep', style: { stroke: newNodes.find(n => n.id === d).data.edgeColor, strokeWidth: 2, strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed, color: newNodes.find(n => n.id === d).data.edgeColor } });
      });
    });
    
    // If services empty, connect Gateway directly to DB
    if (serviceIds.length === 0) {
       gatewayIds.forEach(g => {
         dbIds.forEach(d => {
           newEdges.push({ id: `e-${g}-${d}`, source: g, target: d, type: 'smoothstep', style: { stroke: newNodes.find(n => n.id === d).data.edgeColor, strokeWidth: 2, strokeDasharray: '5 5' }, markerEnd: { type: MarkerType.ArrowClosed, color: newNodes.find(n => n.id === d).data.edgeColor } });
         });
       });
    }

    setNodes(newNodes);
    setEdges(newEdges);
  }, [archData]);

  const nodeTypes = {
    heatmapNode: ({ data }: any) => (
      <div 
        onClick={() => onNodeClick(data.item)}
        className={`px-6 py-4 rounded-xl border-2 ${data.colorObj.border} ${data.colorObj.bg} shadow-[0_0_20px_currentColor] cursor-pointer hover:scale-105 transition-transform min-w-[140px] flex flex-col items-center justify-center bg-[#060c14] relative`}
        style={{ color: data.edgeColor }}
      >
        <Handle type="target" position={Position.Top} style={{ visibility: 'hidden' }} />
        <span className="font-bold text-sm text-center line-clamp-2 leading-tight">{data.label}</span>
        <Handle type="source" position={Position.Bottom} style={{ visibility: 'hidden' }} />
      </div>
    )
  };

  if (nodes.length === 0) {
     return <div className="w-full h-full flex items-center justify-center text-slate-500 italic">Analyze repository to view heatmap architecture diagram</div>;
  }

  return (
    <ReactFlow 
      nodes={nodes} 
      edges={edges} 
      nodeTypes={nodeTypes}
      fitView 
      className="bg-[#060c14] rounded-xl"
      proOptions={{ hideAttribution: true }}
    >
      <Background color="#1e293b" gap={16} size={1} />
    </ReactFlow>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
