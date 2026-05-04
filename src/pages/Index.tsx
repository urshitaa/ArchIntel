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
  Zap,
} from "lucide-react";
import feature1Img from "../assets/Feature1.png";
import feature2Img from "../assets/Feature2.png";
import feature3Img from "../assets/Feature3.png";
import { Particles } from "@/components/landing/Particles";
import { CountUp } from "@/components/landing/CountUp";
import { Reveal } from "@/components/landing/Reveal";
import { WordReveal } from "@/components/landing/WordReveal";
import { MagneticButton } from "@/components/landing/MagneticButton";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import logoImg from "../assets/logo.png";


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
  {
    quote: "ArchIntel is like having a senior engineer constantly by your side. It instantly breaks down complex legacy repos into understandable, interactive diagrams. It saved us weeks during our last major refactor.",
    name: "Alex Rivera",
    role: "Lead Architect at TechFlow",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=transparent",
    handle: "@arivera_dev"
  },
  {
    quote: "I've tried many code analysis tools, but the visual dependency graph and AI-powered step-by-step breakdowns here are unmatched. It completely transformed our onboarding process.",
    name: "Samantha Lee",
    role: "Engineering Manager at Vercel",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam&backgroundColor=transparent",
    handle: "@samlee_codes"
  },
  {
    quote: "The deep architecture insights provided by this platform allowed us to identify three critical bottlenecks in our microservices that we had been missing for months. Absolutely indispensable.",
    name: "David Chen",
    role: "Senior Backend Engineer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=transparent",
    handle: "@dchen_backend"
  },
  {
    quote: "Security scanning built into the architectural overview? Yes please. It highlighted exposed secrets and risky patterns before they ever made it to production.",
    name: "Elena Rostova",
    role: "DevSecOps Lead at FinTech Inc.",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Elena&backgroundColor=transparent",
    handle: "@erostova_sec"
  },
  {
    quote: "As a frontend developer diving into a massive monolithic backend for the first time, ArchIntel's interactive mapping made what would have been a terrifying task actually enjoyable.",
    name: "Marcus Johnson",
    role: "Full Stack Developer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=transparent",
    handle: "@marcusj_web"
  },
  {
    quote: "The ability to just drop a GitHub URL and get a complete, understandable architecture report in seconds feels like magic. Best developer tool I've used this year.",
    name: "Chloe Smith",
    role: "CTO at StartupX",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chloe&backgroundColor=transparent",
    handle: "@chloe_tech"
  }
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
  <Link to="/" >
    <img src={logoImg} alt="Logo" className="  h-8 w-36 object-fit" />
  </Link>
  // <a href="#" className="group flex items-center gap-2.5">
  //   <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary/30 to-primary/5 neon-border">
  //     <span className="absolute inset-0 rounded-xl blur-md bg-primary/30 group-hover:bg-primary/50 transition-colors" />
  //     <Code2 className="relative h-4.5 w-4.5 text-primary" strokeWidth={2.4} />
  //   </span>
  //   <span className="font-semibold tracking-tight text-[15px]">
  //     <span className="text-primary"> </span>
  //   </span>
  // </a>
);

import { Navbar } from "@/components/layout/Navbar";
import Landing, { FAQSection } from "./Landing";
import { FeaturesSection } from "./FeaturesPage";


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
            Just enter the repo URL • Results in seconds
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


import { Rocket, Users, Check, Hexagon } from "lucide-react";

const plans = [
  {
    name: "FREE",
    price: "0",
    period: "Forever",
    icon: Rocket,
    features: [
      "3 Public Repos / month",
      "Explain up to 5 files",
      "Basic Code Explanations",
      "Community Support",
    ],
    buttonClass: "border border-primary text-primary bg-transparent hover:bg-primary/10",
  },
  {
    name: "PRO",
    price: "9",
    period: "/month",
    billed: "Billed monthly",
    icon: Zap,
    popular: true,
    features: [
      "Unlimited Public Repos",
      "Explain up to 50 files",
      "Advanced Explanations",
      "Diagrams & Visuals",
      "Priority Support",
    ],
    buttonClass: "bg-primary text-primary-foreground hover:brightness-110",
  },
  {
    name: "TEAM",
    price: "29",
    period: "/month",
    billed: "Billed monthly",
    icon: Users,
    features: [
      "Everything in Pro",
      "Unlimited Private Repos",
      "Explain up to 500 files",
      "Team Workspaces",
      "Priority Support",
    ],
    buttonClass: "border border-primary text-primary bg-transparent hover:bg-primary/10",
  },
];

