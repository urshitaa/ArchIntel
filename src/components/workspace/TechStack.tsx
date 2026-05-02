import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Layers,
  Settings,
  Database,
  Terminal,
  Box,
  Cpu,
  Wind,
  Zap,
  Code,
  LayoutTemplate,
  Shield,
  Cloud,
  ChevronRight,
  Info,
  Flame,
  Server
} from "lucide-react";

// Local dictionary to map popular technologies to nice UI metadata
const TECH_DICTIONARY: Record<string, any> = {
  "react": { name: "React", category: "UI Library", desc: "A JavaScript library for building user interfaces.", icon: Layers, color: "text-[#61DAFB]", tab: "Frontend" },
  "react-dom": { name: "React DOM", category: "UI Library", desc: "Serves as the entry point to the DOM and server renderers for React.", icon: Layers, color: "text-[#61DAFB]", tab: "Frontend" },
  "typescript": { name: "TypeScript", category: "Language", desc: "Typed superset of JavaScript that compiles to plain JS.", icon: Code, color: "text-[#3178C6]", tab: "Frontend" },
  "javascript": { name: "JavaScript", category: "Language", desc: "High-level, often just-in-time compiled language.", icon: Code, color: "text-[#F7DF1E]", tab: "Frontend" },
  "tailwindcss": { name: "Tailwind CSS", category: "CSS Framework", desc: "Utility-first CSS framework for rapid UI development.", icon: Wind, color: "text-[#38B2AC]", tab: "Frontend" },
  "vite": { name: "Vite", category: "Build Tool", desc: "Next generation frontend tooling for fast development.", icon: Zap, color: "text-[#646CFF]", tab: "Tools & Libraries" },
  "framer-motion": { name: "Framer Motion", category: "Animation Library", desc: "Production-ready motion library for React.", icon: LayoutTemplate, color: "text-[#E902B5]", tab: "Frontend" },
  "next": { name: "Next.js", category: "React Framework", desc: "The React Framework for the Web.", icon: Layers, color: "text-white", tab: "Frontend" },
  "lucide-react": { name: "Lucide", category: "Icons", desc: "Beautiful & consistent icon toolkit.", icon: Box, color: "text-[#F472B6]", tab: "Tools & Libraries" },
  "fastapi": { name: "FastAPI", category: "Backend Framework", desc: "Modern, fast web framework for building APIs with Python.", icon: Zap, color: "text-[#009688]", tab: "Backend" },
  "uvicorn": { name: "Uvicorn", category: "Server", desc: "Lightning-fast ASGI server implementation.", icon: Server, color: "text-[#3776AB]", tab: "Backend" },
  "pydantic": { name: "Pydantic", category: "Library", desc: "Data validation using Python type hints.", icon: Code, color: "text-[#E92063]", tab: "Backend" },
  "python": { name: "Python", category: "Language", desc: "Programming language that lets you work quickly and integrate systems.", icon: Terminal, color: "text-[#3776AB]", tab: "Backend" },
  "go": { name: "Go", category: "Language", desc: "Build simple, secure, scalable systems with Go.", icon: Terminal, color: "text-[#00ADD8]", tab: "Backend" },
  "postgres": { name: "PostgreSQL", category: "Database", desc: "The World's Most Advanced Open Source Relational Database.", icon: Database, color: "text-[#336791]", tab: "Database" },
  "mysql": { name: "MySQL", category: "Database", desc: "The world's most popular open source database.", icon: Database, color: "text-[#4479A1]", tab: "Database" },
  "supabase": { name: "Supabase", category: "Database", desc: "The open source Firebase alternative.", icon: Database, color: "text-[#3ECF8E]", tab: "Database" },
  "sqlalchemy": { name: "SQLAlchemy", category: "ORM", desc: "The Python SQL Toolkit and Object Relational Mapper.", icon: Database, color: "text-[#D71F00]", tab: "Database" },
  "alembic": { name: "Alembic", category: "ORM", desc: "A database migrations tool for SQLAlchemy.", icon: Database, color: "text-[#3776AB]", tab: "Database" },
  "prisma": { name: "Prisma", category: "ORM", desc: "Next-generation Node.js and TypeScript ORM.", icon: Database, color: "text-white", tab: "Database" },
  "radix-ui": { name: "Radix UI", category: "UI Components", desc: "Unstyled, accessible components for building design systems.", icon: Layers, color: "text-[#161618]", tab: "Frontend" },
  "eslint": { name: "ESLint", category: "Linter", desc: "Find and fix problems in your JavaScript code.", icon: Shield, color: "text-[#4B32C3]", tab: "DevOps & Config" },
  "docker": { name: "Docker", category: "DevOps", desc: "Empowering App Development for Developers.", icon: Cloud, color: "text-[#2496ED]", tab: "DevOps & Config" },
};

