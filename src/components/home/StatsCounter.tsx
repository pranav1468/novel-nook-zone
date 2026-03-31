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
    <section className="py-6">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap justify-between gap-6 md:gap-8"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-start gap-0.5"
            >
              <span className="text-2xl font-bold text-primary md:text-3xl lg:text-4xl">
                <AnimatedNumber target={item.value} />
                {item.label === "Readers" || item.label === "Novels" ? "+" : ""}
              </span>
              <span className="text-sm font-medium text-muted-foreground">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
