import { Link } from "react-router-dom";
import { Sword, Sparkles, Heart, Rocket, Ghost, Laugh, Drama, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const genres: { name: string; icon: LucideIcon; color: string }[] = [
  { name: "Action", icon: Sword, color: "24 80% 52%" },
  { name: "Fantasy", icon: Sparkles, color: "270 60% 55%" },
  { name: "Romance", icon: Heart, color: "340 70% 55%" },
  { name: "Sci-Fi", icon: Rocket, color: "200 70% 50%" },
  { name: "Horror", icon: Ghost, color: "0 0% 45%" },
  { name: "Comedy", icon: Laugh, color: "45 80% 50%" },
  { name: "Drama", icon: Drama, color: "160 50% 42%" },
  { name: "Adventure", icon: Compass, color: "30 60% 45%" },
];

export default function GenreCategories() {
  return (
    <div>
      <h2 className="text-lg font-bold tracking-tight text-foreground mb-4">Browse by Genre</h2>
      <div className="grid grid-cols-4 gap-2 lg:grid-cols-8">
        {genres.map((genre) => {
          const Icon = genre.icon;
          return (
            <Link
              key={genre.name}
              to={`/browse?genre=${genre.name}`}
              className="group flex flex-col items-center gap-2 rounded-lg border border-border/40 bg-card p-3 transition-all duration-200 hover:border-primary/20 hover:bg-muted/60"
            >
              <div
                className="flex h-8 w-8 items-center justify-center rounded-md transition-transform group-hover:scale-110"
                style={{ backgroundColor: `hsl(${genre.color} / 0.12)` }}
              >
                <Icon className="h-4 w-4" style={{ color: `hsl(${genre.color})` }} />
              </div>
              <span className="text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                {genre.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
