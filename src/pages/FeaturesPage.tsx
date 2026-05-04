import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "./Index";
import { CheckCircle2, ArrowRight } from "lucide-react";
import featuresVideo from "../assets/features.mp4";

const featureList = [
  { title: "Smart Project Overview", desc: "Get high-level clarity in seconds" },
  { title: "Interactive Diagrams", desc: "Explore how modules interact" },
  { title: "AI 3-Step Breakdown", desc: "Follow the flow from start to finish" },
  { title: "Security Insights", desc: "Surface risks and outdated packages" },
  { title: "Commit Analytics", desc: "Track velocity, hotspots & focus" },
  { title: "And much more...", desc: "Built for developers, by developers" }
];

export function FeaturesSection() {
  return (
    <section className="w-full py-28 flex items-center justify-center relative">
      <div className="container max-w-7xl px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-16 items-center">

          {/* Left Column: Video */}
          <div className="relative group rounded-xl overflow-hidden border border-border/50 bg-[#06111c] shadow-[0_0_40px_rgba(0,210,185,0.08)]">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,210,185,0.1),transparent_70%)] pointer-events-none z-10" />

            <video
              src={featuresVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-auto object-cover relative z-0 opacity-90 transition-opacity duration-500 group-hover:opacity-100"
            />

            {/* Video Controls overlay matching the image - just static styling since it's an auto-playing demo video */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent z-20 pointer-events-none" />
          </div>

          {/* Right Column: Content */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="inline-block px-3 py-1.5 rounded-full bg-[#005a50]/20 border border-[#00d4b8]/30 text-[#00d4b8] text-[13px] font-semibold mb-6">
                Powerful Features
              </div>

              <h1 className="text-3xl md:text-4xl lg:text-[40px] font-bold tracking-tight text-foreground leading-[1.15]">
                Everything you need to <span className="text-primary">understand</span> and <span className="text-primary">improve code.</span>
              </h1>
            </div>

            {/* Grid of features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 mt-8 mb-10">
              {featureList.map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[15px] font-bold text-foreground leading-snug">{f.title}</h4>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Button */}
            <div>
              <button className="bg-primary text-primary-foreground font-semibold text-[15px] px-6 py-3 rounded-lg flex items-center gap-2 hover:brightness-110 transition-all shadow-[0_0_15px_rgba(0,210,185,0.3)]">
                View All Features
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar showLogo isLanding />
      <div className="flex-1">
        <FeaturesSection />
      </div>
      <Footer />
    </main>
  );
}
