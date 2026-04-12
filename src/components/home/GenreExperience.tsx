import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Sword, Sparkles, Heart, Rocket, Ghost, Laugh, Drama, Compass, Search, Skull } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const genres: { name: string; icon: LucideIcon; hue: number; description: string; mood: string }[] = [
  { name: "Fantasy", icon: Sparkles, hue: 270, description: "Magical realms & mythical quests", mood: "Enchanting" },
  { name: "Romance", icon: Heart, hue: 340, description: "Love stories that move the heart", mood: "Passionate" },
  { name: "Action", icon: Sword, hue: 24, description: "Adrenaline-fueled adventures", mood: "Intense" },
  { name: "Sci-Fi", icon: Rocket, hue: 200, description: "Futures beyond imagination", mood: "Mind-bending" },
  { name: "Horror", icon: Ghost, hue: 0, description: "Tales that haunt your dreams", mood: "Terrifying" },
  { name: "Mystery", icon: Search, hue: 260, description: "Puzzles waiting to be solved", mood: "Suspenseful" },
  { name: "Adventure", icon: Compass, hue: 30, description: "Journeys to unknown lands", mood: "Epic" },
  { name: "Thriller", icon: Skull, hue: 350, description: "Edge-of-seat suspense", mood: "Gripping" },
];

export default function GenreExperience() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Subtle ambient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: "radial-gradient(ellipse 80% 50% at 30% 50%, hsl(270 40% 20% / 0.15) 0%, transparent 50%), radial-gradient(ellipse 60% 40% at 80% 60%, hsl(24 60% 30% / 0.1) 0%, transparent 50%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Enter a World
          </h2>
          <p className="mt-2 text-muted-foreground">
            Every genre is a portal. Where will you go?
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {genres.map((genre, i) => {
            const Icon = genre.icon;
            return (
              <motion.div
                key={genre.name}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/browse?genre=${genre.name}`}
                  className="group relative flex flex-col items-center gap-4 rounded-2xl p-6 md:p-8 transition-all duration-500 overflow-hidden border border-border/40 bg-card hover:border-transparent"
                  style={{ minHeight: "180px" }}
                >
                  {/* Background glow on hover */}
                  <div
                    className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none rounded-2xl"
                    style={{
                      background: `
                        radial-gradient(circle at 50% 30%, hsl(${genre.hue} 60% 50% / 0.15) 0%, transparent 60%),
                        linear-gradient(135deg, hsl(${genre.hue} 30% 10% / 0.3) 0%, transparent 100%)
                      `,
                    }}
                  />

                  {/* Border glow on hover */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
                    style={{
                      boxShadow: `inset 0 0 0 1px hsl(${genre.hue} 60% 50% / 0.3), 0 0 40px hsl(${genre.hue} 60% 50% / 0.1)`,
                    }}
                  />

                  {/* Icon */}
                  <div className="relative">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:shadow-xl"
                      style={{
                        backgroundColor: `hsl(${genre.hue} 50% 50% / 0.1)`,
                      }}
                    >
                      <Icon
                        className="h-6 w-6 transition-all duration-300"
                        style={{ color: `hsl(${genre.hue} 60% 55%)` }}
                      />
                    </div>

                    {/* Glow ring on hover */}
                    <div
                      className="absolute -inset-3 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none blur-lg"
                      style={{ background: `hsl(${genre.hue} 60% 50% / 0.2)` }}
                    />
                  </div>

                  {/* Text */}
                  <div className="relative text-center space-y-1">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-white transition-colors duration-300">
                      {genre.name}
                    </h3>
                    <p className="text-[11px] text-muted-foreground group-hover:text-white/50 transition-colors duration-300 leading-relaxed">
                      {genre.description}
                    </p>
                  </div>

                  {/* Mood tag */}
                  <span
                    className="relative text-[10px] font-medium tracking-wider uppercase opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                    style={{ color: `hsl(${genre.hue} 60% 60%)` }}
                  >
                    {genre.mood}
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
