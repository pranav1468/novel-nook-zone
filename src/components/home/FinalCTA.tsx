import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="relative py-32 overflow-hidden">
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, hsl(24 50% 10% / 0.5) 0%, transparent 70%)",
        }}
      />

      {/* Floating particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-primary/30"
          style={{
            left: `${15 + i * 10}%`,
            top: `${20 + (i % 4) * 20}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <motion.div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          >
            <BookOpen className="h-7 w-7 text-primary" />
          </motion.div>

          <h2
            className="text-3xl font-bold tracking-tight text-foreground md:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Your Next Great Story
            <br />
            <span className="bg-clip-text text-transparent" style={{
              backgroundImage: "linear-gradient(135deg, hsl(var(--primary)), hsl(24 90% 70%))",
            }}>
              Awaits
            </span>
          </h2>

          <p className="mt-5 text-muted-foreground leading-relaxed max-w-md mx-auto">
            Join thousands of readers discovering worlds beyond imagination. 
            Start your reading journey today.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/browse">
              <Button
                size="lg"
                className="gap-2 text-base px-8 py-6 rounded-xl shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-[0.97]"
              >
                Explore the Library
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 rounded-xl backdrop-blur-md bg-card/20 border-border/40 hover:bg-card/40 transition-all active:scale-[0.97]"
              >
                Create Free Account
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
