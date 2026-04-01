import { motion } from "framer-motion";
import { BarChart3, Globe, TrendingUp, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DEFAULT_STATS = [
  { value: 75000, suffix: "+", label: "KGS Recycled" },
  { value: 15000, suffix: "+", label: "Happy Families" },
  { value: 30, suffix: "+", label: "Corporate Tie-ups" },
  { value: 95, suffix: "%", label: "Material Recovery" },
];

const ICONS = [BarChart3, Globe, TrendingUp, Zap];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    started.current = false;
    setCount(0);
  }, [target]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 50;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(current));
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-display font-bold text-primary-foreground tracking-tight">
      {count.toLocaleString()}{suffix}
    </div>
  );
};

const StatsSection = () => {
  const [stats, setStats] = useState(DEFAULT_STATS);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "https://api.jambologos.com";
    const load = async () => {
      try {
        const res = await fetch(`${base}/api/cms/stats`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setStats(data);
      } catch {}
    };
    void load();
  }, []);

  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((s, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="text-center"
              >
                <div className="h-12 w-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="h-6 w-6 text-primary-foreground/70" />
                </div>
                <Counter target={s.value} suffix={s.suffix} />
                <div className="text-sm text-primary-foreground/60 mt-2 tracking-wide">{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
