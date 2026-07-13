import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Send } from "lucide-react";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import { getProjects, likeProject, addComment, getLikedProjects, projectImageMap, type Project } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Import project screenshots (real, light-mode)
import schoolAsset from "@/assets/project-school-management.jpg.asset.json";
import analyticsImg from "@/assets/project-analytics-dashboard.jpg";
import ecommerceImg from "@/assets/project-ecommerce.jpg";

const imageAssets: Record<string, string> = {
  "project-school-management": schoolAsset.url,
  "project-analytics-dashboard": analyticsImg,
  "project-ecommerce": ecommerceImg,
};

function getProjectImage(project: Project): string | null {
  if (project.image) return project.image;
  const key = projectImageMap[project.id];
  if (key && imageAssets[key]) return imageAssets[key];
  if (/school management/i.test(project.title)) return imageAssets["project-school-management"];
  if (/analytics dashboard/i.test(project.title)) return imageAssets["project-analytics-dashboard"];
  if (/e-?commerce/i.test(project.title)) return imageAssets["project-ecommerce"];
  return null;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(getProjects);
  const [likedSet, setLikedSet] = useState<Set<string>>(() => getLikedProjects());
  const [openComments, setOpenComments] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState({ name: "", text: "" });

  useEffect(() => {
    const syncProjects = () => {
      setProjects(getProjects());
      setLikedSet(getLikedProjects());
    };

    syncProjects();
    window.addEventListener("trixie-store-update", syncProjects);
    return () => window.removeEventListener("trixie-store-update", syncProjects);
  }, []);

  const handleLike = (id: string) => {
    if (likeProject(id)) {
      setProjects(getProjects());
      setLikedSet(getLikedProjects());
    }
  };

  const handleComment = (projectId: string) => {
    if (!commentForm.name.trim() || !commentForm.text.trim()) return;
    addComment(projectId, commentForm.name, commentForm.text);
    setProjects(getProjects());
    setCommentForm({ name: "", text: "" });
  };

  return (
    <Layout>
      <PageTransition>
        <section className="py-24">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-primary font-mono text-sm mb-3 tracking-widest uppercase">{"// Portfolio"}</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                My <span className="gradient-text">Projects</span>
              </h1>
              <p className="text-muted-foreground max-w-md mx-auto">
                A collection of things I've built — from production apps to experimental prototypes.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => {
                const img = getProjectImage(project);
                return (
                  <motion.div
                    key={project.id}
                    className="glass rounded-xl overflow-hidden hover-glow neon-border group flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="h-48 relative overflow-hidden bg-black">
                      {project.video ? (
                        <video
                          src={project.video}
                          controls
                          playsInline
                          poster={img || undefined}
                          className="w-full h-full object-cover"
                        />
                      ) : img ? (
                        <img
                          src={img}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/20 via-accent/10 to-background flex items-center justify-center">
                          <span className="text-4xl font-bold text-primary/30 group-hover:text-primary/50 transition-colors font-mono">
                            {`<${project.title.split(" ")[0]} />`}
                          </span>
                        </div>
                      )}
                      {!project.video && <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-transparent to-transparent pointer-events-none" />}
                    </div>
                    <div className="p-6 flex flex-col flex-1">
                      <h3 className="text-xl font-semibold mb-2 group-hover:neon-text transition-all">
                        {project.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-4 flex-1">
                        {project.description}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.tech.map((t) => (
                          <span
                            key={t}
                            className="text-xs px-2 py-1 rounded-full border bg-secondary/50 text-secondary-foreground border-border/50"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3 pt-2 border-t border-border/30">
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={() => handleLike(project.id)}
                            className={`inline-flex items-center gap-1 text-sm transition-colors ${
                              likedSet.has(project.id) ? "text-neon-pink" : "text-muted-foreground hover:text-neon-pink"
                            }`}
                          >
                            <Heart className={`h-4 w-4 ${likedSet.has(project.id) ? "fill-current" : ""}`} />
                            {project.likes || 0}
                          </button>
                          <button
                            onClick={() => setOpenComments(openComments === project.id ? null : project.id)}
                            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                          >
                            <MessageCircle className="h-4 w-4" />
                            {project.comments?.length || 0}
                          </button>
                        </div>
                      </div>

                      {openComments === project.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-3 border-t border-border/30 space-y-3"
                        >
                          {project.comments?.length > 0 && (
                            <div className="space-y-2 max-h-40 overflow-y-auto">
                              {project.comments.map((c) => (
                                <div key={c.id} className="bg-secondary/50 rounded-lg p-2.5">
                                  <p className="text-xs font-semibold text-primary">{c.name}</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">{c.text}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-2">
                            <Input
                              placeholder="Name"
                              value={commentForm.name}
                              onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                              className="bg-secondary/50 border-border/50 h-8 text-xs"
                            />
                            <Input
                              placeholder="Comment..."
                              value={commentForm.text}
                              onChange={(e) => setCommentForm({ ...commentForm, text: e.target.value })}
                              className="bg-secondary/50 border-border/50 h-8 text-xs flex-1"
                              onKeyDown={(e) => e.key === "Enter" && handleComment(project.id)}
                            />
                            <Button size="sm" className="h-8 px-2" onClick={() => handleComment(project.id)}>
                              <Send className="h-3 w-3" />
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {projects.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                No projects yet. Add some from the admin panel!
              </div>
            )}
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}