function getTechInfo(key: string) {
  const normalizedKey = key.toLowerCase();

  if (TECH_DICTIONARY[normalizedKey]) {
    return { ...TECH_DICTIONARY[normalizedKey], originalId: normalizedKey };
  }

  // Try partial match but prefer longer matches first (e.g. react-dom over react)
  const partialKey = Object.keys(TECH_DICTIONARY)
    .sort((a, b) => b.length - a.length)
    .find(k => normalizedKey.includes(k));

  if (partialKey) {
    return {
      ...TECH_DICTIONARY[partialKey],
      name: key, // Keep the actual package name (e.g. @types/react)
      originalId: partialKey // So we can look up its icon
    };
  }

  return {
    name: key,
    category: "Library",
    desc: "Dependency utilized within the repository.",
    icon: Box,
    color: "text-primary",
    tab: "Tools & Libraries",
    originalId: null
  };
}

function getDeviconUrl(key: string) {
  if (!key) return null;
  const map: Record<string, string> = {
    "react-dom": "react",
    "tailwindcss": "tailwindcss",
    "tailwind": "tailwindcss",
    "framer-motion": "framer",
    "next": "nextjs",
    "postgres": "postgresql",
    "mysql": "mysql",
    "supabase": "supabase",
    "sqlalchemy": "sqlalchemy",
    "pydantic": "python",
    "uvicorn": "python",
    "lucide-react": "",
    "radix-ui": "",
    "fastapi": "fastapi",
    "python": "python",
    "typescript": "typescript",
    "javascript": "javascript",
    "html": "html5",
    "css": "css3",
    "docker": "docker",
    "eslint": "eslint",
    "vite": "vite",
    "prisma": "prisma",
    "go": "go"
  };
  const mapped = map[key.toLowerCase()] !== undefined ? map[key.toLowerCase()] : key.toLowerCase();
  if (!mapped) return null;
  return `https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/${mapped}/${mapped}-original.svg`;
}

const TechIcon = ({ techId, fallbackIcon: Fallback, className, originalId }: { techId: string, fallbackIcon: any, className?: string, originalId?: string }) => {
  const [error, setError] = useState(false);
  // Try to use the originalId (from dict) for icon lookup, otherwise techId
  const url = getDeviconUrl(originalId || techId);

  if (!url || error) {
    return <Fallback className={className} />;
  }

  return (
    <img
      src={url}
      alt={techId}
      className={className}
      onError={() => setError(true)}
    />
  );
};


