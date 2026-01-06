import { Button } from "@/components/ui/button";
import { Menu, X, LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import Logo from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

// Navigation items untuk landing page - menggunakan anchor links
const navItems = [
  { label: "Beranda", href: "#hero" },
  { label: "Fitur", href: "#features" },
  { label: "Tentang", href: "#stats" },
  { label: "Kontak", href: "#cta" },
];

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const ticking = useRef(false);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle logout - clear all auth data and reload for clean state
  const handleLogout = useCallback(async () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    setIsOpen(false);
    
    try {
      // Sign out from Supabase with global scope to clear all sessions
      const { error } = await supabase.auth.signOut({ scope: 'global' });
      if (error) {
        console.error('Logout error:', error.message);
      }
      
      // Clear auth storage key from localStorage (matches supabase config)
      localStorage.removeItem('artconnect-auth');
      
      // Clear any other potential auth-related items
      const keysToRemove = Object.keys(localStorage).filter(
        key => key.includes('supabase') || key.includes('auth')
      );
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Force page reload to ensure clean auth state
      window.location.href = '/';
    } catch (err) {
      console.error('Logout failed:', err);
      setIsLoggingOut(false);
    }
  }, [isLoggingOut]);

  // Smooth scroll ke section tertentu
  const scrollToSection = useCallback((href: string) => {
    const sectionId = href.replace("#", "");
    const element = document.getElementById(sectionId);
    
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (sectionId === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    
    setIsOpen(false);
  }, []);

  // Optimized scroll handler with requestAnimationFrame throttling
  useEffect(() => {
    const sections = ["hero", "features", "stats", "cta"];
    
    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + 100;

      // Jika di paling atas
      if (window.scrollY < 100) {
        setActiveSection("hero");
        ticking.current = false;
        return;
      }

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
      
      ticking.current = false;
    };

    const handleScroll = () => {
      // Throttle dengan requestAnimationFrame - hanya update 1x per frame
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateActiveSection);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/50 shadow-sm">
        <div className="container px-4 sm:px-6">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <button 
              onClick={() => scrollToSection("#hero")}
              className="group flex-shrink-0"
            >
              <Logo size="xs" showText={true} />
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              {navItems.map((item) => {
                const sectionId = item.href.replace("#", "");
                const isActive = activeSection === sectionId;
                
                return (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={cn(
                      "text-sm font-medium transition-all duration-200 relative py-1",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.label}
                    {isActive && (
                      <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop CTA - Changes based on auth state */}
            <div className="hidden md:flex items-center gap-2 lg:gap-3">
              {user ? (
                // User is logged in - show logout and dashboard buttons
                <>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    <span className="hidden lg:inline">{isLoggingOut ? 'Keluar...' : 'Keluar'}</span>
                  </Button>
                  <Link to="/dashboard">
                    <Button variant="default" size="sm" className="gap-2">
                      <LayoutDashboard className="w-4 h-4" />
                      <span className="hidden lg:inline">Dashboard</span>
                    </Button>
                  </Link>
                </>
              ) : (
                // User is not logged in - show login/register buttons
                <>
                  <Link to="/auth/login">
                    <Button variant="ghost" size="sm">Masuk</Button>
                  </Link>
                  <Link to="/auth/register">
                    <Button variant="default" size="sm">Daftar</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 -mr-2 text-foreground hover:bg-accent rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? "Tutup menu" : "Buka menu"}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop with fade */}
        <div 
          className={cn(
            "absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ease-out",
            isOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsOpen(false)}
        />
        
        {/* Drawer sliding from right */}
        <div 
          className={cn(
            "absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background border-l border-border shadow-2xl",
            "flex flex-col",
            "transform transition-transform duration-300 ease-out",
            isOpen ? "translate-x-0" : "translate-x-full"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between h-14 sm:h-16 px-6 border-b border-border flex-shrink-0">
            <Logo size="xs" showText={true} />
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 -mr-2 rounded-lg hover:bg-accent transition-colors"
              aria-label="Tutup menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content - Scrollable with compact spacing */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="space-y-6">
              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map((item, index) => {
                  const sectionId = item.href.replace("#", "");
                  const isActive = activeSection === sectionId;
                  
                  return (
                    <button
                      key={item.href}
                      onClick={() => scrollToSection(item.href)}
                      className={cn(
                        "w-full text-left px-4 py-3.5 rounded-xl font-medium transition-all duration-200",
                        "transform",
                        isActive 
                          ? "bg-primary text-primary-foreground shadow-sm" 
                          : "text-foreground hover:bg-accent active:scale-95"
                      )}
                      style={{
                        transitionDelay: isOpen ? `${100 + index * 50}ms` : '0ms',
                        opacity: isOpen ? 1 : 0,
                        transform: isOpen ? 'translateX(0)' : 'translateX(20px)'
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* CTA Buttons */}
              <div 
                className="space-y-3 pt-3"
                style={{
                  transitionDelay: isOpen ? '300ms' : '0ms',
                  opacity: isOpen ? 1 : 0,
                  transform: isOpen ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'all 300ms ease-out'
                }}
              >
                {user ? (
                  // User is logged in
                  <>
                    <Link to="/dashboard" className="block">
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full gap-2 font-medium shadow-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="w-5 h-5" />
                        Buka Dashboard
                      </Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="w-full gap-2 font-medium"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <LogOut className="w-5 h-5" />
                      )}
                      {isLoggingOut ? 'Keluar...' : 'Keluar'}
                    </Button>
                  </>
                ) : (
                  // User not logged in
                  <>
                    <Link to="/auth/register" className="block">
                      <Button 
                        variant="default" 
                        size="lg" 
                        className="w-full font-medium shadow-sm"
                        onClick={() => setIsOpen(false)}
                      >
                        Daftar Gratis
                      </Button>
                    </Link>
                    <Link to="/auth/login" className="block">
                      <Button 
                        variant="outline" 
                        size="lg" 
                        className="w-full font-medium"
                        onClick={() => setIsOpen(false)}
                      >
                        Masuk
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
