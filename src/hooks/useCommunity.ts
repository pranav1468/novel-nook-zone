import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ── Votes ──
export function useNovelVotes(novelId: string) {
  return useQuery({
    queryKey: ["novel-votes", novelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novel_votes")
        .select("*")
        .eq("novel_id", novelId);
      if (error) throw error;
      const ups = data.filter((v: any) => v.vote_type === "up").length;
      const downs = data.filter((v: any) => v.vote_type === "down").length;
      return { votes: data, ups, downs, total: ups - downs };
    },
    enabled: !!novelId,
  });
}

export function useVoteNovel() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ novelId, voteType }: { novelId: string; voteType: "up" | "down" }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      const { data: existing } = await supabase
        .from("novel_votes")
        .select("*")
        .eq("novel_id", novelId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        if (existing.vote_type === voteType) {
          await supabase.from("novel_votes").delete().eq("id", existing.id);
          return "removed";
        } else {
          await supabase.from("novel_votes").update({ vote_type: voteType }).eq("id", existing.id);
          return "changed";
        }
      } else {
        await supabase.from("novel_votes").insert({ novel_id: novelId, user_id: user.id, vote_type: voteType });
        return "added";
      }
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["novel-votes", vars.novelId] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// ── Reviews ──
export function useNovelReviews(novelId: string) {
  return useQuery({
    queryKey: ["novel-reviews", novelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novel_reviews")
        .select("*")
        .eq("novel_id", novelId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!novelId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ novelId, rating, content }: { novelId: string; rating: number; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");
      const { error } = await supabase.from("novel_reviews").insert({
        novel_id: novelId, user_id: user.id, rating, content,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["novel-reviews", vars.novelId] });
      toast({ title: "Review submitted!" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// ── Comments ──
export function useNovelComments(novelId: string) {
  return useQuery({
    queryKey: ["novel-comments", novelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novel_comments")
        .select("*")
        .eq("novel_id", novelId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!novelId,
  });
}

export function useCreateComment() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async ({ novelId, content, parentId }: { novelId: string; content: string; parentId?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");
      const { error } = await supabase.from("novel_comments").insert({
        novel_id: novelId, user_id: user.id, content, parent_id: parentId || null,
      });
      if (error) throw error;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["novel-comments", vars.novelId] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// ── Requests ──
export function useNovelRequests() {
  return useQuery({
    queryKey: ["novel-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novel_requests")
        .select("*")
        .order("vote_count", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (payload: { title: string; description?: string; original_language?: string; source_url?: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");
      const { error } = await supabase.from("novel_requests").insert({ ...payload, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["novel-requests"] });
      toast({ title: "Request submitted!" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

export function useVoteRequest() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (requestId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      const { data: existing } = await supabase
        .from("request_votes")
        .select("*")
        .eq("request_id", requestId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        await supabase.from("request_votes").delete().eq("id", existing.id);
      } else {
        await supabase.from("request_votes").insert({ request_id: requestId, user_id: user.id });
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["novel-requests"] });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}

// ── Contributions ──
export function useMyContributions() {
  return useQuery({
    queryKey: ["my-contributions"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("contributions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useCreateContribution() {
  const qc = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: async (payload: {
      novel_id?: string;
      contribution_type: "translation" | "editing" | "proofreading";
      language_from?: string;
      language_to?: string;
      message: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");
      const { error } = await supabase.from("contributions").insert({ ...payload, user_id: user.id });
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-contributions"] });
      toast({ title: "Application submitted!" });
    },
    onError: (err: any) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });
}
