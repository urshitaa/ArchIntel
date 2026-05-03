import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { Layers, Folder, FileCode, Database, Terminal, Settings, Box, Book, Search } from "lucide-react";

// --- ARCHITECTURE PROFILES ---
const PROFILES = {
  fullstack: {
    name: "Full Stack App",
    layers: [
      { id: "client", name: "Client", accent: "hsl(200 90% 65%)" },
      { id: "api", name: "API Routes", accent: "hsl(172 76% 55%)" },
      { id: "services", name: "Services", accent: "hsl(160 70% 50%)" },
      { id: "data", name: "Database", accent: "hsl(220 70% 60%)" },
      { id: "config", name: "Configuration", accent: "hsl(180 20% 50%)" }
    ],
    keywords: {
      client: ["components", "pages", "app", "ui", "views", "screens", "hooks", "layouts", "src/pages", "src/components", "public", "assets"],
      api: ["api", "routes", "controllers", "middleware", "routers", "handlers"],
      services: ["services", "business", "domain", "core", "lib", "utils", "helpers"],
      data: ["db", "models", "schema", "prisma", "database", "repositories", "migrations"],
      config: ["config", "package", "eslint", "tsconfig", "webpack", "vite", "readme", "gitignore", "docker", "test", "tests", "e2e", "github", "scripts"]
    }
  },
  backend: {
    name: "Backend API",
    layers: [
      { id: "api", name: "API Routes", accent: "hsl(172 76% 55%)" },
      { id: "services", name: "Services", accent: "hsl(160 70% 50%)" },
      { id: "data", name: "Database", accent: "hsl(220 70% 60%)" },
      { id: "config", name: "Configuration", accent: "hsl(180 20% 50%)" }
    ],
    keywords: {
      api: ["api", "routes", "controllers", "middleware", "handlers", "routers", "cmd", "server"],
      services: ["services", "business", "domain", "core", "usecases", "utils", "lib", "helpers", "internal", "pkg"],
      data: ["db", "prisma", "models", "repositories", "database", "schemas", "migrations", "orm"],
      config: ["config", "package", "eslint", "tsconfig", "webpack", "vite", "readme", "gitignore", "docker", "test", "tests", "e2e", "requirements", "mod", "pom", "gradle", "makefile", "scripts", "build", "ci", "github", "docs", "pages", "ui", "assets"]
    }
  },
  frontend: {
    name: "Frontend Web App",
    layers: [
      { id: "client", name: "Client", accent: "hsl(200 90% 65%)" },
      { id: "api", name: "API / State", accent: "hsl(172 76% 55%)" },
      { id: "assets", name: "Assets / Storage", accent: "hsl(160 70% 50%)" },
      { id: "config", name: "Configuration", accent: "hsl(180 20% 50%)" }
    ],
    keywords: {
      client: ["components", "pages", "app", "hooks", "ui", "layouts", "views", "screens", "index", "main", "scripts"],
      api: ["api", "services", "store", "context", "actions", "reducers"],
      assets: ["assets", "images", "static", "styles", "css", "scss", "fonts", "public", "icons"],
      config: ["config", "package", "eslint", "tsconfig", "webpack", "vite", "readme", "gitignore", "docker", "test", "tests", "e2e", "github"]
    }
  },
  ml: {
    name: "Machine Learning Project",
    layers: [
      { id: "input", name: "Data Input", accent: "hsl(200 90% 65%)" },
      { id: "prep", name: "Preprocessing", accent: "hsl(172 76% 55%)" },
      { id: "engine", name: "Model Engine", accent: "hsl(160 70% 50%)" },
      { id: "output", name: "Output", accent: "hsl(220 70% 60%)" },
      { id: "config", name: "Configuration", accent: "hsl(180 20% 50%)" }
    ],
    keywords: {
      input: ["data", "datasets", "raw", "inputs", "loaders", "fetchers"],
      prep: ["preprocess", "transforms", "features", "cleaning", "augmentation"],
      engine: ["models", "ml", "training", "notebooks", "nets", "architectures", "layers", "model"],
      output: ["output", "results", "inference", "predictions", "exports", "metrics", "eval"],
      config: ["config", "requirements", "setup", "readme", "gitignore", "docker", "test", "tests", "scripts", "docs"]
    }
  },
  cli: {
    name: "CLI Tool",
    layers: [
      { id: "commands", name: "Commands", accent: "hsl(200 90% 65%)" },
      { id: "engine", name: "Core Engine", accent: "hsl(172 76% 55%)" },
      { id: "output", name: "Output", accent: "hsl(160 70% 50%)" },
      { id: "config", name: "Configuration", accent: "hsl(180 20% 50%)" }
    ],
    keywords: {
      commands: ["cmd", "commands", "cli", "args", "flags", "parser"],
      engine: ["pkg", "internal", "core", "engine", "lib", "runner", "executor", "utils", "helpers"],
      output: ["formatters", "reporters", "display", "ui", "loggers", "output", "views"],
      config: ["config", "package", "readme", "gitignore", "docker", "test", "tests", "mod", "pom", "gradle", "makefile", "scripts", "build", "ci", "github", "docs", "assets"]
    }
  },
  security: {
    name: "Security / Network Tool",
    layers: [
      { id: "input", name: "Traffic / Input", accent: "hsl(200 90% 65%)" },
      { id: "analyzer", name: "Analyzer", accent: "hsl(172 76% 55%)" },
      { id: "engine", name: "Detection Engine", accent: "hsl(160 70% 50%)" },
      { id: "output", name: "Reports", accent: "hsl(220 70% 60%)" },
      { id: "config", name: "Configuration", accent: "hsl(180 20% 50%)" }
    ],
    keywords: {
      input: ["traffic", "packets", "input", "network", "capture", "listeners"],
      analyzer: ["analyzer", "scanners", "parsers", "decoders", "filters"],
      engine: ["detectors", "engine", "rules", "signatures", "core", "pkg", "internal"],
      output: ["reports", "logs", "alerts", "output", "ui"],
      config: ["config", "readme", "gitignore", "docker", "test", "tests", "scripts", "build", "github", "docs"]
    }
  },
  mobile: {
    name: "Mobile App",
    layers: [
      { id: "ui", name: "UI Components", accent: "hsl(200 90% 65%)" },
      { id: "logic", name: "Business Logic", accent: "hsl(172 76% 55%)" },
      { id: "native", name: "Native Layers", accent: "hsl(160 70% 50%)" },
      { id: "config", name: "Configuration", accent: "hsl(180 20% 50%)" }
    ],
    keywords: {
      ui: ["screens", "views", "components", "widgets", "ui", "pages"],
      logic: ["bloc", "store", "viewmodels", "services", "providers", "api", "utils", "lib"],
      native: ["android", "ios", "native", "plugins", "platform"],
      config: ["config", "package", "pubspec", "readme", "gitignore", "docker", "test", "tests", "assets", "fonts", "github"]
    }
  },
  library: {
    name: "Library / SDK",
    layers: [
      { id: "entry", name: "Entry Points", accent: "hsl(200 90% 65%)" },
      { id: "core", name: "Core Logic", accent: "hsl(172 76% 55%)" },
      { id: "utils", name: "Utilities", accent: "hsl(160 70% 50%)" },
      { id: "config", name: "Configuration", accent: "hsl(180 20% 50%)" }
    ],
    keywords: {
      entry: ["index", "main", "exports", "api", "client", "sdk"],
      core: ["core", "lib", "engine", "internal", "modules", "src", "pkg"],
      utils: ["utils", "helpers", "types", "interfaces", "constants"],
      config: ["config", "package", "readme", "gitignore", "test", "tests", "github", "docs", "scripts", "build"]
    }
  },
  docs: {
    name: "Documentation Site",
    layers: [
      { id: "content", name: "Content", accent: "hsl(200 90% 65%)" },
      { id: "theme", name: "Theme / UI", accent: "hsl(172 76% 55%)" },
      { id: "config", name: "Configuration", accent: "hsl(180 20% 50%)" }
    ],
    keywords: {
      content: ["docs", "pages", "content", "posts", "articles", "blog", "readme"],
      theme: ["theme", "components", "styles", "layouts", "assets", "static", "public"],
      config: ["config", "plugins", "scripts", "build", "package", "gitignore", "github"]
    }
  }
};

