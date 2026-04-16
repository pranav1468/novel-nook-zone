import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";

type NovelWithChapters = {
  id: string;
  title: string;
  cover_url: string | null;
  chapters: { chapter_number: number; title: string; created_at: string }[];
};

function coverGradient(title: string): string {
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [24, 200, 160, 280, 340, 45, 120, 310, 220, 60];
  const hue = hues[hash % hues.length];
  return `linear-gradient(135deg, hsl(${hue}, 45%, 28%) 0%, hsl(${(hue + 40) % 360}, 35%, 18%) 100%)`;
}

const PAGE_SIZE = 8;

export default function RecentUpdates() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const { data: novels, isLoading } = useQuery({
    queryKey: ["novels", "recent-updates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novels")
        .select("id, title, cover_url, chapters(chapter_number, title, created_at)")
        .order("updated_at", { ascending: false });
      if (error) throw error;

      return (data as unknown as NovelWithChapters[]).map((novel) => ({
        ...novel,
        chapters: novel.chapters
          .sort((a, b) => b.chapter_number - a.chapter_number)
          .slice(0, 3),
      }));
    },
  });

  const visible = novels?.slice(0, visibleCount);
  const hasMore = novels && visibleCount < novels.length;

  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Clock className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Recent Updates</h2>
            <p className="text-sm text-muted-foreground">Latest chapter releases</p>
          </div>
        </motion.div>

        <div className="grid gap-3 md:grid-cols-2">
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-24 rounded-xl" />
              ))
            : visible?.map((novel, i) => (
                <motion.div
                  key={novel.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                >
                  <div className="group flex gap-4 rounded-xl border border-border/40 bg-card/80 backdrop-blur-sm p-4 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                    <Link to={`/novel/${novel.id}`} className="shrink-0">
                      <div
                        className="h-20 w-14 overflow-hidden rounded-lg transition-transform duration-300 group-hover:scale-105"
                        style={{ background: coverGradient(novel.title) }}
                      >
                        {novel.cover_url && (
                          <img src={novel.cover_url} alt={novel.title} className="h-full w-full object-cover" loading="lazy" />
                        )}
                      </div>
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/novel/${novel.id}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {novel.title}
                      </Link>

                      <div className="mt-1.5 space-y-0.5">
                        {novel.chapters.map((ch) => (
                          <Link
                            key={ch.chapter_number}
                            to={`/novel/${novel.id}`}
                            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                          >
                            <span className="font-bold text-foreground/80 text-[10px]">#{ch.chapter_number}</span>
                            <span className="truncate">{ch.title}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {novel.chapters[0] && (
                      <span className="shrink-0 self-start text-[10px] text-primary/80 pt-0.5 whitespace-nowrap">
                        {formatDistanceToNow(new Date(novel.chapters[0].created_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="gap-2"
            >
              Load More
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
