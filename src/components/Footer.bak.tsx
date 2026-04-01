import { useEffect, useMemo, useState } from "react";
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

const Footer = () => {
  const [cmsFooter, setCmsFooter] = useState<Partial<{
    company_name: string;
    address: string;
    phone: string;
    email: string;
    whatsapp: string;
    facebook_url: string;
    instagram_url: string;
    twitter_url: string;
    youtube_url: string;
    linkedin_url: string;
    copyright_text: string;
  }> | null>(null);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL;
    if (!base) return;
    const load = async () => {
      try {
        const res = await fetch(`${base}/api/cms/footer`, { method: "GET" });
        if (!res.ok) return;
        const data = (await res.json()) as any;
        if (data && typeof data === "object") setCmsFooter(data);
      } catch {
        // ignore; fallback to hardcoded
      }
    };
    void load();
  }, []);

  const phone = (cmsFooter?.phone || "").trim() || "+91 8976769851";
  const email = (cmsFooter?.email || "").trim() || "connectwithus@bookmyjunk.com";
  const addressText = (cmsFooter?.address || "").trim();
  const copyrightText =
    (cmsFooter?.copyright_text || "").trim() ||
    `© ${new Date().getFullYear()} BookMyJunk.com — Certified E-waste Recycling Company in India`;

  const addressNode = useMemo(() => {
    if (!addressText) {
      return (
        <>
          Unit No. 422, 4th Floor,<br />
          The Summit Business Bay,<br />
          Opp. Cine Max Theater,<br />
          Near WEH Metro Station,<br />
          Andheri - Kurla Road,<br />
          Andheri East,<br />
          Mumbai - 400093
        </>
      );
    }
    const parts = addressText.split(/\r?\n/);
    return (
      <>
        {parts.map((line, idx) => (
          <span key={idx}>
            {line}
            {idx < parts.length - 1 ? <br /> : null}
          </span>
        ))}
      </>
    );
  }, [addressText]);

  return (
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
              <img src={logoFooter} alt="BookMyJunk" className="h-20 w-auto" />
            </div>
            <p className="text-black/60 text-sm leading-relaxed">
              India's trusted e-waste disposal service. Certified, eco-friendly, and free doorstep pickup. Making responsible e-waste recycling accessible to everyone.
            </p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h4 className="font-display font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-black/60">
              <li>Doorstep E-waste Collection</li>
              <li>Electronic Waste Pickup Service</li>
              <li>Corporate IT Asset Disposition</li>
              <li>Data Destruction Services</li>
              <li>Recycle Old Laptop Service</li>
              <li>TV Recycling Pickup Service</li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-black/60">
              <li><a href="/#about" className="hover:text-background transition">About Us</a></li>
              <li><a href="/#book" className="hover:text-background transition">Book Pickup</a></li>
              <li><a href="/#faq" className="hover:text-background transition">FAQs</a></li>
              <li><Link to="/blog" className="hover:text-background transition">Blog</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-background transition">Privacy Policy</Link></li>
            </ul>
          </motion.div>
          <motion.div variants={itemVariants}>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-black/60">
              <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> {phone}</li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${email}`}
                  className="hover:underline"
                >
                  {email}{" "}
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5" />
                <span>
                  {addressNode}
                </span>
              </li>
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
          <p className="text-sm text-primary">{copyrightText}</p>
          <p className="text-xs text-primary">E-waste disposal services in India | Electronic scrap recycling service</p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
