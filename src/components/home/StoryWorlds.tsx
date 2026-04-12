import { useTrendingNovels } from "@/hooks/useNovels";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, Star, ArrowRight } from "lucide-react";
import { useRef, useState, useCallback } from "react";
import type { Novel } from "@/hooks/useNovels";

const MOOD_MAP: Record<string, { label: string; hue: number }> = {
  Fantasy: { label: "Magical", hue: 270 },
  Romance: { label: "Emotional", hue: 340 },
  Action: { label: "Intense", hue: 24 },
  Horror: { label: "Dark", hue: 0 },
  "Sci-Fi": { label: "Futuristic", hue: 200 },
  Comedy: { label: "Lighthearted", hue: 45 },
  Drama: { label: "Deep", hue: 160 },
  Adventure: { label: "Epic", hue: 30 },
  Mystery: { label: "Suspenseful", hue: 260 },
  Thriller: { label: "Gripping", hue: 350 },
};

function getMood(genres: string[]) {
  for (const g of genres) {
    if (MOOD_MAP[g]) return MOOD_MAP[g];
  }
  return { label: "Captivating", hue: 24 };
}

function formatViews(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

function StoryWorldCard({ novel, index }: { novel: Novel; index: number }) {
  const mood = getMood(novel.genre);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -16;
    setTilt({ x, y });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/novel/${novel.id}`} className="group block">
        <div
          ref={cardRef}
          className="story-card-immersive rounded-2xl overflow-hidden"
          style={{
            transform: `perspective(800px) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`,
            transition: isHovered ? "transform 0.1s ease" : "transform 0.5s ease",
          }}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => {
            setIsHovered(false);
            setTilt({ x: 0, y: 0 });
          }}
        >
          {/* Cover image */}
          <div className="aspect-[3/4] relative">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, hsl(${mood.hue} 45% 28%) 0%, hsl(${(mood.hue + 40) % 360} 35% 18%) 100%)`,
              }}
            />
            {novel.cover_url && (
              <img
                src={novel.cover_url}
                alt={novel.title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
            )}

            {/* Hover glow effect */}
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 50%, hsl(${mood.hue} 70% 50% / 0.2) 0%, transparent 60%)`,
              }}
            />

            {/* Content overlay (always visible via ::after pseudo) */}
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-5">
              {/* Mood badge */}
              <motion.div
                className="mb-3 inline-flex items-center gap-2 self-start"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <span
                  className="mood-dot h-1.5 w-1.5 rounded-full"
                  style={{ background: `hsl(${mood.hue} 70% 60%)` }}
                />
                <span className="text-[10px] font-medium tracking-wider uppercase text-white/60">
                  {mood.label}
                </span>
              </motion.div>

              {/* Title */}
              <h3
                className="text-lg font-bold text-white leading-tight line-clamp-2"
                style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}
              >
                {novel.title}
              </h3>

              {/* Hook line */}
              <p className="mt-1 text-xs text-white/50 line-clamp-1">
                {novel.synopsis?.split('.')[0] || `A ${mood.label.toLowerCase()} tale by ${novel.author}`}
              </p>

              {/* Stats row */}
              <div className="mt-3 flex items-center gap-3 text-[11px] text-white/40">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" style={{ color: `hsl(${mood.hue} 70% 60%)` }} />
                  {novel.rating.toFixed(1)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatViews(novel.views)}
                </span>
                <ArrowRight className="ml-auto h-3.5 w-3.5 text-white/30 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function StoryWorlds() {
  const { data: novels, isLoading } = useTrendingNovels();

  return (
    <section className="py-20">
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
            Story Worlds
          </h2>
          <p className="mt-2 text-muted-foreground max-w-md mx-auto">
            Each story is a universe waiting to be explored. Find your next obsession.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
              ))
            : novels?.slice(0, 10).map((novel, i) => (
                <StoryWorldCard key={novel.id} novel={novel} index={i} />
              ))}
        </div>
      </div>
    </section>
  );
}
