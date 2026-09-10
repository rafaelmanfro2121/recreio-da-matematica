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
    "relative inline-flex items-center justify-center gap-2 rounded-[20px] border-[3px] border-ink font-display font-bold text-ink shadow-pop transition-colors select-none disabled:opacity-50 disabled:pointer-events-none";

  const variantClass =
    variant === "solid"
      ? `${TONE_STYLES[tone]} text-ink`
      : variant === "outline"
        ? "bg-card"
        : "border-transparent shadow-none bg-transparent";

  return (
    <motion.button
      className={`${base} ${variantClass} ${SIZE_STYLES[size]} ${className}`}
      disabled={disabled}
      whileHover={disabled ? undefined : { y: -2 }}
      whileTap={disabled ? undefined : { y: 4, boxShadow: "0 2px 0 0 rgba(43,36,64,0.12)" }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      {...rest}
    >
      {children}
    </motion.button>
  );
}
