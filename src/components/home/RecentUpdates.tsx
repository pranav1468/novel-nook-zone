import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
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
        .limit(6);
      if (error) throw error;

      return (data as unknown as NovelWithChapters[]).map((novel) => ({
        ...novel,
        chapters: novel.chapters
          .sort((a, b) => b.chapter_number - a.chapter_number)
          .slice(0, 2),
      }));
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold tracking-tight text-foreground">Recent Updates</h2>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
          <Link to="/browse" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
            See More <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <div className="space-y-1">
        {isLoading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-3 py-2.5">
                <Skeleton className="h-14 w-10 shrink-0 rounded" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))
          : novels?.map((novel) => (
              <div
                key={novel.id}
                className="flex gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/60"
              >
                <Link to={`/novel/${novel.id}`} className="shrink-0">
                  <div
                    className="h-14 w-10 overflow-hidden rounded"
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
                      className="text-sm font-medium text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {novel.title}
                    </Link>
                    {novel.chapters[0] && (
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatDistanceToNow(new Date(novel.chapters[0].created_at), { addSuffix: true })}
                      </span>
                    )}
                  </div>

                  <div className="mt-0.5 space-y-0">
                    {novel.chapters.map((ch) => (
                      <Link
                        key={ch.chapter_number}
                        to={`/novel/${novel.id}`}
                        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                      >
                        <span className="font-medium text-foreground/60">Ch.{ch.chapter_number}</span>
                        <span className="line-clamp-1">{ch.title}</span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
      </div>
    </div>
  );
}
