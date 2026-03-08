import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImageModal from "./ImageModal";

interface CarouselImage {
  id: number;
  image: string;
  caption: string;
  subtitle: string;
}

const AUTOPLAY_MS = 4000;

const ImageCarousel = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStart = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load images from JSON
  useEffect(() => {
    fetch("/data/carousel-images.json")
      .then((r) => r.json())
      .then((data: CarouselImage[]) => setImages(data))
      .catch(console.error);
  }, []);

  const total = images.length;
  const maxIndex = Math.max(0, total - 3); // desktop shows 3 at a time

  const goNext = useCallback(() => {
    if (total === 0) return;
    setCurrent((p) => (p >= maxIndex ? 0 : p + 1));
  }, [total, maxIndex]);

  const goPrev = useCallback(() => {
    if (total === 0) return;
    setCurrent((p) => (p <= 0 ? maxIndex : p - 1));
  }, [total, maxIndex]);

  // Autoplay
  useEffect(() => {
    if (isPaused || modalOpen || total === 0) return;
    const id = setInterval(goNext, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, modalOpen, goNext, total]);

  // Swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
  };

  const openModal = (index: number) => {
    setModalIndex(index);
    setModalOpen(true);
  };

  if (images.length === 0) return null;

  return (
    <section id="gallery" className="py-28 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-2xl mx-auto mb-14"
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

        {/* Carousel */}
        <div
          ref={containerRef}
          className="relative max-w-6xl mx-auto overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <motion.div
            className="flex gap-4"
            animate={{ x: `calc(-${current} * (33.333% + 0.333rem))` }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {images.map((img, i) => (
              <div
                key={img.id}
                className="min-w-[calc(33.333%-0.667rem)] flex-shrink-0 cursor-pointer group hidden md:block"
                onClick={() => openModal(i)}
              >
                <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-md aspect-[4/3]">
                  <img
                    src={img.image}
                    alt={img.caption}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    draggable={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-4 pt-12">
                    <p className="text-white font-display font-semibold text-sm md:text-base drop-shadow-lg">
                      {img.caption}
                    </p>
                    <p className="text-white/70 text-xs mt-0.5">{img.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Mobile: single slide */}
          <div className="md:hidden">
            <motion.div
              className="flex"
              animate={{ x: `calc(-${current} * 100%)` }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {images.map((img, i) => (
                <div
                  key={img.id}
                  className="min-w-full flex-shrink-0 cursor-pointer"
                  onClick={() => openModal(i)}
                >
                  <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-md aspect-[4/3] mx-1">
                    <img
                      src={img.image}
                      alt={img.caption}
                      loading="lazy"
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-4 pb-4 pt-12">
                      <p className="text-white font-display font-semibold text-base drop-shadow-lg">
                        {img.caption}
                      </p>
                      <p className="text-white/70 text-xs mt-0.5">{img.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Nav arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 border border-border p-2 shadow-lg text-foreground transition-colors hover:bg-accent"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); goNext(); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 rounded-full bg-background/80 border border-border p-2 shadow-lg text-foreground transition-colors hover:bg-accent"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Pagination dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current
                    ? "w-6 bg-primary"
                    : "w-2 bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
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
