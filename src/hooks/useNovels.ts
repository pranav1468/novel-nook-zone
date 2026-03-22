import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Novel = {
  id: string;
  title: string;
  author: string;
  synopsis: string | null;
  cover_url: string | null;
  genre: string[];
  status: "ongoing" | "completed" | "hiatus";
  chapter_count: number;
  views: number;
  rating: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export function useNovels() {
  return useQuery({
    queryKey: ["novels"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novels")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Novel[];
    },
  });
}

export function useNovel(id: string) {
  return useQuery({
    queryKey: ["novel", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novels")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data as Novel;
    },
    enabled: !!id,
  });
}

export function useChapters(novelId: string) {
  return useQuery({
    queryKey: ["chapters", novelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("novel_id", novelId)
        .order("chapter_number", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!novelId,
  });
}

export function useTrendingNovels() {
  return useQuery({
    queryKey: ["novels", "trending"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novels")
        .select("*")
        .order("views", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data as Novel[];
    },
  });
}

export function useFeaturedNovels() {
  return useQuery({
    queryKey: ["novels", "featured"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novels")
        .select("*")
        .eq("featured", true)
        .order("rating", { ascending: false });
      if (error) throw error;
      return data as Novel[];
    },
  });
}

export function useRecentNovels() {
  return useQuery({
    queryKey: ["novels", "recent"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novels")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return data as Novel[];
    },
  });
}
