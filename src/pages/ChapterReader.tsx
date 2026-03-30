import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Settings2,
  Type,
  Minus,
  Plus,
  X,
  Palette,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";

const READER_THEMES = [
  { label: "Light", bg: "#ffffff", text: "#1a1a2e", card: "#f8f8f8", border: "#e2e2e2", accent: "#e8740c", muted: "#6b7280" },
  { label: "Dark", bg: "#141620", text: "#d4d4dc", card: "#1c1e2e", border: "#2a2d3e", accent: "#e8740c", muted: "#8b8fa0" },
  { label: "Sepia", bg: "#f4ecd8", text: "#5b4636", card: "#ede4cf", border: "#d4c9ad", accent: "#8b6914", muted: "#8a7b6b" },
  { label: "Forest", bg: "#1a2318", text: "#c8d6c0", card: "#222e1f", border: "#2e3d28", accent: "#6abf4b", muted: "#7a9470" },
  { label: "Ocean", bg: "#0f1926", text: "#b8cfe0", card: "#162030", border: "#1e3045", accent: "#3ba5d9", muted: "#6a8fa8" },
] as const;

type Chapter = {
  id: string;
  novel_id: string;
  chapter_number: number;
  title: string;
  content: string | null;
  created_at: string;
};

function useChapter(novelId: string, chapterNum: number) {
  return useQuery({
    queryKey: ["chapter", novelId, chapterNum],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("chapters")
        .select("*")
        .eq("novel_id", novelId)
        .eq("chapter_number", chapterNum)
        .single();
      if (error) throw error;
      return data as Chapter;
    },
    enabled: !!novelId && chapterNum > 0,
  });
}

function useNovelMeta(novelId: string) {
  return useQuery({
    queryKey: ["novel-meta", novelId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("novels")
        .select("id, title, chapter_count")
        .eq("id", novelId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!novelId,
  });
}

const FONTS = [
  { label: "Serif", value: "Georgia, 'Times New Roman', serif" },
  { label: "Sans", value: "system-ui, -apple-system, sans-serif" },
  { label: "Mono", value: "'Courier New', monospace" },
];

export default function ChapterReader() {
  const { id, chapter } = useParams<{ id: string; chapter: string }>();
  const navigate = useNavigate();
  const chapterNum = parseInt(chapter || "1", 10);

  const { data: chapterData, isLoading } = useChapter(id || "", chapterNum);
  const { data: novelMeta } = useNovelMeta(id || "");

  const [fontSize, setFontSize] = useState(18);
  const [fontIdx, setFontIdx] = useState(0);
  const [lineHeight, setLineHeight] = useState(1.8);
  const [showSettings, setShowSettings] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [readerThemeIdx, setReaderThemeIdx] = useState(() => {
    const saved = localStorage.getItem("novelhub-reader-theme");
    return saved ? parseInt(saved, 10) : 1; // default to Dark
  });

  const rt = READER_THEMES[readerThemeIdx];

  useEffect(() => {
    localStorage.setItem("novelhub-reader-theme", String(readerThemeIdx));
  }, [readerThemeIdx]);

  const totalChapters = novelMeta?.chapter_count || 0;
  const hasPrev = chapterNum > 1;
  const hasNext = chapterNum < totalChapters;

  const goTo = useCallback(
    (n: number) => navigate(`/novel/${id}/chapter/${n}`),
    [id, navigate]
  );

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrev) goTo(chapterNum - 1);
      if (e.key === "ArrowRight" && hasNext) goTo(chapterNum + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hasPrev, hasNext, chapterNum, goTo]);

  // Reading progress
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll to top on chapter change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [chapterNum]);

  if (isLoading) {
    return (
      <main className="min-h-screen py-16">
        <div className="mx-auto max-w-2xl px-6 space-y-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-3/4" />
          <div className="space-y-3 mt-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (!chapterData) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-medium text-foreground">
            Chapter not found
          </p>
          <Link to={`/novel/${id}`}>
            <Button variant="outline" size="sm">
              Back to Novel
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Reading progress bar */}
      <div
        className="fixed top-0 left-0 h-[3px] z-[70] bg-primary origin-left"
        style={{ transform: `scaleX(${scrollProgress / 100})` }}
      />

      <main className="min-h-screen py-12 md:py-16">
        <div className="mx-auto max-w-2xl px-6">
          {/* Top nav */}
          <motion.div
            className="flex items-center justify-between mb-8"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to={`/novel/${id}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              {novelMeta?.title || "Back"}
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className="relative"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
          </motion.div>

          {/* Settings panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-8"
              >
                <div className="rounded-xl border border-border bg-card p-5 space-y-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-foreground">
                      Reading Settings
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setShowSettings(false)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Font family */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                      <Type className="h-3.5 w-3.5" /> Font
                    </label>
                    <div className="flex gap-2">
                      {FONTS.map((f, i) => (
                        <Button
                          key={f.label}
                          variant={fontIdx === i ? "default" : "outline"}
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => setFontIdx(i)}
                        >
                          {f.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Font size */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Size: {fontSize}px
                    </label>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setFontSize((s) => Math.max(12, s - 1))}
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <Slider
                        value={[fontSize]}
                        min={12}
                        max={28}
                        step={1}
                        onValueChange={([v]) => setFontSize(v)}
                        className="flex-1"
                      />
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setFontSize((s) => Math.min(28, s + 1))}
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Line height */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-muted-foreground">
                      Line Height: {lineHeight.toFixed(1)}
                    </label>
                    <Slider
                      value={[lineHeight]}
                      min={1.2}
                      max={2.4}
                      step={0.1}
                      onValueChange={([v]) => setLineHeight(v)}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter header */}
          <motion.div
            className="mb-10"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-medium uppercase tracking-widest text-primary mb-2">
              Chapter {chapterData.chapter_number}
            </p>
            <h1
              className="text-2xl md:text-3xl font-bold text-foreground"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              {chapterData.title}
            </h1>
          </motion.div>

          {/* Chapter content */}
          <motion.article
            className="prose prose-neutral dark:prose-invert max-w-none"
            style={{
              fontFamily: FONTS[fontIdx].value,
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {chapterData.content ? (
              chapterData.content.split("\n\n").map((para, i) => (
                <p key={i} className="mb-6 text-foreground/85">
                  {para}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground italic">
                This chapter has no content yet.
              </p>
            )}
          </motion.article>

          {/* Bottom navigation */}
          <motion.div
            className="mt-16 flex items-center justify-between border-t border-border pt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="outline"
              className="gap-2"
              disabled={!hasPrev}
              onClick={() => hasPrev && goTo(chapterNum - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <span className="text-xs text-muted-foreground">
              {chapterNum} / {totalChapters}
            </span>

            <Button
              className="gap-2"
              disabled={!hasNext}
              onClick={() => hasNext && goTo(chapterNum + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      </main>
    </>
  );
}
