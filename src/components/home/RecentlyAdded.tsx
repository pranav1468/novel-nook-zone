import { useRecentNovels } from "@/hooks/useNovels";
import NovelCard from "@/components/NovelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RecentlyAdded() {
  const { data: novels, isLoading } = useRecentNovels();

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">NEW</h2>
              <p className="text-sm text-muted-foreground">Fresh stories just landed</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/browse?sort=latest" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
              See More <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <ScrollArea className="w-full">
          <div className="flex gap-5 pb-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-[160px] shrink-0 space-y-2">
                    <Skeleton className="aspect-[2/3] w-full rounded-xl" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                ))
              : novels?.map((novel, i) => (
                  <div key={novel.id} className="w-[160px] shrink-0">
                    <NovelCard novel={novel} index={i} />
                  </div>
                ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </section>
  );
}
