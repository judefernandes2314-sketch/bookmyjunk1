import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ArrowUp } from "lucide-react";

const StickyBottomCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-50 bg-foreground/95 backdrop-blur-lg border-t border-border px-4 py-3 shadow-lg"
        >
          <div className="container mx-auto flex items-center justify-between gap-4">

            {/* Left — copyright */}
            <p
              className="text-sm font-medium flex-shrink-0 hidden md:block"
              style={{ color: "#00bd88" }}
            >
              © {new Date().getFullYear()} All rights reserved by BookMyJunk
            </p>

            {/* Center — promo text */}
            <p className="text-background text-sm font-medium hidden sm:block text-center flex-1">
              📲 Get the BookMyJunk app — Free e-waste pickup at your doorstep!
            </p>
            <p className="text-background text-sm font-medium sm:hidden text-center flex-1">
              📲 Download BookMyJunk App
            </p>

            {/* Right — buttons */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href="https://wa.me/+918976769851"
                target="_blank"
                rel="noopener noreferrer"
                className="border border-background/30 text-background px-4 py-2 rounded-lg text-sm font-semibold hover:bg-background/10 transition hidden sm:inline-flex items-center gap-2"
              >
                <ArrowUp className="h-4 w-4" /> Book Pickup
              </a>
              <motion.a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  const ua = navigator.userAgent || (navigator as any).vendor || (window as any).opera;
                  const isIOS =
                    /iPad|iPhone|iPod/.test(ua) ||
                    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
                  const iosUrl = "https://apps.apple.com/us/app/bookmyjunk/id1595834562";
                  const androidUrl =
                    "https://play.google.com/store/apps/details?id=com.bmj.bookmyjunk&hl=en_IN";
                  window.open(isIOS ? iosUrl : androidUrl, "_blank", "noopener,noreferrer");
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition flex items-center gap-2"
              >
                <Download className="h-4 w-4" /> Download App
              </motion.a>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyBottomCTA;
