import { useAchievements } from "@/hooks/useEngagement";
import { motion } from "framer-motion";
import {
  BookOpen, Book, GraduationCap, Library, LogIn, Flame, Zap, Crown,
  MessageSquare, Star, MessageCircle, Bookmark, List, ThumbsUp, Compass, Trophy,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "book-open": BookOpen,
  book: Book,
  "graduation-cap": GraduationCap,
  library: Library,
  "log-in": LogIn,
  flame: Flame,
  zap: Zap,
  crown: Crown,
  "message-square": MessageSquare,
  star: Star,
  "message-circle": MessageCircle,
  bookmark: Bookmark,
  list: List,
  "thumbs-up": ThumbsUp,
  compass: Compass,
  trophy: Trophy,
};

const CATEGORY_COLORS: Record<string, string> = {
  reading: "from-blue-500/20 to-blue-600/5 border-blue-500/20",
  streak: "from-orange-500/20 to-orange-600/5 border-orange-500/20",
  community: "from-purple-500/20 to-purple-600/5 border-purple-500/20",
  collection: "from-emerald-500/20 to-emerald-600/5 border-emerald-500/20",
  general: "from-primary/20 to-primary/5 border-primary/20",
};

export default function AchievementBadges() {
  const { allAchievements, userAchievements } = useAchievements();

  if (!allAchievements) return null;

  const earnedIds = new Set((userAchievements || []).map((ua: any) => ua.achievement_id));
  const categories = [...new Set(allAchievements.map((a) => a.category))];

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Trophy className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground">Achievements</h3>
          <p className="text-xs text-muted-foreground">
            {earnedIds.size} / {allAchievements.length} unlocked
          </p>
        </div>
      </div>

      {categories.map((cat) => (
        <div key={cat} className="mb-6">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3 capitalize">
            {cat}
          </h4>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {allAchievements
              .filter((a) => a.category === cat)
              .map((ach, i) => {
                const isEarned = earnedIds.has(ach.id);
                const IconComp = ICON_MAP[ach.icon] || Trophy;
                const colorClass = CATEGORY_COLORS[ach.category] || CATEGORY_COLORS.general;

                return (
                  <motion.div
                    key={ach.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`relative rounded-xl border p-4 text-center transition-all ${
                      isEarned
                        ? `bg-gradient-to-b ${colorClass}`
                        : "bg-muted/30 border-border/40 opacity-50 grayscale"
                    }`}
                  >
                    <IconComp className={`h-8 w-8 mx-auto mb-2 ${isEarned ? "text-primary" : "text-muted-foreground"}`} />
                    <p className="text-xs font-semibold text-foreground truncate">{ach.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">{ach.description}</p>
                    <p className="text-[10px] text-primary font-medium mt-1">+{ach.xp_reward} XP</p>
                    {isEarned && (
                      <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-[10px] text-primary-foreground">✓</span>
                      </div>
                    )}
                  </motion.div>
                );
              })}
          </div>
        </div>
      ))}
    </section>
  );
}
