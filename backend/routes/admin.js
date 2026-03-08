const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const db = require("../db");
const { auth, checkPermission } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "change_me";

// Multer for image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ==================== AUTH ====================

// POST /api/admin/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query(
      "SELECT u.*, r.name as role_name FROM admin_users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ? AND u.is_active = 1",
      [email]
    );
    if (users.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role_name }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, role: user.role_name, name: user.name });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ==================== POSTS ====================

// GET /api/admin/posts — all posts (incl. drafts)
router.get("/posts", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM blog_posts ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/posts — create post
router.post("/posts", auth, checkPermission("create_post"), async (req, res) => {
  try {
    const { title, slug, image, excerpt, content, author, status } = req.body;
    const [result] = await db.query(
      "INSERT INTO blog_posts (title, slug, image, excerpt, content, author, status, publish_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [title, slug, image, excerpt, content, author, status, status === "published" ? new Date() : null]
    );
    res.status(201).json({ id: result.insertId, message: "Post created" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// PUT /api/admin/posts/:slug — update post
router.put("/posts/:slug", auth, checkPermission("edit_post"), async (req, res) => {
  try {
    const { title, image, excerpt, content, author, status } = req.body;
    await db.query(
      "UPDATE blog_posts SET title=?, image=?, excerpt=?, content=?, author=?, status=?, publish_date=IF(?='published' AND publish_date IS NULL, NOW(), publish_date) WHERE slug=?",
      [title, image, excerpt, content, author, status, status, req.params.slug]
    );
    res.json({ message: "Post updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/admin/posts/:slug
router.delete("/posts/:slug", auth, checkPermission("delete_post"), async (req, res) => {
  try {
    await db.query("DELETE FROM blog_posts WHERE slug = ?", [req.params.slug]);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/upload — image upload
router.post("/upload", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ==================== JSON IMPORT ====================

// POST /api/admin/import-json
router.post("/import-json", auth, checkPermission("import_json"), async (req, res) => {
  try {
    const posts = req.body;
    if (!Array.isArray(posts)) return res.status(400).json({ message: "Expected array of posts" });

    let imported = 0;
    for (const p of posts) {
      await db.query(
        "INSERT IGNORE INTO blog_posts (title, slug, image, excerpt, content, author, status, publish_date) VALUES (?, ?, ?, ?, ?, ?, 'published', NOW())",
        [p.title, p.slug, p.image, p.excerpt, p.content, p.author || "Admin"]
      );
      imported++;
    }
    res.json({ message: `${imported} posts imported` });
  } catch (err) {
    res.status(500).json({ message: "Import failed", error: err.message });
  }
});

// ==================== USERS ====================

// GET /api/admin/users
router.get("/users", auth, checkPermission("manage_users"), async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT u.id, u.email, u.name, u.is_active, r.name as role FROM admin_users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/users — add user
router.post("/users", auth, checkPermission("manage_users"), async (req, res) => {
  try {
    const { email, password, name, role_id } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO admin_users (email, password_hash, name, role_id) VALUES (?, ?, ?, ?)", [email, hash, name, role_id]);
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// ==================== ROLES ====================

// GET /api/admin/roles
router.get("/roles", auth, checkPermission("manage_roles"), async (req, res) => {
  try {
    const [roles] = await db.query("SELECT * FROM roles ORDER BY id");
    const [perms] = await db.query(
      "SELECT rp.role_id, p.name FROM role_permissions rp JOIN permissions p ON rp.permission_id = p.id"
    );
    const result = roles.map((r) => ({
      ...r,
      permissions: perms.filter((p) => p.role_id === r.id).map((p) => p.name),
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin/roles — create role
router.post("/roles", auth, checkPermission("manage_roles"), async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const [result] = await db.query("INSERT INTO roles (name, description) VALUES (?, ?)", [name, description]);
    const roleId = result.insertId;

    if (permissions && permissions.length) {
      const [allPerms] = await db.query("SELECT id, name FROM permissions WHERE name IN (?)", [permissions]);
      for (const p of allPerms) {
        await db.query("INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)", [roleId, p.id]);
      }
    }
    res.status(201).json({ message: "Role created", id: roleId });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
