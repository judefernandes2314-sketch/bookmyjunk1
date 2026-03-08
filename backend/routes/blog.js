const express = require("express");
const router = express.Router();
const db = require("../db");

// GET /api/blog — all published posts
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT id, title, slug, image, excerpt, author, status, publish_date, created_at FROM blog_posts WHERE status = 'published' ORDER BY publish_date DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET /api/blog/:slug — single post
router.get("/:slug", async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM blog_posts WHERE slug = ? AND status = 'published' LIMIT 1",
      [req.params.slug]
    );
    if (rows.length === 0) return res.status(404).json({ message: "Post not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
