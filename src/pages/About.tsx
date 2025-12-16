import { useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Copy, Check, Headphones, Users, Gamepad2, Film, MessageSquare, Award, Star, Send, Terminal, Mail, User, Lock } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { TypewriterText } from "@/components/TypewriterText";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { SecurityAuthModal } from "@/components/SecurityAuthModal";
import { SocialLink3D } from "@/components/SocialLink3d";
import { BackgroundBeams } from "@/components/BackgroundBeams";

// Animated Counter Component
const AnimatedCounter = ({ value, label }: { value: string; label: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseInt(value.replace(/\D/g, ""));
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v) => Math.floor(v));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, numericValue, { duration: 2, ease: "easeOut" });
      const unsubscribe = rounded.on("change", (v) => setDisplayValue(v));
      return () => {
        controls.stop();
        unsubscribe();
      };
    }
  }, [isInView, numericValue, count, rounded]);

  return (
    <div ref={ref} className="text-center p-6">
      <div className="font-display text-[clamp(3rem,8vw,5rem)] text-primary leading-none">
        {displayValue}{value.includes("+") ? "+" : ""}
      </div>
      <div className="font-mono text-sm text-muted-foreground uppercase tracking-wider mt-2">
        {label}
      </div>
    </div>
  );
};

const ContactIcon = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Feature 8: Show Security Auth Modal before submitting
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));

    toast({
      title: "Message sent successfully",
      description: "We'll get back to you within 24 hours.",
    });

    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    setIsAuthenticated(true);
    toast({
      title: "Access Granted",
      description: "You can now submit your message.",
    });
  };
  return (
    <>
    <BackgroundBeams />
    {/* Content */}
        <section className="relative z-10 pt-32 pb-20 px-4 md:px-8 max-w-3xl mx-auto">
          {/* Terminal Header */}
          <FadeInView>
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Terminal className="w-4 h-4 text-primary" />
                <span className="font-mono text-sm text-primary">system.contact()</span>
              </div>

              <h1 className="font-display text-5xl md:text-6xl mb-4">
                <TypewriterText text="INITIATE COMMUNICATION" delay={300} speed={80} />
              </h1>

              <p className="text-muted-foreground max-w-lg mx-auto font-mono text-sm">
                {">"} Ready to collaborate? Drop us a line and our team will respond within 24 hours.
              </p>
            </div>
          </FadeInView>

          {/* Form */}
          <FadeInView delay={0.3}>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Input */}
              <div className="relative group">
                <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                  {">"} Your Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Enter your name..."
                    className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-lg font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="relative group">
                <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                  {">"} Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="your@email.com"
                    className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-lg font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>

              {/* Message Input */}
              <div className="relative group">
                <label className="block text-xs font-mono text-muted-foreground mb-2 uppercase tracking-wider">
                  {">"} Message
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-4 w-4 h-4 text-muted-foreground" />
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    placeholder="Type your message here..."
                    className="w-full pl-12 pr-4 py-4 bg-muted/30 border border-border rounded-lg font-mono text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-all resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary text-primary-foreground rounded-lg font-mono font-medium disabled:opacity-50 disabled:cursor-not-allowed animate-glow-pulse"
              >
                {isSubmitting ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                    />
                    TRANSMITTING...
                  </>
                ) : isAuthenticated ? (
                  <>
                    <Send className="w-5 h-5" />
                    SEND TRANSMISSION
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    VERIFY & SEND
                  </>
                )}
              </motion.button>
            </form>
          </FadeInView>

          {/* Decorative Terminal Lines */}
          <FadeInView delay={0.5}>
            <div className="mt-16 font-mono text-xs text-muted-foreground/50 space-y-1">
              <p>{">"} Connection established: GameTout HQ</p>
              <p>{">"} Encryption: AES-256</p>
              <p>{">"} Status: {isAuthenticated ? "Authenticated" : "Awaiting verification"}_</p>
            </div>
          </FadeInView>
        </section>

        <SecurityAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
       </> 
  );

}

