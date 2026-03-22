import { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useNovels } from "@/hooks/useNovels";
import NovelCard from "@/components/NovelCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

const ALL_GENRES = [
  "Action", "Fantasy", "Romance", "Sci-Fi", "Horror",
  "Comedy", "Drama", "Adventure", "Mystery", "Thriller",
];

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Popular" },
  { value: "rating", label: "Top Rated" },
];

const STATUS_OPTIONS = ["all", "ongoing", "completed", "hiatus"] as const;

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialGenre = searchParams.get("genre") || "";

  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [sortBy, setSortBy] = useState("latest");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: novels, isLoading } = useNovels();

  const filtered = useMemo(() => {
    if (!novels) return [];
    let result = [...novels];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (n) =>
          n.title.toLowerCase().includes(q) ||
          n.author.toLowerCase().includes(q)
      );
    }

    if (selectedGenre) {
      result = result.filter((n) => n.genre.includes(selectedGenre));
    }

    if (statusFilter !== "all") {
      result = result.filter((n) => n.status === statusFilter);
    }

    switch (sortBy) {
      case "popular":
        result.sort((a, b) => b.views - a.views);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
    }

    return result;
  }, [novels, search, selectedGenre, sortBy, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setSelectedGenre("");
    setSortBy("latest");
    setStatusFilter("all");
    setSearchParams({});
  };

  const hasFilters = search || selectedGenre || sortBy !== "latest" || statusFilter !== "all";

  return (
    <main className="min-h-screen py-10">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Browse Novels</h1>
          <p className="mt-1 text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "novel" : "novels"} found
          </p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          className="mt-8 space-y-4"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Genre chips */}
          <div className="flex flex-wrap gap-2">
            {ALL_GENRES.map((genre) => (
              <button
                key={genre}
                onClick={() => {
                  setSelectedGenre(selectedGenre === genre ? "" : genre);
                  if (selectedGenre === genre) {
                    searchParams.delete("genre");
                  } else {
                    searchParams.set("genre", genre);
                  }
                  setSearchParams(searchParams);
                }}
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors active:scale-[0.97] ${
                  selectedGenre === genre
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Sort & Status */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              {SORT_OPTIONS.map((opt) => (
                <Button
                  key={opt.value}
                  variant={sortBy === opt.value ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSortBy(opt.value)}
                  className="text-xs active:scale-[0.97]"
                >
                  {opt.label}
                </Button>
              ))}
            </div>

            <div className="h-5 w-px bg-border" />

            <div className="flex items-center gap-1.5">
              {STATUS_OPTIONS.map((s) => (
                <Button
                  key={s}
                  variant={statusFilter === s ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setStatusFilter(s)}
                  className="text-xs capitalize active:scale-[0.97]"
                >
                  {s === "all" ? "All Status" : s}
                </Button>
              ))}
            </div>

            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="ml-auto text-xs gap-1">
                <X className="h-3 w-3" /> Clear
              </Button>
            )}
          </div>
        </motion.div>

        {/* Grid */}
        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {isLoading
            ? Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="aspect-[2/3] w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            : filtered.map((novel, i) => (
                <NovelCard key={novel.id} novel={novel} index={i} />
              ))}
        </div>

        {!isLoading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg font-medium text-foreground">No novels found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your filters or search terms
            </p>
            <Button variant="outline" size="sm" onClick={clearFilters} className="mt-4">
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
