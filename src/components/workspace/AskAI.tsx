import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User } from "lucide-react";
import { answerFor } from "./data";

type Msg = { role: "user" | "ai"; text: string; streaming?: boolean };

const suggestions = [
  "How does auth work?",
  "Where are API routes?",
  "How is state managed?",
  "Explain the build process.",
];

export function AskAI() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi! Ask me anything about this repository." },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const ask = (q: string) => {
    if (!q.trim() || streaming) return;
    const full = answerFor(q);
    setMsgs((m) => [...m, { role: "user", text: q }, { role: "ai", text: "", streaming: true }]);
    setInput("");
    setStreaming(true);
    let i = 0;
    const tick = () => {
      i += 3;
      setMsgs((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "ai", text: full.slice(0, i), streaming: i < full.length };
        return copy;
      });
      if (i < full.length) setTimeout(tick, 18);
      else setStreaming(false);
    };
    setTimeout(tick, 250);
  };

  return (
    <div className="flex h-full flex-col">
      <div className="-mx-1 flex-1 space-y-2 overflow-y-auto px-1">
        <AnimatePresence initial={false}>
          {msgs.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2 ${m.role === "user" ? "justify-end" : ""}`}
            >
              {m.role === "ai" && (
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/15 text-primary">
                  <Sparkles className="h-3 w-3" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg px-2.5 py-1.5 text-[12px] leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary/15 text-foreground"
                    : "border border-border/60 bg-surface/60 text-muted-foreground"
                }`}
              >
                {m.text}
                {m.streaming && <span className="blink ml-0.5">▍</span>}
              </div>
              {m.role === "user" && (
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-2">
                  <User className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={endRef} />
      </div>

      {msgs.length <= 1 && (
        <div className="my-2 flex flex-wrap gap-1">
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => ask(s)}
              className="rounded-md border border-border bg-surface px-2 py-0.5 text-[10px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
        className="mt-2 flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2 py-1.5 transition-shadow focus-within:shadow-[0_0_0_3px_hsl(var(--primary)/0.15)]"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask anything about this repo..."
          className="w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground/70"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          className="rounded-md bg-primary px-2 py-1 text-primary-foreground disabled:opacity-50"
        >
          <Send className="h-3 w-3" />
        </button>
      </form>
    </div>
  );
}