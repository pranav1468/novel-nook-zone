import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sword, Sparkles, Heart, Rocket, Ghost, Laugh, Drama, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const genres: { name: string; icon: LucideIcon; hue: number; description: string }[] = [
  { name: "Action", icon: Sword, hue: 24, description: "High-stakes battles" },
  { name: "Fantasy", icon: Sparkles, hue: 270, description: "Magic & wonder" },
  { name: "Romance", icon: Heart, hue: 340, description: "Love stories" },
  { name: "Sci-Fi", icon: Rocket, hue: 200, description: "Future worlds" },
  { name: "Horror", icon: Ghost, hue: 0, description: "Dark thrills" },
  { name: "Comedy", icon: Laugh, hue: 45, description: "Feel-good reads" },
  { name: "Drama", icon: Drama, hue: 160, description: "Deep emotions" },
  { name: "Adventure", icon: Compass, hue: 30, description: "Epic journeys" },
];

export default function GenreCategories() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Explore</span>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Browse by Genre</h2>
          <p className="mt-2 text-muted-foreground">Find exactly what you're in the mood for</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {genres.map((genre, i) => {
            const Icon = genre.icon;
            return (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, y: 16, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/browse?genre=${genre.name}`}
                  className="group relative flex items-center gap-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-sm p-5 transition-all duration-300 hover:shadow-xl hover:border-primary/30 active:scale-[0.97] overflow-hidden"
                >
                  {/* Background glow */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-400 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 30% 50%, hsl(${genre.hue} 60% 50% / 0.08) 0%, transparent 70%)`,
                    }}
                  />

                  <div
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110"
                    style={{ backgroundColor: `hsl(${genre.hue} 60% 50% / 0.1)` }}
                  >
                    <Icon
                      className="h-5 w-5 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: `hsl(${genre.hue} 60% 50%)` }}
                    />
                  </div>

                  <div className="relative min-w-0">
                    <span className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">{genre.name}</span>
                    <p className="text-xs text-muted-foreground">{genre.description}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
