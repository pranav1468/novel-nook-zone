import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Zap } from "lucide-react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useTrendingNovels } from "@/hooks/useNovels";
import { useState, useEffect, useMemo, useCallback } from "react";

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

function AmbientGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Dot grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] aspect-square"
        style={{
          background: `radial-gradient(ellipse at center, hsl(var(--primary) / 0.06) 0%, transparent 60%)`,
        }}
      />
      {/* Animated orbs */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 300 + i * 100,
            height: 300 + i * 100,
            left: `${20 + i * 25}%`,
            top: `${10 + i * 20}%`,
            background: `radial-gradient(circle, hsl(var(--primary) / ${0.04 + i * 0.02}) 0%, transparent 70%)`,
          }}
          animate={{
            y: [0, -20 - i * 10, 0],
            x: [0, 10 + i * 5, 0],
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 12 + i * 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function FloatingCards({ novels }: { novels: { id: string; title: string; cover_url: string | null; rating: number }[] }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    mouseX.set((e.clientX - left - width / 2) / width);
    mouseY.set((e.clientY - top - height / 2) / height);
  }, [mouseX, mouseY]);

  const cards = useMemo(() => novels.slice(0, 5), [novels]);

  const positions = useMemo(
    () => [
      { x: "58%", y: "8%", rotate: -6, scale: 0.85, delay: 0 },
      { x: "72%", y: "22%", rotate: 4, scale: 1, delay: 0.1 },
      { x: "55%", y: "42%", rotate: -3, scale: 0.9, delay: 0.2 },
      { x: "78%", y: "52%", rotate: 7, scale: 0.8, delay: 0.3 },
      { x: "62%", y: "68%", rotate: -5, scale: 0.75, delay: 0.4 },
    ],
    []
  );

  if (!cards.length) return null;

  return (
    <div className="absolute inset-0 hidden lg:block" onMouseMove={handleMouseMove}>
      {cards.map((novel, i) => {
        const pos = positions[i];
        return (
          <FloatingCard
            key={novel.id}
            novel={novel}
            pos={pos}
            mouseX={mouseX}
            mouseY={mouseY}
            index={i}
          />
        );
      })}
    </div>
  );
}

function FloatingCard({
  novel,
  pos,
  mouseX,
  mouseY,
  index,
}: {
  novel: { id: string; title: string; cover_url: string | null; rating: number };
  pos: { x: string; y: string; rotate: number; scale: number; delay: number };
  mouseX: any;
  mouseY: any;
  index: number;
}) {
  const springConfig = { stiffness: 50, damping: 20 };
  const parallaxX = useSpring(useTransform(mouseX, [-0.5, 0.5], [-15 * (index + 1), 15 * (index + 1)]), springConfig);
  const parallaxY = useSpring(useTransform(mouseY, [-0.5, 0.5], [-10 * (index + 1), 10 * (index + 1)]), springConfig);

  const hash = novel.title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [24, 200, 160, 280, 340];
  const hue = hues[hash % hues.length];

  return (
    <motion.div
      className="absolute"
      style={{
        left: pos.x,
        top: pos.y,
        x: parallaxX,
        y: parallaxY,
      }}
      initial={{ opacity: 0, scale: 0.5, y: 40 }}
      animate={{
        opacity: 1,
        scale: pos.scale,
        y: 0,
        rotate: pos.rotate,
      }}
      transition={{
        duration: 0.8,
        delay: 0.4 + pos.delay,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <motion.div
        className="w-[100px] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shadow-black/20 border border-border/30 backdrop-blur-sm"
        style={{
          background: novel.cover_url
            ? undefined
            : `linear-gradient(135deg, hsl(${hue}, 45%, 28%) 0%, hsl(${(hue + 40) % 360}, 35%, 18%) 100%)`,
        }}
        whileHover={{ scale: 1.1, rotate: 0, zIndex: 50 }}
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          y: {
            duration: 4 + index,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
      >
        {novel.cover_url ? (
          <img src={novel.cover_url} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="flex h-full items-end p-2">
            <span className="text-[8px] font-bold uppercase text-white/70">{novel.title}</span>
          </div>
        )}
        {/* Glass overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </motion.div>
    </motion.div>
  );
}

function LiveIndicator() {
  return (
    <motion.div
      className="flex items-center gap-2 rounded-full border border-border/60 bg-card/80 backdrop-blur-md px-4 py-1.5"
      initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
      </span>
      <span className="text-xs font-medium text-muted-foreground">
        <Zap className="inline h-3 w-3 text-primary mr-1" />
        Updated live · Thousands of stories
      </span>
    </motion.div>
  );
}

export default function HeroSection() {
  const { data: novels } = useTrendingNovels();
  const hasNovels = novels && novels.length > 0;

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      <AmbientGrid />

      {hasNovels && <FloatingCards novels={novels} />}

      <div className="relative mx-auto max-w-7xl px-6 w-full py-20">
        <div className="max-w-2xl space-y-6">
          <LiveIndicator />

          <motion.h1
            className="text-4xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl"
            style={{ textWrap: "balance" } as any}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-foreground">Read Stories That</span>
            <br />
            <RotatingText />
          </motion.h1>

          <motion.p
            className="max-w-md text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ textWrap: "pretty" } as any}
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            A living library of web novels across fantasy, sci-fi, romance, and more.
            Community-driven. Updated daily. Always free.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 pt-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/browse">
              <Button size="lg" className="gap-2 active:scale-[0.97] transition-transform shadow-lg shadow-primary/20 h-12 px-7">
                Explore Library
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="active:scale-[0.97] transition-transform backdrop-blur-sm bg-card/50 h-12 px-7">
                Create Account
              </Button>
            </Link>
          </motion.div>

          {/* Trust signal */}
          <motion.div
            className="flex items-center gap-4 pt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="flex -space-x-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center"
                >
                  <BookOpen className="h-3 w-3 text-muted-foreground" />
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">1,000+</span> readers joined this week
            </p>
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
