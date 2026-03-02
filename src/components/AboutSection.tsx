import { motion } from "framer-motion";
import { Recycle, Shield, Truck, Leaf, Award, Users } from "lucide-react";

const features = [
  { icon: Truck, title: "Doorstep E-Waste Collection", desc: "We pick up your old electronics right from your doorstep — completely free. Available in Mumbai, Delhi, Bangalore, and 50+ cities." },
  { icon: Shield, title: "Safe Disposal of E-Waste", desc: "Your data is securely destroyed. Every device goes through certified data wiping before recycling." },
  { icon: Recycle, title: "Responsible E-Waste Recycling", desc: "We follow government-approved processes to ensure zero landfill. 95% material recovery rate." },
  { icon: Leaf, title: "Eco-Friendly E-Waste Disposal", desc: "Our recycling process prevents toxic materials from contaminating soil and water. Go green with BookMyJunk." },
  { icon: Award, title: "Certified E-Waste Recycling Company", desc: "CPCB authorized, ISO certified. We are the best e-waste recycler trusted by 500+ corporates." },
  { icon: Users, title: "Bulk & Corporate Solutions", desc: "IT asset disposition, compliance certificates, and bulk electronic scrap recycling service for businesses." },
];

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.08 } } };
const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const AboutSection = () => (
  <section id="about" className="py-28 bg-background">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="text-center max-w-3xl mx-auto mb-20"
      >
        <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">About BookMyJunk</span>
        <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight leading-tight">
          India's Leading E-Waste Management Solutions Provider
        </h2>
        <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
          BookMyJunk is a certified e-waste recycling company offering free electronic waste pickup service across India. 
          Whether you want to recycle old laptops, dispose of old computers, recycle mobile phones, or need a TV recycling pickup service — 
          we handle it all responsibly and sustainably.
        </p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        {features.map((f) => (
          <motion.div
            key={f.title}
            variants={item}
            whileHover={{ y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="group bg-card rounded-2xl p-7 card-elevated border border-border"
          >
            <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mb-5 group-hover:bg-primary/10 transition-colors duration-300">
              <f.icon className="h-6 w-6 text-accent-foreground group-hover:text-primary transition-colors duration-300" />
            </div>
            <h3 className="font-display font-semibold text-lg text-card-foreground">{f.title}</h3>
            <p className="mt-2 text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default AboutSection;
