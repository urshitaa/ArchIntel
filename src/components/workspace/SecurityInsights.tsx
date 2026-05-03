// import { useState, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronDown, ShieldAlert, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
// import { getGeminiModel } from "@/lib/gemini";

// type Severity = "critical" | "high" | "med" | "low";

// interface Finding {
//   id: string;
//   title: string;
//   pkg: string;
//   sev: Severity;
//   detail: string;
// }

// const sevStyle: Record<Severity, string> = {
//   critical: "bg-red-500/15 text-red-400 border-red-500/40",
//   high: "bg-orange-500/15 text-orange-300 border-orange-500/40",
//   med: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40",
//   low: "bg-primary/10 text-primary border-primary/30",
// };

// export function SecurityInsights({ result }: { result?: any }) {
//   const [open, setOpen] = useState<string | null>(null);
//   const [findings, setFindings] = useState<Finding[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [score, setScore] = useState(100);

//   useEffect(() => {
//     if (!result) return;

//     const fetchInsights = async () => {
//       setLoading(true);
//       try {
//         const model = getGeminiModel();
//         const prompt = `You are a security AI. Analyze the repository metadata and return a JSON array of 3-4 potential security insights or areas of concern. 
// Each object must have: 
// - "id" (unique string)
// - "title" (short title)
// - "pkg" (relevant package or area)
// - "sev" (one of: "critical", "high", "med", "low")
// - "detail" (1-2 sentences explanation)

// Repo: \${result?.repository?.name}
// Description: \${result?.repository?.description}
// Tech Stack: \${JSON.stringify(result?.tech_stack)}

// Output ONLY a valid JSON array of objects, without markdown blocks.'; 

//         const geminiResult = await model.generateContent(prompt);
//         const text = geminiResult.response.text();
//         const jsonStr = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
//         const parsed: Finding[] = JSON.parse(jsonStr);
//         setFindings(parsed);

//         let newScore = 100;
//         parsed.forEach(f => {
//           if (f.sev === "critical") newScore -= 15;
//           else if (f.sev === "high") newScore -= 10;
//           else if (f.sev === "med") newScore -= 5;
//           else if (f.sev === "low") newScore -= 2;
//         });
//         setScore(Math.max(0, newScore));
//         if (parsed.length > 0) setOpen(parsed[0].id);
//       } catch (e) {
//         console.error("Gemini API error for security insights:", e);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchInsights();
//   }, [result]);

//   if (loading) {
//     return (
//       <div className="flex h-40 items-center justify-center text-muted-foreground text-sm gap-2">
//         <Loader2 className="h-4 w-4 animate-spin" />
//         Analyzing security insights...
//       </div>
//     );
//   }

//   if (!findings.length && !loading) {
//     return (
//       <div className="flex h-40 items-center justify-center text-muted-foreground text-sm">
//         No security insights available.
//       </div>
//     );
//   }

//   return (
//     <div>
//       <div className="mb-3 flex items-center gap-3 rounded-lg border border-border/60 bg-surface/50 p-2.5">
//         <div className="relative h-12 w-12 shrink-0">
//           <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
//             <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
//             <motion.circle
//               cx="18"
//               cy="18"
//               r="15"
//               fill="none"
//               stroke="hsl(var(--primary))"
//               strokeWidth="3"
//               strokeLinecap="round"
//               strokeDasharray={`${(score / 100) * 94.2
//       } 94.2`}
//               initial={{ strokeDasharray: "0 94.2" }}
//               animate={{ strokeDasharray: `${ (score / 100) * 94.2 } 94.2` }}
//               transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
//             />
//           </svg>
//           <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-semibold">
//             {score}
//           </div>
//         </div>
//         <div className="min-w-0">
//           <div className="text-[12px] font-medium text-foreground">Security score</div>
//           <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
//             <ShieldCheck className="h-3 w-3 text-primary" /> 4 findings · 1 critical
//           </div>
//         </div>
//       </div>

//       <ul className="space-y-1.5">
//         {findings.map((f) => {
//           const isOpen = open === f.id;
//           return (
//             <li
//               key={f.id}
//               className="overflow-hidden rounded-lg border border-border/60 bg-surface/40"
//             >
//               <button
//                 onClick={() => setOpen(isOpen ? null : f.id)}
//                 className="flex w-full items-center gap-2 px-2.5 py-2 text-left"
//               >
//                 <span
//                   className={`shrink - 0 rounded border px - 1.5 py - 0.5 font - mono text - [9px] uppercase tracking - wider ${ sevStyle[f.sev] } `}
//                 >
//                   {f.sev}
//                 </span>
//                 {f.sev === "critical" ? (
//                   <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-red-400" />
//                 ) : (
//                   <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
//                 )}
//                 <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
//                   {f.title}
//                 </span>
//                 <ChevronDown
//                   className={`h - 3.5 w - 3.5 text - muted - foreground transition - transform ${ isOpen ? "rotate-180" : "" } `}
//                 />
//               </button>
//               <AnimatePresence initial={false}>
//                 {isOpen && (
//                   <motion.div
//                     initial={{ height: 0, opacity: 0 }}
//                     animate={{ height: "auto", opacity: 1 }}
//                     exit={{ height: 0, opacity: 0 }}
//                     transition={{ duration: 0.2 }}
//                     className="border-t border-border/60 bg-background/30 px-3 py-2 text-[11.5px] leading-relaxed text-muted-foreground"
//                   >
//                     <div className="mb-1 font-mono text-[10px] text-primary">{f.pkg}</div>
//                     {f.detail}
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </li>
//           );
//         })}
//       </ul>
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ShieldAlert, ShieldCheck, AlertTriangle, Loader2 } from "lucide-react";
import { getGeminiModel } from "@/lib/gemini";

