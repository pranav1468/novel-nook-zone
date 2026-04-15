import { useTrendingNovels } from "@/hooks/useNovels";
import NovelCard from "@/components/NovelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ImmersiveTrending() {
  const { data: novels, isLoading } = useTrendingNovels();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle side glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 30% 50% at 0% 50%, hsl(24 50% 10% / 0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary/70 font-medium flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5" />
              Trending Now
            </span>
            <h2
              className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Most Read This Week
            </h2>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden md:flex">
            <Link to="/browse?sort=popular" className="gap-1 text-muted-foreground hover:text-primary">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Asymmetric grid — not a boring uniform grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : novels?.slice(0, 10).map((novel, i) => (
                <div
                  key={novel.id}
                  className={i === 0 ? "sm:col-span-1 md:row-span-1" : ""}
                >
                  <NovelCard novel={novel} index={i} />
                </div>
              ))}
        </div>

        <div className="mt-8 flex justify-center md:hidden">
          <Button variant="outline" size="sm" asChild>
            <Link to="/browse?sort=popular" className="gap-1">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
