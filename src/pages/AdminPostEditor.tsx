import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft, Save, Eye, Upload, Loader2,
  Bold, Italic, Heading1, Heading2, Heading3, List, ListOrdered,
  Quote, Minus, Link, ImagePlus, Code, AlignLeft, Undo2, Redo2,
  Type,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { getPostBySlug, type BlogPost } from "@/lib/blog-api";

/* ── Toolbar button ── */
const TBtn = ({
  icon: Icon, label, onClick, active = false,
}: {
  icon: React.ElementType; label: string; onClick: () => void; active?: boolean;
}) => (
  <button
    type="button"
    onClick={onClick}
    title={label}
    className={`p-1.5 rounded transition-colors ${
      active
        ? "bg-primary/15 text-primary"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    <Icon className="h-4 w-4" />
  </button>
);

const Divider = () => <div className="w-px h-6 bg-border mx-1" />;

const AdminPostEditor = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = !!slug;
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [contentUploading, setContentUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const contentImageRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);
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

  /* keep form.content in sync with editor */
  const syncContent = useCallback(() => {
    if (editorRef.current) {
      setForm((f) => ({ ...f, content: editorRef.current!.innerHTML }));
    }
  }, []);

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
          if (editorRef.current) editorRef.current.innerHTML = post.content;
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

  /* ── Formatting commands ── */
  const exec = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
    syncContent();
  };

  const formatBlock = (tag: string) => {
    exec("formatBlock", tag);
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (url) exec("createLink", url);
  };

  const handleContentImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const API_BASE = import.meta.env.VITE_API_URL || "";

    let imageUrl: string;
    if (!API_BASE) {
      imageUrl = URL.createObjectURL(file);
    } else {
      setContentUploading(true);
      const fd = new FormData();
      fd.append("image", file);
      try {
        const res = await fetch(`${API_BASE}/api/admin/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
          body: fd,
        });
        const data = await res.json();
        imageUrl = data.url;
      } catch {
        setContentUploading(false);
        return;
      }
      setContentUploading(false);
    }
    if (imageUrl) {
      exec("insertHTML", `<img src="${imageUrl}" alt="Blog image" style="max-width:100%;border-radius:12px;margin:16px 0;" />`);
    }
    // reset input
    if (contentImageRef.current) contentImageRef.current.value = "";
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const API_BASE = import.meta.env.VITE_API_URL || "";
    if (!API_BASE) {
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
    // sync one last time
    if (editorRef.current) {
  setForm((f) => ({
    ...f,
    content: editorRef.current!.innerHTML
  }));
}
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

              {/* ── Rich Text Editor ── */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Content</label>
                <div className="rounded-lg border border-input overflow-hidden bg-background">
                  {/* Toolbar */}
                  <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-muted/50 border-b border-border">
                    {/* Block styles */}
                    <TBtn icon={Type} label="Paragraph" onClick={() => formatBlock("p")} />
                    <TBtn icon={Heading1} label="Heading 2" onClick={() => formatBlock("h2")} />
                    <TBtn icon={Heading2} label="Heading 3" onClick={() => formatBlock("h3")} />
                    <TBtn icon={Heading3} label="Heading 4" onClick={() => formatBlock("h4")} />
                    <Divider />
                    {/* Inline styles */}
                    <TBtn icon={Bold} label="Bold" onClick={() => exec("bold")} />
                    <TBtn icon={Italic} label="Italic" onClick={() => exec("italic")} />
                    <TBtn icon={Code} label="Inline Code" onClick={() => {
                      const sel = window.getSelection();
                      if (sel && sel.rangeCount > 0 && !sel.isCollapsed) {
                        const text = sel.toString();
                        exec("insertHTML", `<code>${text}</code>`);
                      }
                    }} />
                    <Divider />
                    {/* Lists */}
                    <TBtn icon={List} label="Bullet List" onClick={() => exec("insertUnorderedList")} />
                    <TBtn icon={ListOrdered} label="Numbered List" onClick={() => exec("insertOrderedList")} />
                    <TBtn icon={Quote} label="Blockquote" onClick={() => formatBlock("blockquote")} />
                    <TBtn icon={Minus} label="Horizontal Rule" onClick={() => exec("insertHorizontalRule")} />
                    <Divider />
                    {/* Media & Link */}
                    <TBtn icon={Link} label="Insert Link" onClick={insertLink} />
                    <input
                      ref={contentImageRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleContentImageUpload}
                    />
                    <TBtn
                      icon={contentUploading ? Loader2 : ImagePlus}
                      label="Insert Image"
                      onClick={() => contentImageRef.current?.click()}
                    />
                    <Divider />
                    {/* Undo / Redo */}
                    <TBtn icon={Undo2} label="Undo" onClick={() => exec("undo")} />
                    <TBtn icon={Redo2} label="Redo" onClick={() => exec("redo")} />
                  </div>

                  {/* Editable area */}
                  <div
                    ref={editorRef}
                    contentEditable
                    suppressContentEditableWarning
                    onInput={syncContent}
                    onBlur={syncContent}
                    className="blog-prose min-h-[320px] max-h-[600px] overflow-y-auto px-6 py-5 focus:outline-none"
                    dangerouslySetInnerHTML={{ __html: form.content }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1.5">
                  Select text and use the toolbar to format. Use the image button to insert images inline.
                </p>
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
                  <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-card transition-transform ${form.featured_homepage ? "translate-x-5" : ""}`} />
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
