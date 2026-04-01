import { useEffect, useState, ChangeEvent } from "react";
import { motion } from "framer-motion";
import { Loader2, Edit, Trash2, GripVertical, Star, Info } from "lucide-react";
import banner1 from "@/assets/banners/banner-gadgetguruz.png";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.jambologos.com";
const DEFAULT_BANNER_LINK = "https://gadgetguruz.com/referrer/bookmyjunk";

const bannerAssets = [{ label: "banner-gadgetguruz.png", src: banner1 }];

interface BannerSettings {
  image_url: string;
  link_url: string;
}

interface HeroSettings {
  badge_text: string;
  headline_1: string;
  headline_2: string;
  description: string;
  cta_text: string;
  cta_url: string;
  stats_text: string;
  feature_1: string;
  feature_2: string;
  feature_3: string;
  bg_image_url: string;
  playstore_url: string;
  appstore_url: string;
  playstore_img: string;
  appstore_img: string;
}

interface GalleryItem {
  id: number;
  image_url: string;
  alt_text?: string;
  caption?: string;
  sort_order?: number;
  is_featured?: number;
  is_active?: number;
}

interface VideoItem {
  id: number;
  title: string;
  youtube_url?: string | null;
  video_url?: string | null;
  thumbnail_url?: string | null;
  description?: string;
  sort_order?: number;
  is_featured?: number;
  is_active?: number;
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  sort_order?: number;
}

interface FooterSettings {
  company_name: string;
  tagline: string;
  address: string;
  phone: string;
  email: string;
  whatsapp: string;
  facebook_url: string;
  instagram_url: string;
  twitter_url: string;
  youtube_url: string;
  linkedin_url: string;
  copyright_text: string;
  copyright_right: string;
  services: string[];
  quick_links: { label: string; url: string }[];
  follow_heading: string;
  contact_heading: string;
  services_heading: string;
  quick_links_heading: string;
}

const DEFAULT_SERVICES = [
  "Doorstep E-waste Collection",
  "Electronic Waste Pickup Service",
  "Corporate IT Asset Disposition",
  "Data Destruction Services",
  "Recycle Old Laptop Service",
  "TV Recycling Pickup Service",
];

const DEFAULT_QUICK_LINKS = [
  { label: "About Us", url: "/#about" },
  { label: "Book Pickup", url: "/#book" },
  { label: "FAQs", url: "/#faq" },
  { label: "Blog", url: "/blog" },
  { label: "Privacy Policy", url: "/privacy-policy" },
];

const emptyFooter: FooterSettings = {
  company_name: "",
  tagline: "",
  address: "",
  phone: "",
  email: "",
  whatsapp: "",
  facebook_url: "",
  instagram_url: "",
  twitter_url: "",
  youtube_url: "",
  linkedin_url: "",
  copyright_text: "",
  copyright_right: "",
  services: DEFAULT_SERVICES,
  quick_links: DEFAULT_QUICK_LINKS,
  follow_heading: "Follow Us",
  contact_heading: "Contact Us",
  services_heading: "Services",
  quick_links_heading: "Quick Links",
};

