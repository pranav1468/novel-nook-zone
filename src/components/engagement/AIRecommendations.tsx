import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNovels } from "@/hooks/useNovels";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";
import NovelCard from "@/components/NovelCard";

export default function AIRecommendations() {
  const { data: allNovels } = useNovels();
  const [refreshKey, setRefreshKey] = useState(0);

  const { data: recommendations, isLoading, refetch } = useQuery({
    queryKey: ["ai-recommendations", refreshKey],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !allNovels?.length) return getDefaultRecommendations();

      // Get user's reading history
      const { data: progress } = await supabase
        .from("reading_progress")
        .select("novel_id")
        .eq("user_id", user.id);

      const { data: library } = await supabase
        .from("user_libraries")
        .select("novel_id")
        .eq("user_id", user.id);

      const readNovelIds = new Set([
        ...(progress || []).map((p) => p.novel_id),
        ...(library || []).map((l) => l.novel_id),
      ]);

      // Get genres the user has read
      const readNovels = allNovels.filter((n) => readNovelIds.has(n.id));
      const genreCount: Record<string, number> = {};
      readNovels.forEach((n) => n.genre.forEach((g) => {
        genreCount[g] = (genreCount[g] || 0) + 1;
      }));

      // Sort genres by preference
      const preferredGenres = Object.entries(genreCount)
        .sort(([, a], [, b]) => b - a)
        .map(([g]) => g);

      // Score unread novels
      const unread = allNovels.filter((n) => !readNovelIds.has(n.id));
      const scored = unread.map((novel) => {
        let score = novel.rating * 10;
        score += Math.log(novel.views + 1) * 2;
        novel.genre.forEach((g) => {
          const idx = preferredGenres.indexOf(g);
          if (idx >= 0) score += (preferredGenres.length - idx) * 15;
        });
        if (novel.featured) score += 20;
        // Add randomness for variety
        score += Math.random() * 10;
        return { novel, score };
      });

      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, 6).map((s) => s.novel);
    },
    enabled: !!allNovels?.length,
  });

  function getDefaultRecommendations() {
    if (!allNovels) return [];
    return [...allNovels]
      .sort((a, b) => b.rating - a.rating + (Math.random() - 0.5) * 2)
      .slice(0, 6);
  }

  return (
    <section className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10"
            animate={{ rotate: isLoading ? 360 : 0 }}
            transition={{ duration: 2, repeat: isLoading ? Infinity : 0, ease: "linear" }}
          >
            <Sparkles className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Recommended For You</h3>
            <p className="text-xs text-muted-foreground">Personalized picks based on your taste</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { setRefreshKey((k) => k + 1); refetch(); }}
          disabled={isLoading}
          className="gap-1.5 text-muted-foreground"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
          {recommendations?.map((novel, i) => (
            <motion.div
              key={novel.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <NovelCard novel={novel} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
