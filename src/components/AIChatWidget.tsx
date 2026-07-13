import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Mic, MicOff, Square } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
}

const botResponses: Record<string, string> = {
  hello: "Hey there! 👋 I'm Trixie's AI assistant. I can tell you about her projects, skills, or how to get in touch. What would you like to know?",
  hi: "Hi! 👋 I'm here to help you learn about Trixie's work. Ask me about her projects, tech stack, or contact info!",
  projects: "Trixie has built some amazing projects! 🚀\n\n• **Neural Dashboard** — Real-time AI analytics with 3D visualizations using React & Three.js\n• **CryptoVault** — Decentralized crypto portfolio tracker with Web3 integration\n• **CloudSync API** — High-performance REST API gateway with Kubernetes\n\nCheck out the Projects page for more details!",
  skills: "Trixie is a full-stack developer with expertise in:\n\n**Frontend:** React, HTML, CSS, JavaScript, Three.js, WebGL\n**Backend:** Node.js, Python, PHP, Go, MySQL\n**DevOps:** Docker, Kubernetes, Cloud Architecture\n**Creative:** 3D Graphics, UI/UX Design\n\nShe's always learning new technologies! 💡",
  contact: "You can reach Trixie through:\n\n📧 **Email:** trixietech17@gmail.com\n📱 **WhatsApp/Calls:** 0769896120\n\nOr find her on social media as **Trixie Wangui** on all major platforms! 🌐",
  experience: "Trixie's journey:\n\n🎯 **2024** — Senior Software Engineer, building cutting-edge web apps & 3D experiences\n💼 **2023** — Full-Stack Developer, scalable microservices & cloud-native apps\n🎨 **2022** — Frontend Engineer, immersive UI/UX with React & Three.js\n🚀 **2021** — Started her coding journey and never looked back!",
  hire: "Trixie is open to exciting opportunities! 🎯\n\nReach out via:\n📧 trixietech17@gmail.com\n📱 0769896120\n\nShe'd love to hear about your project!",
  services: "Trixie offers professional services including:\n\n💻 **Software Development** — Custom web & mobile apps\n🎨 **Web Design** — Modern, responsive websites\n📂 **Portfolio Building** — Stunning developer portfolios\n🚗 **Ride-Hailing Solutions** — Custom ride-hailing platforms\n\nContact her to discuss your project!",
  resume: "You can download Trixie's resume/CV from the **About** page — look for the download button! 📄\n\nOr reach out directly at trixietech17@gmail.com for a detailed portfolio.",
};

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) {
    return "Good morning! 🌞 Welcome to Trixie's services. How can I help you today?";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon! ☀️ Thanks for visiting Trixie's services. How can I assist you?";
  } else {
    return "Good evening! 🌙 How may I assist you tonight?";
  }
}

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, response] of Object.entries(botResponses)) {
    if (lower.includes(key)) return response;
  }
  if (lower.includes("tech") || lower.includes("stack") || lower.includes("language")) return botResponses.skills;
  if (lower.includes("work") || lower.includes("portfolio")) return botResponses.projects;
  if (lower.includes("email") || lower.includes("phone") || lower.includes("reach")) return botResponses.contact;
  if (lower.includes("job") || lower.includes("freelance")) return botResponses.hire;
  if (lower.includes("service") || lower.includes("offer") || lower.includes("web design") || lower.includes("ride")) return botResponses.services;
  if (lower.includes("resume") || lower.includes("cv") || lower.includes("download")) return botResponses.resume;

  return "Hello! 👋 Welcome to Trixie's services. I'm here to help you with any questions about our software, web design, portfolio building, or ride-hailing services.\n\nJust ask about:\n• **Projects** — Learn about Trixie's work\n• **Skills** — Her tech stack & expertise\n• **Services** — What Trixie offers\n• **Contact** — How to reach her\n• **Resume** — Download her CV\n\nHow can I make your day better today? 😊";
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: getTimeGreeting() },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    const userMsg: Message = { role: "user", content: msg };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getBotResponse(userMsg.content);
      setMessages(prev => [...prev, { role: "assistant", content: response }]);
      setIsTyping(false);
    }, 600 + Math.random() * 800);
  };

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(blob);
        stream.getTracks().forEach(t => t.stop());
        
        // Add voice note as a message
        setMessages(prev => [...prev, { role: "user", content: "🎤 Voice note", audioUrl }]);
        setIsTyping(true);
        setTimeout(() => {
          setMessages(prev => [...prev, { 
            role: "assistant", 
            content: "Thanks for the voice note! 🎤 I received your message. Unfortunately I can only process text right now — please type your question and I'll be happy to help! 😊" 
          }]);
          setIsTyping(false);
        }, 1000);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      console.error("Microphone access denied");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:neon-glow transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Bot className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[360px] h-[500px] glass rounded-2xl neon-border flex flex-col overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-card/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Trixie AI</p>
                  <p className="text-xs text-primary">Online</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-secondary transition-colors">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-accent/20" : "bg-primary/20"}`}>
                    {msg.role === "user" ? <User className="h-3.5 w-3.5 text-accent" /> : <Bot className="h-3.5 w-3.5 text-primary" />}
                  </div>
                  <div className={`max-w-[75%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                    msg.role === "user" ? "bg-accent/20 text-foreground" : "bg-secondary text-foreground"
                  }`}>
                    {msg.audioUrl ? (
                      <audio controls src={msg.audioUrl} className="w-full max-w-[200px]" />
                    ) : (
                      msg.content.split("\n").map((line, j) => (
                        <span key={j}>
                          {line.split(/(\*\*[^*]+\*\*)/).map((part, k) =>
                            part.startsWith("**") && part.endsWith("**")
                              ? <strong key={k} className="text-primary">{part.slice(2, -2)}</strong>
                              : part
                          )}
                          {j < msg.content.split("\n").length - 1 && <br />}
                        </span>
                      ))
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="flex gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                    <Bot className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <div className="bg-secondary rounded-xl px-4 py-3 flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border/50 bg-card/80">
              <form
                onSubmit={e => { e.preventDefault(); handleSend(); }}
                className="flex gap-2"
              >
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask about Trixie..."
                  className="flex-1 bg-secondary border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2 rounded-lg transition-all ${isRecording ? "bg-destructive text-destructive-foreground animate-pulse" : "bg-secondary text-muted-foreground hover:text-primary hover:bg-secondary/80"}`}
                >
                  {isRecording ? <Square className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 bg-primary text-primary-foreground rounded-lg hover:neon-glow transition-all disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
