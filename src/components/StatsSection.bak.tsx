import { motion } from "framer-motion";
import { BarChart3, Globe, TrendingUp, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const stats = [
  { icon: BarChart3, value: 10000, suffix: "+", label: "Tons Recycled" },
  { icon: Globe, value: 50, suffix: "+", label: "Cities Covered" },
  { icon: TrendingUp, value: 500, suffix: "+", label: "Corporate Clients" },
  { icon: Zap, value: 95, suffix: "%", label: "Material Recovery" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

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

const StatsSection = () => (
  <section className="py-20 bg-primary relative overflow-hidden">
    {/* Subtle background pattern */}
    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '40px 40px' }} />
    <div className="container mx-auto px-4 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center"
          >
            <div className="h-12 w-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center mx-auto mb-4">
              <s.icon className="h-6 w-6 text-primary-foreground/70" />
            </div>
            <Counter target={s.value} suffix={s.suffix} />
            <div className="text-sm text-primary-foreground/60 mt-2 tracking-wide">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default StatsSection;
