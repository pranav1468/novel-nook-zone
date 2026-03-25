import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { BookOpen, Users, Layers, Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

function AnimatedNumber({ target, duration = 2 }: { target: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target, duration]);

  return <span ref={ref}>{current.toLocaleString()}</span>;
}

export default function StatsCounter() {
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

  const items = [
    { icon: BookOpen, label: "Novels", value: stats?.novels ?? 0 },
    { icon: Layers, label: "Chapters", value: stats?.chapters ?? 0 },
    { icon: Eye, label: "Total Views", value: stats?.views ?? 0 },
    { icon: Users, label: "Readers", value: Math.floor((stats?.views ?? 0) / 3) },
  ];

  return (
    <section className="py-4">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card/50 backdrop-blur-sm p-6 text-center transition-all duration-300 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="text-2xl font-bold text-foreground md:text-3xl">
                  <AnimatedNumber target={item.value} />
                </span>
                <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