export function TechStack({ result }: { result?: any }) {
  const [activeTab, setActiveTab] = useState("All Technologies");

  const techData = useMemo(() => {
    const allTechs: any[] = [];

    // Process Dependencies
    const rawDependencies = result?.dependencies || {};
    Object.entries(rawDependencies).forEach(([pkg, version]) => {
      const info = getTechInfo(pkg);
      allTechs.push({
        id: pkg,
        name: info.name,
        category: info.category,
        desc: info.desc,
        version: String(version).replace(/[\^~]/g, ''),
        icon: info.icon,
        color: info.color,
        tab: info.tab,
        originalId: info.originalId,
        source: 'dependency',
        type: pkg.includes('@types') || pkg.includes('eslint') || pkg.includes('prettier') || pkg.includes('vite') || pkg.includes('tailwind') ? 'dev' : 'production'
      });
    });

    // Process Frameworks detected by backend
    const rawFrameworks = result?.frameworks || [];
    rawFrameworks.forEach((fw: string) => {
      if (!allTechs.find(t => t.id.toLowerCase() === fw.toLowerCase())) {
        const info = getTechInfo(fw);
        allTechs.push({
          id: fw,
          name: info.name,
          category: info.category,
          desc: info.desc,
          version: "latest",
          icon: info.icon,
          color: info.color,
          tab: info.tab,
          originalId: info.originalId,
          source: 'framework',
          type: 'production'
        });
      }
    });

    const categories = new Set(allTechs.map(t => t.category));

    // Languages stats
    const rawLanguages = result?.languages || {};
    const totalBytes = Object.values(rawLanguages).reduce((a: any, b: any) => a + b, 0) as number;
    const languages = Object.entries(rawLanguages)
      .map(([lang, bytes]) => {
        const info = getTechInfo(lang);
        return {
          id: lang,
          name: lang,
          percentage: totalBytes > 0 ? Math.round(((bytes as number) / totalBytes) * 100) : 0,
          bytes,
          color: info.color,
          icon: info.icon,
          tab: info.tab,
          originalId: info.originalId
        };
      })
      .sort((a, b) => b.percentage - a.percentage);

    // Process Languages as technologies in the grid
    languages.forEach((lang) => {
      if (!allTechs.find(t => t.id.toLowerCase() === lang.id.toLowerCase())) {
        allTechs.push({
          id: lang.id,
          name: lang.name,
          category: "Language",
          desc: "Primary programming language detected in repository.",
          version: "-",
          icon: lang.icon,
          color: lang.color,
          tab: lang.tab || "Backend",
          originalId: lang.originalId,
          source: 'language',
          type: 'production'
        });
      }
    });

    return {
      allTechs,
      categoriesCount: categories.size,
      depsCount: Object.keys(rawDependencies).length,
      techCount: allTechs.length,
      languages
    };
  }, [result]);

  const totalLoc = result?.stats?.loc || 0;

  // Filter based on Tabs
  const filteredTechs = techData.allTechs.filter(tech => {
    if (activeTab === "All Technologies") return true;
    return tech.tab === activeTab;
  });

  const popularTechs = [
    ...techData.languages.slice(0, 2).map(l => ({ id: l.id, name: l.name, percentage: l.percentage, color: l.color, icon: l.icon, originalId: l.originalId })),
    ...techData.allTechs.filter(t => t.source !== 'dependency').slice(0, 3).map((t, i) => ({ id: t.id, name: t.name, percentage: Math.max(10, 80 - i * 15), color: t.color, icon: t.icon, originalId: t.originalId }))
  ].slice(0, 5).sort((a, b) => b.percentage - a.percentage);

  const TABS = [
    { id: "Frontend", icon: Code },
    { id: "Backend", icon: Cloud },
    { id: "Database", icon: Database },
    { id: "Tools & Libraries", icon: Box },
    { id: "DevOps & Config", icon: Settings },
    { id: "All Technologies", icon: Layers },
  ];

  return (
    <div className="flex flex-col gap-6 w-full max-w-[1400px] mx-auto pb-10 pt-4">

      {/* TOP HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-border/40 bg-surface/20 p-5">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wide text-foreground uppercase">Tech Stack</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Technologies and tools used in this repository</p>
          </div>
        </div>

        <div className="flex items-center gap-6 divide-x divide-border/40 overflow-x-auto">
          <div className="flex items-center gap-3 pl-6 shrink-0">
            <Box className="h-5 w-5 text-indigo-400" />
            <div>
              <div className="text-lg font-bold text-foreground">{Math.max(1, techData.categoriesCount)}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Categories</div>
            </div>
          </div>
          <div className="flex items-center gap-3 pl-6 shrink-0">
            <Settings className="h-5 w-5 text-blue-400" />
            <div>
              <div className="text-lg font-bold text-foreground">{techData.techCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Technologies</div>
            </div>
          </div>
          <div className="flex items-center gap-3 pl-6 shrink-0">
            <Layers className="h-5 w-5 text-purple-400" />
            <div>
              <div className="text-lg font-bold text-foreground">{techData.depsCount}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Dependencies</div>
            </div>
          </div>
          <div className="flex items-center gap-3 pl-6 shrink-0">
            <div className="h-5 w-5 flex items-center justify-center">
              <div className="flex items-end gap-0.5 h-3">
                <div className="w-1 h-1.5 bg-emerald-500/40 rounded-t-sm" />
                <div className="w-1 h-2 bg-emerald-500/70 rounded-t-sm" />
                <div className="w-1 h-3 bg-emerald-500 rounded-t-sm" />
              </div>
            </div>
            <div>
              <div className="text-lg font-bold text-foreground">High</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Stack Maturity</div>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg border text-[11px] font-medium transition-colors whitespace-nowrap ${isActive
                  ? "bg-surface-2 border-primary/30 text-primary"
                  : "bg-surface/20 border-border/40 text-muted-foreground hover:bg-surface hover:text-foreground"
                }`}
            >
              <tab.icon className={`h-3.5 w-3.5 ${isActive ? "text-primary" : ""}`} />
              {tab.id}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">

        {/* LEFT COLUMN */}
        <div className="xl:col-span-3 space-y-6">

          {/* OVERVIEW PANEL */}
          <div className="rounded-xl border border-border/40 bg-surface/20 p-5">
            <div className="flex items-center gap-2 mb-4">
              <Settings className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] font-bold tracking-widest text-foreground uppercase">Overview</h3>
              <Info className="h-3 w-3 text-muted-foreground ml-auto" />
            </div>
            <p className="text-[11px] text-muted-foreground mb-6 leading-relaxed">
              Technologies used to build the user interface and client-side experience.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Settings className="h-3.5 w-3.5" /> Technologies
                </div>
                <span className="font-semibold text-foreground">{techData.techCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="h-3.5 w-3.5" /> Dependencies
                </div>
                <span className="font-semibold text-foreground">{techData.depsCount}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Terminal className="h-3.5 w-3.5" /> Lines of Code
                </div>
                <span className="font-semibold text-foreground">{totalLoc.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Cpu className="h-3.5 w-3.5" /> Percentage
                </div>
                <span className="font-semibold text-foreground">64%</span>
              </div>
            </div>
          </div>

          {/* POPULAR TECHNOLOGIES PANEL */}
          <div className="rounded-xl border border-border/40 bg-surface/20 p-5">
            <div className="flex items-center gap-2 mb-6">
              <Flame className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] font-bold tracking-widest text-foreground uppercase">Popular Technologies</h3>
            </div>

            <div className="space-y-5">
              {popularTechs.map((tech, idx) => {
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 text-foreground font-medium">
                        <TechIcon techId={tech.id} fallbackIcon={tech.icon} originalId={tech.originalId} className="h-3.5 w-3.5 opacity-90" />
                        {tech.name}
                      </div>
                      <span className="font-mono text-muted-foreground">{tech.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-surface-2 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${tech.percentage}%` }}
                        transition={{ duration: 1, delay: idx * 0.1 }}
                        className={`h-full ${tech.color.replace('text-', 'bg-')}`}
                        style={{ backgroundColor: tech.color.includes('[') ? tech.color.match(/\[(.*?)\]/)?.[1] : 'var(--primary)' }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="xl:col-span-9 space-y-6">

          {/* TECHNOLOGIES GRID */}
          <div className="rounded-xl border border-border/40 bg-surface/20 p-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] font-bold tracking-widest text-foreground uppercase">Technologies ({activeTab})</h3>
              </div>
              <button className="text-[10px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                View all ({filteredTechs.length}) <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {filteredTechs.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-10 text-muted-foreground">
                <Box className="h-8 w-8 mb-3 opacity-20" />
                <p className="text-xs">No specific technologies found for this category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AnimatePresence mode="popLayout">
                  {filteredTechs.slice(0, 12).map((tech, idx) => (
                    <motion.div
                      key={tech.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: idx * 0.05 }}
                      className="rounded-xl border border-border/40 bg-background/50 p-4 flex flex-col items-center text-center hover:border-primary/30 hover:bg-surface transition-all group"
                    >
                      <div className={`p-4 rounded-2xl bg-surface mb-3 group-hover:scale-110 transition-transform ${tech.color}`}>
                        <TechIcon techId={tech.id} fallbackIcon={tech.icon} originalId={tech.originalId} className="h-8 w-8" />
                      </div>
                      <h4 className="text-sm font-bold text-foreground mb-1">{tech.name}</h4>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-2">{tech.category}</p>
                      <p className="text-[10px] text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-grow min-h-[40px]">
                        {tech.desc}
                      </p>
                      <div className="w-full py-1.5 rounded bg-surface/80 border border-border/50 text-[10px] font-mono text-muted-foreground group-hover:text-primary group-hover:border-primary/20 transition-colors">
                        v{tech.version}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* TOP DEPENDENCIES TABLE */}
          <div className="rounded-xl border border-border/40 bg-surface/20 p-5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] font-bold tracking-widest text-foreground uppercase">Top Dependencies ({activeTab})</h3>
              </div>
              <button className="text-[10px] font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
                View all dependencies <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            {filteredTechs.filter(t => t.source === 'dependency').length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-muted-foreground">
                <p className="text-xs">No dependencies found for this category.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border/40">
                      <th className="pb-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium w-[30%]">Package</th>
                      <th className="pb-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium w-[20%]">Version</th>
                      <th className="pb-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium w-[30%]">Usage</th>
                      <th className="pb-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium w-[20%]">Type</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/20">
                    <AnimatePresence>
                      {filteredTechs.filter(t => t.source === 'dependency').slice(0, 8).map((dep, idx) => {
                        const usage = Math.max(10, 85 - idx * 12);
                        return (
                          <motion.tr
                            key={`dep-${dep.id}`}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group hover:bg-surface/30 transition-colors"
                          >
                            <td className="py-3">
                              <div className="flex items-center gap-2">
                                <TechIcon techId={dep.id} fallbackIcon={dep.icon} originalId={dep.originalId} className={`h-4 w-4 ${dep.color}`} />
                                <span className="text-xs font-medium text-foreground">{dep.id}</span>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className="text-[11px] font-mono text-muted-foreground">{dep.version}</span>
                            </td>
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-muted-foreground w-6">{usage}%</span>
                                <div className="flex-grow h-1.5 rounded-full bg-surface-2 overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${usage}%` }}
                                    transition={{ duration: 1, delay: idx * 0.1 }}
                                    className="h-full bg-primary"
                                  />
                                </div>
                              </div>
                            </td>
                            <td className="py-3">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full border ${dep.type === 'production' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-surface text-muted-foreground border-border/50'}`}>
                                {dep.type}
                              </span>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}