import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Mail, MessageCircle, MapPin, Send, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useCallback, memo, useRef, useEffect } from "react";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Kirim pertanyaan Anda",
    value: "support@artconnect.id",
    href: "mailto:support@artconnect.id?subject=Pertanyaan tentang ArtConnect",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Chat langsung dengan tim",
    value: "+62 812-3456-7890",
    href: "https://wa.me/6281234567890",
    color: "from-emerald-500 to-green-500"
  },
  {
    icon: MapPin,
    title: "Lokasi",
    description: "Kunjungi kantor kami",
    value: "Jakarta, Indonesia",
    href: "#",
    color: "from-rose-500 to-pink-500"
  }
];

// Memoized Contact Method Card
const ContactMethodCard = memo(({ method, index, isVisible }: { 
  method: typeof contactMethods[0];
  index: number;
  isVisible: boolean;
}) => {
  const Icon = method.icon;
  const isExternal = method.href.startsWith('http') || method.href.startsWith('mailto');
  
  const handleClick = () => {
    if (method.href !== '#') {
      if (isExternal) {
        window.open(method.href, method.href.startsWith('mailto') ? '_self' : '_blank');
      }
    }
  };
  
  return (
    <button
      onClick={handleClick}
      disabled={method.href === '#'}
      className={`w-full group p-5 rounded-2xl bg-card/30 border border-border/30 
        hover:border-primary/30 transition-all duration-500
        flex items-center gap-4 text-left disabled:opacity-60 disabled:cursor-default
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
      style={{ transitionDelay: `${index * 100 + 300}ms` }}
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} p-[1px] flex-shrink-0`}>
        <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
          <Icon className="w-5 h-5 text-foreground" />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-foreground mb-0.5">{method.title}</div>
        <div className="text-sm text-muted-foreground">{method.description}</div>
        <div className="text-sm text-primary font-medium truncate">{method.value}</div>
      </div>
      {method.href !== '#' && (
        <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
      )}
    </button>
  );
});

ContactMethodCard.displayName = 'ContactMethodCard';

const CTA = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      const mailtoLink = `mailto:support@artconnect.id?subject=Pertanyaan dari ${formData.name}&body=${encodeURIComponent(formData.message)}%0A%0AFrom: ${formData.email}`;
      window.location.href = mailtoLink;
      setIsSubmitting(false);
    }, 300);
  }, [formData]);

  const scrollToForm = useCallback(() => {
    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="cta" 
      className="py-28 relative overflow-hidden"
    >
      {/* Premium Animated Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Primary gradient glow - animated */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Secondary glow - left */}
        <div className="absolute top-1/4 -left-[100px] w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
        
        {/* Tertiary glow - right */}
        <div className="absolute bottom-1/4 -right-[100px] w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl" />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>
      
      <div className="container px-4 relative z-10">
        {/* Main CTA Section */}
        <div className={`max-w-4xl mx-auto text-center mb-20 transition-all duration-700
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Bergabung Gratis Sekarang</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Siap Mengembangkan
            <br />
            <span className="text-gradient">Karier Seni</span> Anda?
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Bergabunglah dengan komunitas seniman visual yang sudah mentransformasi 
            cara mereka mengelola dan mengembangkan bisnis seni dengan ArtConnect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="group min-w-[200px]">
                Mulai Gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Button 
              variant="hero-outline" 
              size="xl"
              onClick={scrollToForm}
              className="min-w-[200px]"
            >
              <Phone className="w-5 h-5 mr-2" />
              Hubungi Kami
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-10 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Gratis selamanya</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Tanpa kartu kredit</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Setup dalam 2 menit</span>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div id="contact-form" className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Methods */}
            <div className="space-y-6">
              <div className={`transition-all duration-700 delay-200
                ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
                  Ada Pertanyaan?
                </h3>
                <p className="text-muted-foreground">
                  Tim kami siap membantu Anda kapan saja. Pilih cara komunikasi yang paling nyaman untuk Anda.
                </p>
              </div>

              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <ContactMethodCard 
                    key={method.title} 
                    method={method} 
                    index={index}
                    isVisible={isVisible}
                  />
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className={`p-6 md:p-8 rounded-3xl bg-card/30 border border-border/30
              transition-all duration-700 delay-300
              ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <h3 className="font-display text-xl font-bold mb-6">
                Kirim Pesan
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/30 
                      focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-colors
                      text-foreground placeholder:text-muted-foreground"
                    placeholder="Masukkan nama Anda"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/30 
                      focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-colors
                      text-foreground placeholder:text-muted-foreground"
                    placeholder="email@contoh.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                    Pesan
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-secondary/30 border border-border/30 
                      focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none transition-colors
                      text-foreground placeholder:text-muted-foreground resize-none"
                    placeholder="Tulis pesan atau pertanyaan Anda..."
                  />
                </div>

                <Button 
                  type="submit" 
                  variant="default" 
                  size="lg"
                  className="w-full group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Kirim Pesan
                      <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
