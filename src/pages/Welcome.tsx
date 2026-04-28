import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Bell,
  Settings,
  LogOut,
  Github,
  ArrowRight,
  Search,
  Star,
  GitFork,
  Eye,
  CheckCircle2,
  Circle,
  FileText,
  Network,
  ShieldCheck,
  Share2,
  Download,
  Code2,
  Cpu,
  Loader2,
  Plus,
  Lock,
  BookOpen,
  Zap,
  Users,
  Activity,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Particles } from "@/components/landing/Particles";
import { CountUp } from "@/components/landing/CountUp";
import { Workspace } from "@/components/workspace/Workspace";
import { parseRepo } from "@/components/workspace/data";

const navLinks = [
  { label: "Dashboard", href: "#dashboard" },
  { label: "Reports", href: "#reports" },
  { label: "Insights", href: "#insights" },
  { label: "Pricing", href: "#pricing" },
];

type AnalyzerState = "idle" | "loading" | "results";

const loadingSteps = [
  { label: "Connecting to GitHub", icon: Github },
  { label: "Reading repository structure", icon: Code2 },
  { label: "Detecting frameworks", icon: Cpu },
  { label: "Building architecture map", icon: Network },
  { label: "Generating insights", icon: Sparkles },
  { label: "Finalizing report", icon: FileText },
];

const features = [
  { icon: Sparkles, title: "AI Code Summaries", desc: "Plain-English breakdowns of any module, function, or file." },
  { icon: Network, title: "Architecture Mapping", desc: "Auto-generated, explorable diagrams of your system." },
  { icon: GitFork, title: "Dependency Graphs", desc: "See internal and external dependencies at a glance." },
  { icon: ShieldCheck, title: "Security Insights", desc: "Spot risky patterns and outdated packages instantly." },
  { icon: Download, title: "Export Reports", desc: "Beautiful PDF and Markdown exports for sharing." },
  { icon: Users, title: "Team Sharing", desc: "Invite teammates and collaborate on reports." },
];

