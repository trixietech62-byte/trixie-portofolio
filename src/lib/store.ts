import { supabase } from "@/integrations/supabase/client";

export interface CommentReply {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

export interface ProjectComment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
  status: "approved" | "pending" | "hidden";
  replies: CommentReply[];
}

export interface BlogComment {
  id: string;
  name: string;
  text: string;
  createdAt: string;
  status: "approved" | "pending" | "hidden";
  replies: CommentReply[];
}

export type PostStatus = "draft" | "published" | "unpublished";

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  image: string;
  thumbnail?: string;
  screenshots: string[];
  demoVideo?: string;
  featured: boolean;
  sortOrder: number;
  liveUrl?: string;
  githubUrl?: string;
  likes: number;
  comments: ProjectComment[];
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  tags: string[];
  featured_image?: string;
  video?: string;
  status: PostStatus;
  published_at?: string;
  likes: number;
  comments: BlogComment[];
  createdAt: string;
}

export interface Advertisement {
  id: string;
  title: string;
  description: string;
  media_url: string;
  media_type: "image" | "video";
  button_text: string;
  button_link: string;
  enabled: boolean;
  sort_order: number;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  id: string;
  media_url: string;
  media_type: "image" | "video";
  caption: string;
  description: string;
  album: string;
  sort_order: number;
  createdAt: string;
  updatedAt: string;
}

export interface EmailReply {
  id: string;
  name: string;
  text: string;
  createdAt: string;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  fromName: string;
  fromEmail: string;
  subject: string;
  body: string;
  receivedAt: string;
  status: "unread" | "read" | "archived";
  starred: boolean;
  folder: "inbox" | "sent" | "drafts" | "archive" | "trash";
  replies: EmailReply[];
}

export interface Notification {
  id: string;
  kind: string;
  title: string;
  body: string | null;
  link: string | null;
  read: boolean;
  createdAt: string;
}

export interface MediaContent {
  advertVideo: string;
  advertImage: string;
  advertTitle: string;
  advertDescription: string;
  analyticsVideo: string;
  analyticsImage: string;
  analyticsTitle: string;
  analyticsDescription: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  profilePhoto: string;
}

export interface PageContent {
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutBio1: string;
  aboutBio2: string;
  aboutBio3: string;
  aboutQuote: string;
  contactEmail: string;
  contactPhone: string;
}

const PROJECTS_KEY = "trixie_projects";
const POSTS_KEY = "trixie_posts";
const LIKES_KEY = "trixie_liked";
const POST_LIKES_KEY = "trixie_post_liked";
const SETTINGS_KEY = "trixie_settings";
const CONTENT_KEY = "trixie_content";
const MEDIA_KEY = "trixie_media";
const ADVERTISEMENTS_KEY = "trixie_advertisements";
const GALLERY_KEY = "trixie_gallery";
const EMAILS_KEY = "trixie_emails";
const NOTIFICATIONS_KEY = "trixie_notifications";
const STORE_UPDATE_EVENT = "trixie-store-update";
const STORAGE_SYNC_KEYS = [
  PROJECTS_KEY,
  POSTS_KEY,
  LIKES_KEY,
  POST_LIKES_KEY,
  SETTINGS_KEY,
  CONTENT_KEY,
  MEDIA_KEY,
  ADVERTISEMENTS_KEY,
  GALLERY_KEY,
  EMAILS_KEY,
  NOTIFICATIONS_KEY,
];

function emitStoreUpdate() {
  window.dispatchEvent(new Event(STORE_UPDATE_EVENT));
}

function getStoredArray<T>(key: string): T[] {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) as T[] : [];
  } catch {
    return [];
  }
}

async function hydrateFromSupabase<T>(key: string, loader: () => Promise<T[]>) {
  if (typeof window === "undefined") return;
  try {
    const remote = await loader();
    if (remote.length > 0) {
      localStorage.setItem(key, JSON.stringify(remote));
      emitStoreUpdate();
    }
  } catch {
    // ignore remote sync failures and fall back to local storage
  }
}

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (event.storageArea !== localStorage) return;
    if (event.key === null || STORAGE_SYNC_KEYS.includes(event.key)) {
      emitStoreUpdate();
    }
  });
}

function nowISO() {
  return new Date().toISOString();
}

