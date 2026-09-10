import { motion } from "framer-motion";

export function Ticks({ total, current, className = "" }: { total: number; current: number; className?: string }) {
  return (
    <div className={`flex items-center gap-1.5 ${className}`} role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < current;
        return (
          <motion.span
            key={i}
            className={`h-2.5 flex-1 rounded-full border border-line ${filled ? "bg-leaf" : "bg-card"}`}
            initial={false}
            animate={{ scale: filled ? 1 : 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          />
        );
      })}
    </div>
  );
}
