import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="border-b border-border/40 bg-muted/30 py-8 md:py-10">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between gap-8">
          <motion.div
            className="max-w-lg"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
              <BookOpen className="h-3 w-3 text-primary" />
              Discover your next obsession
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              Read Stories That Move You
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground md:text-base">
              Thousands of web novels across fantasy, sci-fi, romance, and more.
            </p>
          </motion.div>

          <motion.div
            className="hidden shrink-0 gap-2 sm:flex"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Link to="/browse">
              <Button size="sm" className="gap-1.5">
                Explore Library
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
