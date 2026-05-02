import { Navbar } from "@/components/layout/Navbar";
import { FolderGit2 } from "lucide-react";

export function Reports() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar showLogo />
      <div className="flex-1 container py-16">
        <div className="glass rounded-2xl p-10 text-center max-w-2xl mx-auto mt-12 border border-border/50">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <FolderGit2 className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight mb-3">Your Reports</h1>
          <p className="text-muted-foreground mb-8">
            You haven't generated any reports yet. Analyze your first repository to see it here.
          </p>
          <button onClick={() => window.location.href = "/welcome"} className="glow-cta inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 transition">
            Analyze a Repository
          </button>
        </div>
      </div>
    </main>
  );
}
