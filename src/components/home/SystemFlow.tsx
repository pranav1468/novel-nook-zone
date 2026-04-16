import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, BookOpen, Heart, Users, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    description: "AI-powered recommendations find stories matched to your taste across thousands of novels.",
    color: "200",
  },
  {
    icon: BookOpen,
    title: "Read",
    description: "Immersive reader with auto-scroll, TTS, and ambient mode. Your progress syncs everywhere.",
    color: "24",
  },
  {
    icon: Heart,
    title: "Engage",
    description: "Vote, review, and discuss. Shape which stories get translated and featured next.",
    color: "340",
  },
  {
    icon: Users,
    title: "Community",
    description: "Earn XP, unlock badges, climb leaderboards. Contribute translations and edits.",
    color: "160",
  },
];

function ConnectorLine({ delay }: { delay: number }) {
  return (
    <motion.div
      className="hidden md:flex items-center justify-center w-12 shrink-0"
      initial={{ opacity: 0, scaleX: 0 }}
      whileInView={{ opacity: 1, scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="relative w-full h-[2px] bg-border">
        <motion.div
          className="absolute inset-0 bg-primary origin-left"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
        />
        <ArrowRight className="absolute -right-2 -top-[7px] h-4 w-4 text-primary" />
      </div>
    </motion.div>
  );
}

export default function SystemFlow() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-20 relative overflow-hidden">
      {/* Subtle bg pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Your Reading System
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            A complete pipeline from discovery to community — not just a library, a living ecosystem.
          </p>
        </motion.div>

        {/* Flow steps */}
        <div className="flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-0">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="contents">
                <motion.div
                  initial={{ opacity: 0, y: 24, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.15,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative flex-1 max-w-[260px] mx-auto md:mx-0"
                >
                  <div className="relative rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-6 h-full transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5">
                    {/* Step number */}
                    <span className="absolute -top-3 -left-3 flex h-7 w-7 items-center justify-center rounded-full bg-background border border-border text-xs font-bold text-primary">
                      {i + 1}
                    </span>

                    {/* Icon */}
                    <motion.div
                      className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-all duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: `hsl(${step.color} 60% 50% / 0.1)`,
                      }}
                      whileHover={{
                        boxShadow: `0 8px 30px hsl(${step.color} 60% 50% / 0.2)`,
                      }}
                    >
                      <Icon className="h-6 w-6" style={{ color: `hsl(${step.color} 60% 50%)` }} />
                    </motion.div>

                    <h3 className="text-lg font-semibold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>

                    {/* Bottom glow on hover */}
                    <div
                      className="absolute bottom-0 left-[10%] right-[10%] h-[1px] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      style={{
                        background: `linear-gradient(90deg, transparent, hsl(${step.color} 60% 50% / 0.5), transparent)`,
                      }}
                    />
                  </div>
                </motion.div>

                {i < steps.length - 1 && <ConnectorLine delay={i * 0.15 + 0.2} />}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
