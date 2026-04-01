import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logoFooter from "@/assets/BMJ_Logo.webp";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

// Process step icons as inline SVGs
const IconBooking = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
  </svg>
);
const IconDestruction = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14H6L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4h6v2" />
  </svg>
);
const IconRecycling = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2z" />
    <path d="M12 6v6l4 2" />
  </svg>
);
const IconCertificate = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const processSteps = [
  { label: "Book Free Pickup", Icon: IconBooking },
  { label: "Data Destruction", Icon: IconDestruction },
  { label: "Scientific Recycling", Icon: IconRecycling },
  { label: "Certificate Issuance", Icon: IconCertificate },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "#",
    icon: <Facebook className="h-3.5 w-3.5 text-primary" />,
  },
  {
    label: "Instagram",
    href: "#",
    icon: <Instagram className="h-3.5 w-3.5 text-primary" />,
  },
  {
    label: "YouTube",
    href: "#",
    icon: <Youtube className="h-3.5 w-3.5 text-primary" />,
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: <Linkedin className="h-3.5 w-3.5 text-primary" />,
  },
];

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
  const facebookUrl = (cmsFooter?.facebook_url || "").trim() || "#";
  const instagramUrl = (cmsFooter?.instagram_url || "").trim() || "#";
  const youtubeUrl = (cmsFooter?.youtube_url || "").trim() || "#";
  const linkedinUrl = (cmsFooter?.linkedin_url || "").trim() || "#";

  const copyrightText =
    (cmsFooter?.copyright_text || "").trim() ||
    `© ${new Date().getFullYear()} BookMyJunk.com — Certified E-waste Recycling Company in India`;

  const addressNode = useMemo(() => {
    if (!addressText) {
      return (
        <>
          422, The Summit Business Bay,<br />
          Near WEH Metro Station,<br />
          Andheri (E), Mumbai-400093
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

  const dynamicSocialLinks = [
    { label: "Facebook", href: facebookUrl, icon: <Facebook className="h-3.5 w-3.5 text-primary" /> },
    { label: "Instagram", href: instagramUrl, icon: <Instagram className="h-3.5 w-3.5 text-primary" /> },
    { label: "YouTube", href: youtubeUrl, icon: <Youtube className="h-3.5 w-3.5 text-primary" /> },
    { label: "LinkedIn", href: linkedinUrl, icon: <Linkedin className="h-3.5 w-3.5 text-primary" /> },
  ];

  return (
    <footer className="bg-white text-black overflow-hidden">

      {/* ── Process strip ── */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0">

            {/* Logo */}
            <div className="flex-shrink-0">
              <img src={logoFooter} alt="BookMyJunk" className="h-12 w-auto" />
            </div>

            {/* Steps */}
            <div className="flex flex-wrap items-center justify-center gap-y-3 gap-x-0">
              {processSteps.map((step, idx) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <step.Icon />
                    </div>
                    <span className="text-xs font-semibold text-black whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                  {idx < processSteps.length - 1 && (
                    <div className="hidden sm:block w-6 h-px bg-primary/30 mx-2.5" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer columns ── */}
      <div className="container mx-auto px-4 py-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-black/55">
              <li>Doorstep E-waste Collection</li>
              <li>Electronic Waste Pickup Service</li>
              <li>Corporate IT Asset Disposition</li>
              <li>Data Destruction Services</li>
              <li>Recycle Old Laptop Service</li>
              <li>TV Recycling Pickup Service</li>
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-black/55">
              <li>
                <a href="/#about" className="hover:text-primary transition-colors duration-200">
                  About Us
                </a>
              </li>
              <li>
                <a href="/#book" className="hover:text-primary transition-colors duration-200">
                  Book Pickup
                </a>
              </li>
              <li>
                <a href="/#faq" className="hover:text-primary transition-colors duration-200">
                  FAQs
                </a>
              </li>
              <li>
                <Link to="/blog" className="hover:text-primary transition-colors duration-200">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-primary transition-colors duration-200">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </motion.div>

          {/* Follow Us */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-4">
              Follow Us
            </h4>
            <ul className="space-y-2.5">
              {dynamicSocialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-sm text-black/55 hover:text-primary transition-colors duration-200 group"
                  >
                    <span className="w-7 h-7 rounded-lg border border-primary/25 bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
                      {s.icon}
                    </span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact */}
          <motion.div variants={itemVariants}>
            <h4 className="text-xs font-bold text-black uppercase tracking-wider mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-2.5 text-sm text-black/55 hover:text-primary transition-colors duration-200 group"
                >
                  <span className="w-7 h-7 rounded-full border border-primary/25 bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
                    <Phone className="h-3.5 w-3.5 text-primary" />
                  </span>
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2.5 text-sm text-black/55 hover:text-primary transition-colors duration-200 group"
                >
                  <span className="w-7 h-7 rounded-full border border-primary/25 bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
                    <Mail className="h-3.5 w-3.5 text-primary" />
                  </span>
                  <span className="break-all">{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-2.5 text-sm text-black/55">
                <span className="w-7 h-7 rounded-full border border-primary/25 bg-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                </span>
                <span className="leading-relaxed">
                  {addressNode}
                </span>
              </li>
            </ul>
          </motion.div>

        </motion.div>
      </div>

      {/* ── Copyright bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
        className="border-t border-black/7"
      >
        <div className="container mx-auto px-4 py-3 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-primary text-center sm:text-left">{copyrightText}</p>
          <p className="text-xs text-black/38 text-center sm:text-right">
            E-waste disposal services in India | Electronic scrap recycling service
          </p>
        </div>
      </motion.div>

    </footer>
  );
};

export default Footer;
