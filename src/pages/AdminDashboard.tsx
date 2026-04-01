import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Plus, Edit, Trash2, Eye, EyeOff, LogOut, FileText, Users, Shield, Star,
  BarChart3, TrendingUp, FileCheck, FilePen, Calendar, Layout,
} from "lucide-react";
import { fetchAdminPosts, resolveImageUrl, isTokenValid, clearAuth, type BlogPost, type AnalyticsSummary, type AnalyticsPost } from "@/lib/blog-api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useToast } from "@/hooks/use-toast";
import HomepageCMS from "@/components/admin/HomepageCMS";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ToggleLeft, ToggleRight } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const API_BASE = import.meta.env.VITE_API_URL || "https://api.jambologos.com";

const statCards = [
  { key: "total_posts" as const, label: "Total Posts", icon: FileText, color: "text-primary" },
  { key: "published_posts" as const, label: "Published", icon: FileCheck, color: "text-emerald-500" },
  { key: "draft_posts" as const, label: "Drafts", icon: FilePen, color: "text-amber-500" },
  { key: "total_views" as const, label: "Total Views", icon: Eye, color: "text-sky-500" },
];

const chartColors = ["hsl(142, 76%, 36%)", "hsl(142, 70%, 42%)", "hsl(142, 64%, 48%)", "hsl(142, 58%, 54%)", "hsl(142, 52%, 60%)"];

type PostFilter = "all" | "published" | "draft";
type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

