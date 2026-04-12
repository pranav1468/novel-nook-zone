import { useTrendingNovels } from "@/hooks/useNovels";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Eye, Star, BookOpen, ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Novel } from "@/hooks/useNovels";

function formatViews(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function TrendingCard({ novel, rank }: { novel: Novel; rank: number }) {
  const isTop3 = rank <= 3;

  return (
    <Link
      to={`/novel/${novel.id}`}
      className="group flex items-center gap-4 rounded-xl border border-border/40 bg-card p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
    >
      {/* Rank */}
      <div className="relative shrink-0">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold transition-colors ${
            isTop3
              ? "bg-primary/15 text-primary"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {rank}
        </span>
        {rank === 1 && (
          <Flame className="absolute -top-1.5 -right-1.5 h-4 w-4 text-primary animate-pulse" />
        )}
      </div>

      {/* Cover mini */}
      <div className="h-14 w-10 shrink-0 rounded-lg overflow-hidden bg-muted">
        {novel.cover_url ? (
          <img src={novel.cover_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <BookOpen className="h-3 w-3 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
          {novel.title}
        </h3>
        <p className="text-xs text-muted-foreground">{novel.author}</p>
        <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 text-primary/70" />
            {novel.rating.toFixed(1)}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {formatViews(novel.views)}
          </span>
          <span className="flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            {novel.chapter_count}
          </span>
        </div>
      </div>

      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1 shrink-0" />
    </Link>
  );
}

export default function TrendingImmersive() {
  const { data: novels, isLoading } = useTrendingNovels();

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-10"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2
                className="text-2xl md:text-3xl font-bold tracking-tight text-foreground"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Trending Now
              </h2>
              <p className="text-sm text-muted-foreground">🔥 Most-read this week</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/browse?sort=popular" className="gap-1 text-muted-foreground hover:text-primary">
              See All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-[88px] rounded-xl bg-muted animate-pulse" />
              ))
            : novels?.slice(0, 10).map((novel, i) => (
                <motion.div
                  key={novel.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <TrendingCard novel={novel} rank={i + 1} />
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
