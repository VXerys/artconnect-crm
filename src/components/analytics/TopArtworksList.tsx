import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Eye, MessageCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { TopArtwork } from "./types";
import { formatCompactCurrency } from "./constants";

interface TopArtworksListProps {
  artworks: TopArtwork[];
  maxHeight?: string; // Optional max height for scroll area
}

export const TopArtworksList = ({ artworks, maxHeight = "320px" }: TopArtworksListProps) => {
  const navigate = useNavigate();

  return (
    <Card className="bg-card border-border overflow-hidden h-full w-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 pb-3 sm:pb-4 border-b border-border flex-shrink-0 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-amber-500/10">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          </div>
          <div>
            <CardTitle className="font-display text-sm sm:text-base md:text-lg">Karya Bernilai Tinggi</CardTitle>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              Berdasarkan estimasi harga jual
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 sm:gap-1.5 md:gap-2 text-amber-400 hover:text-amber-400 h-7 sm:h-8 md:h-9 text-[10px] sm:text-xs md:text-sm px-2 sm:px-3 w-full xs:w-auto"
          onClick={() => navigate('/artworks')}
        >
          <span>Lihat Semua</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
        </Button>
      </CardHeader>

      {/* Artworks List - Scrollable */}
      <CardContent className="p-0 flex-1 overflow-hidden">
        {artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 px-4 sm:px-6 text-center">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-secondary/50 mb-3 sm:mb-4">
              <Award className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Belum ada data karya
            </p>
            <p className="text-muted-foreground/60 text-[10px] sm:text-xs mt-0.5 sm:mt-1">
              Tambahkan harga pada karya Anda
            </p>
          </div>
        ) : (
          <div 
            className="divide-y divide-border overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            style={{ maxHeight }}
          >
            {artworks.map((artwork, index) => (
              <div 
                key={artwork.id}
                className={cn(
                  "group flex items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-6 py-2.5 sm:py-3 md:py-4",
                  "hover:bg-secondary/30 transition-all duration-200"
                )}
              >
                {/* Rank */}
                <div className={cn(
                  "w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-md sm:rounded-lg flex items-center justify-center font-bold text-[10px] sm:text-xs md:text-sm flex-shrink-0",
                  index === 0 ? "bg-amber-500/20 text-amber-400" :
                  index === 1 ? "bg-slate-400/20 text-slate-400" :
                  index === 2 ? "bg-orange-600/20 text-orange-500" :
                  "bg-secondary text-muted-foreground"
                )}>
                  #{index + 1}
                </div>

                {/* Thumbnail */}
                <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-md sm:rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                  {artwork.image ? (
                    <img 
                      src={artwork.image} 
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-xs sm:text-sm md:text-base truncate group-hover:text-primary transition-colors">
                    {artwork.title}
                  </h4>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{artwork.medium}</p>
                </div>

                {/* Value */}
                <div className="text-right flex-shrink-0">
                  <div className="flex items-center justify-end gap-1 sm:gap-1.5 text-emerald-400 font-medium text-[10px] sm:text-xs md:text-sm">
                    <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    <span>{formatCompactCurrency(artwork.revenue)}</span>
                  </div>
                  <p className="text-[9px] sm:text-[10px] text-muted-foreground mt-0.5">Estimated Value</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
