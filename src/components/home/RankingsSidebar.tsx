import { useState } from "react";
import { useTrendingNovels } from "@/hooks/useNovels";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Star, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

export default function RankingsSidebar() {
  const { data: novels, isLoading } = useTrendingNovels();

  return (
    <motion.section
      className="py-16"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="h-5 w-5 text-primary" />
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Rankings</h2>
        </div>

        <Tabs defaultValue="weekly">
          <TabsList className="mb-6">
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          {["daily", "weekly", "monthly"].map((tab) => (
            <TabsContent key={tab} value={tab}>
              <div className="grid gap-3 md:grid-cols-2">
                {isLoading
                  ? Array.from({ length: 10 }).map((_, i) => (
                      <Skeleton key={i} className="h-16 rounded-lg" />
                    ))
                  : novels?.map((novel, i) => (
                      <Link
                        key={novel.id}
                        to={`/novel/${novel.id}`}
                        className="group flex items-center gap-4 rounded-lg border border-border/40 bg-card p-3.5 transition-[box-shadow] duration-200 hover:shadow-md hover:shadow-primary/5"
                      >
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-sm font-bold ${
                            i < 3
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                            {novel.title}
                          </p>
                          <p className="text-xs text-muted-foreground">{novel.author}</p>
                        </div>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Star className="h-3 w-3 text-primary/70" />
                          {novel.rating.toFixed(1)}
                        </span>
                      </Link>
                    ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </motion.section>
  );
}
