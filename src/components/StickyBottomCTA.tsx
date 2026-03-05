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
            <p className="text-background text-sm font-medium hidden sm:block">
              📲 Get the BookMyJunk app — Free e-waste pickup at your doorstep!
            </p>
            <p className="text-background text-sm font-medium sm:hidden">
              📲 Download BookMyJunk App
            </p>
            <div className="flex items-center gap-3 flex-shrink-0">
              <a
                href= "https://wa.me/8976769851" target="_blank" rel="noopener noreferrer"
                className="border border-background/30 text-background px-4 py-2 rounded-lg text-sm font-semibold hover:bg-background/10 transition hidden sm:inline-flex items-center gap-2"
              >
                <ArrowUp className="h-4 w-4" /> Book Pickup
              </a>
              <motion.a
                href="https://play.google.com/store"
                target="_blank"
                rel="noopener noreferrer"
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
