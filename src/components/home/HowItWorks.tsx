import { motion } from "framer-motion";
import { Search, BookOpen, Heart, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Step = {
  num: string;
  title: string;
  description: string;
  icon: LucideIcon;
  hue: number;
};

const steps: Step[] = [
  {
    num: "1",
    title: "Discover",
    description:
      "AI-powered recommendations find stories matched to your taste across thousands of novels.",
    icon: Search,
    hue: 200,
  },
  {
    num: "2",
    title: "Read",
    description:
      "Immersive reader with auto-scroll, TTS, and ambient mode. Your progress syncs everywhere.",
    icon: BookOpen,
    hue: 24,
  },
  {
    num: "3",
    title: "Engage",
    description:
      "Vote, review, and discuss. Shape which stories get translated and featured next.",
    icon: Heart,
    hue: 340,
  },
  {
    num: "4",
    title: "Community",
    description:
      "Earn XP, unlock badges, climb leaderboards. Contribute translations and edits.",
    icon: Users,
    hue: 160,
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-24 overflow-hidden glass-ambient">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">How It Works</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Your Reading System
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
            A complete pipeline from discovery to community — not just a library, a living
            ecosystem.
          </p>
        </motion.div>

        <div className="relative mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Connecting line on desktop */}
          <div className="pointer-events-none absolute left-0 right-0 top-[120px] hidden lg:block">
            <div className="mx-auto h-px max-w-[80%] bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>

          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="relative"
              >
                {/* Step number floating badge */}
                <div className="absolute -top-3 left-6 z-10 flex h-7 w-7 items-center justify-center rounded-full glass text-xs font-bold text-primary">
                  {step.num}
                </div>

                <div className="group relative h-full rounded-2xl glass glass-hover p-6 pt-8 hover:-translate-y-1">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `hsl(${step.hue} 70% 88% / 0.5)` }}
                  >
                    <Icon className="h-5 w-5" style={{ color: `hsl(${step.hue} 65% 50%)` }} />
                  </div>

                  <h3 className="mt-5 font-serif text-xl font-bold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
