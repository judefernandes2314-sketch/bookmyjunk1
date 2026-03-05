import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import logoFooter from "@/assets/BMJ_Logo.webp";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const Footer = () => (
  <footer className="bg-white text-black py-16 overflow-hidden">
    <div className="container mx-auto px-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="grid md:grid-cols-4 gap-10"
      >
        <motion.div variants={itemVariants}>
          <div className="mb-4">
            <img src={logoFooter} alt="BookMyJunk" className="h-16 w-auto" />
          </div>
          <p className="text-background/60 text-sm leading-relaxed">
            India's trusted e-waste disposal service. Certified, eco-friendly, and free doorstep pickup. Making responsible e-waste recycling accessible to everyone.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h4 className="font-display font-semibold mb-4">Services</h4>
          <ul className="space-y-2 text-sm text-background/60">
            <li>Doorstep E-Waste Collection</li>
            <li>Electronic Waste Pickup Service</li>
            <li>Corporate IT Asset Disposition</li>
            <li>Data Destruction Services</li>
            <li>Recycle Old Laptop Service</li>
            <li>TV Recycling Pickup Service</li>
          </ul>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h4 className="font-display font-semibold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-background/60">
            <li><a href="/#about" className="hover:text-background transition">About Us</a></li>
            <li><a href="/#book" className="hover:text-background transition">Book Pickup</a></li>
            <li><a href="/#faq" className="hover:text-background transition">FAQs</a></li>
            <li><Link to="/blog" className="hover:text-background transition">Blog</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-background transition">Privacy Policy</Link></li>
          </ul>
        </motion.div>
        <motion.div variants={itemVariants}>
          <h4 className="font-display font-semibold mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-background/60">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +91 8976769851</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> connectwithus@bookmyjunk.com</li>
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5" /> Andheri (E),Mumbai, Maharashtra, India</li>
          </ul>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p className="text-sm text-background/40">© {new Date().getFullYear()} BookMyJunk.com — Certified E-Waste Recycling Company in India</p>
        <p className="text-xs text-background/30">E-waste disposal services in India | Electronic scrap recycling service</p>
      </motion.div>
    </div>
  </footer>
);

export default Footer;
