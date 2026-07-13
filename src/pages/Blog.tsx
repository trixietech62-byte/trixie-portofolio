import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Tag, Trash2, Heart, MessageCircle, Send } from "lucide-react";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import { getPublishedPosts, deletePost, addPost, likePost, getLikedPosts, addPostComment, type BlogPost } from "@/lib/store";
import { toast } from "sonner";

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>(getPublishedPosts);
  const [liked, setLiked] = useState<Set<string>>(getLikedPosts);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentsOpen, setCommentsOpen] = useState<string | null>(null);
  const [commentName, setCommentName] = useState("");
  const [commentText, setCommentText] = useState("");

  const handleAdd = () => {
    if (!title.trim() || !content.trim()) { toast.error("Title and content are required"); return; }
    addPost({ title, content, excerpt: excerpt || content.slice(0, 120) + "...", tags: tags.split(",").map(t => t.trim()).filter(Boolean) });
    setPosts(getPosts());
    setTitle(""); setContent(""); setExcerpt(""); setTags("");
    setShowForm(false);
    toast.success("Post published!");
  };

  const handleDelete = (id: string) => { deletePost(id); setPosts(getPosts()); toast.success("Post deleted"); };

  const handleLike = (id: string) => {
    if (liked.has(id)) { toast.info("You already liked this post"); return; }
    if (likePost(id)) {
      setPosts(getPosts());
      setLiked(getLikedPosts());
      toast.success("Thanks for the love!");
    }
  };

  const handleComment = (id: string) => {
    if (!commentName.trim() || !commentText.trim()) { toast.error("Name and comment required"); return; }
    addPostComment(id, commentName.trim(), commentText.trim());
    setCommentName(""); setCommentText("");
    setPosts(getPosts());
    toast.success("Comment posted!");
  };

  return (
    <Layout>
      <PageTransition>
        <section className="py-24">
          <div className="container mx-auto px-6 max-w-3xl">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-primary font-mono text-sm mb-3 tracking-widest uppercase">{"// Blog"}</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4"><span className="gradient-text">Thoughts</span> & Writes</h1>
              <p className="text-muted-foreground">Ideas, tutorials, and things I've learned along the way.</p>
            </motion.div>

            <div className="mb-8 flex justify-end">
              <button onClick={() => setShowForm(!showForm)} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium text-sm hover:neon-glow transition-all">
                {showForm ? "Cancel" : "+ New Post"}
              </button>
            </div>

            {showForm && (
              <motion.div className="glass rounded-xl p-6 mb-8 neon-border" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <h3 className="text-lg font-semibold mb-4">New Blog Post</h3>
                <div className="space-y-4">
                  <input className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} />
                  <input className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Short excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} />
                  <textarea className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 min-h-[150px]" placeholder="Write your post content..." value={content} onChange={(e) => setContent(e.target.value)} />
                  <input className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="Tags (comma separated)" value={tags} onChange={(e) => setTags(e.target.value)} />
                  <button onClick={handleAdd} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:neon-glow transition-all">Publish Post</button>
                </div>
              </motion.div>
            )}

            <div className="space-y-6">
              {posts.map((post, i) => {
                const isLiked = liked.has(post.id);
                const isCommentsOpen = commentsOpen === post.id;
                return (
                  <motion.article key={post.id} className="glass rounded-xl p-6 hover-glow neon-border group" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 cursor-pointer" onClick={() => setExpandedId(expandedId === post.id ? null : post.id)}>
                        <h2 className="text-xl font-semibold mb-2 group-hover:neon-text transition-all">{post.title}</h2>
                        <p className="text-muted-foreground text-sm mb-3 whitespace-pre-wrap">{expandedId === post.id ? post.content : post.excerpt}</p>
                        <div className="flex items-center flex-wrap gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.createdAt).toLocaleDateString()}</span>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Tag className="h-3 w-3" />
                            {post.tags.map(t => <span key={t} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{t}</span>)}
                          </div>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(post.id); }} className="p-2 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border/50">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${isLiked ? "bg-primary/20 text-primary" : "hover:bg-secondary text-muted-foreground"}`}
                      >
                        <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                        <span>{post.likes}</span>
                      </button>
                      <button
                        onClick={() => setCommentsOpen(isCommentsOpen ? null : post.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-secondary transition-all"
                      >
                        <MessageCircle className="h-4 w-4" />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>

                    {isCommentsOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-4 space-y-3">
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {post.comments.length === 0 && <p className="text-xs text-muted-foreground italic">No comments yet. Be the first!</p>}
                          {post.comments.map(c => (
                            <div key={c.id} className="bg-secondary/50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-primary">{c.name}</span>
                                <span className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</span>
                              </div>
                              <p className="text-sm text-foreground/90">{c.text}</p>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <input
                            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            placeholder="Your name"
                            value={commentName}
                            onChange={(e) => setCommentName(e.target.value)}
                          />
                          <div className="flex gap-2">
                            <input
                              className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                              placeholder="Write a comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              onKeyDown={(e) => { if (e.key === "Enter") handleComment(post.id); }}
                            />
                            <button onClick={() => handleComment(post.id)} className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:neon-glow transition-all">
                              <Send className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.article>
                );
              })}
            </div>

            {posts.length === 0 && <div className="text-center py-20 text-muted-foreground">No posts yet. Write your first one!</div>}
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}
