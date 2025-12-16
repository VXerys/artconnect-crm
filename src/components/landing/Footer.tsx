import { Palette } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="container px-4">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Palette className="w-5 h-5 text-primary" />
              </div>
              <span className="font-display text-xl font-bold">
                Art<span className="text-primary">Connect</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-md">
              Platform CRM berbasis web yang dirancang khusus untuk seniman visual independen. 
              Kelola karya, jejaring, dan kembangkan karier seni Anda.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link></li>
              <li><Link to="/artworks" className="hover:text-foreground transition-colors">Karya Seni</Link></li>
              <li><Link to="/contacts" className="hover:text-foreground transition-colors">Kontak</Link></li>
              <li><Link to="/analytics" className="hover:text-foreground transition-colors">Analitik</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Informasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Tentang Kami</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Panduan Penggunaan</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Kebijakan Privasi</span></li>
              <li><span className="hover:text-foreground transition-colors cursor-pointer">Syarat & Ketentuan</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2025 ArtConnect. Tim Pengembang - UTS Rekayasa Perangkat Lunak.
          </p>
          <p className="text-sm text-muted-foreground">
            M. Akbar Rizky S. • Moch. Sechan A. • M. Fathir Bagas • M. Ghibran M. • M. Sinar Agusta
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