// --- HELPER FUNCTIONS ---
function formatModuleName(rawName: string): string {
  if (rawName.length <= 2) return rawName.toUpperCase();
  const map: Record<string, string> = {
    ui: "UI Components",
    api: "API Routes",
    db: "Database",
    auth: "Authentication",
    utils: "Utilities",
    lib: "Core Lib",
    app: "App Router",
    src: "Source Files",
    cmd: "Commands",
    pkg: "Packages",
    docs: "Documentation",
    ml: "Machine Learning",
    config: "Config",
    readme: "Readme",
    package: "Package",
    gitignore: "Git Ignore",
  };
  if (map[rawName.toLowerCase()]) return map[rawName.toLowerCase()];
  return rawName.charAt(0).toUpperCase() + rawName.slice(1).replace(/[-_]/g, ' ');
}

function getIconForModule(name: string) {
  const n = name.toLowerCase();
  if (n.includes("db") || n.includes("data") || n.includes("model")) return <Database className="h-3.5 w-3.5" />;
  if (n.includes("cmd") || n.includes("cli") || n.includes("script")) return <Terminal className="h-3.5 w-3.5" />;
  if (n.includes("config") || n.includes("setting")) return <Settings className="h-3.5 w-3.5" />;
  if (n.includes("pkg") || n.includes("package") || n.includes("mod")) return <Box className="h-3.5 w-3.5" />;
  if (n.includes("doc") || n.includes("readme")) return <Book className="h-3.5 w-3.5" />;
  if (n.includes("ui") || n.includes("page") || n.includes("component") || n.includes("view")) return <Layers className="h-3.5 w-3.5" />;
  if (n.includes("api") || n.includes("route")) return <Search className="h-3.5 w-3.5" />;
  return <Folder className="h-3.5 w-3.5" />;
}

