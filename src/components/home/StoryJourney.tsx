import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Search, BookOpen, Sparkles, Heart, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Explore",
    subtitle: "Discover Your Next Obsession",
    description: "Browse thousands of novels across every genre. Our AI learns what moves you.",
    hue: 200,
  },
  {
    icon: BookOpen,
    title: "Read",
    subtitle: "Dive Into the Story",
    description: "Seamless chapter-by-chapter reading with progress sync across all devices.",
    hue: 24,
  },
  {
    icon: Sparkles,
    title: "Immerse",
    subtitle: "Feel Every Chapter",
    description: "Experience stories that adapt to your mood with atmospheric themes and audio.",
    hue: 270,
  },
  {
    icon: Heart,
    title: "Connect",
    subtitle: "Join the Community",
    description: "Vote, review, discuss. Shape what gets translated and published next.",
    hue: 340,
  },
];

export default function StoryJourney() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.8", "end 0.3"],
  });

  // Progress line grows as user scrolls
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative py-32 overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 50%, hsl(24 60% 8% / 0.4) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl px-6">
        {/* Section header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary/70 font-medium">
            Your Reading Journey
          </span>
          <h2
            className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Every Story Is an Adventure
          </h2>
          <p className="mt-4 text-muted-foreground max-w-md mx-auto">
            From discovery to deep immersion — experience reading like never before.
          </p>
        </motion.div>

        {/* Journey steps with connecting line */}
        <div className="relative">
          {/* Vertical progress line (desktop) */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 hidden md:block">
            <div className="h-full w-full bg-border/30" />
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary via-primary to-primary/30"
              style={{ height: lineHeight }}
            />
          </div>

          <div className="space-y-24 md:space-y-32">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              const Icon = step.icon;

              return (
                <motion.div
                  key={step.title}
                  className={`relative flex flex-col md:flex-row items-center gap-8 md:gap-16 ${
                    isEven ? "" : "md:flex-row-reverse"
                  }`}
                  initial={{ opacity: 0, y: 50, filter: "blur(6px)" }}
                  whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Content side */}
                  <div className={`flex-1 ${isEven ? "md:text-right" : "md:text-left"}`}>
                    <span
                      className="text-xs font-bold uppercase tracking-[0.2em]"
                      style={{ color: `hsl(${step.hue} 70% 60%)` }}
                    >
                      Step {i + 1}
                    </span>
                    <h3
                      className="mt-2 text-2xl font-bold text-foreground md:text-3xl"
                      style={{ fontFamily: "'Georgia', serif" }}
                    >
                      {step.subtitle}
                    </h3>
                    <p className="mt-3 text-muted-foreground leading-relaxed max-w-sm mx-auto md:mx-0">
                      {step.description}
                    </p>
                  </div>

                  {/* Center icon node */}
                  <div className="relative z-10 flex-shrink-0 order-first md:order-none">
                    <motion.div
                      className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-border/40"
                      style={{
                        background: `radial-gradient(circle, hsl(${step.hue} 50% 15%) 0%, hsl(var(--card)) 100%)`,
                        boxShadow: `0 0 40px hsl(${step.hue} 60% 40% / 0.15), 0 0 80px hsl(${step.hue} 60% 40% / 0.05)`,
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Icon
                        className="h-8 w-8"
                        style={{ color: `hsl(${step.hue} 70% 60%)` }}
                      />
                      {/* Pulse ring */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border"
                        style={{ borderColor: `hsl(${step.hue} 60% 50% / 0.3)` }}
                        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
                      />
                    </motion.div>
                  </div>

                  {/* Visual side — atmospheric graphic */}
                  <div className="flex-1">
                    <motion.div
                      className="relative h-48 md:h-56 rounded-2xl overflow-hidden border border-border/20"
                      style={{
                        background: `linear-gradient(135deg, hsl(${step.hue} 30% 12%) 0%, hsl(${step.hue} 20% 8%) 100%)`,
                      }}
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      {/* Animated glow inside */}
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background: `radial-gradient(circle at ${isEven ? '30%' : '70%'} 50%, hsl(${step.hue} 60% 40% / 0.15) 0%, transparent 60%)`,
                        }}
                        animate={{
                          opacity: [0.5, 1, 0.5],
                        }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      />
                      {/* Step title overlay */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span
                          className="text-6xl font-black uppercase opacity-[0.06] tracking-wider"
                          style={{ fontFamily: "'Georgia', serif" }}
                        >
                          {step.title}
                        </span>
                      </div>
                      {/* Decorative dots */}
                      {Array.from({ length: 5 }).map((_, di) => (
                        <motion.div
                          key={di}
                          className="absolute w-1.5 h-1.5 rounded-full"
                          style={{
                            left: `${20 + di * 15}%`,
                            top: `${30 + (di % 3) * 20}%`,
                            background: `hsl(${step.hue} 70% 60%)`,
                            opacity: 0.3,
                          }}
                          animate={{
                            y: [0, -10, 0],
                            opacity: [0.3, 0.6, 0.3],
                          }}
                          transition={{
                            duration: 3 + di,
                            delay: di * 0.3,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      ))}
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Journey end CTA */}
        <motion.div
          className="mt-24 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <a
            href="/browse"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-medium"
          >
            Start your journey now
            <ArrowRight className="h-4 w-4" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
