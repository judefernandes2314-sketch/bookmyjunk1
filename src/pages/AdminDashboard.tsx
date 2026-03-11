import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus, Edit, Trash2, Eye, EyeOff, LogOut, FileText, Users, Shield, Star,
  BarChart3, TrendingUp, FileCheck, FilePen,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { getAllAdminPosts, resolveImageUrl, isTokenValid, clearAuth, type BlogPost, type AnalyticsSummary, type AnalyticsPost } from "@/lib/blog-api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.jambologos.com";

const statCards = [
  { key: "total_posts" as const, label: "Total Posts", icon: FileText, color: "text-primary" },
  { key: "published_posts" as const, label: "Published", icon: FileCheck, color: "text-emerald-500" },
  { key: "draft_posts" as const, label: "Drafts", icon: FilePen, color: "text-amber-500" },
  { key: "total_views" as const, label: "Total Views", icon: Eye, color: "text-sky-500" },
];

const chartColors = ["hsl(142, 76%, 36%)", "hsl(142, 70%, 42%)", "hsl(142, 64%, 48%)", "hsl(142, 58%, 54%)", "hsl(142, 52%, 60%)"];

type PostFilter = "all" | "published" | "draft";

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"posts" | "analytics" | "users" | "roles">("posts");
  const [postFilter, setPostFilter] = useState<PostFilter>("all");
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const role = localStorage.getItem("admin_role") || "author";

  // Analytics state
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topPosts, setTopPosts] = useState<AnalyticsPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<AnalyticsPost[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  useEffect(() => {
    if (!isTokenValid()) {
      clearAuth();
      navigate("/admin", { replace: true });
      return;
    }
    getAllAdminPosts()
      .then((p) => {
        setPosts(p);
        setLoading(false);
      })
      .catch((err) => {
        if (err?.message === "unauthorized") {
          clearAuth();
          navigate("/admin", { replace: true, state: { message: "Session expired, please log in again" } });
        }
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
    const published = posts.filter((p) => p.status === "published");
    if (!API_BASE || API_BASE === "") {
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
    clearAuth();
    toast({ title: "Logged out", description: "You have been logged out successfully." });
    navigate("/admin", { replace: true });
  };

  const handleDelete = async () => {
    if (!deleteSlug) return;
    try {
      await fetch(`${API_BASE}/api/admin/posts/${deleteSlug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      setPosts((prev) => prev.filter((p) => p.slug !== deleteSlug));
      toast({ title: "Post deleted", description: "The post has been permanently deleted." });
    } catch {
      toast({ title: "Error", description: "Failed to delete post.", variant: "destructive" });
    }
    setDeleteSlug(null);
  };

  const toggleFeatured = async (post: BlogPost) => {
    const newVal = !post.featured_homepage;
    await fetch(`${API_BASE}/api/admin/posts/${post.slug}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify({ ...post, featured_homepage: newVal }),
    });
    setPosts((prev) => prev.map((p) => p.slug === post.slug ? { ...p, featured_homepage: newVal } : p));
  };

  const filteredPosts = posts.filter((p) => {
    if (postFilter === "published") return p.status === "published";
    if (postFilter === "draft") return p.status !== "published";
    return true;
  });

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
          {/* Header with logout */}
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-display font-bold text-foreground">CMS Dashboard</h1>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium capitalize">{role}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="font-semibold text-foreground">Blog Posts ({filteredPosts.length})</h2>
                  {/* Post filter tabs */}
                  <div className="flex gap-1 bg-muted rounded-md p-0.5">
                    {(["all", "published", "draft"] as PostFilter[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setPostFilter(f)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors capitalize ${
                          postFilter === f ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
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
              ) : filteredPosts.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>No {postFilter !== "all" ? postFilter : ""} posts found.</p>
                </div>
              ) : (
                /* Post list table */
                <div className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Post</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Author</th>
                          <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Date</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Views</th>
                          <th className="text-center px-4 py-3 font-medium text-muted-foreground w-10">★</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredPosts.map((post) => (
                          <tr key={post.slug} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <img
                                  src={resolveImageUrl(post.image)}
                                  alt=""
                                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                                  onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                                />
                                <span className="font-medium text-foreground truncate max-w-[200px]">{post.title}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{post.author}</td>
                            <td className="px-4 py-3 text-center">
                              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                                post.status === "published"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : "bg-muted text-muted-foreground"
                              }`}>
                                {post.status === "published" ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                                {post.status === "published" ? "Published" : "Draft"}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-xs hidden md:table-cell">
                              {post.status === "published" && post.publish_date
                                ? fmtDate(post.publish_date)
                                : "Not published"}
                            </td>
                            <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">
                              {post.views ?? 0}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => toggleFeatured(post)}
                                title={post.featured_homepage ? "Remove from homepage" : "Feature on homepage"}
                                className={`p-1 rounded transition-colors ${post.featured_homepage ? "text-amber-500" : "text-muted-foreground/30 hover:text-amber-500"}`}
                              >
                                <Star className={`h-4 w-4 ${post.featured_homepage ? "fill-current" : ""}`} />
                              </button>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Link to={`/admin/posts/edit/${post.slug}`} className="p-1.5 hover:bg-muted rounded-lg transition-colors" title="Edit">
                                  <Edit className="h-4 w-4 text-muted-foreground" />
                                </Link>
                                <button onClick={() => setDeleteSlug(post.slug)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors" title="Delete">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== ANALYTICS TAB ==================== */}
          {tab === "analytics" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
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

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteSlug} onOpenChange={(open) => !open && setDeleteSlug(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The post will be permanently removed from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AdminDashboard;
