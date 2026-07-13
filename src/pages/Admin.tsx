import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home, RefreshCw, FileText, Image, Layout as LayoutIcon, MessageCircle,
  Palette, Puzzle, Users, Wrench, Settings, ChevronLeft, ChevronRight,
  Shield, Terminal, Plus, Trash2, FolderOpen, Eye, Heart, Edit3, Save, Upload, Lock, LogOut,
  Video, BarChart3, Download, FileBadge, Bell, Mail,
} from "lucide-react";
import {
  getProjects, addProject, deleteProject, updateProject, approveProjectComment, hideProjectComment, replyToProjectComment,
  getPublishedPosts, getDraftPosts, getPosts, addPost, deletePost, updatePost, publishPost, unpublishPost,
  getSettings, saveSettings,
  getContent, saveContent,
  getMedia, saveMedia,
  getAdvertisements, saveAdvertisements, addAdvertisement, updateAdvertisement, deleteAdvertisement, toggleAdvertisementEnabled, setAdvertisementOrder,
  getGalleryItems, saveGalleryItems, addGalleryItem, updateGalleryItem, deleteGalleryItem, setGalleryItemOrder,
  getEmails, saveEmails, addEmail, updateEmail, deleteEmail, markEmailRead, toggleStarEmail, archiveEmail, moveEmailToTrash, createEmailDraft, sendEmailReply, forwardEmail,
  getNotifications, markNotificationRead, clearNotifications,
  type Project, type BlogPost, type SiteSettings, type PageContent, type MediaContent,
  type Advertisement, type GalleryItem, type EmailMessage, type Notification,
} from "@/lib/store";
import { toast } from "sonner";

const STORE_UPDATE_EVENT = "trixie-store-update";

// ─── Admin Login Gate ────────────────────────────────────
const ADMIN_USER = "trixie";
const ADMIN_PASS = "5210";
const AUTH_KEY = "trixie_admin_auth";

