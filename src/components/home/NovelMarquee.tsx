import { motion } from "framer-motion";
import { useTrendingNovels } from "@/hooks/useNovels";
import { Link } from "react-router-dom";
import { useMemo } from "react";

export default function NovelMarquee() {
  const { data: novels } = useTrendingNovels();

  const items = useMemo(() => {
    if (!novels?.length) return [];
    // Duplicate for seamless loop
    return [...novels, ...novels, ...novels];
  }, [novels]);

  if (!items.length) return null;

  return (
    <section className="py-6 overflow-hidden border-y border-border/40">
      <div className="relative">
        {/* Left/right fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-8 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            x: { duration: 30, repeat: Infinity, ease: "linear" },
          }}
        >
          {items.map((novel, i) => (
            <Link
              key={`${novel.id}-${i}`}
              to={`/novel/${novel.id}`}
              className="flex items-center gap-3 shrink-0 group"
            >
              <span className="h-2 w-2 rounded-full bg-primary/40 group-hover:bg-primary transition-colors shrink-0" />
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {novel.title}
              </span>
              <span className="text-xs text-muted-foreground/50">
                {novel.author}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
