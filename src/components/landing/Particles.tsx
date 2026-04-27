import { useMemo } from "react";

export const Particles = ({ count = 24 }: { count?: number }) => {
  const dots = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 14,
        size: 1 + Math.random() * 2.5,
        opacity: 0.25 + Math.random() * 0.5,
      })),
    [count]
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: `${d.left}%`,
            bottom: `-10%`,
            width: d.size,
            height: d.size,
            opacity: d.opacity,
            filter: "blur(0.5px)",
            boxShadow: "0 0 8px hsl(var(--primary))",
            animation: `float-up ${d.duration}s linear ${d.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
};
