const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");
const db = require("../db");

const cache = new NodeCache({ stdTTL: 60 });

// GET /api/blog/homepage — featured + latest fill to 3
router.get("/homepage", async (req, res) => {
  try {
    const cached = cache.get("homepage_posts");
    if (cached) {
      console.log("[Cache] Cache hit: homepage_posts");
      return res.json(cached);
    }
    console.log("[Cache] Cache miss: homepage_posts");

    // Step 1: featured posts
    const [featured] = await db.query(
      "SELECT id, title, slug, image, excerpt, author, status, publish_date, created_at, featured_homepage FROM blog_posts WHERE featured_homepage = TRUE AND status = 'published' ORDER BY publish_date DESC LIMIT 3"
    );

    let result = [...featured];

    // Step 2: fill remaining with latest
    if (result.length < 3) {
      const remaining = 3 - result.length;
      const excludeIds = result.map((p) => p.id);
      const placeholders = excludeIds.length ? `AND id NOT IN (${excludeIds.join(",")})` : "";
      const [latest] = await db.query(
        `SELECT id, title, slug, image, excerpt, author, status, publish_date, created_at, featured_homepage FROM blog_posts WHERE status = 'published' ${placeholders} ORDER BY publish_date DESC LIMIT ?`,
        [remaining]
      );
      result = [...result, ...latest];
    }

    cache.set("homepage_posts", result);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/blog — all published posts
router.get("/", async (req, res) => {
  try {
    const cached = cache.get("blog_list");
    if (cached) {
      console.log("[Cache] Cache hit: blog_list");
      return res.json(cached);
    }
    console.log("[Cache] Cache miss: blog_list");
    const [rows] = await db.query(
      "SELECT id, title, slug, image, excerpt, author, status, publish_date, created_at, featured_homepage FROM blog_posts WHERE status = 'published' ORDER BY publish_date DESC"
    );
    cache.set("blog_list", rows);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/blog/:slug — single post
router.get("/:slug", async (req, res) => {
  try {
    const key = `blog_slug_${req.params.slug}`;
    const cached = cache.get(key);
    if (cached) {
      console.log(`[Cache] Cache hit: ${key}`);
      return res.json(cached);
    }
    console.log(`[Cache] Cache miss: ${key}`);
    const [rows] = await db.query(
      "SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1",
      [req.params.slug]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Post not found" });
    cache.set(key, rows[0]);
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Export cache for invalidation from admin routes
router.blogCache = cache;

module.exports = router;
