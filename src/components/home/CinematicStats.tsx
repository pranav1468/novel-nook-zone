import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { BookOpen, Users, Layers, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { LucideIcon } from "lucide-react";

function AnimatedNumber({ target, duration = 2.5 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  return <span ref={ref}>{current.toLocaleString()}</span>;
}

export default function CinematicStats() {
  const { data: stats } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: async () => {
      const { data: novels } = await supabase
        .from("novels")
        .select("views, chapter_count");
      if (!novels) return { novels: 0, chapters: 0, views: 0 };
      return {
        novels: novels.length,
        chapters: novels.reduce((sum, n) => sum + n.chapter_count, 0),
        views: novels.reduce((sum, n) => sum + n.views, 0),
      };
    },
  });

  const items: { icon: LucideIcon; label: string; value: number; suffix: string; hue: number }[] = [
    { icon: BookOpen, label: "Novels", value: stats?.novels ?? 0, suffix: "+", hue: 24 },
    { icon: Layers, label: "Chapters", value: stats?.chapters ?? 0, suffix: "", hue: 200 },
    { icon: Eye, label: "Total Reads", value: stats?.views ?? 0, suffix: "", hue: 270 },
    { icon: Users, label: "Active Readers", value: Math.floor((stats?.views ?? 0) / 3), suffix: "+", hue: 340 },
  ];

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Atmospheric separator */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(24 30% 6% / 0.3) 50%, hsl(var(--background)) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <motion.div
                  className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{
                    background: `hsl(${item.hue} 40% 15% / 0.5)`,
                    boxShadow: `0 0 30px hsl(${item.hue} 50% 40% / 0.1)`,
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  <Icon className="h-5 w-5" style={{ color: `hsl(${item.hue} 65% 60%)` }} />
                </motion.div>
                <div
                  className="text-3xl md:text-4xl font-bold text-foreground"
                  style={{ fontFamily: "'Georgia', serif" }}
                >
                  <AnimatedNumber target={item.value} />
                  {item.suffix}
                </div>
                <p className="mt-1 text-xs text-muted-foreground uppercase tracking-wider">
                  {item.label}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
