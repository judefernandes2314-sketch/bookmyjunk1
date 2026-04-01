const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const slugify = require("slugify");
const nodemailer = require("nodemailer");
const db = require("../db");
const { auth, checkPermission } = require("../middleware/auth");

const JWT_SECRET = process.env.JWT_SECRET || "change_me";
const APPROVAL_EMAILS = ["epr@ecoreco.com", "info@ecoreco.com"];
const API_URL = process.env.API_URL || "http://localhost:5000";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "-")),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: { user: process.env.SMTP_USER || "", pass: process.env.SMTP_PASS || "" },
});

async function generateUniqueSlug(title) {
  let slug = slugify(title, { lower: true, strict: true });
  const [existing] = await db.query("SELECT slug FROM blog_posts WHERE slug LIKE ?", [`${slug}%`]);
  if (existing.length === 0) return slug;
  const slugs = new Set(existing.map((r) => r.slug));
  if (!slugs.has(slug)) return slug;
  let i = 2;
  while (slugs.has(`${slug}-${i}`)) i++;
  return `${slug}-${i}`;
}

function invalidateCaches(req) {
  if (req.app.locals.sitemapCache) {
    req.app.locals.sitemapCache.del("sitemap");
  }
  const blogRoutes = require("./blog");
  if (blogRoutes.blogCache) {
    blogRoutes.blogCache.flushAll();
  }
  try {
    const analyticsRoutes = require("./analytics");
    if (analyticsRoutes.analyticsCache) analyticsRoutes.analyticsCache.flushAll();
  } catch {}
  console.log("[Cache] All caches invalidated");
}

// ==================== AUTH ====================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const [users] = await db.query(
      "SELECT u.*, r.name as role_name FROM admin_users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.email = ? AND u.is_active = 1",
      [email]
    );
    if (users.length === 0) return res.status(401).json({ message: "Invalid credentials" });
    const user = users[0];
    if (user.role_name === "pending_admin") return res.status(403).json({ message: "Your admin access is pending approval." });
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role_name }, JWT_SECRET, { expiresIn: "24h" });
    res.json({ token, role: user.role_name, name: user.name });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, name, requestAdmin } = req.body;
    const [existing] = await db.query("SELECT id FROM admin_users WHERE email = ?", [email]);
    if (existing.length > 0) return res.status(409).json({ message: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const roleName = requestAdmin ? "pending_admin" : "author";
    const [roleRow] = await db.query("SELECT id FROM roles WHERE name = ?", [roleName]);
    const roleId = roleRow.length > 0 ? roleRow[0].id : null;
    const [result] = await db.query(
      "INSERT INTO admin_users (email, password_hash, name, role_id, is_active) VALUES (?, ?, ?, ?, ?)",
      [email, hash, name, roleId, requestAdmin ? 0 : 1]
    );
    if (requestAdmin) {
      const token = uuidv4();
      await db.query("INSERT INTO admin_approvals (user_id, token, status) VALUES (?, ?, 'pending')", [result.insertId, token]);
      const approvalLink = `${API_URL}/api/admin/approve-admin?token=${token}`;
      for (const to of APPROVAL_EMAILS) {
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM || "noreply@bookmyjunk.com", to,
            subject: "Admin Approval Request",
            html: `<p>New admin request from <strong>${name}</strong> (${email}).</p><p><a href="${approvalLink}">Approve</a></p>`,
          });
        } catch (e) { console.error(`[Email] Failed: ${to}`, e.message); }
      }
      console.log("[Admin] Admin approval request sent for:", email);
      return res.status(201).json({ message: "Registration received. Admin approval pending." });
    }
    res.status(201).json({ message: "Account created successfully." });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.get("/approve-admin", async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).send("Missing token.");
    const [rows] = await db.query(
      "SELECT a.*, u.email, u.name FROM admin_approvals a JOIN admin_users u ON a.user_id = u.id WHERE a.token = ? AND a.status = 'pending'", [token]
    );
    if (rows.length === 0) return res.status(404).send("Invalid or already used token.");
    const approval = rows[0];
    const [adminRole] = await db.query("SELECT id FROM roles WHERE name = 'admin'");
    await db.query("UPDATE admin_users SET role_id = ?, is_active = 1 WHERE id = ?", [adminRole[0].id, approval.user_id]);
    await db.query("UPDATE admin_approvals SET status = 'approved' WHERE id = ?", [approval.id]);
    console.log("[Admin] Admin approved:", approval.email);
    res.send(`<h2>Admin Approved</h2><p>${approval.name} (${approval.email}) now has admin access.</p>`);
  } catch (err) {
    res.status(500).send("Approval failed.");
  }
});

// ==================== POSTS ====================

