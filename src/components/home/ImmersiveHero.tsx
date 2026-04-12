import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFeaturedNovels, useTrendingNovels } from "@/hooks/useNovels";
import { useState, useEffect, useMemo, useCallback } from "react";
import type { Novel } from "@/hooks/useNovels";

function getGenreMood(genres: string[]): { label: string; color: string; hue: number } {
  const map: Record<string, { label: string; color: string; hue: number }> = {
    Fantasy: { label: "Magical", color: "hsl(270 70% 60%)", hue: 270 },
    Romance: { label: "Emotional", color: "hsl(340 70% 60%)", hue: 340 },
    Action: { label: "Intense", color: "hsl(24 80% 55%)", hue: 24 },
    Horror: { label: "Dark", color: "hsl(0 60% 40%)", hue: 0 },
    "Sci-Fi": { label: "Futuristic", color: "hsl(200 70% 55%)", hue: 200 },
    Comedy: { label: "Lighthearted", color: "hsl(45 80% 55%)", hue: 45 },
    Drama: { label: "Deep", color: "hsl(160 50% 45%)", hue: 160 },
    Adventure: { label: "Epic", color: "hsl(30 70% 50%)", hue: 30 },
    Mystery: { label: "Suspenseful", color: "hsl(260 40% 50%)", hue: 260 },
    Thriller: { label: "Gripping", color: "hsl(0 0% 45%)", hue: 0 },
  };
  for (const g of genres) {
    if (map[g]) return map[g];
  }
  return { label: "Captivating", color: "hsl(24 80% 55%)", hue: 24 };
}

