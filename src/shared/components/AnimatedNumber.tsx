import { useEffect, useRef } from "react";
import { animate } from "framer-motion";

export function AnimatedNumber({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(0, value, {
      duration: 1,
      ease: "easeOut",
      onUpdate(v) {
        node.textContent = Math.round(v).toString();
      },
    });
    return () => controls.stop();
  }, [value]);

  return (
    <span ref={ref} className={className}>
      0
    </span>
  );
}
