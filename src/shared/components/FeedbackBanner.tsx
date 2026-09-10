import { motion, AnimatePresence } from "framer-motion";
import type { ReactNode } from "react";

export function FeedbackBanner({
  status,
  message,
  detail,
  className = "",
}: {
  status: "correct" | "retry" | null;
  message: string;
  detail?: ReactNode;
  className?: string;
}) {
  return (
    <AnimatePresence>
      {status && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 420, damping: 28 }}
          className={`rounded-[16px] border px-5 py-4 shadow-soft ${
            status === "correct" ? "border-leaf/30 bg-leaf/10" : "border-sun/30 bg-sun/10"
          } ${className}`}
        >
          <p className="font-display text-lg font-bold text-ink">{message}</p>
          {detail && <p className="mt-1 font-body text-sm font-semibold text-ink-soft">{detail}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
