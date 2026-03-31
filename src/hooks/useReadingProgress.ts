import { useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useReadingProgress(novelId: string, chapterNum: number, scrollProgress: number) {
  const queryClient = useQueryClient();
  const lastSaved = useRef({ chapter: 0, scroll: 0 });

  // Fetch current user
  const { data: session } = useQuery({
    queryKey: ["auth-session"],
    queryFn: async () => {
      const { data } = await supabase.auth.getSession();
      return data.session;
    },
    staleTime: 60_000,
  });

  const userId = session?.user?.id;

  // Fetch saved progress
  const { data: savedProgress } = useQuery({
    queryKey: ["reading-progress", novelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reading_progress")
        .select("*")
        .eq("user_id", userId!)
        .eq("novel_id", novelId)
        .single();
      if (error && error.code !== "PGRST116") throw error;
      return data;
    },
    enabled: !!userId && !!novelId,
  });

  // Upsert progress
  const mutation = useMutation({
    mutationFn: async ({ chapter, scroll }: { chapter: number; scroll: number }) => {
      if (!userId) return;
      const { error } = await supabase
        .from("reading_progress")
        .upsert(
          {
            user_id: userId,
            novel_id: novelId,
            chapter_number: chapter,
            scroll_position: scroll,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,novel_id" }
        );
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reading-progress", novelId] });
    },
  });

  // Auto-save every 10 seconds if changed
  useEffect(() => {
    if (!userId) return;
    const interval = setInterval(() => {
      if (
        lastSaved.current.chapter !== chapterNum ||
        Math.abs(lastSaved.current.scroll - scrollProgress) > 3
      ) {
        lastSaved.current = { chapter: chapterNum, scroll: scrollProgress };
        mutation.mutate({ chapter: chapterNum, scroll: scrollProgress });
      }
    }, 10_000);
    return () => clearInterval(interval);
  }, [userId, chapterNum, scrollProgress, mutation]);

  // Save on unmount
  useEffect(() => {
    if (!userId) return;
    return () => {
      mutation.mutate({ chapter: chapterNum, scroll: scrollProgress });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const saveNow = useCallback(() => {
    if (!userId) return;
    mutation.mutate({ chapter: chapterNum, scroll: scrollProgress });
  }, [userId, chapterNum, scrollProgress, mutation]);

  return { savedProgress, saveNow, isLoggedIn: !!userId };
}
