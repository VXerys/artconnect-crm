import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const CTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl" />

      <div className="container px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Mulai Gratis Sekarang</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Siap Mengembangkan<br />
            <span className="text-gradient">Karier Seni</span> Anda?
          </h2>

          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Bergabunglah dengan seniman visual yang sudah mentransformasi cara mereka 
            mengelola bisnis seni dengan ArtConnect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="group">
                Mulai Gratis
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="hero-outline" size="xl">
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
