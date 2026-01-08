import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Users, BarChart3, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";
import SplitText from "@/components/ui/SplitText";
import { Container } from "@/components/ui/responsive";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section id="hero" className="relative min-h-[100svh] flex flex-col justify-start sm:justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Smoother background image logic with CSS masking */}
        <div 
          className="absolute inset-0 z-0"
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)'
          }}
        >
          <img 
            src={heroBg} 
            alt="ArtConnect Gallery" 
            className="w-full h-full object-cover object-center scale-105 animate-fade-in"
            loading="eager"
            // @ts-ignore
            fetchpriority="high"
          />
        </div>
        
        {/* Layered overlays for a rich, deep cinematic look */}
        <div className="absolute inset-0 bg-background/40 z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-transparent to-background z-[2]" />
        <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-background via-background/20 to-transparent z-[3]" />
      </div>

      <Container className="relative z-10 pt-28 pb-16 sm:pt-32 sm:pb-20 md:pt-40 md:pb-24">
        <div className="max-w-5xl mx-auto text-center space-y-8 sm:space-y-10">
          {/* Badge */}
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-semibold animate-fade-in backdrop-blur-sm"
          >
            <Palette className="w-4 h-4 flex-shrink-0" />
            <span>CRM Khusus untuk Seniman Visual</span>
          </div>

          <div 
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] px-4 sm:px-0"
          >
            <span className="text-foreground inline-block mr-2 sm:mr-3 animate-in fade-in slide-in-from-bottom-8 duration-1000">Art</span>
            <span className="text-primary inline-block animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">Connect</span>
          </div>

          {/* Subtitle */}
          <p 
            className="text-lg sm:text-xl md:text-2xl text-muted-foreground/90 max-w-3xl mx-auto animate-slide-up font-normal leading-relaxed px-4 sm:px-0"
            style={{ animationDelay: "0.2s" }}
          >
            Pusat komando digital untuk seniman. Kelola karya, jejaring profesional, 
            dan kembangkan karier seni Anda dalam satu platform terpadu.
          </p>

          {/* CTA Buttons - Changes based on auth state */}
          <div 
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 pt-4 sm:pt-6 animate-slide-up px-4 sm:px-0"
            style={{ animationDelay: "0.3s" }}
          >
            {user ? (
              // User is logged in - show dashboard button
              <>
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button variant="hero" size="xl" className="group gap-2.5 w-full sm:w-auto h-14 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    <LayoutDashboard className="w-5 h-5" />
                    Buka Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#features" className="w-full sm:w-auto">
                  <Button variant="hero-outline" size="xl" className="w-full sm:w-auto h-14 px-8 text-base font-semibold">
                    Lihat Fitur
                  </Button>
                </a>
              </>
            ) : (
              // User is not logged in - show register/login buttons
              <>
                <Link to="/auth/register" className="w-full sm:w-auto">
                  <Button variant="hero" size="xl" className="group w-full sm:w-auto h-14 px-8 text-base font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all">
                    Coba Gratis
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#features" className="w-full sm:w-auto">
                  <Button variant="hero-outline" size="xl" className="w-full sm:w-auto h-14 px-8 text-base font-semibold">
                    Lihat Fitur
                  </Button>
                </a>
              </>
            )}
          </div>

          {/* Feature Pills */}
          <div 
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-6 sm:gap-8 pt-10 sm:pt-14 animate-slide-up px-2"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl glass-card border-white/10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30 shadow-glow">
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span className="font-medium text-sm sm:text-base text-foreground/90">Inventaris Karya</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl glass-card border-white/10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30 shadow-glow">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span className="font-medium text-sm sm:text-base text-foreground/90">Jejaring Profesional</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl glass-card border-white/10">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 border border-primary/30 shadow-glow">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              </div>
              <span className="font-medium text-sm sm:text-base text-foreground/90">Analitik Dashboard</span>
            </div>
          </div>
        </div>
      </Container>

      {/* Bottom fade anchor for seamless scrolling */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-background to-transparent pointer-events-none z-[4]" />
    </section>
  );
};

export default Hero;