function Particles({ hue }: { hue: number }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 8 + Math.random() * 12,
        size: 1 + Math.random() * 3,
        opacity: 0.2 + Math.random() * 0.4,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            bottom: "-10px",
            width: p.size,
            height: p.size,
            background: `hsl(${hue} 70% 60% / ${p.opacity})`,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function HeroNovelSlide({ novel, isActive }: { novel: Novel; isActive: boolean }) {
  const mood = getGenreMood(novel.genre);

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          key={novel.id}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {/* Dynamic background */}
          <div
            className="absolute inset-0 ambient-bg"
            style={{
              background: `
                radial-gradient(ellipse 80% 50% at 70% 60%, hsl(${mood.hue} 50% 20% / 0.4) 0%, transparent 70%),
                radial-gradient(ellipse 60% 40% at 20% 80%, hsl(${(mood.hue + 60) % 360} 40% 15% / 0.3) 0%, transparent 60%),
                linear-gradient(135deg, hsl(225 30% 8%) 0%, hsl(225 20% 4%) 100%)
              `,
            }}
          />

          {/* Cover image as subtle BG */}
          {novel.cover_url && (
            <div className="absolute inset-0">
              <img
                src={novel.cover_url}
                alt=""
                className="h-full w-full object-cover opacity-[0.08]"
                style={{ filter: "blur(40px) saturate(1.5)" }}
              />
            </div>
          )}

          {/* Fog layers */}
          <div className="fog-layer" />
          <div className="fog-layer" style={{ animationDelay: "-7s", animationDuration: "25s" }} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function ImmersiveHero() {
  const { data: featured } = useFeaturedNovels();
  const { data: trending } = useTrendingNovels();

  const showcaseNovels = useMemo(() => {
    const novels = featured?.length ? featured : trending;
    return novels?.slice(0, 5) || [];
  }, [featured, trending]);

  const [activeIdx, setActiveIdx] = useState(0);
  const activeNovel = showcaseNovels[activeIdx];

  useEffect(() => {
    if (showcaseNovels.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIdx((i) => (i + 1) % showcaseNovels.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [showcaseNovels.length]);

  const mood = activeNovel ? getGenreMood(activeNovel.genre) : { label: "Captivating", color: "hsl(24 80% 55%)", hue: 24 };

  return (
    <section className="hero-immersive relative overflow-hidden min-h-[100vh] flex items-center">
      {/* Animated backgrounds */}
      {showcaseNovels.map((novel, i) => (
        <HeroNovelSlide key={novel.id} novel={novel} isActive={i === activeIdx} />
      ))}

      {/* Particles */}
      <Particles hue={mood.hue} />

      {/* Cinematic gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(225_30%_6%)] via-transparent to-[hsl(225_30%_6%/0.5)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[hsl(225_30%_6%/0.8)] via-transparent to-transparent" />

      {/* Content */}
      <div className="relative mx-auto max-w-7xl px-6 w-full py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div className="space-y-8">
            {/* Mood indicator */}
            <motion.div
              key={mood.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-3 glass-panel rounded-full px-5 py-2"
            >
              <span
                className="mood-dot h-2 w-2 rounded-full"
                style={{ background: mood.color }}
              />
              <span className="text-xs font-medium tracking-wider uppercase" style={{ color: mood.color }}>
                {mood.label}
              </span>
              {activeNovel && (
                <>
                  <span className="h-3 w-px bg-white/20" />
                  <span className="text-xs text-white/50">
                    {activeNovel.genre.slice(0, 2).join(" · ")}
                  </span>
                </>
              )}
            </motion.div>

            <AnimatePresence mode="wait">
              {activeNovel && (
                <motion.div
                  key={activeNovel.id}
                  initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h1
                    className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white"
                    style={{ fontFamily: "'Playfair Display', serif", textWrap: "balance" } as React.CSSProperties}
                  >
                    {activeNovel.title}
                  </h1>
                  <p className="mt-2 text-sm text-white/40 font-medium">by {activeNovel.author}</p>
                  <p
                    className="mt-5 max-w-md text-base leading-relaxed text-white/60 line-clamp-3"
                    style={{ textWrap: "pretty" } as React.CSSProperties}
                  >
                    {activeNovel.synopsis || "A captivating story awaits. Dive into a world of imagination and adventure."}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTA */}
            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Link to={activeNovel ? `/novel/${activeNovel.id}/chapter/1` : "/browse"}>
                <Button
                  size="lg"
                  className="gap-2 text-base px-8 py-6 bg-white text-black hover:bg-white/90 active:scale-[0.97] transition-all shadow-2xl shadow-white/10"
                >
                  <BookOpen className="h-5 w-5" />
                  Start Reading
                </Button>
              </Link>
              <Link to="/browse">
                <Button
                  variant="outline"
                  size="lg"
                  className="gap-2 text-base px-8 py-6 border-white/20 text-white hover:bg-white/10 active:scale-[0.97] transition-all backdrop-blur-sm"
                >
                  <Compass className="h-5 w-5" />
                  Explore Worlds
                </Button>
              </Link>
            </motion.div>
          </div>

          {/* Right: Featured cover with depth */}
          <div className="hidden lg:flex justify-center">
            <AnimatePresence mode="wait">
              {activeNovel && (
                <motion.div
                  key={activeNovel.id}
                  initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                  animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                  exit={{ opacity: 0, scale: 0.95, rotateY: 10 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="relative"
                  style={{ perspective: "1200px" }}
                >
                  {/* Glow behind cover */}
                  <div
                    className="absolute -inset-12 rounded-3xl blur-3xl"
                    style={{ background: `hsl(${mood.hue} 60% 40% / 0.25)` }}
                  />

                  {/* Cover */}
                  <div
                    className="relative w-[280px] aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, hsl(${mood.hue} 45% 28%) 0%, hsl(${(mood.hue + 40) % 360} 35% 18%) 100%)`,
                    }}
                  >
                    {activeNovel.cover_url ? (
                      <img
                        src={activeNovel.cover_url}
                        alt={activeNovel.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-end p-6">
                        <p className="text-lg font-bold text-white/80" style={{ fontFamily: "'Playfair Display', serif" }}>
                          {activeNovel.title}
                        </p>
                      </div>
                    )}

                    {/* Cinematic overlay on cover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Stats floating card */}
                  <motion.div
                    className="absolute -bottom-4 -right-8 glass-panel rounded-xl px-5 py-3 space-y-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="flex items-center gap-4 text-xs text-white/70">
                      <span className="flex items-center gap-1">
                        ⭐ {activeNovel.rating.toFixed(1)}
                      </span>
                      <span>{activeNovel.chapter_count} chapters</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {activeNovel.genre.slice(0, 3).map((g) => (
                        <span key={g} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-white/60">
                          {g}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Slide indicators */}
        {showcaseNovels.length > 1 && (
          <motion.div
            className="flex items-center gap-2 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {showcaseNovels.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                className="relative h-1 rounded-full transition-all duration-500 overflow-hidden"
                style={{
                  width: i === activeIdx ? 48 : 16,
                  background: i === activeIdx ? "transparent" : "hsl(0 0% 100% / 0.2)",
                }}
              >
                {i === activeIdx && (
                  <>
                    <div className="absolute inset-0 bg-white/20 rounded-full" />
                    <motion.div
                      className="absolute inset-0 rounded-full origin-left"
                      style={{ background: mood.color }}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 6, ease: "linear" }}
                      key={`progress-${activeIdx}`}
                    />
                  </>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