export function Pricing() {
  return (
    <main className="min-h-screen bg-background flex flex-col font-sans">


      <div className="flex-1 container py-24 flex flex-col items-center">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Powerful plans for <span className="text-primary">every developer</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Explain more. Understand better. Ship faster.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col items-center rounded-3xl p-8 bg-[#0a111a]/80 backdrop-blur-sm border ${plan.popular
                ? "border-primary shadow-[0_0_30px_hsl(var(--primary)/0.15)] md:-translate-y-2 z-10"
                : "border-border/50"
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 overflow-hidden w-28 h-28 rounded-tr-3xl">
                  <div className="absolute top-6 -right-7 bg-primary text-primary-foreground text-[10px] font-bold py-1.5 px-10 transform rotate-45 text-center shadow-lg uppercase tracking-wider">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="relative flex items-center justify-center w-20 h-20 mb-6 text-primary">
                <Hexagon className={`absolute inset-0 w-20 h-20 ${plan.popular ? 'fill-primary/10 stroke-primary stroke-[1.5]' : 'stroke-primary stroke-[1.5]'}`} />
                <plan.icon className={`relative z-10 w-8 h-8 ${plan.popular ? 'fill-primary' : ''}`} />
              </div>

              {/* Title & Price */}
              <h3 className="text-lg font-bold text-primary tracking-wide mb-4 uppercase">
                {plan.name}
              </h3>
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-5xl font-extrabold text-foreground">${plan.price}</span>
                {plan.period !== "Forever" && (
                  <span className="text-muted-foreground text-sm font-medium">{plan.period}</span>
                )}
              </div>
              <div className="h-6 mb-8 text-sm text-muted-foreground/80 font-medium">
                {plan.billed || plan.period}
              </div>

              {/* Divider */}
              <div className="w-full h-px bg-border/40 mb-8" />

              {/* Features */}
              <ul className="w-full space-y-4 mb-10 flex-1">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-[15px] text-muted-foreground/90">
                    <Check className="w-4 h-4 text-primary shrink-0 stroke-[3]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                title="Coming soon!"
                className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 cursor-not-allowed opacity-90 ${plan.buttonClass}`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>


    </main>
  );
}



export const HowItWorks = () => {
  const customSteps = [
    {
      n: "01",
      title: "Connect & Analyze Instantly",
      highlight: "No sign up. No install. No configuration.",
      desc: "Simply paste the URL of any public GitHub repository. Our engine immediately begins fetching the source code, preparing it for deep architectural analysis without requiring any access tokens or local setup.",
      img: feature1Img,
      reverse: false,
      tags: [{ icon: Github, text: "Public Repos" }, { icon: Sparkles, text: "Zero Setup" }, { icon: Zap, text: "Lightning Fast" }]
    },
    {
      n: "02",
      title: "Let AI Inspect & Explain",
      highlight: "We parse, embed, and reason over the entire codebase.",
      desc: "Our advanced language models dissect the repository structure, track data flows, and identify design patterns. It uncovers the 'why' behind the code, giving you senior-level insights in a matter of seconds.",
      img: feature2Img,
      reverse: true,
      tags: [{ icon: Cpu, text: "Neural Parsing" }, { icon: Layers, text: "Deep Analysis" }, { icon: BookOpen, text: "Contextual Insights" }]
    },
    {
      n: "03",
      title: "Visualize, Understand, Export",
      highlight: "Turn overwhelming complexity into pristine clarity.",
      desc: "Navigate through interactive architecture maps and dependency graphs. Once you have the full picture, export comprehensive, presentation-ready reports to align your team and speed up onboarding.",
      img: feature3Img,
      reverse: false,
      tags: [{ icon: Network, text: "Architecture Maps" }, { icon: GitBranch, text: "Dependency Trees" }, { icon: FileText, text: "PDF Reports" }]
    }
  ];

  return (
    <section id="how" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,210,185,0.03),transparent_70%)] pointer-events-none" />
      <div className="container relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Three Steps to <span className="text-gradient">Clarity</span>
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">From URL to understanding in under three seconds.</p>
            <p className="mt-2 text-muted-foreground text-sm">
              Skip the setup. Skip the guesswork. Get architecture diagrams, dependency graphs,<br className="hidden sm:block" />
              and AI explanations — all in one place.
            </p>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-2 px-24">
          {customSteps.map((s, i) => (
            <Reveal key={s.n} delay={i * 150}>
              <div className={`glass neon-border rounded-sm p-8  flex flex-col ${s.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center   hover:shadow-[0_0_35px_rgba(0,210,185,0.12)] transition-shadow duration-500 group`}>

                {/* Text Content */}
                <div className="flex-1 flex gap-6 w-full">
                  {/* Step Number Circle */}
                  <div className="flex-shrink-0">
                    <div className="grid h-16 w-16 place-items-center rounded-full bg-surface-2 border border-primary/30 shadow-[0_0_15px_rgba(0,210,185,0.15)] group-hover:scale-110 transition-transform duration-300">
                      <span className="font-mono text-xl font-bold text-primary">{s.n}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h3 className="text-3xl font-extrabold tracking-tight bg-gradient-to-br from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-500">{s.title}</h3>
                    <p className="mt-4 font-semibold text-primary tracking-wide text-sm uppercase letter-spacing-[0.1em]">{s.highlight}</p>
                    <p className="mt-4 text-muted-foreground leading-relaxed max-w-md text-[15px]">{s.desc}</p>

                    {s.tags && s.tags.length > 0 && (
                      <div className="mt-8 flex flex-wrap gap-3">
                        {s.tags.map((t, idx) => (
                          <div key={idx} className="flex items-center gap-2 rounded-xl bg-surface-2/40 border border-border/50 px-3.5 py-2 text-xs font-medium text-foreground/80 hover:text-primary hover:border-primary/50 hover:bg-primary/5 hover:shadow-[0_0_15px_rgba(0,210,185,0.1)] transition-all duration-300 cursor-default">
                            <t.icon className="h-4 w-4 text-primary" />
                            {t.text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Content */}
                <div className="flex-1 w-full flex justify-center items-center relative">
                  <div className="absolute inset-0 bg-primary/5 rounded-3xl blur-2xl group-hover:bg-primary/15 transition-colors duration-500 pointer-events-none" />
                  <img
                    src={s.img}
                    alt={`Step ${s.n}`}
                    className="relative w-full max-w-md object-contain filter drop-shadow-[0_0_25px_rgba(0,0,0,0.5)] group-hover:scale-[1.03] group-hover:-translate-y-2 transition-all duration-500 ease-out"
                  />
                </div>

              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
const TestimonialCard = ({ t, idx }: { t: any, idx: number }) => (
  <div className="relative group glass neon-border rounded-2xl p-7 transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-primary/20 bg-[#0a111a]/80 backdrop-blur-md">
    <div className="absolute -inset-px rounded-2xl bg-gradient-to-b from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10">
      <div className="flex gap-1 text-primary mb-6">
        {Array.from({ length: 5 }).map((_, j) => (
          <Star key={j} className="h-4 w-4 fill-primary stroke-primary" />
        ))}
      </div>
      <p className="text-[15px] leading-relaxed text-foreground/90 mb-8 font-medium">
        "{t.quote}"
      </p>
      <div className="flex items-center gap-4 pt-4 border-t border-border/40">
        <div className="relative h-11 w-11 rounded-full overflow-hidden border border-primary/30 bg-primary/10 flex-shrink-0">
          <img src={t.avatar} alt={t.name} className="h-full w-full object-cover" />
        </div>
        <div className="flex flex-col">
          <div className="text-sm font-bold text-foreground flex items-center gap-1.5">
            {t.name}
            <span className="text-[11px] font-normal text-muted-foreground/80">{t.handle}</span>
          </div>
          <div className="text-xs text-primary/80 font-medium mt-0.5">{t.role}</div>
        </div>
      </div>
    </div>
  </div>
);

export const Testimonials = () => {
  const col1 = testimonials.slice(0, 2);
  const col2 = testimonials.slice(2, 4);
  const col3 = testimonials.slice(4, 6);

  // Repeat enough times to ensure the container is tall enough for seamless -50% translation
  const rep1 = [...col1, ...col1, ...col1, ...col1];
  const rep2 = [...col2, ...col2, ...col2, ...col2];
  const rep3 = [...col3, ...col3, ...col3, ...col3];

  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="container relative z-10">
        <Reveal>
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Loved by <span className="text-primary">Engineers</span> Worldwide
            </h2>
            <p className="text-lg text-muted-foreground">
              See how top development teams are using ArchIntel to understand, document, and scale their codebases faster than ever before.
            </p>
          </div>
        </Reveal>
        
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-[700px] overflow-hidden relative"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)"
          }}
        >
          {/* Column 1 (Scroll Down) */}
          <div className="flex flex-col gap-6 ticker-down hover:[animation-play-state:paused]">
            {rep1.map((t, i) => (
               <TestimonialCard key={`c1-${i}`} t={t} idx={i} />
            ))}
          </div>
          
          {/* Column 2 (Scroll Up) */}
          <div className="hidden md:flex flex-col gap-6 ticker-up hover:[animation-play-state:paused]">
            {rep2.map((t, i) => (
               <TestimonialCard key={`c2-${i}`} t={t} idx={i} />
            ))}
          </div>
          
          {/* Column 3 (Scroll Down) */}
          <div className="hidden lg:flex flex-col gap-6 ticker-down hover:[animation-play-state:paused]">
            {rep3.map((t, i) => (
               <TestimonialCard key={`c3-${i}`} t={t} idx={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};



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
        <span>© 2026 RepoGPT</span>
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
      <Landing />
      {/* <Hero /> */}
      <TrustBar />



      {/* Replacing old Features with the new FeaturesSection */}
      <FeaturesSection />

      <HowItWorks />


      {/* <Feedback />
      <FinalCTA /> */}
      <Pricing />
      <FAQSection />
      <Testimonials />
      <Footer />
    </main>
  );
};

export default Index;
