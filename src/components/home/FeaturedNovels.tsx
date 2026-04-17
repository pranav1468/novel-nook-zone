import { useFeaturedNovels } from "@/hooks/useNovels";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
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
  const hero = novels?.[0];
  const sidePicks = novels?.slice(1, 4) ?? [];

  return (
    <section className="relative py-24 glass-ambient">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Curated</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Editor's Picks
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Handpicked stories worth your time
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 lg:grid-cols-5">
          {/* Hero featured (large) */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-3"
          >
            {isLoading || !hero ? (
              <Skeleton className="h-[420px] w-full rounded-2xl" />
            ) : (
              <Link
                to={`/novel/${hero.id}`}
                className="group relative block h-[420px] w-full overflow-hidden rounded-2xl"
                style={{ background: coverGradient(hero.title) }}
              >
                {hero.cover_url && (
                  <img
                    src={hero.cover_url}
                    alt={hero.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}

                {/* Bottom-up gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Featured badge + rating top-left of content */}
                <div className="absolute inset-x-0 bottom-0 p-8">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary text-primary-foreground border-0 text-[11px] font-semibold uppercase tracking-wider px-3 py-1">
                      Featured
                    </Badge>
                    <span className="flex items-center gap-1 text-sm font-medium text-white/90">
                      <Star className="h-4 w-4" />
                      {hero.rating.toFixed(1)}
                    </span>
                  </div>

                  <h3 className="mt-4 font-serif text-3xl md:text-4xl font-bold text-white leading-tight">
                    {hero.title}
                  </h3>
                  <p className="mt-1 text-sm text-white/70">{hero.author}</p>
                  {hero.synopsis && (
                    <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 line-clamp-2">
                      {hero.synopsis}
                    </p>
                  )}
                </div>
              </Link>
            )}
          </motion.div>

          {/* Side picks list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-[124px] rounded-2xl" />
                ))
              : sidePicks.map((novel, i) => (
                  <motion.div
                    key={novel.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <Link
                      to={`/novel/${novel.id}`}
                      className="group flex gap-4 rounded-2xl glass glass-hover p-4 hover:-translate-y-0.5"
                    >
                      <div
                        className="h-[92px] w-[78px] shrink-0 overflow-hidden rounded-lg"
                        style={{ background: coverGradient(novel.title) }}
                      >
                        {novel.cover_url && (
                          <img
                            src={novel.cover_url}
                            alt={novel.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                        )}
                      </div>

                      <div className="flex flex-1 flex-col justify-between py-1 min-w-0">
                        <div>
                          <h3 className="font-bold text-foreground truncate group-hover:text-primary transition-colors">
                            {novel.title}
                          </h3>
                          <p className="mt-0.5 text-xs text-muted-foreground truncate">
                            {novel.author}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Star className="h-3 w-3" />
                            {novel.rating.toFixed(1)}
                          </span>
                          {novel.genre.slice(0, 1).map((g) => (
                            <Badge
                              key={g}
                              variant="secondary"
                              className="text-[10px] border-0 rounded-full"
                            >
                              {g}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
          </div>
        </div>
      </div>
    </section>
  );
}
