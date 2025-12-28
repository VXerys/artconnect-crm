import { Button } from "@/components/ui/button";
import { ArrowRight, Palette, Users, BarChart3, LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import heroBg from "@/assets/hero-bg.jpg";
import SplitText from "@/components/ui/SplitText";

const Hero = () => {
  const { user } = useAuth();

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={heroBg} 
          alt="ArtConnect Gallery" 
          className="w-full h-full object-cover"
          loading="eager"
          // @ts-ignore
          fetchpriority="high"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-background/85" />
        {/* Gradient overlay for depth */}
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

          {/* Main Title with SplitText Animation */}
          {/* Main Title with SplitText Animation */}
          <div 
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight"
            style={{ willChange: "transform" }}
          >
            <SplitText
              text="Art"
              tag="div"
              className="text-foreground font-display font-bold inline-block mr-2"
              delay={70}
              duration={1.0}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="center"
            />
            <SplitText
              text="Connect"
              tag="div"
              className="text-primary font-display font-bold inline-block"
              delay={70}
              duration={1.0}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="center"
            />
          </div>

          {/* Subtitle */}
          <p 
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto animate-slide-up font-body"
            style={{ animationDelay: "0.2s" }}
          >
            Pusat komando digital untuk seniman. Kelola karya, jejaring profesional, 
            dan kembangkan karier seni Anda dalam satu platform terpadu.
          </p>

          {/* CTA Buttons - Changes based on auth state */}
          <div 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up"
            style={{ animationDelay: "0.3s" }}
          >
            {user ? (
              // User is logged in - show dashboard button
              <>
                <Link to="/dashboard">
                  <Button variant="hero" size="xl" className="group gap-2">
                    <LayoutDashboard className="w-5 h-5" />
                    Buka Dashboard
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <a href="#features">
                  <Button variant="hero-outline" size="xl">
                    Lihat Fitur
                  </Button>
                </a>
              </>
            ) : (
              // User is not logged in - show register/login buttons
              <>
                <Link to="/auth/register">
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
              </>
            )}
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