// Glitch Image Component
const GlitchImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
      />
      
      {/* Glitch layers */}
      {isHovered && (
        <>
          <motion.div
            className="absolute inset-0 bg-primary/20 mix-blend-multiply"
            animate={{
              x: [0, -5, 5, -3, 0],
              opacity: [0, 1, 0.5, 1, 0],
            }}
            transition={{ duration: 0.3, repeat: Infinity }}
          />
          <motion.img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            style={{ filter: "hue-rotate(90deg)" }}
            animate={{
              x: [0, 3, -3, 2, 0],
              clipPath: [
                "inset(0 0 90% 0)",
                "inset(20% 0 60% 0)",
                "inset(40% 0 40% 0)",
                "inset(80% 0 10% 0)",
                "inset(0 0 90% 0)",
              ],
            }}
            transition={{ duration: 0.15, repeat: Infinity }}
          />
          <motion.img
            src={src}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            style={{ filter: "hue-rotate(-90deg)" }}
            animate={{
              x: [0, -3, 3, -2, 0],
              clipPath: [
                "inset(80% 0 10% 0)",
                "inset(60% 0 20% 0)",
                "inset(30% 0 50% 0)",
                "inset(10% 0 80% 0)",
                "inset(80% 0 10% 0)",
              ],
            }}
            transition={{ duration: 0.15, repeat: Infinity, delay: 0.05 }}
          />
        </>
      )}
      
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines pointer-events-none" />
      
      {/* Vignette */}
      <div className="absolute inset-0 vignette pointer-events-none" />
    </motion.div>
  );
};

// Ecosystem Card Component
const EcosystemCard = ({ 
  icon: Icon, 
  title, 
  description,
  delay = 0
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ scale: 1.02 }}
    className="relative p-6 rounded-lg overflow-hidden group"
    style={{
      background: "linear-gradient(145deg, hsl(0 0% 8% / 0.8) 0%, hsl(0 0% 4% / 0.8) 100%)",
      backdropFilter: "blur(20px)",
      border: "1px solid hsl(0 0% 100% / 0.1)",
    }}
  >
    {/* Glowing border on hover */}
    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style={{ boxShadow: "inset 0 0 30px hsl(43 100% 50% / 0.1), 0 0 30px hsl(43 100% 50% / 0.1)" }}
    />
    
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="font-display text-xl text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  </motion.div>
);

const stats = [
  { label: "Industry Interviews", value: "300+" },
  { label: "Game Reviews", value: "100+" },
  { label: "Podcasts Hosted", value: "50+" },
  { label: "Documentaries", value: "30+" },
];

const roles = ["Game Reviewer", "Documentary Maker", "Steam Curator", "Community Builder"];