export const projectImageMap: Record<string, string> = {
  "1": "project-school-management",
  "2": "project-analytics-dashboard",
  "3": "project-ecommerce",
};

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "School Management System",
    description: "A complete school administration platform for managing students, teachers, parents, classes, attendance, exams, marks and timetables — with a clean admin dashboard.",
    tech: ["PHP", "MySQL", "JavaScript", "Bootstrap"],
    image: "",
    thumbnail: "",
    screenshots: [],
    demoVideo: "",
    featured: false,
    sortOrder: 1,
    likes: 12,
    comments: [],
    createdAt: nowISO(),
  },
  {
    id: "2",
    title: "Analytics Dashboard",
    description: "Modern business analytics dashboard with revenue tracking, customer insights, campaign performance and real-time reporting for growing teams.",
    tech: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    image: "",
    thumbnail: "",
    screenshots: [],
    demoVideo: "",
    featured: false,
    sortOrder: 2,
    likes: 8,
    comments: [],
    createdAt: nowISO(),
  },
  {
    id: "3",
    title: "Modern E-Commerce Store",
    description: "Minimal, high-conversion e-commerce storefront with product catalog, filters, cart and checkout — designed for speed and simplicity.",
    tech: ["Next.js", "Tailwind", "Stripe", "MongoDB"],
    image: "",
    thumbnail: "",
    screenshots: [],
    demoVideo: "",
    featured: false,
    sortOrder: 3,
    likes: 15,
    comments: [],
    createdAt: nowISO(),
  },
];

const defaultPosts: BlogPost[] = [
  {
    id: "1",
    title: "Building 3D Experiences on the Web",
    content: "The web has evolved beyond flat interfaces. With WebGL and Three.js, we can create immersive 3D experiences that run right in the browser...\n\nThree.js provides an excellent abstraction over WebGL, making it accessible to developers who may not have experience with low-level graphics programming.",
    excerpt: "Exploring the cutting edge of web-based 3D graphics with Three.js and React.",
    tags: ["Three.js", "WebGL", "React"],
    featured_image: "",
    video: "",
    status: "published",
    published_at: nowISO(),
    likes: 0,
    comments: [],
    createdAt: nowISO(),
  },
  {
    id: "2",
    title: "The Future of TypeScript",
    content: "TypeScript continues to evolve at a rapid pace. With each new release, we get more powerful type-level programming capabilities...\n\nThe TypeScript team has been working on some exciting features that will change how we write type-safe code.",
    excerpt: "What's next for TypeScript? A deep dive into upcoming features and type system improvements.",
    tags: ["TypeScript", "JavaScript", "Web Dev"],
    featured_image: "",
    video: "",
    status: "published",
    published_at: nowISO(),
    likes: 0,
    comments: [],
    createdAt: nowISO(),
  },
];

const defaultAdvertisements: Advertisement[] = [
  {
    id: "ad-1",
    title: "Launch Your Next Web App",
    description: "Promote your brand with a polished web presence, high-performance JavaScript, and responsive UX.",
    media_url: "",
    media_type: "image",
    button_text: "View Services",
    button_link: "#projects",
    enabled: true,
    sort_order: 1,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
];

const defaultGallery: GalleryItem[] = [
  {
    id: "gallery-1",
    media_url: "",
    media_type: "image",
    caption: "A clean UI concept for dashboards",
    description: "Screenshot from a responsive analytics dashboard layout built with modern design systems.",
    album: "Designs",
    sort_order: 1,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  },
];

const defaultEmails: EmailMessage[] = [
  {
    id: "email-1",
    threadId: "thread-1",
    fromName: "Grace Hopper",
    fromEmail: "grace@example.com",
    subject: "Quick collaboration question",
    body: "Hi Trixie, I love your portfolio! Would you be available to discuss a mobile app project next week?",
    receivedAt: nowISO(),
    status: "unread",
    starred: false,
    folder: "inbox",
    replies: [],
  },
];

const defaultNotifications: Notification[] = [];

function isSupabaseConfigured() {
  return Boolean(supabase && import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);
}

export function normalizeProjectFromSupabase(row: Record<string, unknown>): Project {
  const tech = Array.isArray(row.tech) ? row.tech.filter((item): item is string => typeof item === "string") : [];
  return {
    id: String(row.id ?? crypto.randomUUID()),
    title: String(row.title ?? "Untitled project"),
    description: String(row.description ?? ""),
    tech,
    image: String((row.thumbnail as string | undefined) ?? ""),
    thumbnail: String((row.thumbnail as string | undefined) ?? ""),
    screenshots: Array.isArray(row.screenshots) ? row.screenshots.filter((item): item is string => typeof item === "string") : [],
    demoVideo: typeof row.demo_video === "string" ? row.demo_video : "",
    featured: Boolean(row.featured),
    sortOrder: Number(row.sort_order ?? 0),
    liveUrl: typeof row.live_url === "string" ? row.live_url : undefined,
    githubUrl: typeof row.github_url === "string" ? row.github_url : undefined,
    likes: 0,
    comments: [],
    createdAt: typeof row.created_at === "string" ? row.created_at : nowISO(),
  };
}

export async function getProjectsFromSupabase(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase.from("projects").select("*").order("sort_order", { ascending: true });
  if (error) {
    console.error("Failed to fetch projects from Supabase", error);
    return [];
  }

  return (data ?? []).map((row) => normalizeProjectFromSupabase(row as Record<string, unknown>));
}

export async function syncProjectsToSupabase(projects: Project[]) {
  if (!isSupabaseConfigured()) return false;

  const rows = projects.map((project) => ({
    id: project.id,
    title: project.title,
    description: project.description,
    tech: project.tech,
    thumbnail: project.image || project.thumbnail || null,
    screenshots: project.screenshots,
    demo_video: project.demoVideo || null,
    github_url: project.githubUrl || null,
    live_url: project.liveUrl || null,
    featured: project.featured,
    sort_order: project.sortOrder,
    created_at: project.createdAt,
    updated_at: nowISO(),
  }));

  const { error } = await supabase.from("projects").upsert(rows, { onConflict: "id" });
  if (error) {
    console.error("Failed to sync projects to Supabase", error);
    return false;
  }

  return true;
}

export function getProjects(): Project[] {
  const stored = localStorage.getItem(PROJECTS_KEY);
  if (stored) {
    const projects = JSON.parse(stored) as Project[];
    const normalized = projects.map(p => ({
      ...p,
      likes: p.likes ?? 0,
      comments: p.comments?.map(c => ({ ...c, status: c.status ?? "approved", replies: c.replies ?? [] })) ?? [],
    }));
    void hydrateFromSupabase(PROJECTS_KEY, getProjectsFromSupabase).catch(() => undefined);
    return normalized;
  }
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(defaultProjects));
  void hydrateFromSupabase(PROJECTS_KEY, getProjectsFromSupabase).catch(() => undefined);
  return defaultProjects;
}