// ── Stats & About interfaces ──
interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface AboutFeature {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

interface AboutSettings {
  badge: string;
  heading: string;
  description: string;
  features: AboutFeature[];
}

const DEFAULT_STATS: StatItem[] = [
  { value: 10000, suffix: "+", label: "Tons Recycled" },
  { value: 50, suffix: "+", label: "Cities Covered" },
  { value: 500, suffix: "+", label: "Corporate Clients" },
  { value: 95, suffix: "%", label: "Material Recovery" },
];

const DEFAULT_ABOUT: AboutSettings = {
  badge: "About BookMyJunk",
  heading: "India's Leading E-waste Management Solutions Provider",
  description: "BookMyJunk is a certified e-waste recycling company offering free electronic waste pickup service across India. Whether you want to recycle old laptops, dispose of old computers, recycle mobile phones, or need a TV recycling pickup service — we handle it all responsibly and sustainably.",
  features: [
    { id: "1", icon: "Truck", title: "Doorstep E-waste Collection", desc: "We pick up your old electronics right from your doorstep — completely free. Available in Mumbai, Delhi, Bangalore, and 50+ cities." },
    { id: "2", icon: "Shield", title: "Safe Disposal of E-waste", desc: "Your data is securely destroyed. Every device goes through certified data wiping before recycling." },
    { id: "3", icon: "Recycle", title: "Responsible E-waste Recycling", desc: "We follow government-approved processes to ensure zero landfill. 95% material recovery rate." },
    { id: "4", icon: "Leaf", title: "Eco-Friendly E-waste Disposal", desc: "Our recycling process prevents toxic materials from contaminating soil and water. Go green with BookMyJunk." },
    { id: "5", icon: "Award", title: "Certified E-waste Recycling Company", desc: "CPCB authorized, ISO certified. We are the best e-waste recycler trusted by 500+ corporates." },
    { id: "6", icon: "Users", title: "Bulk & Corporate Solutions", desc: "IT asset disposition, compliance certificates, and bulk electronic scrap recycling service for businesses." },
  ],
};

const authHeaders = () => {
  const token = localStorage.getItem("admin_token") || "";
  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
};

const jsonHeaders = () => ({
  ...authHeaders(),
  "Content-Type": "application/json",
});

const HomepageCMS = () => {
  const [activeTab, setActiveTab] = useState<"banner" | "hero" | "stats" | "about" | "footer" | "gallery" | "videos" | "faq">("banner");
  const { toast } = useToast();

  // Banner state
  const [bannerForm, setBannerForm] = useState<BannerSettings>({
    image_url: bannerAssets[0]?.src ?? "",
    link_url: DEFAULT_BANNER_LINK,
  });
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerUploadFilename, setBannerUploadFilename] = useState<string>("");

  // Hero state
  const [heroForm, setHeroForm] = useState<HeroSettings>({
    badge_text: "India's #1 E-waste Recycling App",
    headline_1: "Declutter your home, go greener.",
    headline_2: "Book Free E-waste Collection Now.",
    description: "Download the BookMyJunk app & schedule a free doorstep pickup. We recycle old laptops, phones, TVs & more — certified, eco-friendly, and hassle-free.",
    cta_text: "Book Free Pickup",
    cta_url: "https://wa.me/918976769851?text=Hi%2C%20I%20want%20to%20book%20a%20free%20e-waste%20pickup",
    stats_text: "⭐ 4.8 rating · 50,000+ downloads · Free to use",
    feature_1: "Free Doorstep Pickup",
    feature_2: "Certified & Secure",
    feature_3: "Eco-Friendly Process",
    bg_image_url: "",
    playstore_url: "https://play.google.com/store/apps/details?id=com.bmj.bookmyjunk&pcampaignid=web_share",
    appstore_url: "https://apps.apple.com/in/app/bookmyjunk/id1595834562",
    playstore_img: "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
    appstore_img: "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
  });
  const [heroUploading, setHeroUploading] = useState(false);
  const [heroUploadFilename, setHeroUploadFilename] = useState<string>("");
  const [heroBgFile, setHeroBgFile] = useState<File | null>(null);
  const [heroBgPreview, setHeroBgPreview] = useState<string>("");
  const [heroPlaystoreFile, setHeroPlaystoreFile] = useState<File | null>(null);
  const [heroPlaystoreFilename, setHeroPlaystoreFilename] = useState<string>("");
  const [heroPlaystorePreview, setHeroPlaystorePreview] = useState<string>("");
  const [heroAppstoreFile, setHeroAppstoreFile] = useState<File | null>(null);
  const [heroAppstoreFilename, setHeroAppstoreFilename] = useState<string>("");
  const [heroAppstorePreview, setHeroAppstorePreview] = useState<string>("");

  // Stats state
  const [statsForm, setStatsForm] = useState<StatItem[]>(DEFAULT_STATS);

  // About state
  const [aboutForm, setAboutForm] = useState<AboutSettings>(DEFAULT_ABOUT);

  // Footer state
  const [footerForm, setFooterForm] = useState<FooterSettings>({
    ...emptyFooter,
    phone: "+91 8976769851",
    email: "connectwithus@bookmyjunk.com",
    address: "422, The Summit Business Bay,\nNear WEH Metro Station,\nAndheri (E), Mumbai-400093",
    copyright_text: `© ${new Date().getFullYear()} BookMyJunk.com — Certified E-waste Recycling Company in India`,
    copyright_right: "E-waste disposal services in India | Electronic scrap recycling service",
    services: DEFAULT_SERVICES,
    quick_links: DEFAULT_QUICK_LINKS,
    services_heading: "Services",
    quick_links_heading: "Quick Links",
    follow_heading: "Follow Us",
    contact_heading: "Contact Us",
  });

  // Gallery state
  const [galleryForm, setGalleryForm] = useState<Omit<GalleryItem, "id">>({
    image_url: "",
    alt_text: "",
    caption: "",
    sort_order: 0,
  });
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryUploadFilename, setGalleryUploadFilename] = useState<string>("");
  const [deleteGalleryId, setDeleteGalleryId] = useState<number | null>(null);
  const [editGalleryItem, setEditGalleryItem] = useState<GalleryItem | null>(null);
  const [editGalleryForm, setEditGalleryForm] = useState<Omit<GalleryItem, "id">>({
    image_url: "",
    alt_text: "",
    caption: "",
    sort_order: 0,
    is_featured: 0,
  });
  const [editGallerySaving, setEditGallerySaving] = useState(false);
  const [editGalleryUploading, setEditGalleryUploading] = useState(false);

  // Video state
  const [videoForm, setVideoForm] = useState<Omit<VideoItem, "id">>({
    title: "",
    youtube_url: "",
    video_url: null,
    thumbnail_url: null,
    description: "",
    sort_order: 0,
  });
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadFilename, setVideoUploadFilename] = useState<string>("");
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreviewUrl, setThumbnailPreviewUrl] = useState<string>("");
  const [useYouTubeDefaultThumbnail, setUseYouTubeDefaultThumbnail] = useState<boolean>(true);
  const [deleteVideoId, setDeleteVideoId] = useState<number | null>(null);
  const [editVideoItem, setEditVideoItem] = useState<VideoItem | null>(null);
  const [editVideoForm, setEditVideoForm] = useState<Omit<VideoItem, "id">>({
    title: "",
    youtube_url: "",
    description: "",
    sort_order: 0,
  });
  const [editVideoSaving, setEditVideoSaving] = useState(false);

  // FAQ state
  const [faqForm, setFaqForm] = useState<Omit<FAQItem, "id">>({
    question: "",
    answer: "",
    sort_order: 0,
  });
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [deleteFaqId, setDeleteFaqId] = useState<number | null>(null);
  const [editFaqItem, setEditFaqItem] = useState<FAQItem | null>(null);
  const [editFaqForm, setEditFaqForm] = useState<Omit<FAQItem, "id">>({
    question: "",
    answer: "",
    sort_order: 0,
  });
  const [editFaqSaving, setEditFaqSaving] = useState(false);

  // ===== FUNCTIONS =====

  const reloadGallery = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cms/gallery`, { headers: authHeaders() });
      if (!res.ok) return;
      const data = (await res.json()) as GalleryItem[];
      setGalleryItems(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  };

  const reloadVideos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cms/videos`, { headers: authHeaders() });
      if (!res.ok) return;
      const data = (await res.json()) as VideoItem[];
      setVideos(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  };

  const reloadFaqs = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cms/faq`, { headers: authHeaders() });
      if (!res.ok) return;
      const data = (await res.json()) as FAQItem[];
      setFaqs(Array.isArray(data) ? data : []);
    } catch {
      // ignore
    }
  };

  const saveBanner = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cms/banner`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify(bannerForm),
      });
      if (!res.ok) throw new Error(`Failed to save banner (${res.status})`);
      toast({ title: "Banner saved — it will now display on the homepage" });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to save banner.", variant: "destructive" });
    }
  };

  const handleBannerUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setBannerUploadFilename(file.name);
    setBannerUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_BASE}/api/cms/gallery/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = (await res.json()) as { url?: string };
      if (!data?.url) throw new Error("Upload succeeded but no URL returned.");
      setBannerForm((prev) => ({ ...prev, image_url: data.url as string }));
      toast({ title: "Image uploaded" });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Upload failed.", variant: "destructive" });
    } finally {
      setBannerUploading(false);
      event.target.value = "";
    }
  };

  const handleGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setGalleryUploadFilename(file.name);
    setGalleryUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_BASE}/api/cms/gallery/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = (await res.json()) as { url?: string };
      if (!data?.url) throw new Error("Upload succeeded but no URL returned.");
      setGalleryForm((prev) => ({ ...prev, image_url: data.url as string }));
      toast({ title: "Image ready — fill in details and click Add to save" });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Upload failed.", variant: "destructive" });
    } finally {
      setGalleryUploading(false);
      event.target.value = "";
    }
  };

  const saveGalleryItem = async () => {
    if (!galleryForm.image_url?.trim()) {
      toast({ title: "Please enter or upload an image URL first", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/cms/gallery`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(galleryForm),
      });
      if (!res.ok) throw new Error(`Failed to save gallery item (${res.status})`);
      await reloadGallery();
      setGalleryForm({ image_url: "", alt_text: "", caption: "", sort_order: 0 });
      toast({ title: "Image added to gallery" });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to add image.", variant: "destructive" });
    }
  };

  const handleEditGalleryUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setEditGalleryUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`${API_BASE}/api/cms/gallery/upload`, {
        method: "POST",
        headers: authHeaders(),
        body: formData,
      });
      if (!res.ok) throw new Error(`Upload failed (${res.status})`);
      const data = (await res.json()) as { url?: string };
      if (!data?.url) throw new Error("Upload succeeded but no URL returned.");
      setEditGalleryForm((prev) => ({ ...prev, image_url: data.url as string }));
      toast({ title: "Image uploaded — click Save to apply" });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Upload failed.", variant: "destructive" });
    } finally {
      setEditGalleryUploading(false);
      event.target.value = "";
    }
  };

  const saveEditGalleryItem = async () => {
    if (!editGalleryItem) return;
    setEditGallerySaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/cms/gallery/${editGalleryItem.id}`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify({
          image_url: editGalleryForm.image_url,
          alt_text: editGalleryForm.alt_text,
          caption: editGalleryForm.caption,
          sort_order: editGalleryForm.sort_order,
          is_featured: editGalleryForm.is_featured,
        }),
      });
      if (!res.ok) throw new Error(`Failed to update gallery item (${res.status})`);
      await reloadGallery();
      setEditGalleryItem(null);
      toast({ title: "Gallery item updated" });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to update gallery item.", variant: "destructive" });
    } finally {
      setEditGallerySaving(false);
    }
  };

  const deleteGalleryItemById = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/cms/gallery/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Failed to delete gallery item (${res.status})`);
      await reloadGallery();
      toast({ title: "Gallery item deleted" });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to delete gallery item.", variant: "destructive" });
    }
  };

  const normalizeYouTubeUrl = (raw: string) => {
    try {
      const trimmed = raw.trim();
      if (!trimmed) return "";
      let url: URL;
      if (!/^https?:\/\//i.test(trimmed)) {
        url = new URL(`https://${trimmed}`);
      } else {
        url = new URL(trimmed);
      }
      let id = "";
      if (url.hostname.includes("youtu.be")) {
        id = url.pathname.replace("/", "");
      } else if (url.searchParams.get("v")) {
        id = url.searchParams.get("v") ?? "";
      } else if (url.pathname.includes("/embed/")) {
        id = url.pathname.split("/embed/")[1] ?? "";
      }
      if (!id) return "";
      return `https://www.youtube.com/embed/${id}`;
    } catch {
      return "";
    }
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

  const handleVideoUrlChange = (value: string) => {
    const embed = normalizeYouTubeUrl(value);
    setVideoForm((prev) => ({
      ...prev,
      youtube_url: embed || value,
      video_url: null,
    }));
    setVideoUploadFilename("");
    // If user is using YouTube URL, default thumbnail makes sense.
    setUseYouTubeDefaultThumbnail(true);
  };

  const uploadThumbnailBlob = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("thumbnail", blob, "thumbnail.jpg");
    const res = await fetch(`${API_BASE}/api/cms/videos/thumbnail`, {
      method: "POST",
      headers: authHeaders(),
      body: formData,
    });
    if (!res.ok) throw new Error(`Thumbnail upload failed (${res.status})`);
    const data = (await res.json()) as { url?: string };
    if (!data?.url) throw new Error("Thumbnail upload succeeded but no URL returned.");
    return data.url as string;
  };

  const generateThumbnailFromVideoFile = async (file: File) => {
    const objectUrl = URL.createObjectURL(file);
    try {
      const video = document.createElement("video");
      video.muted = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.src = objectUrl;

      await new Promise<void>((resolve, reject) => {
        video.onloadedmetadata = () => resolve();
        video.onerror = () => reject(new Error("Could not read video metadata"));
      });

      const targetTime = Math.min(1, Math.max(0, (video.duration || 1) / 2));
      await new Promise<void>((resolve, reject) => {
        const onSeeked = () => {
          video.removeEventListener("seeked", onSeeked);
          resolve();
        };
        video.addEventListener("seeked", onSeeked);
        try {
          video.currentTime = targetTime;
        } catch {
          reject(new Error("Could not seek video"));
        }
      });

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 800;
      canvas.height = video.videoHeight || 450;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Could not create canvas context");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Failed to generate thumbnail"))), "image/jpeg", 0.9);
      });
      return blob;
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  };

  const resetVideoAddForm = () => {
    setVideoForm({ title: "", youtube_url: "", video_url: null, thumbnail_url: null, is_featured: 0, description: "", sort_order: 0 });
    setVideoUploadFilename("");
    setThumbnailFile(null);
    if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
    setThumbnailPreviewUrl("");
    setUseYouTubeDefaultThumbnail(true);
  };

  const saveVideo = async () => {
    const title = videoForm.title?.trim() || "";
    const youtubeUrl = (videoForm.youtube_url || "").trim();
    const uploadedVideoUrl = (videoForm.video_url || "").trim();
    if (!title || (!youtubeUrl && !uploadedVideoUrl)) {
      toast({ title: "Title is required, and you must provide a YouTube URL or upload a video file.", variant: "destructive" });
      return;
    }

    setVideoUploading(true);
    try {
      // Resolve thumbnail_url
      let resolvedThumbnailUrl: string | null = null;
      if ((videoForm.thumbnail_url || "").trim()) {
        resolvedThumbnailUrl = videoForm.thumbnail_url as string;
      } else if (youtubeUrl && useYouTubeDefaultThumbnail) {
        const id = extractYouTubeId(youtubeUrl) || extractYouTubeId(normalizeYouTubeUrl(youtubeUrl));
        resolvedThumbnailUrl = id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
      } else {
        resolvedThumbnailUrl = null;
      }

      const body =
        youtubeUrl
          ? {
              title,
              youtube_url: youtubeUrl,
              thumbnail_url: resolvedThumbnailUrl,
              is_featured: videoForm.is_featured ? 1 : 0,
              description: videoForm.description,
              sort_order: videoForm.sort_order,
            }
          : {
              title,
              video_url: uploadedVideoUrl,
              thumbnail_url: resolvedThumbnailUrl,
              is_featured: videoForm.is_featured ? 1 : 0,
              description: videoForm.description,
              sort_order: videoForm.sort_order,
            };

      const addRes = await fetch(`${API_BASE}/api/cms/videos`, { method: "POST", headers: jsonHeaders(), body: JSON.stringify(body) });
      if (!addRes.ok) throw new Error(`Failed to save video (${addRes.status})`);
      await reloadVideos();
      resetVideoAddForm();
      toast({ title: "Video saved." });
    } catch (e) {
      toast({
        title: "Video save failed",
        description: e instanceof Error ? e.message : "Failed to save video.",
        variant: "destructive",
      });
    } finally {
      setVideoUploading(false);
    }
  };

  const saveEditVideo = async () => {
    if (!editVideoItem) return;
    setEditVideoSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/cms/videos/${editVideoItem.id}`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify(editVideoForm),
      });
      if (!res.ok) throw new Error(`Failed to update video (${res.status})`);
      await reloadVideos();
      setEditVideoItem(null);
      toast({ title: "Video updated" });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to update video.", variant: "destructive" });
    } finally {
      setEditVideoSaving(false);
    }
  };

  const deleteVideoById = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/cms/videos/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Failed to delete video (${res.status})`);
      await reloadVideos();
      toast({ title: "Video deleted" });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to delete video.", variant: "destructive" });
    }
  };

  const saveFaq = async () => {
    if (!faqForm.question?.trim() || !faqForm.answer?.trim()) {
      toast({ title: "Question and answer are required.", variant: "destructive" });
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/cms/faq`, {
        method: "POST",
        headers: jsonHeaders(),
        body: JSON.stringify(faqForm),
      });
      if (!res.ok) throw new Error(`Failed to save FAQ (${res.status})`);
      await reloadFaqs();
      setFaqForm({ question: "", answer: "", sort_order: 0 });
      toast({ title: "FAQ saved successfully." });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to save FAQ.", variant: "destructive" });
    }
  };

  const saveEditFaq = async () => {
    if (!editFaqItem) return;
    setEditFaqSaving(true);
    try {
      const res = await fetch(`${API_BASE}/api/cms/faq/${editFaqItem.id}`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify(editFaqForm),
      });
      if (!res.ok) throw new Error(`Failed to update FAQ (${res.status})`);
      await reloadFaqs();
      setEditFaqItem(null);
      toast({ title: "FAQ updated" });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to update FAQ.", variant: "destructive" });
    } finally {
      setEditFaqSaving(false);
    }
  };

  const deleteFaqById = async (id: number) => {
    try {
      const res = await fetch(`${API_BASE}/api/cms/faq/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error(`Failed to delete FAQ (${res.status})`);
      await reloadFaqs();
      toast({ title: "FAQ deleted" });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to delete FAQ.", variant: "destructive" });
    }
  };

  const updateFaqSortOrder = async (id: number, newSortOrder: number) => {
    const faq = faqs.find((f) => f.id === id);
    if (!faq) return;
    try {
      const res = await fetch(`${API_BASE}/api/cms/faq/${id}`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify({ question: faq.question, answer: faq.answer, sort_order: newSortOrder }),
      });
      if (!res.ok) throw new Error(`Failed to update sort order (${res.status})`);
      await reloadFaqs();
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to update sort order.", variant: "destructive" });
    }
  };

  // ===== INITIAL LOAD =====
  useEffect(() => {
    const loadAll = async () => {
      // Banner
      try {
        const bannerRes = await fetch(`${API_BASE}/api/cms/banner`, { headers: authHeaders() });
        if (bannerRes.ok) {
          const data = (await bannerRes.json()) as Partial<BannerSettings> | null;
          if (data) {
            setBannerForm({
              image_url: (data.image_url || "").trim() || bannerAssets[0]?.src || "",
              link_url: (data.link_url || "").trim() || DEFAULT_BANNER_LINK,
            });
          }
        }
      } catch {
        // ignore
      }

      // Stats
      try {
        const sRes = await fetch(`${API_BASE}/api/cms/stats`, { headers: authHeaders() });
        if (sRes.ok) {
          const data = (await sRes.json()) as StatItem[] | null;
          if (Array.isArray(data) && data.length > 0) setStatsForm(data);
        }
      } catch { /* ignore */ }

      // About
      try {
        const aRes = await fetch(`${API_BASE}/api/cms/about`, { headers: authHeaders() });
        if (aRes.ok) {
          const data = (await aRes.json()) as Partial<AboutSettings> | null;
          if (data && typeof data === "object") {
            setAboutForm({
              badge: (data.badge || "").trim() || DEFAULT_ABOUT.badge,
              heading: (data.heading || "").trim() || DEFAULT_ABOUT.heading,
              description: (data.description || "").trim() || DEFAULT_ABOUT.description,
              features: Array.isArray(data.features) && data.features.length > 0 ? data.features : DEFAULT_ABOUT.features,
            });
          }
        }
      } catch { /* ignore */ }

      // Footer
      try {
        const fRes = await fetch(`${API_BASE}/api/cms/footer`, { headers: authHeaders() });
        if (fRes.ok) {
          const data = (await fRes.json()) as Partial<FooterSettings> | null;
          if (data && typeof data === "object") {
            setFooterForm({
              company_name: (data.company_name || "").trim() || "",
              tagline: (data.tagline || "").trim() || "",
              address: (data.address || "").trim() || "422, The Summit Business Bay,\nNear WEH Metro Station,\nAndheri (E), Mumbai-400093",
              phone: (data.phone || "").trim() || "+91 8976769851",
              email: (data.email || "").trim() || "connectwithus@bookmyjunk.com",
              whatsapp: (data.whatsapp || "").trim() || "",
              facebook_url: (data.facebook_url || "").trim() || "",
              instagram_url: (data.instagram_url || "").trim() || "",
              twitter_url: (data.twitter_url || "").trim() || "",
              youtube_url: (data.youtube_url || "").trim() || "",
              linkedin_url: (data.linkedin_url || "").trim() || "",
              copyright_text: (data.copyright_text || "").trim() || `© ${new Date().getFullYear()} BookMyJunk.com — Certified E-waste Recycling Company in India`,
              copyright_right: (data.copyright_right || "").trim() || "E-waste disposal services in India | Electronic scrap recycling service",
              services: Array.isArray(data.services) && data.services.length > 0 ? data.services : DEFAULT_SERVICES,
              quick_links: Array.isArray(data.quick_links) && data.quick_links.length > 0 ? data.quick_links : DEFAULT_QUICK_LINKS,
              services_heading: (data.services_heading || "").trim() || "Services",
              quick_links_heading: (data.quick_links_heading || "").trim() || "Quick Links",
              follow_heading: (data.follow_heading || "").trim() || "Follow Us",
              contact_heading: (data.contact_heading || "").trim() || "Contact Us",
            });
          }
        }
      } catch { /* ignore */ }

      // Hero
      try {
        const heroRes = await fetch(`${API_BASE}/api/cms/hero`, { headers: authHeaders() });
        if (heroRes.ok) {
          const data = (await heroRes.json()) as Partial<HeroSettings> | null;
          if (data && Object.keys(data).length > 0) {
            setHeroForm({
              badge_text: (data.badge_text || "").trim() || "India's #1 E-waste Recycling App",
              headline_1: (data.headline_1 || "").trim() || "Declutter your home, go greener.",
              headline_2: (data.headline_2 || "").trim() || "Book Free E-waste Collection Now.",
              description: (data.description || "").trim() || "Download the BookMyJunk app & schedule a free doorstep pickup.",
              cta_text: (data.cta_text || "").trim() || "Book Free Pickup",
              cta_url: (data.cta_url || "").trim() || "https://wa.me/918976769851",
              stats_text: (data.stats_text || "").trim() || "⭐ 4.8 rating · 50,000+ downloads · Free to use",
              feature_1: (data.feature_1 || "").trim() || "Free Doorstep Pickup",
              feature_2: (data.feature_2 || "").trim() || "Certified & Secure",
              feature_3: (data.feature_3 || "").trim() || "Eco-Friendly Process",
              bg_image_url: (data.bg_image_url || "").trim() || "",
              playstore_url: (data.playstore_url || "").trim() || "https://play.google.com/store/apps/details?id=com.bmj.bookmyjunk",
              appstore_url: (data.appstore_url || "").trim() || "https://apps.apple.com/in/app/bookmyjunk/id1595834562",
              playstore_img: (data.playstore_img || "").trim() || "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg",
              appstore_img: (data.appstore_img || "").trim() || "https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg",
            });
          }
        }
      } catch {
        // ignore
      }

      // Gallery + seed
      try {
        const res = await fetch(`${API_BASE}/api/cms/gallery`, { headers: authHeaders() });
        if (res.ok) {
          const data = (await res.json()) as GalleryItem[];
          const list = Array.isArray(data) ? data : [];
          setGalleryItems(list);
          if (!list.length) {
            const seeds: Array<Omit<GalleryItem, "id">> = [
              { image_url: "/carousel/image1.webp", alt_text: "Best E-waste Recycler", caption: "Community E-waste Collection Team", sort_order: 1 },
              { image_url: "/carousel/image2.webp", alt_text: "E-waste Management", caption: "Certified E-waste Collection", sort_order: 2 },
              { image_url: "/carousel/image3.webp", alt_text: "Electronic waste collection drive", caption: "Collection Drive", sort_order: 3 },
              { image_url: "/carousel/image4.webp", alt_text: "E-waste collection van", caption: "Our Fleet Ready for Pickup", sort_order: 4 },
              { image_url: "/carousel/image5.webp", alt_text: "E-waste Awareness Drive in schools", caption: "Awareness Drive in schools", sort_order: 5 },
              { image_url: "/carousel/image6.webp", alt_text: "Book My Junk e-waste promotion", caption: "Book my junk promotion", sort_order: 6 },
              { image_url: "/carousel/image7.webp", alt_text: "Free e-waste pickup service", caption: "Free Collection of E-waste at Doorstep", sort_order: 7 },
              { image_url: "/carousel/image8.webp", alt_text: "Book my junk team at promotion", caption: "Book My Junk Team at a promotion", sort_order: 8 },
              { image_url: "/carousel/image9.webp", alt_text: "Electronic waste pick up services", caption: "Our Fleet of Vans in Action", sort_order: 9 },
            ];
            await Promise.all(
              seeds.map((s) =>
                fetch(`${API_BASE}/api/cms/gallery`, {
                  method: "POST",
                  headers: jsonHeaders(),
                  body: JSON.stringify(s),
                }),
              ),
            );
            await reloadGallery();
          }
        }
      } catch {
        // ignore
      }

      // Videos + seed
      try {
        const res = await fetch(`${API_BASE}/api/cms/videos`, { headers: authHeaders() });
        if (res.ok) {
          const data = (await res.json()) as VideoItem[];
          const list = Array.isArray(data) ? data : [];
          setVideos(list);
          if (!list.length) {
            const seeds: Array<Omit<VideoItem, "id">> = [
              { title: "How BookMyJunk Recycles E-waste Responsibly", youtube_url: "https://www.youtube.com/embed/Q5sd300ct3E", thumbnail_url: "https://img.youtube.com/vi/Q5sd300ct3E/hqdefault.jpg", description: "See our eco-friendly e-waste disposal process from doorstep collection to certified recycling.", sort_order: 1 },
              { title: "BookMyJunk — Featured on National Media", youtube_url: "https://www.youtube.com/embed/QnVrUpl1QjE", thumbnail_url: "https://img.youtube.com/vi/QnVrUpl1QjE/hqdefault.jpg", description: "Our e-waste management solutions recognized as best e-waste recycler in India.", sort_order: 2 },
            ];
            await Promise.all(
              seeds.map((s) =>
                fetch(`${API_BASE}/api/cms/videos`, {
                  method: "POST",
                  headers: jsonHeaders(),
                  body: JSON.stringify(s),
                }),
              ),
            );
            await reloadVideos();
          }
        }
      } catch {
        // ignore
      }

      // FAQ + seed
      try {
        const res = await fetch(`${API_BASE}/api/cms/faq`, { headers: authHeaders() });
        if (res.ok) {
          const data = (await res.json()) as FAQItem[];
          const list = Array.isArray(data) ? data : [];
          setFaqs(list);
          if (!list.length) {
            const seeds: Array<Omit<FAQItem, "id">> = [
              { question: "What is e-waste and why should I recycle it?", answer: "E-waste includes any discarded electronic devices — old laptops, mobile phones, TVs, printers, cables, and batteries. Improper disposal releases toxic chemicals like lead and mercury into the environment. Responsible e-waste recycling through BookMyJunk ensures safe disposal and material recovery.", sort_order: 1 },
              { question: "How does the free doorstep e-waste collection work?", answer: "Simply fill out the booking form on our website with your details and the e-waste items you want to dispose. Our team will schedule a pickup at your doorstep — completely free of charge. We operate in Mumbai, Delhi, Bangalore, Hyderabad, Pune, and 50+ cities across India.", sort_order: 2 },
              { question: "What electronics can I recycle with BookMyJunk?", answer: "We accept almost all electronic waste: old computers, laptops, mobile phones, tablets, TVs, monitors, printers, scanners, keyboards, cables, chargers, batteries, servers, networking equipment, air conditioners, refrigerators, and washing machines.", sort_order: 3 },
              { question: "Is BookMyJunk a certified e-waste recycling company?", answer: "Yes! We are CPCB (Central Pollution Control Board) authorized and ISO certified. All our recycling processes comply with the E-waste Management Rules, 2016. We provide proper disposal certificates for corporate clients.", sort_order: 4 },
              { question: "How do you ensure data security during e-waste disposal?", answer: "Data security is our top priority. All storage devices undergo certified data destruction — including degaussing, shredding, and secure wiping — before any material is recycled. We provide data destruction certificates upon request.", sort_order: 5 },
              { question: "Do you offer bulk e-waste pickup for businesses?", answer: "Absolutely! We offer comprehensive IT asset disposition (ITAD) services for corporates. This includes bulk electronic scrap recycling, compliance certificates, asset tracking, and secure data destruction. Over 500 companies trust us.", sort_order: 6 },
              { question: "Where are e-waste collection centres near me?", answer: "BookMyJunk has collection points and partner facilities across India. But you don't need to visit one — our doorstep collection service brings the convenience to you. Just book a pickup and we'll come to your location.", sort_order: 7 },
              { question: "Can I sell old electronics for recycling?", answer: "Yes, depending on the condition and type of electronics, we offer buyback for certain items. Contact us through the booking form and our team will assess the value of your old electronics.", sort_order: 8 },
            ];
            await Promise.all(
              seeds.map((s) =>
                fetch(`${API_BASE}/api/cms/faq`, {
                  method: "POST",
                  headers: jsonHeaders(),
                  body: JSON.stringify(s),
                }),
              ),
            );
            await reloadFaqs();
          }
        }
      } catch {
        // ignore
      }
    };

    void loadAll();
  }, []);

  // ===== RENDER =====

  // ===== STATS SAVE =====
  const saveStats = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cms/stats`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify(statsForm),
      });
      if (!res.ok) throw new Error(`Failed to save stats (${res.status})`);
      toast({ title: "Stats saved — changes will appear on the homepage." });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to save stats.", variant: "destructive" });
    }
  };

  // ===== ABOUT SAVE =====
  const saveAbout = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cms/about`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify(aboutForm),
      });
      if (!res.ok) throw new Error(`Failed to save about (${res.status})`);
      toast({ title: "About section saved — changes will appear on the homepage." });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to save about.", variant: "destructive" });
    }
  };

  // ===== FOOTER SAVE =====
  const saveFooter = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cms/footer`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify(footerForm),
      });
      if (!res.ok) throw new Error(`Failed to save footer (${res.status})`);
      toast({ title: "Footer saved — changes will appear on the homepage." });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to save footer.", variant: "destructive" });
    }
  };

  // ===== HERO SAVE =====
  const uploadHeroImage = async (file: File): Promise<string> => {
    const fd = new FormData();
    fd.append("image", file);
    const res = await fetch(`${API_BASE}/api/cms/gallery/upload`, {
      method: "POST",
      headers: authHeaders(),
      body: fd,
    });
    if (!res.ok) throw new Error("Image upload failed");
    const data = await res.json() as { url: string };
    return data.url;
  };

  const saveHero = async () => {
    setHeroUploading(true);
    try {
      let finalBgUrl = heroForm.bg_image_url;
      let finalPlaystoreImg = heroForm.playstore_img;
      let finalAppstoreImg = heroForm.appstore_img;

      if (heroBgFile) {
        finalBgUrl = await uploadHeroImage(heroBgFile);
        setHeroForm((p) => ({ ...p, bg_image_url: finalBgUrl }));
        setHeroBgFile(null);
        setHeroBgPreview("");
      }
      if (heroPlaystoreFile) {
        finalPlaystoreImg = await uploadHeroImage(heroPlaystoreFile);
        setHeroForm((p) => ({ ...p, playstore_img: finalPlaystoreImg }));
        setHeroPlaystoreFile(null);
        setHeroPlaystorePreview("");
      }
      if (heroAppstoreFile) {
        finalAppstoreImg = await uploadHeroImage(heroAppstoreFile);
        setHeroForm((p) => ({ ...p, appstore_img: finalAppstoreImg }));
        setHeroAppstoreFile(null);
        setHeroAppstorePreview("");
      }

      const res = await fetch(`${API_BASE}/api/cms/hero`, {
        method: "PUT",
        headers: jsonHeaders(),
        body: JSON.stringify({
          ...heroForm,
          bg_image_url: finalBgUrl,
          playstore_img: finalPlaystoreImg,
          appstore_img: finalAppstoreImg,
        }),
      });
      if (!res.ok) throw new Error(`Failed to save hero (${res.status})`);
      toast({ title: "Hero section saved — changes will appear on the homepage." });
    } catch (e) {
      toast({ title: e instanceof Error ? e.message : "Failed to save hero.", variant: "destructive" });
    } finally {
      setHeroUploading(false);
    }
  };

  const handleHeroBgFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setHeroUploadFilename(file.name);
    setHeroBgFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setHeroBgPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleHeroPlaystoreFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setHeroPlaystoreFilename(file.name);
    setHeroPlaystoreFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setHeroPlaystorePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleHeroAppstoreFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setHeroAppstoreFilename(file.name);
    setHeroAppstoreFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setHeroAppstorePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const renderHeroTab = () => {
    const previewSrc = heroBgPreview || heroForm.bg_image_url;
    return (
      <div className="bg-card border border-border rounded-xl p-6 space-y-5">
        <p className="text-sm text-muted-foreground">Edit all text and content in the Hero section. Changes are applied when you click <strong>Save Hero Section</strong>.</p>

        {/* Badge */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Badge Text</label>
          <input type="text" maxLength={33} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.badge_text} onChange={(e) => setHeroForm((p) => ({ ...p, badge_text: e.target.value }))} placeholder="India's #1 E-waste Recycling App" />
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
            <span><Info className="inline h-3.5 w-3.5 text-blue-500 mr-1 mb-0.5" />Small pill badge shown above the headline · Max 33 characters</span>
            <span className={heroForm.badge_text.length > 30 ? "text-amber-500 font-medium" : "text-muted-foreground"}>{heroForm.badge_text.length}/33</span>
          </p>
        </div>

        {/* Headlines */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Headline Line 1</label>
          <input type="text" maxLength={33} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.headline_1} onChange={(e) => setHeroForm((p) => ({ ...p, headline_1: e.target.value }))} placeholder="Declutter your home, go greener." />
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
            <span><Info className="inline h-3.5 w-3.5 text-blue-500 mr-1 mb-0.5" />Max 33 characters to fit on one line</span>
            <span className={heroForm.headline_1.length > 30 ? "text-amber-500 font-medium" : "text-muted-foreground"}>{heroForm.headline_1.length}/33</span>
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Headline Line 2</label>
          <input type="text" maxLength={34} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.headline_2} onChange={(e) => setHeroForm((p) => ({ ...p, headline_2: e.target.value }))} placeholder="Book Free E-waste Collection Now." />
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
            <span><Info className="inline h-3.5 w-3.5 text-blue-500 mr-1 mb-0.5" />Appears in accent colour · Max 34 characters to fit on one line</span>
            <span className={heroForm.headline_2.length > 31 ? "text-amber-500 font-medium" : "text-muted-foreground"}>{heroForm.headline_2.length}/34</span>
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" rows={3} value={heroForm.description} onChange={(e) => setHeroForm((p) => ({ ...p, description: e.target.value }))} placeholder="Download the BookMyJunk app & schedule a free doorstep pickup..." />
        </div>

        {/* CTA */}
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">CTA Button Text</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.cta_text} onChange={(e) => setHeroForm((p) => ({ ...p, cta_text: e.target.value }))} placeholder="Book Free Pickup" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">CTA Button URL</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.cta_url} onChange={(e) => setHeroForm((p) => ({ ...p, cta_url: e.target.value }))} placeholder="https://wa.me/918976769851" />
          </div>
        </div>

        {/* Stats */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Stats Text</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.stats_text} onChange={(e) => setHeroForm((p) => ({ ...p, stats_text: e.target.value }))} placeholder="⭐ 4.8 rating · 50,000+ downloads · Free to use" />
          <p className="text-xs text-muted-foreground mt-1"><Info className="inline h-3.5 w-3.5 text-blue-500 mr-1 mb-0.5" />Small text shown below the app store badges</p>
        </div>

        {/* App Store Links */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">App Store Links & Badge Images</label>

          {/* Google Play */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Google Play Store</p>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Store URL</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.playstore_url} onChange={(e) => setHeroForm((p) => ({ ...p, playstore_url: e.target.value }))} placeholder="https://play.google.com/store/apps/..." />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Badge Image URL</label>
                <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.playstore_img} onChange={(e) => setHeroForm((p) => ({ ...p, playstore_img: e.target.value }))} placeholder="Paste image URL or upload below" />
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <input type="file" accept="image/*,.svg" onChange={handleHeroPlaystoreFileSelect} className="text-sm text-muted-foreground" />
                  {heroPlaystoreFilename && <span className="text-xs text-muted-foreground">{heroPlaystoreFilename}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  <Info className="inline h-3.5 w-3.5 text-blue-500 mr-1 mb-0.5" />Recommended: 564 × 168 px. SVG or PNG. Max 500KB.
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Preview</label>
                <div className="border border-border rounded-lg bg-muted/40 p-2 flex items-center justify-center h-16">
                  {(heroPlaystorePreview || heroForm.playstore_img) ? (
                    <img src={heroPlaystorePreview || heroForm.playstore_img} alt="Play Store badge" className="h-10 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image</span>
                  )}
                </div>
                {heroPlaystoreFile && (
                  <p className="text-xs text-amber-600 mt-1"><Info className="inline h-3 w-3 mr-1 mb-0.5" />Will upload on Save</p>
                )}
              </div>
            </div>
          </div>

          {/* Apple App Store */}
          <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
            <p className="text-xs font-semibold text-foreground uppercase tracking-wide">Apple App Store</p>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Store URL</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.appstore_url} onChange={(e) => setHeroForm((p) => ({ ...p, appstore_url: e.target.value }))} placeholder="https://apps.apple.com/in/app/..." />
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Badge Image URL</label>
                <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.appstore_img} onChange={(e) => setHeroForm((p) => ({ ...p, appstore_img: e.target.value }))} placeholder="Paste image URL or upload below" />
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <input type="file" accept="image/*,.svg" onChange={handleHeroAppstoreFileSelect} className="text-sm text-muted-foreground" />
                  {heroAppstoreFilename && <span className="text-xs text-muted-foreground">{heroAppstoreFilename}</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  <Info className="inline h-3.5 w-3.5 text-blue-500 mr-1 mb-0.5" />Recommended: 564 × 168 px. SVG or PNG. Max 500KB.
                </p>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Preview</label>
                <div className="border border-border rounded-lg bg-muted/40 p-2 flex items-center justify-center h-16">
                  {(heroAppstorePreview || heroForm.appstore_img) ? (
                    <img src={heroAppstorePreview || heroForm.appstore_img} alt="App Store badge" className="h-10 w-auto object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  ) : (
                    <span className="text-xs text-muted-foreground">No image</span>
                  )}
                </div>
                {heroAppstoreFile && (
                  <p className="text-xs text-amber-600 mt-1"><Info className="inline h-3 w-3 mr-1 mb-0.5" />Will upload on Save</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature badges */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Feature Badges (3 cards at bottom of hero)</label>
          <div className="grid sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Badge 1</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.feature_1} onChange={(e) => setHeroForm((p) => ({ ...p, feature_1: e.target.value }))} placeholder="Free Doorstep Pickup" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Badge 2</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.feature_2} onChange={(e) => setHeroForm((p) => ({ ...p, feature_2: e.target.value }))} placeholder="Certified & Secure" />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Badge 3</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={heroForm.feature_3} onChange={(e) => setHeroForm((p) => ({ ...p, feature_3: e.target.value }))} placeholder="Eco-Friendly Process" />
            </div>
          </div>
        </div>

        {/* Background image */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">Background Image</label>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Image URL</label>
              <input
                type="text"
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm text-muted-foreground"
                value={heroForm.bg_image_url}
                placeholder="No URL set — using default hero-bg.jpg"
              />
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-sm text-muted-foreground mb-2">Or upload a new background image</p>
              <div className="flex flex-wrap items-center gap-3">
                <input type="file" accept="image/*" onChange={handleHeroBgFileSelect} className="text-sm text-muted-foreground" />
                {heroUploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {heroUploadFilename && <span className="text-xs text-muted-foreground">{heroUploadFilename}</span>}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                <Info className="inline h-3.5 w-3.5 text-blue-500 mr-1 mb-0.5" />Recommended: 1920 × 1080 px (16:9 ratio). Max file size: 5MB. Formats: JPG, WebP.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">Preview</p>
            <div className="border border-border rounded-xl overflow-hidden bg-muted/40">
              {previewSrc ? (
                <img
                  src={previewSrc}
                  alt="Hero background preview"
                  className="w-full h-auto object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              ) : (
                <div className="flex items-center justify-center h-36 text-sm text-muted-foreground">
                  Default hero-bg.jpg will be used
                </div>
              )}
            </div>
            {heroBgFile && (
              <p className="text-xs text-amber-600">
                <Info className="inline h-3.5 w-3.5 mr-1 mb-0.5" />New image selected — will upload when you click Save
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-4">
          <Button onClick={saveHero} disabled={heroUploading}>
            {heroUploading ? <><Loader2 className="h-4 w-4 animate-spin mr-2" />Uploading...</> : "Save Hero Section"}
          </Button>
        </div>
      </div>
    );
  };

  // ===== RENDER STATS TAB =====
  const renderStatsTab = () => (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <p className="text-sm text-muted-foreground">Edit the 4 animated stat counters shown in the green stats strip on the homepage.</p>
      {statsForm.map((stat, idx) => (
        <div key={idx} className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-xs font-bold">{idx + 1}</span>
            </div>
            <span className="text-xs font-semibold text-foreground uppercase tracking-wide">Stat {idx + 1}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Value</label>
              <input type="number" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={stat.value}
                onChange={(e) => { const s = [...statsForm]; s[idx] = { ...s[idx], value: Number(e.target.value) }; setStatsForm(s); }} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Suffix</label>
              <input type="text" maxLength={5} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={stat.suffix}
                onChange={(e) => { const s = [...statsForm]; s[idx] = { ...s[idx], suffix: e.target.value }; setStatsForm(s); }} placeholder="+ or %" />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Label</label>
              <input type="text" maxLength={30} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={stat.label}
                onChange={(e) => { const s = [...statsForm]; s[idx] = { ...s[idx], label: e.target.value }; setStatsForm(s); }} placeholder="e.g. Cities Covered" />
            </div>
          </div>
        </div>
      ))}
      <div className="flex justify-end border-t border-border pt-4">
        <Button onClick={saveStats}>Save Stats</Button>
      </div>
    </div>
  );

  // ===== RENDER ABOUT TAB =====
  const ICON_OPTIONS = ["Truck", "Shield", "Recycle", "Leaf", "Award", "Users"];
  const renderAboutTab = () => (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      <p className="text-sm text-muted-foreground">Edit the About Us section header and feature cards. Pre-filled with current live values.</p>

      <div className="space-y-4">
        <p className="text-xs font-bold text-foreground uppercase tracking-wider">Section Header</p>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Badge Text</label>
          <input type="text" maxLength={30} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={aboutForm.badge}
            onChange={(e) => setAboutForm((p) => ({ ...p, badge: e.target.value }))} placeholder="About BookMyJunk" />
          <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
            <span><Info className="inline h-3.5 w-3.5 text-blue-500 mr-1 mb-0.5" />Small label shown above the heading · Max 30 chars</span>
            <span className={aboutForm.badge.length > 27 ? "text-amber-500 font-medium" : "text-muted-foreground"}>{aboutForm.badge.length}/30</span>
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Heading</label>
          <input type="text" maxLength={80} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={aboutForm.heading}
            onChange={(e) => setAboutForm((p) => ({ ...p, heading: e.target.value }))} />
          <p className="text-xs text-muted-foreground mt-1 flex justify-end">
            <span className={aboutForm.heading.length > 75 ? "text-amber-500 font-medium" : ""}>{aboutForm.heading.length}/80</span>
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
          <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" value={aboutForm.description}
            onChange={(e) => setAboutForm((p) => ({ ...p, description: e.target.value }))} />
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-3">
        <p className="text-xs font-bold text-foreground uppercase tracking-wider">Feature Cards</p>
        {aboutForm.features.map((feat, idx) => (
          <div key={feat.id} className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <span className="text-primary-foreground text-xs font-bold">{idx + 1}</span>
                </div>
                <span className="text-xs font-semibold text-foreground">{feat.title || `Card ${idx + 1}`}</span>
              </div>
              <button type="button" onClick={() => setAboutForm((p) => ({ ...p, features: p.features.filter((_, i) => i !== idx) }))}
                className="text-xs text-destructive border border-destructive/30 bg-destructive/5 px-2 py-1 rounded-md hover:bg-destructive/10 transition">Delete</button>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Icon</label>
              <select className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={feat.icon}
                onChange={(e) => { const f = [...aboutForm.features]; f[idx] = { ...f[idx], icon: e.target.value }; setAboutForm((p) => ({ ...p, features: f })); }}>
                {ICON_OPTIONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Title</label>
              <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={feat.title}
                onChange={(e) => { const f = [...aboutForm.features]; f[idx] = { ...f[idx], title: e.target.value }; setAboutForm((p) => ({ ...p, features: f })); }} />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Description</label>
              <textarea rows={2} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" value={feat.desc}
                onChange={(e) => { const f = [...aboutForm.features]; f[idx] = { ...f[idx], desc: e.target.value }; setAboutForm((p) => ({ ...p, features: f })); }} />
            </div>
          </div>
        ))}
        <button type="button"
          onClick={() => setAboutForm((p) => ({ ...p, features: [...p.features, { id: Date.now().toString(), icon: "Truck", title: "", desc: "" }] }))}
          className="flex items-center gap-2 text-sm text-primary border border-primary/30 bg-primary/5 px-4 py-2 rounded-lg hover:bg-primary/10 transition">
          + Add Feature Card
        </button>
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button onClick={saveAbout}>Save About Section</Button>
      </div>
    </div>
  );

  // ===== RENDER FOOTER TAB =====
  const renderFooterTab = () => (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <p className="text-sm text-muted-foreground">Edit all footer columns. Pre-filled with current live values. Changes apply on <strong>Save Footer</strong>.</p>

      {/* Services Column */}
      <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
        <p className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-primary flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </span>
          Services Column
        </p>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Column Heading</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={footerForm.services_heading}
            onChange={(e) => setFooterForm((p) => ({ ...p, services_heading: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <label className="block text-xs text-muted-foreground">Items</label>
          {footerForm.services.map((svc, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input type="text" className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={svc}
                onChange={(e) => { const s = [...footerForm.services]; s[idx] = e.target.value; setFooterForm((p) => ({ ...p, services: s })); }} />
              <button type="button" onClick={() => setFooterForm((p) => ({ ...p, services: p.services.filter((_, i) => i !== idx) }))}
                className="text-xs text-destructive border border-destructive/30 bg-destructive/5 px-2 py-1.5 rounded-md hover:bg-destructive/10 transition whitespace-nowrap">Delete</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setFooterForm((p) => ({ ...p, services: [...p.services, ""] }))}
          className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 bg-primary/5 px-3 py-1.5 rounded-md hover:bg-primary/10 transition">+ Add Service</button>
      </div>

      {/* Quick Links Column */}
      <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
        <p className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-primary flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
          </span>
          Quick Links Column
        </p>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Column Heading</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={footerForm.quick_links_heading}
            onChange={(e) => setFooterForm((p) => ({ ...p, quick_links_heading: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2 px-1">
            <span className="text-xs text-muted-foreground">Label</span>
            <span className="text-xs text-muted-foreground">URL</span>
          </div>
          {footerForm.quick_links.map((lnk, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <input type="text" className="w-28 flex-shrink-0 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={lnk.label}
                onChange={(e) => { const l = [...footerForm.quick_links]; l[idx] = { ...l[idx], label: e.target.value }; setFooterForm((p) => ({ ...p, quick_links: l })); }} placeholder="Label" />
              <input type="text" className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={lnk.url}
                onChange={(e) => { const l = [...footerForm.quick_links]; l[idx] = { ...l[idx], url: e.target.value }; setFooterForm((p) => ({ ...p, quick_links: l })); }} placeholder="/path or /#section" />
              <button type="button" onClick={() => setFooterForm((p) => ({ ...p, quick_links: p.quick_links.filter((_, i) => i !== idx) }))}
                className="text-xs text-destructive border border-destructive/30 bg-destructive/5 px-2 py-1.5 rounded-md hover:bg-destructive/10 transition whitespace-nowrap">Delete</button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setFooterForm((p) => ({ ...p, quick_links: [...p.quick_links, { label: "", url: "" }] }))}
          className="flex items-center gap-1.5 text-xs text-primary border border-primary/30 bg-primary/5 px-3 py-1.5 rounded-md hover:bg-primary/10 transition">+ Add Link</button>
      </div>

      {/* Follow Us Column */}
      <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
        <p className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-primary flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
          </span>
          Follow Us Column
        </p>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Column Heading</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={footerForm.follow_heading}
            onChange={(e) => setFooterForm((p) => ({ ...p, follow_heading: e.target.value }))} />
        </div>
        {[
          { key: "facebook_url" as const, label: "Facebook", color: "#1877f2" },
          { key: "instagram_url" as const, label: "Instagram", color: "#e1306c" },
          { key: "youtube_url" as const, label: "YouTube", color: "#ff0000" },
          { key: "linkedin_url" as const, label: "LinkedIn", color: "#0077b5" },
        ].map((s) => (
          <div key={s.key} className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg border border-border bg-background flex items-center justify-center flex-shrink-0 text-xs font-semibold" style={{ color: s.color }}>{s.label[0]}</span>
            <input type="text" className="flex-1 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={footerForm[s.key]}
              onChange={(e) => setFooterForm((p) => ({ ...p, [s.key]: e.target.value }))} placeholder={`https://${s.label.toLowerCase()}.com/...`} />
          </div>
        ))}
      </div>

      {/* Contact Us Column */}
      <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
        <p className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-primary flex items-center justify-center flex-shrink-0">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 010 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16z"/></svg>
          </span>
          Contact Us Column
        </p>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Column Heading</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={footerForm.contact_heading}
            onChange={(e) => setFooterForm((p) => ({ ...p, contact_heading: e.target.value }))} />
        </div>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Phone</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={footerForm.phone}
              onChange={(e) => setFooterForm((p) => ({ ...p, phone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1">Email</label>
            <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={footerForm.email}
              onChange={(e) => setFooterForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Address</label>
          <textarea rows={3} className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" value={footerForm.address}
            onChange={(e) => setFooterForm((p) => ({ ...p, address: e.target.value }))} />
          <p className="text-xs text-muted-foreground mt-1"><Info className="inline h-3.5 w-3.5 text-blue-500 mr-1 mb-0.5" />Each new line becomes a new address line in the footer</p>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-muted/30 border border-border rounded-lg p-4 space-y-3">
        <p className="text-xs font-bold text-foreground uppercase tracking-wider">Copyright Bar</p>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Copyright Text (left side)</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={footerForm.copyright_text}
            onChange={(e) => setFooterForm((p) => ({ ...p, copyright_text: e.target.value }))} />
        </div>
        <div>
          <label className="block text-xs text-muted-foreground mb-1">Right Side Text</label>
          <input type="text" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring" value={footerForm.copyright_right}
            onChange={(e) => setFooterForm((p) => ({ ...p, copyright_right: e.target.value }))} />
        </div>
      </div>

      <div className="flex justify-end border-t border-border pt-4">
        <Button onClick={saveFooter}>Save Footer</Button>
      </div>
    </div>
  );

  const renderBannerTab = () => {
    const presetMatch = bannerAssets.some((b) => b.src === bannerForm.image_url);
    return (
      <div className="bg-card border border-border rounded-xl p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Link URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={bannerForm.link_url}
                onChange={(e) => setBannerForm((p) => ({ ...p, link_url: e.target.value }))}
                placeholder={DEFAULT_BANNER_LINK}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Image URL</label>
              <input
                type="text"
                readOnly
                className="w-full px-3 py-2 rounded-lg border border-input bg-muted text-sm text-muted-foreground"
                value={bannerForm.image_url}
              />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Live Preview</p>
            <div className="border border-border rounded-xl overflow-hidden bg-muted/40">
              <img
                src={bannerForm.image_url || bannerAssets[0]?.src}
                alt="Current banner"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = bannerAssets[0]?.src || "";
                }}
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-foreground">Select Banner Image</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {bannerAssets.map((banner, idx) => {
              const isSelected = bannerForm.image_url === banner.src || (!presetMatch && idx === 0);
              return (
                <button
                  key={banner.label}
                  type="button"
                  onClick={() => setBannerForm((p) => ({ ...p, image_url: banner.src }))}
                  className={`group relative rounded-xl overflow-hidden border ${
                    isSelected
                      ? "border-emerald-500 ring-2 ring-emerald-500/60"
                      : "border-border hover:border-emerald-400"
                  } bg-muted transition-all`}
                >
                  <img
                    src={banner.src}
                    alt={banner.label}
                    className="w-full h-24 object-cover group-hover:scale-[1.02] transition-transform"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
                    <p className="text-[11px] text-white truncate">{banner.label}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {bannerForm.image_url && !presetMatch && (
          <div className="border border-emerald-500 rounded-xl p-4 bg-emerald-500/5 space-y-2">
            <p className="text-sm font-semibold text-foreground">Custom uploaded banner</p>
            <div className="rounded-lg overflow-hidden border border-emerald-500/60">
              <img
                src={bannerForm.image_url}
                alt="Uploaded banner"
                className="w-full h-auto object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = bannerAssets[0]?.src || "";
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground break-all">{bannerForm.image_url}</p>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <p className="text-sm text-muted-foreground mb-2">Or upload a new banner from your computer</p>
          <div className="flex flex-wrap items-center gap-3">
            <input type="file" accept="image/*" onChange={handleBannerUpload} className="text-sm text-muted-foreground" />
            {bannerUploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            {bannerUploadFilename && <span className="text-xs text-muted-foreground">{bannerUploadFilename}</span>}
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={saveBanner}>Save</Button>
        </div>
      </div>
    );
  };

  const renderGalleryTab = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Image URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={galleryForm.image_url}
                onChange={(e) => setGalleryForm((p) => ({ ...p, image_url: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="block text-sm font-medium text-foreground">Choose File</label>
              <input type="file" accept="image/*" onChange={handleGalleryUpload} className="text-sm text-muted-foreground" />
              {galleryUploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
              {galleryUploadFilename && <span className="text-xs text-muted-foreground">{galleryUploadFilename}</span>}
            </div>
            {galleryForm.image_url ? (
              <img
                src={galleryForm.image_url}
                alt="Selected preview"
                className="max-h-20 object-contain rounded-md border border-border bg-muted/30"
              />
            ) : null}
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Alt Text</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={galleryForm.alt_text ?? ""}
                onChange={(e) => setGalleryForm((p) => ({ ...p, alt_text: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Caption</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={galleryForm.caption ?? ""}
                onChange={(e) => setGalleryForm((p) => ({ ...p, caption: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Sort Order</label>
              <input
                type="number"
                className="w-32 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={galleryForm.sort_order ?? 0}
                onChange={(e) => setGalleryForm((p) => ({ ...p, sort_order: Number(e.target.value) || 0 }))}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={saveGalleryItem} disabled={galleryUploading}>Add</Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Gallery Images ({galleryItems.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Image</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Caption</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Alt Text</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Sort</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Featured</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {galleryItems.map((item) => (
                <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <img
                      src={item.image_url}
                      alt={item.alt_text || ""}
                      className="w-16 h-12 rounded-md object-cover border border-border bg-muted"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  </td>
                  <td className="px-3 py-2 text-foreground">{item.caption || "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{item.alt_text || "—"}</td>
                  <td className="px-3 py-2 text-muted-foreground">{item.sort_order ?? 0}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={async () => {
                        try {
                          const newVal = item.is_featured ? 0 : 1;
                          const res = await fetch(`${API_BASE}/api/cms/gallery/${item.id}`, {
                            method: "PUT",
                            headers: jsonHeaders(),
                            body: JSON.stringify({
                              image_url: item.image_url,
                              alt_text: item.alt_text || "",
                              caption: item.caption || "",
                              sort_order: item.sort_order ?? 0,
                              is_active: item.is_active !== undefined ? item.is_active : 1,
                              is_featured: newVal,
                            }),
                          });
                          if (!res.ok) throw new Error(`Failed to update (${res.status})`);
                          await reloadGallery();
                          toast({ title: newVal === 1 ? "Added to featured" : "Removed from featured" });
                        } catch (e) {
                          await reloadGallery();
                          toast({
                            title: "Error",
                            description: e instanceof Error ? e.message : "Failed to update",
                            variant: "destructive",
                          });
                        }
                      }}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        item.is_featured ? "bg-amber-400 text-white" : "bg-muted text-muted-foreground hover:bg-amber-100"
                      }`}
                      title={item.is_featured ? "Remove from featured" : "Feature on homepage"}
                      type="button"
                    >
                      <Star className="h-4 w-4" fill={item.is_featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                        onClick={() => {
                          setEditGalleryItem(item);
                          setEditGalleryForm({
                            image_url: item.image_url,
                            alt_text: item.alt_text ?? "",
                            caption: item.caption ?? "",
                            sort_order: item.sort_order ?? 0,
                            is_featured: item.is_featured ?? 0,
                          });
                        }}
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-xs flex items-center gap-1"
                        onClick={() => setDeleteGalleryId(item.id)}
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {galleryItems.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No gallery items yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderVideosTab = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={videoForm.title}
                onChange={(e) => setVideoForm((p) => ({ ...p, title: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">YouTube URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={videoForm.youtube_url}
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                placeholder="Paste any YouTube link"
              />
            </div>

            <div className="border-t border-border pt-3">
              <p className="text-sm text-muted-foreground mb-2">Or upload a video file from your computer</p>
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => {
                    const file = (e as ChangeEvent<HTMLInputElement>).target.files?.[0];
                    if (!file) return;
                    setVideoUploadFilename(file.name);
                    setVideoForm((p) => ({ ...p, youtube_url: "" }));
                    setUseYouTubeDefaultThumbnail(false);
                    void (async () => {
                      setVideoUploading(true);
                      try {
                        const formData = new FormData();
                        formData.append("video", file);
                        const uploadRes = await fetch(`${API_BASE}/api/cms/videos/upload`, {
                          method: "POST",
                          headers: authHeaders(),
                          body: formData,
                        });
                        if (!uploadRes.ok) throw new Error(`Video upload failed (${uploadRes.status})`);
                        const uploadData = (await uploadRes.json()) as { url?: string };
                        if (!uploadData?.url) throw new Error("Video upload succeeded but no URL returned.");
                        setVideoForm((p) => ({ ...p, video_url: uploadData.url as string }));
                        toast({ title: "Video uploaded — click Save to publish" });

                        if (!thumbnailFile) {
                          try {
                            const blob = await generateThumbnailFromVideoFile(file);
                            const thumbUrl = await uploadThumbnailBlob(blob);
                            setVideoForm((p) => ({ ...p, thumbnail_url: thumbUrl }));
                            if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
                            setThumbnailPreviewUrl(thumbUrl);
                            toast({ title: "Thumbnail generated from video" });
                          } catch {
                            // non-fatal
                          }
                        }
                      } catch (err) {
                        toast({
                          title: "Upload failed",
                          description: err instanceof Error ? err.message : "Failed to upload video.",
                          variant: "destructive",
                        });
                      } finally {
                        setVideoUploading(false);
                      }
                    })();
                    (e.target as HTMLInputElement).value = "";
                  }}
                  className="text-sm text-muted-foreground"
                />
                {videoUploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                {videoUploadFilename && <span className="text-xs text-muted-foreground">{videoUploadFilename}</span>}
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-2">
              <label className="block text-sm font-medium text-foreground">Thumbnail Image (Optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = (e as ChangeEvent<HTMLInputElement>).target.files?.[0];
                  if (!file) return;
                  setThumbnailFile(file);
                  if (thumbnailPreviewUrl) URL.revokeObjectURL(thumbnailPreviewUrl);
                  setThumbnailPreviewUrl(URL.createObjectURL(file));
                  void (async () => {
                    setVideoUploading(true);
                    try {
                      const formData = new FormData();
                      formData.append("thumbnail", file);
                      const res = await fetch(`${API_BASE}/api/cms/videos/thumbnail`, {
                        method: "POST",
                        headers: authHeaders(),
                        body: formData,
                      });
                      if (!res.ok) throw new Error(`Thumbnail upload failed (${res.status})`);
                      const data = (await res.json()) as { url?: string };
                      if (!data?.url) throw new Error("Thumbnail upload succeeded but no URL returned.");
                      setVideoForm((p) => ({ ...p, thumbnail_url: data.url as string }));
                      setThumbnailPreviewUrl(data.url as string);
                      toast({ title: "Thumbnail uploaded — click Save to apply" });
                    } catch (err) {
                      toast({
                        title: "Thumbnail upload failed",
                        description: err instanceof Error ? err.message : "Failed to upload thumbnail.",
                        variant: "destructive",
                      });
                    } finally {
                      setVideoUploading(false);
                    }
                  })();
                  (e.target as HTMLInputElement).value = "";
                }}
                className="text-sm text-muted-foreground"
              />
              <p className="text-xs text-muted-foreground">
                <Info className="inline h-3.5 w-3.5 text-blue-500 mr-1 mb-0.5" />
                Recommended size: 800 × 450 px (16:9 ratio). Max file size: 2MB. Formats: JPG, PNG, WebP.
              </p>
              {thumbnailPreviewUrl ? (
                <img
                  src={thumbnailPreviewUrl}
                  alt="Thumbnail preview"
                  className="w-40 aspect-video object-cover rounded-lg border border-border bg-muted"
                  loading="lazy"
                />
              ) : null}
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                <input
                  type="checkbox"
                  checked={useYouTubeDefaultThumbnail}
                  onChange={(e) => setUseYouTubeDefaultThumbnail(e.target.checked)}
                />
                Use YouTube default thumbnail
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[72px]"
                value={videoForm.description ?? ""}
                onChange={(e) => setVideoForm((p) => ({ ...p, description: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3 mt-2">
              <label className="text-sm font-medium text-foreground">Feature this video on homepage</label>
              <button
                type="button"
                onClick={() => setVideoForm((p) => ({ ...p, is_featured: p.is_featured ? 0 : 1 }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  videoForm.is_featured ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    videoForm.is_featured ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-xs text-muted-foreground">
                {videoForm.is_featured ? "Featured — shows on homepage" : "Not featured"}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Sort Order</label>
              <input
                type="number"
                className="w-32 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={videoForm.sort_order ?? 0}
                onChange={(e) => setVideoForm((p) => ({ ...p, sort_order: Number(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Preview</p>
            <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center">
              {videoForm.youtube_url ? (
                <iframe
                  src={videoForm.youtube_url}
                  title={videoForm.title || "Video preview"}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <p className="text-xs text-muted-foreground">
                  {videoForm.video_url ? "Video uploaded — click Save to publish." : "Paste a YouTube URL to preview."}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={saveVideo} disabled={videoUploading}>
            {videoUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Saving…
              </>
            ) : (
              "Save"
            )}
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4">Videos ({videos.length})</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Preview</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Title</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Description</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Sort</th>
                <th className="text-center px-4 py-3 font-medium text-muted-foreground">Featured</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((v) => (
                <tr key={v.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-3 py-2">
                    <div className="w-28 h-[63px] rounded-md overflow-hidden border border-border bg-muted">
                      {v.thumbnail_url ? (
                        <img
                          src={v.thumbnail_url}
                          alt={`${v.title} thumbnail`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                        />
                      ) : v.youtube_url ? (
                        <iframe
                          src={v.youtube_url}
                          title={v.title}
                          className="w-full h-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <img
                          src={"/placeholder.svg"}
                          alt={`${v.title} thumbnail`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-foreground font-medium">{v.title}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {(v.description || "").length > 60 ? `${(v.description || "").slice(0, 60)}…` : (v.description || "—")}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{v.sort_order ?? 0}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      type="button"
                      onClick={async () => {
                        try {
                          const newVal = v.is_featured ? 0 : 1;
                          const res = await fetch(`${API_BASE}/api/cms/videos/${v.id}`, {
                            method: "PUT",
                            headers: jsonHeaders(),
                            body: JSON.stringify({
                              title: v.title,
                              youtube_url: v.youtube_url || null,
                              video_url: v.video_url || null,
                              thumbnail_url: v.thumbnail_url || null,
                              description: v.description || "",
                              sort_order: v.sort_order ?? 0,
                              is_active: v.is_active !== undefined ? v.is_active : 1,
                              is_featured: newVal,
                            }),
                          });
                          if (!res.ok) throw new Error(`Failed to update (${res.status})`);
                          await reloadVideos();
                          toast({ title: newVal === 1 ? "Added to featured" : "Removed from featured" });
                        } catch (e) {
                          await reloadVideos();
                          toast({
                            title: "Error",
                            description: e instanceof Error ? e.message : "Failed to update",
                            variant: "destructive",
                          });
                        }
                      }}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full transition-colors ${
                        v.is_featured ? "bg-amber-400 text-white" : "bg-muted text-muted-foreground hover:bg-amber-100"
                      }`}
                      title={v.is_featured ? "Remove from featured" : "Feature on homepage"}
                    >
                      <Star className="h-4 w-4" fill={v.is_featured ? "currentColor" : "none"} />
                    </button>
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                        onClick={() => {
                          setEditVideoItem(v);
                          setEditVideoForm({
                            title: v.title,
                            youtube_url: normalizeYouTubeUrl(v.youtube_url || "") || (v.youtube_url || ""),
                            video_url: v.video_url || null,
                            thumbnail_url: v.thumbnail_url || null,
                            is_featured: v.is_featured ?? 0,
                            description: v.description ?? "",
                            sort_order: v.sort_order ?? 0,
                          });
                        }}
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-xs flex items-center gap-1"
                        onClick={() => setDeleteVideoId(v.id)}
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {videos.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-8 text-center text-muted-foreground">No videos yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderFaqTab = () => (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Question</label>
          <input
            type="text"
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={faqForm.question}
            onChange={(e) => setFaqForm((p) => ({ ...p, question: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Answer</label>
          <textarea
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[96px]"
            value={faqForm.answer}
            onChange={(e) => setFaqForm((p) => ({ ...p, answer: e.target.value }))}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-1.5">Sort Order</label>
          <input
            type="number"
            className="w-32 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            value={faqForm.sort_order ?? 0}
            onChange={(e) => setFaqForm((p) => ({ ...p, sort_order: Number(e.target.value) || 0 }))}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={saveFaq}>Save</Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-3">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <GripVertical className="h-4 w-4" />
          Change Sort Order numbers and click outside the field to reorder FAQs
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">#</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Question</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Answer</th>
                <th className="text-left px-3 py-2 text-muted-foreground font-medium">Sort Order</th>
                <th className="text-right px-3 py-2 text-muted-foreground font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {faqs.map((f, idx) => (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-muted/40">
                  <td className="px-3 py-2 text-muted-foreground">{idx + 1}</td>
                  <td className="px-3 py-2 text-foreground font-medium">{f.question}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {f.answer.length > 80 ? `${f.answer.slice(0, 80)}…` : f.answer}
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      defaultValue={f.sort_order ?? 0}
                      className="w-20 px-2 py-1 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      onBlur={(e) => updateFaqSortOrder(f.id, Number(e.target.value) || 0)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs flex items-center gap-1"
                        onClick={() => {
                          setEditFaqItem(f);
                          setEditFaqForm({
                            question: f.question,
                            answer: f.answer,
                            sort_order: f.sort_order ?? 0,
                          });
                        }}
                      >
                        <Edit className="h-3 w-3" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="text-xs flex items-center gap-1"
                        onClick={() => setDeleteFaqId(f.id)}
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {faqs.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground">No FAQs yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-wrap gap-2 bg-muted rounded-lg p-1 w-full md:w-auto">
          {[
            { id: "banner" as const, label: "Banner" },
            { id: "hero" as const, label: "Hero Section" },
            { id: "stats" as const, label: "Stats" },
            { id: "about" as const, label: "About Us" },
            { id: "footer" as const, label: "Footer" },
            { id: "gallery" as const, label: "Gallery" },
            { id: "videos" as const, label: "Videos" },
            { id: "faq" as const, label: "FAQ" },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {activeTab === "banner" && renderBannerTab()}
          {activeTab === "hero" && renderHeroTab()}
          {activeTab === "stats" && renderStatsTab()}
          {activeTab === "about" && renderAboutTab()}
          {activeTab === "footer" && renderFooterTab()}
          {activeTab === "gallery" && renderGalleryTab()}
          {activeTab === "videos" && renderVideosTab()}
          {activeTab === "faq" && renderFaqTab()}
        </motion.div>
      </section>

      {/* Gallery Edit Dialog */}
      <Dialog open={!!editGalleryItem} onOpenChange={(open) => !open && setEditGalleryItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
            <DialogDescription>Update caption, alt text and sort order.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {editGalleryForm.image_url ? (
              <img
                src={editGalleryForm.image_url}
                alt="Current"
                className="w-full max-h-48 object-contain rounded-lg border border-border bg-muted/30 mb-3"
              />
            ) : null}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Change Image URL</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={editGalleryForm.image_url ?? ""}
                onChange={(e) => setEditGalleryForm((p) => ({ ...p, image_url: e.target.value }))}
              />
            </div>
            <div className="flex items-center gap-3">
              <label className="block text-sm font-medium text-foreground">Or upload new image</label>
              <input type="file" accept="image/*" onChange={handleEditGalleryUpload} className="text-sm text-muted-foreground" />
              {editGalleryUploading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Caption</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={editGalleryForm.caption ?? ""}
                onChange={(e) => setEditGalleryForm((p) => ({ ...p, caption: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Alt Text</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={editGalleryForm.alt_text ?? ""}
                onChange={(e) => setEditGalleryForm((p) => ({ ...p, alt_text: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Sort Order</label>
              <input
                type="number"
                className="w-32 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={editGalleryForm.sort_order ?? 0}
                onChange={(e) => setEditGalleryForm((p) => ({ ...p, sort_order: Number(e.target.value) || 0 }))}
              />
            </div>
            <div className="flex items-center gap-3 mt-2">
              <label className="text-sm font-medium text-foreground">Featured on Homepage</label>
              <button
                type="button"
                onClick={() => setEditGalleryForm((p) => ({ ...p, is_featured: p.is_featured ? 0 : 1 }))}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  editGalleryForm.is_featured ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    editGalleryForm.is_featured ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-xs text-muted-foreground">
                {editGalleryForm.is_featured ? "Featured — shows on homepage" : "Not featured"}
              </span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditGalleryItem(null)} disabled={editGallerySaving}>
              Cancel
            </Button>
            <Button onClick={saveEditGalleryItem} disabled={editGallerySaving}>
              {editGallerySaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery Delete AlertDialog */}
      <AlertDialog open={deleteGalleryId !== null} onOpenChange={(open) => !open && setDeleteGalleryId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this image?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteGalleryId !== null) void deleteGalleryItemById(deleteGalleryId);
                setDeleteGalleryId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Video Edit Dialog */}
      <Dialog open={!!editVideoItem} onOpenChange={(open) => !open && setEditVideoItem(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Video</DialogTitle>
            <DialogDescription>Update the video details.</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={editVideoForm.title}
                  onChange={(e) => setEditVideoForm((p) => ({ ...p, title: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">YouTube URL</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={editVideoForm.youtube_url}
                  onChange={(e) =>
                    setEditVideoForm((p) => ({
                      ...p,
                      youtube_url: normalizeYouTubeUrl(e.target.value) || e.target.value,
                    }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
                <textarea
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[72px]"
                  value={editVideoForm.description ?? ""}
                  onChange={(e) => setEditVideoForm((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Sort Order</label>
                <input
                  type="number"
                  className="w-32 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  value={editVideoForm.sort_order ?? 0}
                  onChange={(e) => setEditVideoForm((p) => ({ ...p, sort_order: Number(e.target.value) || 0 }))}
                />
              </div>
              <div className="flex items-center gap-3 mt-2">
                <label className="text-sm font-medium text-foreground">Feature this video on homepage</label>
                <button
                  type="button"
                  onClick={() => setEditVideoForm((p) => ({ ...p, is_featured: p.is_featured ? 0 : 1 }))}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    editVideoForm.is_featured ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      editVideoForm.is_featured ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-xs text-muted-foreground">
                  {editVideoForm.is_featured ? "Featured — shows on homepage" : "Not featured"}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">Preview</p>
              <div className="aspect-video rounded-xl overflow-hidden border border-border bg-muted flex items-center justify-center">
                {editVideoForm.youtube_url ? (
                  <iframe
                    src={editVideoForm.youtube_url}
                    title={editVideoForm.title || "Video preview"}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">Paste a URL to preview.</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditVideoItem(null)} disabled={editVideoSaving}>
              Cancel
            </Button>
            <Button onClick={saveEditVideo} disabled={editVideoSaving}>
              {editVideoSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Video Delete AlertDialog */}
      <AlertDialog open={deleteVideoId !== null} onOpenChange={(open) => !open && setDeleteVideoId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this video?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteVideoId !== null) void deleteVideoById(deleteVideoId);
                setDeleteVideoId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* FAQ Edit Dialog */}
      <Dialog open={!!editFaqItem} onOpenChange={(open) => !open && setEditFaqItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit FAQ</DialogTitle>
            <DialogDescription>Update question, answer and sort order.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Question</label>
              <input
                type="text"
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={editFaqForm.question}
                onChange={(e) => setEditFaqForm((p) => ({ ...p, question: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Answer</label>
              <textarea
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring min-h-[96px]"
                value={editFaqForm.answer}
                onChange={(e) => setEditFaqForm((p) => ({ ...p, answer: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Sort Order</label>
              <input
                type="number"
                className="w-32 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                value={editFaqForm.sort_order ?? 0}
                onChange={(e) => setEditFaqForm((p) => ({ ...p, sort_order: Number(e.target.value) || 0 }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditFaqItem(null)} disabled={editFaqSaving}>
              Cancel
            </Button>
            <Button onClick={saveEditFaq} disabled={editFaqSaving}>
              {editFaqSaving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FAQ Delete AlertDialog */}
      <AlertDialog open={deleteFaqId !== null} onOpenChange={(open) => !open && setDeleteFaqId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this FAQ?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteFaqId !== null) void deleteFaqById(deleteFaqId);
                setDeleteFaqId(null);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HomepageCMS;

