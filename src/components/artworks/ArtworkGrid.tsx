import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Ruler, 
  Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Artwork } from "./types";
import { statusConfig, formatCurrency } from "./constants";

interface ArtworkGridProps {
  artworks: Artwork[];
  onView: (artwork: Artwork) => void;
  onEdit: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
}

// Status gradient backgrounds
const statusGradients = {
  concept: "from-purple-500/20 to-purple-500/5",
  wip: "from-blue-500/20 to-blue-500/5",
  finished: "from-emerald-500/20 to-emerald-500/5",
  sold: "from-amber-500/20 to-amber-500/5",
};

// Status badge styles
const statusBadgeStyles = {
  concept: "bg-purple-500/90 text-white",
  wip: "bg-blue-500/90 text-white",
  finished: "bg-emerald-500/90 text-white",
  sold: "bg-amber-500/90 text-white",
};

export const ArtworkGrid = ({ artworks, onView, onEdit, onDelete }: ArtworkGridProps) => {
  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative p-6 rounded-full bg-secondary border-2 border-dashed border-border">
            <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Tidak ada karya ditemukan</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Coba ubah filter atau tambahkan karya seni baru ke koleksi Anda
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {artworks.map((artwork) => {
        const status = artwork.status as keyof typeof statusGradients;
        
        return (
          <Card 
            key={artwork.id} 
            className={cn(
              "group relative overflow-hidden transition-all duration-500",
              "bg-card border-border hover:border-primary/40",
              "hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-xl sm:hover:shadow-2xl hover:shadow-primary/10",
              "cursor-pointer"
            )}
            onClick={() => onView(artwork)}
          >
            {/* Status indicator bar at top */}
            <div className={cn(
              "absolute top-0 left-0 right-0 h-0.5 sm:h-1 z-10",
              status === 'concept' && "bg-gradient-to-r from-purple-500 to-purple-400",
              status === 'wip' && "bg-gradient-to-r from-blue-500 to-blue-400",
              status === 'finished' && "bg-gradient-to-r from-emerald-500 to-emerald-400",
              status === 'sold' && "bg-gradient-to-r from-amber-500 to-amber-400"
            )} />

            {/* Image Container */}
            <div className="aspect-[4/3] relative overflow-hidden">
              <img 
                src={artwork.image} 
                alt={artwork.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 sm:group-hover:scale-110"
              />
              
              {/* Gradient overlay on hover */}
              <div className={cn(
                "absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-all duration-500",
                statusGradients[status],
                "from-background/90 via-background/40 to-transparent"
              )} />

              {/* Top badges */}
              <div className="absolute top-2 sm:top-3 left-2 sm:left-3 right-2 sm:right-3 flex items-start justify-between">
                {/* Status badge */}
                <span className={cn(
                  "px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold backdrop-blur-md shadow-lg",
                  statusBadgeStyles[status]
                )}>
                  {statusConfig[status].label}
                </span>

                {/* Year badge */}
                <span className="px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium bg-background/80 backdrop-blur-md border border-border flex items-center gap-0.5 sm:gap-1">
                  <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  {artwork.year}
                </span>
              </div>

              {/* Hover overlay with action buttons */}
              <div className="absolute inset-0 flex items-center justify-center gap-2 sm:gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                {/* View Button */}
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background/90 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(artwork);
                  }}
                >
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>

                {/* Edit Button */}
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background/90 backdrop-blur-md hover:bg-primary hover:text-primary-foreground transition-all duration-200 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(artwork);
                  }}
                >
                  <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>

                {/* Delete Button */}
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-background/90 backdrop-blur-md hover:bg-destructive hover:text-destructive-foreground transition-all duration-200 shadow-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(artwork);
                  }}
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
              {/* Title & Medium */}
              <div>
                <h3 className="font-display font-semibold text-sm sm:text-base md:text-lg leading-tight group-hover:text-primary transition-colors line-clamp-2">
                  {artwork.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 sm:mt-1 truncate">{artwork.medium}</p>
              </div>

              {/* Dimensions & Price */}
              <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-border/50">
                <div className="flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm text-muted-foreground">
                  <Ruler className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                  <span className="truncate max-w-[100px] sm:max-w-none">{artwork.dimensions}</span>
                </div>
                
                {artwork.price ? (
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <span className="text-[10px] sm:text-xs text-muted-foreground">IDR</span>
                    <span className="font-semibold text-xs sm:text-sm md:text-base text-primary truncate max-w-[80px] sm:max-w-none">
                      {new Intl.NumberFormat('id-ID', { notation: 'compact' }).format(artwork.price)}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground italic">Belum ada harga</span>
                )}
              </div>
            </CardContent>

            {/* Hover glow */}
            <div className={cn(
              "absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500",
              "bg-gradient-to-t via-transparent to-transparent",
              statusGradients[status]
            )} />
          </Card>
        );
      })}
    </div>
  );
};