export function saveProjects(projects: Project[]) {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  emitStoreUpdate();
  void syncProjectsToSupabase(projects).catch(() => undefined);
}

export function addProject(project: Omit<Project, "id" | "createdAt" | "likes" | "comments">) {
  const projects = getProjects();
  const newProject: Project = {
    ...project,
    id: crypto.randomUUID(),
    likes: 0,
    comments: [],
    createdAt: nowISO(),
  };
  projects.unshift(newProject);
  saveProjects(projects);
  pushNotification({ kind: "project", title: "New project added", body: newProject.title, link: "/admin/projects" });
  return newProject;
}

export function updateProject(id: string, updates: Partial<Omit<Project, "id" | "createdAt" | "likes" | "comments">>) {
  const projects = getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return;
  projects[idx] = { ...projects[idx], ...updates };
  saveProjects(projects);
}

export function deleteProject(id: string) {
  const projects = getProjects().filter((p) => p.id !== id);
  saveProjects(projects);
}

export function likeProject(id: string): boolean {
  const liked = getLikedProjects();
  if (liked.has(id)) return false;
  const projects = getProjects();
  const project = projects.find(p => p.id === id);
  if (!project) return false;
  project.likes = (project.likes || 0) + 1;
  saveProjects(projects);
  liked.add(id);
  localStorage.setItem(LIKES_KEY, JSON.stringify([...liked]));
  pushNotification({ kind: "like", title: "Project liked", body: project.title, link: "/admin/projects" });
  return true;
}

