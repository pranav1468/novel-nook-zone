import { useEffect, useRef } from "react";

export default function CursorSpotlight() {
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = spotRef.current;
    if (!el) return;

    let x = 0, y = 0;
    let targetX = 0, targetY = 0;
    let rafId: number;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const animate = () => {
      x += (targetX - x) * 0.08;
      y += (targetY - y) * 0.08;
      el.style.transform = `translate(${x - 200}px, ${y - 200}px)`;
      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    rafId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      ref={spotRef}
      className="pointer-events-none fixed top-0 left-0 z-[1] w-[400px] h-[400px] rounded-full opacity-[0.04] hidden md:block"
      style={{
        background: "radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%)",
        willChange: "transform",
      }}
    />
  );
}
