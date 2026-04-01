import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

interface EcoWarrior {
  id: number;
  name: string;
  location: string;
  photo_url: string | null;
  is_featured: number;
  sort_order: number;
}

interface EcoWarriorsSettings {
  heading: string;
  subheading: string;
  button_text: string;
  theme: "white" | "green";
}

const DEFAULT_SETTINGS: EcoWarriorsSettings = {
  heading: "Meet our recent Eco Warriors",
  subheading: "Real people making a difference — one pickup at a time.",
  button_text: "Become an Eco Warrior",
  theme: "white",
};

const EcoWarriorsSection = () => {
  const [warriors, setWarriors] = useState<EcoWarrior[]>([]);
  const [settings, setSettings] = useState<EcoWarriorsSettings>(DEFAULT_SETTINGS);
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "https://api.jambologos.com";
    const load = async () => {
      try {
        const res = await fetch(`${base}/api/cms/eco-warriors`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.warriors && Array.isArray(data.warriors)) {
          const featured = data.warriors.filter((w: EcoWarrior) => w.is_featured === 1);
          setWarriors(featured.length ? featured : data.warriors.slice(0, 6));
        }
        if (data.settings) {
          setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
        }
      } catch {}
    };
    void load();
  }, []);

  if (warriors.length === 0) return null;

  const isGreen = settings.theme === "green";

  const handleBecomeWarrior = () => {
    const isHome = location.pathname === "/";
    if (isHome) {
      const el = document.getElementById("book");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    navigate("/");
    let attempts = 0;
    const interval = setInterval(() => {
      const el = document.getElementById("book");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        clearInterval(interval);
      }
      attempts++;
      if (attempts > 20) clearInterval(interval);
    }, 100);
  };

  const getInitials = (name: string) =>
    name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  // Build wavy SVG path dynamically based on warrior count
  const buildWavePath = (count: number) => {
    if (count < 2) return "";
    const w = 820;
    const step = w / (count - 1);
    let d = `M ${step * 0.1} 55`;
    for (let i = 0; i < count - 1; i++) {
      const x1 = step * i + step * 0.35;
      const x2 = step * (i + 1) - step * 0.35;
      const y1 = i % 2 === 0 ? 10 : 100;
      const y2 = i % 2 === 0 ? 100 : 10;
      const ex = step * (i + 1);
      const ey = i % 2 === 0 ? 100 : 10;
      d += ` C ${x1} ${y1}, ${x2} ${y2}, ${ex} ${ey}`;
    }
    return d;
  };

  const bg = isGreen ? "#00bd88" : "var(--background)";
  const textPrimary = isGreen ? "white" : "var(--foreground)";
  const textSecondary = isGreen ? "rgba(255,255,255,0.75)" : "var(--muted-foreground)";
  const ringColor = isGreen ? "rgba(255,255,255,0.9)" : "#00bd88";
  const waveColor = isGreen ? "rgba(255,255,255,0.4)" : "rgba(0,189,136,0.35)";
  const btnBg = isGreen ? "white" : "#00bd88";
  const btnText = isGreen ? "#00bd88" : "white";

  return (
    <section id="eco-warriors" style={{ background: bg }} className="py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span
            className="text-xs font-semibold tracking-[0.2em] uppercase block mb-3"
            style={{ color: isGreen ? "rgba(255,255,255,0.8)" : "#00bd88" }}
          >
            Eco Warriors
          </span>
          <h2
            className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3"
            style={{ color: textPrimary }}
          >
            {settings.heading}
          </h2>
          <p className="text-base md:text-lg" style={{ color: textSecondary }}>
            {settings.subheading}
          </p>
        </motion.div>

        {/* Warriors row with wave */}
        <div className="relative max-w-5xl mx-auto mb-12">
          {/* Wave line — desktop only */}
          {!isMobile && warriors.length >= 2 && (
            <svg
              className="absolute pointer-events-none hidden md:block"
              style={{ top: "52px", left: "4%", width: "92%", zIndex: 0 }}
              viewBox="0 0 820 120"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d={buildWavePath(Math.min(warriors.length, 6))}
                stroke={waveColor}
                strokeWidth="1.5"
                strokeDasharray="6 5"
                fill="none"
              />
            </svg>
          )}

          {/* Mobile: 3-column grid */}
          {isMobile ? (
            <div className="grid grid-cols-3 gap-6 px-2">
              {warriors.slice(0, 6).map((warrior, idx) => (
                <motion.div
                  key={warrior.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.08, duration: 0.5 }}
                  className="flex flex-col items-center text-center"
                >
                {/* Photo circle */}
                <div
                  className="rounded-full flex-shrink-0 mb-3 overflow-hidden"
                  style={{
                    width: "88px",
                    height: "88px",
                    padding: "3px",
                    background: ringColor,
                  }}
                >
                  {warrior.photo_url ? (
                    <img
                      src={warrior.photo_url}
                      alt={warrior.name}
                      className="w-full h-full rounded-full object-cover"
                      style={{ filter: "grayscale(60%)" }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className="w-full h-full rounded-full flex items-center justify-center font-bold text-lg"
                      style={{
                        background: isGreen ? "rgba(255,255,255,0.2)" : "rgba(0,189,136,0.12)",
                        color: isGreen ? "white" : "#00bd88",
                      }}
                    >
                      {getInitials(warrior.name)}
                    </div>
                  )}
                </div>

                <p
                  className="font-semibold text-sm leading-tight mb-1 px-1"
                  style={{ color: textPrimary }}
                >
                  {warrior.name}
                </p>
                <p className="text-xs" style={{ color: textSecondary }}>
                  {warrior.location}
                </p>
                </motion.div>
              ))}
            </div>
          ) : (
            /* Desktop: flex row with alternating heights */
            <div className="flex justify-center items-start relative" style={{ zIndex: 1 }}>
              {warriors.slice(0, 6).map((warrior, idx) => (
                <motion.div
                  key={warrior.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  className="flex flex-col items-center text-center flex-shrink-0"
                  style={{
                    width: `${100 / Math.min(warriors.length, 6)}%`,
                    maxWidth: "160px",
                    marginTop: idx % 2 === 1 ? "56px" : "0",
                  }}
                >
                  {/* Photo circle */}
                  <div
                    className="rounded-full flex-shrink-0 mb-3 overflow-hidden"
                    style={{
                      width: "88px",
                      height: "88px",
                      padding: "3px",
                      background: ringColor,
                    }}
                  >
                    {warrior.photo_url ? (
                      <img
                        src={warrior.photo_url}
                        alt={warrior.name}
                        className="w-full h-full rounded-full object-cover"
                        style={{ filter: "grayscale(60%)" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="w-full h-full rounded-full flex items-center justify-center font-bold text-lg"
                        style={{
                          background: isGreen ? "rgba(255,255,255,0.2)" : "rgba(0,189,136,0.12)",
                          color: isGreen ? "white" : "#00bd88",
                        }}
                      >
                        {getInitials(warrior.name)}
                      </div>
                    )}
                  </div>

                  <p
                    className="font-semibold text-sm leading-tight mb-1 px-1"
                    style={{ color: textPrimary }}
                  >
                    {warrior.name}
                  </p>
                  <p className="text-xs" style={{ color: textSecondary }}>
                    {warrior.location}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.04, y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleBecomeWarrior}
            className="inline-flex items-center gap-2 font-semibold px-8 py-3.5 rounded-xl text-sm transition-all"
            style={{ background: btnBg, color: btnText }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            {settings.button_text}
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default EcoWarriorsSection;
