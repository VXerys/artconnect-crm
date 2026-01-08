import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, EyeOff, Palette } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DashboardArtwork } from "./types";
import { statusConfig } from "./constants";
import { toast } from "sonner";

interface RecentArtworksProps {
  artworks: DashboardArtwork[];
  onViewArtwork?: (artworkId: number) => void;
}

export const RecentArtworks = ({ artworks, onViewArtwork }: RecentArtworksProps) => {
  const navigate = useNavigate();
  
  // State to track which artwork prices are hidden
  const [hiddenPrices, setHiddenPrices] = useState<Set<number>>(new Set());

  // Handle artwork row click
  const handleArtworkClick = (artwork: DashboardArtwork): void => {
    if (onViewArtwork) {
      onViewArtwork(artwork.id);
    } else {
      // Fallback: navigate to artworks page
      navigate('/artworks');
      toast.info(`Membuka ${artwork.title}...`, { duration: 1500 });
    }
  };

  // Toggle price visibility
  const handleTogglePriceVisibility = (
    event: React.MouseEvent<HTMLButtonElement>,
    artworkId: number
  ): void => {
    event.stopPropagation(); // Prevent row click
    
    setHiddenPrices(prev => {
      const newSet = new Set(prev);
      if (newSet.has(artworkId)) {
        newSet.delete(artworkId);
        toast.success("Harga ditampilkan", { duration: 1500 });
      } else {
        newSet.add(artworkId);
        toast.success("Harga disembunyikan", { duration: 1500 });
      }
      return newSet;
    });
  };

  // Check if price is hidden for an artwork
  const isPriceHidden = (artworkId: number): boolean => {
    return hiddenPrices.has(artworkId);
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Karya Terbaru</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {artworks.length} karya ditampilkan
            </p>
          </div>
        </div>
        <Link to="/artworks">
          <Button variant="ghost" size="sm" className="gap-2 text-primary hover:text-primary">
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>

      {/* Artworks List */}
      <CardContent className="p-0">
        {artworks.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-10 sm:py-12 md:py-16 px-4 text-center">
            <div className="relative mb-3 sm:mb-4">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative p-3 sm:p-4 rounded-full bg-secondary/50 border-2 border-dashed border-border">
                <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-1.5">Belum Ada Karya</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">
              Tambahkan karya seni pertama Anda untuk memulai
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {artworks.map((artwork, index) => {
              const status = artwork.status as keyof typeof statusConfig;
              const config = statusConfig[status] || statusConfig.concept;

              return (
                <div 
                  key={artwork.id} 
                  className={cn(
                    "group flex items-center gap-4 px-6 py-4",
                    "hover:bg-secondary/30 transition-all duration-200",
                    "cursor-pointer"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => handleArtworkClick(artwork)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && handleArtworkClick(artwork)}
                  aria-label={`Lihat detail ${artwork.title}`}
                >
                  {/* Thumbnail */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 bg-secondary">
                    {artwork.image ? (
                      <img 
                        src={artwork.image} 
                        alt={artwork.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Palette className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                    {/* Status dot */}
                    <div className={cn(
                      "absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border-2 border-card",
                      config.dotColor
                    )} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                      {artwork.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{artwork.medium}</span>
                      <span className="text-muted-foreground/50">•</span>
                      <span className="text-xs text-muted-foreground">{artwork.date}</span>
                    </div>
                  </div>

                  {/* Status & Price */}
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium border",
                      config.className
                    )}>
                      {config.label}
                    </span>
                    {artwork.price && (
                      <span className={cn(
                        "text-sm font-semibold hidden sm:block",
                        isPriceHidden(artwork.id) ? "text-muted-foreground" : "text-primary"
                      )}>
                        {isPriceHidden(artwork.id) ? "••••••••" : artwork.price}
                      </span>
                    )}
                  </div>

                  {/* Toggle Price Visibility Button */}
                  {artwork.price && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className={cn(
                        "h-8 w-8 transition-all",
                        isPriceHidden(artwork.id) 
                          ? "opacity-100 text-muted-foreground hover:text-primary" 
                          : "opacity-0 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary"
                      )}
                      onClick={(e) => handleTogglePriceVisibility(e, artwork.id)}
                      aria-label={isPriceHidden(artwork.id) ? `Tampilkan harga ${artwork.title}` : `Sembunyikan harga ${artwork.title}`}
                    >
                      {isPriceHidden(artwork.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
