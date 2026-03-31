import { useState, useEffect, useRef, useCallback } from "react";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Volume2, VolumeX, ChevronsDown } from "lucide-react";

interface ReaderTheme {
  bg: string;
  text: string;
  card: string;
  border: string;
  accent: string;
  muted: string;
}

interface AutoScrollTTSProps {
  rt: ReaderTheme;
  content: string | null;
}

export default function AutoScrollTTS({ rt, content }: AutoScrollTTSProps) {
  // Auto-scroll state
  const [autoScroll, setAutoScroll] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1.5); // px per frame at 60fps
  const scrollRef = useRef<number | null>(null);

  // TTS state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsSupported] = useState(() => "speechSynthesis" in window);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Auto-scroll logic
  useEffect(() => {
    if (!autoScroll) {
      if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
      return;
    }

    const step = () => {
      window.scrollBy(0, scrollSpeed);
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10;
      if (atBottom) {
        setAutoScroll(false);
        return;
      }
      scrollRef.current = requestAnimationFrame(step);
    };
    scrollRef.current = requestAnimationFrame(step);

    return () => {
      if (scrollRef.current) cancelAnimationFrame(scrollRef.current);
    };
  }, [autoScroll, scrollSpeed]);

  // Pause auto-scroll on manual scroll
  useEffect(() => {
    if (!autoScroll) return;
    let lastY = window.scrollY;
    const handler = () => {
      // Only pause if user scrolled up (manual intervention)
      if (window.scrollY < lastY - 5) {
        setAutoScroll(false);
      }
      lastY = window.scrollY;
    };
    window.addEventListener("wheel", handler, { passive: true });
    window.addEventListener("touchmove", handler, { passive: true });
    return () => {
      window.removeEventListener("wheel", handler);
      window.removeEventListener("touchmove", handler);
    };
  }, [autoScroll]);

  // TTS logic
  const toggleTTS = useCallback(() => {
    if (!ttsSupported || !content) return;

    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const text = content.replace(/\n\n/g, ". ").substring(0, 10000);
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1.0;
    utter.pitch = 1.0;
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    utteranceRef.current = utter;
    speechSynthesis.speak(utter);
    setIsSpeaking(true);
  }, [content, isSpeaking, ttsSupported]);

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
    };
  }, []);

  return (
    <div
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-xs"
      style={{ backgroundColor: rt.card, border: `1px solid ${rt.border}` }}
    >
      {/* Auto-scroll */}
      <button
        onClick={() => setAutoScroll(!autoScroll)}
        className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-all"
        style={{
          backgroundColor: autoScroll ? rt.accent : "transparent",
          color: autoScroll ? "#fff" : rt.muted,
          border: `1px solid ${autoScroll ? rt.accent : rt.border}`,
        }}
        title="Auto-scroll"
      >
        <ChevronsDown className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Auto-scroll</span>
      </button>

      {autoScroll && (
        <div className="flex items-center gap-2 min-w-[100px]">
          <span style={{ color: rt.muted }}>Speed</span>
          <Slider
            value={[scrollSpeed]}
            min={0.3}
            max={5}
            step={0.1}
            onValueChange={([v]) => setScrollSpeed(v)}
            className="w-20"
          />
        </div>
      )}

      <div className="w-px h-4 mx-1" style={{ backgroundColor: rt.border }} />

      {/* TTS */}
      {ttsSupported && (
        <button
          onClick={toggleTTS}
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 transition-all"
          style={{
            backgroundColor: isSpeaking ? rt.accent : "transparent",
            color: isSpeaking ? "#fff" : rt.muted,
            border: `1px solid ${isSpeaking ? rt.accent : rt.border}`,
          }}
          title={isSpeaking ? "Stop reading" : "Read aloud"}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Stop</span>
            </>
          ) : (
            <>
              <Volume2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Read Aloud</span>
            </>
          )}
        </button>
      )}
    </div>
  );
}