type Severity = "critical" | "high" | "med" | "low";

interface Finding {
  id: string;
  title: string;
  pkg: string;
  sev: Severity;
  detail: string;
}

const sevStyle: Record<Severity, string> = {
  critical: "bg-red-500/15 text-red-400 border-red-500/40",
  high: "bg-orange-500/15 text-orange-300 border-orange-500/40",
  med: "bg-yellow-500/15 text-yellow-300 border-yellow-500/40",
  low: "bg-primary/10 text-primary border-primary/30",
};

export function SecurityInsights({ result }: { result?: any }) {
  const [open, setOpen] = useState<string | null>(null);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(100);

  useEffect(() => {
    if (!result) return;

    const fetchInsights = async () => {
      setLoading(true);
      try {
        const model = getGeminiModel();
        // Fix 1: Broken template literal — mismatched backtick/quote and escaped $ signs
        const prompt = `You are a security AI. Analyze the repository metadata and return a JSON array of 3-4 potential security insights or areas of concern. 
Each object must have: 
- "id" (unique string)
- "title" (short title)
- "pkg" (relevant package or area)
- "sev" (one of: "critical", "high", "med", "low")
- "detail" (1-2 sentences explanation)

Repo: ${result?.repository?.name}
Description: ${result?.repository?.description}
Tech Stack: ${JSON.stringify(result?.tech_stack)}

Output ONLY a valid JSON array of objects, without markdown blocks.`;

        const geminiResult = await model.generateContent(prompt);
        const text = geminiResult.response.text();
        const jsonStr = text.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed: Finding[] = JSON.parse(jsonStr);
        setFindings(parsed);

        let newScore = 100;
        parsed.forEach(f => {
          if (f.sev === "critical") newScore -= 15;
          else if (f.sev === "high") newScore -= 10;
          else if (f.sev === "med") newScore -= 5;
          else if (f.sev === "low") newScore -= 2;
        });
        setScore(Math.max(0, newScore));
        if (parsed.length > 0) setOpen(parsed[0].id);
      } catch (e) {
        console.error("Gemini API error for security insights:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [result]);

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground text-sm gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Analyzing security insights...
      </div>
    );
  }

  if (!findings.length && !loading) {
    return (
      <div className="flex h-40 items-center justify-center text-muted-foreground text-sm">
        No security insights available.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-3 flex items-center gap-3 rounded-lg border border-border/60 bg-surface/50 p-2.5">
        <div className="relative h-12 w-12 shrink-0">
          <svg viewBox="0 0 36 36" className="h-12 w-12 -rotate-90">
            <circle cx="18" cy="18" r="15" fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
            <motion.circle
              cx="18"
              cy="18"
              r="15"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeLinecap="round"
              // Fix 2: Broken template literal with extra spaces around braces
              strokeDasharray={`${(score / 100) * 94.2} 94.2`}
              initial={{ strokeDasharray: "0 94.2" }}
              animate={{ strokeDasharray: `${(score / 100) * 94.2} 94.2` }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-mono text-[11px] font-semibold">
            {score}
          </div>
        </div>
        <div className="min-w-0">
          <div className="text-[12px] font-medium text-foreground">Security score</div>
          <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3 w-3 text-primary" /> 4 findings · 1 critical
          </div>
        </div>
      </div>

      <ul className="space-y-1.5">
        {findings.map((f) => {
          const isOpen = open === f.id;
          return (
            <li
              key={f.id}
              className="overflow-hidden rounded-lg border border-border/60 bg-surface/40"
            >
              <button
                onClick={() => setOpen(isOpen ? null : f.id)}
                className="flex w-full items-center gap-2 px-2.5 py-2 text-left"
              >
                {/* Fix 3: Broken className template literal with spaces around hyphens */}
                <span
                  className={`shrink-0 rounded border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${sevStyle[f.sev]}`}
                >
                  {f.sev}
                </span>
                {f.sev === "critical" ? (
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0 text-red-400" />
                ) : (
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                )}
                <span className="min-w-0 flex-1 truncate text-[12px] text-foreground">
                  {f.title}
                </span>
                {/* Fix 4: Same broken className template literal with spaces around hyphens */}
                <ChevronDown
                  className={`h-3.5 w-3.5 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-border/60 bg-background/30 px-3 py-2 text-[11.5px] leading-relaxed text-muted-foreground"
                  >
                    <div className="mb-1 font-mono text-[10px] text-primary">{f.pkg}</div>
                    {f.detail}
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ul>
    </div>
  );
}