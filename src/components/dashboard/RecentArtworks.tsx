import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Palette } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DashboardArtwork } from "./types";
import { statusConfig } from "./constants";

interface RecentArtworksProps {
  artworks: DashboardArtwork[];
}

export const RecentArtworks = ({ artworks }: RecentArtworksProps) => {
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
        <div className="divide-y divide-border">
          {artworks.map((artwork, index) => {
            const status = artwork.status as keyof typeof statusConfig;
            const config = statusConfig[status];

            return (
              <div 
                key={artwork.id} 
                className={cn(
                  "group flex items-center gap-4 px-6 py-4",
                  "hover:bg-secondary/30 transition-all duration-200",
                  "cursor-pointer"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
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
                    <span className="text-sm font-semibold text-primary hidden sm:block">
                      {artwork.price}
                    </span>
                  )}
                </div>

                {/* Hover Action */}
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