export default function Welcome() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [url, setUrl] = useState("https://github.com/vercel/next.js");
  const [state, setState] = useState<AnalyzerState>("idle");
  const [stepIdx, setStepIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!user) navigate("/signup", { replace: true });
  }, [user, navigate]);

  // analyzer simulation
  useEffect(() => {
    if (state !== "loading") return;
    setStepIdx(0);
    setProgress(0);
    const start = performance.now();
    const total = 4200;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / total);
      setProgress(Math.round(p * 100));
      setStepIdx(Math.min(loadingSteps.length - 1, Math.floor(p * loadingSteps.length)));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setState("results");
        setCompletedTasks((s) => new Set(s).add(0));
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  const repoMeta = useMemo(() => parseRepo(url), [url]);

  const checklist = [
    { label: "Analyze your first repo", done: completedTasks.has(0) },
    { label: "Save a report", done: completedTasks.has(1) },
    { label: "Share a report", done: completedTasks.has(2) },
    { label: "Connect GitHub", done: completedTasks.has(3) },
    { label: "Invite a teammate", done: completedTasks.has(4) },
  ];
  const doneCount = checklist.filter((c) => c.done).length;

  const onAnalyze = () => {
    if (!url.trim()) return;
    setState("loading");
  };

  if (!user) return null;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-50" />
      <Particles count={22} />

      {/* Navbar */}
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5">
          <Link to="/welcome" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 neon-border">
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold tracking-tight">CodeBase Explainer</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <span className="hidden items-center gap-1.5 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground sm:inline-flex">
              <Zap className="h-3 w-3 text-primary" />
              <span><b className="text-foreground">42</b> credits</span>
            </span>
            <IconButton><Bell className="h-4 w-4" /></IconButton>
            <IconButton><Settings className="h-4 w-4" /></IconButton>
            <UserMenu user={user} onSignOut={() => { signOut(); navigate("/"); }} />
          </div>
        </div>
      </motion.header>

      {/* Hero */}
      <section id="dashboard" className="relative">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-12 lg:grid-cols-[1.05fr_1.25fr] lg:py-16">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
            }}
          >
            <Stagger>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1 text-xs text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-primary blink" />
                Welcome aboard, {user.name.split(" ")[0]} 👋
              </span>
            </Stagger>
            <Stagger>
              <h1 className="mt-5 text-4xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
                Welcome, let’s explore your <span className="text-gradient">first repository</span>
              </h1>
            </Stagger>
            <Stagger>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Paste any public GitHub repository link and get instant AI summaries, architecture diagrams, dependency maps, and developer insights.
              </p>
            </Stagger>

            <Stagger>
              <div className="mt-8 glass rounded-2xl p-2 shadow-[var(--shadow-soft)]">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex flex-1 items-center gap-2 rounded-xl bg-surface px-3 py-2.5">
                    <Github className="h-4 w-4 text-muted-foreground" />
                    <input
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && onAnalyze()}
                      placeholder="https://github.com/vercel/next.js"
                      className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
                    />
                  </div>
                  <button
                    onClick={onAnalyze}
                    disabled={state === "loading"}
                    className="group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform hover:scale-[1.02] disabled:opacity-70 glow-cta"
                  >
                    {state === "loading" ? (<><Loader2 className="h-4 w-4 animate-spin" /> Analyzing</>) : (<>Analyze Repository <ArrowRight className="h-4 w-4 nudge" /></>)}
                  </button>
                </div>
              </div>
            </Stagger>

            <Stagger>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <button
                  onClick={() => { setUrl("https://github.com/facebook/react"); setState("results"); }}
                  className="text-muted-foreground hover:text-foreground transition-colors underline-offset-4 hover:underline"
                >
                  View Sample Report →
                </button>
                <span className="text-muted-foreground/60">•</span>
                <span className="text-muted-foreground">Avg. analysis time <b className="text-foreground">12s</b></span>
              </div>
            </Stagger>

            <Stagger>
              <div className="mt-10 grid grid-cols-3 gap-3">
                {[
                  { v: 98, suffix: "%", label: "Accuracy" },
                  { v: 12, suffix: "s", label: "Avg. analyze" },
                  { v: 240, suffix: "k+", label: "Repos parsed" },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-xl px-4 py-3">
                    <div className="text-2xl font-semibold tracking-tight">
                      <CountUp to={s.v} suffix={s.suffix} />
                    </div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </Stagger>
          </motion.div>

          {/* Right: analyzer dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,hsl(var(--primary)/0.18),transparent_70%)] blur-2xl" />
            <AnalyzerPanel state={state} progress={progress} stepIdx={stepIdx} repo={repoMeta} />
          </motion.div>
        </div>
      </section>

      {/* Quick Start */}
      <Section title="Start Fast" subtitle="Three ways to get value in the next 60 seconds.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { icon: Github, title: "Analyze Public Repo", desc: "Paste any GitHub URL and begin.", cta: "Analyze now", onClick: () => { document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" }); } },
            { icon: Lock, title: "Upload Private Repo", desc: "Connect your GitHub account.", cta: "Connect GitHub", onClick: () => setCompletedTasks((s) => new Set(s).add(3)) },
            { icon: BookOpen, title: "Explore Sample Reports", desc: "See what results look like instantly.", cta: "Open samples", onClick: () => { setUrl("https://github.com/facebook/react"); setState("results"); document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" }); } },
          ].map((c, i) => (
            <motion.button
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              onClick={c.onClick}
              className="glass group relative overflow-hidden rounded-2xl p-6 text-left transition-shadow hover:shadow-[var(--shadow-elevated)]"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary neon-border">
                <c.icon className="h-5 w-5" />
              </div>
              <div className="text-base font-semibold">{c.title}</div>
              <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-primary">
                {c.cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </motion.button>
          ))}
        </div>
      </Section>

      {/* Recent activity + checklist */}
      <Section title="Your workspace">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_1fr]" id="reports">
          <RecentActivity hasReport={state === "results"} repo={repoMeta} />
          <Checklist items={checklist} done={doneCount} />
        </div>
      </Section>

      {/* Features */}
      <Section id="insights" title="Everything you need to understand code" subtitle="Powerful tools wrapped in a beautifully simple interface.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              whileHover={{ y: -5 }}
              className="glass group relative overflow-hidden rounded-2xl p-6"
            >
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition-opacity group-hover:opacity-100" />
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary neon-border">
                <f.icon className="h-5 w-5" />
              </div>
              <div className="text-base font-semibold">{f.title}</div>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <footer className="border-t border-border/60 py-8 text-center text-xs text-muted-foreground">
        © 2026 CodeBase Explainer • Built with love for developers
      </footer>
    </div>
  );
}

/* ---------- Sub-components ---------- */

function IconButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface/50 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground">
      {children}
    </button>
  );
}

