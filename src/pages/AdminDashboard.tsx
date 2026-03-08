import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Plus, Edit, Trash2, Eye, EyeOff, LogOut, FileText, Users, Shield } from "lucide-react";
import Navbar from "@/components/Navbar";
import { getAllPosts, type BlogPost } from "@/lib/blog-api";

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"posts" | "users" | "roles">("posts");
  const navigate = useNavigate();
  const role = localStorage.getItem("admin_role") || "author";

  useEffect(() => {
    if (!localStorage.getItem("admin_token")) {
      navigate("/admin");
      return;
    }
    getAllPosts().then((p) => {
      setPosts(p);
      setLoading(false);
    });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("admin_role");
    navigate("/admin");
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this post?")) return;
    const API_BASE = import.meta.env.VITE_API_URL || "";
    if (API_BASE) {
      await fetch(`${API_BASE}/api/admin/posts/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
    }
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  };

  const tabs = [
    { id: "posts" as const, label: "Posts", icon: FileText },
    ...(role === "admin" ? [
      { id: "users" as const, label: "Users", icon: Users },
      { id: "roles" as const, label: "Roles", icon: Shield },
    ] : []),
  ];

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-24 bg-background min-h-screen">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground">CMS Dashboard</h1>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium capitalize">{role}</span>
              <button onClick={handleLogout} className="text-muted-foreground hover:text-foreground transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-muted rounded-lg p-1 mb-8 w-fit">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <t.icon className="h-4 w-4" /> {t.label}
              </button>
            ))}
          </div>

          {tab === "posts" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-foreground">Blog Posts ({posts.length})</h2>
                <Link
                  to="/admin/posts/new"
                  className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  <Plus className="h-4 w-4" /> New Post
                </Link>
              </div>

              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
                  ))}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No posts yet. Create your first one!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div
                      key={post.slug}
                      className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
                    >
                      <img src={post.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">{post.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {post.author} · {post.publish_date ? new Date(post.publish_date).toLocaleDateString("en-IN") : "Draft"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          post.status === "published" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                        }`}>
                          {post.status === "published" ? <Eye className="h-3 w-3 inline mr-1" /> : <EyeOff className="h-3 w-3 inline mr-1" />}
                          {post.status || "draft"}
                        </span>
                        <Link to={`/admin/posts/edit/${post.slug}`} className="p-1.5 hover:bg-muted rounded-lg transition-colors">
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <button onClick={() => handleDelete(post.slug)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {tab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <h3 className="font-semibold text-foreground mb-1">User Management</h3>
              <p className="text-sm text-muted-foreground">
                Connect the Node.js backend to manage users. Approved admins: epr@ecoreco.com, info@ecoreco.com
              </p>
            </motion.div>
          )}

          {tab === "roles" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl p-8 text-center">
              <Shield className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <h3 className="font-semibold text-foreground mb-1">Roles & Permissions</h3>
              <p className="text-sm text-muted-foreground">
                Connect the Node.js backend to create roles and assign permissions.
              </p>
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
