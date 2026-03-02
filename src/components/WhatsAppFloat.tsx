import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";

// ── Easy-edit config ──
const WHATSAPP_NUMBER = "918976769851";
const DEFAULT_MESSAGE = "Hi, I want to book a free e-waste pickup";
const SHOW_AFTER_PX = 400;

const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`;

const WhatsAppFloat = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > SHOW_AFTER_PX);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-20 right-5 z-50 h-14 w-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 hover:shadow-xl hover:shadow-[#25D366]/40 transition-shadow"
        >
          <MessageCircle className="h-6 w-6" />
        </motion.a>
      )}
    </AnimatePresence>
  );
};

export default WhatsAppFloat;
