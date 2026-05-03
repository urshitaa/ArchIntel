import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "./Index";
import { 
  Search, Target, Lightbulb, ShieldCheck, TrendingUp, 
  Eye, Rocket, Zap, BarChart2, CheckCircle2, 
  BookOpen, Network, Cpu, Code2, Check, Star, Heart
} from "lucide-react";

export function Insights() {
  return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar showLogo />
      
      <div className="flex-1 container py-20 px-4 md:px-8 max-w-6xl mx-auto flex flex-col gap-24">
        
        {/* Section 1 */}
        <section className="flex flex-col gap-12">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
              Insights That Drive <span className="text-primary">Better Code</span>,
              <br className="hidden md:block" /> Faster Decisions
            </h1>
            <p className="text-muted-foreground text-lg">
              Codebase Explainer turns complex codebases<br className="hidden md:block" /> into clear, actionable insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column: List */}
            <div className="flex flex-col gap-6 bg-[#0a111a]/50 p-6 md:p-8 rounded-3xl border border-border/50">
              {[
                { icon: Search, title: "Understand Instantly", desc: "Get clear explanations of any codebase in seconds." },
                { icon: Target, title: "Save Hours Every Week", desc: "Skip the manual digging and focus on building, not reading." },
                { icon: Lightbulb, title: "Onboard Faster", desc: "New teammates get up to speed 10x faster." },
                { icon: ShieldCheck, title: "Make Confident Changes", desc: "Understand impact and dependencies before you change anything." },
                { icon: TrendingUp, title: "Ship with Confidence", desc: "Cleaner understanding leads to better code and fewer bugs." }
              ].map((item, i) => (
                <div key={i} className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center shrink-0 bg-primary/5 text-primary">
                    <item.icon className="w-6 h-6 stroke-[1.5]" />
                  </div>
                  <div>
                    <h3 className="text-foreground font-semibold mb-1 text-[15px]">{item.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Visual Diagram */}
            <div className="relative h-[450px] w-full flex items-center justify-center rounded-3xl border border-border/20 bg-[radial-gradient(ellipse_at_center,rgba(0,210,185,0.05),transparent_70%)]">
              {/* SVG Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ filter: "drop-shadow(0 0 4px rgba(0,210,185,0.3))" }}>
                <path d="M 50% 50% L 50% 20%" stroke="rgba(0,210,185,0.4)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                <path d="M 50% 50% L 20% 40%" stroke="rgba(0,210,185,0.4)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                <path d="M 50% 50% L 80% 40%" stroke="rgba(0,210,185,0.4)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                <path d="M 50% 50% L 35% 80%" stroke="rgba(0,210,185,0.4)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
                <path d="M 50% 50% L 65% 80%" stroke="rgba(0,210,185,0.4)" strokeWidth="1.5" strokeDasharray="4 4" fill="none" />
              </svg>

              {/* Center Circle */}
              <div className="relative z-10 w-32 h-32 rounded-full border-2 border-primary bg-[#020d1a] shadow-[0_0_40px_rgba(0,210,185,0.2)] flex items-center justify-center text-4xl font-bold text-primary font-mono tracking-tighter">
                &lt;/&gt;
              </div>

              {/* Connected Nodes */}
              <div className="absolute top-[10%] bg-[#06111c] border border-border px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm text-foreground z-10">
                <Eye className="w-4 h-4 text-primary" /> Clarity
              </div>
              <div className="absolute left-[5%] top-[35%] bg-[#06111c] border border-border px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm text-foreground z-10">
                <Rocket className="w-4 h-4 text-primary" /> Productivity
              </div>
              <div className="absolute right-[5%] top-[35%] bg-[#06111c] border border-border px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm text-foreground z-10">
                <Zap className="w-4 h-4 text-primary" /> Speed
              </div>
              <div className="absolute left-[15%] bottom-[12%] bg-[#06111c] border border-border px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm text-foreground z-10">
                <BarChart2 className="w-4 h-4 text-primary" /> Impact
              </div>
              <div className="absolute right-[15%] bottom-[12%] bg-[#06111c] border border-border px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm text-foreground z-10">
                <ShieldCheck className="w-4 h-4 text-primary" /> Confidence
              </div>
            </div>
          </div>

          {/* Bottom Banner Section 1 */}
          <div className="w-full bg-[#0a111a]/60 border border-border/60 rounded-2xl py-5 px-6 flex items-center justify-center gap-3 text-muted-foreground text-sm">
            <Heart className="w-5 h-5 text-primary shrink-0" />
            Loved by developers who value clarity, speed, and quality.
          </div>
        </section>

        {/* Section 2 */}
        <section className="flex flex-col gap-16 border border-border/40 rounded-[2.5rem] p-8 md:p-12 bg-[#060c14]/50 relative overflow-hidden">
          {/* Subtle gradient bg */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,210,185,0.03),transparent_50%)] pointer-events-none" />

          <div className="text-center relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-2">
              Turning Complexity Into Clarity.
            </h2>
            <p className="text-2xl md:text-3xl text-muted-foreground font-medium">
              Delivering <span className="text-primary font-bold">Real Value.</span>
            </p>
          </div>

          {/* Timeline */}
          <div className="relative z-10 w-full">
            {/* Horizontal Line connecting nodes (hidden on mobile, visible on lg) */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent border-t border-dashed border-primary/50" />

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-4 relative">
              {[
                { icon: BookOpen, title: "Explains What It Does", desc: "Understand any file, function, or module in plain English." },
                { icon: Network, title: "Shows How It Works", desc: "Visualize relationships, dependencies, and data flow." },
                { icon: Cpu, title: "Highlights What Matters", desc: "Surface complex logic, edge cases, and key patterns." },
                { icon: Code2, title: "Empowers Better Developers", desc: "Write better code, avoid bugs, and make smart changes." },
                { icon: TrendingUp, title: "Adds Value Every Day", desc: "From onboarding to debugging to scaling—we've got you." }
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-4 relative">
                  <div className="w-24 h-24 rounded-full border-2 border-primary/40 bg-[#020d1a] flex items-center justify-center text-primary z-10 relative">
                    <step.icon className="w-10 h-10 stroke-[1.5]" />
                    {/* Ring glow */}
                    <div className="absolute inset-[-6px] border border-primary/20 rounded-full" />
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-foreground mb-2 px-2 leading-tight uppercase tracking-wider">{step.title}</h3>
                    <p className="text-[13px] text-muted-foreground/80 leading-relaxed px-1">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Box (Developers Love Us) */}
          <div className="relative mt-8 z-10 border border-primary/30 rounded-3xl p-8 md:p-10 bg-[#0a111a]/80 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Star connecting pin */}
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-[#020d1a] border border-primary/40 flex items-center justify-center text-primary">
              <Star className="w-5 h-5 fill-primary" />
            </div>

            {/* Left Column */}
            <div className="flex flex-col gap-6 md:border-r border-border/60 md:pr-10">
              <h3 className="text-lg font-bold text-foreground">Developers Love Us Because We:</h3>
              <ul className="space-y-4">
                {[
                  "Make code easy to understand",
                  "Save valuable time",
                  "Improve code quality",
                  "Help ship features faster"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Column */}
            <div className="flex flex-col items-center text-center gap-6 md:pl-4">
              <div className="space-y-1">
                <p className="text-foreground font-medium text-lg">Your codebase holds the answers.</p>
                <p className="text-primary font-bold text-lg">We help you understand them.</p>
              </div>
              <div className="text-6xl font-bold text-primary font-mono tracking-tighter opacity-80 mt-2">
                &lt;/&gt;
              </div>
            </div>
          </div>
        </section>

      </div>
      
      <Footer />
    </main>
  );
}