function detectProjectType(files: any[]) {
  let hasClient = false;
  let hasBackend = false;
  let hasML = false;
  let hasCLI = false;
  let hasMobile = false;
  let hasDocs = false;
  let hasSecurity = false;

  let docFileCount = 0;
  let coreBackendCount = 0;

  files.forEach(f => {
    const p = f.path.toLowerCase();

    // Strict Client signals (ignore docs folders)
    if (
      p.includes("src/components") ||
      p.includes("src/pages") ||
      (p.includes("app/") && !p.includes("docs/")) ||
      (p.includes("pages/") && !p.includes("docs/")) ||
      (p.includes("package.json") && !p.includes("docs/")) ||
      (p.endsWith(".html") && !p.includes("docs/")) ||
      (p.endsWith(".css") && !p.includes("docs/"))
    ) hasClient = true;

    // Backend signals
    if (
      p.includes("api/") ||
      p.includes("controllers/") ||
      p.includes("routes/") ||
      p.includes("models/") ||
      p.includes("requirements.txt") ||
      p.includes("go.mod") ||
      p.includes("pom.xml") ||
      p.includes("prisma/") ||
      p.includes("cmd/") ||
      p.includes("internal/") ||
      p.includes("pkg/") ||
      p.endsWith(".go")
    ) {
      hasBackend = true;
      if (!p.includes("docs/")) coreBackendCount++;
    }

    // ML signals
    if (p.includes(".ipynb") || p.includes("notebooks/") || (p.includes("ml/") && !p.includes("html")) || (p.includes("model/") && !p.includes("models/"))) hasML = true;

    // CLI signals
    if (p.includes("cmd/") || p.includes("pkg/") || p.includes("internal/") || p.includes("cli/")) hasCLI = true;

    // Mobile signals
    if (p.includes("android/") || p.includes("ios/") || p.includes("lib/main.dart")) hasMobile = true;

    // Security signals
    if (p.includes("analyzer/") || p.includes("scanners/") || p.includes("detectors/") || p.includes("rules/")) hasSecurity = true;

    // Docs signals
    if (p.endsWith(".md") || p.endsWith(".mdx") || p.includes("docs/")) docFileCount++;
  });

  if (docFileCount > files.length * 0.6) hasDocs = true;

  // Strict Evaluation
  if (hasClient && hasBackend && coreBackendCount > 3 && docFileCount < files.length * 0.5) return "fullstack";
  if (hasCLI && !hasClient) return "cli"; // CLI often overlaps backend, prioritize if no client
  if (hasBackend && !hasClient) return "backend";
  if (hasClient && !hasBackend) return "frontend";
  if (hasML) return "ml";
  if (hasMobile) return "mobile";
  if (hasSecurity) return "security";
  if (hasDocs && !hasBackend && !hasClient) return "docs";
  if (hasBackend) return "backend";
  if (hasClient) return "frontend";

  return "library"; // Default fallback
}

