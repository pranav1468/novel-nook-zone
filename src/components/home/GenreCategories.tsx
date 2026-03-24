import { Link } from "react-router-dom";
import { motion } from "framer-motion";
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
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Browse by Genre</h2>
          <p className="mt-1 text-sm text-muted-foreground">Find exactly what you're in the mood for</p>
        </motion.div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
          {genres.map((genre, i) => {
            const Icon = genre.icon;
            return (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/browse?genre=${genre.name}`}
                  className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-5 transition-all duration-200 hover:shadow-md hover:shadow-primary/5 hover:border-primary/20 active:scale-[0.97]"
                >
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `hsl(${genre.color} / 0.12)` }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: `hsl(${genre.color})` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {genre.name}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
