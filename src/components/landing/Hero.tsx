import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-background to-orange-500/10">
        <div className="absolute inset-0 bg-background/85" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background" />
      </div>

      <div className="container relative z-10 px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium animate-fade-in"
          >
            <Palette className="w-4 h-4" />
            <span>CRM Khusus untuk Seniman Visual</span>
          </div>

          {/* Main Title */}
          <h1 
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-slide-up"
            style={{ animationDelay: "0.1s" }}
          >
            <span className="text-foreground">Art</span>
            <span className="text-gradient">Connect</span>
          </h1>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-slide-up font-body"
            style={{ animationDelay: "0.2s" }}
          >
            Pusat komando digital untuk seniman. Kelola karya, jejaring profesional, 
            dan kembangkan karier seni Anda dalam satu platform terpadu.
          </p>

          {/* CTA Buttons */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="group">
                Coba Gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <a href="#features">
              <Button variant="hero-outline" size="xl">
                Lihat Fitur
              </Button>
            </a>
          </div>

          {/* Feature Pills */}
          <div 
            className="flex flex-wrap items-center justify-center gap-6 pt-12 animate-slide-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">Inventaris Karya</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">Jejaring Profesional</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
              <span className="font-medium">Analitik Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade to seamless transition */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-background via-background/80 to-transparent" />
    </section>
  );
};

export default Hero;
