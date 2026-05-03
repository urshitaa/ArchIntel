import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "./Index";
import { FolderGit2, Calendar, ArrowRight, Github } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Reports() {
  const [history, setHistory] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('archintel_history') || '[]');
      setHistory(stored);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <main className="min-h-screen bg-background flex flex-col font-sans">
      <Navbar showLogo />
      
      <div className="flex-1 container py-24 max-w-6xl mx-auto px-4">
        
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">Your Reports</h1>
          <p className="text-muted-foreground text-lg">
            A history of repositories you've recently analyzed.
          </p>
        </div>

        {history.length === 0 ? (
          <div className="glass rounded-3xl p-16 text-center max-w-2xl mx-auto border border-border/50 shadow-[0_0_40px_rgba(0,210,185,0.05)]">
            <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
              <FolderGit2 className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight mb-3">No Reports Yet</h2>
            <p className="text-muted-foreground mb-8 text-lg">
              You haven't generated any reports yet. Analyze your first repository to see it here.
            </p>
            <button onClick={() => navigate("/workspace/vercel/next.js/dashboard")} className="glow-cta inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground hover:brightness-110 transition shadow-lg">
              Analyze a Repository <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {history.map((repo, idx) => (
              <div 
                key={idx} 
                className="group relative flex flex-col bg-[#0a111a]/80 backdrop-blur-sm border border-border/50 rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-[0_0_25px_rgba(0,210,185,0.1)] cursor-pointer"
                onClick={() => navigate(`/workspace/${repo.owner}/${repo.name}/dashboard`)}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#020d1a] border border-primary/20 flex items-center justify-center">
                      <Github className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base tracking-tight group-hover:text-primary transition-colors line-clamp-1">{repo.name}</h3>
                      <p className="text-sm text-muted-foreground">{repo.owner}</p>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground/90 line-clamp-2 mb-6 flex-1 relative z-10">
                  {repo.description || "No description provided."}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-border/40 relative z-10">
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(repo.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                  <div className="text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                    View Report <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
