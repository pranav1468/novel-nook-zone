import { motion } from "framer-motion";
import { ReactNode } from "react";

interface ChapterRevealProps {
  children: ReactNode;
  chapter?: string;
  className?: string;
  delay?: number;
}

/**
 * Wraps any section in a scroll-triggered "chapter reveal" animation
 * with optional chapter label and page-turn effect.
 */
export default function ChapterReveal({
  children,
  chapter,
  className = "",
  delay = 0,
}: ChapterRevealProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 60, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {chapter && (
        <motion.div
          className="mb-2 flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: delay + 0.2 }}
        >
          <div className="h-px flex-1 max-w-[40px] bg-primary/30" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-primary/50 font-medium">
            {chapter}
          </span>
          <div className="h-px flex-1 max-w-[40px] bg-primary/30" />
        </motion.div>
      )}
      {children}
    </motion.div>
  );
}