export function getLikedProjects(): Set<string> {
  const stored = localStorage.getItem(LIKES_KEY);
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

export function addComment(projectId: string, name: string, text: string) {
  const projects = getProjects();
  const project = projects.find(p => p.id === projectId);
  if (!project) return;
  project.comments.push({ id: crypto.randomUUID(), name, text, createdAt: nowISO(), status: "pending", replies: [] });
  saveProjects(projects);
  pushNotification({ kind: "comment", title: "New project comment", body: `${name} on ${project.title}`, link: "/admin/comments" });
}

export function approveProjectComment(projectId: string, commentId: string) {
  updateProjectCommentStatus(projectId, commentId, "approved");
}

export function hideProjectComment(projectId: string, commentId: string) {
  updateProjectCommentStatus(projectId, commentId, "hidden");
}

function updateProjectCommentStatus(projectId: string, commentId: string, status: "approved" | "pending" | "hidden") {
  const projects = getProjects();
  const project = projects.find(p => p.id === projectId);
  if (!project) return;
  const comment = project.comments.find(c => c.id === commentId);
  if (!comment) return;
  comment.status = status;
  saveProjects(projects);
}

export function replyToProjectComment(projectId: string, commentId: string, name: string, text: string) {
  const projects = getProjects();
  const project = projects.find(p => p.id === projectId);
  if (!project) return;
  const comment = project.comments.find(c => c.id === commentId);
  if (!comment) return;
  comment.replies.push({ id: crypto.randomUUID(), name, text, createdAt: nowISO() });
  if (comment.status === "pending") comment.status = "approved";
  saveProjects(projects);
}

export function getPosts(): BlogPost[] {
  const stored = localStorage.getItem(POSTS_KEY);
  if (stored) {
    const posts = JSON.parse(stored) as BlogPost[];
    const normalized = posts.map(p => ({
      ...p,
      likes: p.likes ?? 0,
      comments: p.comments?.map(c => ({ ...c, status: c.status ?? "approved", replies: c.replies ?? [] })) ?? [],
    }));
    void hydrateFromSupabase(POSTS_KEY, getPostsFromSupabase).catch(() => undefined);
    return normalized;
  }
  localStorage.setItem(POSTS_KEY, JSON.stringify(defaultPosts));
  void hydrateFromSupabase(POSTS_KEY, getPostsFromSupabase).catch(() => undefined);
  return defaultPosts;
}

export function savePosts(posts: BlogPost[]) {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
  emitStoreUpdate();
  void syncPostsToSupabase(posts).catch(() => undefined);
}

export function getPublishedPosts(): BlogPost[] {
  return getPosts().filter(post => post.status === "published");
}

export function getDraftPosts(): BlogPost[] {
  return getPosts().filter(post => post.status === "draft");
}

export function normalizePostFromSupabase(row: Record<string, unknown>): BlogPost {
  return {
    id: String(row.id ?? crypto.randomUUID()),
    title: String(row.title ?? "Untitled post"),
    content: String(row.content ?? ""),
    excerpt: typeof row.excerpt === "string" ? row.excerpt : "",
    tags: Array.isArray(row.tags) ? row.tags.filter((item): item is string => typeof item === "string") : [],
    featured_image: typeof row.featured_image === "string" ? row.featured_image : undefined,
    video: typeof row.video === "string" ? row.video : undefined,
    status: (row.status as PostStatus | undefined) ?? "draft",
    published_at: typeof row.published_at === "string" ? row.published_at : undefined,
    likes: 0,
    comments: [],
    createdAt: typeof row.created_at === "string" ? row.created_at : nowISO(),
  };
}

export async function getPostsFromSupabase(): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase.from("posts").select("*").order("created_at", { ascending: false });
  if (error) {
    console.error("Failed to fetch posts from Supabase", error);
    return [];
  }

  return (data ?? []).map((row) => normalizePostFromSupabase(row as Record<string, unknown>));
}

export async function syncPostsToSupabase(posts: BlogPost[]) {
  if (!isSupabaseConfigured()) return false;

  const rows = posts.map((post) => ({
    id: post.id,
    title: post.title,
    content: post.content,
    excerpt: post.excerpt,
    tags: post.tags,
    featured_image: post.featured_image || null,
    video: post.video || null,
    status: post.status,
    published_at: post.published_at || null,
    created_at: post.createdAt,
    updated_at: nowISO(),
  }));

  const { error } = await supabase.from("posts").upsert(rows, { onConflict: "id" });
  if (error) {
    console.error("Failed to sync posts to Supabase", error);
    return false;
  }

  return true;
}

export function addPost(post: Omit<BlogPost, "id" | "createdAt" | "likes" | "comments"> & Partial<Pick<BlogPost, "status" | "published_at">>) {
  const posts = getPosts();
  const newPost: BlogPost = {
    ...post,
    id: crypto.randomUUID(),
    likes: 0,
    comments: [],
    createdAt: nowISO(),
    status: post.status ?? "published",
    published_at: post.published_at ?? (post.status === "published" ? nowISO() : undefined),
  };
  posts.unshift(newPost);
  savePosts(posts);
  pushNotification({ kind: "post", title: "New post created", body: newPost.title, link: "/admin/posts" });
  return newPost;
}

export function deletePost(id: string) {
  const posts = getPosts().filter(post => post.id !== id);
  savePosts(posts);
}

export function likePost(id: string): boolean {
  const liked = getLikedPosts();
  if (liked.has(id)) return false;
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (!post) return false;
  post.likes = (post.likes || 0) + 1;
  savePosts(posts);
  liked.add(id);
  localStorage.setItem(POST_LIKES_KEY, JSON.stringify([...liked]));
  pushNotification({ kind: "like", title: "Post liked", body: post.title, link: "/admin/posts" });
  return true;
}

export function getLikedPosts(): Set<string> {
  const stored = localStorage.getItem(POST_LIKES_KEY);
  return stored ? new Set(JSON.parse(stored)) : new Set();
}

