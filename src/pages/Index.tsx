import { lazy, Suspense, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Code2, Layers, Zap, Github, Linkedin, Mail, Globe, Database, Server, Video as VideoIcon, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import AIChatWidget from "@/components/AIChatWidget";
import { getContent, getMedia, getAdvertisements } from "@/lib/store";
import trixiePoster from "@/assets/trixietech-poster.png.asset.json";


const Hero3D = lazy(() => import("@/components/Hero3D"));

const skills = [
  { icon: Code2, label: "Full-Stack Development", desc: "HTML, CSS, JavaScript, React, Node.js, Python, Go" },
  { icon: Database, label: "Backend & Databases", desc: "PHP, MySQL, PostgreSQL, MongoDB, REST APIs" },
  { icon: Layers, label: "System Architecture", desc: "Microservices, Docker, Kubernetes, Cloud, DevOps" },
  { icon: Zap, label: "3D & Creative Coding", desc: "Three.js, WebGL, Shaders, Animations" },
];

function TypewriterText({ text, className }: { text: string; className?: string }) {
  const [displayed, setDisplayed] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeout = setTimeout(() => {
        setDisplayed(prev => prev + text[index]);
        setIndex(i => i + 1);
      }, 60);
      return () => clearTimeout(timeout);
    }
  }, [index, text]);

  return (
    <span className={className}>
      {displayed}
      {index < text.length && <span className="animate-pulse text-primary">|</span>}
    </span>
  );
}

export default function Index() {
  const [content, setContent] = useState(getContent);
  const [media, setMedia] = useState(getMedia);
  const [advertisements, setAdvertisements] = useState(getAdvertisements);
  const heroLine = `Hi, I'm ${content.heroTitle} — ${content.heroSubtitle}`;

  useEffect(() => {
    const syncContent = () => {
      setContent(getContent());
      setMedia(getMedia());
    };

    const sync = () => {
      setContent(getContent());
      setMedia(getMedia());
      setAdvertisements(getAdvertisements());
    };

    sync();
    window.addEventListener("trixie-store-update", sync);
    return () => window.removeEventListener("trixie-store-update", sync);
  }, []);

  return (
    <Layout>
      <PageTransition>
        {/* Hero */}
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
          <Suspense fallback={null}>
            <Hero3D />
          </Suspense>
          <div className="container mx-auto px-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <motion.div className="max-w-2xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <motion.p className="text-primary font-mono text-sm mb-4 tracking-widest uppercase" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  {"// " + content.heroSubtitle}
                </motion.p>
                <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  <TypewriterText text={heroLine} />
                </h1>
                <motion.p className="text-lg text-muted-foreground mb-8 max-w-lg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                  {content.heroDescription}
                </motion.p>
                <motion.div className="flex flex-wrap gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}>
                  <Link to="/projects" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:neon-glow transition-all">
                    View Projects <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link to="/blog" className="inline-flex items-center gap-2 px-6 py-3 glass rounded-lg font-medium text-foreground hover-glow neon-border">
                    Read Blog
                  </Link>
                </motion.div>
              </motion.div>

              {/* AI Chat placeholder area on right side */}
              <motion.div
                className="hidden md:flex items-center justify-center"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <div className="glass rounded-2xl neon-border p-6 w-full max-w-sm text-center hover-glow cursor-pointer" onClick={() => {
                  const chatBtn = document.querySelector('[data-chat-open]') as HTMLButtonElement;
                  if (chatBtn) chatBtn.click();
                }}>
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Chat with <span className="neon-text">Trixie AI</span></h3>
                  <p className="text-sm text-muted-foreground">Click the chat bubble below to ask about my projects, skills, services, or get in touch!</p>
                </div>
              </motion.div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
        </section>

        {/* Skills */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <motion.h2 className="text-3xl font-bold mb-12 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              What I <span className="neon-text">Do</span>
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skills.map((skill, i) => (
                <motion.div key={skill.label} className="glass rounded-xl p-8 hover-glow neon-border group" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                  <skill.icon className="h-10 w-10 text-primary mb-4 group-hover:drop-shadow-[0_0_10px_hsl(185,80%,55%)] transition-all" />
                  <h3 className="text-xl font-semibold mb-2">{skill.label}</h3>
                  <p className="text-muted-foreground text-sm">{skill.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trixie Tech Advert */}
        <section className="py-20 bg-gradient-to-b from-background via-primary/5 to-background">
          <div className="container mx-auto px-6">
            <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-primary font-mono text-sm mb-3 tracking-widest uppercase flex items-center justify-center gap-2">
                <VideoIcon className="h-4 w-4" /> {"// Featured"}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-3"><span className="gradient-text">{media.advertTitle}</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{media.advertDescription}</p>
              {advertisements.filter((ad) => ad.enabled).length > 0 && (
                <div className="mt-6 flex flex-wrap justify-center gap-4">
                  {advertisements.filter((ad) => ad.enabled).map((ad) => (
                    <a key={ad.id} href={ad.button_link} className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full text-sm font-medium hover:neon-glow transition-all" target="_blank" rel="noreferrer">
                      {ad.button_text || "Learn More"}
                    </a>
                  ))}
                </div>
              )}
            </motion.div>
            <motion.div
              className="max-w-4xl mx-auto glass rounded-2xl neon-border overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {media.advertVideo ? (
                <video src={media.advertVideo} controls playsInline className="w-full aspect-video bg-black" />
              ) : media.advertImage ? (
                <img src={media.advertImage} alt="TrixieTech advert" className="w-full h-auto object-cover" />
              ) : (
                <img src={trixiePoster.url} alt="TrixieTech — Software. Websites. Apps. Systems. Solved." className="w-full h-auto object-cover" />
              )}
            </motion.div>
          </div>
        </section>

        {/* Analytics & Growth */}
        <section className="py-20">
          <div className="container mx-auto px-6">
            <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <p className="text-accent font-mono text-sm mb-3 tracking-widest uppercase flex items-center justify-center gap-2">
                <BarChart3 className="h-4 w-4" /> {"// Insights"}
              </p>
              <h2 className="text-3xl md:text-4xl font-bold mb-3"><span className="neon-text">{media.analyticsTitle}</span></h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">{media.analyticsDescription}</p>
            </motion.div>
            <motion.div
              className="max-w-4xl mx-auto glass rounded-2xl neon-border overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              {media.analyticsVideo ? (
                <video src={media.analyticsVideo} controls playsInline className="w-full aspect-video bg-black" />
              ) : media.analyticsImage ? (
                <img src={media.analyticsImage} alt="Analytics media" className="w-full aspect-video object-cover" />
              ) : (
                <div className="w-full aspect-video bg-black" />
              )}
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/30 py-12">
          <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-muted-foreground text-sm">© {new Date().getFullYear()} Trixie.tech — Built with passion</p>
            <div className="flex items-center gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Linkedin className="h-5 w-5" /></a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Mail className="h-5 w-5" /></a>
            </div>
          </div>
        </footer>

        <AIChatWidget />
      </PageTransition>
    </Layout>
  );
}
