import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Recycle, Shield, Truck, Leaf, Award, Users } from "lucide-react";

const ICON_MAP: Record<string, React.ElementType> = {
  Truck, Shield, Recycle, Leaf, Award, Users,
};

const DEFAULT_FEATURES = [
  { id: "1", icon: "Truck", title: "Doorstep E-waste Collection", desc: "We pick up your old electronics right from your doorstep — completely free. Available in Mumbai, Delhi, Bangalore, and 50+ cities." },
  { id: "2", icon: "Shield", title: "Safe Disposal of E-waste", desc: "Your data is securely destroyed. Every device goes through certified data wiping before recycling." },
  { id: "3", icon: "Recycle", title: "Responsible E-waste Recycling", desc: "We follow government-approved processes to ensure zero landfill. 95% material recovery rate." },
  { id: "4", icon: "Leaf", title: "Eco-Friendly E-waste Disposal", desc: "Our recycling process prevents toxic materials from contaminating soil and water. Go green with BookMyJunk." },
  { id: "5", icon: "Award", title: "Certified E-waste Recycling Company", desc: "CPCB authorized, ISO certified. We are the best e-waste recycler trusted by 500+ corporates." },
  { id: "6", icon: "Users", title: "Bulk & Corporate Solutions", desc: "IT asset disposition, compliance certificates, and bulk electronic scrap recycling service for businesses." },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const AboutSection = () => {
  const [badge, setBadge] = useState("About BookMyJunk");
  const [heading, setHeading] = useState("India's Leading E-waste Management Solutions Provider");
  const [description, setDescription] = useState(
    "BookMyJunk is a certified e-waste recycling company offering free electronic waste pickup service across India. Whether you want to recycle old laptops, dispose of old computers, recycle mobile phones, or need a TV recycling pickup service — we handle it all responsibly and sustainably."
  );
  const [features, setFeatures] = useState(DEFAULT_FEATURES);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "https://api.jambologos.com";
    const load = async () => {
      try {
        const res = await fetch(`${base}/api/cms/about`);
        if (!res.ok) return;
        const data = await res.json();
        if (data && typeof data === "object") {
          if (data.badge) setBadge(data.badge);
          if (data.heading) setHeading(data.heading);
          if (data.description) setDescription(data.description);
          if (Array.isArray(data.features) && data.features.length > 0) setFeatures(data.features);
        }
      } catch {}
    };
    void load();
  }, []);

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">{badge}</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight leading-tight">
            {heading}
          </h2>
          <p className="mt-5 text-muted-foreground text-lg leading-relaxed">{description}</p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {features.map((f) => {
            const Icon = ICON_MAP[f.icon] || Truck;
            return (
              <motion.div
                key={f.id}
                variants={item}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="group bg-card rounded-2xl p-7 card-elevated border border-border"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-accent transition-colors duration-300">
                  <Icon className="h-6 w-6 text-primary group-hover:text-accent-foreground transition-colors duration-300" />
                </div>
                <h3 className="font-display font-semibold text-lg text-card-foreground">{f.title}</h3>
                <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