export function updatePost(id: string, updates: Partial<Omit<BlogPost, "id" | "createdAt" | "likes" | "comments">>) {
  const posts = getPosts();
  const idx = posts.findIndex(p => p.id === id);
  if (idx === -1) return;
  posts[idx] = { ...posts[idx], ...updates };
  savePosts(posts);
}

export function publishPost(id: string) {
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (!post) return;
  post.status = "published";
  post.published_at = nowISO();
  savePosts(posts);
  pushNotification({ kind: "post", title: "Post published", body: post.title, link: "/admin/posts" });
}

export function unpublishPost(id: string) {
  const posts = getPosts();
  const post = posts.find(p => p.id === id);
  if (!post) return;
  post.status = "unpublished";
  post.published_at = undefined;
  savePosts(posts);
}

export function addPostComment(postId: string, name: string, text: string) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  post.comments.push({ id: crypto.randomUUID(), name, text, createdAt: nowISO(), status: "pending", replies: [] });
  savePosts(posts);
  pushNotification({ kind: "comment", title: "New post comment", body: `${name} on ${post.title}`, link: "/admin/comments" });
}

export function approvePostComment(postId: string, commentId: string) {
  updatePostCommentStatus(postId, commentId, "approved");
}

export function hidePostComment(postId: string, commentId: string) {
  updatePostCommentStatus(postId, commentId, "hidden");
}

function updatePostCommentStatus(postId: string, commentId: string, status: "approved" | "pending" | "hidden") {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  const comment = post.comments.find(c => c.id === commentId);
  if (!comment) return;
  comment.status = status;
  savePosts(posts);
}

export function replyToPostComment(postId: string, commentId: string, name: string, text: string) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  const comment = post.comments.find(c => c.id === commentId);
  if (!comment) return;
  comment.replies.push({ id: crypto.randomUUID(), name, text, createdAt: nowISO() });
  if (comment.status === "pending") comment.status = "approved";
  savePosts(posts);
}

export function deletePostComment(postId: string, commentId: string) {
  const posts = getPosts();
  const post = posts.find(p => p.id === postId);
  if (!post) return;
  post.comments = post.comments.filter(c => c.id !== commentId);
  savePosts(posts);
}

export function normalizeAdvertisementFromSupabase(row: Record<string, unknown>): Advertisement {
  return {
    id: String(row.id ?? crypto.randomUUID()),
    title: String(row.title ?? "Untitled advertisement"),
    description: String(row.description ?? ""),
    media_url: String(row.media_url ?? ""),
    media_type: (row.media_type as Advertisement["media_type"] | undefined) ?? "image",
    button_text: String(row.button_text ?? ""),
    button_link: String(row.button_link ?? ""),
    enabled: Boolean(row.enabled),
    sort_order: Number(row.sort_order ?? 0),
    createdAt: typeof row.created_at === "string" ? row.created_at : nowISO(),
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : nowISO(),
  };
}

export async function getAdvertisementsFromSupabase(): Promise<Advertisement[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase.from("advertisements").select("*").order("sort_order", { ascending: true });
  if (error) {
    console.error("Failed to fetch advertisements from Supabase", error);
    return [];
  }

  return (data ?? []).map((row) => normalizeAdvertisementFromSupabase(row as Record<string, unknown>));
}

export async function syncAdvertisementsToSupabase(advertisements: Advertisement[]) {
  if (!isSupabaseConfigured()) return false;

  const rows = advertisements.map((ad) => ({
    id: ad.id,
    title: ad.title,
    description: ad.description,
    media_url: ad.media_url,
    media_type: ad.media_type,
    button_text: ad.button_text,
    button_link: ad.button_link,
    enabled: ad.enabled,
    sort_order: ad.sort_order,
    created_at: ad.createdAt,
    updated_at: ad.updatedAt,
  }));

  const { error } = await supabase.from("advertisements").upsert(rows, { onConflict: "id" });
  if (error) {
    console.error("Failed to sync advertisements to Supabase", error);
    return false;
  }

  return true;
}

export function getAdvertisements(): Advertisement[] {
  const stored = localStorage.getItem(ADVERTISEMENTS_KEY);
  if (stored) {
    const adverts = JSON.parse(stored) as Advertisement[];
    const sorted = adverts.sort((a, b) => a.sort_order - b.sort_order);
    void hydrateFromSupabase(ADVERTISEMENTS_KEY, getAdvertisementsFromSupabase).catch(() => undefined);
    return sorted;
  }
  localStorage.setItem(ADVERTISEMENTS_KEY, JSON.stringify(defaultAdvertisements));
  void hydrateFromSupabase(ADVERTISEMENTS_KEY, getAdvertisementsFromSupabase).catch(() => undefined);
  return defaultAdvertisements;
}

