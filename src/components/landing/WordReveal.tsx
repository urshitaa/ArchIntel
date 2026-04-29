import { motion } from "framer-motion";
import { type ReactNode } from "react";

type Props = {
  text: string;
  className?: string;
  delay?: number;
  highlight?: string; // word(s) to render with text-gradient
  as?: "h1" | "h2" | "h3" | "p";
  trailing?: ReactNode;
};

export const WordReveal = ({ text, className = "", delay = 0, highlight, as = "h1", trailing }: Props) => {
  const words = text.split(" ");
  const Tag = motion[as] as any;
  return (
    <Tag
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.055, delayChildren: delay } },
      }}
    >
      {words.map((w, i) => {
        const isHi = highlight && highlight.split(" ").includes(w.replace(/[.,]/g, ""));
        return (
          <span key={i} className="inline-block overflow-hidden align-baseline pb-[0.12em]">
            <motion.span
              className={`inline-block ${isHi ? "text-gradient" : ""}`}
              variants={{
                hidden: { y: "100%", opacity: 0, filter: "blur(8px)" },
                visible: {
                  y: "0%",
                  opacity: 1,
                  filter: "blur(0px)",
                  transition: { type: "spring", damping: 22, stiffness: 180, mass: 0.8 },
                },
              }}
            >
              {w}
            </motion.span>
            {i < words.length - 1 && <span>&nbsp;</span>}
          </span>
        );
      })}
      {trailing}
    </Tag>
  );
};