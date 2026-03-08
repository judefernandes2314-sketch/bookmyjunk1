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
    featured_homepage: false,
    seo_title: "",
    seo_description: "",
    seo_keywords: "",
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
            featured_homepage: !!post.featured_homepage,
            seo_title: post.seo_title || "",
            seo_description: post.seo_description || "",
            seo_keywords: post.seo_keywords || "",
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const API_BASE = import.meta.env.VITE_API_URL || "";
    if (!API_BASE) {
      // No backend — use object URL as preview
      setForm((f) => ({ ...f, image: URL.createObjectURL(file) }));
      return;
    }
    setUploading(true);
    const fd = new FormData();
    fd.append("image", file);
    try {
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
        body: fd,
      });
      const data = await res.json();
      if (data.url) setForm((f) => ({ ...f, image: data.url }));
    } catch (err) {
      console.error("Upload failed", err);
    }
    setUploading(false);
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
                <label className="block text-sm font-medium text-foreground mb-1.5">Featured Image</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={form.image}
                    onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                    className="flex-1 px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="/uploads/image.jpg or URL"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="inline-flex items-center gap-1.5 border border-border px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                    {uploading ? "Uploading…" : "Upload"}
                  </button>
                </div>
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

              {/* Featured on Homepage */}
              <div className="flex items-center gap-3 py-2">
                <button
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, featured_homepage: !f.featured_homepage }))}
                  className={`relative w-10 h-5 rounded-full transition-colors ${form.featured_homepage ? "bg-primary" : "bg-muted-foreground/30"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.featured_homepage ? "translate-x-5" : ""}`} />
                </button>
                <label className="text-sm font-medium text-foreground">Feature on Homepage</label>
              </div>

              {/* SEO Section */}
              <div className="border-t border-border pt-5 mt-2">
                <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">SEO Settings <span className="text-muted-foreground font-normal normal-case tracking-normal">(optional — auto-generated if empty)</span></h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">SEO Title</label>
                    <input
                      type="text"
                      value={form.seo_title}
                      onChange={(e) => setForm((f) => ({ ...f, seo_title: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder={form.title || "Auto-generated from title"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">SEO Description</label>
                    <textarea
                      value={form.seo_description}
                      onChange={(e) => setForm((f) => ({ ...f, seo_description: e.target.value }))}
                      rows={2}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                      placeholder={form.excerpt || "Auto-generated from excerpt"}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1.5">SEO Keywords</label>
                    <input
                      type="text"
                      value={form.seo_keywords}
                      onChange={(e) => setForm((f) => ({ ...f, seo_keywords: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="e-waste, recycling, electronic waste disposal"
                    />
                  </div>
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
