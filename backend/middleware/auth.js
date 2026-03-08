const jwt = require("jsonwebtoken");
const db = require("../db");

const JWT_SECRET = process.env.JWT_SECRET || "change_me";

// Verify JWT token
const auth = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ message: "No token" });

  const token = header.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Check if user has a specific permission
const checkPermission = (permissionName) => {
  return async (req, res, next) => {
    try {
      const [rows] = await db.query(
        `SELECT p.name FROM admin_users u
         JOIN roles r ON u.role_id = r.id
         JOIN role_permissions rp ON r.id = rp.role_id
         JOIN permissions p ON rp.permission_id = p.id
         WHERE u.id = ? AND p.name = ?`,
        [req.user.id, permissionName]
      );
      if (rows.length === 0) return res.status(403).json({ message: "Permission denied" });
      next();
    } catch {
      res.status(500).json({ message: "Permission check failed" });
    }
  };
};

module.exports = { auth, checkPermission };
