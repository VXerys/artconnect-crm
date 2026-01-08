import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight, TrendingUp, Palette, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface QuickInsight {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
  bgColor: string;
}

export const QuickInsightsCard = () => {
  const { user } = useAuth();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Seniman';

  // Dynamic insights based on context
  const quickInsights: QuickInsight[] = [
    {
      id: 1,
      icon: Palette,
      title: "Mulai Berkarya",
      description: "Tambahkan karya seni Anda ke inventaris untuk mulai melacak nilai dan status",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      id: 2,
      icon: TrendingUp,
      title: "Pantau Performa",
      description: "Data analitik akan terupdate otomatis sesuai dengan aktivitas Anda",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      id: 3,
      icon: Info,
      title: "Bangun Jaringan",
      description: "Tambahkan kontak galeri, kolektor, dan museum untuk memperluas jejaring",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      id: 4,
      icon: Lightbulb,
      title: `Selamat Datang, ${userName}!`,
      description: "Eksplorasi fitur ArtConnect untuk mengelola karir seni Anda dengan lebih efektif",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-4 border-b border-border px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-primary/10">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-sm sm:text-base md:text-lg">Insight Cepat</CardTitle>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              Rekomendasi berdasarkan data
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Insights Grid */}
      <CardContent className="p-2 sm:p-3 md:p-4">
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {quickInsights?.filter(i => i && i.icon).map((insight) => (
            <div 
              key={insight.id}
              className={cn(
                "group relative p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl",
                "bg-secondary/30 border border-border",
                "hover:border-primary/40 hover:bg-secondary/50",
                "transition-all duration-300 cursor-pointer"
              )}
            >
              {/* Gradient glow on hover */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg sm:rounded-xl",
                "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
              )} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={cn(
                  "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg flex items-center justify-center mb-2 sm:mb-3",
                  "transition-transform duration-300 group-hover:scale-110",
                  insight.bgColor
                )}>
                  <insight.icon className={cn("w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5", insight.color)} />
                </div>

                {/* Text */}
                <h4 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1 group-hover:text-primary transition-colors line-clamp-1">
                  {insight.title}
                </h4>
                <p className="text-[10px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">
                  {insight.description}
                </p>

                {/* Arrow that appears on hover */}
                <div className="absolute top-2 sm:top-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
