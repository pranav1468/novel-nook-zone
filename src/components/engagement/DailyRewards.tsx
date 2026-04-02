import { useStreak } from "@/hooks/useEngagement";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Zap, Trophy, Star, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

export default function DailyRewards() {
  const { streak, isLoading, recordLogin } = useStreak();
  const [showReward, setShowReward] = useState(false);
  const [rewardData, setRewardData] = useState<{ streak: number; xp: number } | null>(null);

  if (isLoading || !streak) return null;

  const xpForNextLevel = Math.pow(streak.level, 2) * 100;
  const xpProgress = Math.min((streak.xp / xpForNextLevel) * 100, 100);
  const nextMilestone = STREAK_MILESTONES.find((m) => m > streak.current_streak) || 100;

  const handleClaim = () => {
    recordLogin.mutate(undefined, {
      onSuccess: (data) => {
        if (data?.isNew && data.xpGained > 0) {
          setRewardData({ streak: data.streak, xp: data.xpGained });
          setShowReward(true);
          setTimeout(() => setShowReward(false), 3000);
        }
      },
    });
  };

  return (
    <section className="mx-auto max-w-7xl px-6 py-8">
      <div className="rounded-2xl border border-border/60 bg-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-foreground">Daily Rewards</h3>
            <p className="text-xs text-muted-foreground">Keep your streak alive!</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {/* Streak */}
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <Flame className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{streak.current_streak}</p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>

          {/* Level */}
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <Star className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">Lv.{streak.level}</p>
            <p className="text-xs text-muted-foreground">{streak.xp} XP</p>
          </div>

          {/* Best */}
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <Trophy className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{streak.longest_streak}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </div>

          {/* Next milestone */}
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <Zap className="h-6 w-6 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold text-foreground">{nextMilestone}</p>
            <p className="text-xs text-muted-foreground">Next Milestone</p>
          </div>
        </div>

        {/* XP progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Level {streak.level}</span>
            <span>{streak.xp} / {xpForNextLevel} XP</span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Streak calendar preview */}
        <div className="mt-4 flex items-center gap-1.5">
          {Array.from({ length: 7 }).map((_, i) => {
            const dayOffset = 6 - i;
            const isFilled = dayOffset < streak.current_streak;
            return (
              <div
                key={i}
                className={`h-8 flex-1 rounded-md flex items-center justify-center text-xs font-medium transition-colors ${
                  isFilled
                    ? "bg-primary/20 text-primary border border-primary/30"
                    : "bg-muted/50 text-muted-foreground"
                }`}
              >
                {isFilled ? "✓" : "–"}
              </div>
            );
          })}
        </div>

        {/* Claim button */}
        <div className="mt-4 flex justify-center">
          <Button onClick={handleClaim} className="gap-2" disabled={recordLogin.isPending}>
            <Gift className="h-4 w-4" />
            Claim Daily Reward
          </Button>
        </div>
      </div>

      {/* Reward popup */}
      <AnimatePresence>
        {showReward && rewardData && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReward(false)}
          >
            <motion.div
              className="rounded-2xl border border-primary/30 bg-card p-8 text-center shadow-xl"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Flame className="h-16 w-16 text-primary mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                🔥 {rewardData.streak} Day Streak!
              </h3>
              <p className="text-primary font-semibold text-lg">+{rewardData.xp} XP</p>
              <p className="text-sm text-muted-foreground mt-2">Keep it up!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
