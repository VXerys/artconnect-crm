import { Button } from "@/components/ui/button";
import { Palette, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <Palette className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display text-xl font-bold">
              Art<span className="text-primary">Connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Beranda
            </Link>
            <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Dashboard
            </Link>
            <Link to="/artworks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Karya Seni
            </Link>
            <Link to="/contacts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Kontak
            </Link>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm">Masuk</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="default" size="sm">Daftar Gratis</Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border/50 animate-slide-up">
            <div className="flex flex-col gap-4">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Beranda
              </Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link to="/artworks" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Karya Seni
              </Link>
              <Link to="/contacts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Kontak
              </Link>
              <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                <Link to="/dashboard" className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">Masuk</Button>
                </Link>
                <Link to="/dashboard" className="flex-1">
                  <Button variant="default" size="sm" className="w-full">Daftar</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
