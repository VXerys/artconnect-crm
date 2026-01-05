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
  return (
    <Card className="bg-card border-border overflow-hidden h-full w-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Award className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Karya Bernilai Tinggi</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Berdasarkan estimasi harga jual
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-amber-400 hover:text-amber-400">
          Lihat Semua
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardHeader>

      {/* Artworks List - Scrollable */}
      <CardContent className="p-0 flex-1 overflow-hidden">
        {artworks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <div className="p-3 rounded-xl bg-secondary/50 mb-4">
              <Award className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              Belum ada data karya
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1">
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
                  "group flex items-center gap-4 px-6 py-4",
                  "hover:bg-secondary/30 transition-all duration-200"
                )}
              >
                {/* Rank */}
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm",
                  index === 0 ? "bg-amber-500/20 text-amber-400" :
                  index === 1 ? "bg-slate-400/20 text-slate-400" :
                  index === 2 ? "bg-orange-600/20 text-orange-500" :
                  "bg-secondary text-muted-foreground"
                )}>
                  #{index + 1}
                </div>

                {/* Thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-secondary">
                  {artwork.image ? (
                    <img 
                      src={artwork.image} 
                      alt={artwork.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Award className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                    {artwork.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">{artwork.medium}</p>
                </div>

                {/* Value */}
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1.5 text-emerald-400 font-medium">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>{formatCompactCurrency(artwork.revenue)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Estimated Value</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
