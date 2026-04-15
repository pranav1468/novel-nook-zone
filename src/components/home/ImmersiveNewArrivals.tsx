import { useRecentNovels } from "@/hooks/useNovels";
import NovelCard from "@/components/NovelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function ImmersiveNewArrivals() {
  const { data: novels, isLoading } = useRecentNovels();

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 40% 40% at 80% 30%, hsl(270 40% 8% / 0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-primary/70 font-medium flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5" />
              Just Arrived
            </span>
            <h2
              className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
              style={{ fontFamily: "'Georgia', serif" }}
            >
              Fresh Stories
            </h2>
          </div>
          <Button variant="ghost" size="sm" asChild className="hidden md:flex">
            <Link to="/browse?sort=latest" className="gap-1 text-muted-foreground hover:text-primary">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))
            : novels?.slice(0, 12).map((novel, i) => (
                <NovelCard key={novel.id} novel={novel} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
