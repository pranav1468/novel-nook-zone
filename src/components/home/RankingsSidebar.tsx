import { useTrendingNovels } from "@/hooks/useNovels";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "react-router-dom";
import { Star, Trophy, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function RankingsSidebar() {
  const { data: novels, isLoading } = useTrendingNovels();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold tracking-tight text-foreground">Novel Ranking</h2>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
          <Link to="/rankings" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
            See More <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <Tabs defaultValue="weekly">
        <TabsList className="mb-4 h-8">
          <TabsTrigger value="daily" className="text-xs px-3 h-6">Daily</TabsTrigger>
          <TabsTrigger value="weekly" className="text-xs px-3 h-6">Weekly</TabsTrigger>
          <TabsTrigger value="monthly" className="text-xs px-3 h-6">Monthly</TabsTrigger>
        </TabsList>

        {["daily", "weekly", "monthly"].map((tab) => (
          <TabsContent key={tab} value={tab}>
            <div className="space-y-1.5">
              {isLoading
                ? Array.from({ length: 8 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 rounded-lg" />
                  ))
                : novels?.slice(0, 10).map((novel, i) => (
                    <Link
                      key={novel.id}
                      to={`/novel/${novel.id}`}
                      className="group flex items-center gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/60"
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded text-xs font-bold ${
                          i < 3
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {i + 1}
                      </span>

                      {novel.cover_url ? (
                        <img
                          src={novel.cover_url}
                          alt={novel.title}
                          className="h-10 w-7 shrink-0 rounded object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-10 w-7 shrink-0 rounded bg-muted" />
                      )}

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                          {novel.title}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{novel.views.toLocaleString()} Views</span>
                          <span className="flex items-center gap-0.5">
                            <Star className="h-2.5 w-2.5 text-primary/70" />
                            {novel.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
