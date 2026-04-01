import { useState } from "react";
import { MessageCircle, Reply, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNovelComments, useCreateComment } from "@/hooks/useCommunity";
import { motion, AnimatePresence } from "framer-motion";

type Comment = {
  id: string;
  user_id: string;
  novel_id: string;
  parent_id: string | null;
  content: string;
  likes_count: number;
  created_at: string;
};

function CommentItem({
  comment,
  replies,
  allComments,
  novelId,
  depth = 0,
}: {
  comment: Comment;
  replies: Comment[];
  allComments: Comment[];
  novelId: string;
  depth?: number;
}) {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState("");
  const createComment = useCreateComment();

  const submitReply = () => {
    if (!replyText.trim()) return;
    createComment.mutate(
      { novelId, content: replyText.trim(), parentId: comment.id },
      { onSuccess: () => { setReplyText(""); setShowReply(false); } }
    );
  };

  const timeAgo = (d: string) => {
    const diff = Date.now() - new Date(d).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className={depth > 0 ? "ml-6 border-l-2 border-border/30 pl-4" : ""}>
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        className="py-3"
      >
        <div className="flex items-start gap-3">
          <div className="h-8 w-8 shrink-0 rounded-full bg-accent flex items-center justify-center text-xs font-bold text-accent-foreground">
            {comment.user_id.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-foreground">Reader</span>
              <span className="text-xs text-muted-foreground">{timeAgo(comment.created_at)}</span>
            </div>
            <p className="text-sm text-foreground/80 mt-1 leading-relaxed">{comment.content}</p>
            <div className="flex items-center gap-3 mt-2">
              {depth < 3 && (
                <button
                  onClick={() => setShowReply(!showReply)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  <Reply className="h-3 w-3" />
                  Reply
                </button>
              )}
            </div>

            <AnimatePresence>
              {showReply && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mt-2"
                >
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      className="min-h-[60px] resize-none text-sm"
                    />
                    <Button
                      size="icon"
                      onClick={submitReply}
                      disabled={!replyText.trim() || createComment.isPending}
                      className="shrink-0"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {replies.map((r) => (
        <CommentItem
          key={r.id}
          comment={r}
          replies={allComments.filter((c) => c.parent_id === r.id)}
          allComments={allComments}
          novelId={novelId}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}

export default function CommentSection({ novelId }: { novelId: string }) {
  const { data: comments } = useNovelComments(novelId);
  const createComment = useCreateComment();
  const [text, setText] = useState("");

  const rootComments = comments?.filter((c: Comment) => !c.parent_id) || [];

  const submit = () => {
    if (!text.trim()) return;
    createComment.mutate(
      { novelId, content: text.trim() },
      { onSuccess: () => setText("") }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-bold text-foreground">Discussion</h2>
        <span className="text-sm text-muted-foreground">({comments?.length || 0})</span>
      </div>

      <div className="flex gap-2">
        <Textarea
          placeholder="Join the discussion..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        <Button
          onClick={submit}
          disabled={!text.trim() || createComment.isPending}
          className="shrink-0 self-end"
        >
          <Send className="h-4 w-4 mr-1.5" />
          Post
        </Button>
      </div>

      <div className="divide-y divide-border/30">
        {rootComments.map((c: Comment) => (
          <CommentItem
            key={c.id}
            comment={c}
            replies={(comments || []).filter((r: Comment) => r.parent_id === c.id)}
            allComments={comments || []}
            novelId={novelId}
          />
        ))}
        {rootComments.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">
            No comments yet. Start the conversation!
          </div>
        )}
      </div>
    </div>
  );
}
