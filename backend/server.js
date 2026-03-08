require("dotenv").config();
const express = require("express");
const cors = require("cors");
const NodeCache = require("node-cache");
const blogRoutes = require("./routes/blog");
const adminRoutes = require("./routes/admin");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;
const SITE_URL = process.env.SITE_URL || "https://bookmyjunk.com";

// Shared cache instance for sitemap
const sitemapCache = new NodeCache({ stdTTL: 300 });

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json({ limit: "10mb" }));
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/blog", blogRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// ==================== SITEMAP.XML ====================
app.get("/sitemap.xml", async (req, res) => {
  try {
    const cached = sitemapCache.get("sitemap");
    if (cached) {
      console.log("[Sitemap] Cache hit");
      res.set("Content-Type", "application/xml");
      return res.send(cached);
    }
    console.log("[Sitemap] Cache miss — generating");
    const [posts] = await db.query(
      "SELECT slug, updated_at FROM blog_posts WHERE status = 'published' ORDER BY publish_date DESC"
    );
    const urls = [
      `<url><loc>${SITE_URL}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>`,
      `<url><loc>${SITE_URL}/blog</loc><changefreq>daily</changefreq><priority>0.8</priority></url>`,
      ...posts.map(
        (p) =>
          `<url><loc>${SITE_URL}/blog/${p.slug}</loc><lastmod>${new Date(p.updated_at).toISOString().split("T")[0]}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
      ),
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
    sitemapCache.set("sitemap", xml);
    res.set("Content-Type", "application/xml");
    res.send(xml);
  } catch (err) {
    res.status(500).send("Sitemap error");
  }
});

// ==================== ROBOTS.TXT ====================
app.get("/robots.txt", (req, res) => {
  res.set("Content-Type", "text/plain");
  res.send(`User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
});

// Export sitemapCache for invalidation from admin routes
app.locals.sitemapCache = sitemapCache;

app.listen(PORT, () => {
  console.log(`Blog API running on port ${PORT}`);
});
