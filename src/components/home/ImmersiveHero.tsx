import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useTrendingNovels } from "@/hooks/useNovels";
import { useState, useEffect, useMemo, useCallback, useRef } from "react";

const ROTATING_WORDS = ["Move You", "Inspire You", "Thrill You", "Change You", "Captivate You"];

function coverGradient(title: string): string {
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [24, 200, 160, 280, 340, 45, 120, 310, 220, 60];
  const hue = hues[hash % hues.length];
  return `linear-gradient(135deg, hsl(${hue}, 45%, 28%) 0%, hsl(${(hue + 40) % 360}, 35%, 18%) 100%)`;
}

/* ── Floating particles ── */
function ParticleField() {
  const particles = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 4,
        duration: 10 + Math.random() * 20,
        delay: Math.random() * 8,
        hue: [24, 35, 200, 270, 340][i % 5],
        opacity: 0.15 + Math.random() * 0.35,
      })),
    []
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: `hsl(${p.hue} 80% 65%)`,
            opacity: p.opacity,
            filter: `blur(${p.size > 4 ? 1 : 0}px)`,
          }}
          animate={{
            y: [0, -60, -20, -80, 0],
            x: [0, 20, -15, 10, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity * 0.5, p.opacity * 1.2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* ── Floating book covers ── */
function FloatingCovers({ novels }: { novels: { title: string; cover_url: string | null }[] }) {
  const covers = useMemo(() => {
    if (!novels.length) return [];
    return novels.slice(0, 6).map((n, i) => ({
      ...n,
      x: 55 + (i % 3) * 15 + Math.random() * 5,
      y: 10 + Math.floor(i / 3) * 35 + Math.random() * 10,
      rotation: -8 + Math.random() * 16,
      scale: 0.7 + Math.random() * 0.3,
      delay: i * 0.4,
      floatDuration: 6 + Math.random() * 4,
    }));
  }, [novels]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {covers.map((cover, i) => (
        <motion.div
          key={i}
          className="absolute w-[100px] md:w-[120px] aspect-[2/3] rounded-lg overflow-hidden shadow-2xl shadow-black/30"
          style={{
            left: `${cover.x}%`,
            top: `${cover.y}%`,
            rotate: cover.rotation,
            scale: cover.scale,
            background: coverGradient(cover.title),
          }}
          initial={{ opacity: 0, y: 40, scale: 0.6 }}
          animate={{
            opacity: [0, 0.6, 0.6, 0.6],
            y: [40, 0, -10, 0],
            scale: [0.6, cover.scale, cover.scale * 1.03, cover.scale],
          }}
          transition={{
            duration: cover.floatDuration,
            delay: cover.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {cover.cover_url ? (
            <img src={cover.cover_url} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="h-full w-full flex items-end p-2">
              <span className="text-[8px] font-bold uppercase text-white/60">{cover.title}</span>
            </div>
          )}
          {/* Soft glow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/5" />
        </motion.div>
      ))}
    </div>
  );
}

/* ── Rotating headline text ── */
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
          className="inline-block bg-clip-text text-transparent"
          style={{
            backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(24 90% 70%), hsl(var(--primary)))",
          }}
          initial={{ y: 40, opacity: 0, filter: "blur(6px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: -40, opacity: 0, filter: "blur(6px)" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/* ── Main Hero ── */
export default function ImmersiveHero() {
  const { data: novels } = useTrendingNovels();
  const heroRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });
  const bgX = useTransform(smoothX, [0, 1], [-15, 15]);
  const bgY = useTransform(smoothY, [0, 1], [-10, 10]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      mouseX.set((e.clientX - rect.left) / rect.width);
      mouseY.set((e.clientY - rect.top) / rect.height);
    },
    [mouseX, mouseY]
  );

  return (
    <section
      ref={heroRef}
      className="relative overflow-hidden min-h-[100vh] flex items-center"
      onMouseMove={handleMouseMove}
    >
      {/* Ambient gradient background with parallax */}
      <motion.div
        className="absolute inset-0"
        style={{
          x: bgX,
          y: bgY,
          background:
            "radial-gradient(ellipse 80% 60% at 30% 50%, hsl(24 60% 12% / 0.8) 0%, transparent 70%), " +
            "radial-gradient(ellipse 60% 50% at 70% 30%, hsl(270 40% 10% / 0.5) 0%, transparent 60%), " +
            "radial-gradient(ellipse 50% 40% at 50% 80%, hsl(200 40% 8% / 0.4) 0%, transparent 60%), " +
            "hsl(var(--background))",
        }}
      />

      {/* Soft vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,hsl(var(--background))_100%)]" />

      {/* Particles */}
      <ParticleField />

      {/* Floating book covers */}
      {novels && novels.length > 0 && <FloatingCovers novels={novels} />}

      {/* Ambient glow orbs */}
      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          left: "20%",
          top: "30%",
          background: "radial-gradient(circle, hsl(24 80% 52% / 0.06) 0%, transparent 70%)",
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 w-full py-20">
        <div className="max-w-2xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-md px-5 py-2 text-xs font-medium text-primary animate-pulse-glow">
              <BookOpen className="h-3.5 w-3.5" />
              Enter the world of stories
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="text-5xl font-bold leading-[1.08] tracking-tight md:text-7xl lg:text-8xl"
            style={{ textWrap: "balance", fontFamily: "'Georgia', serif" }}
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-foreground">Stories That</span>
            <br />
            <RotatingText />
          </motion.h1>

          {/* Subtext */}
          <motion.p
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg"
            style={{ textWrap: "pretty" }}
            initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            Immerse yourself in thousands of web novels across fantasy, sci-fi, romance and beyond.
            Every chapter is a new journey.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="mt-10 flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/browse">
              <Button
                size="lg"
                className="gap-2 text-base px-8 py-6 rounded-xl active:scale-[0.97] transition-all shadow-xl shadow-primary/25 hover:shadow-primary/40"
              >
                Begin Your Journey
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 rounded-xl active:scale-[0.97] transition-all backdrop-blur-md bg-card/20 border-border/40 hover:bg-card/40"
              >
                Join the Community
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground/50">Scroll to explore</span>
        <motion.div
          className="w-5 h-8 rounded-full border border-muted-foreground/20 flex items-start justify-center p-1"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1 h-2 rounded-full bg-primary/50"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
