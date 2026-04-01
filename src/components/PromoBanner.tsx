import { useEffect, useState } from "react";

import defaultBanner from "@/assets/banners/banner-gadgetguruz.png";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.jambologos.com";
const DEFAULT_LINK_URL = "https://gadgetguruz.com/referrer/bookmyjunk";

interface BannerResponse {
  image_url?: string;
  link_url?: string;
}

const PromoBanner = () => {
  const [imageUrl, setImageUrl] = useState<string>(defaultBanner);
  const [linkUrl, setLinkUrl] = useState<string>(DEFAULT_LINK_URL);

  useEffect(() => {
    let cancelled = false;

    const loadBanner = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/cms/banner`, {
          method: "GET",
        });

        if (!res.ok) {
          return;
        }

        const data = (await res.json()) as BannerResponse | null;
        if (!data || cancelled) return;

        const trimmed = (data.image_url || "").trim();
        const nextImage =
          trimmed && !trimmed.startsWith("data:") ? trimmed : defaultBanner;
        const nextLink = data.link_url && data.link_url.trim() !== "" ? data.link_url : DEFAULT_LINK_URL;

        setImageUrl(nextImage);
        setLinkUrl(nextLink);
      } catch {
        // swallow; fallback to defaults
      }
    };

    void loadBanner();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-3 sm:px-4 mt-6 mb-6">
      <div className="container mx-auto max-w-6xl">
        <a
          href={linkUrl || DEFAULT_LINK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full focus:outline-none focus:ring-2 focus:ring-ring rounded-xl sm:rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow bg-card border border-border"
        >
          <img
            src={imageUrl || defaultBanner}
            alt="Promotional banner"
            loading="lazy"
            className="w-full h-auto block"
            style={{ display: "block", width: "100%", height: "auto" }}
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultBanner;
            }}
          />
        </a>
      </div>
    </section>
  );
};

export default PromoBanner;

