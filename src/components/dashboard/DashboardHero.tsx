import { Button } from "@/components/ui/button";
import { 
  Palette, 
  Sparkles, 
  Calendar,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

interface DashboardHeroProps {
  userName?: string;
  totalArtworks: number;
  totalSales: string;
}

export const DashboardHero = ({ 
  userName = "Seniman",
  totalArtworks,
  totalSales,
}: DashboardHeroProps) => {
  // Get current time greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 17) return "Selamat Siang";
    if (hour < 20) return "Selamat Sore";
    return "Selamat Malam";
  };

  // Get current date
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-purple-500/5 border border-border p-6 lg:p-8">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left side */}
        <div className="space-y-4">
          {/* Date badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-sm text-muted-foreground">
            <Calendar className="w-3.5 h-3.5" />
            {getCurrentDate()}
          </div>

          {/* Greeting */}
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold">
              {getGreeting()}, <span className="text-primary">{userName}</span>! 👋
            </h1>
            <p className="text-muted-foreground mt-2 text-lg max-w-xl">
              Pantau perkembangan karya seni dan kelola bisnis Anda dengan mudah.
            </p>
          </div>

          {/* Summary stats */}
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-bold text-xl">{totalArtworks}</span>
                <span className="text-muted-foreground text-sm ml-1">karya</span>
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-xl text-emerald-400">{totalSales}</span>
                <span className="text-muted-foreground text-sm ml-1">penjualan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
          <Link to="/artworks">
            <Button size="lg" className="gap-2 shadow-glow group w-full sm:w-auto">
              <Palette className="w-5 h-5" />
              Tambah Karya Baru
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link to="/pipeline">
            <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
              <Sparkles className="w-5 h-5" />
              Lihat Pipeline
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
