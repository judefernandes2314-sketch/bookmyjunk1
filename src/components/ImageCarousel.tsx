import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageModal from "./ImageModal";

interface CarouselImage {
  id: number;
  image: string;
  caption: string;
  subtitle: string;
}

const AUTOPLAY_MS = 5000;
const ITEMS_PER_PAGE = 3;
const ease = [0.25, 0.46, 0.45, 0.94] as const;

const ImageCarousel = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef(0);

  useEffect(() => {
    fetch("/data/carousel-images.json")
      .then((r) => r.json())
      .then((data: CarouselImage[]) => setImages(data))
      .catch(console.error);
  }, []);

  const totalPages = Math.ceil(images.length / ITEMS_PER_PAGE);

  const goNext = useCallback(() => {
    if (totalPages === 0) return;
    setPage((p) => (p + 1) % totalPages);
  }, [totalPages]);

  const goPrev = useCallback(() => {
    if (totalPages === 0) return;
    setPage((p) => (p - 1 + totalPages) % totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (isPaused || modalOpen || totalPages === 0) return;
    const id = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, modalOpen, goNext, totalPages]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? goNext() : goPrev();
  };

  const openModal = (globalIndex: number) => {
    setModalIndex(globalIndex);
    setModalOpen(true);
  };

  if (images.length === 0) return null;

  const startIdx = page * ITEMS_PER_PAGE;
  const visible = images.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  return (
    <section id="gallery" className="py-28 bg-background relative overflow-hidden">
      {/* Subtle background accent — matches CategoriesSection */}
      <div className="absolute inset-0 bg-gradient-to-b from-accent/20 via-transparent to-accent/20 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">
            Gallery
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Our Work in Pictures
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            A glimpse into how we collect, sort, and responsibly recycle e-waste across India.
          </p>
        </motion.div>

        {/* Gallery with navigation */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Nav arrows */}
          {totalPages > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute -left-2 md:-left-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground transition-all hover:border-primary hover:text-primary"
                style={{ boxShadow: "var(--card-shadow)" }}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goNext}
                className="absolute -right-2 md:-right-5 top-1/2 -translate-y-1/2 z-20 h-10 w-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground transition-all hover:border-primary hover:text-primary"
                style={{ boxShadow: "var(--card-shadow)" }}
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              {visible.map((img, i) => {
                const globalIdx = startIdx + i;
                return (
                  <motion.div
                    key={img.id}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease }}
                    whileHover={{ y: -6 }}
                    className="group relative rounded-2xl border border-border bg-card overflow-hidden cursor-pointer transition-shadow duration-300"
                    style={{
                      boxShadow: "var(--card-shadow)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow-hover)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.boxShadow = "var(--card-shadow)";
                    }}
                    onClick={() => openModal(globalIdx)}
                  >
                    <div className="aspect-[4/3] overflow-hidden">
                      <img
                        src={img.image}
                        alt={img.caption}
                        loading="lazy"
                        draggable={false}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                    </div>
                    {/* Caption */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 via-foreground/40 to-transparent px-5 pb-5 pt-14 transition-opacity">
                      <p className="text-primary-foreground font-display font-bold text-base md:text-lg drop-shadow-md leading-snug">
                        {img.caption}
                      </p>
                      <p className="text-primary-foreground/70 text-xs md:text-sm mt-1">
                        {img.subtitle}
                      </p>
                    </div>
                    {/* Hover ring effect */}
                    <div className="absolute inset-0 rounded-2xl ring-0 ring-primary/0 group-hover:ring-2 group-hover:ring-primary/30 transition-all duration-300 pointer-events-none" />
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>

          {/* Pagination dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-10">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === page
                      ? "w-8 bg-primary"
                      : "w-2.5 bg-border hover:bg-muted-foreground/40"
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Fullscreen modal */}
      <ImageModal
        images={images}
        currentIndex={modalIndex}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigate={setModalIndex}
      />
    </section>
  );
};

export default ImageCarousel;
