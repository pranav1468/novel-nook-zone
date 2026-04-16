import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sword, Sparkles, Heart, Rocket, Ghost, Laugh, Drama, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const genres: { name: string; icon: LucideIcon; hue: number }[] = [
  { name: "Action", icon: Sword, hue: 24 },
  { name: "Fantasy", icon: Sparkles, hue: 270 },
  { name: "Romance", icon: Heart, hue: 340 },
  { name: "Sci-Fi", icon: Rocket, hue: 200 },
  { name: "Horror", icon: Ghost, hue: 0 },
  { name: "Comedy", icon: Laugh, hue: 45 },
  { name: "Drama", icon: Drama, hue: 160 },
  { name: "Adventure", icon: Compass, hue: 30 },
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
                  className="genre-glow group relative flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-card p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/30 active:scale-[0.97] overflow-hidden"
                  style={{
                    // @ts-ignore
                    "--genre-hue": genre.hue,
                  }}
                >
                  {/* Background glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 40%, hsl(${genre.hue} 60% 50% / 0.12) 0%, transparent 70%)`,
                    }}
                  />

                  <div
                    className="relative flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg"
                    style={{
                      backgroundColor: `hsl(${genre.hue} 60% 50% / 0.12)`,
                      boxShadow: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = `0 4px 20px hsl(${genre.hue} 60% 50% / 0.3)`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <Icon
                      className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: `hsl(${genre.hue} 60% 50%)` }}
                    />
                  </div>
                  <span className="relative text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors">
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
