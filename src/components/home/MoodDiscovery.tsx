import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const moods = [
  { label: "Something Dark", emoji: "🌑", genres: ["Horror", "Thriller", "Mystery"], hue: 0, desc: "Eerie tales & unsettling twists" },
  { label: "Feel Good", emoji: "☀️", genres: ["Comedy", "Romance"], hue: 45, desc: "Warm stories to lift your spirits" },
  { label: "Epic Journey", emoji: "⚔️", genres: ["Fantasy", "Adventure", "Action"], hue: 270, desc: "Grand quests & legendary heroes" },
  { label: "Mind-Bending", emoji: "🧠", genres: ["Sci-Fi", "Mystery"], hue: 200, desc: "Stories that challenge reality" },
  { label: "Heart-Racing", emoji: "💓", genres: ["Action", "Thriller"], hue: 24, desc: "Non-stop adrenaline & suspense" },
  { label: "Tearjerker", emoji: "🥺", genres: ["Romance", "Drama"], hue: 340, desc: "Emotional stories that stay with you" },
];

export default function MoodDiscovery() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2
            className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            What's Your Mood?
          </h2>
          <p className="mt-2 text-muted-foreground">
            Tell us how you feel. We'll find the perfect story.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {moods.map((mood, i) => (
            <motion.div
              key={mood.label}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link
                to={`/browse?genre=${mood.genres[0]}`}
                className="group relative flex flex-col items-center justify-center rounded-2xl p-8 md:p-10 text-center transition-all duration-500 border border-border/40 bg-card overflow-hidden"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Background effect */}
                <div
                  className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, hsl(${mood.hue} 50% 40% / 0.15) 0%, transparent 70%)`,
                  }}
                />

                {/* Emoji */}
                <motion.span
                  className="text-4xl md:text-5xl mb-4 block"
                  animate={{
                    scale: hoveredIdx === i ? 1.2 : 1,
                    y: hoveredIdx === i ? -5 : 0,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 15 }}
                >
                  {mood.emoji}
                </motion.span>

                <h3 className="relative text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                  {mood.label}
                </h3>
                <p className="relative mt-1 text-xs text-muted-foreground leading-relaxed max-w-[180px]">
                  {mood.desc}
                </p>

                {/* Genre tags */}
                <div className="relative mt-3 flex flex-wrap gap-1 justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0">
                  {mood.genres.map((g) => (
                    <span
                      key={g}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        background: `hsl(${mood.hue} 50% 50% / 0.1)`,
                        color: `hsl(${mood.hue} 60% 55%)`,
                      }}
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
