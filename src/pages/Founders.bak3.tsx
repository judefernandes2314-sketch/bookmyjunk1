import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { foundersData, type FounderType } from "@/data/founders";



const isFounder = (value: unknown): value is FounderType => {
  const v = value as Partial<FounderType> | null | undefined;
  return (
    typeof v?.id === "string" &&
    typeof v?.name === "string" &&
    typeof v?.title === "string" &&
    typeof v?.image === "string" &&
    typeof v?.bio === "string" &&
    (typeof v?.linkedin === "string" || typeof v?.linkedin === "undefined")
  );
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (first + last).toUpperCase() || "B";
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

const FounderCard = ({ founder }: { founder: FounderType }) => {
  const [imgErrored, setImgErrored] = useState(false);

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl border border-primary/20 bg-card shadow-sm hover:shadow-md transition-shadow duration-300 p-8"
    >
      <div className="flex items-center gap-5">
        {imgErrored ? (
          <div className="bg-primary/10 text-primary font-bold text-2xl flex items-center justify-center w-28 h-28 rounded-full">
            {getInitials(founder.name)}
          </div>
        ) : (
          <img
            key={founder.image}
            src={normalizeImageUrl(founder.image)}
            alt={founder.name}
            className="w-28 h-28 rounded-full object-cover object-top ring-4 ring-primary/25 flex-shrink-0"
            onError={() => setImgErrored(true)}
            referrerPolicy="no-referrer"
          />
        )}

        <div className="flex flex-col">
          <h3 className="font-display font-bold text-2xl text-foreground">{founder.name}</h3>
          <p className="text-primary font-semibold text-xs uppercase tracking-widest mt-1">{founder.title}</p>
        </div>
      </div>

      <div className="w-12 h-[3px] bg-primary rounded-full mt-5 mb-5" />

      <p className="text-muted-foreground text-[15px] leading-[1.8]">{founder.bio}</p>

      {founder.linkedin ? (
        <a
          href={founder.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
        >
          <ExternalLink className="w-4 h-4" />
          View LinkedIn Profile
        </a>
      ) : null}
    </motion.div>
  );
};

const API_BASE = import.meta.env.VITE_API_URL || "https://api.jambologos.com";

const normalizeImageUrl = (url: string): string => {
  if (!url) return url;
  return url.replace(/^https?:\/\/api\.bookmyjunk\.com/, API_BASE);
};

const Founders = () => {
  const [founders, setFounders] = useState<FounderType[]>(foundersData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Leadership | BookMyJunk";
  }, []);

  useEffect(() => {
    fetch(`${API_BASE}/api/cms/founders`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: unknown) => {
        if (Array.isArray(data) && data.length) {
          const ts = Date.now();
          const normalized = (data as unknown[]).filter(isFounder).map((f) => {
            const founder = f as FounderType;
            if (founder.image) {
              const rewritten = normalizeImageUrl(founder.image);
              const base = rewritten.split("?")[0];
              return { ...founder, image: `${base}?t=${ts}` };
            }
            return founder;
          }) as FounderType[];
          if (normalized.length) setFounders(normalized);
        }
      })
      .catch(() => {/* keep defaults */})
      .finally(() => setLoading(false));
  }, []);

  const founderCards = founders;

  return (
    <>
      <Navbar />
      <main className="pt-24 pb-24 bg-background min-h-screen">
        {/* HERO */}
        <section className="bg-primary py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_90%_10%,rgba(255,255,255,0.07)_0%,transparent_60%)]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_40%_at_5%_90%,rgba(0,60,20,0.3)_0%,transparent_60%)]" />
          </div>

          <div className="relative max-w-5xl mx-auto px-6">
            <div className="flex items-center gap-3">
              <div className="w-5 h-px bg-white/40" />
              <p className="font-display font-bold text-white/55 tracking-widest text-xs uppercase">
                Our Leadership
              </p>
            </div>

            <h1 className="mt-5 font-display font-extrabold text-white tracking-tight text-[clamp(32px,5vw,52px)] leading-tight">
              The People Behind BookMyJunk
            </h1>

            <p className="text-white/65 text-lg mt-3 max-w-2xl">
              Passionate leaders driving India's e-waste recycling revolution.
            </p>
          </div>
        </section>

        {/* CARDS */}
        <section className="bg-background py-16 md:py-24">
          <div className="max-w-5xl mx-auto px-6">
            {loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {founderCards.map((founder) => (
                  <FounderCard key={founder.id + founder.image} founder={founder} />
                ))}
              </motion.div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Founders;

