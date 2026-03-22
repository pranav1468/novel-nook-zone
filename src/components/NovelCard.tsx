import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Eye, Star, BookOpen } from "lucide-react";
import { type Novel } from "@/hooks/useNovels";
import { motion } from "framer-motion";

function formatViews(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

// Generate a deterministic color from title for placeholder covers
function coverGradient(title: string): string {
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [24, 200, 160, 280, 340, 45, 120, 310, 220, 60];
  const hue = hues[hash % hues.length];
  return `linear-gradient(135deg, hsl(${hue}, 45%, 28%) 0%, hsl(${(hue + 40) % 360}, 35%, 18%) 100%)`;
}

interface NovelCardProps {
  novel: Novel;
  index?: number;
  size?: "default" | "compact";
}

export default function NovelCard({ novel, index = 0, size = "default" }: NovelCardProps) {
  const isCompact = size === "compact";

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/novel/${novel.id}`}
        className="group block rounded-lg transition-[box-shadow] duration-200 hover:shadow-lg hover:shadow-primary/5"
      >
        {/* Cover */}
        <div
          className={`relative overflow-hidden rounded-lg ${isCompact ? "aspect-[3/4]" : "aspect-[2/3]"}`}
          style={{ background: coverGradient(novel.title) }}
        >
          {novel.cover_url && (
            <img
              src={novel.cover_url}
              alt={novel.title}
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
          )}

          {/* Title on cover */}
          <div className="absolute inset-0 flex flex-col justify-end p-3">
            <p
              className="text-xs font-bold uppercase tracking-wider text-white/90"
              style={{ textShadow: "0 1px 4px rgba(0,0,0,0.6)" }}
            >
              {novel.title}
            </p>
          </div>

          {/* Status badge */}
          <div className="absolute right-2 top-2">
            <Badge
              variant="secondary"
              className="text-[10px] capitalize bg-background/80 text-foreground backdrop-blur-sm border-0"
            >
              {novel.status}
            </Badge>
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-primary/10 opacity-0 transition-opacity group-hover:opacity-100" />
        </div>

        {/* Info */}
        <div className={`mt-2.5 space-y-1 ${isCompact ? "px-0" : ""}`}>
          <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {novel.title}
          </h3>
          <p className="text-xs text-muted-foreground">{novel.author}</p>

          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Star className="h-3 w-3 text-primary/70" />
              {novel.rating.toFixed(1)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {formatViews(novel.views)}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {novel.chapter_count}
            </span>
          </div>

          {!isCompact && novel.genre.length > 0 && (
            <div className="flex flex-wrap gap-1 pt-1">
              {novel.genre.slice(0, 2).map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground"
                >
                  {g}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
