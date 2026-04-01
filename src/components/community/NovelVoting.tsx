import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNovelVotes, useVoteNovel } from "@/hooks/useCommunity";
import { motion, AnimatePresence } from "framer-motion";

export default function NovelVoting({ novelId }: { novelId: string }) {
  const { data } = useNovelVotes(novelId);
  const voteMut = useVoteNovel();

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs"
        onClick={() => voteMut.mutate({ novelId, voteType: "up" })}
        disabled={voteMut.isPending}
      >
        <ThumbsUp className="h-3.5 w-3.5" />
        <AnimatePresence mode="wait">
          <motion.span
            key={data?.ups ?? 0}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {data?.ups ?? 0}
          </motion.span>
        </AnimatePresence>
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="gap-1.5 text-xs"
        onClick={() => voteMut.mutate({ novelId, voteType: "down" })}
        disabled={voteMut.isPending}
      >
        <ThumbsDown className="h-3.5 w-3.5" />
        <AnimatePresence mode="wait">
          <motion.span
            key={data?.downs ?? 0}
            initial={{ y: -8, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 8, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {data?.downs ?? 0}
          </motion.span>
        </AnimatePresence>
      </Button>
      <span className="text-xs text-muted-foreground ml-1">
        Score: <span className="font-semibold text-foreground">{data?.total ?? 0}</span>
      </span>
    </div>
  );
}
