import { Button } from "@/components/ui/button";
import { Palette, Menu, X, LayoutDashboard, LogOut, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";

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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button 
            onClick={() => scrollToSection("#hero")}
            className="flex items-center gap-2 group"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl font-bold">
              Art<span className="text-primary">Connect</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => {
              const sectionId = item.href.replace("#", "");
              const isActive = activeSection === sectionId;
              
              return (
                <button
                  key={item.href}
                  onClick={() => scrollToSection(item.href)}
                  className={`text-sm transition-colors relative ${
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* CTA - Changes based on auth state */}
          <div className="hidden md:flex items-center gap-3">
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
                  {isLoggingOut ? 'Keluar...' : 'Keluar'}
                </Button>
                <Link to="/dashboard">
                  <Button variant="default" size="sm" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
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
                  <Button variant="default" size="sm">Daftar Gratis</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Tutup menu" : "Buka menu"}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => {
                const sectionId = item.href.replace("#", "");
                const isActive = activeSection === sectionId;
                
                return (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`text-sm text-left transition-colors ${
                      isActive 
                        ? "text-primary font-medium" 
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                {user ? (
                  // User is logged in - show logout and dashboard buttons
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1 gap-2"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <LogOut className="w-4 h-4" />
                      )}
                      {isLoggingOut ? 'Keluar...' : 'Keluar'}
                    </Button>
                    <Link to="/dashboard" className="flex-1">
                      <Button variant="default" size="sm" className="w-full gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        Dashboard
                      </Button>
                    </Link>
                  </>
                ) : (
                  // User is not logged in - show login/register buttons
                  <>
                    <Link to="/auth/login" className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">Masuk</Button>
                    </Link>
                    <Link to="/auth/register" className="flex-1">
                      <Button variant="default" size="sm" className="w-full">Daftar</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
