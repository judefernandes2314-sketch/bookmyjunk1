import { motion } from "framer-motion";
import { ArrowDown, Leaf, ShieldCheck, Truck, Download, Smartphone } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
};
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const, delay } }
});

const HeroSection = () =>
<section className="relative min-h-screen flex items-center justify-center overflow-hidden">
    <img
    src={heroBg}
    alt="E-waste recycling facility for responsible e-waste recycling in India"
    className="absolute inset-0 w-full h-full object-cover"
    loading="eager"
    fetchPriority="high" />
  
    <div className="absolute inset-0 hero-overlay" />
    <div className="relative z-10 container mx-auto py-32 text-center px-[16px]">
      <motion.div variants={stagger} initial="hidden" animate="visible">
        <motion.span
        variants={fadeUp()}
        className="inline-block bg-primary-foreground/10 text-primary-foreground text-xs font-semibold tracking-[0.2em] uppercase px-5 py-2 rounded-full mb-6 border border-primary-foreground/15 backdrop-blur-sm">
        
          India's #1 E-waste Recycling App
        </motion.span>
        <motion.h1
        variants={fadeUp(0.1)}
        className="font-display font-bold text-primary-foreground max-w-5xl mx-auto tracking-tight">
        
          <span className="block text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-[1.1] whitespace-nowrap">Declutter your home, go greener.</span>
          <span className="block text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-[1.2] text-secondary mt-2 whitespace-nowrap">Book Free E-waste Collection Now.</span>
        </motion.h1>
        <motion.p
        variants={fadeUp(0.2)}
        className="mt-6 text-lg md:text-xl text-primary-foreground/75 max-w-2xl mx-auto leading-relaxed">
        
          Download the BookMyJunk app & schedule a free doorstep pickup. We recycle old laptops, phones, TVs & more — certified, eco-friendly, and hassle-free.
        </motion.p>

        <motion.div variants={fadeUp(0.3)} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <motion.a
          href="https://wa.me/918976769851?text=Hi%2C%20I%20want%20to%20book%20a%20free%20e-waste%20pickup"
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold shadow-lg shadow-primary/25 flex items-center justify-center gap-3 transition-colors">
          
            <Smartphone className="h-5 w-5" /> Book Free Pickup
          </motion.a>
          {/*<motion.a
          href="#book"
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          className="border-2 border-primary-foreground/25 text-primary-foreground px-8 py-4 rounded-xl text-lg font-semibold backdrop-blur-sm hover:bg-primary-foreground/10 transition-colors flex items-center justify-center gap-3"
          >
          <Download className="h-5 w-5" /> Book Free Pickup
          </motion.a>*/}
        </motion.div>

        <motion.div variants={fadeUp(0.4)} className="mt-8 flex items-center justify-center gap-4">
          <a href="https://play.google.com/store/apps/details?id=com.bmj.bookmyjunk&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
            <img src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" alt="Get BookMyJunk on Google Play Store" className="h-11 hover:opacity-80 transition" loading="lazy" />
          </a>
          <a href="https://apps.apple.com/in/app/bookmyjunk/id1595834562" target="_blank" rel="noopener noreferrer">
            <img src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" alt="Download BookMyJunk on App Store" className="h-11 hover:opacity-80 transition" loading="lazy" />
          </a>
        </motion.div>

        <motion.p variants={fadeUp(0.45)} className="mt-4 text-primary-foreground/40 text-sm tracking-wide">
          ⭐ 4.8 rating · 50,000+ downloads · Free to use
        </motion.p>
      </motion.div>

      <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
      
        {[
      { icon: Truck, text: "Free Doorstep Pickup" },
      { icon: ShieldCheck, text: "Certified & Secure" },
      { icon: Leaf, text: "Eco-Friendly Process" }].
      map(({ icon: Icon, text }, i) =>
      <motion.div
        key={text}
        whileHover={{ y: -3 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="flex items-center gap-3 bg-primary-foreground/8 backdrop-blur-lg rounded-2xl px-5 py-4 border border-primary-foreground/10">
        
            <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
              <Icon className="h-5 w-5 text-secondary" />
            </div>
            <span className="text-primary-foreground font-medium text-sm">{text}</span>
          </motion.div>
      )}
      </motion.div>

      <motion.a
      href="#about"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2 }}
      className="inline-block mt-12">
      
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
          <ArrowDown className="h-6 w-6 text-primary-foreground/40" />
        </motion.div>
      </motion.a>
    </div>
  </section>;


export default HeroSection;