function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === ADMIN_USER && password.trim() === ADMIN_PASS) {
      sessionStorage.setItem(AUTH_KEY, "true");
      onLogin();
    } else {
      setError("Invalid username or password");
    }
  };

  const features = [
    { icon: Lock, title: "Secure Access", desc: "Your account is protected with advanced security." },
    { icon: BarChart3, title: "Manage Content", desc: "Create, update, and organize your portfolio seamlessly." },
    { icon: Eye, title: "Track Performance", desc: "Monitor visitors and analyze your portfolio performance." },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center p-4 sm:p-6">
      <motion.div
        className="w-full max-w-6xl rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f0f1e] via-[#0a0a18] to-[#0d0820] overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* LEFT: Branding */}
        <div className="relative p-8 sm:p-12 hidden lg:flex flex-col justify-between overflow-hidden border-r border-white/5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.12),transparent_60%)]" />
          <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[radial-gradient(circle_at_70%_100%,rgba(139,92,246,0.18),transparent_60%)]" />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-12">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Terminal className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Trixie<span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Tech</span>
              </span>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs text-white/80 mb-6">
              <Shield className="h-3.5 w-3.5 text-indigo-400" />
              Admin Dashboard
            </div>

            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Welcome Back,<br />
              <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">Admin</span>
            </h1>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-10">
              Sign in to access your portfolio dashboard and manage your content.
            </p>

            <div className="space-y-5">
              {features.map(f => (
                <div key={f.title} className="flex gap-4">
                  <div className="shrink-0 w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center">
                    <f.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{f.title}</h3>
                    <p className="text-white/50 text-xs mt-0.5 max-w-xs">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Login form */}
        <div className="p-8 sm:p-12 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/10 flex items-center justify-center mb-5">
              <Lock className="h-7 w-7 text-indigo-400" />
            </div>
            <h2 className="text-3xl font-bold text-white text-center">Admin Login</h2>
            <p className="text-white/50 text-sm text-center mt-2 mb-8">Enter your credentials to continue</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">Username</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError(""); }}
                    placeholder="Enter username"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-white mb-2 block">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                  <input
                    type={showPass ? "text" : "password"}
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:border-indigo-500/60 focus:bg-white/[0.07] transition-all"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    placeholder="Enter your password"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-white/70 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={e => setRemember(e.target.checked)}
                    className="w-4 h-4 rounded accent-indigo-500"
                  />
                  Remember me
                </label>
                <button type="button" className="text-indigo-400 hover:text-indigo-300">Forgot password?</button>
              </div>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition-all"
              >
                Sign In
                <ChevronRight className="h-5 w-5" />
              </button>
            </form>

            <p className="text-center text-xs text-white/30 mt-10">
              © 2026 TrixieTech. All rights reserved.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const menuItems = [
  { label: "Dashboard", icon: Home, path: "/admin" },
  { label: "Updates", icon: RefreshCw, path: "/admin/updates" },
  { label: "Posts", icon: FileText, path: "/admin/posts" },
  { label: "Projects", icon: FolderOpen, path: "/admin/projects" },
  { label: "Advertisements", icon: Video, path: "/admin/advertisements" },
  { label: "Gallery", icon: Image, path: "/admin/gallery" },
  { label: "Media", icon: Image, path: "/admin/media" },
  { label: "Email Inbox", icon: Mail, path: "/admin/emails" },
  { label: "Notifications", icon: Bell, path: "/admin/notifications" },
  { label: "Pages", icon: LayoutIcon, path: "/admin/pages" },
  { label: "Comments", icon: MessageCircle, path: "/admin/comments" },
  { label: "Content", icon: Edit3, path: "/admin/content" },
  { label: "Resume / CV", icon: FileBadge, path: "/admin/resume" },
  { label: "Appearance", icon: Palette, path: "/admin/appearance" },
  { label: "Plugins", icon: Puzzle, path: "/admin/plugins" },
  { label: "Users", icon: Users, path: "/admin/users" },
  { label: "Tools", icon: Wrench, path: "/admin/tools" },
  { label: "Settings", icon: Settings, path: "/admin/settings" },
];

function AdminSidebar({ collapsed, setCollapsed }: { collapsed: boolean; setCollapsed: (v: boolean) => void }) {
  const location = useLocation();
  return (
    <aside className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ${collapsed ? "w-16" : "w-60"} bg-sidebar-background border-r border-sidebar-border flex flex-col`}>
      <div className="h-16 flex items-center gap-2 px-4 border-b border-sidebar-border shrink-0">
        <Terminal className="h-6 w-6 text-sidebar-primary shrink-0" />
        {!collapsed && <span className="text-lg font-bold text-sidebar-primary whitespace-nowrap">Trixie Admin</span>}
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {menuItems.map(item => {
          const active = location.pathname === item.path || (item.path !== "/admin" && location.pathname.startsWith(item.path));
          return (
            <Link key={item.path} to={item.path} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? "bg-sidebar-primary/10 text-sidebar-primary" : "text-sidebar-foreground hover:text-sidebar-primary hover:bg-sidebar-accent"}`} title={collapsed ? item.label : undefined}>
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
      <button onClick={() => setCollapsed(!collapsed)} className="h-12 flex items-center justify-center border-t border-sidebar-border text-sidebar-foreground hover:text-sidebar-primary transition-colors">
        {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        {!collapsed && <span className="text-sm ml-2">Collapse</span>}
      </button>
    </aside>
  );
}

const inputCls = "w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50";

// ─── Dashboard Home ──────────────────────────────────────
function DashboardHome() {
  const projects = getProjects();
  const posts = getPublishedPosts();
  const ads = getAdvertisements();
  const gallery = getGalleryItems();
  const emails = getEmails();
  const notifications = getNotifications();
  const totalComments = projects.reduce((acc, p) => acc + (p.comments?.length || 0), 0);
  const unreadEmails = emails.filter((email) => email.folder === "inbox" && email.status === "unread").length;

  const stats = [
    { label: "Projects", value: projects.length, icon: FolderOpen, color: "text-primary" },
    { label: "Published Posts", value: posts.length, icon: FileText, color: "text-accent" },
    { label: "Active Ads", value: ads.filter((ad) => ad.enabled).length, icon: Video, color: "text-emerald-400" },
    { label: "Unread Emails", value: unreadEmails, icon: Mail, color: "text-sky-400" },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Welcome back, <span className="gradient-text">Trixie</span></h1>
      <p className="text-muted-foreground mb-8">Here's what's happening on your site.</p>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="glass rounded-xl p-5 neon-border">
            <div className="flex items-center gap-3 mb-2">
              <s.icon className={`h-5 w-5 ${s.color}`} />
              <span className="text-sm text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass rounded-xl p-6 neon-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><FolderOpen className="h-4 w-4 text-primary" /> Recent Projects</h3>
          <div className="space-y-3">
            {projects.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div><p className="font-medium text-sm">{p.title}</p><p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p></div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Heart className="h-3 w-3" />{p.likes || 0}
                  <MessageCircle className="h-3 w-3 ml-1" />{p.comments?.length || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="glass rounded-xl p-6 neon-border">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><FileText className="h-4 w-4 text-accent" /> Recent Posts</h3>
          <div className="space-y-3">
            {posts.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                <div><p className="font-medium text-sm">{p.title}</p><p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p></div>
                <div className="flex gap-1">{p.tags.slice(0, 2).map(t => <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Posts Manager ───────────────────────────────────────
function PostsManager() {
  const [posts, setPosts] = useState<BlogPost[]>(getPosts);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) { toast.error("Title and content required"); return; }
    addPost({
      title,
      content,
      excerpt: excerpt || content.slice(0, 120) + "...",
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      status: "published",
    });
    setPosts(getPosts()); setTitle(""); setContent(""); setExcerpt(""); setTags(""); setShowForm(false);
    toast.success("Post published!");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:neon-glow transition-all">
          <Plus className="h-4 w-4" />{showForm ? "Cancel" : "New Post"}
        </button>
      </div>
      {showForm && (
        <motion.div className="glass rounded-xl p-6 mb-6 neon-border" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="space-y-4">
            <input className={inputCls} placeholder="Post title" value={title} onChange={e => setTitle(e.target.value)} />
            <input className={inputCls} placeholder="Short excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} />
            <textarea className={`${inputCls} min-h-[150px]`} placeholder="Content..." value={content} onChange={e => setContent(e.target.value)} />
            <input className={inputCls} placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
            <button onClick={handleAdd} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:neon-glow transition-all">Publish</button>
          </div>
        </motion.div>
      )}
      <div className="space-y-3">
        {posts.map(post => (
          <div key={post.id} className="glass rounded-xl p-5 flex items-center justify-between gap-4 neon-border hover-glow">
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold truncate">{post.title}</h4>
              <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                {new Date(post.createdAt).toLocaleDateString()}
                {post.tags.map(t => <span key={t} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t}</span>)}
              </div>
            </div>
            <button onClick={() => { deletePost(post.id); setPosts(getPosts()); toast.success("Post deleted"); }} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {posts.length === 0 && <p className="text-center py-12 text-muted-foreground">No posts yet.</p>}
      </div>
    </div>
  );
}

// ─── Projects Manager ────────────────────────────────────
function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>(getProjects);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", tech: "", liveUrl: "", githubUrl: "", image: "", video: "" });

  const reset = () => { setForm({ title: "", description: "", tech: "", liveUrl: "", githubUrl: "", image: "", video: "" }); setEditingId(null); setShowForm(false); };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 25 * 1024 * 1024) { toast.error("Video too large (max 25MB for browser storage)"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, video: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(f => ({ ...f, image: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.description.trim()) { toast.error("Title and description required"); return; }
    const techArr = form.tech.split(",").map(t => t.trim()).filter(Boolean);
    if (editingId) {
      updateProject(editingId, { title: form.title, description: form.description, tech: techArr, image: form.image, video: form.video, liveUrl: form.liveUrl || undefined, githubUrl: form.githubUrl || undefined });
      toast.success("Project updated!");
    } else {
      addProject({ title: form.title, description: form.description, tech: techArr, image: form.image, video: form.video, liveUrl: form.liveUrl || undefined, githubUrl: form.githubUrl || undefined });
      toast.success("Project added!");
    }
    setProjects(getProjects());
    reset();
  };

  const startEdit = (p: Project) => {
    setEditingId(p.id);
    setForm({ title: p.title, description: p.description, tech: p.tech.join(", "), liveUrl: p.liveUrl || "", githubUrl: p.githubUrl || "", image: p.image || "", video: p.video || "" });
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Projects</h1>
        <button onClick={() => showForm ? reset() : setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:neon-glow transition-all">
          <Plus className="h-4 w-4" />{showForm ? "Cancel" : "Add Project"}
        </button>
      </div>
      {showForm && (
        <motion.div className="glass rounded-xl p-6 mb-6 neon-border" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h3 className="font-semibold mb-4">{editingId ? "Edit Project" : "New Project"}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input className={inputCls} placeholder="Project title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            <input className={inputCls} placeholder="Tech stack (comma separated)" value={form.tech} onChange={e => setForm({ ...form, tech: e.target.value })} />
            <input className={inputCls} placeholder="Live URL (optional)" value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} />
            <input className={inputCls} placeholder="GitHub URL (optional)" value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} />
            <textarea className={`md:col-span-2 ${inputCls} min-h-[100px]`} placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

            <div className="md:col-span-2 grid md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1.5"><Image className="h-3.5 w-3.5" /> Image</label>
                <div className="flex flex-col gap-2">
                  {form.image && <img src={form.image} alt="preview" className="w-full h-32 object-cover rounded-lg border border-border" />}
                  <label className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-sm cursor-pointer hover:bg-secondary/70 transition-all">
                    <Upload className="h-3.5 w-3.5" /> Upload Image
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  <input className={inputCls} placeholder="Or image URL..." value={form.image.startsWith("data:") ? "" : form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block flex items-center gap-1.5"><Video className="h-3.5 w-3.5" /> Video</label>
                <div className="flex flex-col gap-2">
                  {form.video && <video src={form.video} controls className="w-full h-32 object-cover rounded-lg border border-border bg-black" />}
                  <label className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-secondary border border-border rounded-lg text-sm cursor-pointer hover:bg-secondary/70 transition-all">
                    <Upload className="h-3.5 w-3.5" /> Upload Video (≤25MB)
                    <input type="file" className="hidden" accept="video/*" onChange={handleVideoUpload} />
                  </label>
                  <input className={inputCls} placeholder="Or video URL (mp4, YouTube embed)..." value={form.video.startsWith("data:") ? "" : form.video} onChange={e => setForm({ ...form, video: e.target.value })} />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:neon-glow transition-all flex items-center gap-2">
              <Save className="h-4 w-4" /> {editingId ? "Update" : "Save"} Project
            </button>
            {editingId && <button onClick={reset} className="px-6 py-3 bg-secondary border border-border rounded-lg font-medium">Cancel</button>}
          </div>
        </motion.div>
      )}
      <div className="space-y-3">
        {projects.map(project => (
          <div key={project.id} className="glass rounded-xl p-5 flex items-center justify-between gap-4 neon-border hover-glow">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-semibold truncate">{project.title}</h4>
                {project.video && <Video className="h-3.5 w-3.5 text-primary shrink-0" />}
              </div>
              <p className="text-sm text-muted-foreground truncate">{project.description}</p>
              <div className="flex gap-1.5 mt-2">
                {project.tech.slice(0, 4).map(t => <span key={t} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t}</span>)}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => startEdit(project)} className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all" title="Edit">
                <Edit3 className="h-4 w-4" />
              </button>
              <button onClick={() => { deleteProject(project.id); setProjects(getProjects()); toast.success("Project removed"); }} className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all" title="Delete">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Content Editor ──────────────────────────────────────
function ContentEditor() {
  const [content, setContent] = useState<PageContent>(getContent);

  const handleSave = () => {
    saveContent(content);
    toast.success("Content saved! Refresh the site to see changes.");
  };

  const field = (label: string, key: keyof PageContent, multiline = false) => (
    <div>
      <label className="text-sm text-muted-foreground mb-1.5 block">{label}</label>
      {multiline ? (
        <textarea className={`${inputCls} min-h-[100px]`} value={content[key]} onChange={e => setContent({ ...content, [key]: e.target.value })} />
      ) : (
        <input className={inputCls} value={content[key]} onChange={e => setContent({ ...content, [key]: e.target.value })} />
      )}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Edit Website Content</h1>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:neon-glow transition-all">
          <Save className="h-4 w-4" /> Save All
        </button>
      </div>
      <div className="glass rounded-xl p-6 neon-border mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Home className="h-4 w-4 text-primary" /> Home Page</h2>
        <div className="space-y-4">
          {field("Hero Name", "heroTitle")}
          {field("Subtitle", "heroSubtitle")}
          {field("Description", "heroDescription", true)}
        </div>
      </div>
      <div className="glass rounded-xl p-6 neon-border mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> About Page</h2>
        <div className="space-y-4">
          {field("Bio Paragraph 1", "aboutBio1", true)}
          {field("Bio Paragraph 2", "aboutBio2", true)}
          {field("Bio Paragraph 3", "aboutBio3", true)}
          {field("Quote", "aboutQuote")}
        </div>
      </div>
      <div className="glass rounded-xl p-6 neon-border">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary" /> Contact Info</h2>
        <div className="space-y-4">
          {field("Email", "contactEmail")}
          {field("Phone / WhatsApp", "contactPhone")}
        </div>
      </div>
    </div>
  );
}

// ─── Comments Manager ────────────────────────────────────
function CommentsManager() {
  const projects = getProjects();
  const allComments = projects.flatMap(p => p.comments.map(c => ({ ...c, projectTitle: p.title })));
  allComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Comments</h1>
      {allComments.length === 0 ? (
        <p className="text-center py-16 text-muted-foreground">No comments yet.</p>
      ) : (
        <div className="space-y-3">
          {allComments.map(c => (
            <div key={c.id} className="glass rounded-xl p-5 neon-border">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm text-primary">{c.name}</span>
                <span className="text-xs text-muted-foreground">on</span>
                <span className="text-sm font-medium">{c.projectTitle}</span>
                <span className="ml-auto text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-muted-foreground">{c.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdvertisementManager() {
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(getAdvertisements);
  const [newAd, setNewAd] = useState({ title: "", description: "", media_url: "", media_type: "image" as "image" | "video", button_text: "Learn More", button_link: "", enabled: true, sort_order: 1 });

  const refresh = () => setAdvertisements(getAdvertisements());
  const handleSave = () => {
    if (!newAd.title.trim() || !newAd.description.trim()) { toast.error("Title and description are required"); return; }
    addAdvertisement(newAd);
    setNewAd({ title: "", description: "", media_url: "", media_type: "image", button_text: "Learn More", button_link: "", enabled: true, sort_order: advertisements.length + 1 });
    refresh();
    toast.success("Advertisement saved.");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Advertisements</h1>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:neon-glow transition-all">
          <Plus className="h-4 w-4" /> Add Advertisement
        </button>
      </div>
      <div className="glass rounded-xl p-6 neon-border mb-6">
        <div className="grid lg:grid-cols-2 gap-4">
          <input className={inputCls} placeholder="Title" value={newAd.title} onChange={e => setNewAd({ ...newAd, title: e.target.value })} />
          <input className={inputCls} placeholder="Button text" value={newAd.button_text} onChange={e => setNewAd({ ...newAd, button_text: e.target.value })} />
          <textarea className={`${inputCls} min-h-[120px]`} placeholder="Description" value={newAd.description} onChange={e => setNewAd({ ...newAd, description: e.target.value })} />
          <input className={inputCls} placeholder="Button link" value={newAd.button_link} onChange={e => setNewAd({ ...newAd, button_link: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <select className={inputCls} value={newAd.media_type} onChange={e => setNewAd({ ...newAd, media_type: e.target.value as "image" | "video" })}>
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>
            <input className={inputCls} placeholder="Media URL" value={newAd.media_url} onChange={e => setNewAd({ ...newAd, media_url: e.target.value })} />
          </div>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <input type="checkbox" checked={newAd.enabled} onChange={e => setNewAd({ ...newAd, enabled: e.target.checked })} className="w-4 h-4 rounded accent-indigo-500" />
              Enabled
            </label>
            <input className={inputCls} type="number" placeholder="Sort order" value={newAd.sort_order} onChange={e => setNewAd({ ...newAd, sort_order: Number(e.target.value) })} />
          </div>
        </div>
      </div>
      <div className="space-y-3">
        {advertisements.map((ad) => (
          <div key={ad.id} className="glass rounded-xl p-5 neon-border flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-muted-foreground">{ad.enabled ? "Live" : "Paused"}</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">#{ad.sort_order}</span>
              </div>
              <h3 className="font-semibold text-lg">{ad.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{ad.description}</p>
              <p className="text-xs text-muted-foreground mt-2">{ad.media_type.toUpperCase()} · {new Date(ad.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <button onClick={() => { toggleAdvertisementEnabled(ad.id, !ad.enabled); refresh(); toast.success(`Advertisement ${ad.enabled ? "paused" : "activated"}`); }} className="px-4 py-2 rounded-lg bg-secondary text-sm hover:bg-secondary/70 transition-all">{ad.enabled ? "Pause" : "Activate"}</button>
              <button onClick={() => { deleteAdvertisement(ad.id); refresh(); toast.success("Advertisement deleted"); }} className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 transition-all">Delete</button>
            </div>
          </div>
        ))}
        {advertisements.length === 0 && <p className="text-center py-12 text-muted-foreground">No advertisements configured yet.</p>}
      </div>
    </div>
  );
}

function GalleryManager() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(getGalleryItems);
  const [itemDraft, setItemDraft] = useState({ caption: "", description: "", album: "", media_url: "", media_type: "image" as "image" | "video", sort_order: 1 });

  const refresh = () => setGalleryItems(getGalleryItems());
  const handleSave = () => {
    if (!itemDraft.caption.trim() || !itemDraft.media_url.trim()) { toast.error("Caption and media URL are required"); return; }
    addGalleryItem(itemDraft);
    setItemDraft({ caption: "", description: "", album: "", media_url: "", media_type: "image", sort_order: galleryItems.length + 1 });
    refresh();
    toast.success("Gallery item added.");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Gallery</h1>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:neon-glow transition-all">
          <Plus className="h-4 w-4" /> Add Item
        </button>
      </div>
      <div className="glass rounded-xl p-6 neon-border mb-6 grid lg:grid-cols-2 gap-4">
        <input className={inputCls} placeholder="Caption" value={itemDraft.caption} onChange={e => setItemDraft({ ...itemDraft, caption: e.target.value })} />
        <input className={inputCls} placeholder="Album" value={itemDraft.album} onChange={e => setItemDraft({ ...itemDraft, album: e.target.value })} />
        <textarea className={`${inputCls} min-h-[120px]`} placeholder="Description" value={itemDraft.description} onChange={e => setItemDraft({ ...itemDraft, description: e.target.value })} />
        <input className={inputCls} placeholder="Media URL" value={itemDraft.media_url} onChange={e => setItemDraft({ ...itemDraft, media_url: e.target.value })} />
        <select className={inputCls} value={itemDraft.media_type} onChange={e => setItemDraft({ ...itemDraft, media_type: e.target.value as "image" | "video" })}>
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
        <input className={inputCls} type="number" placeholder="Sort order" value={itemDraft.sort_order} onChange={e => setItemDraft({ ...itemDraft, sort_order: Number(e.target.value) })} />
      </div>
      <div className="grid gap-3">
        {galleryItems.map(item => (
          <div key={item.id} className="glass rounded-xl p-5 neon-border flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{item.caption}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
              <p className="text-xs text-muted-foreground mt-2">Album: {item.album || "General"} · {item.media_type.toUpperCase()}</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <button onClick={() => { deleteGalleryItem(item.id); refresh(); toast.success("Gallery item removed"); }} className="px-4 py-2 rounded-lg bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 transition-all">Delete</button>
            </div>
          </div>
        ))}
        {galleryItems.length === 0 && <p className="text-center py-12 text-muted-foreground">No gallery items yet.</p>}
      </div>
    </div>
  );
}

function EmailManager() {
  const [emails, setEmails] = useState<EmailMessage[]>(getEmails);
  const [selectedFolder, setSelectedFolder] = useState<EmailMessage["folder"]>("inbox");

  useEffect(() => {
    const sync = () => setEmails(getEmails());
    window.addEventListener(STORE_UPDATE_EVENT, sync);
    return () => window.removeEventListener(STORE_UPDATE_EVENT, sync);
  }, []);

  const filteredEmails = emails.filter((email) => email.folder === selectedFolder);
  const handleFolder = (folder: EmailMessage["folder"]) => setSelectedFolder(folder);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Email Inbox</h1>
          <p className="text-sm text-muted-foreground">Manage customer inquiries and follow up from the contact form.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["inbox", "sent", "drafts", "archive", "trash"] as EmailMessage["folder"][]).map(folder => (
            <button key={folder} onClick={() => handleFolder(folder)} className={`px-3 py-2 rounded-lg text-sm ${folder === selectedFolder ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
              {folder.charAt(0).toUpperCase() + folder.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-3">
        {filteredEmails.map(email => (
          <div key={email.id} className="glass rounded-xl p-5 neon-border">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold">{email.subject}</span>
                  <span className="text-xs text-muted-foreground">from {email.fromName}</span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{email.body}</p>
              </div>
              <div className="flex flex-col gap-2 text-right">
                <span className="text-xs text-muted-foreground">{new Date(email.receivedAt).toLocaleString()}</span>
                <div className="flex flex-wrap gap-2 justify-end">
                  <button onClick={() => { markEmailRead(email.id, email.status !== "read"); setEmails(getEmails()); }} className="px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground hover:bg-secondary/70 transition-all">{email.status === "read" ? "Mark Unread" : "Mark Read"}</button>
                  <button onClick={() => { toggleStarEmail(email.id); setEmails(getEmails()); }} className="px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground hover:bg-secondary/70 transition-all">{email.starred ? "Unstar" : "Star"}</button>
                  <button onClick={() => { archiveEmail(email.id); setEmails(getEmails()); toast.success("Email archived"); }} className="px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground hover:bg-secondary/70 transition-all">Archive</button>
                  <button onClick={() => { moveEmailToTrash(email.id); setEmails(getEmails()); toast.success("Email moved to trash"); }} className="px-3 py-2 rounded-lg bg-destructive/10 text-destructive text-sm hover:bg-destructive/20 transition-all">Trash</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredEmails.length === 0 && <p className="text-center py-16 text-muted-foreground">No emails in this folder.</p>}
      </div>
    </div>
  );
}

function NotificationsManager() {
  const [notifications, setNotifications] = useState<Notification[]>(getNotifications);

  const refresh = () => setNotifications(getNotifications());

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-sm text-muted-foreground">Review system alerts and clear them when handled.</p>
        </div>
        <button onClick={() => { clearNotifications(); refresh(); toast.success("Notifications cleared"); }} className="px-4 py-2 rounded-lg bg-secondary text-sm text-muted-foreground hover:bg-secondary/70 transition-all">Clear All</button>
      </div>
      <div className="space-y-3">
        {notifications.map(note => (
          <div key={note.id} className={`glass rounded-xl p-5 neon-border ${note.read ? "opacity-70" : ""}`}>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-sm font-semibold">{note.title}</span>
              <span className="text-xs text-muted-foreground">{note.kind}</span>
              <span className="ml-auto text-xs text-muted-foreground">{new Date(note.createdAt).toLocaleDateString()}</span>
            </div>
            <p className="text-sm text-muted-foreground">{note.body}</p>
            <div className="mt-3 flex gap-2">
              <button onClick={() => { markNotificationRead(note.id); refresh(); }} className="px-3 py-2 rounded-lg bg-secondary text-sm text-muted-foreground hover:bg-secondary/70 transition-all">Mark Read</button>
            </div>
          </div>
        ))}
        {notifications.length === 0 && <p className="text-center py-16 text-muted-foreground">No notifications available.</p>}
      </div>
    </div>
  );
}

// ─── Media Manager (Home Videos: Advert + Analytics) ────
function MediaManager() {
  const [media, setMedia] = useState<MediaContent>(getMedia);

  const handleUpload = (key: "advertVideo" | "analyticsVideo" | "advertImage" | "analyticsImage") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const isVideo = key.endsWith("Video");
    if (file.size > 25 * 1024 * 1024) { toast.error("File too large (max 25MB for browser storage). Use a hosted URL instead."); return; }
    const reader = new FileReader();
    reader.onload = (ev) => setMedia(m => ({ ...m, [key]: ev.target?.result as string }));
    if (isVideo) {
      reader.readAsDataURL(file);
    } else {
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => { saveMedia(media); toast.success("Media saved! Visit Home to see updates."); };

  const MediaBlock = ({
    label, icon: Icon,
    videoKey,
    imageKey,
    titleKey,
    descKey,
  }: {
    label: string;
    icon: any;
    videoKey: "advertVideo" | "analyticsVideo";
    imageKey: "advertImage" | "analyticsImage";
    titleKey: "advertTitle" | "analyticsTitle";
    descKey: "advertDescription" | "analyticsDescription";
  }) => {
    const videoSrc = media[videoKey];
    const imageSrc = media[imageKey];
    const hasMedia = Boolean(videoSrc || imageSrc);
    return (
      <div className="glass rounded-xl p-6 neon-border space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2"><Icon className="h-5 w-5 text-primary" /> {label}</h2>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Section Title</label>
          <input className={inputCls} value={media[titleKey]} onChange={e => setMedia({ ...media, [titleKey]: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Description</label>
          <textarea className={`${inputCls} min-h-[80px]`} value={media[descKey]} onChange={e => setMedia({ ...media, [descKey]: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">Media</label>
          {videoSrc ? (
            <video src={videoSrc} controls className="w-full max-h-64 rounded-lg border border-border bg-black mb-2" />
          ) : imageSrc ? (
            <img src={imageSrc} alt={label} className="w-full max-h-64 object-cover rounded-lg border border-border mb-2" />
          ) : (
            <div className="w-full h-64 rounded-lg border border-border bg-black/20 flex items-center justify-center text-sm text-muted-foreground mb-2">
              No media uploaded yet.
            </div>
          )}
          <div className="grid gap-2">
            <div className="grid sm:grid-cols-2 gap-2">
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm cursor-pointer hover:neon-glow transition-all">
                <Upload className="h-4 w-4" /> Upload Video (≤25MB)
                <input type="file" className="hidden" accept="video/*" onChange={handleUpload(videoKey)} />
              </label>
              <label className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm cursor-pointer hover:neon-glow transition-all">
                <Upload className="h-4 w-4" /> Upload Image (≤25MB)
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload(imageKey)} />
              </label>
            </div>
            <input className={inputCls} placeholder="Hosted video URL (mp4)" value={videoSrc.startsWith("data:") ? "" : videoSrc} onChange={e => setMedia({ ...media, [videoKey]: e.target.value })} />
            <input className={inputCls} placeholder="Hosted image URL" value={imageSrc.startsWith("data:") ? "" : imageSrc} onChange={e => setMedia({ ...media, [imageKey]: e.target.value })} />
            <div className="flex flex-wrap gap-2">
              {videoSrc && (
                <button onClick={() => setMedia({ ...media, [videoKey]: "" })} className="text-xs text-destructive hover:underline">Remove video</button>
              )}
              {imageSrc && (
                <button onClick={() => setMedia({ ...media, [imageKey]: "" })} className="text-xs text-destructive hover:underline">Remove image</button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Media Library</h1>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:neon-glow transition-all">
          <Save className="h-4 w-4" /> Save All
        </button>
      </div>
      <p className="text-sm text-muted-foreground mb-6">Manage the videos shown on the Home page. Upload files (kept in your browser) or paste a hosted URL.</p>
      <div className="grid lg:grid-cols-2 gap-6">
        <MediaBlock label="Trixie Tech Advert" icon={Video} videoKey="advertVideo" imageKey="advertImage" titleKey="advertTitle" descKey="advertDescription" />
        <MediaBlock label="Analytics & Growth" icon={BarChart3} videoKey="analyticsVideo" imageKey="analyticsImage" titleKey="analyticsTitle" descKey="analyticsDescription" />
      </div>
    </div>
  );
}

// ─── Pages Manager ───────────────────────────────────────
function PagesManager() {
  const pages = [
    { name: "Home", path: "/", status: "Published" },
    { name: "About", path: "/about", status: "Published" },
    { name: "Projects", path: "/projects", status: "Published" },
    { name: "Blog", path: "/blog", status: "Published" },
    { name: "Contact", path: "/contact", status: "Published" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pages</h1>
      <div className="space-y-3">
        {pages.map(page => (
          <div key={page.path} className="glass rounded-xl p-5 flex items-center justify-between neon-border hover-glow">
            <div>
              <h4 className="font-semibold">{page.name}</h4>
              <p className="text-sm text-muted-foreground font-mono">{page.path}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">{page.status}</span>
              <Link to={page.path} className="p-2 text-muted-foreground hover:text-primary transition-colors"><Eye className="h-4 w-4" /></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Appearance ──────────────────────────────────────────
function AppearanceManager() {
  const [settings, setSettings] = useState<SiteSettings>(getSettings);
  const [previewPhoto, setPreviewPhoto] = useState(settings.profilePhoto);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setPreviewPhoto(dataUrl);
      setSettings(prev => ({ ...prev, profilePhoto: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => { saveSettings(settings); toast.success("Settings saved! Refresh to see changes."); };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Appearance & Settings</h1>
      <div className="glass rounded-xl p-6 neon-border space-y-6 max-w-xl">
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Site Name</label>
          <input className={inputCls} value={settings.siteName} onChange={e => setSettings({ ...settings, siteName: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-1.5 block">Tagline</label>
          <input className={inputCls} value={settings.tagline} onChange={e => setSettings({ ...settings, tagline: e.target.value })} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground mb-3 block">About Page Photo</label>
          <div className="flex items-start gap-4">
            {previewPhoto && (
              <img src={previewPhoto} alt="Profile preview" className="w-24 h-24 rounded-xl object-cover border border-border" />
            )}
            <div className="flex flex-col gap-2">
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium text-sm cursor-pointer hover:neon-glow transition-all">
                <Upload className="h-4 w-4" /> Upload Photo
                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} />
              </label>
              <span className="text-xs text-muted-foreground">Or paste a URL below:</span>
              <input className={inputCls} placeholder="https://..." value={settings.profilePhoto} onChange={e => { setSettings({ ...settings, profilePhoto: e.target.value }); setPreviewPhoto(e.target.value); }} />
            </div>
          </div>
        </div>
        <button onClick={handleSave} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:neon-glow transition-all flex items-center gap-2">
          <Save className="h-4 w-4" /> Save Changes
        </button>
      </div>
    </div>
  );
}

// ─── Placeholder sections ────────────────────────────────
// ─── Resume / CV Manager ────────────────────────────────
const RESUME_KEY = "trixie_resume";
function ResumeManager() {
  const [resume, setResume] = useState<string | null>(() => localStorage.getItem(RESUME_KEY));
  const [name, setName] = useState<string>(() => localStorage.getItem(RESUME_KEY + "_name") || "");

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error("File too large (max 10MB)"); return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const data = ev.target?.result as string;
      localStorage.setItem(RESUME_KEY, data);
      localStorage.setItem(RESUME_KEY + "_name", file.name);
      setResume(data);
      setName(file.name);
      toast.success("Resume updated! Visitors can now download it from the About page.");
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    if (!resume) return;
    const link = document.createElement("a");
    link.href = resume;
    link.download = name || "Trixie_Resume.pdf";
    link.click();
  };

  const handleDelete = () => {
    localStorage.removeItem(RESUME_KEY);
    localStorage.removeItem(RESUME_KEY + "_name");
    setResume(null);
    setName("");
    toast.success("Resume removed");
  };

  const sizeKb = resume ? Math.round((resume.length * 0.75) / 1024) : 0;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Resume / CV</h1>
      <p className="text-sm text-muted-foreground mb-6">Upload or update the resume that visitors download from the About page.</p>

      <div className="glass rounded-xl p-6 neon-border max-w-2xl">
        {resume ? (
          <div className="space-y-5">
            <div className="flex items-start gap-4 p-4 bg-secondary/50 rounded-lg border border-border">
              <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                <FileBadge className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{name || "Resume"}</p>
                <p className="text-xs text-muted-foreground mt-1">~{sizeKb} KB · stored in browser</p>
              </div>
              <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full shrink-0">Live</span>
            </div>

            {name.toLowerCase().endsWith(".pdf") && (
              <iframe src={resume} title="Resume preview" className="w-full h-96 rounded-lg border border-border bg-white" />
            )}

            <div className="flex flex-wrap gap-2">
              <button onClick={handleDownload} className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:neon-glow transition-all">
                <Download className="h-4 w-4" /> Download
              </button>
              <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary border border-border rounded-lg font-medium text-sm cursor-pointer hover:bg-secondary/70 transition-all">
                <Upload className="h-4 w-4" /> Replace
                <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} />
              </label>
              <button onClick={handleDelete} className="inline-flex items-center gap-2 px-4 py-2.5 text-destructive border border-destructive/30 rounded-lg font-medium text-sm hover:bg-destructive/10 transition-all">
                <Trash2 className="h-4 w-4" /> Remove
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-10">
            <FileBadge className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-5">No resume uploaded yet.</p>
            <label className="inline-flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground rounded-lg font-medium text-sm cursor-pointer hover:neon-glow transition-all">
              <Upload className="h-4 w-4" /> Upload Resume (PDF, DOC, DOCX)
              <input type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleUpload} />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}

function PlaceholderSection({ title, icon: Icon, description }: { title: string; icon: any; description: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{title}</h1>
      <div className="glass rounded-xl p-12 neon-border text-center">
        <Icon className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
}

// ─── Main Admin Component ────────────────────────────────
export default function Admin() {
  const [collapsed, setCollapsed] = useState(false);
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "true");

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    setAuthed(false);
  };

  if (!authed) {
    return <AdminLogin onLogin={() => setAuthed(true)} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className={`transition-all duration-300 ${collapsed ? "ml-16" : "ml-60"}`}>
        <header className="h-16 glass border-b border-border/30 flex items-center px-6 sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Admin Panel</span>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
              <Eye className="h-4 w-4" /> View Site
            </Link>
            <button onClick={handleLogout} className="text-sm text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1.5">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </header>
        <main className="p-6 lg:p-8">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="updates" element={<PlaceholderSection title="Updates" icon={RefreshCw} description="Your site is up to date! All components are running the latest version." />} />
            <Route path="posts" element={<PostsManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="advertisements" element={<AdvertisementManager />} />
            <Route path="gallery" element={<GalleryManager />} />
            <Route path="media" element={<MediaManager />} />
            <Route path="emails" element={<EmailManager />} />
            <Route path="notifications" element={<NotificationsManager />} />
            <Route path="pages" element={<PagesManager />} />
            <Route path="comments" element={<CommentsManager />} />
            <Route path="content" element={<ContentEditor />} />
            <Route path="resume" element={<ResumeManager />} />
            <Route path="appearance" element={<AppearanceManager />} />
            <Route path="plugins" element={<PlaceholderSection title="Plugins" icon={Puzzle} description="Plugin system coming soon. Extend your site with powerful add-ons." />} />
            <Route path="users" element={<PlaceholderSection title="Users" icon={Users} description="User management will be available when authentication is enabled." />} />
            <Route path="tools" element={<PlaceholderSection title="Tools" icon={Wrench} description="Developer tools for site maintenance, exports, and diagnostics." />} />
            <Route path="settings" element={<AppearanceManager />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
