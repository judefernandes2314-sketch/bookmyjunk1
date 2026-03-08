const express = require("express");
const router = express.Router();
const NodeCache = require("node-cache");
const db = require("../db");
const { auth } = require("../middleware/auth");

const cache = new NodeCache({ stdTTL: 60 });

// GET /api/admin/analytics/summary
router.get("/summary", auth, async (req, res) => {
  try {
    const cached = cache.get("analytics_summary");
    if (cached) return res.json(cached);

    const [[row]] = await db.query(
      "SELECT COUNT(*) as total_posts, SUM(status='published') as published_posts, SUM(status='draft') as draft_posts, COALESCE(SUM(views),0) as total_views FROM blog_posts"
    );
    const result = {
      total_posts: row.total_posts || 0,
      published_posts: Number(row.published_posts) || 0,
      draft_posts: Number(row.draft_posts) || 0,
      total_views: Number(row.total_views) || 0,
    };
    cache.set("analytics_summary", result);
    res.json(result);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// GET /api/admin/analytics/top-posts
router.get("/top-posts", auth, async (req, res) => {
  try {
    const cached = cache.get("analytics_top");
    if (cached) return res.json(cached);

    const [rows] = await db.query(
      "SELECT title, slug, views, publish_date FROM blog_posts ORDER BY views DESC LIMIT 10"
    );
    cache.set("analytics_top", rows);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// GET /api/admin/analytics/recent-posts
router.get("/recent-posts", auth, async (req, res) => {
  try {
    const cached = cache.get("analytics_recent");
    if (cached) return res.json(cached);

    const [rows] = await db.query(
      "SELECT title, slug, views, publish_date FROM blog_posts WHERE status='published' ORDER BY publish_date DESC LIMIT 5"
    );
    cache.set("analytics_recent", rows);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

// Export for cache invalidation
router.analyticsCache = cache;
module.exports = router;
