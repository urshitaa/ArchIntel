import { Navbar } from "@/components/layout/Navbar";
import { Zap } from "lucide-react";

export function Pricing() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar showLogo />
      <div className="flex-1 container py-16">
        <div className="glass rounded-2xl p-10 text-center max-w-2xl mx-auto mt-12 border border-border/50">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Pricing</h1>
          <p className="text-muted-foreground mb-8">
            You are currently on the Free Plan. Check back later for Pro tier upgrades.
          </p>
        </div>
      </div>
    </main>
  );
}
