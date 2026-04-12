import { useFeaturedNovels } from "@/hooks/useNovels";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Star, BookOpen, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useMemo } from "react";
import type { Novel } from "@/hooks/useNovels";

function getHue(genres: string[]) {
  const map: Record<string, number> = { Fantasy: 270, Romance: 340, Action: 24, Horror: 0, "Sci-Fi": 200, Comedy: 45, Drama: 160, Adventure: 30 };
  for (const g of genres) if (map[g] !== undefined) return map[g];
  return 24;
}

export default function FeaturedShowcase() {
  const { data: novels, isLoading } = useFeaturedNovels();
  const [activeIdx, setActiveIdx] = useState(0);

  const showcaseNovels = useMemo(() => novels?.slice(0, 4) || [], [novels]);
  const active = showcaseNovels[activeIdx];
  const hue = active ? getHue(active.genre) : 24;

  useEffect(() => {
    if (showcaseNovels.length <= 1) return;
    const t = setInterval(() => setActiveIdx((i) => (i + 1) % showcaseNovels.length), 8000);
    return () => clearInterval(t);
  }, [showcaseNovels.length]);

  if (isLoading || !showcaseNovels.length) return null;

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background themed to active novel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active?.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 100% 60% at 50% 50%, hsl(${hue} 40% 15% / 0.4) 0%, transparent 70%),
                linear-gradient(180deg, hsl(var(--background)) 0%, hsl(${hue} 20% 8% / 0.3) 50%, hsl(var(--background)) 100%)
              `,
            }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-xs font-medium tracking-[0.2em] uppercase text-primary">
            ✦ Featured Story ✦
          </span>
          <h2
            className="mt-2 text-3xl md:text-4xl font-bold text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Dive Deep
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-center">
          {/* Left: Novel details */}
          <AnimatePresence mode="wait">
            {active && (
              <motion.div
                key={active.id}
                className="space-y-6"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Genre badges */}
                <div className="flex flex-wrap gap-2">
                  {active.genre.map((g) => (
                    <span
                      key={g}
                      className="rounded-full border px-3 py-1 text-xs font-medium"
                      style={{
                        borderColor: `hsl(${hue} 50% 50% / 0.3)`,
                        color: `hsl(${hue} 60% 60%)`,
                        background: `hsl(${hue} 50% 50% / 0.08)`,
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>

                <h3
                  className="text-3xl md:text-5xl font-bold text-foreground leading-[1.1]"
                  style={{ fontFamily: "'Playfair Display', serif", textWrap: "balance" } as React.CSSProperties}
                >
                  {active.title}
                </h3>

                <p className="text-sm text-muted-foreground">by {active.author}</p>

                <p className="text-base leading-relaxed text-muted-foreground/80 max-w-lg" style={{ textWrap: "pretty" } as React.CSSProperties}>
                  {active.synopsis || "An extraordinary tale that will captivate your imagination from the very first chapter."}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Star className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-foreground">{active.rating.toFixed(1)}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {active.chapter_count} chapters
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    <span className="capitalize">{active.status}</span>
                  </span>
                </div>

                {/* CTA */}
                <div className="flex gap-3 pt-2">
                  <Link to={`/novel/${active.id}/chapter/1`}>
                    <Button size="lg" className="gap-2 active:scale-[0.97] transition-transform shadow-lg shadow-primary/20">
                      <BookOpen className="h-4 w-4" />
                      Begin Journey
                    </Button>
                  </Link>
                  <Link to={`/novel/${active.id}`}>
                    <Button variant="outline" size="lg" className="gap-2 active:scale-[0.97]">
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right: Cover + selector */}
          <div className="flex flex-col items-center gap-6">
            <AnimatePresence mode="wait">
              {active && (
                <motion.div
                  key={active.id}
                  initial={{ opacity: 0, y: 20, rotateY: -10 }}
                  animate={{ opacity: 1, y: 0, rotateY: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                  style={{ perspective: "1000px" }}
                >
                  <div
                    className="absolute -inset-8 rounded-3xl blur-2xl"
                    style={{ background: `hsl(${hue} 50% 40% / 0.2)` }}
                  />
                  <div
                    className="relative w-[260px] md:w-[300px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/5"
                    style={{
                      background: `linear-gradient(135deg, hsl(${hue} 45% 28%), hsl(${(hue + 40) % 360} 35% 18%))`,
                    }}
                  >
                    {active.cover_url ? (
                      <img src={active.cover_url} alt={active.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-end p-6">
                        <p className="text-lg font-bold text-white/80" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {active.title}
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Novel selector */}
            <div className="flex gap-3">
              {showcaseNovels.map((novel, i) => (
                <button
                  key={novel.id}
                  onClick={() => setActiveIdx(i)}
                  className="transition-all duration-300 rounded-lg overflow-hidden border-2"
                  style={{
                    borderColor: i === activeIdx ? `hsl(${hue} 60% 50%)` : "transparent",
                    opacity: i === activeIdx ? 1 : 0.5,
                    transform: i === activeIdx ? "scale(1.05)" : "scale(1)",
                  }}
                >
                  <div
                    className="w-12 h-16 bg-muted"
                    style={{
                      background: `linear-gradient(135deg, hsl(${getHue(novel.genre)} 45% 28%), hsl(${(getHue(novel.genre) + 40) % 360} 35% 18%))`,
                    }}
                  >
                    {novel.cover_url && (
                      <img src={novel.cover_url} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
