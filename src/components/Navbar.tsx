import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Download } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logoTBG from "@/assets/BMJ_LOGO_TBG.webp";

const links = [
  { label: "About", href: "#about" },
  { label: "Services", href: "#categories" },
  { label: "Videos", href: "#videos" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  const getHref = (href: string) => {
    if (href.startsWith("/")) return href;
    return isHome ? href : `/${href}`;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/100 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto flex items-center justify-between h-20 px-4">
        <a href="/" className="flex items-center gap-2.5">
          <img src={logoTBG} alt="BookMyJunk" className="h-20 w-auto" />
        </a>
        <div className="hidden md:flex items-center gap-7">
          {links.map((l) =>
            l.href.startsWith("/") ? (
              <Link key={l.label} to={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                {l.label}
              </Link>
            ) : (
              <a key={l.label} href={getHref(l.href)} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200">
                {l.label}
              </a>
            )
          )}
          <a href="https://wa.me/8976769851" target="_blank" rel="noopener noreferrer" className="border border-primary/60 text-primary px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/5 transition-colors duration-200">
            Book Pickup
          </a>
          {/*<a href="https://play.google.com/store" target="_blank" rel="noopener noreferrer" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors duration-200 flex items-center gap-1.5 shadow-sm shadow-primary/20">
            <Download className="h-4 w-4" /> Get App
          </a>*/}
        </div>
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground" aria-label="Toggle menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="md:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1">
              {links.map((l) =>
                l.href.startsWith("/") ? (
                  <Link key={l.label} to={l.href} onClick={() => setOpen(false)} className="block py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </Link>
                ) : (
                  <a key={l.label} href={getHref(l.href)} onClick={() => setOpen(false)} className="block py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {l.label}
                  </a>
                )
              )}
              <a href={getHref("#book")} onClick={() => setOpen(false)} className="block mt-2 border border-primary/60 text-primary text-center px-5 py-2.5 rounded-lg text-sm font-semibold">
                Book Pickup
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  const userAgent = navigator.userAgent || (navigator as any).vendor || (window as any).opera;
                  const ios = /iPad|iPhone|iPod/.test(userAgent) || 
                    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
                  const android = /android/i.test(userAgent);
                  const iosStore = "https://apps.apple.com/in/app/bookmyjunk/id1595834562";
                  const androidStore = "https://play.google.com/store/apps/details?id=com.bmj.bookmyjunk&pcampaignid=web_share";
                  if (ios) {
                    window.open(iosStore, "_blank", "noopener,noreferrer");
                  } else if (android) {
                    window.open(androidStore, "_blank", "noopener,noreferrer");
                  } else {
                    window.open(androidStore, "_blank", "noopener,noreferrer");
                  }
                }}
                className="block mt-2 bg-primary text-primary-foreground text-center px-5 py-2.5 rounded-lg text-sm font-semibold"
              >
                📲 Download App
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
