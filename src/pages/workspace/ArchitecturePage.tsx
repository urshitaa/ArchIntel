import { useState, useEffect } from "react";
import { Layers, Search, Filter, Play, Pause, ChevronLeft, ChevronRight, Share2 } from "lucide-react";
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

  return (
    <div className="flex flex-col gap-12 pb-20 w-full max-w-6xl mx-auto">
      
      {loading && (
        <div className="flex items-center justify-center p-12 border border-primary/20 bg-primary/5 rounded-2xl">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
          <span className="ml-4 text-primary font-medium tracking-tight">Generating AI Architecture Insights...</span>
        </div>
      )}

      {/* 9. Collapsible Tree Architecture */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">9. Collapsible Tree Architecture</h2>
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

      {/* 8. AI Narrated Architecture */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">8. AI Narrated Architecture</h2>
          <p className="text-slate-400 text-sm">Let AI walk you through your architecture step-by-step</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-[#060c14] border border-white/5 rounded-2xl p-6 md:p-8">
          
          {/* Left: Stepper */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            {narrativeSteps.map((step: any, idx: number) => (
              <button 
                key={idx}
                onClick={() => setActiveStepIndex(idx)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-all text-left ${
                  activeStepIndex === idx 
                    ? "bg-[#2dd4bf]/10 border-[#2dd4bf]/50 text-[#2dd4bf]" 
                    : "bg-[#0b1121] border-white/5 text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`}
              >
                <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                  activeStepIndex === idx ? "bg-[#2dd4bf] text-[#060c14]" : "bg-white/10 text-slate-400"
                }`}>
                  {step.step}
                </span>
                <span className="font-medium text-sm truncate">{step.title}</span>
              </button>
            ))}
          </div>

          {/* Middle: Diagram Area */}
          <div className="lg:col-span-6 flex flex-col border border-white/5 bg-[#0b1121]/30 rounded-2xl p-6 relative min-h-[300px]">
             
             {/* Dynamic Nodes based on Narrative Components */}
             <div className="flex-1 flex flex-wrap items-center justify-center gap-8 relative z-10">
               <AnimatePresence mode="popLayout">
                 {currentNarrative?.components?.map((comp: string, i: number) => (
                   <motion.div
                     key={comp + i}
                     initial={{ opacity: 0, scale: 0.8 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.8 }}
                     className="px-6 py-4 rounded-xl border border-[#2dd4bf]/40 bg-[#060c14] shadow-[0_0_30px_rgba(45,212,191,0.15)] flex items-center justify-center gap-3"
                   >
                     <div className="w-2 h-2 rounded-full bg-[#2dd4bf] animate-pulse" />
                     <span className="text-[#2dd4bf] font-semibold text-sm">{comp}</span>
                   </motion.div>
                 ))}
               </AnimatePresence>
             </div>

             {/* Playback Controls */}
             <div className="mt-auto flex items-center justify-center gap-6 pt-6">
                <button 
                  onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="w-12 h-12 rounded-full bg-[#2dd4bf]/20 border border-[#2dd4bf]/50 flex items-center justify-center text-[#2dd4bf] hover:bg-[#2dd4bf]/30 transition-colors">
                  <Pause className="w-5 h-5 fill-current" />
                </button>
                <button 
                  onClick={() => setActiveStepIndex(Math.min(narrativeSteps.length - 1, activeStepIndex + 1))}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
             </div>
          </div>

          {/* Right: AI Explanation */}
          <div className="lg:col-span-3 bg-[#0b1121]/50 border border-white/5 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center gap-2 mb-6">
              <SparklesIcon className="w-5 h-5 text-[#2dd4bf]" />
              <h3 className="font-bold text-white text-sm">AI Explanation</h3>
            </div>
            <motion.p 
              key={activeStepIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-slate-300 text-sm leading-relaxed"
            >
              {currentNarrative?.description}
            </motion.p>

            <div className="mt-auto pt-6">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>Step {activeStepIndex + 1} of {narrativeSteps.length}</span>
              </div>
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#2dd4bf] transition-all duration-500" 
                  style={{ width: `${((activeStepIndex + 1) / narrativeSteps.length) * 100}%` }} 
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 6. Heatmap Architecture */}
      <section className="flex flex-col gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white mb-1">6. Heatmap Architecture</h2>
          <p className="text-slate-400 text-sm">Spot complex and critical components at a glance</p>
        </div>

        <div className="bg-[#060c14] border border-white/5 rounded-2xl p-6 md:p-8 flex flex-col">
          <div className="flex items-center justify-between mb-10">
            <h3 className="font-semibold text-white">Architecture Heatmap</h3>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              Low
              <div className="w-32 h-1.5 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500" />
              High
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-6 mb-12">
            {Object.entries(archData?.complexity || {}).slice(0, 8).map(([path, data]: any) => {
              const score = data.score || 50;
              let color = "border-green-500 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.1)]";
              if (score > 60) color = "border-yellow-500 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]";
              if (score > 80) color = "border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.1)]";

              const name = path.split('/').pop();
              const isSelected = selectedHeatmapNode?.path === path;

              return (
                <div 
                  key={path} 
                  onClick={() => setSelectedHeatmapNode({ path, ...data })}
                  className={`px-6 py-4 rounded-xl border bg-[#0b1121] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 ${color} ${isSelected ? 'scale-110 ring-2 ring-white/20' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
                >
                  <span className="font-semibold text-sm mb-1">{name}</span>
                  <span className="text-xs opacity-80">Score: {score}</span>
                </div>
              );
            })}
            
            {(!archData?.complexity || Object.keys(archData.complexity).length === 0) && (
              <div className="text-slate-500 text-sm italic">Analyze repository to see heatmap data</div>
            )}
          </div>

          {/* Complexity Detail Box */}
          {selectedHeatmapNode && (
            <div className="border border-white/10 bg-[#0b1121] rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h4 className="text-lg font-bold text-white break-all">{selectedHeatmapNode.path.split('/').pop()}</h4>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                    selectedHeatmapNode.score > 80 ? "border-red-500/30 text-red-400 bg-red-500/10" :
                    selectedHeatmapNode.score > 60 ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" :
                    "border-green-500/30 text-green-400 bg-green-500/10"
                  }`}>
                    {selectedHeatmapNode.score > 80 ? "High" : selectedHeatmapNode.score > 60 ? "Medium" : "Low"} Complexity
                  </span>
                </div>
                <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                  {selectedHeatmapNode.reason || "This component has standard complexity."}
                </p>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center gap-1">
                  <div className={`relative w-16 h-16 rounded-full border-4 border-slate-800 flex items-center justify-center ${
                    selectedHeatmapNode.score > 80 ? "border-t-red-500 border-r-red-500" :
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

        </div>
      </section>

    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/>
      <path d="M19 17v4"/>
      <path d="M3 5h4"/>
      <path d="M17 19h4"/>
    </svg>
  );
}
