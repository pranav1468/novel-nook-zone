import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrendingNovels } from "@/hooks/useNovels";
import { useState, useEffect, useMemo } from "react";

function coverGradient(title: string): string {
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [24, 200, 160, 280, 340, 45, 120, 310, 220, 60];
  const hue = hues[hash % hues.length];
  return `linear-gradient(135deg, hsl(${hue}, 45%, 28%) 0%, hsl(${(hue + 40) % 360}, 35%, 18%) 100%)`;
}

const ROTATING_WORDS = ["Move You", "Inspire You", "Thrill You", "Change You", "Captivate You"];

function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="relative inline-block h-[1.15em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={ROTATING_WORDS[index]}
          className="gradient-text inline-block"
          initial={{ y: 40, opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// Floating geometric shapes for visual interest
function FloatingShapes() {
  const shapes = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        size: 40 + Math.random() * 80,
        x: 50 + Math.random() * 50,
        y: 10 + Math.random() * 80,
        duration: 15 + Math.random() * 20,
        delay: Math.random() * 5,
        opacity: 0.03 + Math.random() * 0.05,
        hue: [24, 200, 270, 340, 160][i % 5],
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            width: s.size,
            height: s.size,
            left: `${s.x}%`,
            top: `${s.y}%`,
            background: `radial-gradient(circle, hsl(${s.hue} 70% 50% / ${s.opacity + 0.1}) 0%, hsl(${s.hue} 70% 50% / 0) 70%)`,
          }}
          animate={{
            y: [0, -30, 0, 20, 0],
            x: [0, 15, -10, 5, 0],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function CoverMosaic({ novels }: { novels: { title: string; cover_url: string | null }[] }) {
  const columns = useMemo(() => {
    if (!novels.length) return [];
    const cols: typeof novels[] = Array.from({ length: 5 }, () => []);
    for (let c = 0; c < 5; c++) {
      const offset = c * 2;
      const items: typeof novels = [];
      for (let i = 0; i < 6; i++) {
        items.push(novels[(offset + i) % novels.length]);
      }
      cols[c] = [...items, ...items];
    }
    return cols;
  }, [novels]);

  if (!columns.length) return null;

  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="flex gap-3 h-full justify-center px-4" style={{ minWidth: "100%" }}>
        {columns.map((col, ci) => (
          <div
            key={ci}
            className={`flex flex-col gap-3 w-[120px] md:w-[140px] shrink-0 ${ci % 2 === 0 ? "mosaic-column" : "mosaic-column-reverse"}`}
            style={{ animationDuration: `${25 + ci * 5}s` }}
          >
            {col.map((novel, ni) => (
              <div
                key={`${ci}-${ni}`}
                className="w-full aspect-[2/3] rounded-lg overflow-hidden shrink-0 relative"
                style={{ background: coverGradient(novel.title) }}
              >
                {novel.cover_url && (
                  <img src={novel.cover_url} alt="" className="h-full w-full object-cover" loading="lazy" />
                )}
                <div className="absolute inset-0 flex items-end p-2">
                  <span className="text-[9px] font-bold uppercase text-white/70 line-clamp-2" style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>
                    {novel.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-background" />
    </div>
  );
}

export default function HeroSection() {
  const { data: novels } = useTrendingNovels();
  const hasNovels = novels && novels.length > 0;

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center">
      {/* Animated background */}
      {hasNovels ? <CoverMosaic novels={novels} /> : <FloatingShapes />}

      {/* Always show floating shapes on top for extra depth */}
      {hasNovels && <FloatingShapes />}

      <div className="relative mx-auto max-w-7xl px-6 w-full">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 backdrop-blur-sm px-4 py-1.5 text-xs font-medium text-muted-foreground animate-pulse-glow">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Discover your next obsession
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl"
            style={{ textWrap: "balance" }}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-foreground">Read Stories That</span>
            <br />
            <RotatingText />
          </motion.h1>

          <motion.p
            className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ textWrap: "pretty" }}
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            Thousands of web novels across fantasy, sci-fi, romance, and more.
            Updated daily. Always free to read.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-wrap gap-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/browse">
              <Button size="lg" className="gap-2 active:scale-[0.97] transition-transform shadow-lg shadow-primary/20">
                Explore Library
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="active:scale-[0.97] transition-transform backdrop-blur-sm bg-card/50">
                Create Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
