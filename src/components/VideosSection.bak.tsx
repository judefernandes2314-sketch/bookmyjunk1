import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Play, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface VideoItem {
  id: number;
  title: string;
  youtube_url?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  description?: string | null;
  is_featured?: number;
  is_active?: number;
}

interface ModalVideo {
  youtube_url?: string | null;
  video_url?: string | null;
  title: string;
}

const getYoutubeId = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) return parsed.pathname.replace("/", "");
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.includes("/embed/")) return parsed.pathname.split("/embed/")[1].split("?")[0];
      return parsed.searchParams.get("v");
    }
  } catch {}
  return null;
};

const getThumbnail = (video: VideoItem): string => {
  if (video.thumbnail_url) return video.thumbnail_url;
  if (video.youtube_url) {
    const id = getYoutubeId(video.youtube_url);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return "/placeholder.svg";
};

const VideosSection = () => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [modalVideo, setModalVideo] = useState<ModalVideo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  const dragStartX = useRef(0);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL || "https://api.jambologos.com";
    const load = async () => {
      try {
        const res = await fetch(`${base}/api/cms/videos`);
        if (!res.ok) return;
        const data = (await res.json()) as VideoItem[];
        if (!Array.isArray(data) || data.length === 0) return;
        const active = data.filter(
          (v) => v.is_active === undefined || v.is_active === 1 || (v.is_active as any) === true
        );
        const featured = active.filter(
          (v) => v.is_featured === 1 || (v.is_featured as any) === true
        );
        setVideos(featured.length ? featured : active);
      } catch {}
    };
    void load();
  }, []);

  const itemsPerSlide = isMobile ? 1 : 2;
  const totalSlides = Math.ceil(videos.length / itemsPerSlide);
  const showCarousel = totalSlides > 1;

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = dragStartX.current - e.changedTouches[0].clientX;
    if (diff > 50) goNext();
    else if (diff < -50) goPrev();
  };

  if (videos.length === 0) return null;

  const startIdx = currentIndex * itemsPerSlide;
  let visibleVideos = videos.slice(startIdx, startIdx + itemsPerSlide);

  if (!isMobile && visibleVideos.length < 2 && videos.length >= 2) {
    visibleVideos = [...visibleVideos, videos[(startIdx + 1) % videos.length]];
  }

  const slideVariants = {
    enter: (dir: number) => ({ x: dir * 80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -80, opacity: 0 }),
  };

  // Card width: 400px each, 2 cards + gap-5 (20px) = 820px total
  const containerMaxWidth = isMobile ? "100%" : "1020px";
  const cardWidth = isMobile ? "100%" : "500px";

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="container mx-auto px-4">

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">
            Videos
          </span>
          <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Watch Us in Action
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            See how we make responsible e-waste recycling easy and accessible across India.
          </p>
        </motion.div>

        {/* Cards container — 2 × 400px = 820px */}
        <div
          className="relative mx-auto"
          style={{ maxWidth: containerMaxWidth }}
        >

          {/* Left Arrow */}
          {showCarousel && (
            <button
              onClick={goPrev}
              type="button"
              className="absolute -left-4 md:-left-7 top-[36%] -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground transition-all duration-200 hover:border-primary hover:text-primary hover:scale-110"
              style={{ boxShadow: "var(--card-shadow)" }}
              aria-label="Previous"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}

          {/* Right Arrow */}
          {showCarousel && (
            <button
              onClick={goNext}
              type="button"
              className="absolute -right-4 md:-right-7 top-[36%] -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-card border border-border flex items-center justify-center text-foreground transition-all duration-200 hover:border-primary hover:text-primary hover:scale-110"
              style={{ boxShadow: "var(--card-shadow)" }}
              aria-label="Next"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}

          {/* Slide area */}
          <div
            className="overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 320, damping: 32 },
                  opacity: { duration: 0.18 },
                }}
                className="flex gap-5 justify-center"
              >
                {visibleVideos.map((video, i) => (
                  <div
                    key={`${video.id}-${i}`}
                    className="group cursor-pointer rounded-xl border border-border bg-card overflow-hidden transition-all duration-300 hover:-translate-y-1 flex-shrink-0"
                    style={{
                      width: cardWidth,
                      boxShadow: "var(--card-shadow)",
                    }}
                    onClick={() =>
                      setModalVideo({
                        youtube_url: video.youtube_url,
                        video_url: video.video_url,
                        title: video.title,
                      })
                    }
                  >
                    {/* Thumbnail — 400×200px */}
                    <div
                      className="relative w-full overflow-hidden bg-muted"
                      style={{ height: "300px" }}
                    >
                      <img
                        src={getThumbnail(video)}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                        draggable={false}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                      />
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                      {/* Watch badge */}
                      <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded font-medium tracking-wide">
                        Watch
                      </div>

                      {/* Play button */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-12 w-12 rounded-full bg-white/95 flex items-center justify-center shadow-md group-hover:scale-110 group-hover:bg-primary transition-all duration-300">
                          <Play className="h-5 w-5 text-primary fill-primary group-hover:text-white group-hover:fill-white ml-0.5 transition-colors duration-300" />
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-display font-semibold text-foreground text-sm leading-snug line-clamp-1">
                        {video.title}
                      </h3>
                      {video.description && (
                        <p className="text-muted-foreground text-xs mt-1 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1 text-primary text-xs font-medium">
                        <Play className="h-2.5 w-2.5 fill-primary" />
                        <span>Watch now</span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots */}
          {showCarousel && (
            <div className="flex justify-center gap-2 mt-8">
              {Array.from({ length: totalSlides }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-border hover:bg-muted-foreground/40"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}

          {/* View More */}
          <div className="text-center mt-10">
            <Link
              to="/videos"
              className="inline-flex items-center gap-2 border border-primary/60 text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              View More Videos <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setModalVideo(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-3xl bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalVideo(null)}
              type="button"
              className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white transition"
            >
              ✕
            </button>
            <div className="aspect-video w-full">
              {modalVideo.youtube_url ? (
                <iframe
                  src={`${modalVideo.youtube_url}?autoplay=1`}
                  title={modalVideo.title}
                  className="w-full h-full"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                />
              ) : modalVideo.video_url ? (
                <video
                  src={modalVideo.video_url}
                  controls
                  autoPlay
                  className="w-full h-full"
                />
              ) : null}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default VideosSection;
