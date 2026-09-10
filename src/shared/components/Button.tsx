import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Tone = "add" | "subtract" | "multiply" | "divide" | "math" | "logic" | "quick" | "ink" | "sun";

const TONE_GRADIENT: Record<Tone, string> = {
  add: "bg-gradient-to-br from-op-add-light to-op-add",
  subtract: "bg-gradient-to-br from-op-subtract-light to-op-subtract",
  multiply: "bg-gradient-to-br from-op-multiply-light to-op-multiply",
  divide: "bg-gradient-to-br from-op-divide-light to-op-divide",
  math: "bg-gradient-to-br from-world-math-light to-world-math",
  logic: "bg-gradient-to-br from-world-logic-light to-world-logic",
  quick: "bg-gradient-to-br from-world-quick-light to-world-quick",
  ink: "bg-gradient-to-br from-ink-soft to-ink",
  sun: "bg-gradient-to-br from-sun to-sun",
};

const SIZE_STYLES = {
  md: "px-5 py-3 text-base",
  lg: "px-7 py-4 text-lg",
  sm: "px-3.5 py-2 text-sm",
};

export function Button({
  tone = "math",
  variant = "solid",
  size = "md",
  children,
  className = "",
  disabled,
  ...rest
}: {
  tone?: Tone;
  variant?: "solid" | "outline" | "ghost";
  size?: keyof typeof SIZE_STYLES;
  children: ReactNode;
  className?: string;
} & HTMLMotionProps<"button">) {
  const base =
    "relative inline-flex items-center justify-center gap-2 rounded-[14px] font-display font-bold transition-colors select-none disabled:opacity-50 disabled:pointer-events-none";

  const variantClass =
    variant === "solid"
      ? `${TONE_GRADIENT[tone]} text-white shadow-soft`
      : variant === "outline"
        ? "border border-line bg-card text-ink shadow-soft"
        : "text-ink-soft";

  return (
    <motion.button
      className={`${base} ${variantClass} ${SIZE_STYLES[size]} ${className}`}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1, filter: "brightness(1.06)" }}
      whileTap={disabled ? undefined : { y: 1, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