export function saveAdvertisements(adverts: Advertisement[]) {
  localStorage.setItem(ADVERTISEMENTS_KEY, JSON.stringify(adverts));
  emitStoreUpdate();
  void syncAdvertisementsToSupabase(adverts).catch(() => undefined);
}

export function addAdvertisement(ad: Omit<Advertisement, "id" | "createdAt" | "updatedAt">) {
  const adverts = getAdvertisements();
  const sortOrder = ad.sort_order ?? (adverts.length + 1);
  const newAdvert: Advertisement = {
    ...ad,
    id: crypto.randomUUID(),
    sort_order: sortOrder,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  adverts.unshift(newAdvert);
  saveAdvertisements(adverts);
  pushNotification({ kind: "advertisement", title: "New advertisement added", body: newAdvert.title, link: "/admin/advertisements" });
  return newAdvert;
}

export function updateAdvertisement(id: string, updates: Partial<Omit<Advertisement, "id" | "createdAt">>) {
  const adverts = getAdvertisements();
  const idx = adverts.findIndex(a => a.id === id);
  if (idx === -1) return;
  adverts[idx] = { ...adverts[idx], ...updates, updatedAt: nowISO() };
  saveAdvertisements(adverts);
}

export function deleteAdvertisement(id: string) {
  const adverts = getAdvertisements().filter((a) => a.id !== id);
  saveAdvertisements(adverts);
}

export function toggleAdvertisementEnabled(id: string, enabled: boolean) {
  updateAdvertisement(id, { enabled });
}

export function setAdvertisementOrder(id: string, sort_order: number) {
  const adverts = getAdvertisements();
  const item = adverts.find(a => a.id === id);
  if (!item) return;
  item.sort_order = sort_order;
  saveAdvertisements(adverts.sort((a, b) => a.sort_order - b.sort_order));
}

export function normalizeGalleryItemFromSupabase(row: Record<string, unknown>): GalleryItem {
  return {
    id: String(row.id ?? crypto.randomUUID()),
    media_url: String(row.media_url ?? ""),
    media_type: (row.media_type as GalleryItem["media_type"] | undefined) ?? "image",
    caption: String(row.caption ?? ""),
    description: String(row.description ?? ""),
    album: String(row.album ?? ""),
    sort_order: Number(row.sort_order ?? 0),
    createdAt: typeof row.created_at === "string" ? row.created_at : nowISO(),
    updatedAt: typeof row.updated_at === "string" ? row.updated_at : nowISO(),
  };
}

export async function getGalleryItemsFromSupabase(): Promise<GalleryItem[]> {
  if (!isSupabaseConfigured()) return [];

  const { data, error } = await supabase.from("gallery_items").select("*").order("sort_order", { ascending: true });
  if (error) {
    console.error("Failed to fetch gallery items from Supabase", error);
    return [];
  }

  return (data ?? []).map((row) => normalizeGalleryItemFromSupabase(row as Record<string, unknown>));
}

export async function syncGalleryItemsToSupabase(items: GalleryItem[]) {
  if (!isSupabaseConfigured()) return false;

  const rows = items.map((item) => ({
    id: item.id,
    media_url: item.media_url,
    media_type: item.media_type,
    caption: item.caption,
    description: item.description,
    album: item.album,
    sort_order: item.sort_order,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  }));

  const { error } = await supabase.from("gallery_items").upsert(rows, { onConflict: "id" });
  if (error) {
    console.error("Failed to sync gallery items to Supabase", error);
    return false;
  }

  return true;
}

export function getGalleryItems(): GalleryItem[] {
  const stored = localStorage.getItem(GALLERY_KEY);
  if (stored) {
    const items = JSON.parse(stored) as GalleryItem[];
    const sorted = items.sort((a, b) => a.sort_order - b.sort_order);
    void hydrateFromSupabase(GALLERY_KEY, getGalleryItemsFromSupabase).catch(() => undefined);
    return sorted;
  }
  localStorage.setItem(GALLERY_KEY, JSON.stringify(defaultGallery));
  void hydrateFromSupabase(GALLERY_KEY, getGalleryItemsFromSupabase).catch(() => undefined);
  return defaultGallery;
}

export function saveGalleryItems(items: GalleryItem[]) {
  localStorage.setItem(GALLERY_KEY, JSON.stringify(items));
  emitStoreUpdate();
  void syncGalleryItemsToSupabase(items).catch(() => undefined);
}

export function addGalleryItem(item: Omit<GalleryItem, "id" | "createdAt" | "updatedAt">) {
  const items = getGalleryItems();
  const sortOrder = item.sort_order ?? (items.length + 1);
  const newItem: GalleryItem = {
    ...item,
    id: crypto.randomUUID(),
    sort_order: sortOrder,
    createdAt: nowISO(),
    updatedAt: nowISO(),
  };
  items.unshift(newItem);
  saveGalleryItems(items);
  pushNotification({ kind: "gallery", title: "Gallery upload completed", body: newItem.caption, link: "/admin/gallery" });
  return newItem;
}

export function updateGalleryItem(id: string, updates: Partial<Omit<GalleryItem, "id" | "createdAt">>) {
  const items = getGalleryItems();
  const idx = items.findIndex(i => i.id === id);
  if (idx === -1) return;
  items[idx] = { ...items[idx], ...updates, updatedAt: nowISO() };
  saveGalleryItems(items);
}

export function deleteGalleryItem(id: string) {
  const items = getGalleryItems().filter((i) => i.id !== id);
  saveGalleryItems(items);
}

export function setGalleryItemOrder(id: string, sort_order: number) {
  const items = getGalleryItems();
  const item = items.find(i => i.id === id);
  if (!item) return;
  item.sort_order = sort_order;
  saveGalleryItems(items.sort((a, b) => a.sort_order - b.sort_order));
}

export function getEmails(): EmailMessage[] {
  const stored = localStorage.getItem(EMAILS_KEY);
  if (stored) {
    return JSON.parse(stored) as EmailMessage[];
  }
  localStorage.setItem(EMAILS_KEY, JSON.stringify(defaultEmails));
  return defaultEmails;
}

export function saveEmails(emails: EmailMessage[]) {
  localStorage.setItem(EMAILS_KEY, JSON.stringify(emails));
  emitStoreUpdate();
}

export function addEmail(email: Omit<EmailMessage, "id" | "receivedAt" | "replies"> & { replies?: EmailReply[] }) {
  const emails = getEmails();
  const newEmail: EmailMessage = {
    ...email,
    id: crypto.randomUUID(),
    receivedAt: email.receivedAt || nowISO(),
    replies: email.replies ?? [],
  } as EmailMessage;
  emails.unshift(newEmail);
  saveEmails(emails);
  if (newEmail.folder === "inbox" && newEmail.status === "unread") {
    pushNotification({ kind: "email", title: "New email received", body: newEmail.subject, link: "/admin/emails" });
  }
  return newEmail;
}

export function updateEmail(id: string, updates: Partial<Omit<EmailMessage, "id" | "receivedAt">>) {
  const emails = getEmails();
  const idx = emails.findIndex(e => e.id === id);
  if (idx === -1) return;
  emails[idx] = { ...emails[idx], ...updates };
  saveEmails(emails);
}

export function deleteEmail(id: string) {
  const emails = getEmails().filter(e => e.id !== id);
  saveEmails(emails);
}

export function markEmailRead(id: string, read: boolean) {
  updateEmail(id, { status: read ? "read" : "unread" });
}

export function toggleStarEmail(id: string) {
  const emails = getEmails();
  const email = emails.find(e => e.id === id);
  if (!email) return;
  email.starred = !email.starred;
  saveEmails(emails);
}

export function archiveEmail(id: string) {
  updateEmail(id, { folder: "archive", status: "archived" });
}

export function moveEmailToTrash(id: string) {
  updateEmail(id, { folder: "trash" });
}

export function createEmailDraft(draft: Omit<EmailMessage, "id" | "receivedAt" | "replies" | "folder" | "status">) {
  return addEmail({ ...draft, folder: "drafts", status: "read", receivedAt: nowISO(), replies: [] });
}

export function sendEmailReply(threadId: string, name: string, text: string) {
  const emails = getEmails();
  const thread = emails.filter(e => e.threadId === threadId);
  const original = thread.find(e => e.folder === "inbox" || e.folder === "sent") || thread[0];
  if (!original) return;
  const reply: EmailReply = { id: crypto.randomUUID(), name, text, createdAt: nowISO() };
  const inboxMessage = emails.find(e => e.threadId === threadId && e.folder === "inbox");
  if (inboxMessage) {
    inboxMessage.replies.push(reply);
    inboxMessage.status = "read";
  }
  const sent = addEmail({
    threadId,
    fromName: "Trixie Tech",
    fromEmail: original.fromEmail,
    subject: `Re: ${original.subject}`,
    body: text,
    receivedAt: nowISO(),
    status: "read",
    starred: false,
    folder: "sent",
    replies: [reply],
  });
  saveEmails(emails);
  return sent;
}

export function forwardEmail(threadId: string, name: string, text: string) {
  const emails = getEmails();
  const original = emails.find(e => e.threadId === threadId && e.folder === "inbox");
  if (!original) return;
  const sent = addEmail({
    threadId,
    fromName: name,
    fromEmail: original.fromEmail,
    subject: `Fwd: ${original.subject}`,
    body: `${text}\n\n--- Forwarded message ---\n${original.body}`,
    receivedAt: nowISO(),
    status: "read",
    starred: false,
    folder: "sent",
    replies: [],
  });
  return sent;
}

export function createInboxEmailFromContact(payload: { name: string; email: string; topic: string; message: string }) {
  return addEmail({
    threadId: crypto.randomUUID(),
    fromName: payload.name,
    fromEmail: payload.email,
    subject: `Contact: ${payload.topic}`,
    body: payload.message,
    receivedAt: nowISO(),
    status: "unread",
    starred: false,
    folder: "inbox",
    replies: [],
  });
}

export function getNotifications(): Notification[] {
  const stored = localStorage.getItem(NOTIFICATIONS_KEY);
  if (stored) {
    return JSON.parse(stored) as Notification[];
  }
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(defaultNotifications));
  return defaultNotifications;
}

