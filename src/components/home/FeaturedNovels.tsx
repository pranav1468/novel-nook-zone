import { useFeaturedNovels } from "@/hooks/useNovels";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Star, ArrowRight } from "lucide-react";
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
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Editor's Picks</h2>
          <p className="mt-1 text-sm text-muted-foreground">Handpicked stories worth your time</p>
        </motion.div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))
            : novels?.slice(0, 4).map((novel, i) => (
                <motion.div
                  key={novel.id}
                  initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    to={`/novel/${novel.id}`}
                    className="group flex gap-5 rounded-xl border border-border/60 bg-card p-5 transition-[box-shadow] duration-200 hover:shadow-lg hover:shadow-primary/5"
                  >
                    <div
                      className="h-36 w-24 shrink-0 rounded-lg"
                      style={{ background: coverGradient(novel.title) }}
                    >
                      <div className="flex h-full items-end p-2">
                        <p
                          className="text-[10px] font-bold uppercase tracking-wider text-white/80"
                          style={{ textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}
                        >
                          {novel.title}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col justify-between py-0.5">
                      <div>
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {novel.title}
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground">{novel.author}</p>
                        <p className="mt-2 text-sm leading-relaxed text-muted-foreground line-clamp-2">
                          {novel.synopsis}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 text-primary/70" />
                          {novel.rating.toFixed(1)}
                        </span>
                        {novel.genre.slice(0, 2).map((g) => (
                          <Badge
                            key={g}
                            variant="secondary"
                            className="text-[10px] border-0"
                          >
                            {g}
                          </Badge>
                        ))}
                        <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
        </div>
      </div>
    </section>
  );
}
