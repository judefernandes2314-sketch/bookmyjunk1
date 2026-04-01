import { useEffect, useMemo, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, X, ChevronLeft, ChevronRight } from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type GalleryImage = {
  id: number;
  image: string;
  caption: string;
  subtitle: string;
};

const API_BASE = import.meta.env.VITE_API_URL || "https://api.jambologos.com";

const GalleryPage = () => {
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const fallback = async () => {
        const r = await fetch("/data/carousel-images.json");
        const data = (await r.json()) as Array<{ id: number; image: string; caption: string; subtitle: string }>;
        const mapped: GalleryImage[] = Array.isArray(data)
          ? data.map((x, i) => ({
              id: x.id ?? i + 1,
              image: x.image,
              caption: x.caption || "",
              subtitle: x.subtitle || "",
            }))
          : [];
        setImages(mapped);
      };

      try {
        const res = await fetch(`${API_BASE}/api/cms/gallery`);
        if (!res.ok) {
          await fallback();
          return;
        }
        const data = (await res.json()) as any[];
        const mapped: GalleryImage[] = Array.isArray(data)
          ? data
              .filter((x) => x?.image_url)
              .map((x, i) => ({
                id: x.id ?? i + 1,
                image: x.image_url,
                caption: x.caption || "",
                subtitle: x.alt_text || "",
              }))
          : [];
        if (!mapped.length) {
          await fallback();
          return;
        }
        setImages(mapped);
      } catch {
        await fallback();
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const total = images.length;

  const openLightbox = (idx: number) => {
    setCurrentIndex(idx);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);
  const prev = () => setCurrentIndex((i) => (i - 1 + total) % total);
  const next = () => setCurrentIndex((i) => (i + 1) % total);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [lightboxOpen, total]);

  const current = useMemo(() => images[currentIndex], [images, currentIndex]);

  const gridContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.06 } },
  };
  const gridItem = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
            <div className="mt-4">
              <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">GALLERY</span>
              <h1 className="mt-3 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
                Our Work in Pictures
              </h1>
              <p className="mt-4 text-muted-foreground text-lg max-w-2xl">
                Explore our collection drives, recycling operations, and community initiatives across India.
              </p>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[4/3] rounded-2xl bg-muted animate-pulse border border-border" />
              ))}
            </div>
          ) : (
            <motion.div
              variants={gridContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
            >
              {images.map((img, idx) => (
                <motion.button
                  key={img.id}
                  variants={gridItem}
                  type="button"
                  onClick={() => openLightbox(idx)}
                  whileHover={{ y: -6, scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 320, damping: 24 }}
                  className="group relative rounded-2xl border border-border bg-card overflow-hidden text-left"
                  style={{ boxShadow: "var(--card-shadow)" }}
                >
                  <div className="aspect-[4/3] bg-muted/30 overflow-hidden">
                    <img src={img.image} alt={img.caption} className="w-full h-full object-contain" loading="lazy" />
                  </div>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-foreground/80 via-foreground/30 to-transparent flex items-end p-4">
                    <p className="text-primary-foreground font-display font-semibold text-sm drop-shadow-lg">
                      {img.caption}
                    </p>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />

      <AnimatePresence>
        {lightboxOpen && current && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={closeLightbox}
                className="absolute -top-2 -right-2 md:top-0 md:right-0 h-10 w-10 rounded-full bg-card/10 border border-white/20 text-white flex items-center justify-center hover:bg-card/20 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {total > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-14 h-10 w-10 rounded-full bg-card/10 border border-white/20 text-white flex items-center justify-center hover:bg-card/20 transition-colors"
                    aria-label="Previous"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={next}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-14 h-10 w-10 rounded-full bg-card/10 border border-white/20 text-white flex items-center justify-center hover:bg-card/20 transition-colors"
                    aria-label="Next"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="flex flex-col items-center">
                <img
                  src={current.image}
                  alt={current.caption}
                  className="max-h-[80vh] w-auto max-w-full object-contain rounded-xl"
                />
                <p className="mt-4 text-white/90 text-center font-display font-semibold">
                  {current.caption}
                </p>
                <p className="mt-1 text-white/60 text-sm text-center">
                  {currentIndex + 1} / {total}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryPage;

