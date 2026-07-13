import { motion } from "framer-motion";
import { Code2, Layers, Zap, Cpu, Database, Globe, Terminal, Sparkles, Server, Download, Upload } from "lucide-react";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import aboutPhotoAsset from "@/assets/trixie-about-photo.jpg.asset.json";
import { getSettings, getContent } from "@/lib/store";
import { useRef } from "react";

const timeline = [
  { year: "2024", title: "Senior Software Engineer", desc: "Building cutting-edge web applications and 3D experiences" },
  { year: "2023", title: "Full-Stack Developer", desc: "Developed scalable microservices and cloud-native applications" },
  { year: "2022", title: "Frontend Engineer", desc: "Crafted immersive UI/UX experiences with React and Three.js" },
  { year: "2021", title: "Started Coding Journey", desc: "Fell in love with programming and never looked back" },
];

const techStack = [
  { icon: Code2, name: "React / HTML / CSS / JS", level: 95 },
  { icon: Layers, name: "TypeScript", level: 90 },
  { icon: Zap, name: "Three.js / WebGL", level: 85 },
  { icon: Database, name: "MySQL / PostgreSQL / MongoDB", level: 88 },
  { icon: Server, name: "PHP / Node.js / Python", level: 85 },
  { icon: Cpu, name: "Cloud / DevOps / Docker", level: 80 },
  { icon: Globe, name: "UI/UX Design", level: 82 },
];

const RESUME_KEY = "trixie_resume";

export default function About() {
  const settings = getSettings();
  const content = getContent();
  const photoSrc = settings.profilePhoto || aboutPhotoAsset.url;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storedResume = localStorage.getItem(RESUME_KEY);

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      localStorage.setItem(RESUME_KEY, ev.target?.result as string);
      localStorage.setItem(RESUME_KEY + "_name", file.name);
      window.location.reload();
    };
    reader.readAsDataURL(file);
  };

  const handleDownload = () => {
    const data = localStorage.getItem(RESUME_KEY);
    const name = localStorage.getItem(RESUME_KEY + "_name") || "Trixie_Resume.pdf";
    if (!data) return;
    const link = document.createElement("a");
    link.href = data;
    link.download = name;
    link.click();
  };

  return (
    <Layout>
      <PageTransition>
        <section className="py-24">
          <div className="container mx-auto px-6">
            {/* Header */}
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-primary font-mono text-sm mb-3 tracking-widest uppercase">{"// About Me"}</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                The <span className="gradient-text">Developer</span> Behind the Code
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Passionate about crafting digital experiences that push boundaries.
              </p>
            </motion.div>

            {/* Resume Download */}
            {storedResume && (
              <motion.div
                className="flex justify-center mb-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:neon-glow transition-all"
                >
                  <Download className="h-4 w-4" /> Download Resume / CV
                </button>
              </motion.div>
            )}

            {/* Hero photo + Bio */}
            <motion.div
              className="glass rounded-2xl neon-border mb-20 max-w-4xl mx-auto overflow-hidden"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid md:grid-cols-5 gap-0">
                <div className="md:col-span-2 relative">
                  <img
                    src={photoSrc}
                    alt="Trixie Wangui — Software Engineer"
                    className="w-full h-full object-cover min-h-[300px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80 hidden md:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent md:hidden" />
                </div>
                <div className="md:col-span-3 p-8 md:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-4">
                    <Terminal className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-bold">Hey, I'm <span className="neon-text">Trixie Wangui</span></h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed mb-4">{content.aboutBio1}</p>
                  <p className="text-muted-foreground leading-relaxed mb-4">{content.aboutBio2}</p>
                  <p className="text-muted-foreground leading-relaxed">{content.aboutBio3}</p>
                </div>
              </div>
            </motion.div>

            {/* Tech Stack */}
            <motion.div className="mb-20" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-10 text-center">
                Tech <span className="neon-text">Stack</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                {techStack.map((tech, i) => (
                  <motion.div
                    key={tech.name}
                    className="glass rounded-xl p-5 neon-border group"
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <tech.icon className="h-5 w-5 text-primary" />
                      <span className="font-medium text-sm">{tech.name}</span>
                      <span className="ml-auto text-xs text-primary font-mono">{tech.level}%</span>
                    </div>
                    <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${tech.level}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 + i * 0.1, duration: 0.8 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-bold mb-10 text-center">
                My <span className="neon-text">Journey</span>
              </h2>
              <div className="max-w-2xl mx-auto space-y-6">
                {timeline.map((item, i) => (
                  <motion.div
                    key={item.year}
                    className="flex gap-6 items-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_hsl(var(--primary))]" />
                      {i < timeline.length - 1 && <div className="w-px h-16 bg-border/50" />}
                    </div>
                    <div className="glass rounded-lg p-4 neon-border flex-1 -mt-1">
                      <span className="text-xs text-primary font-mono">{item.year}</span>
                      <h3 className="font-semibold mt-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Fun fact */}
            <motion.div
              className="mt-20 text-center glass rounded-2xl p-8 neon-border max-w-md mx-auto"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
            >
              <Sparkles className="h-8 w-8 text-primary mx-auto mb-3" />
              <p className="text-muted-foreground italic">"{content.aboutQuote}"</p>
              <p className="text-primary font-mono text-sm mt-2">— Trixie</p>
            </motion.div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}
