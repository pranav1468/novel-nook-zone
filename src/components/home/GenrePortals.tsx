import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sword, Sparkles, Heart, Rocket, Ghost, Laugh, Drama, Compass } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const genres: { name: string; icon: LucideIcon; hue: number; vibe: string }[] = [
  { name: "Action", icon: Sword, hue: 24, vibe: "Adrenaline-fueled battles" },
  { name: "Fantasy", icon: Sparkles, hue: 270, vibe: "Magical worlds await" },
  { name: "Romance", icon: Heart, hue: 340, vibe: "Love in every chapter" },
  { name: "Sci-Fi", icon: Rocket, hue: 200, vibe: "Beyond the stars" },
  { name: "Horror", icon: Ghost, hue: 0, vibe: "Fear the unknown" },
  { name: "Comedy", icon: Laugh, hue: 45, vibe: "Laugh out loud" },
  { name: "Drama", icon: Drama, hue: 160, vibe: "Feel every emotion" },
  { name: "Adventure", icon: Compass, hue: 30, vibe: "Journey into the wild" },
];

export default function GenrePortals() {
  return (
    <section className="relative py-28 overflow-hidden">
      {/* Atmospheric background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 40% at 30% 40%, hsl(270 40% 8% / 0.3) 0%, transparent 60%), " +
            "radial-gradient(ellipse 40% 30% at 70% 60%, hsl(24 50% 8% / 0.3) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs uppercase tracking-[0.3em] text-primary/70 font-medium">
            Choose Your World
          </span>
          <h2
            className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl"
            style={{ fontFamily: "'Georgia', serif" }}
          >
            Genre Portals
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {genres.map((genre, i) => {
            const Icon = genre.icon;
            return (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/browse?genre=${genre.name}`}
                  className="group relative flex flex-col items-center gap-4 rounded-2xl p-6 md:p-8 transition-all duration-500 overflow-hidden border border-transparent hover:border-border/30"
                  style={{
                    background: `linear-gradient(145deg, hsl(${genre.hue} 25% 10% / 0.5) 0%, hsl(${genre.hue} 15% 6% / 0.3) 100%)`,
                  }}
                >
                  {/* Hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                    style={{
                      background: `radial-gradient(circle at 50% 30%, hsl(${genre.hue} 60% 40% / 0.2) 0%, transparent 60%)`,
                    }}
                  />

                  {/* Icon */}
                  <motion.div
                    className="relative flex h-14 w-14 items-center justify-center rounded-xl transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: `hsl(${genre.hue} 50% 20% / 0.5)`,
                      boxShadow: `0 0 0 1px hsl(${genre.hue} 40% 30% / 0.2)`,
                    }}
                    whileHover={{
                      boxShadow: `0 0 30px hsl(${genre.hue} 60% 50% / 0.3)`,
                    }}
                  >
                    <Icon
                      className="h-6 w-6 transition-all duration-500 group-hover:drop-shadow-lg"
                      style={{ color: `hsl(${genre.hue} 65% 60%)` }}
                    />
                  </motion.div>

                  {/* Text */}
                  <div className="relative text-center">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                      {genre.name}
                    </h3>
                    <p className="mt-1 text-[11px] text-muted-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {genre.vibe}
                    </p>
                  </div>

                  {/* Bottom light streak */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-2/3 transition-all duration-700"
                    style={{ background: `hsl(${genre.hue} 60% 50%)` }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
