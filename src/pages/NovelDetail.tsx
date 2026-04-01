import { useParams, Link } from "react-router-dom";
import { useNovel, useChapters } from "@/hooks/useNovels";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, Eye, BookOpen, Clock, ArrowLeft, Bookmark, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import NovelVoting from "@/components/community/NovelVoting";
import ReviewSection from "@/components/community/ReviewSection";
import CommentSection from "@/components/community/CommentSection";

function formatViews(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(1) + "K";
  return n.toString();
}

function coverGradient(title: string): string {
  const hash = title.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const hues = [24, 200, 160, 280, 340, 45, 120, 310, 220, 60];
  const hue = hues[hash % hues.length];
  return `linear-gradient(135deg, hsl(${hue}, 45%, 28%) 0%, hsl(${(hue + 40) % 360}, 35%, 18%) 100%)`;
}

export default function NovelDetail() {
  const { id } = useParams<{ id: string }>();
  const { data: novel, isLoading } = useNovel(id || "");
  const { data: chapters } = useChapters(id || "");
  const [showAllChapters, setShowAllChapters] = useState(false);

  if (isLoading) {
    return (
      <main className="min-h-screen py-10">
        <div className="mx-auto max-w-4xl px-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-6">
            <Skeleton className="h-72 w-48 rounded-xl" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!novel) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-foreground">Novel not found</p>
          <Link to="/browse">
            <Button variant="outline" size="sm" className="mt-4">
              Back to Browse
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const visibleChapters = showAllChapters
    ? chapters
    : chapters?.slice(0, 20);

  return (
    <main className="min-h-screen py-10">
      <div className="mx-auto max-w-4xl px-6">
        {/* Back */}
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Link
            to="/browse"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Browse
          </Link>
        </motion.div>

        <div className="flex flex-col gap-8 md:flex-row">
          {/* Cover */}
          <motion.div
            className="shrink-0"
            initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div
              className="aspect-[2/3] w-48 rounded-xl md:w-56"
              style={{ background: coverGradient(novel.title) }}
            >
              {novel.cover_url ? (
                <img src={novel.cover_url} alt={novel.title} className="h-full w-full rounded-xl object-cover" />
              ) : (
                <div className="flex h-full items-end p-4">
                  <p className="text-sm font-bold text-white/80" style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>
                    {novel.title}
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            className="flex-1 space-y-5"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground" style={{ textWrap: "balance" }}>
                {novel.title}
              </h1>
              <p className="mt-1 text-muted-foreground">by {novel.author}</p>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Star className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{novel.rating.toFixed(2)}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" />
                {formatViews(novel.views)} views
              </span>
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-4 w-4" />
                {novel.chapter_count} chapters
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span className="capitalize">{novel.status}</span>
              </span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2">
              {novel.genre.map((g) => (
                <Badge key={g} variant="secondary" className="border-0">
                  {g}
                </Badge>
              ))}
            </div>

            {/* Synopsis */}
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Synopsis
              </h2>
              <p className="text-sm leading-relaxed text-foreground/80" style={{ textWrap: "pretty" }}>
                {novel.synopsis || "No synopsis available."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 items-center">
              <Link to={`/novel/${novel.id}/chapter/1`}>
                <Button className="gap-2 active:scale-[0.97] transition-transform">
                  <BookOpen className="h-4 w-4" />
                  Start Reading
                </Button>
              </Link>
              <Button variant="outline" className="gap-2 active:scale-[0.97] transition-transform">
                <Bookmark className="h-4 w-4" />
                Add to Library
              </Button>
            </div>

            {/* Voting */}
            <NovelVoting novelId={novel.id} />
          </motion.div>
        </div>

        {/* Chapter List */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4">
            Chapters ({chapters?.length || novel.chapter_count})
          </h2>

          {chapters && chapters.length > 0 ? (
            <div className="space-y-1">
              {visibleChapters?.map((ch) => (
                <Link
                  key={ch.id}
                  to={`/novel/${novel.id}/chapter/${ch.chapter_number}`}
                  className="flex items-center justify-between rounded-lg border border-border/40 bg-card px-4 py-3 text-sm hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-muted-foreground w-8">
                      {ch.chapter_number}
                    </span>
                    <span className="text-foreground">{ch.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(ch.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))}

              {chapters.length > 20 && (
                <Button
                  variant="ghost"
                  className="w-full mt-2 gap-1 text-sm"
                  onClick={() => setShowAllChapters(!showAllChapters)}
                >
                  {showAllChapters ? (
                    <>
                      <ChevronUp className="h-4 w-4" /> Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4" /> Show All {chapters.length} Chapters
                    </>
                  )}
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-border/40 bg-card px-6 py-12 text-center">
              <p className="text-muted-foreground">No chapters available yet</p>
              <p className="mt-1 text-xs text-muted-foreground/60">Check back soon for updates</p>
            </div>
          )}
        </motion.div>
        {/* Reviews */}
        <motion.div
          className="mt-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <ReviewSection novelId={novel.id} />
        </motion.div>

        {/* Comments */}
        <motion.div
          className="mt-12 mb-12"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <CommentSection novelId={novel.id} />
        </motion.div>
      </div>
    </main>
  );
}
