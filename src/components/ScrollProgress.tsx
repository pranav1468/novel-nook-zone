import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const scaleX = useSpring(0, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const p = scrollTop / (scrollHeight - clientHeight);
      setProgress(p);
      scaleX.set(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [scaleX]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] bg-primary origin-left"
      style={{ scaleX }}
    />
  );
}
