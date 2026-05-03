import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, GitBranch, ShieldCheck, MessageSquare } from "lucide-react";
import { Panel } from "@/components/workspace/Shared";
import { summaryStyles } from "@/components/workspace/data";
import { AskAI } from "@/components/workspace/AskAI";
import { SecurityInsights } from "@/components/workspace/SecurityInsights";
// import { useEffect } from "react";
import { getGeminiModel } from "@/lib/gemini";

const summaryTabsList = [
  { id: "easy" as const, label: "Super Easy" },
  { id: "concise" as const, label: "Concise" },
  { id: "detailed" as const, label: "Detailed" },
  { id: "technical" as const, label: "Full Technical" },
];

export function AnalyticsPage() {
  const { analysisResult } = useOutletContext<any>() || {};
  const [summaries, setSummaries] = useState<Partial<Record<keyof typeof summaryStyles, string>>>({});
  const [loadingStates, setLoadingStates] = useState<Partial<Record<keyof typeof summaryStyles, boolean>>>({});

  const fetchSummary = async (selectedTab: keyof typeof summaryStyles) => {
    if (summaries[selectedTab] || loadingStates[selectedTab] || !analysisResult) return;

    try {
      setLoadingStates(prev => ({ ...prev, [selectedTab]: true }));
      const model = getGeminiModel();
      const stylePrompts = {
        easy: "Explain this repository to a 5-year old.",
        concise: "Provide a 1-sentence concise summary of this repository.",
        detailed: "Provide a detailed summary of this repository, including its tech stack.",
        technical: "Provide a full technical breakdown of this repository, including file structure and architecture."
      };

      const prompt = `You are an AI assistant. Analyze this repository metadata and answer the prompt.\nRepo: ${analysisResult?.repository?.name}\nDescription: ${analysisResult?.repository?.description}\nTech Stack: ${JSON.stringify(analysisResult?.tech_stack)}\nPrompt: ${stylePrompts[selectedTab]}`;

      const geminiResult = await model.generateContent(prompt);
      const text = geminiResult.response.text();
      setSummaries(prev => ({ ...prev, [selectedTab]: text }));
    } catch (e) {
      console.error("Gemini API error:", e);
      // Fallback to placeholder on error
      setSummaries(prev => ({ ...prev, [selectedTab]: summaryStyles[selectedTab] }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [selectedTab]: false }));
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Panel title="Ask AI" icon={MessageSquare} className="lg:col-span-12" delay={0.1}>
        <div className="h-[300px]">
          <AskAI result={analysisResult} />
        </div>
      </Panel>

      <Panel title="AI Summary" icon={Sparkles} className="lg:col-span-6" delay={0.2}>
        <SummaryTabs
          result={analysisResult}
          summaries={summaries}
          loadingStates={loadingStates}
          onFetch={fetchSummary}
        />
      </Panel>

      <Panel title="Summary Comparison" icon={GitBranch} className="lg:col-span-6" delay={0.3}>
        <SummaryCompare
          result={analysisResult}
          summaries={summaries}
          loadingStates={loadingStates}
          onFetch={fetchSummary}
        />
      </Panel>

      <Panel title="Security Insights" icon={ShieldCheck} className="lg:col-span-12" delay={0.4}>
        <SecurityInsights result={analysisResult} />
      </Panel>
    </div>
  );
}

function SummaryTabs({ result, summaries, loadingStates, onFetch }: { result?: any; summaries: any; loadingStates: any; onFetch: (id: string) => void }) {
  const [tab, setTab] = useState<keyof typeof summaryStyles>("concise");

  // Fetch summary automatically when tab changes or component mounts

  // useEffect(() => {
  //   if (result && !summaries[tab] && !loadingStates[tab]) {
  //     onFetch(tab);
  //   }
  // }, [tab, result, summaries, loadingStates, onFetch]);

  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {summaryTabsList.map((t) => (
          <button
            key={t.id}
            // onClick={() => setTab(t.id)}
            onClick={() => {
              setTab(t.id);

              if (!summaries[t.id] && !loadingStates[t.id]) {
                onFetch(t.id);
              }
            }}
            className={`relative rounded-md px-2.5 py-1 text-[11px] transition-colors ${tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
          >
            {tab === t.id && (
              <motion.span
                layoutId="summary-pill"
                className="absolute inset-0 rounded-md bg-primary/15"
                transition={{ type: "spring", stiffness: 380, damping: 28 }}
              />
            )}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
      <motion.p
        key={tab}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="mt-3 rounded-md border border-border/60 bg-surface/50 p-3 text-[12.5px] leading-relaxed text-muted-foreground min-h-[80px]"
      >
        {loadingStates[tab] ? <span className="blink">▍ Generating AI Summary...</span> : (summaries[tab] || "No summary available. Analyze a repository first.")}
      </motion.p>
    </div>
  );
}

// function SummaryCompare({ result, summaries, loadingStates, onFetch }: { result?: any; summaries: any; loadingStates: any; onFetch: (id: string) => void }) {
//   // useEffect(() => {
//   //   if (result) {
//   //     summaryTabsList.forEach((t) => {
//   //       if (!summaries[t.id] && !loadingStates[t.id]) {
//   //         onFetch(t.id);
//   //       }
//   //     });
//   //   }
//   // }, [result, summaries, loadingStates, onFetch]);
//   useEffect(() => {
//     if (result) {
//       summaryTabsList.forEach((t) => {
//         if (!summaries[t.id] && !loadingStates[t.id]) {
//           onFetch(t.id);
//         }
//       });
//     }
//   }, [result, summaries, loadingStates, onFetch]);
//   return (
//     <div className="space-y-2">
//       {summaryTabsList.map((t, i) => (
//         <motion.div
//           key={t.id}
//           initial={{ opacity: 0, x: -6 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: i * 0.06 }}
//           className="rounded-md border border-border/60 bg-surface/50 p-2.5"
//         >
//           <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary">
//             <Sparkles className="h-2.5 w-2.5" /> {t.label}
//           </div>
//           <p className="text-[11.5px] leading-relaxed text-muted-foreground">
//             {loadingStates[t.id] ? "Generating..." : (summaries[t.id] || "No summary available.")}
//           </p>
//         </motion.div>
//       ))}
//     </div>
//   );
// }

function SummaryCompare({
  result,
  summaries,
  loadingStates,
  onFetch
}: {
  result?: any;
  summaries: any;
  loadingStates: any;
  onFetch: (id: string) => void;
}) {
  return (
    <div className="space-y-2">
      {summaryTabsList.map((t, i) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="rounded-md border border-border/60 bg-surface/50 p-2.5"
        >
          <div className="mb-1 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-primary">
            <Sparkles className="h-2.5 w-2.5" />
            {t.label}
          </div>

          <p className="text-[11.5px] leading-relaxed text-muted-foreground">
            {loadingStates[t.id]
              ? "Generating..."
              : (summaries[t.id] || "Click a tab to generate summary.")}
          </p>
        </motion.div>
      ))}
    </div>
  );
}