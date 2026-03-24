import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

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

export default function RecentUpdates() {
  const { data: novels, isLoading } = useQuery({
    queryKey: ["novels", "recent-updates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novels")
        .select("id, title, cover_url, chapters(chapter_number, title, created_at)")
        .order("updated_at", { ascending: false })
        .limit(8);
      if (error) throw error;

      return (data as unknown as NovelWithChapters[]).map((novel) => ({
        ...novel,
        chapters: novel.chapters
          .sort((a, b) => b.chapter_number - a.chapter_number)
          .slice(0, 3),
      }));
    },
  });

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Recent Updates</h2>
              <p className="mt-0.5 text-sm text-muted-foreground">Latest chapter releases</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/browse" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
              See More <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="mt-6 divide-y divide-border">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4 py-4">
                  <Skeleton className="h-20 w-16 shrink-0 rounded-md" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))
            : novels?.map((novel, i) => (
                <motion.div
                  key={novel.id}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex gap-4 py-4"
                >
                  <Link to={`/novel/${novel.id}`} className="shrink-0">
                    <div
                      className="h-20 w-16 overflow-hidden rounded-md"
                      style={{ background: coverGradient(novel.title) }}
                    >
                      {novel.cover_url && (
                        <img
                          src={novel.cover_url}
                          alt={novel.title}
                          className="h-full w-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/novel/${novel.id}`}
                        className="text-sm font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {novel.title}
                      </Link>
                      {novel.chapters[0] && (
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(novel.chapters[0].created_at), { addSuffix: true })}
                        </span>
                      )}
                    </div>

                    <div className="mt-1.5 space-y-0.5">
                      {novel.chapters.map((ch) => (
                        <Link
                          key={ch.chapter_number}
                          to={`/novel/${novel.id}`}
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
                        >
                          <span className="font-medium text-foreground/70">#{ch.chapter_number}</span>
                          <span className="line-clamp-1">{ch.title}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
        </div>

        {novels && novels.length > 0 && (
          <div className="mt-6 flex justify-center">
            <Button variant="outline" size="sm" asChild>
              <Link to="/browse">Load More</Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
