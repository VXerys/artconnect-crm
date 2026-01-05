import { Github, Mail, Instagram, ArrowUpRight, Heart } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

// Team members - Sechan first
const teamMembers = [
  { name: "Moch. Sechan A.", role: "Lead Developer" },
  { name: "M. Akbar Rizky S.", role: "Frontend Developer" },
  { name: "M. Fathir Bagas", role: "Backend Developer" },
  { name: "M. Ghibran M.", role: "UI/UX Designer" },
  { name: "M. Sinar Agusta", role: "Quality Assurance" },
];

const quickLinks = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Karya Seni", href: "/artworks" },
  { label: "Kontak", href: "/contacts" },
  { label: "Analitik", href: "/analytics" },
];

const infoLinks = [
  { label: "Tentang Kami", href: "/about", isRoute: true },
  { label: "Panduan Penggunaan", href: "/guide", isRoute: true },
  { label: "Kebijakan Privasi", href: "/privacy", isRoute: true },
  { label: "Syarat & Ketentuan", href: "#", isRoute: false },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      ref={footerRef}
      className="relative pt-20 pb-8"
    >
      {/* Top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div className="container px-4">
        {/* Main Footer Content */}
        <div className={`grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-16 transition-all duration-700
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <button 
              onClick={scrollToTop}
              className="mb-4 group"
            >
              <Logo size="sm" showText={true} />
            </button>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Platform CRM berbasis web yang dirancang khusus untuk seniman visual independen. 
              Kelola karya, jejaring, dan kembangkan karier seni Anda.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a 
                href="mailto:support@artconnect.id" 
                className="w-9 h-9 rounded-lg bg-card/50 border border-border/30 flex items-center justify-center
                  hover:border-primary/50 hover:bg-primary/10 transition-all group"
                aria-label="Email"
              >
                <Mail className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-card/50 border border-border/30 flex items-center justify-center
                  hover:border-primary/50 hover:bg-primary/10 transition-all group"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-card/50 border border-border/30 flex items-center justify-center
                  hover:border-primary/50 hover:bg-primary/10 transition-all group"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={`transition-all duration-700 delay-100
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h4 className="font-display font-semibold text-foreground mb-4">Platform</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                  >
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info Links */}
          <div className={`transition-all duration-700 delay-200
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h4 className="font-display font-semibold text-foreground mb-4">Informasi</h4>
            <ul className="space-y-3">
              {infoLinks.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link 
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 group"
                    >
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  ) : (
                    <span className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer inline-flex items-center gap-1 group">
                      {link.label}
                      <ArrowUpRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Team Section */}
          <div className={`transition-all duration-700 delay-300
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h4 className="font-display font-semibold text-foreground mb-4">Tim Pengembang</h4>
            <ul className="space-y-2">
              {teamMembers.map((member, index) => (
                <li key={member.name} className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-br from-primary/80 to-primary/40 
                    flex items-center justify-center text-[10px] font-bold text-background
                    ${index === 0 ? 'ring-2 ring-primary/50' : ''}`}>
                    {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-sm truncate block ${index === 0 ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                      {member.name}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-border/50 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className={`flex flex-col lg:flex-row items-center justify-between gap-4 transition-all duration-700 delay-400
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Copyright & Project Info */}
          <div className="flex flex-col sm:flex-row items-center gap-2 text-center sm:text-left">
            <p className="text-sm text-muted-foreground">
              © 2025 ArtConnect. All rights reserved.
            </p>
            <span className="hidden sm:inline text-muted-foreground/50">•</span>
            <p className="text-sm text-muted-foreground">
              Projek UAS Pengembangan Aplikasi Berbasis Web
            </p>
          </div>

          {/* Made with love */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Dibuat dengan</span>
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
            <span>di Indonesia</span>
          </div>
        </div>

        {/* Back to top button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 rounded-full 
              bg-card/30 border border-border/30 hover:border-primary/30
              text-sm text-muted-foreground hover:text-primary transition-all"
          >
            <svg 
              className="w-4 h-4 group-hover:-translate-y-1 transition-transform" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
            Kembali ke Atas
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
