import { useEffect, useState } from "react";
import {
  ArrowRight,
  Github,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Network,
  LineChart,
  Layers,
  BookOpen,
  Code2,
  Twitter,
  Linkedin,
  Mail,
  Star,
  Search,
  Cpu,
  FileText,
} from "lucide-react";
import { Particles } from "@/components/landing/Particles";
import { CountUp } from "@/components/landing/CountUp";
import { Reveal } from "@/components/landing/Reveal";
import { WordReveal } from "@/components/landing/WordReveal";
import { MagneticButton } from "@/components/landing/MagneticButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";



const features = [
  { icon: BookOpen, title: "Smart Project Overview", desc: "Instant high-level summary of any repo: purpose, stack, and architecture in plain English." },
  { icon: Network, title: "Interactive Architecture Diagrams", desc: "Auto-generated, explorable maps of how modules talk to each other." },
  { icon: Sparkles, title: "AI 3-Step Breakdown", desc: "From entry point to data flow — guided explanations tailored to your skill level." },
  { icon: GitBranch, title: "Dependency Graph", desc: "Visualize internal and external dependencies, spot bloat and circular imports." },
  { icon: ShieldCheck, title: "Security Insights", desc: "Surface risky patterns, outdated packages and secrets exposure at a glance." },
  { icon: LineChart, title: "Commit Analytics", desc: "Understand velocity, hotspots and contributor focus over time." },
];

const steps = [
  { n: "01", title: "Paste any public GitHub URL", desc: "Drop a link. No setup, no install, no config.", icon: Search },
  { n: "02", title: "Let AI inspect & explain", desc: "We parse, embed and reason over the codebase in seconds.", icon: Cpu },
  { n: "03", title: "Read, visualize, export", desc: "Browse interactive diagrams, share, or export a polished report.", icon: FileText },
];

const testimonials = [
  { quote: "Saved me hours understanding legacy repos.", name: "Maya Chen", role: "Senior Engineer, Plaid" },
  { quote: "Architecture diagrams are insanely helpful.", name: "Daniel Okafor", role: "Tech Lead, Linear" },
  { quote: "Best onboarding tool for engineers.", name: "Priya Raman", role: "EM, Vercel" },
];

const feedbackTicker = [
  "“Onboarded a new hire in 20 minutes. Wild.”",
  "“The dependency graph alone is worth it.”",
  "“Better than reading the README.”",
  "“Feels like pair-programming with a senior dev.”",
  "“Our entire team uses it weekly.”",
  "“Replaced three internal tools.”",
];

const logos = ["Vercel", "Supabase", "Next.js", "Tailwind CSS", "shadcn/ui", "GitHub"];

const Logo = () => (
  <a href="#" className="group flex items-center gap-2.5">
    <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 neon-border">
      <span className="absolute inset-0 rounded-xl blur-md bg-primary/30 group-hover:bg-primary/50 transition-colors" />
      <Code2 className="relative h-4.5 w-4.5 text-primary" strokeWidth={2.4} />
    </span>
    <span className="font-semibold tracking-tight text-[15px]">
      CodeBase<span className="text-primary"> Explainer</span>
    </span>
  </a>
);

import { Navbar } from "@/components/layout/Navbar";

