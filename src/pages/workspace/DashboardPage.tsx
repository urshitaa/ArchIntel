import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import {
  Github,
  ArrowRight,
  User,
  GitBranch,
  Calendar,
  Clock,
  BookOpen,
  Scale,
  HeartHandshake,
  ShieldAlert,
  Star,
  Eye,
  GitFork,
  Settings,
  Users,
  Sparkles,
  Code2,
  PieChart,
  Network,
  FileText,
  Workflow,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import { fetchApi } from "@/lib/api";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import { AnalysisPipeline } from "@/components/analyze/AnalysisPipeline";

export function DashboardPage() {
  const { owner, repo, analysisResult, setAnalysisResult } = useOutletContext<any>();

  const [repoUrl, setRepoUrl] = useState(() => {
    return analysisResult?.repository ? `https://github.com/${analysisResult.repository.owner}/${analysisResult.repository.name}` : "";
  });

  const [showPipeline, setShowPipeline] = useState(false);
  const [analysisPromise, setAnalysisPromise] = useState<Promise<any> | undefined>(undefined);

  useEffect(() => {
    if (analysisResult?.repository) {
      setRepoUrl(`https://github.com/${analysisResult.repository.owner}/${analysisResult.repository.name}`);
    }
  }, [analysisResult]);

  const handleAnalyze = () => {
    if (!repoUrl.trim()) return;
    setShowPipeline(true);

    const promise = fetchApi("/repositories/analyze", {
      method: "POST",
      body: JSON.stringify({ repo_url: repoUrl }),
    }).then(res => {
      setAnalysisResult(res);

      try {
        const repo = res.repository;
        if (repo) {
          const history = JSON.parse(localStorage.getItem('archintel_history') || '[]');
          const entry = {
            owner: repo.owner || 'Unknown',
            name: repo.name || 'Unknown',
            description: repo.description || '',
            timestamp: new Date().toISOString(),
          };
          const filtered = history.filter((h: any) => !(h.owner === entry.owner && h.name === entry.name));
          const newHistory = [entry, ...filtered].slice(0, 50);
          localStorage.setItem('archintel_history', JSON.stringify(newHistory));
        }
      } catch (e) {
        console.error("Failed to save history", e);
      }

      toast.success("Repository analyzed successfully");
      return res;
    }).catch(err => {
      toast.error(err.message || "Failed to analyze repository");
      setShowPipeline(false);
      throw err;
    });

    setAnalysisPromise(promise);
  };

  return (
    <div id="dashboard-content" className="mx-auto max-w-6xl pt-8 pb-12">
      <AnimatePresence>
        {showPipeline && (
          <AnalysisPipeline
            repoFull={repoUrl}
            analysisPromise={analysisPromise}
            onDone={() => setShowPipeline(false)}
          />
        )}
      </AnimatePresence>


      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-12 w-full">

        {/* Top Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-10">
          {/* Left Content */}
          <div className="flex-1 max-w-2xl">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              Let's get started
            </span>

            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl text-white mb-4">
              Welcome, let's explore<br />
              your <span className="text-[#2dd4bf]">first repository</span>
            </h1>

            <p className="text-sm md:text-base text-slate-400 leading-relaxed max-w-lg mb-8">
              Paste any public GitHub repository link and get instant AI summaries, architecture diagrams, dependency maps, and developer insights.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-8 w-full max-w-xl">
              <div className="flex-1 flex items-center gap-3 rounded-xl border border-white/10 bg-[#0f172a] px-4 py-3.5 shadow-sm focus-within:border-[#2dd4bf]/50 transition-colors w-full">
                <Github className="h-5 w-5 text-slate-400 shrink-0" />
                <input
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAnalyze()}
                  className="w-full bg-transparent text-sm text-slate-200 outline-none placeholder:text-slate-500"
                  placeholder="https://github.com/mdn/beginner-html-site-styled"
                />
              </div>
              <button
                onClick={handleAnalyze}
                className="w-full sm:w-auto flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#2dd4bf] px-6 py-3.5 text-sm font-semibold text-slate-900 shadow-[0_0_20px_rgba(45,212,191,0.25)] hover:bg-[#20b2aa] hover:shadow-[0_0_25px_rgba(45,212,191,0.35)] transition-all"
              >
                Analyze Repository <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>Try these examples:</span>
              <button onClick={() => setRepoUrl("https://github.com/facebook/react")} className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1.5 hover:bg-white/10 transition-colors">
                <Github className="h-3.5 w-3.5" /> facebook/react
              </button>
              <button onClick={() => setRepoUrl("https://github.com/vercel/next.js")} className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1.5 hover:bg-white/10 transition-colors">
                <Github className="h-3.5 w-3.5" /> vercel/next.js
              </button>
              <button onClick={() => setRepoUrl("https://github.com/microsoft/vscode")} className="flex items-center gap-1.5 rounded-full bg-white/5 border border-white/5 px-3 py-1.5 hover:bg-white/10 transition-colors">
                <Github className="h-3.5 w-3.5" /> microsoft/vscode
              </button>
            </div>
          </div>

          {/* Right Abstract Graphics */}
          <div className="hidden lg:flex flex-1 relative h-[350px] w-full justify-center items-center">
            {/* Main Abstract Window */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.7, ease: "easeOut" },
                y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute right-10 top-0 w-64 h-48 rounded-xl border border-white/10 bg-[#0f172a]/90 backdrop-blur-md shadow-2xl overflow-hidden rotate-[-5deg]"
            >
              <div className="flex gap-1.5 p-3 border-b border-white/10 bg-white/5">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-500/50" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-500/50" />
              </div>
              <div className="p-4 space-y-3">
                <div className="h-2 w-3/4 rounded bg-slate-700/50" />
                <div className="h-2 w-1/2 rounded bg-slate-700/50" />
                <div className="h-2 w-5/6 rounded bg-[#2dd4bf]/40" />
                <div className="h-2 w-2/3 rounded bg-slate-700/50" />
              </div>
            </motion.div>

            {/* Floating Code Block */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 0.2 },
                scale: { duration: 0.5, delay: 0.2 },
                y: { duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }
              }}
              className="absolute left-10 top-16 w-24 h-24 rounded-2xl border border-indigo-500/30 bg-[#1e1b4b]/80 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]"
            >
              <Code2 className="h-10 w-10 text-indigo-400" />
            </motion.div>

            {/* Floating Pie Chart */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, 10, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 0.4 },
                scale: { duration: 0.5, delay: 0.4 },
                y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }
              }}
              className="absolute right-0 bottom-24 w-32 h-24 rounded-2xl border border-emerald-500/30 bg-[#064e3b]/40 backdrop-blur-md flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(16,185,129,0.15)]"
            >
              <div className="relative w-10 h-10 rounded-full border-4 border-slate-700 border-t-emerald-400 border-r-emerald-400" />
              <div className="space-y-1.5">
                <div className="w-8 h-1.5 rounded bg-emerald-400/50" />
                <div className="w-6 h-1.5 rounded bg-emerald-400/30" />
              </div>
            </motion.div>

            {/* Floating Network Diagram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, y: [0, -15, 0] }}
              transition={{
                opacity: { duration: 0.6, delay: 0.6 },
                scale: { duration: 0.6, delay: 0.6 },
                y: { duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.6 }
              }}
              className="absolute left-32 bottom-10 w-28 h-28 rounded-2xl border border-cyan-500/30 bg-[#083344]/60 backdrop-blur-md flex flex-col items-center justify-center p-3 shadow-[0_0_30px_rgba(6,182,212,0.2)]"
            >
              <Network className="h-12 w-12 text-cyan-400 stroke-[1.5]" />
            </motion.div>
          </div>
        </div>

        {/* Explore Insights Section */}
        {/* <div className="mt-8">
            <h2 className="text-xl font-bold text-white mb-6">Explore powerful insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="group rounded-2xl border border-white/5 bg-[#0b1121] p-6 hover:bg-white/[0.02] transition-colors relative overflow-hidden flex flex-col min-h-[220px]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
                  <FileText className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">AI Summary</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Get a high-level overview of your repository in seconds.
                </p>
                <div className="mt-auto self-end flex h-8 w-8 items-center justify-center rounded-full bg-white/5 group-hover:bg-white/10 transition-colors cursor-pointer">
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-white" />
                </div>
              </div>

              <div className="group rounded-2xl border border-white/5 bg-[#0b1121] p-6 hover:bg-white/[0.02] transition-colors relative overflow-hidden flex flex-col min-h-[220px]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
                  <Network className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Architecture Diagram</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Visualize the structure and components of your codebase.
                </p>
                <div className="mt-auto self-end flex h-8 w-8 items-center justify-center rounded-full bg-white/5 group-hover:bg-white/10 transition-colors cursor-pointer">
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-white" />
                </div>
              </div>

              <div className="group rounded-2xl border border-white/5 bg-[#0b1121] p-6 hover:bg-white/[0.02] transition-colors relative overflow-hidden flex flex-col min-h-[220px]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
                  <Workflow className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Dependency Graph</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Understand dependencies and how modules connect.
                </p>
                <div className="mt-auto self-end flex h-8 w-8 items-center justify-center rounded-full bg-white/5 group-hover:bg-white/10 transition-colors cursor-pointer">
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-white" />
                </div>
              </div>

              <div className="group rounded-2xl border border-white/5 bg-[#0b1121] p-6 hover:bg-white/[0.02] transition-colors relative overflow-hidden flex flex-col min-h-[220px]">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10">
                  <Users className="h-6 w-6 text-orange-400" />
                </div>
                <h3 className="text-base font-semibold text-white mb-2">Contributors Insights</h3>
                <p className="text-sm text-slate-400 leading-relaxed mb-6">
                  Explore contributor activity and codebase impact.
                </p>
                <div className="mt-auto self-end flex h-8 w-8 items-center justify-center rounded-full bg-white/5 group-hover:bg-white/10 transition-colors cursor-pointer">
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-white" />
                </div>
              </div>

            </div>
          </div> */}

        {/* Footer Security Banner */}
        <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-[#0b1121] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500/10">
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">Your data is secure</h4>
              <p className="text-xs text-slate-400">We only analyze public repositories. No code is stored.</p>
            </div>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
            Learn more <ChevronRight className="h-4 w-4" />
          </button>
        </div>

      </motion.div>


      {analysisResult && !showPipeline && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <OverviewPanel result={analysisResult} />
            <LanguagesPanel result={analysisResult} />
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6">
            <AboutPanel result={analysisResult} />
            <ContributorsPanel result={analysisResult} />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function OverviewPanel({ result }: { result: any }) {
  const repo = result.repository || {};
  const stats = result.stats || {};
  return (
    <div className="rounded-xl border border-white/5 bg-[#0b1121]/50 p-6">
      <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
      <div className="rounded-xl border border-white/5 bg-[#0f172a] p-5 mb-4">
        <h3 className="text-sm font-semibold text-white mb-2">About this repository</h3>
        <p className="text-sm text-slate-400 mb-4">{repo.description || "No description provided."}</p>
        <a href={`https://github.com/${repo.owner}/${repo.name}`} target="_blank" rel="noreferrer" className="text-[#2dd4bf] text-sm font-medium flex items-center gap-1 hover:underline">
          View on GitHub <ArrowRight className="h-4 w-4" />
        </a>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="rounded-xl border border-white/5 bg-[#0f172a] p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><User className="h-4 w-4" /> Owner</div>
          <div className="text-sm text-white">{repo.owner || "Unknown"}</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#0f172a] p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><GitBranch className="h-4 w-4" /> Default Branch</div>
          <div className="text-sm text-white">{repo.default_branch || "main"}</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#0f172a] p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><Calendar className="h-4 w-4" /> Created At</div>
          <div className="text-sm text-white">{repo.created_at ? new Date(repo.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-[#0f172a] p-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs mb-1"><Clock className="h-4 w-4" /> Last Updated</div>
          <div className="text-sm text-white">{repo.updated_at ? new Date(repo.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : "N/A"}</div>
        </div>
      </div>
      <div className="rounded-xl border border-white/5 bg-[#0f172a] p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Stats</h3>
        <div className="grid grid-cols-4 gap-3">
          <StatBox value={stats.files || 0} label="Files" />
          <StatBox value={stats.loc || 0} label="Lines of Code" />
          <StatBox value={stats.contributors || 0} label="Contributors" />
          <StatBox value={stats.branches || 0} label="Branches" />
        </div>
      </div>
    </div>
  );
}

function StatBox({ value, label }: { value: number, label: string }) {
  return (
    <div className="rounded-lg border border-white/5 bg-[#141e33] p-3 text-center flex flex-col items-center justify-center">
      <div className="text-white font-bold text-lg">{value.toLocaleString()}</div>
      <div className="text-[10px] text-slate-400 mt-1">{label}</div>
    </div>
  );
}

function LanguagesPanel({ result }: { result: any }) {
  const colors = ["#2dd4bf", "#6366f1", "#fb923c", "#f43f5e", "#eab308", "#a855f7"];
  const langs = result.languages && Object.keys(result.languages).length > 0 ? result.languages : { HTML: 1092, CSS: 495 };
  const languagesArray = Object.entries(langs).map(([name, bytes], i) => ({
    name, bytes: bytes as number, color: colors[i % colors.length]
  })).sort((a, b) => b.bytes - a.bytes);

  const totalBytes = languagesArray.reduce((acc, l) => acc + l.bytes, 0);

  return (
    <div className="rounded-xl border border-white/5 bg-[#0b1121]/50 p-6">
      <h2 className="text-xl font-semibold text-white mb-6">Languages</h2>

      {totalBytes > 0 ? (
        <>
          <div className="flex items-center gap-8 mb-8">
            <DonutChart languages={languagesArray} totalBytes={totalBytes} />
            <div className="flex flex-col gap-3">
              {languagesArray.slice(0, 4).map(l => (
                <div key={l.name}>
                  <div className="flex items-center gap-2 text-sm text-white font-medium">
                    <span className="w-3 h-3 rounded-[3px]" style={{ backgroundColor: l.color }} /> {l.name}
                  </div>
                  <div className="text-xs text-slate-400 ml-5">
                    {(l.bytes / totalBytes * 100).toFixed(1)}% ({l.bytes.toLocaleString()})
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/5 bg-[#0f172a] p-5">
            <h3 className="text-sm font-semibold text-white mb-5">Language Details</h3>
            {languagesArray.map(l => (
              <div key={l.name} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm text-white mb-2">
                  <span>{l.name}</span>
                  <div className="flex gap-4">
                    <span>{l.bytes.toLocaleString()}</span>
                    <span className="w-12 text-right">{(l.bytes / totalBytes * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${l.bytes / totalBytes * 100}%`, backgroundColor: l.color }} />
                </div>
              </div>
            ))}
            <div className="mt-5 pt-4 border-t border-white/5 flex justify-between text-sm text-white font-semibold">
              <span>Total</span>
              <div className="flex gap-4">
                <span>{totalBytes.toLocaleString()}</span>
                <span className="w-12 text-right">100%</span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-sm text-slate-400">No language data available.</div>
      )}
    </div>
  );
}

function DonutChart({ languages, totalBytes }: { languages: any[], totalBytes: number }) {
  let currentOffset = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-28 w-28">
      <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90 transform">
        {languages.map((lang) => {
          const percentage = lang.bytes / totalBytes;
          const strokeLength = percentage * circumference;
          const strokeDasharray = `${strokeLength} ${circumference}`;
          const strokeDashoffset = -currentOffset;
          currentOffset += strokeLength;

          return (
            <circle
              key={lang.name}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={lang.color}
              strokeWidth="16"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
          );
        })}
      </svg>
    </div>
  );
}

function AboutPanel({ result }: { result: any }) {
  const repo = result.repository || {};
  const files = result.files || [];

  const hasFile = (name: string) => files.some((f: any) => f.path?.toLowerCase().includes(name));

  const hasReadme = hasFile('readme');
  const hasCodeOfConduct = hasFile('code_of_conduct');
  const hasContributing = hasFile('contributing');
  const hasSecurity = hasFile('security');

  return (
    <div className="rounded-xl border border-white/5 bg-[#0b1121]/50 p-6">
      <h2 className="text-lg font-semibold text-white mb-4">About</h2>

      <div className="space-y-4 mb-6">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <BookOpen className="h-4 w-4 text-slate-500" />
          <span>{hasReadme ? "Readme" : "No Readme"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Scale className="h-4 w-4 text-slate-500" />
          <span>{repo.license || "No license specified"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <HeartHandshake className="h-4 w-4 text-slate-500" />
          <span>{hasCodeOfConduct ? "Code of conduct" : "No Code of conduct"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Users className="h-4 w-4 text-slate-500" />
          <span>{hasContributing ? "Contributing" : "No Contributing"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <ShieldAlert className="h-4 w-4 text-slate-500" />
          <span>{hasSecurity ? "Security policy" : "No Security policy"}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <Settings className="h-4 w-4 text-slate-500" />
          <span>Custom properties</span>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
          <Star className="h-4 w-4 text-slate-500" />
          <span><strong className="text-white">{(repo.stars || 0).toLocaleString()}</strong> stars</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
          <Eye className="h-4 w-4 text-slate-500" />
          <span><strong className="text-white">{(repo.watchers || 0).toLocaleString()}</strong> watching</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300 font-medium">
          <GitFork className="h-4 w-4 text-slate-500" />
          <span><strong className="text-white">{(repo.forks || 0).toLocaleString()}</strong> forks</span>
        </div>
      </div>
    </div>
  );
}

function ContributorsPanel({ result }: { result: any }) {
  const defaultContributors = [
    { login: "chrisdavidmills", contributions: 5, avatar_url: "" },
    { login: "caugner", contributions: 2, avatar_url: "" },
    { login: "argl", contributions: 1, avatar_url: "" },
    { login: "dpanov", contributions: 1, avatar_url: "" },
    { login: "dipikabh", contributions: 1, avatar_url: "" },
    { login: "MrBrain295", contributions: 1, avatar_url: "" },
    { login: "wbamberg", contributions: 1, avatar_url: "" },
  ];

  const contributors = result.contributors && result.contributors.length > 0 ? result.contributors : defaultContributors;
  const totalContributions = contributors.reduce((acc: number, c: any) => acc + c.contributions, 0);

  return (
    <div className="rounded-xl border border-white/5 bg-[#0b1121]/50 p-6 h-full">
      <h2 className="text-xl font-semibold text-white mb-4">Contributors</h2>
      <div className="rounded-xl border border-white/5 bg-[#0f172a] p-2">
        {contributors.map((c: any) => {
          const pct = totalContributions > 0 ? (c.contributions / totalContributions * 100) : 0;
          return (
            <div key={c.login} className="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg transition-colors">
              <img src={c.avatar_url || `https://github.com/${c.login}.png`} alt={c.login} className="w-10 h-10 rounded-full bg-slate-800 object-cover" />
              <div className="flex-1 min-w-0">
                <div className="text-sm text-white font-medium truncate">{c.login}</div>
                <div className="text-xs text-slate-400">{c.contributions} contribution{c.contributions !== 1 ? 's' : ''}</div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[#2dd4bf] rounded-full"
                  />
                </div>
                <div className="text-xs text-white w-8 text-right font-medium">{Math.round(pct)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

