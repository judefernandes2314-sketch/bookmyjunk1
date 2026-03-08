import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Save, Eye, Upload, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getPostBySlug, type BlogPost } from "@/lib/blog-api";

const AdminPostEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = !!slug;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    image: "",
    excerpt: "",
    content: "",
    author: localStorage.getItem("admin_email") || "Admin",
    status: "draft",
  });

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/admin");
      return;
    }
    if (isEdit && slug) {
      getPostBySlug(slug).then((post) => {
        if (post) {
          setForm({
            title: post.title,
            slug: post.slug,
            image: post.image,
            excerpt: post.excerpt,
            content: post.content,
            author: post.author,
            status: post.status || "draft",
          });
        }
      });
    }
  }, [slug, isEdit, navigate]);

  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleTitleChange = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: isEdit ? prev.slug : generateSlug(title),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    const API_BASE = import.meta.env.VITE_API_URL || "";
    if (API_BASE) {
      const url = isEdit ? `${API_BASE}/api/admin/posts/${slug}` : `${API_BASE}/api/admin/posts`;
      await fetch(url, {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
        },
        body: JSON.stringify(form),
      });
    }
    setSaving(false);
    navigate("/admin/dashboard");
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground text-sm transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setForm((f) => ({ ...f, status: f.status === "published" ? "draft" : "published" }))}
                  className="inline-flex items-center gap-1.5 border border-border px-3 py-2 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  {form.status === "published" ? "Unpublish" : "Publish"}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !form.title}
                  className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {saving ? "Saving…" : "Save"}
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Post title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Slug</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="post-url-slug"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Featured Image URL</label>
                <input
                  type="text"
                  value={form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="/images/blog/post.jpg"
                />
                {form.image && (
                  <img src={form.image} alt="Preview" className="mt-2 h-32 rounded-lg object-cover" />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Excerpt</label>
                <textarea
                  value={form.excerpt}
                  onChange={(e) => setForm((f) => ({ ...f, excerpt: e.target.value }))}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Short description"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Content (HTML)</label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  rows={12}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                  placeholder="<h2>Section Title</h2><p>Your content here...</p>"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Author</label>
                  <input
                    type="text"
                    value={form.author}
                    onChange={(e) => setForm((f) => ({ ...f, author: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default AdminPostEditor;
