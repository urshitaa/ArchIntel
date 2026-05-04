import { useState } from "react";
import { NavLink, Outlet, useLocation, useParams } from "react-router-dom";
import {
  LayoutDashboard,
  Presentation,
  BarChart3,
  Users,
  Layers,
  Settings,
  User,
  ChevronRight,
  Zap,
  Sparkles,
  Bot,
  Share2,
  Box,
  MessageSquare
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";

const SIDEBAR_NAV = [
  { label: "Dashboard", href: "dashboard", icon: LayoutDashboard },
  { label: "File Structure", href: "overview", icon: Presentation },
  { label: "Ask AI", href: "analytics", icon: Bot },
  { label: "Dependencies (Graphs)", href: "dependencies", icon: Users },
  { label: "Architecture", href: "architecture", icon: Layers },
  { label: "Tech Stack", href: "tech-stack", icon: Box },
  { label: "Contributors", href: "contributors", icon: User },
  { label: "Export", href: "settings", icon: Share2 },
  { label: "Feedback", href: "feedback", icon: MessageSquare },
];

export function SidebarLayout() {
  const { user } = useAuth();
  const { owner, repo } = useParams();
  const location = useLocation();
  const [analysisResult, setAnalysisResult] = useState<any>(location.state?.analysisResult || null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen bg-[#0b1121] text-foreground font-sans">
      <Navbar showLogo={true} onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col border-r border-white/5 bg-[#0b1121] pt-6 transform transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="md:hidden absolute top-4 right-4">
            <button onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto mt-8 md:mt-0">
            {SIDEBAR_NAV.map((item) => {
              const path = `/workspace/${item.href}`;
              const isActive = location.pathname === path;

              return (
                <NavLink
                  key={item.href}
                  to={path}
                  onClick={() => setSidebarOpen(false)}
                  state={{ analysisResult }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                    ? "bg-[#112a2e] text-[#2dd4bf]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                    }`}
                >
                  <item.icon className={`h-4 w-4 ${isActive ? "text-[#2dd4bf]" : "text-slate-400"}`} />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          {/* Bottom Section */}
          <div className="p-4">
            <div className="flex items-center justify-between px-2 py-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group mb-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#112a2e] text-[#2dd4bf] border border-[#2dd4bf]/20 flex items-center justify-center font-semibold text-sm">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <div className="text-sm font-medium text-slate-200">{user?.name || "urshi"}</div>
                  <div className="text-[11px] text-slate-400">Free Plan</div>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-slate-300 transition-colors" />
            </div>

            <div className="rounded-xl border border-white/10 bg-[#0f172a] p-4 text-sm relative overflow-hidden">
              <div className="relative z-10">
                <div className="font-semibold text-white mb-1.5">Upgrade Plan</div>
                <p className="text-slate-400 text-xs mb-4 leading-relaxed">
                  Unlock advanced insights and unlimited reports.
                </p>
                <button className="w-full flex items-center justify-center gap-1.5 rounded-md bg-[#2dd4bf] py-2 text-xs font-semibold text-slate-900 shadow-[0_0_15px_rgba(45,212,191,0.2)] hover:bg-[#20b2aa] transition-colors">
                  <a href="/pricing" className="w-full">
                    <Zap className="h-3 w-3" /> Upgrade
                  </a>
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-6xl mx-auto p-6 md:p-8">
              <Outlet context={{ analysisResult, setAnalysisResult, owner, repo }} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
