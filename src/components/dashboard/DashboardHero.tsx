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
    <div className="relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary/5 via-background to-purple-500/5 border border-border p-3 sm:p-5 md:p-6 lg:p-8">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-40 h-40 sm:w-60 sm:h-60 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 sm:w-40 sm:h-40 bg-purple-500/10 rounded-full blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-16 h-16 sm:w-20 sm:h-20 bg-emerald-500/10 rounded-full blur-xl" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-3 sm:gap-4 md:gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        {/* Left side */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4 flex-1 min-w-0">
          {/* Date badge */}
          <div className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 rounded-full bg-secondary/50 border border-border text-[10px] sm:text-xs md:text-sm text-muted-foreground">
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 flex-shrink-0" />
            <span className="truncate max-w-[180px] sm:max-w-none">{getCurrentDate()}</span>
          </div>

          {/* Greeting */}
          <div>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              {getGreeting()}, <span className="text-primary">{userName}</span>! 👋
            </h1>
            <p className="text-muted-foreground mt-0.5 sm:mt-1 md:mt-2 text-xs sm:text-sm md:text-base lg:text-lg max-w-xl leading-relaxed">
              Pantau perkembangan karya seni dan kelola bisnis Anda dengan mudah.
            </p>
          </div>

          {/* Summary stats */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 pt-0.5 sm:pt-1 md:pt-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg bg-primary/10 flex-shrink-0">
                <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary" />
              </div>
              <div className="flex items-baseline gap-0.5 sm:gap-1">
                <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl">{totalArtworks}</span>
                <span className="text-muted-foreground text-[10px] sm:text-xs md:text-sm">karya</span>
              </div>
            </div>
            <div className="hidden xs:block w-px h-6 sm:h-7 md:h-8 bg-border/50" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg bg-emerald-500/10 flex-shrink-0">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-emerald-400" />
              </div>
              <div className="flex items-baseline gap-0.5 sm:gap-1">
                <span className="font-bold text-sm sm:text-base md:text-lg lg:text-xl text-emerald-400">{totalSales}</span>
                <span className="text-muted-foreground text-[10px] sm:text-xs md:text-sm">penjualan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - CTA */}
        <div className="flex flex-col gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 w-full xs:flex-row lg:flex-col lg:w-auto lg:min-w-[180px] xl:min-w-[220px]">
          <Link to="/artworks" className="w-full">
            <Button size="lg" className="gap-1.5 sm:gap-2 shadow-glow group h-9 sm:h-10 md:h-11 lg:h-12 text-[11px] sm:text-xs md:text-sm lg:text-base w-full justify-center px-3 sm:px-4">
              <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 flex-shrink-0" />
              <span className="hidden md:inline truncate font-medium">Tambah Karya Baru</span>
              <span className="md:hidden truncate font-medium">Tambah Karya</span>
              <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform flex-shrink-0" />
            </Button>
          </Link>
          <Link to="/pipeline" className="w-full">
            <Button variant="outline" size="lg" className="gap-1.5 sm:gap-2 h-9 sm:h-10 md:h-11 lg:h-12 text-[11px] sm:text-xs md:text-sm lg:text-base w-full justify-center px-3 sm:px-4">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 flex-shrink-0" />
              <span className="truncate font-medium">Lihat Pipeline</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
