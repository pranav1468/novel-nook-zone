import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 text-primary" />
              Discover your next obsession
            </div>
          </motion.div>

          <motion.h1
            className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground md:text-6xl"
            style={{ textWrap: "balance" }}
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            Read Stories That
            <br />
            Move You
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
              <Button size="lg" className="gap-2 active:scale-[0.97] transition-transform">
                Explore Library
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="active:scale-[0.97] transition-transform">
                Create Account
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
