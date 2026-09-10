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
      className={`rounded-[20px] border border-line ${tone === "paper" ? "bg-paper" : "bg-card"} p-5 shadow-soft ${className}`}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