const AdminDashboard = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"posts" | "analytics" | "bookings" | "homepage_cms" | "users" | "roles">("posts");
  const [postFilter, setPostFilter] = useState<PostFilter>("all");
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const role = localStorage.getItem("admin_role") || "author";
  const rawPerms = (localStorage.getItem("admin_permissions") || "")
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  const permSet = new Set(rawPerms);
  const isAdmin = role === "admin";
  const canEditHomepage = isAdmin || role === "webeditor" || permSet.has("edit_homepage");
  const canViewBookings = isAdmin || permSet.has("view_bookings") || permSet.has("manage_bookings");
  const canManageBookings = isAdmin || permSet.has("manage_bookings");

  // Analytics state
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [topPosts, setTopPosts] = useState<AnalyticsPost[]>([]);
  const [recentPosts, setRecentPosts] = useState<AnalyticsPost[]>([]);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);

  // Users + Roles state
  type AdminUser = { id: number; name: string; email: string; is_active: 0 | 1 | boolean; role?: string; role_id?: number };
  type Role = { id: number; name: string; description?: string | null; permissions?: string[] };
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [rolesLoading, setRolesLoading] = useState(false);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [rolesError, setRolesError] = useState<string | null>(null);

  // Users modals + actions
  const [newUserOpen, setNewUserOpen] = useState(false);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [activeToggleLoadingId, setActiveToggleLoadingId] = useState<number | null>(null);
  const [deleteUserId, setDeleteUserId] = useState<number | null>(null);
  const [editUserLoading, setEditUserLoading] = useState(false);
  const [newUserLoading, setNewUserLoading] = useState(false);
  const [userToEdit, setUserToEdit] = useState<AdminUser | null>(null);
  const [newUserForm, setNewUserForm] = useState({ name: "", email: "", password: "", role_id: "" as string | number });
  const [editUserRoleId, setEditUserRoleId] = useState<string | number>("");

  // Roles modals + actions
  const [newRoleOpen, setNewRoleOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [viewRoleOpen, setViewRoleOpen] = useState(false);
  const [newRoleLoading, setNewRoleLoading] = useState(false);
  const [editRoleLoading, setEditRoleLoading] = useState(false);
  const [roleUsersLoading, setRoleUsersLoading] = useState(false);
  const [roleUsersError, setRoleUsersError] = useState<string | null>(null);
  const [roleUsers, setRoleUsers] = useState<AdminUser[]>([]);
  const [roleToEdit, setRoleToEdit] = useState<Role | null>(null);
  const [roleToView, setRoleToView] = useState<Role | null>(null);
  const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);
  const [newRoleForm, setNewRoleForm] = useState({ name: "", description: "", permissions: [] as string[] });
  const [editRoleForm, setEditRoleForm] = useState({ id: 0, name: "", description: "", permissions: [] as string[] });

  const PERMISSIONS = ["create_post", "edit_post", "delete_post", "publish_post", "import_json", "manage_users", "manage_roles", "edit_homepage", "view_bookings", "manage_bookings"] as const;

  // Bookings state
  type Booking = {
    id: number;
    name: string;
    email?: string | null;
    phone?: string | null;
    inquiry_type?: string | null;
    inquiry_other?: string | null;
    address?: string | null;
    city?: string | null;
    pincode?: string | null;
    items?: string | null;
    categories?: string | null;
    other_electronics?: string | null;
    quantity?: string | null;
    message?: string | null;
    remarks?: string | null;
    status: BookingStatus;
    created_at: string;
  };
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingsLoading, setBookingsLoading] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);
  const [bookingStatusFilter, setBookingStatusFilter] = useState<"all" | BookingStatus>("all");
  const [bookingSearch, setBookingSearch] = useState("");
  const [viewBooking, setViewBooking] = useState<Booking | null>(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState<number | null>(null);
  const [deleteBookingId, setDeleteBookingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isTokenValid()) {
      clearAuth();
      navigate("/admin", { replace: true });
      return;
    }
    fetchAdminPosts()
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
    if (tab === "bookings") loadBookings();
    if (tab === "users") loadUsers();
    if (tab === "roles") loadRoles();
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

  const loadUsers = async () => {
    if (usersLoading) return;
    setUsersError(null);
    setUsersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch users (${res.status})`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setUsersError(e instanceof Error ? e.message : "Failed to fetch users.");
    } finally {
      setUsersLoading(false);
    }
  };

  const loadRoles = async () => {
    if (rolesLoading) return;
    setRolesError(null);
    setRolesLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/roles`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch roles (${res.status})`);
      const data = await res.json();
      setRoles(Array.isArray(data) ? data : []);
    } catch (e) {
      setRolesError(e instanceof Error ? e.message : "Failed to fetch roles.");
    } finally {
      setRolesLoading(false);
    }
  };

  const loadBookings = async () => {
    if (!canViewBookings) return;
    if (bookingsLoading) return;
    setBookingsError(null);
    setBookingsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch bookings (${res.status})`);
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      setBookingsError(e instanceof Error ? e.message : "Failed to fetch bookings.");
    } finally {
      setBookingsLoading(false);
    }
  };

  const updateBookingStatus = async (b: Booking, status: BookingStatus) => {
    if (!canManageBookings) return;
    setStatusUpdatingId(b.id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/bookings/${b.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to update status (${res.status})`);
      toast({ title: "Status updated", description: `Booking is now ${status}.` });
      await loadBookings();
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to update booking status.",
        variant: "destructive",
      });
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const confirmDeleteBooking = async () => {
    if (!canManageBookings || !deleteBookingId) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/bookings/${deleteBookingId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to delete booking (${res.status})`);
      toast({ title: "Booking deleted", description: "Booking has been removed." });
      await loadBookings();
    } catch (e) {
      toast({
        title: "Error",
        description: e instanceof Error ? e.message : "Failed to delete booking.",
        variant: "destructive",
      });
    } finally {
      setDeleteBookingId(null);
    }
  };

  const openEditUser = (u: AdminUser) => {
    setUserToEdit(u);
    const matched = roles.find((r) => r.name === u.role);
    setEditUserRoleId(matched?.id ?? "");
    setEditUserOpen(true);
  };

  const submitNewUser = async () => {
    if (!newUserForm.name.trim() || !newUserForm.email.trim() || !newUserForm.password.trim() || !newUserForm.role_id) {
      toast({ title: "Missing fields", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }
    setNewUserLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newUserForm.name.trim(),
          email: newUserForm.email.trim(),
          password: newUserForm.password,
          role_id: Number(newUserForm.role_id),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to create user (${res.status})`);
      toast({ title: "User created", description: "New user has been added successfully." });
      setNewUserOpen(false);
      setNewUserForm({ name: "", email: "", password: "", role_id: "" });
      await loadUsers();
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to create user.", variant: "destructive" });
    } finally {
      setNewUserLoading(false);
    }
  };

  const submitEditUserRole = async () => {
    if (!userToEdit || !editUserRoleId) return;
    setEditUserLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userToEdit.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role_id: Number(editUserRoleId) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to update user (${res.status})`);
      toast({ title: "User updated", description: "User role updated successfully." });
      setEditUserOpen(false);
      setUserToEdit(null);
      await loadUsers();
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to update user.", variant: "destructive" });
    } finally {
      setEditUserLoading(false);
    }
  };

  const toggleUserActive = async (u: AdminUser) => {
    setActiveToggleLoadingId(u.id);
    try {
      const isActiveNow =
        u.is_active === 1 ||
        u.is_active === true ||
        u.is_active === "1" ||
        u.is_active === "true";
      const nextActive = !isActiveNow;
      const res = await fetch(`${API_BASE}/api/admin/users/${u.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ is_active: nextActive ? 1 : 0 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to update status (${res.status})`);
      toast({ title: "User updated", description: `User is now ${nextActive ? "active" : "inactive"}.` });
      await loadUsers();
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to update status.", variant: "destructive" });
    } finally {
      setActiveToggleLoadingId(null);
    }
  };

  const confirmDeleteUser = async () => {
    if (!deleteUserId) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${deleteUserId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to delete user (${res.status})`);
      toast({ title: "User deleted", description: "The user has been removed." });
      await loadUsers();
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to delete user.", variant: "destructive" });
    } finally {
      setDeleteUserId(null);
    }
  };

  const submitNewRole = async () => {
    if (!newRoleForm.name.trim()) {
      toast({ title: "Missing fields", description: "Role name is required.", variant: "destructive" });
      return;
    }
    setNewRoleLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/roles`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newRoleForm.name.trim(),
          description: newRoleForm.description?.trim() || "",
          permissions: newRoleForm.permissions,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to create role (${res.status})`);
      toast({ title: "Role created", description: "New role has been created successfully." });
      setNewRoleOpen(false);
      setNewRoleForm({ name: "", description: "", permissions: [] });
      await loadRoles();
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to create role.", variant: "destructive" });
    } finally {
      setNewRoleLoading(false);
    }
  };

  const openEditRole = (r: Role) => {
    setRoleToEdit(r);
    setEditRoleForm({
      id: r.id,
      name: r.name,
      description: (r.description || "") as string,
      permissions: Array.isArray(r.permissions) ? r.permissions : [],
    });
    setEditRoleOpen(true);
  };

  const submitEditRole = async () => {
    if (!editRoleForm.name.trim()) {
      toast({ title: "Missing fields", description: "Role name is required.", variant: "destructive" });
      return;
    }
    setEditRoleLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/roles/${editRoleForm.id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: editRoleForm.name.trim(),
          description: editRoleForm.description?.trim() || "",
          permissions: editRoleForm.permissions,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to update role (${res.status})`);
      toast({ title: "Role updated", description: "Role updated successfully." });
      setEditRoleOpen(false);
      setRoleToEdit(null);
      await loadRoles();
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to update role.", variant: "destructive" });
    } finally {
      setEditRoleLoading(false);
    }
  };

  const confirmDeleteRole = async () => {
    if (!deleteRoleId) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/roles/${deleteRoleId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || `Failed to delete role (${res.status})`);
      toast({ title: "Role deleted", description: "The role has been removed." });
      await loadRoles();
    } catch (e) {
      toast({ title: "Error", description: e instanceof Error ? e.message : "Failed to delete role.", variant: "destructive" });
    } finally {
      setDeleteRoleId(null);
    }
  };

  const openViewRoleUsers = async (r: Role) => {
    setRoleToView(r);
    setRoleUsers([]);
    setRoleUsersError(null);
    setViewRoleOpen(true);
    setRoleUsersLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/roles/${r.id}/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("admin_token")}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch role users (${res.status})`);
      const data = await res.json();
      setRoleUsers(Array.isArray(data) ? data : []);
    } catch (e) {
      setRoleUsersError(e instanceof Error ? e.message : "Failed to fetch role users.");
    } finally {
      setRoleUsersLoading(false);
    }
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
    ...(canViewBookings ? [{ id: "bookings" as const, label: "Bookings", icon: Calendar }] : []),
    ...(role === "admin"
      ? [
          ...(canEditHomepage ? [{ id: "homepage_cms" as const, label: "Homepage CMS", icon: Layout }] : []),
          { id: "users" as const, label: "Users", icon: Users },
          { id: "roles" as const, label: "Roles", icon: Shield },
        ]
      : []),
  ];

  const fmtDate = (d: string) => d ? new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex w-72 flex-col border-r border-gray-100 bg-white">
            <div className="p-6 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-800">BookMyJunk Admin</p>
              <p className="text-xs text-gray-500 mt-1 capitalize">{role}</p>
            </div>
            <nav className="p-4 space-y-1">
              {tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    tab === t.id
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                  }`}
                >
                  <t.icon className="h-5 w-5" />
                  {t.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main column */}
          <div className="flex-1 min-w-0">
            {/* Top header */}
            <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
              <div className="flex items-center justify-between px-4 lg:px-6 py-4">
                <div className="flex items-center gap-3">
                  <Sheet>
                    <SheetTrigger asChild>
                      <button
                        type="button"
                        className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition"
                        aria-label="Open menu"
                      >
                        <Layout className="h-5 w-5 text-gray-700" />
                      </button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0">
                      <div className="p-6 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-800">BookMyJunk Admin</p>
                        <p className="text-xs text-gray-500 mt-1 capitalize">{role}</p>
                      </div>
                      <nav className="p-4 space-y-1">
                        {tabs.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setTab(t.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                              tab === t.id
                                ? "bg-primary/10 text-primary"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-800"
                            }`}
                          >
                            <t.icon className="h-5 w-5" />
                            {t.label}
                          </button>
                        ))}
                      </nav>
                    </SheetContent>
                  </Sheet>

                  <h1 className="text-lg lg:text-xl font-semibold text-gray-800">
                    {tabs.find((x) => x.id === tab)?.label || "Dashboard"}
                  </h1>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-sm">
                      {(localStorage.getItem("admin_email") || "A").slice(0, 1).toUpperCase()}
                    </div>
                    <div className="leading-tight">
                      <p className="text-sm font-medium text-gray-800 truncate max-w-[220px]">
                        {localStorage.getItem("admin_email") || "Admin"}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-lg font-medium transition text-sm"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </header>

            <main className="p-4 lg:p-6">
              <div className="max-w-6xl mx-auto">

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
                                  src={resolveImageUrl(post.image) || "/placeholder.svg"}
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

          {/* ==================== BOOKINGS TAB ==================== */}
          {tab === "bookings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Summary cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: "total", label: "Total", color: "text-foreground" },
                  { key: "pending", label: "Pending", color: "text-amber-500" },
                  { key: "confirmed", label: "Confirmed", color: "text-emerald-500" },
                  { key: "completed", label: "Completed", color: "text-sky-500" },
                ].map((card) => {
                  const total = bookings.length;
                  const pending = bookings.filter((b) => b.status === "pending").length;
                  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
                  const completed = bookings.filter((b) => b.status === "completed").length;
                  const value =
                    card.key === "total"
                      ? total
                      : card.key === "pending"
                        ? pending
                        : card.key === "confirmed"
                          ? confirmed
                          : completed;
                  return (
                    <div
                      key={card.key}
                      className="bg-card border border-border rounded-xl p-4 flex flex-col gap-1"
                    >
                      <span className="text-xs text-muted-foreground font-medium">
                        {card.label}
                      </span>
                      <span className={`text-xl font-bold ${card.color}`}>
                        {value.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <div className="flex gap-2 bg-muted rounded-md p-0.5">
                  {["all", "pending", "confirmed", "completed", "cancelled"].map((s) => (
                    <button
                      key={s}
                      onClick={() => setBookingStatusFilter(s as typeof bookingStatusFilter)}
                      className={`px-3 py-1 rounded text-xs font-medium capitalize ${
                        bookingStatusFilter === s
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <input
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full sm:w-64 px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Search by name, phone, city, pincode"
                />
              </div>

              {/* Table */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {bookingsLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : bookingsError ? (
                  <div className="p-6 text-sm text-destructive">{bookingsError}</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[880px]">
                      <thead>
                        <tr className="border-b border-border bg-muted/50">
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">#</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Phone</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">City</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Items</th>
                          <th className="text-center px-4 py-3 font-medium text-muted-foreground">Status</th>
                          <th className="text-left px-4 py-3 font-medium text-muted-foreground">Submitted On</th>
                          <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings
                          .filter((b) =>
                            bookingStatusFilter === "all"
                              ? true
                              : b.status === bookingStatusFilter,
                          )
                          .filter((b) => {
                            const q = bookingSearch.toLowerCase();
                            if (!q) return true;
                            return (
                              (b.name || "").toLowerCase().includes(q) ||
                              (b.phone || "").toLowerCase().includes(q) ||
                              (b.city || "").toLowerCase().includes(q) ||
                              (b.pincode || "").toLowerCase().includes(q)
                            );
                          })
                          .map((b, index) => {
                            const badgeClass =
                              b.status === "pending"
                                ? "bg-amber-500/10 text-amber-600"
                                : b.status === "confirmed"
                                  ? "bg-emerald-500/10 text-emerald-600"
                                  : b.status === "completed"
                                    ? "bg-sky-500/10 text-sky-600"
                                    : "bg-red-500/10 text-red-600";
                            return (
                              <tr
                                key={b.id}
                                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
                              >
                                <td className="px-4 py-3 text-muted-foreground">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-3 text-foreground font-medium">
                                  {b.name}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                  {b.phone || "—"}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground">
                                  {b.city || "—"}
                                </td>
                                <td className="px-4 py-3 text-muted-foreground max-w-[200px] truncate">
                                  {b.categories || b.items || "—"}
                                </td>
                                <td className="px-4 py-3 text-center">
                                  <span
                                    className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${badgeClass}`}
                                  >
                                    {b.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-muted-foreground text-xs">
                                  {new Date(b.created_at).toLocaleString("en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => setViewBooking(b)}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors"
                                    >
                                      <Eye className="h-4 w-4" /> View
                                    </button>
                                    {canManageBookings && (
                                      <>
                                        <select
                                          disabled={statusUpdatingId === b.id}
                                          value={b.status}
                                          onChange={(e) =>
                                            updateBookingStatus(
                                              b,
                                              e.target.value as BookingStatus,
                                            )
                                          }
                                          className="px-2 py-1.5 rounded-lg border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                                        >
                                          <option value="pending">Pending</option>
                                          <option value="confirmed">Confirmed</option>
                                          <option value="completed">Completed</option>
                                          <option value="cancelled">Cancelled</option>
                                        </select>
                                        <button
                                          onClick={() => setDeleteBookingId(b.id)}
                                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
                                        >
                                          <Trash2 className="h-4 w-4" /> Delete
                                        </button>
                                      </>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* View booking modal */}
              <Dialog open={!!viewBooking} onOpenChange={(open) => !open && setViewBooking(null)}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Booking Details</DialogTitle>
                    <DialogDescription>
                      {viewBooking ? `Booking #${viewBooking.id}` : ""}
                    </DialogDescription>
                  </DialogHeader>
                  {viewBooking && (
                    <div className="space-y-3 text-sm">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Name</p>
                          <p className="font-medium text-foreground">{viewBooking.name}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium text-foreground">
                            {viewBooking.phone || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">City</p>
                          <p className="font-medium text-foreground">
                            {viewBooking.city || "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Pincode</p>
                          <p className="font-medium text-foreground">
                            {viewBooking.pincode || "—"}
                          </p>
                        </div>
                      </div>
                      {(viewBooking.inquiry_type) && (
                        <div>
                          <p className="text-xs text-muted-foreground">Inquiry Type</p>
                          <p className="font-medium text-foreground">
                            {viewBooking.inquiry_type}
                            {viewBooking.inquiry_other ? ` — ${viewBooking.inquiry_other}` : ""}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="font-medium text-foreground whitespace-pre-line">
                          {viewBooking.address || "—"}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Category of Waste</p>
                        <p className="font-medium text-foreground whitespace-pre-line">
                          {viewBooking.categories || viewBooking.items || "—"}
                        </p>
                      </div>
                      {viewBooking.other_electronics && (
                        <div>
                          <p className="text-xs text-muted-foreground">Other Electronics</p>
                          <p className="font-medium text-foreground whitespace-pre-line">
                            {viewBooking.other_electronics}
                          </p>
                        </div>
                      )}
                      {viewBooking.quantity && (
                        <div>
                          <p className="text-xs text-muted-foreground">Quantity</p>
                          <p className="font-medium text-foreground">{viewBooking.quantity}</p>
                        </div>
                      )}
                      {(viewBooking.remarks || viewBooking.message) && (
                        <div>
                          <p className="text-xs text-muted-foreground">Remarks / Notes</p>
                          <p className="font-medium text-foreground whitespace-pre-line">
                            {viewBooking.remarks || viewBooking.message}
                          </p>
                        </div>
                      )}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="font-medium text-foreground capitalize">
                            {viewBooking.status}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Submitted On</p>
                          <p className="font-medium text-foreground">
                            {new Date(viewBooking.created_at).toLocaleString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setViewBooking(null)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}

          {/* ==================== USERS TAB ==================== */}
          {tab === "users" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" /> Users
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{usersLoading ? "Loading…" : `${users.length} total`}</span>
                  <button
                    onClick={() => { loadRoles(); setNewUserOpen(true); }}
                    className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> New User
                  </button>
                </div>
              </div>

              {usersLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3, 4].map((i) => <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />)}
                </div>
              ) : usersError ? (
                <div className="p-6">
                  <p className="text-sm text-destructive">{usersError}</p>
                </div>
              ) : users.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground text-sm">No users found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-6 py-3 font-medium text-muted-foreground">Name</th>
                        <th className="text-left px-6 py-3 font-medium text-muted-foreground">Email</th>
                        <th className="text-left px-6 py-3 font-medium text-muted-foreground">Role</th>
                        <th className="text-center px-6 py-3 font-medium text-muted-foreground">Status</th>
                        <th className="text-right px-6 py-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u, i) => {
                        const active =
                          u.is_active === 1 ||
                          u.is_active === true ||
                          u.is_active === "1" ||
                          u.is_active === "true";
                        const rowBusy = activeToggleLoadingId === u.id;
                        return (
                          <tr key={`${u.email}-${i}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                            <td className="px-6 py-3 text-foreground font-medium">{u.name || "—"}</td>
                            <td className="px-6 py-3 text-muted-foreground">{u.email}</td>
                            <td className="px-6 py-3 text-muted-foreground capitalize">{u.role || "—"}</td>
                            <td className="px-6 py-3 text-center">
                              <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                                active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                              }`}>
                                {active ? "Active" : "Inactive"}
                              </span>
                            </td>
                            <td className="px-6 py-3">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditUser(u)}
                                  disabled={rowBusy}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors disabled:opacity-50"
                                  title="Edit role"
                                >
                                  <Edit className="h-4 w-4" /> Edit
                                </button>
                                <button
                                  onClick={() => toggleUserActive(u)}
                                  disabled={rowBusy}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors disabled:opacity-50"
                                  title={active ? "Deactivate" : "Activate"}
                                >
                                  {rowBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : (active ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />)}
                                  {active ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                  onClick={() => setDeleteUserId(u.id)}
                                  disabled={rowBusy}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-destructive text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                                  title="Delete user"
                                >
                                  <Trash2 className="h-4 w-4" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}

          {/* ==================== ROLES TAB ==================== */}
          {tab === "roles" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" /> Roles
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{rolesLoading ? "Loading…" : `${roles.length} total`}</span>
                  <button
                    onClick={() => setNewRoleOpen(true)}
                    className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-xs font-semibold hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-4 w-4" /> New Role
                  </button>
                </div>
              </div>

              {rolesLoading ? (
                <div className="p-6 space-y-3">
                  {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-muted rounded-lg animate-pulse" />)}
                </div>
              ) : rolesError ? (
                <div className="p-6">
                  <p className="text-sm text-destructive">{rolesError}</p>
                </div>
              ) : roles.length === 0 ? (
                <div className="p-10 text-center text-muted-foreground text-sm">No roles found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="text-left px-6 py-3 font-medium text-muted-foreground">Role Name</th>
                        <th className="text-left px-6 py-3 font-medium text-muted-foreground">Description</th>
                        <th className="text-left px-6 py-3 font-medium text-muted-foreground">Permissions</th>
                        <th className="text-right px-6 py-3 font-medium text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {roles.map((r, i) => (
                        <tr key={`${r.name}-${i}`} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="px-6 py-3 text-foreground font-medium">{r.name}</td>
                          <td className="px-6 py-3 text-muted-foreground">{r.description || "—"}</td>
                          <td className="px-6 py-3 text-muted-foreground">
                            {Array.isArray(r.permissions) && r.permissions.length ? (
                              <div className="flex flex-wrap gap-1.5">
                                {r.permissions.map((p) => (
                                  <Badge key={p} variant="secondary" className="text-[11px]">
                                    {p}
                                  </Badge>
                                ))}
                              </div>
                            ) : "—"}
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openViewRoleUsers(r)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors"
                                title="View users"
                              >
                                <Eye className="h-4 w-4" /> View
                              </button>
                              <button
                                onClick={() => openEditRole(r)}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-border hover:bg-muted transition-colors"
                                title="Edit role"
                              >
                                <Edit className="h-4 w-4" /> Edit
                              </button>
                              {r.name !== "admin" && (
                                <button
                                  onClick={() => setDeleteRoleId(r.id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border border-destructive text-destructive hover:bg-destructive/10 transition-colors"
                                  title="Delete role"
                                >
                                  <Trash2 className="h-4 w-4" /> Delete
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
          {tab === "homepage_cms" && canEditHomepage && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <HomepageCMS />
            </motion.div>
          )}
              </div>
            </main>
          </div>
        </div>
      </div>

      {/* Post delete confirmation dialog */}
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

      {/* Booking delete confirmation dialog */}
      <AlertDialog open={deleteBookingId !== null} onOpenChange={(open) => !open && setDeleteBookingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The booking will be permanently removed from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteBooking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User delete confirmation dialog */}
      <AlertDialog open={deleteUserId !== null} onOpenChange={(open) => !open && setDeleteUserId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The user will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Role delete confirmation dialog */}
      <AlertDialog open={deleteRoleId !== null} onOpenChange={(open) => !open && setDeleteRoleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this role?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the role. Users with this role will lose their access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRole}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* New User dialog */}
      <Dialog open={newUserOpen} onOpenChange={(open) => { setNewUserOpen(open); if (!open) setNewUserLoading(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New User</DialogTitle>
            <DialogDescription>Create a new admin user.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Name</label>
              <input
                value={newUserForm.name}
                onChange={(e) => setNewUserForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Email</label>
              <input
                value={newUserForm.email}
                onChange={(e) => setNewUserForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="user@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Password</label>
              <input
                type="password"
                value={newUserForm.password}
                onChange={(e) => setNewUserForm((f) => ({ ...f, password: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
              <select
                value={newUserForm.role_id}
                onChange={(e) => setNewUserForm((f) => ({ ...f, role_id: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select role</option>
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
              {roles.length === 0 && (
                <p className="text-xs text-muted-foreground mt-1">Loading roles…</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewUserOpen(false)} disabled={newUserLoading}>
              Cancel
            </Button>
            <Button onClick={submitNewUser} disabled={newUserLoading}>
              {newUserLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : "Create User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit User dialog */}
      <Dialog open={editUserOpen} onOpenChange={(open) => { setEditUserOpen(open); if (!open) setUserToEdit(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Change the user’s role.</DialogDescription>
          </DialogHeader>

          {userToEdit && (
            <div className="space-y-3">
              <div className="text-sm">
                <p className="text-foreground font-medium">{userToEdit.name}</p>
                <p className="text-muted-foreground">{userToEdit.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Role</label>
                <select
                  value={editUserRoleId}
                  onChange={(e) => setEditUserRoleId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select role</option>
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditUserOpen(false)} disabled={editUserLoading}>
              Cancel
            </Button>
            <Button onClick={submitEditUserRole} disabled={editUserLoading || !userToEdit || !editUserRoleId}>
              {editUserLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Role dialog */}
      <Dialog open={newRoleOpen} onOpenChange={(open) => { setNewRoleOpen(open); if (!open) setNewRoleLoading(false); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Role</DialogTitle>
            <DialogDescription>Create a new role and assign permissions.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Role Name</label>
              <input
                value={newRoleForm.name}
                onChange={(e) => setNewRoleForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g. editor"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <input
                value={newRoleForm.description}
                onChange={(e) => setNewRoleForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Optional description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Permissions</label>
              <div className="grid grid-cols-2 gap-2">
                {PERMISSIONS.map((p) => {
                  const checked = newRoleForm.permissions.includes(p);
                  return (
                    <label key={p} className="flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setNewRoleForm((f) => ({
                            ...f,
                            permissions: e.target.checked ? [...f.permissions, p] : f.permissions.filter((x) => x !== p),
                          }));
                        }}
                      />
                      <span className="font-mono text-xs">{p}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNewRoleOpen(false)} disabled={newRoleLoading}>
              Cancel
            </Button>
            <Button onClick={submitNewRole} disabled={newRoleLoading}>
              {newRoleLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : "Create Role"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role dialog */}
      <Dialog open={editRoleOpen} onOpenChange={(open) => { setEditRoleOpen(open); if (!open) setRoleToEdit(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>Update role details and permissions.</DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Role Name</label>
              <input
                value={editRoleForm.name}
                onChange={(e) => setEditRoleForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <input
                value={editRoleForm.description}
                onChange={(e) => setEditRoleForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Permissions</label>
              <div className="grid grid-cols-2 gap-2">
                {PERMISSIONS.map((p) => {
                  const checked = editRoleForm.permissions.includes(p);
                  return (
                    <label key={p} className="flex items-center gap-2 text-sm text-foreground">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          setEditRoleForm((f) => ({
                            ...f,
                            permissions: e.target.checked ? [...f.permissions, p] : f.permissions.filter((x) => x !== p),
                          }));
                        }}
                      />
                      <span className="font-mono text-xs">{p}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoleOpen(false)} disabled={editRoleLoading}>
              Cancel
            </Button>
            <Button onClick={submitEditRole} disabled={editRoleLoading}>
              {editRoleLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</> : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Role Users dialog */}
      <Dialog open={viewRoleOpen} onOpenChange={(open) => { setViewRoleOpen(open); if (!open) { setRoleToView(null); setRoleUsers([]); setRoleUsersError(null); } }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Role Users</DialogTitle>
            <DialogDescription>
              {roleToView ? `Users with role: ${roleToView.name}` : "Users for selected role"}
            </DialogDescription>
          </DialogHeader>

          {roleUsersLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-10 bg-muted rounded-lg animate-pulse" />)}
            </div>
          ) : roleUsersError ? (
            <p className="text-sm text-destructive">{roleUsersError}</p>
          ) : roleUsers.length === 0 ? (
            <p className="text-sm text-muted-foreground">No users found for this role.</p>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-4 py-2.5 font-medium text-muted-foreground">Email</th>
                    <th className="text-center px-4 py-2.5 font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {roleUsers.map((u) => {
                    const active = u.is_active === 1 || u.is_active === true;
                    return (
                      <tr key={u.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-2.5 text-foreground font-medium">{u.name}</td>
                        <td className="px-4 py-2.5 text-muted-foreground">{u.email}</td>
                        <td className="px-4 py-2.5 text-center">
                          <span className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium ${
                            active ? "bg-emerald-500/10 text-emerald-600" : "bg-muted text-muted-foreground"
                          }`}>
                            {active ? "Active" : "Inactive"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewRoleOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminDashboard;
