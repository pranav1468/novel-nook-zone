import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  Eye,
  EyeOff,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import AutoScrollTTS from "@/components/reader/AutoScrollTTS";
import { useReadingProgress } from "@/hooks/useReadingProgress";

const READER_THEMES = [
  { label: "Light", bg: "#ffffff", text: "#1a1a2e", card: "#f8f8f8", border: "#e2e2e2", accent: "#e8740c", muted: "#6b7280", ambientHue: 30 },
  { label: "Dark", bg: "#0a0c14", text: "#d4d4dc", card: "#12141f", border: "#1e2030", accent: "#e8740c", muted: "#8b8fa0", ambientHue: 225 },
  { label: "Sepia", bg: "#f4ecd8", text: "#5b4636", card: "#ede4cf", border: "#d4c9ad", accent: "#8b6914", muted: "#8a7b6b", ambientHue: 35 },
  { label: "Forest", bg: "#0d1a12", text: "#c8d6c0", card: "#142018", border: "#1e3020", accent: "#6abf4b", muted: "#7a9470", ambientHue: 140 },
  { label: "Ocean", bg: "#080e1a", text: "#b8cfe0", card: "#0e1825", border: "#142535", accent: "#3ba5d9", muted: "#6a8fa8", ambientHue: 210 },
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
  { label: "Serif", value: "Georgia, 'Times New Roman', serif", preview: "Aa" },
  { label: "Sans", value: "'Inter', system-ui, sans-serif", preview: "Aa" },
  { label: "Mono", value: "'Courier New', monospace", preview: "Aa" },
  { label: "Dyslexic", value: "'Comic Sans MS', 'OpenDyslexic', cursive", preview: "Aa" },
  { label: "Literary", value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif", preview: "Aa" },
];

const STORAGE_KEY = "novelhub-reader-settings";

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

export default function ChapterReader() {
  const { id, chapter } = useParams<{ id: string; chapter: string }>();
  const navigate = useNavigate();
  const chapterNum = parseInt(chapter || "1", 10);

  const { data: chapterData, isLoading } = useChapter(id || "", chapterNum);
  const { data: novelMeta } = useNovelMeta(id || "");

  const saved = loadSettings();
  const [fontSize, setFontSize] = useState(saved?.fontSize ?? 18);
  const [fontIdx, setFontIdx] = useState(saved?.fontIdx ?? 0);
  const [lineHeight, setLineHeight] = useState(saved?.lineHeight ?? 1.9);
  const [maxWidth, setMaxWidth] = useState(saved?.maxWidth ?? 672);
  const [showSettings, setShowSettings] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [focusMode, setFocusMode] = useState(false);
  const [readerThemeIdx, setReaderThemeIdx] = useState(() => {
    const saved = localStorage.getItem("novelhub-reader-theme");
    return saved ? parseInt(saved, 10) : 1;
  });

  const rt = READER_THEMES[readerThemeIdx];

  const { savedProgress, isLoggedIn } = useReadingProgress(id || "", chapterNum, scrollProgress);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ fontSize, fontIdx, lineHeight, maxWidth }));
  }, [fontSize, fontIdx, lineHeight, maxWidth]);

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

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && hasPrev) goTo(chapterNum - 1);
      if (e.key === "ArrowRight" && hasNext) goTo(chapterNum + 1);
      if (e.key === "Escape" && focusMode) setFocusMode(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [hasPrev, hasNext, chapterNum, goTo, focusMode]);

  // Preload
  const queryClient = useQueryClient();
  useEffect(() => {
    const preload = (num: number) => {
      if (num < 1 || (totalChapters > 0 && num > totalChapters)) return;
      queryClient.prefetchQuery({
        queryKey: ["chapter", id, num],
        queryFn: async () => {
          const { data, error } = await supabase
            .from("chapters")
            .select("*")
            .eq("novel_id", id!)
            .eq("chapter_number", num)
            .single();
          if (error) throw error;
          return data;
        },
        staleTime: 5 * 60_000,
      });
    };
    preload(chapterNum + 1);
    preload(chapterNum + 2);
    if (chapterNum > 1) preload(chapterNum - 1);
  }, [id, chapterNum, totalChapters, queryClient]);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [chapterNum]);

  if (isLoading) {
    return (
      <main className="min-h-screen py-16" style={{ backgroundColor: rt.bg }}>
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
          <p className="text-lg font-medium text-foreground">Chapter not found</p>
          <Link to={`/novel/${id}`}>
            <Button variant="outline" size="sm">Back to Novel</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      {/* Progress bar */}
      <div
        className="fixed top-0 left-0 h-[3px] z-[70] origin-left"
        style={{ transform: `scaleX(${scrollProgress / 100})`, backgroundColor: rt.accent }}
      />

      {/* Ambient background glow that subtly shifts */}
      <div
        className="fixed inset-0 pointer-events-none transition-opacity duration-1000 z-0"
        style={{
          opacity: focusMode ? 0 : 0.4,
          background: `radial-gradient(ellipse 80% 40% at 50% 0%, hsl(${rt.ambientHue} 30% 15% / 0.15) 0%, transparent 70%)`,
        }}
      />

      <main
        className="relative min-h-screen transition-colors duration-700 z-10"
        style={{ backgroundColor: rt.bg, color: rt.text }}
      >
        {/* Top bar - fades in focus mode */}
        <motion.div
          className="sticky top-0 z-50 transition-all duration-500"
          style={{
            backgroundColor: `${rt.bg}ee`,
            backdropFilter: "blur(12px)",
            borderBottom: `1px solid ${rt.border}`,
            opacity: focusMode ? 0 : 1,
            pointerEvents: focusMode ? "none" : "auto",
          }}
        >
          <div className="mx-auto flex items-center justify-between px-6 py-3" style={{ maxWidth: `${maxWidth + 100}px` }}>
            <Link
              to={`/novel/${id}`}
              className="inline-flex items-center gap-1.5 text-sm transition-colors hover:opacity-80"
              style={{ color: rt.muted }}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">{novelMeta?.title || "Back"}</span>
            </Link>

            <span className="text-xs font-medium" style={{ color: rt.muted }}>
              Chapter {chapterNum} of {totalChapters}
            </span>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                style={{ color: rt.text }}
                onClick={() => setFocusMode(!focusMode)}
                title={focusMode ? "Exit focus mode" : "Focus mode"}
              >
                {focusMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowSettings(!showSettings)}
                style={{ color: rt.text }}
              >
                <Settings2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto px-6 pt-8 pb-16 transition-all duration-300" style={{ maxWidth: `${maxWidth}px` }}>
          {/* Settings panel */}
          <AnimatePresence>
            {showSettings && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mb-8"
              >
                <div
                  className="rounded-2xl p-6 space-y-5 transition-colors duration-300"
                  style={{ backgroundColor: rt.card, border: `1px solid ${rt.border}` }}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold" style={{ color: rt.text, fontFamily: "system-ui" }}>
                      Reading Settings
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      style={{ color: rt.text }}
                      onClick={() => setShowSettings(false)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>

                  {/* Theme */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: rt.muted, fontFamily: "system-ui" }}>
                      <Palette className="h-3.5 w-3.5" /> Theme
                    </label>
                    <div className="flex gap-2">
                      {READER_THEMES.map((theme, i) => (
                        <button
                          key={theme.label}
                          onClick={() => setReaderThemeIdx(i)}
                          className="flex flex-col items-center gap-1.5 flex-1 rounded-xl p-2.5 transition-all"
                          style={{
                            border: readerThemeIdx === i ? `2px solid ${rt.accent}` : `1px solid ${rt.border}`,
                            backgroundColor: theme.bg,
                          }}
                        >
                          <div className="w-full h-6 rounded" style={{ backgroundColor: theme.bg, border: `1px solid ${theme.border}` }}>
                            <div className="flex flex-col gap-0.5 p-1">
                              <div className="h-[2px] w-3/4 rounded" style={{ backgroundColor: theme.text }} />
                              <div className="h-[2px] w-1/2 rounded" style={{ backgroundColor: theme.muted }} />
                            </div>
                          </div>
                          <span className="text-[10px] font-medium" style={{ color: theme.text, fontFamily: "system-ui" }}>
                            {theme.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font family */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: rt.muted, fontFamily: "system-ui" }}>
                      <Type className="h-3.5 w-3.5" /> Font
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {FONTS.map((f, i) => (
                        <button
                          key={f.label}
                          className="flex flex-col items-center gap-0.5 rounded-xl py-2 px-3 transition-all min-w-[60px]"
                          style={{
                            backgroundColor: fontIdx === i ? rt.accent : "transparent",
                            color: fontIdx === i ? "#fff" : rt.text,
                            border: `1px solid ${fontIdx === i ? rt.accent : rt.border}`,
                            fontFamily: f.value,
                          }}
                          onClick={() => setFontIdx(i)}
                        >
                          <span className="text-base leading-none">{f.preview}</span>
                          <span className="text-[10px] font-medium" style={{ fontFamily: "system-ui" }}>{f.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Font size */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium" style={{ color: rt.muted, fontFamily: "system-ui" }}>
                      Size: {fontSize}px
                    </label>
                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="icon" className="h-8 w-8" style={{ borderColor: rt.border, color: rt.text }} onClick={() => setFontSize((s) => Math.max(12, s - 1))}>
                        <Minus className="h-3.5 w-3.5" />
                      </Button>
                      <Slider value={[fontSize]} min={12} max={28} step={1} onValueChange={([v]) => setFontSize(v)} className="flex-1" />
                      <Button variant="outline" size="icon" className="h-8 w-8" style={{ borderColor: rt.border, color: rt.text }} onClick={() => setFontSize((s) => Math.min(28, s + 1))}>
                        <Plus className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>

                  {/* Line height */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium" style={{ color: rt.muted, fontFamily: "system-ui" }}>
                      Line Spacing: {lineHeight.toFixed(1)}
                    </label>
                    <Slider value={[lineHeight]} min={1.2} max={2.8} step={0.1} onValueChange={([v]) => setLineHeight(v)} />
                  </div>

                  {/* Width */}
                  <div className="space-y-2">
                    <label className="text-xs font-medium" style={{ color: rt.muted, fontFamily: "system-ui" }}>
                      Width: {maxWidth}px
                    </label>
                    <Slider value={[maxWidth]} min={480} max={900} step={10} onValueChange={([v]) => setMaxWidth(v)} />
                  </div>

                  <button
                    className="text-xs font-medium underline underline-offset-2 opacity-60 hover:opacity-100 transition-opacity"
                    style={{ color: rt.muted, fontFamily: "system-ui" }}
                    onClick={() => { setFontSize(18); setFontIdx(0); setLineHeight(1.9); setMaxWidth(672); setReaderThemeIdx(1); }}
                  >
                    Reset to defaults
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Chapter header */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs font-medium uppercase tracking-[0.2em] mb-3" style={{ color: rt.accent }}>
              Chapter {chapterData.chapter_number}
            </p>
            <h1
              className="text-3xl md:text-4xl font-bold leading-[1.1]"
              style={{ color: rt.text, fontFamily: "'Playfair Display', serif", textWrap: "balance" } as React.CSSProperties}
            >
              {chapterData.title}
            </h1>
            {/* Decorative divider */}
            <div className="mt-6 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${rt.accent}40, transparent)` }} />
              <div className="h-1.5 w-1.5 rounded-full" style={{ background: rt.accent }} />
              <div className="h-px flex-1" style={{ background: `linear-gradient(to left, ${rt.accent}40, transparent)` }} />
            </div>
          </motion.div>

          {/* Auto-scroll & TTS */}
          <div className="mb-6">
            <AutoScrollTTS rt={rt} content={chapterData.content} />
          </div>

          {isLoggedIn && (
            <p className="text-[10px] mb-6" style={{ color: rt.muted, fontFamily: "system-ui" }}>
              ✓ Progress synced
            </p>
          )}

          {/* Content */}
          <motion.article
            className="max-w-none"
            style={{
              fontFamily: FONTS[fontIdx].value,
              fontSize: `${fontSize}px`,
              lineHeight: lineHeight,
              color: rt.text,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {chapterData.content ? (
              chapterData.content.split("\n\n").map((para, i) => (
                <p key={i} className="mb-7" style={{ opacity: 0.88 }}>
                  {para}
                </p>
              ))
            ) : (
              <p className="italic" style={{ color: rt.muted }}>
                This chapter has no content yet.
              </p>
            )}
          </motion.article>

          {/* Bottom navigation */}
          <motion.div
            className="mt-20 flex items-center justify-between pt-8"
            style={{ borderTop: `1px solid ${rt.border}` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <button
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 disabled:opacity-30 hover:scale-[1.02] active:scale-[0.98]"
              style={{ border: `1px solid ${rt.border}`, color: rt.text }}
              disabled={!hasPrev}
              onClick={() => hasPrev && goTo(chapterNum - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            <div className="text-center">
              <span className="text-xs block" style={{ color: rt.muted, fontFamily: "system-ui" }}>
                {chapterNum} / {totalChapters}
              </span>
              <div className="mt-2 h-1 w-24 rounded-full overflow-hidden" style={{ background: `${rt.border}` }}>
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${totalChapters ? (chapterNum / totalChapters) * 100 : 0}%`,
                    background: rt.accent,
                  }}
                />
              </div>
            </div>

            <button
              className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium transition-all duration-300 disabled:opacity-30 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: rt.accent, color: "#fff" }}
              disabled={!hasNext}
              onClick={() => hasNext && goTo(chapterNum + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      </main>
    </>
  );
}
