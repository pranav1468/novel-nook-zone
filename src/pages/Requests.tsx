import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Plus, Globe, Link as LinkIcon, Clock, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useNovelRequests, useCreateRequest, useVoteRequest } from "@/hooks/useCommunity";

const statusConfig: Record<string, { icon: any; color: string; label: string }> = {
  pending: { icon: Clock, color: "text-yellow-500", label: "Pending" },
  approved: { icon: CheckCircle, color: "text-green-500", label: "Approved" },
  in_progress: { icon: Loader2, color: "text-blue-500", label: "In Progress" },
  completed: { icon: CheckCircle, color: "text-primary", label: "Completed" },
  rejected: { icon: Clock, color: "text-destructive", label: "Rejected" },
};

export default function Requests() {
  const { data: requests, isLoading } = useNovelRequests();
  const createRequest = useCreateRequest();
  const voteRequest = useVoteRequest();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");

  const submit = () => {
    if (!title.trim()) return;
    createRequest.mutate(
      {
        title: title.trim(),
        description: description.trim() || undefined,
        original_language: language.trim() || undefined,
        source_url: sourceUrl.trim() || undefined,
      },
      {
        onSuccess: () => {
          setTitle(""); setDescription(""); setLanguage(""); setSourceUrl("");
          setShowForm(false);
        },
      }
    );
  };

  return (
    <main className="min-h-screen py-10">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2">Novel Requests</h1>
          <p className="text-muted-foreground">
            Request novels you'd like to see on the platform. Vote to help prioritize!
          </p>
        </motion.div>

        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowForm(!showForm)} className="gap-1.5">
            <Plus className="h-4 w-4" />
            New Request
          </Button>
        </div>

        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
                <Input placeholder="Novel title *" value={title} onChange={(e) => setTitle(e.target.value)} />
                <Textarea
                  placeholder="Why should we add this novel? (optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[80px] resize-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Original language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Source URL"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button size="sm" onClick={submit} disabled={!title.trim() || createRequest.isPending}>
                    {createRequest.isPending ? "Submitting..." : "Submit Request"}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-3">
          {isLoading && Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
          ))}

          {requests?.map((req: any, i: number) => {
            const status = statusConfig[req.status] || statusConfig.pending;
            const StatusIcon = status.icon;
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="flex items-center gap-4 rounded-xl border border-border/40 bg-card p-4 hover:border-primary/30 transition-colors"
              >
                <button
                  onClick={() => voteRequest.mutate(req.id)}
                  className="flex flex-col items-center gap-0.5 shrink-0 group"
                >
                  <ArrowUp className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="text-sm font-bold text-foreground">{req.vote_count}</span>
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground truncate">{req.title}</h3>
                    <Badge variant="outline" className="shrink-0 gap-1 text-xs">
                      <StatusIcon className={`h-3 w-3 ${status.color}`} />
                      {status.label}
                    </Badge>
                  </div>
                  {req.description && (
                    <p className="text-sm text-muted-foreground line-clamp-1">{req.description}</p>
                  )}
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    {req.original_language && <span>🌐 {req.original_language}</span>}
                    <span>{new Date(req.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {requests?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg mb-2">No requests yet</p>
              <p className="text-sm">Be the first to request a novel!</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