export function saveNotifications(notifications: Notification[]) {
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  emitStoreUpdate();
}

export function pushNotification(notification: Omit<Notification, "id" | "createdAt">) {
  const notifications = getNotifications();
  const item: Notification = {
    id: crypto.randomUUID(),
    createdAt: nowISO(),
    read: false,
    ...notification,
  };
  notifications.unshift(item);
  saveNotifications(notifications);
  return item;
}

export function markNotificationRead(id: string) {
  const notifications = getNotifications();
  const note = notifications.find(n => n.id === id);
  if (!note) return;
  note.read = true;
  saveNotifications(notifications);
}

export function clearNotifications() {
  saveNotifications([]);
}

const defaultContent: PageContent = {
  heroTitle: "Trixie",
  heroSubtitle: "Software Engineer",
  heroDescription: "I craft elegant, high-performance software experiences. From scalable backends to immersive 3D frontends — I build the future of the web.",
  aboutBio1: "I'm a software engineer who thrives at the intersection of creativity and technology. I specialize in building high-performance web applications, immersive 3D experiences, and scalable backend systems.",
  aboutBio2: "From crafting pixel-perfect frontends with React and Three.js to architecting robust microservices — I love turning complex problems into elegant solutions.",
  aboutBio3: "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.",
  aboutQuote: "The best code is the one that makes people smile.",
  contactEmail: "trixietech17@gmail.com",
  contactPhone: "0769896120",
};