const HeroDashboard = () => (
  <div className="relative">
    <div className="absolute -inset-8 bg-primary/20 blur-3xl rounded-[2rem] opacity-40" />
    <div className="relative glass rounded-2xl p-5 shadow-[var(--shadow-elevated)] neon-border float-y">
      {/* fake browser chrome */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="font-mono text-[11px] text-muted-foreground">
          codebase.ai / vercel/next.js
        </div>
        <div className="h-2.5 w-10" />
      </div>

      <div className="mt-4 grid grid-cols-12 gap-4">
        {/* AI summary */}
        <Reveal className="col-span-12 lg:col-span-7" delay={120}>
          <div className="rounded-xl bg-surface-2/60 border border-border p-4">
            <div className="flex items-center gap-2 text-xs text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI Summary
            </div>
            <p className="mt-2 text-sm leading-relaxed text-foreground/90">
              <span className="font-semibold">next.js</span> is a React framework
              for production. Pages route through{" "}
              <span className="font-mono text-primary">/app</span>, server logic
              lives in <span className="font-mono text-primary">/server</span>,
              and the bundler is orchestrated by{" "}
              <span className="font-mono text-primary">turbopack/</span>.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {["TypeScript", "React", "Rust", "Webpack", "SWC"].map((t) => (
                <span
                  key={t}
                  className="rounded-md bg-primary/10 text-primary px-2 py-0.5 text-[11px] font-mono border border-primary/20"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        {/* Stats column */}
        <Reveal className="col-span-12 lg:col-span-5 space-y-3" delay={240}>
          {[
            { k: "Files", v: 4218 },
            { k: "Modules", v: 312 },
            { k: "Quality", v: 94, suffix: "/100" },
          ].map((s) => (
            <div key={s.k} className="rounded-xl bg-surface-2/60 border border-border p-3 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{s.k}</span>
              <span className="font-mono text-sm font-semibold">
                <CountUp to={s.v} suffix={s.suffix ?? ""} />
              </span>
            </div>
          ))}
        </Reveal>

        {/* Architecture */}
        <Reveal className="col-span-12 lg:col-span-7" delay={360}>
          <div className="rounded-xl bg-surface-2/60 border border-border p-4">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground flex items-center gap-2">
                <Network className="h-3.5 w-3.5 text-primary" /> Architecture
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">live</div>
            </div>
            <svg viewBox="0 0 360 160" className="mt-2 w-full h-32">
              <defs>
                <linearGradient id="lg" x1="0" x2="1">
                  <stop offset="0" stopColor="hsl(var(--primary))" stopOpacity="0.9" />
                  <stop offset="1" stopColor="hsl(var(--primary))" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              {/* lines */}
              {[
                "M60,80 C120,40 180,40 300,40",
                "M60,80 C140,80 200,80 300,80",
                "M60,80 C140,120 220,120 300,120",
              ].map((d, i) => (
                <path
                  key={i}
                  d={d}
                  fill="none"
                  stroke="url(#lg)"
                  strokeWidth="1.4"
                  className="draw-line"
                  style={{ animationDelay: `${0.4 + i * 0.2}s` }}
                />
              ))}
              {/* nodes */}
              <g>
                <circle cx="60" cy="80" r="10" fill="hsl(var(--primary))" />
                <circle cx="60" cy="80" r="16" fill="hsl(var(--primary))" opacity="0.2" />
              </g>
              {[40, 80, 120].map((y) => (
                <g key={y}>
                  <circle cx="300" cy={y} r="6" fill="hsl(var(--primary))" />
                  <circle cx="300" cy={y} r="11" fill="hsl(var(--primary))" opacity="0.18" />
                </g>
              ))}
              <text x="60" y="110" textAnchor="middle" className="fill-muted-foreground" style={{ font: "10px JetBrains Mono" }}>core</text>
              <text x="300" y="30" textAnchor="middle" className="fill-muted-foreground" style={{ font: "10px JetBrains Mono" }}>app</text>
              <text x="300" y="98" textAnchor="middle" className="fill-muted-foreground" style={{ font: "10px JetBrains Mono" }}>server</text>
              <text x="300" y="138" textAnchor="middle" className="fill-muted-foreground" style={{ font: "10px JetBrains Mono" }}>bundler</text>
            </svg>
          </div>
        </Reveal>

        {/* Bars */}
        <Reveal className="col-span-12 lg:col-span-5" delay={480}>
          <div className="rounded-xl bg-surface-2/60 border border-border p-4 h-full">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <LineChart className="h-3.5 w-3.5 text-primary" /> Code by language
            </div>
            <div className="mt-4 flex items-end gap-2 h-24">
              {[60, 80, 35, 95, 50, 70, 42].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-md bg-gradient-to-t from-primary/80 to-primary/30 origin-bottom"
                  style={{
                    height: `${h}%`,
                    animation: `count-bar 1.1s var(--ease-spring) ${0.3 + i * 0.07}s both`,
                  }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] font-mono text-muted-foreground">
              <span>TS</span><span>JS</span><span>RS</span><span>CSS</span><span>MD</span><span>JSON</span><span>SH</span>
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  </div>
);

const Hero = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [repoUrl, setRepoUrl] = useState("https://github.com/vercel/next.js");

  const handleAnalyze = () => {
    if (!user) {
      navigate("/signup?mode=login");
    } else {
      let owner = "vercel";
      let repo = "next.js";
      try {
        const urlObj = new URL(repoUrl);
        const parts = urlObj.pathname.split("/").filter(Boolean);
        if (parts.length >= 2) {
          owner = parts[0];
          repo = parts[1].replace(".git", "");
        }
      } catch (e) {
        // Fallback to default if invalid URL
      }
      navigate(`/workspace/${owner}/${repo}/dashboard`);
    }
  };

  return (
    <section className="relative pt-36 pb-24 overflow-hidden">
      <div className="absolute inset-0 grid-bg grid-drift" />
      <div className="absolute inset-x-0 top-32 h-[500px] bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.18),transparent_60%)]" />
      <Particles count={28} />

      <div className="container relative">
        <Reveal className="flex justify-center">
          <a href="#" className="glass rounded-full px-3.5 py-1.5 text-xs text-muted-foreground inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-primary blink shadow-[0_0_8px_hsl(var(--primary))]" />
            New: AI 3-Step Breakdown is live
            <ArrowRight className="h-3 w-3" />
          </a>
        </Reveal>

        <div className="mt-6 text-center text-5xl md:text-7xl font-bold tracking-[-0.03em] leading-[1.05]">
          <WordReveal text="Instantly Understand" delay={0.1} />
          <WordReveal text="Any GitHub Repository" highlight="GitHub Repository" delay={0.35} />
        </div>

        <Reveal delay={260} as="p" className="mt-6 text-center text-lg text-muted-foreground max-w-2xl mx-auto">
          Paste a repo URL and get architecture diagrams, dependency graphs and
          an AI explanation in seconds — built for curious developers.
        </Reveal>

        <Reveal delay={420} className="mt-9 max-w-2xl mx-auto">
          <div className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2 neon-border focus-within:shadow-[var(--shadow-glow)] transition-shadow">
            <div className="flex items-center gap-2.5 px-3 flex-1">
              <Github className="h-4.5 w-4.5 text-muted-foreground" />
              <input
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                className="bg-transparent w-full py-2.5 text-sm font-mono outline-none placeholder:text-muted-foreground"
                placeholder="https://github.com/owner/repo"
              />
            </div>

            <MagneticButton onClick={handleAnalyze} className="glow-cta group inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110">
              Analyze Repository Now
              <ArrowRight className="h-4 w-4 nudge" />
            </MagneticButton>
          </div>
          <div className="mt-3 text-center text-xs text-muted-foreground inline-flex items-center gap-2 w-full justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-primary blink shadow-[0_0_6px_hsl(var(--primary))]" />
            No signup required • Results in seconds
          </div>
        </Reveal>

        <Reveal delay={620} className="mt-16 max-w-5xl mx-auto">
          <HeroDashboard />
        </Reveal>
      </div>
    </section>
  );
};

const TrustBar = () => (
  <section className="py-14 border-y border-border/60 bg-surface/40">
    <div className="container">
      <p className="text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">
        Trusted by builders shipping on
      </p>
      <div className="mt-6 overflow-hidden relative">
        <div className="marquee">
          {[...logos, ...logos].map((name, i) => (
            <div
              key={i}
              className="text-xl font-semibold text-muted-foreground/70 hover:text-primary transition-colors duration-300 whitespace-nowrap"
              style={{ filter: "grayscale(100%)" }}
            >
              {name}
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
      </div>
    </div>
  </section>
);

const Stats = () => {
  const items = [
    { v: 12000, suffix: "+", label: "Repositories Explained" },
    { v: 2.4, suffix: "s", label: "Avg Analysis Time", decimals: 1 },
    { v: 94, suffix: "%", label: "Developer Satisfaction" },
    { v: 0, label: "Live AI Architecture Insights", custom: "Live" },
  ];
  return (
    <section className="py-24">
      <div className="container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {items.map((s, i) => (
          <Reveal key={i} delay={i * 90}>
            <div className="group relative glass neon-border rounded-2xl p-6 transition-transform duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-glow)]">
              <div className="text-4xl font-bold tracking-tight">
                {s.custom ? (
                  <span className="text-gradient">{s.custom}</span>
                ) : (
                  <CountUp to={s.v} suffix={s.suffix} decimals={s.decimals ?? 0} />
                )}
              </div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
              <div className="absolute inset-x-6 bottom-3 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

export const Features = () => (
  <section id="features" className="py-24 relative">
    <div className="absolute inset-0 grid-bg opacity-30" />
    <div className="container relative">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <Layers className="h-3.5 w-3.5 text-primary" /> Features
          </span>
          <h2 className="mt-5 text-4xl md:text-5xl font-bold tracking-tight">
            Built for <span className="text-gradient">Curious Developers</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to navigate, understand and explain unfamiliar
            codebases — without the deep dive.
          </p>
        </div>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map((f, i) => (
          <Reveal key={f.title} delay={i * 80}>
            <div className="group glass neon-border rounded-2xl p-6 h-full transition-all duration-500 hover:-translate-y-1.5 hover:rotate-[0.6deg] hover:shadow-[var(--shadow-glow)]">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 border border-primary/20 text-primary group-hover:bg-primary/15 transition-colors">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-lg font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

export const HowItWorks = () => (
  <section id="how" className="py-24">
    <div className="container">
      <Reveal>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Three Steps to <span className="text-gradient">Clarity</span>
          </h2>
          <p className="mt-4 text-muted-foreground">From URL to understanding in under three seconds.</p>
        </div>
      </Reveal>

      <div className="relative mt-16">
        <div className="absolute left-0 right-0 top-10 hidden md:block">
          <svg viewBox="0 0 1000 4" preserveAspectRatio="none" className="w-full h-1">
            <line x1="0" y1="2" x2="1000" y2="2" stroke="hsl(var(--primary))" strokeOpacity="0.3" strokeDasharray="6 8" className="draw-line" />
          </svg>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 150}>
              <div className="glass neon-border rounded-2xl p-6 text-center">
                <div className="mx-auto relative grid h-16 w-16 place-items-center rounded-full bg-background border border-primary/40">
                  <span className="absolute inset-0 rounded-full bg-primary/20 blur-md animate-pulse" />
                  <s.icon className="relative h-6 w-6 text-primary" />
                </div>
                <div className="mt-4 font-mono text-xs text-primary">{s.n}</div>
                <h3 className="mt-1 text-lg font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

export const Testimonials = () => (
  <section id="insights" className="py-24 relative">
    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    <div className="container">
      <Reveal>
        <h2 className="text-center text-4xl md:text-5xl font-bold tracking-tight">
          Loved by <span className="text-gradient">Developers</span>
        </h2>
      </Reveal>
      <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <Reveal key={i} delay={i * 120}>
            <div className="group relative glass neon-border rounded-2xl p-6 float-y" style={{ animationDelay: `${i * 0.6}s` }}>
              <div className="absolute -inset-px rounded-2xl bg-primary/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-primary" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-relaxed">{t.quote}</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-primary-glow" />
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

const SatisfactionMeter = () => {
  const target = 4.9;
  const max = 5;
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 2000;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setVal(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  const offset = circumference - (val / max) * circumference;
  return (
    <div className="relative grid place-items-center">
      <svg width="220" height="220" className="-rotate-90">
        <circle cx="110" cy="110" r={radius} stroke="hsl(var(--border))" strokeWidth="10" fill="none" />
        <circle
          cx="110" cy="110" r={radius}
          stroke="hsl(var(--primary))" strokeWidth="10" fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ filter: "drop-shadow(0 0 8px hsl(var(--primary)))" }}
        />
      </svg>
      <div className="absolute text-center">
        <div className="text-5xl font-bold tracking-tight">{val.toFixed(1)}</div>
        <div className="text-xs text-muted-foreground mt-1">out of 5.0</div>
      </div>
    </div>
  );
};

const Feedback = () => (
  <section id="reports" className="py-24">
    <div className="container grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
      <Reveal>
        <div className="glass neon-border rounded-2xl p-10 text-center">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">Community Satisfaction</p>
          <div className="mt-6 flex justify-center">
            <SatisfactionMeter />
          </div>
          <p className="mt-6 text-sm text-muted-foreground">Based on 8,200+ verified developer reviews this quarter.</p>
        </div>
      </Reveal>

      <Reveal delay={150}>
        <div className="relative h-[420px] overflow-hidden glass neon-border rounded-2xl p-6">
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-card to-transparent z-10 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-card to-transparent z-10 pointer-events-none" />
          <div className="ticker-up space-y-3">
            {[...feedbackTicker, ...feedbackTicker].map((q, i) => (
              <div key={i} className="rounded-xl bg-surface-2/70 border border-border p-4">
                <div className="flex gap-0.5 text-primary mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-3 w-3 fill-primary" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed">{q}</p>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  </section>
);

const FinalCTA = () => (
  <section className="py-28 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.25),transparent_60%)]" />
    <Particles count={20} />
    <div className="container relative text-center">
      <Reveal as="h2" className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl mx-auto leading-[1.05]">
        Ready to Stop Guessing
        <br /> How <span className="text-gradient">Code Works?</span>
      </Reveal>
      <Reveal delay={150} as="p" className="mt-5 text-muted-foreground max-w-xl mx-auto">
        Free forever for public repositories. Join 12,000+ developers who finally understand the codebase.
      </Reveal>
      <Reveal delay={280}>
        <div className="mt-10 flex justify-center">
          <button className="glow-cta shimmer group inline-flex items-center gap-2 rounded-2xl bg-primary px-7 py-4 text-base font-semibold text-primary-foreground hover:brightness-110 transition">
            Start Exploring a Repo
            <ArrowRight className="h-5 w-5 nudge" />
          </button>
        </div>
      </Reveal>
    </div>
  </section>
);

export const Footer = () => (
  <footer className="border-t border-border/60 glass-strong">
    <div className="container py-16 grid grid-cols-2 md:grid-cols-5 gap-10">
      <Reveal className="col-span-2">
        <Logo />
        <p className="mt-4 text-sm text-muted-foreground max-w-xs">
          The fastest way to understand any GitHub repository, powered by AI.
        </p>
        <div className="mt-5 flex gap-2">
          {[Twitter, Github, Linkedin, Mail].map((I, i) => (
            <a key={i} href="#" className="grid h-9 w-9 place-items-center rounded-lg border border-border hover:border-primary hover:text-primary transition-all hover:-translate-y-0.5">
              <I className="h-4 w-4" />
            </a>
          ))}
        </div>
      </Reveal>
      {[
        { title: "Product", links: ["Features", "How it Works", "Pricing", "Changelog"] },
        { title: "Resources", links: ["Docs", "Examples", "Blog", "API"] },
        { title: "Company", links: ["About", "Careers", "Contact", "Press"] },
      ].map((col, i) => (
        <Reveal key={col.title} delay={(i + 1) * 100}>
          <div className="text-sm font-semibold tracking-tight">{col.title}</div>
          <ul className="mt-4 space-y-2.5">
            {col.links.map((l) => (
              <li key={l}>
                <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">{l}</a>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </div>

    <div className="container pb-8">
      <Reveal>
        <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-3 justify-between">
          <div className="text-sm">
            <div className="font-semibold">Get the weekly dev brief</div>
            <div className="text-muted-foreground text-xs">One curated repo + breakdown, every Friday.</div>
          </div>
          <div className="flex w-full sm:w-auto gap-2">
            <input
              placeholder="you@dev.com"
              className="bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary focus:shadow-[0_0_18px_hsl(var(--primary)/0.35)] transition flex-1 sm:w-72"
            />
            <button className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition">
              Subscribe
            </button>
          </div>
        </div>
      </Reveal>
    </div>

    <div className="border-t border-border/60">
      <div className="container py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>© 2026 CodeBase Explainer • Built with love for developers</span>
        <span className="font-mono">v1.0.0 • status: <span className="text-primary">all systems operational</span></span>
      </div>
    </div>
  </footer>
);

const Index = () => {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar isLanding scrolled={scrolled} />
      <Hero />
      <TrustBar />
      <Stats />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Feedback />
      <FinalCTA />
      <Footer />
    </main>
  );
};

export default Index;
