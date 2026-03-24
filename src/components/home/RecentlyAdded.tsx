import { useRecentNovels } from "@/hooks/useNovels";
import NovelCard from "@/components/NovelCard";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function RecentlyAdded() {
  const { data: novels, isLoading } = useRecentNovels();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h2 className="text-lg font-bold tracking-tight text-foreground">New Novels</h2>
        </div>
        <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
          <Link to="/browse?sort=latest" className="flex items-center gap-1 text-muted-foreground hover:text-primary">
            See More <ArrowRight className="h-3 w-3" />
          </Link>
        </Button>
      </div>

      <ScrollArea className="w-full">
        <div className="flex gap-4 pb-3">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[140px] shrink-0 space-y-2">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : novels?.map((novel, i) => (
                <div key={novel.id} className="w-[140px] shrink-0">
                  <NovelCard novel={novel} index={i} />
                </div>
              ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
