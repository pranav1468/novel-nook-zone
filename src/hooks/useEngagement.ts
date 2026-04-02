import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

// ─── Streak System ─────────────────────────────────────
export function useStreak() {
  const queryClient = useQueryClient();

  const { data: streak, isLoading } = useQuery({
    queryKey: ["user-streak"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const recordLogin = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const today = new Date().toISOString().split("T")[0];
      const { data: existing } = await supabase
        .from("user_streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (!existing) {
        await supabase.from("user_streaks").insert({
          user_id: user.id,
          current_streak: 1,
          longest_streak: 1,
          last_login_date: today,
          total_logins: 1,
          xp: 5,
          level: 1,
        });
        return { isNew: true, streak: 1, xpGained: 5 };
      }

      if (existing.last_login_date === today) {
        return { isNew: false, streak: existing.current_streak, xpGained: 0 };
      }

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];

      const isConsecutive = existing.last_login_date === yesterdayStr;
      const newStreak = isConsecutive ? existing.current_streak + 1 : 1;
      const xpGained = Math.min(5 + newStreak * 2, 50); // streak bonus
      const newXP = existing.xp + xpGained;
      const newLevel = Math.floor(Math.sqrt(newXP / 100)) + 1;

      await supabase
        .from("user_streaks")
        .update({
          current_streak: newStreak,
          longest_streak: Math.max(newStreak, existing.longest_streak),
          last_login_date: today,
          total_logins: existing.total_logins + 1,
          xp: newXP,
          level: newLevel,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      return { isNew: true, streak: newStreak, xpGained };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-streak"] });
    },
  });

  return { streak, isLoading, recordLogin };
}

// ─── Achievements ──────────────────────────────────────
export function useAchievements() {
  const { data: allAchievements } = useQuery({
    queryKey: ["achievements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("achievements")
        .select("*")
        .order("category");
      if (error) throw error;
      return data;
    },
  });

  const { data: userAchievements } = useQuery({
    queryKey: ["user-achievements"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("user_achievements")
        .select("*, achievements(*)")
        .eq("user_id", user.id);
      if (error) throw error;
      return data;
    },
  });

  return { allAchievements, userAchievements };
}

export function useCheckAchievements() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const [
        { data: achievements },
        { data: earned },
        { data: streak },
        { data: progress },
        { data: reviews },
        { data: comments },
        { data: library },
        { data: lists },
        { data: votes },
      ] = await Promise.all([
        supabase.from("achievements").select("*"),
        supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id),
        supabase.from("user_streaks").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("reading_progress").select("*").eq("user_id", user.id),
        supabase.from("novel_reviews").select("id").eq("user_id", user.id),
        supabase.from("novel_comments").select("id").eq("user_id", user.id),
        supabase.from("user_libraries").select("id").eq("user_id", user.id),
        supabase.from("reading_lists").select("id").eq("user_id", user.id),
        supabase.from("novel_votes").select("id").eq("user_id", user.id),
      ]);

      const earnedIds = new Set((earned || []).map((e) => e.achievement_id));
      const stats: Record<string, number> = {
        chapters_read: progress?.length || 0,
        total_logins: streak?.total_logins || 0,
        login_streak: streak?.current_streak || 0,
        reviews_written: reviews?.length || 0,
        comments_posted: comments?.length || 0,
        novels_bookmarked: library?.length || 0,
        lists_created: lists?.length || 0,
        votes_cast: votes?.length || 0,
        genres_explored: new Set(progress?.map((p) => p.novel_id) || []).size,
      };

      const newlyEarned: string[] = [];
      for (const ach of achievements || []) {
        if (earnedIds.has(ach.id)) continue;
        if ((stats[ach.requirement_type] || 0) >= ach.requirement_value) {
          await supabase.from("user_achievements").insert({
            user_id: user.id,
            achievement_id: ach.id,
          });
          // Add XP
          if (streak) {
            const newXP = streak.xp + ach.xp_reward;
            await supabase.from("user_streaks").update({
              xp: newXP,
              level: Math.floor(Math.sqrt(newXP / 100)) + 1,
            }).eq("user_id", user.id);
          }
          newlyEarned.push(ach.name);
        }
      }

      return newlyEarned;
    },
    onSuccess: (earned) => {
      if (earned && earned.length > 0) {
        toast({
          title: "🏆 Achievement Unlocked!",
          description: earned.join(", "),
        });
        queryClient.invalidateQueries({ queryKey: ["user-achievements"] });
        queryClient.invalidateQueries({ queryKey: ["user-streak"] });
      }
    },
  });
}

// ─── Reading Lists ─────────────────────────────────────
export function useReadingLists() {
  const queryClient = useQueryClient();

  const { data: lists, isLoading } = useQuery({
    queryKey: ["reading-lists"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("reading_lists")
        .select("*, reading_list_items(*, novels(*))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createList = useMutation({
    mutationFn: async ({ name, description, isPublic }: { name: string; description?: string; isPublic?: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("reading_lists").insert({
        user_id: user.id,
        name,
        description: description || null,
        is_public: isPublic || false,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reading-lists"] }),
  });

  const addToList = useMutation({
    mutationFn: async ({ listId, novelId }: { listId: string; novelId: string }) => {
      const { error } = await supabase.from("reading_list_items").insert({
        list_id: listId,
        novel_id: novelId,
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reading-lists"] }),
  });

  const removeFromList = useMutation({
    mutationFn: async ({ listId, novelId }: { listId: string; novelId: string }) => {
      const { error } = await supabase
        .from("reading_list_items")
        .delete()
        .eq("list_id", listId)
        .eq("novel_id", novelId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reading-lists"] }),
  });

  const deleteList = useMutation({
    mutationFn: async (listId: string) => {
      const { error } = await supabase.from("reading_lists").delete().eq("id", listId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reading-lists"] }),
  });

  return { lists, isLoading, createList, addToList, removeFromList, deleteList };
}

// ─── Notification Preferences ──────────────────────────
export function useNotificationPrefs() {
  const queryClient = useQueryClient();

  const { data: prefs } = useQuery({
    queryKey: ["notification-prefs"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data, error } = await supabase
        .from("notification_preferences")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const updatePrefs = useMutation({
    mutationFn: async (updates: { new_chapters?: boolean; recommendations?: boolean; achievements?: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: existing } = await supabase
        .from("notification_preferences")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("notification_preferences").update(updates).eq("user_id", user.id);
      } else {
        await supabase.from("notification_preferences").insert({ user_id: user.id, ...updates });
      }
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notification-prefs"] }),
  });

  return { prefs, updatePrefs };
}

// ─── Auto-record login on auth state change ────────────
export function useAutoLogin() {
  const { recordLogin } = useStreak();
  const checkAchievements = useCheckAchievements();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        recordLogin.mutate(undefined, {
          onSuccess: () => {
            checkAchievements.mutate();
          },
        });
      }
    });
    return () => subscription.unsubscribe();
  }, []);
}
