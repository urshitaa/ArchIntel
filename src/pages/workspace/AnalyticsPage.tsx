import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, GitBranch, ShieldCheck, MessageSquare } from "lucide-react";
import { Panel } from "@/components/workspace/Shared";
import { summaryStyles } from "@/components/workspace/data";
import { AskAI } from "@/components/workspace/AskAI";
import { SecurityInsights } from "@/components/workspace/SecurityInsights";

const summaryTabsList = [
  { id: "easy" as const, label: "Super Easy" },
  { id: "concise" as const, label: "Concise" },
  { id: "detailed" as const, label: "Detailed" },
  { id: "technical" as const, label: "Full Technical" },
];

export function AnalyticsPage() {
  const { analysisResult } = useOutletContext<any>() || {};

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
      <Panel title="Ask AI" icon={MessageSquare} className="lg:col-span-12" delay={0.1}>
        <div className="h-[300px]">
          <AskAI result={analysisResult} />
        </div>
      </Panel>

      <Panel title="AI Summary" icon={Sparkles} className="lg:col-span-6" delay={0.2}>
        <SummaryTabs result={analysisResult} />
      </Panel>

      <Panel title="Summary Comparison" icon={GitBranch} className="lg:col-span-6" delay={0.3}>
        <SummaryCompare result={analysisResult} />
      </Panel>

      <Panel title="Security Insights" icon={ShieldCheck} className="lg:col-span-12" delay={0.4}>
        <SecurityInsights result={analysisResult} />
      </Panel>
    </div>
  );
}

import { getGeminiModel } from "@/lib/gemini";

function SummaryTabs({ result }: { result?: any }) {
  const [tab, setTab] = useState<keyof typeof summaryStyles>("concise");
  const [summaries, setSummaries] = useState<Partial<Record<keyof typeof summaryStyles, string>>>({});
  const [loading, setLoading] = useState(false);

  const fetchSummary = async (selectedTab: keyof typeof summaryStyles) => {
    setTab(selectedTab);
    if (summaries[selectedTab]) return;

    if (!result) {
      setSummaries(prev => ({ ...prev, [selectedTab]: summaryStyles[selectedTab] }));
      return;
    }

    try {
      setLoading(true);
      const model = getGeminiModel();
      const stylePrompts = {
        easy: "Explain this repository to a 5-year old.",
        concise: "Provide a 1-sentence concise summary of this repository.",
        detailed: "Provide a detailed summary of this repository, including its tech stack.",
        technical: "Provide a full technical breakdown of this repository, including file structure and architecture."
      };

      const prompt = `You are an AI assistant. Analyze this repository metadata and answer the prompt.\nRepo: ${result?.repository?.name}\nDescription: ${result?.repository?.description}\nTech Stack: ${JSON.stringify(result?.tech_stack)}\nPrompt: ${stylePrompts[selectedTab]}`;

      const geminiResult = await model.generateContent(prompt);
      const text = geminiResult.response.text();
      setSummaries(prev => ({ ...prev, [selectedTab]: text }));
    } catch (e) {
      console.error("Gemini API error:", e);
      setSummaries(prev => ({ ...prev, [selectedTab]: summaryStyles[selectedTab] }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-1">
        {summaryTabsList.map((t) => (
          <button
            key={t.id}
            onClick={() => fetchSummary(t.id)}
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
        {loading && !summaries[tab] ? <span className="blink">▍ Generating...</span> : (summaries[tab] || summaryStyles[tab])}
      </motion.p>
    </div>
  );
}

function SummaryCompare({ result }: { result?: any }) {
  // To avoid spamming the API, we can either use the pre-generated ones, or just show a simplified version.
  // For demo purposes, we will fallback to the predefined summary styles for the comparison if not generated,
  // or you could generate all 4. Let's stick to the static ones or previously generated ones for the comparison view.
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
            <Sparkles className="h-2.5 w-2.5" /> {t.label}
          </div>
          <p className="text-[11.5px] leading-relaxed text-muted-foreground">{summaryStyles[t.id]}</p>
        </motion.div>
      ))}
    </div>
  );
}
