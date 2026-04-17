import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sword, Sparkles, Heart, Rocket, Ghost, Laugh, Drama, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const genres: { name: string; tagline: string; icon: LucideIcon; hue: number }[] = [
  { name: "Action", tagline: "High-stakes battles", icon: Sword, hue: 24 },
  { name: "Fantasy", tagline: "Magic & wonder", icon: Sparkles, hue: 270 },
  { name: "Romance", tagline: "Love stories", icon: Heart, hue: 340 },
  { name: "Sci-Fi", tagline: "Future worlds", icon: Rocket, hue: 200 },
  { name: "Horror", tagline: "Dark thrills", icon: Ghost, hue: 0 },
  { name: "Comedy", tagline: "Feel-good reads", icon: Laugh, hue: 45 },
  { name: "Drama", tagline: "Deep emotions", icon: Drama, hue: 160 },
  { name: "Adventure", tagline: "Epic journeys", icon: Compass, hue: 30 },
];

export default function GenreCategories() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Explore</p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl font-bold tracking-tight text-foreground">
            Browse by Genre
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Find exactly what you're in the mood for
          </p>
        </motion.div>

        <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {genres.map((genre, i) => {
            const Icon = genre.icon;
            return (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/browse?genre=${genre.name}`}
                  className="group relative flex items-center gap-4 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-sm p-5 transition-all duration-300 hover:border-primary/40 hover:shadow-[0_8px_30px_-10px_hsl(var(--primary)/0.25)] hover:-translate-y-0.5 active:scale-[0.98] overflow-hidden"
                >
                  {/* Hover background tint */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 20% 50%, hsl(${genre.hue} 70% 55% / 0.08) 0%, transparent 70%)`,
                    }}
                  />

                  <div
                    className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `hsl(${genre.hue} 70% 88% / 0.5)`,
                    }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: `hsl(${genre.hue} 65% 50%)` }}
                    />
                  </div>

                  <div className="relative flex flex-col">
                    <span
                      className="text-sm font-bold text-foreground transition-colors group-hover:text-[color:var(--genre-color)]"
                      style={{ ["--genre-color" as string]: `hsl(${genre.hue} 65% 50%)` }}
                    >
                      {genre.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{genre.tagline}</span>
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