function UserMenu({ user, onSignOut }: { user: { name: string; email: string; avatarSeed: string }; onSignOut: () => void }) {
  const [open, setOpen] = useState(false);
  const initials = user.name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/30 to-primary/10 text-xs font-semibold text-primary-foreground neon-border"
      >
        <span className="text-foreground">{initials || "U"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="glass absolute right-0 top-11 z-50 w-56 rounded-xl p-2 shadow-[var(--shadow-elevated)]"
            >
              <div className="px-3 py-2">
                <div className="text-sm font-medium">{user.name}</div>
                <div className="truncate text-xs text-muted-foreground">{user.email}</div>
              </div>
              <div className="my-1 h-px bg-border" />
              <button
                onClick={onSignOut}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

function Stagger({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 18 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
          {subtitle && <p className="mt-2 max-w-xl text-sm text-muted-foreground">{subtitle}</p>}
        </motion.div>
        {children}
      </div>
    </section>
  );
}

/* ---------- Analyzer panel ---------- */

function parseRepo(url: string) {
  const m = url.match(/github\.com\/([^/]+)\/([^/?#]+)/);
  const owner = m?.[1] ?? "vercel";
  const name = (m?.[2] ?? "next.js").replace(/\.git$/, "");
  return { owner, name, full: `${owner}/${name}` };
}

function AnalyzerPanel({
  state,
  progress,
  stepIdx,
  repo,
}: {
  state: AnalyzerState;
  progress: number;
  stepIdx: number;
  repo: { owner: string; name: string; full: string };
}) {
  return (
    <div className="glass relative overflow-hidden rounded-2xl shadow-[var(--shadow-elevated)]">
      {/* Browser chrome */}
      <div className="flex items-center gap-2 border-b border-border/60 px-4 py-3">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
        </div>
        <div className="ml-3 flex items-center gap-2 rounded-md bg-surface px-2.5 py-1 text-xs text-muted-foreground">
          <Search className="h-3 w-3" />
          codebase-explainer.app/r/{repo.full}
        </div>
        <span className="ml-auto inline-flex items-center gap-1 rounded-md bg-primary/15 px-2 py-0.5 text-[10px] font-medium text-primary">
          <Activity className="h-3 w-3" /> live
        </span>
      </div>

      <div className="p-5">
        <AnimatePresence mode="wait">
          {state === "loading" ? (
            <LoadingView key="loading" progress={progress} stepIdx={stepIdx} />
          ) : (
            <ResultsView key="results" repo={repo} dim={state === "idle"} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function LoadingView({ progress, stepIdx }: { progress: number; stepIdx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-5"
    >
      <div>
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Analyzing repository</span>
          <span className="font-mono text-primary">{progress}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.1 }}
          />
        </div>
      </div>

      <div className="space-y-2">
        {loadingSteps.map((s, i) => {
          const done = i < stepIdx;
          const active = i === stepIdx;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                active ? "bg-primary/10 text-foreground" : done ? "text-muted-foreground" : "text-muted-foreground/60"
              }`}
            >
              {done ? (
                <CheckCircle2 className="h-4 w-4 text-primary" />
              ) : active ? (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              ) : (
                <Circle className="h-4 w-4" />
              )}
              <s.icon className="h-3.5 w-3.5" />
              <span>{s.label}</span>
            </motion.div>
          );
        })}
      </div>

      <div className="rounded-lg border border-border/60 bg-surface/50 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
        <div>$ codebase-explainer analyze</div>
        <div className="text-primary">→ fetched 1,284 files</div>
        <div className="text-primary">→ detected: TypeScript, React, Tailwind</div>
        <div>→ embedding chunks <span className="blink">▍</span></div>
      </div>
    </motion.div>
  );
}

function ResultsView({ repo, dim }: { repo: { owner: string; name: string; full: string }; dim?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={dim ? "opacity-90" : ""}
    >
      {/* Repo header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Github className="h-3.5 w-3.5" /> {repo.owner}
          </div>
          <div className="mt-0.5 text-lg font-semibold tracking-tight">{repo.name}</div>
        </div>
        <div className="flex items-center gap-2">
          <Pill icon={Star} value="124k" />
          <Pill icon={GitFork} value="26.8k" />
          <Pill icon={Eye} value="1.2k" />
        </div>
      </div>

      {/* Summary */}
      <div className="mt-4 rounded-xl border border-border/60 bg-surface/40 p-4">
        <div className="mb-1.5 flex items-center gap-2 text-xs text-primary">
          <Sparkles className="h-3.5 w-3.5" /> AI Summary
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          A production-grade React framework with a hybrid app router, server components, and edge runtime support. Codebase is modular, well-tested, and built around a plugin architecture.
        </p>
      </div>

      {/* Architecture */}
      <div className="mt-4 rounded-xl border border-border/60 bg-surface/40 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-primary">
            <Network className="h-3.5 w-3.5" /> Architecture
          </div>
          <button className="text-[11px] text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
            Open <ExternalLink className="h-3 w-3" />
          </button>
        </div>
        <ArchitectureSVG />
      </div>

      {/* Tech stack + deps */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
          <div className="mb-2 text-xs text-primary">Tech Stack</div>
          <div className="flex flex-wrap gap-1.5">
            {["TypeScript", "React 18", "Tailwind", "Vite", "Node 20", "tRPC"].map((t) => (
              <span key={t} className="rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-muted-foreground">{t}</span>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/40 p-4">
          <div className="mb-2 text-xs text-primary">Top Dependencies</div>
          <ul className="space-y-1 text-[12px]">
            {[
              ["react", "18.3.1"],
              ["next", "15.0.0"],
              ["zod", "3.23.8"],
              ["lucide-react", "0.462"],
            ].map(([n, v]) => (
              <li key={n} className="flex items-center justify-between">
                <span className="font-mono">{n}</span>
                <span className="font-mono text-muted-foreground">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3.5 w-3.5 text-primary" /> Health <b className="text-foreground">A+</b></span>
          <span className="inline-flex items-center gap-1"><Cpu className="h-3.5 w-3.5 text-primary" /> Score <b className="text-foreground">94</b></span>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs hover:bg-surface-2"><Share2 className="h-3 w-3" /> Share</button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground"><Download className="h-3 w-3" /> Export</button>
        </div>
      </div>
    </motion.div>
  );
}

function Pill({ icon: Icon, value }: { icon: React.ComponentType<{ className?: string }>; value: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-0.5 text-[11px] text-muted-foreground">
      <Icon className="h-3 w-3" /> {value}
    </span>
  );
}

function ArchitectureSVG() {
  const nodes = [
    { x: 40, y: 30, label: "App Router" },
    { x: 200, y: 30, label: "API Layer" },
    { x: 360, y: 30, label: "Edge" },
    { x: 40, y: 130, label: "UI Library" },
    { x: 200, y: 130, label: "State" },
    { x: 360, y: 130, label: "Data" },
  ];
  const edges = [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5],
  ];
  return (
    <svg viewBox="0 0 440 180" className="h-44 w-full">
      <defs>
        <linearGradient id="ln" x1="0" x2="1">
          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
          <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {edges.map(([a, b], i) => (
        <motion.line
          key={i}
          x1={nodes[a].x + 50}
          y1={nodes[a].y + 18}
          x2={nodes[b].x + 50}
          y2={nodes[b].y + 18}
          stroke="url(#ln)"
          strokeWidth="1.4"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: i * 0.08 }}
        />
      ))}
      {nodes.map((n, i) => (
        <motion.g
          key={n.label}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + i * 0.05 }}
        >
          <rect
            x={n.x}
            y={n.y}
            width={100}
            height={36}
            rx={9}
            fill="hsl(var(--surface-2))"
            stroke="hsl(var(--primary) / 0.4)"
          />
          <text
            x={n.x + 50}
            y={n.y + 22}
            textAnchor="middle"
            className="fill-foreground"
            style={{ font: "11px Inter, sans-serif" }}
          >
            {n.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}

/* ---------- Recent activity & checklist ---------- */

function RecentActivity({ hasReport, repo }: { hasReport: boolean; repo: { full: string; name: string } }) {
  return (
    <div className="glass rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Recent reports</h3>
        <button className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
          <Plus className="h-3.5 w-3.5" /> New report
        </button>
      </div>
      {!hasReport ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/40 px-6 py-12 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div className="text-sm font-medium">No reports yet</div>
          <p className="mt-1 max-w-xs text-xs text-muted-foreground">
            Start by analyzing your first repository above. It takes about 12 seconds.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60">
          {[
            { name: repo.name, full: repo.full, score: 94, when: "Just now" },
            { name: "tailwindlabs/tailwindcss", full: "tailwindlabs/tailwindcss", score: 91, when: "2 hours ago" },
            { name: "shadcn-ui/ui", full: "shadcn-ui/ui", score: 88, when: "Yesterday" },
          ].map((r) => (
            <li key={r.full} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{r.name}</div>
                <div className="truncate text-xs text-muted-foreground">{r.full} • {r.when}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-md border border-border bg-surface px-2 py-0.5 text-xs">
                  Score <b className="text-primary">{r.score}</b>
                </span>
                <button className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface px-2.5 py-1 text-xs hover:bg-surface-2">
                  Open <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Checklist({ items, done }: { items: { label: string; done: boolean }[]; done: number }) {
  const total = items.length;
  const pct = Math.round((done / total) * 100);
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-base font-semibold">Get Started Checklist</h3>
        <span className="text-xs text-muted-foreground">{done}/{total} complete</span>
      </div>
      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-surface">
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-[hsl(var(--primary-glow))]"
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <ul className="space-y-2">
        {items.map((it) => (
          <li
            key={it.label}
            className={`flex items-center gap-3 rounded-lg border border-border/60 px-3 py-2 text-sm transition-colors ${
              it.done ? "bg-primary/5 text-foreground" : "bg-surface/40 text-muted-foreground"
            }`}
          >
            {it.done ? <CheckCircle2 className="h-4 w-4 text-primary" /> : <Circle className="h-4 w-4" />}
            <span className={it.done ? "line-through decoration-muted-foreground/40" : ""}>{it.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}