export function ArchitectureView({
  files = [],
  onModuleClick
}: {
  files?: any[],
  onModuleClick?: (moduleName: string, moduleFiles: any[]) => void
}) {

  const layers = useMemo(() => {
    if (!files || files.length === 0) return null;

    const projectType = detectProjectType(files);
    const profile = PROFILES[projectType as keyof typeof PROFILES];

    // Initialize layer data maps
    const layerData: Record<string, Map<string, any[]>> = {};
    profile.layers.forEach(l => {
      layerData[l.id] = new Map();
    });

    // Classify files
    files.forEach(file => {
      // Split path and process from deepest folder/file outwards
      const parts = file.path.split(/[/\\]/).reverse();
      let matchedLayer = null;
      let moduleRawName = null;

      for (const part of parts) {
        // Check exact match after stripping extension
        const p = part.replace(/\.[^/.]+$/, "").toLowerCase();

        if (!matchedLayer) {
          for (const [layerId, keywords] of Object.entries(profile.keywords)) {
            // substring match is much more resilient
            const matchedKeyword = keywords.find(k => p.includes(k));
            if (matchedKeyword) {
              matchedLayer = layerId;
              moduleRawName = matchedKeyword;
              break;
            }
          }
        }
        if (matchedLayer) break;
      }

      // If no match found, group it under the first layer generically, or 'Other'
      if (!matchedLayer) {
        matchedLayer = profile.layers[0].id; // Default to top layer
        moduleRawName = "other";
      }

      if (matchedLayer && moduleRawName) {
        if (!layerData[matchedLayer].has(moduleRawName)) {
          layerData[matchedLayer].set(moduleRawName, []);
        }
        layerData[matchedLayer].get(moduleRawName)!.push(file);
      }
    });

    // Build array structure
    const builtLayers = profile.layers.map(config => {
      const map = layerData[config.id];
      const modules = Array.from(map.entries()).map(([rawName, moduleFiles]) => ({
        name: formatModuleName(rawName),
        count: moduleFiles.length,
        files: moduleFiles,
        rawName
      })).sort((a, b) => b.count - a.count); // sort by largest modules

      return {
        ...config,
        modules
      };
    }).filter(layer => layer.modules.length > 0);

    return builtLayers.length > 0 ? builtLayers : null;
  }, [files]);

  if (!layers) {
    return (
      <div className="flex h-full min-h-[300px] flex-col items-center justify-center rounded-xl border border-border/40 bg-surface/20 p-8 text-center">
        <div className="mb-3 rounded-full bg-surface-2 p-3 text-muted-foreground shadow-inner">
          <Layers className="h-6 w-6 opacity-60" />
        </div>
        <h3 className="mb-1 text-sm font-medium text-foreground">No Architecture Detected</h3>
        <p className="text-xs text-muted-foreground max-w-[250px] leading-relaxed">
          Unable to intelligently classify the repository files into recognized architectural layers yet. Please scan a repository.
        </p>
      </div>
    );
  }

  // Flatten all modules for the bottom summary bar
  const allModules = layers.flatMap(l => l.modules).sort((a, b) => b.count - a.count);

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex flex-col pb-20">
        {layers.map((layer, i) => (
          <React.Fragment key={layer.name}>
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-xl border border-border/60 bg-surface/40 p-4"
            style={{ boxShadow: `inset 0 0 0 1px ${layer.accent}1a` }}
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: layer.accent, boxShadow: `0 0 10px ${layer.accent}` }}
                />
                <span className="text-[11px] font-bold uppercase tracking-widest text-foreground/90">
                  {layer.name}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">layer.{i}</span>
            </div>

            <div className="flex flex-nowrap items-stretch gap-3 overflow-x-auto pb-2 scrollbar-thin">
              {layer.modules.map((m, j) => (
                <div key={m.name} className="flex items-center gap-3">
                  {j > 0 && (
                    <div className="flex items-center justify-center   text-primary/30">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#4ff0f6ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="3 3">
                        <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
                      </svg>
                    </div>
                  )}


                  <motion.div
                    onClick={() => onModuleClick?.(m.name, m.files)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 + j * 0.05 + 0.1 }}
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="flex flex-col rounded-xl border border-border/40 bg-background/50 p-3 min-w-[240px] max-w-[280px] shadow-sm hover:border-primary/40 hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(45,212,191,0.05)] transition-all cursor-pointer group"
                  >
                    <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-2 group-hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="rounded bg-primary/10 p-1.5 text-primary group-hover:bg-primary/20 transition-colors">
                          {getIconForModule(m.name)}
                        </div>
                        <span className="text-xs font-semibold text-foreground/90">{m.name}</span>
                      </div>
                      <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground group-hover:text-primary transition-colors">
                        {m.count}
                      </span>
                    </div>


                    <div className="space-y-1.5 flex-grow">
                      {m.files.slice(0, 4).map((f: any, idx: number) => {
                        const fileName = f.path.split(/[/\\]/).pop() || "";
                        const langCode = f.language ? (f.language.length <= 3 ? f.language : f.language.substring(0, 2)).toUpperCase() : "";
                        return (
                          <div key={idx} className="flex flex-col gap-1 text-[11px] text-muted-foreground border-b border-border/20 last:border-0 pb-1.5 mb-1.5 last:mb-0 last:pb-0">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1.5 overflow-hidden">
                                <FileCode className="h-3 w-3 flex-shrink-0 opacity-60" />
                                <span className="truncate font-medium text-foreground/80" title={f.path}>{fileName}</span>
                              </div>
                              {langCode && (
                                <span className="text-[9px] text-primary/70 font-mono tracking-wider flex-shrink-0 ml-2">
                                  {langCode}
                                </span>
                              )}
                            </div>
                            
                            {/* Code snippet / dependencies preview */}
                            {(f.code || f.content) && (
                                <div className="mt-1 bg-background/60 rounded px-1.5 py-1 font-mono text-[9px] text-muted-foreground/80 truncate border border-border/30">
                                    {(f.code || f.content).slice(0, 80)}...
                                </div>
                            )}
                            {(f.dependencies || f.imports) && (f.dependencies || f.imports).length > 0 && (
                                <div className="mt-0.5 text-[9px] text-muted-foreground/70 truncate">
                                    <span className="text-primary/50">deps:</span> {(f.dependencies || f.imports).join(", ")}
                                </div>
                            )}
                          </div>
                        );
                      })}
                      {m.count > 4 && (
                        <div className="mt-2 text-[10px] italic text-muted-foreground/60 px-1 pt-1">
                          +{m.count - 4} more
                        </div>
                      )}
                    </div>

                  </motion.div>
                </div>

              ))}
            </div>
          </motion.div>
          
          {/* Vertical Connector between layers */}
          {i < layers.length - 1 && (
            <div className="flex justify-center py-2">
              <div className="h-8 w-[3px] rounded-full bg-primary/30 shrink-0" />
            </div>
          )}
        </React.Fragment>
        ))}
      </div>

      {/* Bottom Summary Footer */}
      <div className="  bottom-0 left-0    right-0 p-4 border border-border/40 rounded-xl bg-background/80 backdrop-blur-md shadow-lg flex flex-wrap items-center gap-3">
        {allModules.map(m => (
          <div key={m.name} className="flex items-center gap-2 rounded-md border border-border/60 bg-surface/40 px-2.5 py-1.5">
            <div className="text-primary/70 flex-shrink-0">
              {getIconForModule(m.name)}
            </div>
            <span className="text-[11px] text-foreground font-medium">{m.name}</span>
            <span className="rounded bg-surface-2 px-1 text-[10px] font-mono text-muted-foreground">
              {m.count}
            </span>
          </div>
        ))}
      </div>

      {/* Background Flow lines between layers */}
      {/* <svg
        className="pointer-events-none absolute inset-x-6 top-[65px] h-[calc(100%-80px)] w-[calc(100%-48px)] -z-10"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {layers.slice(0, -1).map((_, i) => (
          <motion.line
            key={i}
            x1="50"
            y1={`${(100 / layers.length) * i + (100 / layers.length / 2)}`}
            x2="50"
            y2={`${(100 / layers.length) * (i + 1) + (100 / layers.length / 2)}`}
            stroke="hsl(var(--primary) / 0.15)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
          />
        ))}
      </svg> */}
    </div>
  );
}