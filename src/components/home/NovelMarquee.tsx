import { motion } from "framer-motion";
import { useTrendingNovels } from "@/hooks/useNovels";
import { Link } from "react-router-dom";
import { useMemo } from "react";
import { Star } from "lucide-react";

export default function NovelMarquee() {
  const { data: novels } = useTrendingNovels();

  const items = useMemo(() => {
    if (!novels?.length) return [];
    return [...novels, ...novels, ...novels];
  }, [novels]);

  if (!items.length) return null;

  return (
    <section className="py-4 overflow-hidden border-y border-border/30 bg-muted/20">
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <motion.div
          className="flex gap-10 items-center whitespace-nowrap"
          animate={{ x: ["0%", "-33.33%"] }}
          transition={{
            x: { duration: 40, repeat: Infinity, ease: "linear" },
          }}
        >
          {items.map((novel, i) => (
            <Link
              key={`${novel.id}-${i}`}
              to={`/novel/${novel.id}`}
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <span className="flex items-center gap-1 text-[10px] text-primary/60">
                <Star className="h-2.5 w-2.5" />
                {novel.rating.toFixed(1)}
              </span>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                {novel.title}
              </span>
              <span className="text-xs text-muted-foreground/40">
                {novel.author}
              </span>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
