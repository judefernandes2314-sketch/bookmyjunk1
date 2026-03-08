import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus, Edit, Trash2, Eye, EyeOff, LogOut, FileText, Users, Shield, Star,
  BarChart3, TrendingUp, FileCheck, FilePen,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { getAllPosts, type BlogPost, type AnalyticsSummary, type AnalyticsPost } from "@/lib/blog-api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

const API_BASE = import.meta.env.VITE_API_URL || "";

const statCards = [
  { key: "total_posts" as const, label: "Total Posts", icon: FileText, color: "text-primary" },
  { key: "published_posts" as const, label: "Published", icon: FileCheck, color: "text-emerald-500" },
  { key: "draft_posts" as const, label: "Drafts", icon: FilePen, color: "text-amber-500" },
  { key: "total_views" as const, label: "Total Views", icon: Eye, color: "text-sky-500" },
];

const chartColors = ["hsl(142, 76%, 36%)", "hsl(142, 70%, 42%)", "hsl(142, 64%, 48%)", "hsl(142, 58%, 54%)", "hsl(142, 52%, 60%)"];

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"posts" | "analytics" | "users" | "roles">("posts");
  const navigate = useNavigate();
  const role = localStorage.getItem("admin_role") || "author";

  // Analytics state
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topPosts, setTopPosts] = useState<AnalyticsPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<AnalyticsPost[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

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

  useEffect(() => {
    if (tab === "analytics") loadAnalytics();
  }, [tab]);

  const authHeaders = () => ({
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
  });

  const loadAnalytics = async () => {
    if (!API_BASE) {
      // Fallback: compute from local posts
      const published = posts.filter((p) => p.status === "published");
      setSummary({
        total_posts: posts.length,
        published_posts: published.length,
        draft_posts: posts.length - published.length,
        total_views: posts.reduce((s, p) => s + (p.views || 0), 0),
      });
      const sorted = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));
      setTopPosts(sorted.slice(0, 10).map((p) => ({ title: p.title, slug: p.slug, views: p.views || 0, publish_date: p.publish_date || "" })));
      setRecentPosts(
        [...posts].sort((a, b) => new Date(b.publish_date || "").getTime() - new Date(a.publish_date || "").getTime())
          .slice(0, 5).map((p) => ({ title: p.title, slug: p.slug, views: p.views || 0, publish_date: p.publish_date || "" }))
      );
      return;
    }
    setAnalyticsLoading(true);
    try {
      const [sumRes, topRes, recentRes] = await Promise.all([
        fetch(`${API_BASE}/api/admin/analytics/summary`, { headers: authHeaders() }),
        fetch(`${API_BASE}/api/admin/analytics/top-posts`, { headers: authHeaders() }),
        fetch(`${API_BASE}/api/admin/analytics/recent-posts`, { headers: authHeaders() }),
      ]);
      if (sumRes.ok) setSummary(await sumRes.json());
      if (topRes.ok) setTopPosts(await topRes.json());
      if (recentRes.ok) setRecentPosts(await recentRes.json());
    } catch { /* silent */ }
    setAnalyticsLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("admin_role");
    navigate("/admin");
  };

  const handleDelete = async (slug: string) => {
    if (!confirm("Delete this post?")) return;
    if (API_BASE) {
      await fetch(`${API_BASE}/api/admin/posts/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
    }
    setPosts((prev) => prev.filter((p) => p.slug !== slug));
  };

  const toggleFeatured = async (post: BlogPost) => {
    const newVal = !post.featured_homepage;
    if (API_BASE) {
      await fetch(`${API_BASE}/api/admin/posts/${post.slug}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ ...post, featured_homepage: newVal }),
      });
    }
    setPosts((prev) => prev.map((p) => p.slug === post.slug ? { ...p, featured_homepage: newVal } : p));
  };

  const tabs = [
    { id: "posts" as const, label: "Posts", icon: FileText },
    { id: "analytics" as const, label: "Analytics", icon: BarChart3 },
    ...(role === "admin" ? [
      { id: "users" as const, label: "Users", icon: Users },
      { id: "roles" as const, label: "Roles", icon: Shield },
    ] : []),
  ];

  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

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

          {/* ==================== POSTS TAB ==================== */}
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
                  {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />)}
                </div>
              ) : posts.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No posts yet. Create your first one!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {posts.map((post) => (
                    <div key={post.slug} className="flex items-center gap-4 bg-card border border-border rounded-xl p-4 hover:shadow-sm transition-shadow">
                      <img src={post.image} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm truncate">{post.title}</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {post.author} · {post.publish_date ? new Date(post.publish_date).toLocaleDateString("en-IN") : "Draft"}
                          {post.views !== undefined && <span className="ml-2">· {post.views} views</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleFeatured(post)}
                          title={post.featured_homepage ? "Remove from homepage" : "Feature on homepage"}
                          className={`p-1.5 rounded-lg transition-colors ${post.featured_homepage ? "text-amber-500 bg-amber-500/10" : "text-muted-foreground/40 hover:text-amber-500 hover:bg-muted"}`}
                        >
                          <Star className={`h-4 w-4 ${post.featured_homepage ? "fill-current" : ""}`} />
                        </button>
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

          {/* ==================== ANALYTICS TAB ==================== */}
          {tab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((card) => (
                  <div key={card.key} className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <card.icon className={`h-4 w-4 ${card.color}`} />
                      <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
                    </div>
                    <p className="text-2xl font-bold text-foreground">
                      {analyticsLoading ? "—" : (summary?.[card.key] ?? 0).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>

              {/* Top Posts Chart */}
              {topPosts.length > 0 && (
                <div className="bg-card border border-border rounded-xl p-6">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-primary" /> Top 5 Posts by Views
                  </h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topPosts.slice(0, 5)} layout="vertical" margin={{ left: 0, right: 20 }}>
                        <XAxis type="number" tick={{ fontSize: 12 }} />
                        <YAxis
                          dataKey="title"
                          type="category"
                          width={180}
                          tick={{ fontSize: 11 }}
                          tickFormatter={(v: string) => v.length > 28 ? v.slice(0, 28) + "…" : v}
                        />
                        <Tooltip
                          contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }}
                          labelStyle={{ fontWeight: 600 }}
                        />
                        <Bar dataKey="views" radius={[0, 6, 6, 0]}>
                          {topPosts.slice(0, 5).map((_, i) => (
                            <Cell key={i} fill={chartColors[i % chartColors.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Top 10 Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Top 10 Most Viewed Posts</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-6 py-3 font-medium text-muted-foreground">#</th>
                        <th className="text-left px-6 py-3 font-medium text-muted-foreground">Title</th>
                        <th className="text-right px-6 py-3 font-medium text-muted-foreground">Views</th>
                        <th className="text-right px-6 py-3 font-medium text-muted-foreground">Published</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPosts.map((p, i) => (
                        <tr key={p.slug} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-3 text-muted-foreground">{i + 1}</td>
                          <td className="px-6 py-3 text-foreground font-medium">{p.title}</td>
                          <td className="px-6 py-3 text-right font-semibold text-foreground">{p.views.toLocaleString()}</td>
                          <td className="px-6 py-3 text-right text-muted-foreground">{fmtDate(p.publish_date)}</td>
                        </tr>
                      ))}
                      {topPosts.length === 0 && (
                        <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">No data yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recent Posts */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h3 className="font-semibold text-foreground">Recent Post Performance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-6 py-3 font-medium text-muted-foreground">Title</th>
                        <th className="text-right px-6 py-3 font-medium text-muted-foreground">Views</th>
                        <th className="text-right px-6 py-3 font-medium text-muted-foreground">Published</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentPosts.map((p) => (
                        <tr key={p.slug} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-3 text-foreground font-medium">{p.title}</td>
                          <td className="px-6 py-3 text-right font-semibold text-foreground">{p.views.toLocaleString()}</td>
                          <td className="px-6 py-3 text-right text-muted-foreground">{fmtDate(p.publish_date)}</td>
                        </tr>
                      ))}
                      {recentPosts.length === 0 && (
                        <tr><td colSpan={3} className="px-6 py-8 text-center text-muted-foreground">No data yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== USERS TAB ==================== */}
          {tab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-30" />
              <h3 className="font-semibold text-foreground mb-1">User Management</h3>
              <p className="text-sm text-muted-foreground">
                Connect the Node.js backend to manage users. Approved admins: epr@ecoreco.com, info@ecoreco.com
              </p>
            </motion.div>
          )}

          {/* ==================== ROLES TAB ==================== */}
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
