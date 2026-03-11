// Blog API client — tries backend API first, falls back to JSON
export interface BlogPost {
  id?: number;
  title: string;
  slug: string;
  image: string;
  excerpt: string;
  content: string;
  author: string;
  status?: string;
  publish_date?: string;
  created_at?: string;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  featured_homepage?: boolean;
  views?: number;
}

export interface AnalyticsSummary {
  total_posts: number;
  published_posts: number;
  draft_posts: number;
  total_views: number;
}

export interface AnalyticsPost {
  title: string;
  slug: string;
  views: number;
  publish_date: string;
}

const API_BASE = import.meta.env.VITE_API_URL || "";

/** Normalize image URLs — prepend API_BASE if path is relative */
export function resolveImageUrl(url: string): string {
  if (!url) return "/placeholder.svg";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:") || url.startsWith("blob:")) {
    return url;
  }
  // Strip any accidental prefix like "bmj7.backend" etc.
  const cleaned = url.replace(/^[a-zA-Z0-9.-]*backend/, "");
  const base = API_BASE || "https://api.jambologos.com";
  return `${base}${cleaned.startsWith("/") ? cleaned : `/${cleaned}`}`;
}

async function fetchFromApi<T>(path: string): Promise<T | null> {
  if (!API_BASE) return null;
  try {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function fetchFromJson(): Promise<BlogPost[]> {
  try {
    const res = await fetch("/data/blog-posts.json");
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  const api = await fetchFromApi<BlogPost[]>("/api/blog");
  if (api && api.length) return api;
  return fetchFromJson();
}

/** Fetch ALL posts (draft + published) using admin endpoint with auth */
export async function getAllAdminPosts(): Promise<BlogPost[]> {
  const token = localStorage.getItem("admin_token");
  const base = API_BASE || "https://api.jambologos.com";
  try {
    const res = await fetch(`${base}/api/admin/posts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      if (res.status === 401) throw new Error("unauthorized");
      return [];
    }
    return res.json();
  } catch (err) {
    if (err instanceof Error && err.message === "unauthorized") throw err;
    // Fallback to public endpoint
    const api = await fetchFromApi<BlogPost[]>("/api/blog");
    if (api && api.length) return api;
    return fetchFromJson();
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const api = await fetchFromApi<BlogPost>(`/api/blog/${slug}`);
  if (api) return api;
  const all = await fetchFromJson();
  return all.find((p) => p.slug === slug) || null;
}

export async function getLatestPosts(count = 3): Promise<BlogPost[]> {
  const homepage = await fetchFromApi<BlogPost[]>("/api/blog/homepage");
  if (homepage && homepage.length) return homepage.slice(0, count);
  
  const posts = await getAllPosts();
  return posts
    .sort((a, b) => new Date(b.publish_date || b.created_at || "").getTime() - new Date(a.publish_date || a.created_at || "").getTime())
    .slice(0, count);
}

/** Check if JWT token is valid (not expired) */
export function isTokenValid(): boolean {
  const token = localStorage.getItem("admin_token");
  if (!token || token === "demo_token") return !!token;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function clearAuth() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_email");
  localStorage.removeItem("admin_role");
}
