import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

export function Card({
  children,
  className = "",
  tone,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  tone?: "card" | "paper";
} & HTMLMotionProps<"div">) {
  return (
    <motion.div
      className={`rounded-3xl border-[3px] border-ink ${tone === "paper" ? "bg-paper" : "bg-card"} p-5 shadow-pop ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
