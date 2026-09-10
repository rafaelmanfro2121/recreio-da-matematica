import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Tone = "add" | "subtract" | "multiply" | "divide" | "math" | "logic" | "quick" | "ink" | "sun";

const TONE_STYLES: Record<Tone, string> = {
  add: "bg-op-add",
  subtract: "bg-op-subtract",
  multiply: "bg-op-multiply",
  divide: "bg-op-divide",
  math: "bg-world-math",
  logic: "bg-world-logic",
  quick: "bg-world-quick",
  ink: "bg-ink",
  sun: "bg-sun",
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
      ? `${TONE_STYLES[tone]} text-white shadow-soft`
      : variant === "outline"
        ? "border border-line bg-card text-ink shadow-soft"
        : "text-ink-soft";

  return (
    <motion.button
      className={`${base} ${variantClass} ${SIZE_STYLES[size]} ${className}`}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -1, filter: "brightness(1.05)" }}
      whileTap={disabled ? undefined : { y: 1, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
