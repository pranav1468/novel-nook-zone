import { useFeaturedNovels } from "@/hooks/useNovels";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight, BookOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

function coverGradient(title: string): string {
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [24, 200, 160, 280, 340, 45, 120, 310, 220, 60];
  const hue = hues[hash % hues.length];
  return `linear-gradient(135deg, hsl(${hue}, 45%, 28%) 0%, hsl(${(hue + 40) % 360}, 35%, 18%) 100%)`;
}

export default function FeaturedNovels() {
  const { data: novels, isLoading } = useFeaturedNovels();

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[60%] h-[60%]"
          style={{
            background: `radial-gradient(ellipse at top right, hsl(var(--primary) / 0.04) 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-10"
        >
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Curated</span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground">Editor's Picks</h2>
            <p className="mt-1 text-sm text-muted-foreground">Handpicked stories worth your time</p>
          </div>
        </motion.div>

        {/* Asymmetric layout: large card left + stacked right */}
        <div className="grid gap-6 lg:grid-cols-5">
          {isLoading ? (
            <>
              <Skeleton className="lg:col-span-3 h-[360px] rounded-2xl" />
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-[170px] rounded-2xl" />
                <Skeleton className="h-[170px] rounded-2xl" />
              </div>
            </>
          ) : (
            <>
              {/* Hero card */}
              {novels?.[0] && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="lg:col-span-3"
                >
                  <Link
                    to={`/novel/${novels[0].id}`}
                    className="group relative flex flex-col justify-end h-[360px] rounded-2xl overflow-hidden border border-border/30"
                  >
                    <div
                      className="absolute inset-0"
                      style={{ background: coverGradient(novels[0].title) }}
                    >
                      {novels[0].cover_url && (
                        <img src={novels[0].cover_url} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    <div className="relative p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className="bg-primary/90 text-primary-foreground border-0 text-xs">Featured</Badge>
                        <span className="flex items-center gap-1 text-xs text-white/70">
                          <Star className="h-3 w-3" />
                          {novels[0].rating.toFixed(1)}
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-primary-foreground transition-colors">{novels[0].title}</h3>
                      <p className="mt-1 text-sm text-white/70">{novels[0].author}</p>
                      <p className="mt-2 text-sm text-white/60 line-clamp-2">{novels[0].synopsis}</p>
                    </div>
                  </Link>
                </motion.div>
              )}

              {/* Side stacked cards */}
              <div className="lg:col-span-2 flex flex-col gap-4">
                {novels?.slice(1, 4).map((novel, i) => (
                  <motion.div
                    key={novel.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Link
                      to={`/novel/${novel.id}`}
                      className="group flex gap-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30"
                    >
                      <div
                        className="h-24 w-16 shrink-0 rounded-xl overflow-hidden"
                        style={{ background: coverGradient(novel.title) }}
                      >
                        {novel.cover_url ? (
                          <img src={novel.cover_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                        ) : (
                          <div className="flex h-full items-end p-1.5">
                            <p className="text-[8px] font-bold uppercase text-white/70">{novel.title}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col justify-between min-w-0 py-0.5">
                        <div>
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm truncate">{novel.title}</h3>
                          <p className="text-xs text-muted-foreground">{novel.author}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3 text-primary/70" />
                            {novel.rating.toFixed(1)}
                          </span>
                          {novel.genre.slice(0, 1).map((g) => (
                            <Badge key={g} variant="secondary" className="text-[10px] border-0">{g}</Badge>
                          ))}
                          <ArrowRight className="ml-auto h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
