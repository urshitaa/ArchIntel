import React from "react";
import { motion } from "framer-motion";
import { CountUp } from "@/components/landing/CountUp";

export const cardBase =
  "glass relative rounded-2xl p-4 transition-shadow duration-300 hover:shadow-[0_0_0_1px_hsl(var(--primary)/0.35),var(--shadow-elevated)]";

export function Panel({
  title,
  icon: Icon,
  className = "",
  delay = 0,
  children,
  action,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  className?: string;
  delay?: number;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
      className={`${cardBase} ${className}`}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-primary">
          <Icon className="h-3 w-3" />
          {title}
        </div>
        {action}
      </div>
      {children}
    </motion.div>
  );
}

export function SmallBtn({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group inline-flex items-center gap-1 rounded-md border border-border bg-surface px-2 py-1 text-[10.5px] text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground hover:shadow-[0_0_12px_hsl(var(--primary)/0.25)]"
    >
      <Icon className="h-3 w-3" />
      {label}
    </button>
  );
}

export function Stat({
  icon: Icon,
  label,
  value,
  suffix,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  suffix?: string;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-surface/50 px-2.5 py-2">
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-2.5 w-2.5" />
        {label}
      </div>
      <div className="mt-0.5 font-mono text-base font-semibold">
        {typeof value === "number" ? <CountUp to={value} suffix={suffix} /> : <span>{value}{suffix}</span>}
      </div>
    </div>
  );
}

export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      {children}
    </span>
  );
}

export function KV({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md border border-border/60 bg-surface/50 p-2">
      <div className="text-[9.5px] uppercase tracking-wider text-muted-foreground">{k}</div>
      <div className="mt-0.5 truncate font-mono text-[11px] text-foreground">{v}</div>
    </div>
  );
}
