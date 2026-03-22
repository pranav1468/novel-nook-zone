import { useTrendingNovels } from "@/hooks/useNovels";
import NovelCard from "@/components/NovelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

export default function TrendingNovels() {
  const { data: novels, isLoading } = useTrendingNovels();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-2"
        >
          <TrendingUp className="h-5 w-5 text-primary" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Trending Now</h2>
            <p className="mt-1 text-sm text-muted-foreground">Most-read this week</p>
          </div>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : novels?.slice(0, 10).map((novel, i) => (
                <NovelCard key={novel.id} novel={novel} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
