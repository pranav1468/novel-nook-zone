import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ChevronRight, Clock } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function ContinueReading() {
  // Get session
  const { data: session } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    staleTime: 60_000,
  });

  const userId = session?.user?.id;

  // Fetch reading progress with novel info
  const { data: progressList } = useQuery({
    queryKey: ["continue-reading", userId],
    queryFn: async () => {
      const { data: progress, error } = await supabase
        .from("reading_progress")
        .select("*")
        .eq("user_id", userId!)
        .order("updated_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      if (!progress || progress.length === 0) return [];

      // Fetch novel details for each progress entry
      const novelIds = progress.map((p) => p.novel_id);
      const { data: novels } = await supabase
        .from("novels")
        .select("id, title, cover_url, chapter_count, author")
        .in("id", novelIds);

      return progress.map((p) => {
        const novel = novels?.find((n) => n.id === p.novel_id);
        return { ...p, novel };
      });
    },
    enabled: !!userId,
  });

  // Don't render if not logged in or no progress
  if (!userId || !progressList || progressList.length === 0) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-foreground">Continue Reading</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {progressList.map((item, i) => {
              if (!item.novel) return null;
              const percent = item.novel.chapter_count > 0
                ? Math.round((item.chapter_number / item.novel.chapter_count) * 100)
                : 0;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                >
                  <Link
                    to={`/novel/${item.novel_id}/chapter/${item.chapter_number}`}
                    className="group flex gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
                  >
                    {/* Cover */}
                    <div className="h-20 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.novel.cover_url ? (
                        <img
                          src={item.novel.cover_url}
                          alt={item.novel.title}
                          className="h-full w-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <BookOpen className="h-5 w-5" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex flex-1 flex-col justify-between min-w-0">
                      <div>
                        <h3 className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {item.novel.title}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate">
                          {item.novel.author}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Ch. {item.chapter_number} / {item.novel.chapter_count}
                          </span>
                          <span>{percent}%</span>
                        </div>
                        <Progress value={percent} className="h-1.5" />
                      </div>
                    </div>

                    <ChevronRight className="h-4 w-4 self-center text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
