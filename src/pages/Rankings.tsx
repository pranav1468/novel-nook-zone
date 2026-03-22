import { useTrendingNovels } from "@/hooks/useNovels";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, BookOpen, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { motion } from "framer-motion";

function formatViews(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

function coverGradient(title: string): string {
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [24, 200, 160, 280, 340, 45, 120, 310, 220, 60];
  const hue = hues[hash % hues.length];
  return `linear-gradient(135deg, hsl(${hue}, 45%, 28%) 0%, hsl(${(hue + 40) % 360}, 35%, 18%) 100%)`;
}

export default function Rankings() {
  const { data: novels, isLoading } = useTrendingNovels();

  return (
    <main className="min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-6">
        <motion.div
          className="flex items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <Trophy className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Rankings</h1>
            <p className="mt-1 text-muted-foreground">Top novels by popularity</p>
          </div>
        </motion.div>

        <motion.div
          className="mt-8"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <Tabs defaultValue="weekly">
            <TabsList className="mb-6">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>

            {["daily", "weekly", "monthly"].map((tab) => (
              <TabsContent key={tab} value={tab}>
                <div className="space-y-3">
                  {isLoading
                    ? Array.from({ length: 10 }).map((_, i) => (
                        <Skeleton key={i} className="h-24 rounded-xl" />
                      ))
                    : novels?.map((novel, i) => (
                        <motion.div
                          key={novel.id}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true, amount: 0.2 }}
                          transition={{
                            duration: 0.4,
                            delay: i * 0.05,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <Link
                            to={`/novel/${novel.id}`}
                            className="group flex items-center gap-5 rounded-xl border border-border/40 bg-card p-4 transition-[box-shadow] duration-200 hover:shadow-lg hover:shadow-primary/5"
                          >
                            <span
                              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-lg font-bold ${
                                i < 3
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {i + 1}
                            </span>

                            <div
                              className="h-16 w-11 shrink-0 rounded-md"
                              style={{ background: coverGradient(novel.title) }}
                            />

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                {novel.title}
                              </h3>
                              <p className="text-xs text-muted-foreground">{novel.author}</p>
                              <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-primary/70" />
                                  {novel.rating.toFixed(1)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {formatViews(novel.views)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3" />
                                  {novel.chapter_count} ch
                                </span>
                              </div>
                            </div>

                            <div className="hidden sm:flex gap-1.5 shrink-0">
                              {novel.genre.slice(0, 2).map((g) => (
                                <Badge key={g} variant="secondary" className="text-[10px] border-0">
                                  {g}
                                </Badge>
                              ))}
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>
      </div>
    </main>
  );
}