export function getSettings(): SiteSettings {
  const stored = localStorage.getItem(SETTINGS_KEY);
  if (stored) return JSON.parse(stored);
  const defaults: SiteSettings = { siteName: "Trixie.tech", tagline: "Software Engineer", profilePhoto: "" };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults));
  return defaults;
}

export function saveSettings(settings: SiteSettings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  emitStoreUpdate();
}

export function getContent(): PageContent {
  const stored = localStorage.getItem(CONTENT_KEY);
  if (stored) return JSON.parse(stored);
  localStorage.setItem(CONTENT_KEY, JSON.stringify(defaultContent));
  return defaultContent;
}

export function saveContent(content: PageContent) {
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  emitStoreUpdate();
}

const defaultMedia: MediaContent = {
  advertVideo: "",
  advertImage: "",
  advertTitle: "Trixie Tech — Advert",
  advertDescription: "Watch how Trixie Tech transforms ideas into elegant digital experiences. Software, web design, portfolios, and ride-hailing solutions — all in one place.",
  analyticsVideo: "",
  analyticsImage: "",
  analyticsTitle: "📊 Analytics & Growth",
  analyticsDescription: "See how data-driven design and engineering at Trixie Tech accelerate growth — measurable performance, real impact.",
};

export function getMedia(): MediaContent {
  const stored = localStorage.getItem(MEDIA_KEY);
  if (stored) {
    const parsed = JSON.parse(stored) as Partial<MediaContent>;
    return {
      ...defaultMedia,
      ...parsed,
      advertVideo: parsed.advertVideo ?? defaultMedia.advertVideo,
      advertImage: parsed.advertImage ?? defaultMedia.advertImage,
      analyticsVideo: parsed.analyticsVideo ?? defaultMedia.analyticsVideo,
      analyticsImage: parsed.analyticsImage ?? defaultMedia.analyticsImage,
    };
  }
  localStorage.setItem(MEDIA_KEY, JSON.stringify(defaultMedia));
  return defaultMedia;
}

export function saveMedia(media: MediaContent) {
  localStorage.setItem(MEDIA_KEY, JSON.stringify(media));
  emitStoreUpdate();
}
