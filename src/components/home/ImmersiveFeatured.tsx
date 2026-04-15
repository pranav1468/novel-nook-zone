import { useFeaturedNovels } from "@/hooks/useNovels";
import { Link } from "react-router-dom";
import { Star, ArrowRight, BookOpen, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { useState } from "react";

function coverGradient(title: string): string {
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [24, 200, 160, 280, 340, 45, 120, 310, 220, 60];
  const hue = hues[hash % hues.length];
  return `linear-gradient(135deg, hsl(${hue}, 45%, 22%) 0%, hsl(${(hue + 40) % 360}, 30%, 12%) 100%)`;
}

function formatViews(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

export default function ImmersiveFeatured() {
  const { data: novels, isLoading } = useFeaturedNovels();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <Skeleton className="h-8 w-48 mb-8" />
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!novels?.length) return null;

  const hero = novels[0];
  const rest = novels.slice(1, 5);

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary/70 font-medium">
            Curated Selection
          </span>
          <h2
            className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Editor's Picks
          </h2>
        </motion.div>

        {/* Hero featured novel — full width immersive card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <Link
            to={`/novel/${hero.id}`}
            className="group relative block rounded-3xl overflow-hidden h-[320px] md:h-[400px] mb-8"
            style={{ background: coverGradient(hero.title) }}
          >
            {hero.cover_url && (
              <img
                src={hero.cover_url}
                alt={hero.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            )}
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
              <Badge className="w-fit mb-3 bg-primary/20 text-primary border-primary/30 backdrop-blur-sm">
                Featured
              </Badge>
              <h3
                className="text-2xl md:text-4xl font-bold text-white mb-2"
                style={{ fontFamily: "'Georgia', serif" }}
              >
                {hero.title}
              </h3>
              <p className="text-sm text-white/70 mb-1">by {hero.author}</p>
              <p className="text-sm text-white/60 max-w-lg line-clamp-2 mb-4">
                {hero.synopsis}
              </p>
              <div className="flex items-center gap-4 text-xs text-white/60">
                <span className="flex items-center gap-1">
                  <Star className="h-3.5 w-3.5 text-primary" /> {hero.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" /> {formatViews(hero.views)}
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-3.5 w-3.5" /> {hero.chapter_count} chapters
                </span>
              </div>
            </div>

            {/* Hover glow border */}
            <div className="absolute inset-0 rounded-3xl border border-primary/0 group-hover:border-primary/20 transition-colors duration-500" />
          </Link>
        </motion.div>

        {/* Rest — layered asymmetric cards */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {rest.map((novel, i) => (
            <motion.div
              key={novel.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/novel/${novel.id}`}
                className="group relative block rounded-2xl overflow-hidden aspect-[3/4] border border-border/20 hover:border-primary/20 transition-all duration-500"
                style={{ background: coverGradient(novel.title) }}
                onMouseEnter={() => setHoveredId(novel.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {novel.cover_url && (
                  <img
                    src={novel.cover_url}
                    alt={novel.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-4">
                  <h3 className="text-sm font-bold text-white line-clamp-1" style={{ fontFamily: "'Georgia', serif" }}>
                    {novel.title}
                  </h3>
                  <p className="text-[11px] text-white/60 mt-0.5">{novel.author}</p>

                  {/* Reveal on hover */}
                  <motion.div
                    className="overflow-hidden"
                    initial={false}
                    animate={{ height: hoveredId === novel.id ? "auto" : 0, opacity: hoveredId === novel.id ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-[11px] text-white/50 line-clamp-2 mt-2">{novel.synopsis}</p>
                    <div className="flex items-center gap-3 mt-2 text-[10px] text-white/50">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-primary" /> {novel.rating.toFixed(1)}
                      </span>
                      {novel.genre.slice(0, 2).map((g) => (
                        <span key={g} className="rounded-full bg-white/10 px-2 py-0.5">{g}</span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Hover glow */}
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: "radial-gradient(circle at 50% 80%, hsl(24 80% 52% / 0.15) 0%, transparent 50%)",
                  }}
                  initial={false}
                  animate={{ opacity: hoveredId === novel.id ? 1 : 0 }}
                  transition={{ duration: 0.4 }}
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
