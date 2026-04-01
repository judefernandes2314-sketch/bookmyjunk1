import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, Leaf, ShieldCheck, Truck } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay } }
});

interface HeroContent {
  badge_text: string;
  headline_1: string;
  headline_2: string;
  description: string;
  cta_text: string;
  cta_url: string;
  stats_text: string;
  feature_1: string;
  feature_2: string;
  feature_3: string;
  bg_image_url: string;
  playstore_url: string;
  appstore_url: string;
  playstore_img: string;
  appstore_img: string;
}

const DEFAULTS: HeroContent = {
  badge_text: "India's #1 E-waste Recycling App",
  headline_1: "Declutter your home, go greener.",
  headline_2: "Book Free E-waste Collection Now.",
  description: "Download the BookMyJunk app & schedule a free doorstep pickup. We recycle old laptops, phones, TVs & more — certified, eco-friendly, and hassle-free.",
  cta_text: "Book Free Pickup",
  cta_url: "https://wa.me/918976769851?text=Hi%2C%20I%20want%20to%20book%20a%20free%20e-waste%20pickup",
  stats_text: "⭐ 4.8 rating · 50,000+ downloads · Free to use",
  feature_1: "Free Doorstep Pickup",
  feature_2: "Certified & Secure",
  feature_3: "Eco-Friendly Process",
  bg_image_url: "",
  playstore_url: "https://play.google.com/store/apps/details?id=com.bmj.bookmyjunk&pcampaignid=web_share",
  appstore_url: "https://apps.apple.com/in/app/bookmyjunk/id1595834562",
  playstore_img: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
  appstore_img: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
};

const HeroSection = () => {
  const [hero, setHero] = useState<HeroContent>(DEFAULTS);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "https://api.jambologos.com";
    const load = async () => {
      try {
        const res = await fetch(`${base}/api/cms/hero`);
        if (!res.ok) return;
        const data = (await res.json()) as Partial<HeroContent>;
        if (data && typeof data === "object") {
          setHero({
            badge_text: (data.badge_text || "").trim() || DEFAULTS.badge_text,
            headline_1: (data.headline_1 || "").trim() || DEFAULTS.headline_1,
            headline_2: (data.headline_2 || "").trim() || DEFAULTS.headline_2,
            description: (data.description || "").trim() || DEFAULTS.description,
            cta_text: (data.cta_text || "").trim() || DEFAULTS.cta_text,
            cta_url: (data.cta_url || "").trim() || DEFAULTS.cta_url,
            stats_text: (data.stats_text || "").trim() || DEFAULTS.stats_text,
            feature_1: (data.feature_1 || "").trim() || DEFAULTS.feature_1,
            feature_2: (data.feature_2 || "").trim() || DEFAULTS.feature_2,
            feature_3: (data.feature_3 || "").trim() || DEFAULTS.feature_3,
            bg_image_url: (data.bg_image_url || "").trim() || "",
            playstore_url: (data.playstore_url || "").trim() || DEFAULTS.playstore_url,
            appstore_url: (data.appstore_url || "").trim() || DEFAULTS.appstore_url,
            playstore_img: (data.playstore_img || "").trim() || DEFAULTS.playstore_img,
            appstore_img: (data.appstore_img || "").trim() || DEFAULTS.appstore_img,
          });
        }
      } catch {
        // fallback to defaults
      }
    };
    void load();
  }, []);

  const featureCards = [
    { icon: Truck, text: hero.feature_1 },
    { icon: ShieldCheck, text: hero.feature_2 },
    { icon: Leaf, text: hero.feature_3 },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src={hero.bg_image_url || heroBg}
        alt="E-waste recycling facility for responsible e-waste recycling in India"
        className="absolute inset-0 w-full h-full object-cover"
        loading="eager"
        fetchPriority="high"
        onError={(e) => { (e.target as HTMLImageElement).src = heroBg; }}
      />
      <div className="absolute inset-0 hero-overlay" />
      <div className="relative z-10 container mx-auto py-32 text-center px-[16px]">
        <motion.div variants={stagger} initial="hidden" animate="visible">

          {/* Badge */}
          <motion.span
            variants={fadeUp()}
            className="inline-block bg-primary-foreground/10 text-primary-foreground text-xs font-semibold tracking-[0.2em] uppercase px-5 py-2 rounded-full mb-6 border border-primary-foreground/15 backdrop-blur-sm"
          >
            {hero.badge_text}
          </motion.span>

          {/* Headlines */}
          <motion.h1
            variants={fadeUp(0.1)}
            className="font-display font-bold text-primary-foreground max-w-5xl mx-auto tracking-tight"
          >
            <span className="block text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-[1.1] whitespace-nowrap">
              {hero.headline_1}
            </span>
            <span className="block text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-[1.2] text-secondary mt-2 whitespace-nowrap">
              {hero.headline_2}
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp(0.2)}
            className="mt-6 text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto leading-relaxed"
          >
            {hero.description}
          </motion.p>

          {/* CTA Button */}
          <motion.div variants={fadeUp(0.3)} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href={hero.cta_url}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-primary/25 flex items-center justify-center gap-3 transition-colors"
            >
              {hero.cta_text}
            </motion.a>
          </motion.div>

          {/* App store badges */}
          <motion.div variants={fadeUp(0.4)} className="mt-8 flex items-center justify-center gap-4">
            <a href={hero.playstore_url || "https://play.google.com/store/apps/details?id=com.bmj.bookmyjunk&pcampaignid=web_share"} target="_blank" rel="noopener noreferrer">
              <img
                src={hero.playstore_img || "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"}
                alt="Get BookMyJunk on Google Play Store"
                className="h-11 hover:opacity-80 transition"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"; }}
              />
            </a>
            <a href={hero.appstore_url || "https://apps.apple.com/in/app/bookmyjunk/id1595834562"} target="_blank" rel="noopener noreferrer">
              <img
                src={hero.appstore_img || "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"}
                alt="Download BookMyJunk on App Store"
                className="h-11 hover:opacity-80 transition"
                loading="lazy"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"; }}
              />
            </a>
          </motion.div>

          {/* Stats */}
          <motion.p variants={fadeUp(0.45)} className="mt-4 text-primary-foreground/40 text-sm tracking-wide">
            {hero.stats_text}
          </motion.p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto"
        >
          {featureCards.map(({ icon: Icon, text }) => (
            <motion.div
              key={text}
              whileHover={{ y: -3 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 bg-primary-foreground/8 backdrop-blur-lg rounded-2xl px-5 py-4 border border-primary-foreground/10"
            >
              <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                <Icon className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-primary-foreground font-medium text-sm">{text}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Scroll arrow */}
        <motion.a
          href="#about"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="inline-block mt-12"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <ArrowDown className="h-6 w-6 text-primary-foreground/40" />
          </motion.div>
        </motion.a>
      </div>
    </section>
  );
};

export default HeroSection;
