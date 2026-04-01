import { useState } from "react";
import { Star, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNovelReviews, useCreateReview } from "@/hooks/useCommunity";
import { motion, AnimatePresence } from "framer-motion";

function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          disabled={readonly}
          className={`transition-transform ${readonly ? "cursor-default" : "cursor-pointer hover:scale-110"}`}
          onMouseEnter={() => !readonly && setHover(i)}
          onMouseLeave={() => !readonly && setHover(0)}
          onClick={() => onChange?.(i)}
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              (hover || value) >= i ? "fill-primary text-primary" : "text-muted-foreground/30"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewSection({ novelId }: { novelId: string }) {
  const { data: reviews } = useNovelReviews(novelId);
  const createReview = useCreateReview();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  const avgRating = reviews?.length
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const submit = () => {
    if (rating === 0 || !content.trim()) return;
    createReview.mutate({ novelId, rating, content: content.trim() }, {
      onSuccess: () => { setContent(""); setRating(0); setShowForm(false); },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-foreground">Reviews</h2>
          <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-semibold text-primary">{avgRating}</span>
            <span className="text-xs text-muted-foreground">({reviews?.length || 0})</span>
          </div>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)} className="gap-1.5">
          <MessageSquare className="h-4 w-4" />
          Write Review
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Your Rating</label>
                <StarRating value={rating} onChange={setRating} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Your Review</label>
                <Textarea
                  placeholder="Share your thoughts about this novel..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button size="sm" onClick={submit} disabled={createReview.isPending || rating === 0 || !content.trim()}>
                  {createReview.isPending ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {reviews?.map((review: any, i: number) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-xl border border-border/40 bg-card p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                  {review.user_id.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Reader</p>
                  <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <StarRating value={review.rating} readonly />
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{review.content}</p>
          </motion.div>
        ))}
        {reviews?.length === 0 && (
          <div className="text-center py-8 text-muted-foreground text-sm">No reviews yet. Be the first!</div>
        )}
      </div>
    </div>
  );
}