const About = () => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const email = "thegametout@gmail.com";

  const copyEmail = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    toast({
      title: "Email copied!",
      description: "Contact email copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <PageTransition>
      <main className="min-h-screen bg-background">
        {/* Hero Profile Section */}
        <section className="min-h-[100dvh] flex items-center py-20 px-4 md:px-8">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Left: Portrait with Glitch Effect */}
              <FadeInView>
                <div className="relative">
                  {/* Classified stamp */}
                  <motion.div
                    initial={{ rotate: -12, scale: 0 }}
                    animate={{ rotate: -12, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute -top-4 -right-4 z-20 px-4 py-2 bg-destructive/90 font-display text-lg text-destructive-foreground uppercase tracking-wider"
                    style={{ boxShadow: "4px 4px 0 hsl(0 0% 0% / 0.5)" }}
                  >
                    Classified
                  </motion.div>
                  
                  <div className="aspect-[3/4] max-w-md mx-auto lg:max-w-none">
                    <GlitchImage
                      src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80"
                      alt="GameTout Founder"
                    />
                  </div>
                  
                  {/* Role tags */}
                  <div className="flex flex-wrap gap-2 mt-6 justify-center lg:justify-start">
                    {roles.map((role, index) => (
                      <motion.span
                        key={role}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono uppercase tracking-wider"
                      >
                        {role}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </FadeInView>

              {/* Right: Bio with Typewriter */}
              <div className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mb-4"
                >
                  <span className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                    // Subject Dossier
                  </span>
                </motion.div>

                <h1 className="font-display text-[clamp(2.5rem,6vw,5rem)] leading-none mb-6">
                  <span className="text-gradient-gold">The Voice</span>
                  <br />
                  <span className="text-foreground">of Indian Gaming</span>
                </h1>

                <div className="mb-8">
                  <TypewriterText
                    text="Unfiltered. Unbiased. Ground-level coverage of the IGDC and beyond."
                    className="text-lg text-muted-foreground"
                    speed={30}
                    delay={500}
                  />
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                  className="text-muted-foreground leading-relaxed max-w-lg mx-auto lg:mx-0"
                >
                  GameTout is a highly visible and respected figure in the Indian game development ecosystem. 
                  Known for being upfront, controversial, and candid, his work is closely followed by 
                  key studios and individuals across the industry.
                </motion.p>

                <SocialLink3D />

                {/* Scroll indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="mt-12 hidden lg:block"
                >
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
                  >
                    <motion.div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Stats Section */}
        <section className="py-20 px-4 md:px-8 relative overflow-hidden">
          {/* Grid background */}
          <div 
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
                linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)
              `,
              backgroundSize: "60px 60px",
            }}
          />
          
          <div className="max-w-5xl mx-auto relative z-10">
            <FadeInView>
              <div className="text-center mb-12">
                <span className="font-mono text-xs text-primary uppercase tracking-widest">
                  // Mission Stats
                </span>
                <h2 className="font-display text-4xl mt-2">
                  Career <span className="text-gradient-gold">Metrics</span>
                </h2>
              </div>
            </FadeInView>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="relative p-4 rounded-lg border border-border bg-card/50"
                >
                  <AnimatedCounter value={stat.value} label={stat.label} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Ecosystem Section */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-6xl mx-auto">
            <FadeInView>
              <div className="text-center mb-12">
                <span className="font-mono text-xs text-primary uppercase tracking-widest">
                  // The Ecosystem
                </span>
                <h2 className="font-display text-4xl mt-2">
                  Building the <span className="text-gradient-gold">Network</span>
                </h2>
              </div>
            </FadeInView>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <EcosystemCard
                icon={Headphones}
                title="GameTout Gossip Podcast"
                description="Candid discussions with Global Gaming Personalities. Unscripted, unfiltered conversations available on Spotify & YouTube."
                delay={0}
              />
              <EcosystemCard
                icon={Users}
                title="Indian Gamedev Mixer"
                description="The core faction—a specialized community for gamedevs and artists to connect. Includes a dedicated YouTube channel showcasing local talent."
                delay={0.1}
              />
              <EcosystemCard
                icon={Award}
                title="Women Gamedev Mixer"
                description="A dedicated initiative to foster inclusion and support for women in the Indian games industry. Building a more diverse future."
                delay={0.2}
              />
              <EcosystemCard
                icon={MessageSquare}
                title="Bharat GameDev Channels"
                description="Hosting monthly digital meetups and maintaining active WhatsApp communities for real-time industry connections."
                delay={0.3}
              />
              <EcosystemCard
                icon={Gamepad2}
                title="Steam Curator"
                description="Promoting Indie and Indian-made games to a global audience. Helping hidden gems find their players."
                delay={0.4}
              />
              <EcosystemCard
                icon={Film}
                title="Documentary Series"
                description="Long-form cinematic content exploring the stories behind India's most innovative game studios and creators."
                delay={0.5}
              />
            </div>
          </div>
        </section>

        {/* Terminal CTA Section */}
        <section className="py-20 px-4 md:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-8 md:p-12 rounded-lg bg-card border border-border overflow-hidden"
            >
              {/* Scanlines */}
              <div className="absolute inset-0 scanlines pointer-events-none opacity-50" />
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="font-mono text-xs text-muted-foreground mb-4">
                  {">"} system.broadcast()
                </div>
                
                <h2 className="font-display text-3xl md:text-4xl mb-4">
                  Website & Magazine <span className="text-gradient-gold">Dropping Soon</span>
                </h2>
                
                <p className="text-muted-foreground mb-8 font-mono text-sm">
                  Connect with the source. Join the movement.
                </p>

                {/* Email Copy Button */}
                <motion.button
                  onClick={copyEmail}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-3 px-6 py-4 bg-primary/10 border border-primary/30 rounded-lg font-mono text-primary hover:bg-primary/20 transition-colors"
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                  <span>{email}</span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="text-primary"
                  >
                    _
                  </motion.span>
                </motion.button>

                <div className="mt-8 font-mono text-xs text-muted-foreground/50">
                  {">"} Status: Active | Location: India | Clearance: Public_
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <ContactIcon/>



        <Footer />
      </main>
    </PageTransition>
  );
};

export default About;
