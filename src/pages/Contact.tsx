import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Terminal, Mail, User, MessageSquare, Lock } from "lucide-react";
import { PageTransition, FadeInView } from "@/components/PageTransition";
import { BackgroundBeams } from "@/components/BackgroundBeams";
import { TypewriterText } from "@/components/TypewriterText";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { SecurityAuthModal } from "@/components/SecurityAuthModal";
import { FactionComments } from "@/components/FactionComments";

const Contact = () => {
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
    <PageTransition>
      <main className="min-h-screen bg-background relative overflow-hidden">
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

        {/* Feature 10: Faction Wars Comments */}
        <section className="relative z-10 py-20 px-4 md:px-8 max-w-3xl mx-auto">
          <FadeInView>
            <h2 className="font-display text-3xl mb-8 text-center">
              Community <span className="text-gradient-gold">Debate</span>
            </h2>
          </FadeInView>
          <FactionComments 
            redTeamName="Console Crusaders"
            blueTeamName="PC Master Race"
          />
        </section>

        <Footer />

        {/* Feature 8: Security Clearance Auth Modal */}
        <SecurityAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onSuccess={handleAuthSuccess}
        />
      </main>
    </PageTransition>
  );
};

export default Contact;