router.get("/posts", auth, async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM blog_posts ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/posts", auth, checkPermission("create_post"), async (req, res) => {
  try {
    const { title, slug: manualSlug, image, excerpt, content, author, status, featured_homepage, seo_title, seo_description, seo_keywords } = req.body;
    const slug = manualSlug || (await generateUniqueSlug(title));
    const [result] = await db.query(
      "INSERT INTO blog_posts (title, slug, image, excerpt, content, author, status, publish_date, featured_homepage, seo_title, seo_description, seo_keywords) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [title, slug, image, excerpt, content, author, status, status === "published" ? new Date() : null, featured_homepage ? 1 : 0, seo_title || null, seo_description || null, seo_keywords || null]
    );
    invalidateCaches(req);
    res.status(201).json({ id: result.insertId, slug, message: "Post created" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

router.put("/posts/:slug", auth, checkPermission("edit_post"), async (req, res) => {
  try {
    const { title, image, excerpt, content, author, status, featured_homepage, seo_title, seo_description, seo_keywords } = req.body;
    await db.query(
      "UPDATE blog_posts SET title=?, image=?, excerpt=?, content=?, author=?, status=?, publish_date=IF(?='published' AND publish_date IS NULL, NOW(), publish_date), featured_homepage=?, seo_title=?, seo_description=?, seo_keywords=? WHERE slug=?",
      [title, image, excerpt, content, author, status, status, featured_homepage ? 1 : 0, seo_title || null, seo_description || null, seo_keywords || null, req.params.slug]
    );
    invalidateCaches(req);
    res.json({ message: "Post updated" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/posts/:slug", auth, checkPermission("delete_post"), async (req, res) => {
  try {
    await db.query("DELETE FROM blog_posts WHERE slug = ?", [req.params.slug]);
    invalidateCaches(req);
    res.json({ message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/upload", auth, upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  console.log("[Upload] Image uploaded:", req.file.filename);
  res.json({ url: `/uploads/${req.file.filename}` });
});

// ==================== JSON IMPORT ====================

router.post("/import-json", auth, checkPermission("import_json"), async (req, res) => {
  try {
    const posts = req.body;
    if (!Array.isArray(posts)) return res.status(400).json({ message: "Expected array of posts" });
    let imported = 0, skipped = 0;
    for (const p of posts) {
      const [dup] = await db.query("SELECT id FROM blog_posts WHERE title = ?", [p.title]);
      if (dup.length > 0) { console.log(`[Import] Duplicate blog skipped: "${p.title}"`); skipped++; continue; }
      const slug = await generateUniqueSlug(p.title);
      await db.query(
        "INSERT INTO blog_posts (title, slug, image, excerpt, content, author, status, publish_date) VALUES (?, ?, ?, ?, ?, ?, 'published', NOW())",
        [p.title, slug, p.image, p.excerpt, p.content, p.author || "Admin"]
      );
      imported++;
    }
    if (imported > 0) invalidateCaches(req);
    res.json({ message: `${imported} posts imported, ${skipped} duplicates skipped` });
  } catch (err) {
    res.status(500).json({ message: "Import failed", error: err.message });
  }
});

// ==================== USERS & ROLES ====================

router.get("/users", auth, checkPermission("manage_users"), async (req, res) => {
  try {
    const [rows] = await db.query(
      "SELECT u.id, u.email, u.name, u.is_active, r.name as role FROM admin_users u LEFT JOIN roles r ON u.role_id = r.id ORDER BY u.created_at DESC"
    );
    res.json(rows);
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

router.post("/users", auth, checkPermission("manage_users"), async (req, res) => {
  try {
    const { email, password, name, role_id } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await db.query("INSERT INTO admin_users (email, password_hash, name, role_id) VALUES (?, ?, ?, ?)", [email, hash, name, role_id]);
    res.status(201).json({ message: "User created" });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

router.get("/roles", auth, checkPermission("manage_roles"), async (req, res) => {
  try {
    const [roles] = await db.query("SELECT * FROM roles ORDER BY id");
    const [perms] = await db.query("SELECT rp.role_id, p.name FROM role_permissions rp JOIN permissions p ON rp.permission_id = p.id");
    res.json(roles.map((r) => ({ ...r, permissions: perms.filter((p) => p.role_id === r.id).map((p) => p.name) })));
  } catch (err) { res.status(500).json({ message: "Server error" }); }
});

router.post("/roles", auth, checkPermission("manage_roles"), async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const [result] = await db.query("INSERT INTO roles (name, description) VALUES (?, ?)", [name, description]);
    if (permissions && permissions.length) {
      const [allPerms] = await db.query("SELECT id, name FROM permissions WHERE name IN (?)", [permissions]);
      for (const p of allPerms) await db.query("INSERT INTO role_permissions (role_id, permission_id) VALUES (?, ?)", [result.insertId, p.id]);
    }
    res.status(201).json({ message: "Role created", id: result.insertId });
  } catch (err) { res.status(500).json({ message: "Server error", error: err.message }); }
});

module.exports = router;
