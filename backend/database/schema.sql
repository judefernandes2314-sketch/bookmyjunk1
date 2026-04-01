-- ======================================
-- BookMyJunk Blog System - MySQL Schema
-- ======================================

CREATE DATABASE IF NOT EXISTS bmj_blog;
USE bmj_blog;

-- Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  image VARCHAR(500) DEFAULT NULL,
  excerpt TEXT,
  content LONGTEXT,
  author VARCHAR(100) DEFAULT 'Admin',
  status ENUM('draft', 'published') DEFAULT 'draft',
  publish_date DATE DEFAULT NULL,
  seo_title VARCHAR(255) DEFAULT NULL,
  seo_description TEXT DEFAULT NULL,
  seo_keywords TEXT DEFAULT NULL,
  featured_homepage BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  seo_description TEXT DEFAULT NULL,
  seo_keywords TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_status (status),
  INDEX idx_publish_date (publish_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  role_id INT DEFAULT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  description VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Role-Permission mapping
CREATE TABLE IF NOT EXISTS role_permissions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  role_id INT NOT NULL,
  permission_id INT NOT NULL,
  UNIQUE KEY unique_role_perm (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Admin approval requests table
CREATE TABLE IF NOT EXISTS admin_approvals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(255) NOT NULL UNIQUE,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE,
  INDEX idx_token (token)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Foreign key for admin_users.role_id
ALTER TABLE admin_users ADD FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL;

-- Bookings table (e-waste pickup requests)
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL,
  location VARCHAR(200) NOT NULL,
  items TEXT NOT NULL,
  other_electronics VARCHAR(200) DEFAULT NULL,
  quantity VARCHAR(50) NOT NULL,
  notes TEXT DEFAULT NULL,
  status ENUM('pending', 'contacted', 'picked_up', 'cancelled') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ======================================
-- Seed data
-- ======================================

-- Default roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Full control over all features'),
  ('author', 'Can create, edit, and publish own posts'),
  ('pending_admin', 'Awaiting admin approval');

-- Default permissions
INSERT INTO permissions (name, description) VALUES
  ('create_post', 'Create new blog posts'),
  ('edit_post', 'Edit blog posts'),
  ('delete_post', 'Delete blog posts'),
  ('publish_post', 'Publish/unpublish blog posts'),
  ('manage_users', 'Add and manage admin users'),
  ('manage_roles', 'Create and assign roles'),
  ('import_json', 'Import blog posts from JSON');

-- Admin role gets all permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p WHERE r.name = 'admin';

-- Author role gets limited permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id FROM roles r, permissions p
WHERE r.name = 'author' AND p.name IN ('create_post', 'edit_post', 'delete_post', 'publish_post');

-- Default admin users (password: admin123 — change after first login!)
INSERT INTO admin_users (email, password_hash, name, role_id) VALUES
  ('epr@ecoreco.com', '$2b$10$placeholder_hash_change_me', 'EPR Admin', (SELECT id FROM roles WHERE name = 'admin')),
  ('info@ecoreco.com', '$2b$10$placeholder_hash_change_me', 'Info Admin', (SELECT id FROM roles WHERE name = 'admin'));

-- ======================================
-- Migration helper: add SEO columns to existing table
-- Run this if upgrading from previous schema:
-- ALTER TABLE blog_posts ADD COLUMN seo_title VARCHAR(255) DEFAULT NULL AFTER publish_date;
-- ALTER TABLE blog_posts ADD COLUMN seo_description TEXT DEFAULT NULL AFTER seo_title;
-- ALTER TABLE blog_posts ADD COLUMN seo_keywords TEXT DEFAULT NULL AFTER seo_description;
-- ======================================
