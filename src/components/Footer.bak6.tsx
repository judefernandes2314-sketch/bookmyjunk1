import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Facebook, Instagram, Youtube, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import logoFooter from "@/assets/bookmyjunk-logo_t.png";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

const IconBooking = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
  </svg>
);
const IconDestruction = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="5" rx="9" ry="3" />
    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    <line x1="3" y1="5" x2="21" y2="19" />
  </svg>
);
const IconRecycling = () => (
  <span style={{ fontSize: "18px", color: "white", lineHeight: 1 }}>♻</span>
);
const IconCertificate = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const processSteps = [
  { label: "Book Free Pickup", Icon: IconBooking },
  { label: "Data Destruction", Icon: IconDestruction },
  { label: "Scientific Recycling", Icon: IconRecycling },
  { label: "Certificate Issuance", Icon: IconCertificate },
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
    { label: "Facebook", href: facebookUrl, icon: <Facebook className="h-4 w-4 text-primary" /> },
    { label: "Instagram", href: instagramUrl, icon: <Instagram className="h-4 w-4 text-primary" /> },
    { label: "YouTube", href: youtubeUrl, icon: <Youtube className="h-4 w-4 text-primary" /> },
    { label: "LinkedIn", href: linkedinUrl, icon: <Linkedin className="h-4 w-4 text-primary" /> },
  ];

  return (
    <footer className="bg-white text-black overflow-hidden">

      {/* ── Process strip ── */}
      <div className="bg-primary/5 border-b border-primary/10">
        <div className="container mx-auto px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-5">

            {/* Logo — bigger */}
            <div className="flex-shrink-0">
              <img src={logoFooter} alt="BookMyJunk" className="h-20 w-auto" />
            </div>

            {/* Process steps */}
            <div className="flex flex-wrap items-center justify-center gap-y-4 gap-x-0">
              {processSteps.map((step, idx) => (
                <div key={step.label} className="flex items-center">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0 shadow-sm">
                      <step.Icon />
                    </div>
                    <span className="text-sm font-semibold text-black whitespace-nowrap">
                      {step.label}
                    </span>
                  </div>
                  {idx < processSteps.length - 1 && (
                    <div className="hidden md:block w-8 h-px bg-primary/30 mx-3" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main footer columns ── */}
      <div className="container mx-auto px-6 py-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >

          {/* Services */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-5">
              {(cmsFooter as any)?.services_heading || "Services"}
            </h4>
            <ul className="space-y-3 text-base text-black/60">
              {((cmsFooter as any)?.services?.length ? (cmsFooter as any).services : [
                "Doorstep E-waste Collection","Electronic Waste Pickup Service","Corporate IT Asset Disposition",
                "Data Destruction Services","Recycle Old Laptop Service","TV Recycling Pickup Service"
              ]).map((svc: string, i: number) => <li key={i}>{svc}</li>)}
            </ul>
          </motion.div>

          {/* Quick Links */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-5">
              {(cmsFooter as any)?.quick_links_heading || "Quick Links"}
            </h4>
            <ul className="space-y-3 text-base text-black/60">
              {((cmsFooter as any)?.quick_links?.length ? (cmsFooter as any).quick_links : [
                { label: "About Us", url: "/#about" },{ label: "Book Pickup", url: "/#book" },
                { label: "FAQs", url: "/#faq" },{ label: "Blog", url: "/blog" },
                { label: "Privacy Policy", url: "/privacy-policy" }
              ]).map((lnk: {label:string;url:string}, i: number) => (
                <li key={i}>
                  {lnk.url.startsWith("/") && !lnk.url.startsWith("/#") ? (
                    <Link to={lnk.url} className="hover:text-primary transition-colors duration-200">{lnk.label}</Link>
                  ) : (
                    <a href={lnk.url} className="hover:text-primary transition-colors duration-200">{lnk.label}</a>
                  )}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Follow Us */}
          <motion.div variants={itemVariants}>
            <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-5">
              {(cmsFooter as any)?.follow_heading || "Follow Us"}
            </h4>
            <ul className="space-y-3">
              {dynamicSocialLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-base text-black/60 hover:text-primary transition-colors duration-200 group"
                  >
                    <span className="w-8 h-8 rounded-lg border border-primary/25 bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
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
            <h4 className="text-sm font-bold text-black uppercase tracking-wider mb-5">
              {(cmsFooter as any)?.contact_heading || "Contact Us"}
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-3 text-base text-black/60 hover:text-primary transition-colors duration-200 group"
                >
                  <span className="w-8 h-8 rounded-full border border-primary/25 bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
                    <Phone className="h-4 w-4 text-primary" />
                  </span>
                  {phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-3 text-base text-black/60 hover:text-primary transition-colors duration-200 group"
                >
                  <span className="w-8 h-8 rounded-full border border-primary/25 bg-primary/5 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/10 transition-colors duration-200">
                    <Mail className="h-4 w-4 text-primary" />
                  </span>
                  <span className="break-all">{email}</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-base text-black/60">
                <span className="w-8 h-8 rounded-full border border-primary/25 bg-primary/5 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="h-4 w-4 text-primary" />
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
        className="border-t-2 border-black/10"
      >
        <div className="container mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm font-medium text-primary text-center sm:text-left">{copyrightText}</p>
          <p className="text-sm text-black/50 text-center sm:text-right">
            {(cmsFooter as any)?.copyright_right || "E-waste disposal services in India | Electronic scrap recycling service"}
          </p>
        </div>
      </motion.div>

    </footer>
  );
};

export default Footer;
