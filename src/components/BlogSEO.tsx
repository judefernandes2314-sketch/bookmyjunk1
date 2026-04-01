import { useEffect } from "react";
import type { BlogPost } from "@/lib/blog-api";

const SITE_URL = import.meta.env.VITE_SITE_URL || "https://bookmyjunk.com";

function generateKeywords(post: BlogPost): string {
  if (post.seo_keywords) return post.seo_keywords;
  const words = post.title.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
  return ["e-waste", "recycling", "book my junk", ...words].join(", ");
}

interface BlogSEOProps {
  post: BlogPost;
}

const BlogSEO = ({ post }: BlogSEOProps) => {
  const seoTitle = post.seo_title || post.title;
  const seoDesc = post.seo_description || post.excerpt;
  const seoKeywords = generateKeywords(post);
  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const imageUrl = post.image?.startsWith("http") ? post.image : `${SITE_URL}${post.image}`;

  useEffect(() => {
    // Title
    document.title = `${seoTitle} | Book My Junk`;

    // Helper to set/create meta
    const setMeta = (attr: string, key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    // Standard meta
    setMeta("name", "title", seoTitle);
    setMeta("name", "description", seoDesc);
    setMeta("name", "keywords", seoKeywords);
    setMeta("name", "robots", "index, follow");

    // Open Graph
    setMeta("property", "og:title", seoTitle);
    setMeta("property", "og:description", seoDesc);
    setMeta("property", "og:image", imageUrl);
    setMeta("property", "og:type", "article");
    setMeta("property", "og:url", canonicalUrl);

    // Twitter
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", seoTitle);
    setMeta("name", "twitter:description", seoDesc);
    setMeta("name", "twitter:image", imageUrl);

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // JSON-LD
    const jsonLdId = "blog-jsonld";
    let script = document.getElementById(jsonLdId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement("script");
      script.id = jsonLdId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Article",
      headline: seoTitle,
      image: imageUrl,
      author: { "@type": "Person", name: post.author },
      datePublished: post.publish_date || post.created_at,
      description: seoDesc,
      url: canonicalUrl,
      publisher: {
        "@type": "Organization",
        name: "Book My Junk",
        url: SITE_URL,
      },
    });

    // Cleanup on unmount
    return () => {
      document.title = "Book My Junk — E-waste Recycling";
      const jsonLd = document.getElementById(jsonLdId);
      if (jsonLd) jsonLd.remove();
    };
  }, [seoTitle, seoDesc, seoKeywords, canonicalUrl, imageUrl, post.author, post.publish_date, post.created_at]);

  return null;
};

export default BlogSEO;
