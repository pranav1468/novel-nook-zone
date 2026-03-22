import { useRecentNovels } from "@/hooks/useNovels";
import NovelCard from "@/components/NovelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

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
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Recently Added</h2>
          <p className="mt-1 text-sm text-muted-foreground">Fresh stories just landed</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : novels?.map((novel, i) => (
                <NovelCard key={novel.id} novel={novel} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
