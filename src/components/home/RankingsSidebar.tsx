import { useTrendingNovels } from "@/hooks/useNovels";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Star, Trophy, Crown, Medal, Award } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const rankIcons = [Crown, Medal, Award];

export default function RankingsSidebar() {
  const { data: novels, isLoading } = useTrendingNovels();

  return (
    <motion.section
      className="py-20 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-0 w-[50%] h-[50%]"
          style={{
            background: `radial-gradient(ellipse at bottom left, hsl(var(--primary) / 0.03) 0%, transparent 60%)`,
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Leaderboard</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground flex items-center justify-center gap-2">
            <Trophy className="h-7 w-7 text-primary" />
            Rankings
          </h2>
        </motion.div>

        <Tabs defaultValue="weekly" className="max-w-3xl mx-auto">
          <TabsList className="mb-8 mx-auto w-fit">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          {["daily", "weekly", "monthly"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="space-y-3">
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-xl" />
                    ))
                  : novels?.map((novel, i) => {
                      const RankIcon = i < 3 ? rankIcons[i] : null;
                      return (
                        <motion.div
                          key={novel.id}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: i * 0.04 }}
                        >
                          <Link
                            to={`/novel/${novel.id}`}
                            className="group flex items-center gap-4 rounded-xl border border-border/40 bg-card/80 backdrop-blur-sm p-4 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30"
                          >
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold ${
                                i < 3
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {RankIcon ? <RankIcon className="h-4 w-4" /> : i + 1}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                                {novel.title}
                              </p>
                              <p className="text-xs text-muted-foreground">{novel.author}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              <span className="text-xs text-muted-foreground">{novel.views.toLocaleString()} views</span>
                              <span className="flex items-center gap-1 text-xs font-medium text-foreground">
                                <Star className="h-3 w-3 text-primary" />
                                {novel.rating.toFixed(1)}
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </motion.section>
  );
}
