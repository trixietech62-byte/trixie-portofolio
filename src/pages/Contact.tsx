import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MessageCircle, Send } from "lucide-react";
import Layout from "@/components/Layout";
import PageTransition from "@/components/PageTransition";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendContactEmail } from "@/lib/contact";
import { createInboxEmailFromContact } from "@/lib/store";

const socials = [
  { name: "Twitter / X", url: "https://x.com/trixiewangui", icon: "𝕏" },
  { name: "Instagram", url: "https://instagram.com/trixiewangui", icon: "📸" },
  { name: "TikTok", url: "https://tiktok.com/@trixiewangui", icon: "🎵" },
  { name: "LinkedIn", url: "https://linkedin.com/in/trixiewangui", icon: "💼" },
  { name: "GitHub", url: "https://github.com/trixiewangui", icon: "🐙" },
  { name: "YouTube", url: "https://youtube.com/@trixiewangui", icon: "🎬" },
  { name: "Facebook", url: "https://facebook.com/trixiewangui", icon: "👤" },
];

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", topic: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const result = await sendContactEmail({
      name: form.name,
      email: form.email,
      topic: form.topic,
      message: form.message,
    });

    if (result.success) {
      createInboxEmailFromContact({ name: form.name, email: form.email, topic: form.topic, message: form.message });
      toast({ title: "Message sent", description: result.message });
      setForm({ name: "", email: "", topic: "", message: "" });
    } else {
      toast({ title: "Unable to send", description: result.message, variant: "destructive" });
    }

    setIsSubmitting(false);
  };

  return (
    <Layout>
      <PageTransition>
        <section className="py-24">
          <div className="container mx-auto px-6">
            <motion.div className="text-center mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-primary font-mono text-sm mb-3 tracking-widest uppercase">{"// Get in Touch"}</p>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Let's <span className="gradient-text">Connect</span></h1>
              <p className="text-muted-foreground max-w-md mx-auto">Have a project in mind? Want to collaborate? Or just want to say hi? Reach out!</p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <motion.div className="space-y-6" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                <div className="glass rounded-xl p-6 neon-border space-y-5">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><MessageCircle className="h-5 w-5 text-primary" /> Direct Contact</h3>
                  <a href="mailto:trixietech17@gmail.com" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"><Mail className="h-5 w-5 text-primary" /></div>
                    <div><p className="text-xs text-muted-foreground">Email</p><p className="text-sm font-medium text-foreground">trixietech17@gmail.com</p></div>
                  </a>
                  <a href="https://wa.me/254769896120" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors"><Phone className="h-5 w-5 text-primary" /></div>
                    <div><p className="text-xs text-muted-foreground">WhatsApp / Calls</p><p className="text-sm font-medium text-foreground">0769 896 120</p></div>
                  </a>
                </div>
                <div className="glass rounded-xl p-6 neon-border">
                  <h3 className="text-lg font-semibold mb-4">Find me everywhere</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {socials.map(s => (
                      <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-secondary/50 hover:bg-primary/10 hover:text-primary transition-all text-sm font-medium">
                        <span className="text-lg">{s.icon}</span>{s.name}
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <form onSubmit={handleSubmit} className="glass rounded-xl p-6 neon-border space-y-5">
                  <h3 className="text-lg font-semibold flex items-center gap-2"><Send className="h-5 w-5 text-primary" /> Send a Message</h3>
                  <div><label className="text-sm text-muted-foreground mb-1.5 block">Your Name</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required className="bg-secondary/50 border-border/50" /></div>
                  <div><label className="text-sm text-muted-foreground mb-1.5 block">Your Email</label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required className="bg-secondary/50 border-border/50" /></div>
                  <div><label className="text-sm text-muted-foreground mb-1.5 block">Topic</label><Input value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="Project inquiry" required className="bg-secondary/50 border-border/50" /></div>
                  <div><label className="text-sm text-muted-foreground mb-1.5 block">Message</label><Textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell me about your project..." rows={5} required className="bg-secondary/50 border-border/50" /></div>
                  <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? "Sending..." : "Send Message"}</Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}
