import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowLeft, Play, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type CmsVideo = {
  id?: number;
  title?: string;
  description?: string;
  youtube_url?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
};

type VideoToShow = {
  id: number;
  title: string;
  description: string;
  youtube_url?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
};

const extractYouTubeId = (raw: string) => {
  try {
    const trimmed = raw.trim();
    if (!trimmed) return "";
    const asUrl = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const url = new URL(asUrl);
    if (url.hostname.includes("youtu.be")) return (url.pathname || "").replace("/", "");
    if (url.searchParams.get("v")) return url.searchParams.get("v") ?? "";
    if (url.pathname.includes("/embed/")) return url.pathname.split("/embed/")[1] ?? "";
    return "";
  } catch {
    return "";
  }
};

const getThumbUrl = (v: VideoToShow) => {
  if (v.thumbnail_url) return v.thumbnail_url;
  if (v.youtube_url) {
    const id = extractYouTubeId(v.youtube_url);
    if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }
  return "/placeholder.svg";
};

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.12 } } };
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const VideosPage = () => {
  const [loading, setLoading] = useState(true);
  const [cmsVideos, setCmsVideos] = useState<CmsVideo[]>([]);
  const [openVideo, setOpenVideo] = useState<VideoToShow | null>(null);

  useEffect(() => {
    document.title = "Our Videos | BookMyJunk";
  }, []);

  useEffect(() => {
    const base = import.meta.env.VITE_API_URL;
    if (!base) {
      setLoading(false);
      return;
    }
    const load = async () => {
      try {
        const res = await fetch(`${base}/api/cms/videos`, { method: "GET" });
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const data = (await res.json()) as unknown;
        if (Array.isArray(data)) setCmsVideos(data as any);
      } catch {
        // ignore; show empty state
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, []);

  const videosToShow = useMemo(() => {
    const mapped = (Array.isArray(cmsVideos) ? cmsVideos : [])
      .filter((x) => {
        const hasYouTube = typeof x?.youtube_url === "string" && x.youtube_url.trim() !== "";
        const hasFile = typeof x?.video_url === "string" && x.video_url.trim() !== "";
        return hasYouTube || hasFile;
      })
      .map((x, idx) => ({
        id: typeof x.id === "number" ? x.id : idx + 1,
        title: (x.title || "").trim() || `Video ${idx + 1}`,
        description: (x.description || "").trim(),
        youtube_url: (x.youtube_url || "").trim() || null,
        video_url: (x.video_url || "").trim() || null,
        thumbnail_url: (x.thumbnail_url || "").trim() || null,
      })) as VideoToShow[];
    return mapped;
  }, [cmsVideos]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <section className="pt-10 pb-16">
          <div className="container mx-auto px-4">
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>

            <div className="mt-6 max-w-2xl">
              <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">Videos</span>
              <h1 className="mt-3 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
                Our Videos
              </h1>
              <p className="mt-4 text-muted-foreground text-lg">
                Watch all our e-waste recycling videos. Learn how BookMyJunk makes responsible disposal easy.
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card overflow-hidden">
                    <div className="aspect-video bg-muted animate-pulse" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                      <div className="h-3 w-full bg-muted animate-pulse rounded" />
                      <div className="h-3 w-5/6 bg-muted animate-pulse rounded" />
                    </div>
                  </div>
                ))}
              </div>
            ) : videosToShow.length ? (
              <motion.div
                variants={container}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10"
              >
                {videosToShow.map((v) => (
                  <motion.article
                    key={v.id}
                    variants={item}
                    whileHover={{ y: -4 }}
                    transition={{ type: "spring", stiffness: 420, damping: 26 }}
                    className="bg-card rounded-2xl overflow-hidden card-elevated border border-border"
                  >
                    <figure>
                      <button
                        type="button"
                        aria-label={`Play ${v.title}`}
                        onClick={() => setOpenVideo(v)}
                        className="block w-full text-left"
                      >
                        <div className="relative w-full aspect-video overflow-hidden rounded-t-2xl bg-muted">
                          <img
                            src={getThumbUrl(v)}
                            alt={`${v.title} thumbnail`}
                            className="w-full h-full object-cover aspect-video"
                            loading="lazy"
                            onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                          />
                          <span className="absolute inset-0 grid place-items-center">
                            <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/85 border border-border shadow text-primary">
                              <Play className="h-6 w-6 translate-x-0.5" />
                            </span>
                          </span>
                        </div>
                      </button>
                      <figcaption className="p-6">
                        <h2 className="font-display font-semibold text-lg text-card-foreground">{v.title}</h2>
                        <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                          {(v.description || "").length > 140 ? `${v.description.slice(0, 140)}…` : v.description || "—"}
                        </p>
                      </figcaption>
                    </figure>
                  </motion.article>
                ))}
              </motion.div>
            ) : (
              <div className="mt-10 text-muted-foreground">No videos available yet.</div>
            )}
          </div>
        </section>

        {openVideo ? (
          <div
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`Playing ${openVideo.title}`}
            onClick={() => setOpenVideo(null)}
          >
            <div
              className="w-full max-w-4xl bg-card border border-border rounded-2xl overflow-hidden shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground truncate">{openVideo.title}</p>
                <button
                  type="button"
                  aria-label="Close video"
                  className="inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-muted"
                  onClick={() => setOpenVideo(null)}
                >
                  <X className="h-5 w-5 text-muted-foreground" />
                </button>
              </div>
              <div className="relative w-full aspect-video bg-black">
                {openVideo.video_url ? (
                  <video src={openVideo.video_url} controls autoPlay className="absolute inset-0 w-full h-full" />
                ) : openVideo.youtube_url ? (
                  <iframe
                    src={openVideo.youtube_url}
                    title={openVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                ) : (
                  <div className="absolute inset-0 grid place-items-center">
                    <p className="text-sm text-muted-foreground">Video unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </>
  );
};

export default VideosPage;

