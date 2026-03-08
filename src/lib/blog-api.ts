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
}

const API_BASE = import.meta.env.VITE_API_URL || "";

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

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const api = await fetchFromApi<BlogPost>(`/api/blog/${slug}`);
  if (api) return api;
  const all = await fetchFromJson();
  return all.find((p) => p.slug === slug) || null;
}

export async function getLatestPosts(count = 3): Promise<BlogPost[]> {
  // Try homepage endpoint first
  const homepage = await fetchFromApi<BlogPost[]>("/api/blog/homepage");
  if (homepage && homepage.length) return homepage.slice(0, count);
  
  const posts = await getAllPosts();
  return posts
    .sort((a, b) => new Date(b.publish_date || b.created_at || "").getTime() - new Date(a.publish_date || a.created_at || "").getTime())
    .slice(0, count);
}
