import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Eye, 
  Edit, 
  Trash2, 
  Ruler, 
  Calendar,
  ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Artwork } from "./types";
import { statusConfig, formatCurrency } from "./constants";

interface ArtworkListProps {
  artworks: Artwork[];
  onView: (artwork: Artwork) => void;
  onEdit: (artwork: Artwork) => void;
  onDelete: (artwork: Artwork) => void;
}

// Status colors for badges
const statusBadgeColors = {
  concept: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  wip: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  finished: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  sold: "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

// Status dot colors
const statusDotColors = {
  concept: "bg-purple-500",
  wip: "bg-blue-500",
  finished: "bg-emerald-500",
  sold: "bg-amber-500",
};

export const ArtworkList = ({ artworks, onView, onEdit, onDelete }: ArtworkListProps) => {
  if (artworks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative p-6 rounded-full bg-secondary border-2 border-dashed border-border">
            <ImageIcon className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2">Tidak ada karya ditemukan</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Coba ubah filter atau tambahkan karya seni baru
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Header */}
      <div className="hidden md:grid grid-cols-12 gap-4 p-4 bg-secondary/50 border-b border-border text-sm font-medium text-muted-foreground">
        <div className="col-span-5">Karya Seni</div>
        <div className="col-span-2">Medium</div>
        <div className="col-span-2">Dimensi</div>
        <div className="col-span-1">Status</div>
        <div className="col-span-1 text-right">Harga</div>
        <div className="col-span-1 text-center">Aksi</div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border">
        {artworks.map((artwork) => {
          const status = artwork.status as keyof typeof statusBadgeColors;
          
          return (
            <div 
              key={artwork.id}
              className={cn(
                "group grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center",
                "transition-all duration-200 hover:bg-secondary/30",
                "cursor-pointer"
              )}
              onClick={() => onView(artwork)}
            >
              {/* Artwork Info */}
              <div className="md:col-span-5 flex items-center gap-4">
                {/* Thumbnail */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden flex-shrink-0 group/img">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-110"
                  />
                  {/* Status indicator dot */}
                  <div className={cn(
                    "absolute bottom-1 right-1 w-3 h-3 rounded-full border-2 border-background",
                    statusDotColors[status]
                  )} />
                </div>

                {/* Title & Year */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                    {artwork.title}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{artwork.year}</span>
                    <span className="md:hidden">• {artwork.medium}</span>
                  </div>
                </div>
              </div>

              {/* Medium - Hidden on mobile */}
              <div className="hidden md:block md:col-span-2 text-sm text-muted-foreground">
                {artwork.medium}
              </div>

              {/* Dimensions - Hidden on mobile */}
              <div className="hidden md:flex md:col-span-2 items-center gap-1.5 text-sm text-muted-foreground">
                <Ruler className="w-4 h-4" />
                {artwork.dimensions}
              </div>

              {/* Status */}
              <div className="hidden md:block md:col-span-1">
                <span className={cn(
                  "inline-flex px-2.5 py-1 rounded-full text-xs font-medium border",
                  statusBadgeColors[status]
                )}>
                  {statusConfig[status].label}
                </span>
              </div>

              {/* Price */}
              <div className="hidden md:block md:col-span-1 text-right">
                {artwork.price ? (
                  <span className="font-medium text-primary">
                    {formatCurrency(artwork.price)}
                  </span>
                ) : (
                  <span className="text-sm text-muted-foreground">-</span>
                )}
              </div>

              {/* Actions */}
              <div className="hidden md:flex md:col-span-1 justify-center gap-1">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(artwork);
                  }}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(artwork);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all hover:bg-destructive/10 hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(artwork);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Mobile: Price & Status Row */}
              <div className="flex md:hidden items-center justify-between">
                <span className={cn(
                  "inline-flex px-2.5 py-1 rounded-full text-xs font-medium border",
                  statusBadgeColors[status]
                )}>
                  {statusConfig[status].label}
                </span>
                
                <div className="flex items-center gap-2">
                  {artwork.price ? (
                    <span className="font-medium text-primary">
                      {formatCurrency(artwork.price)}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground">Belum ada harga</span>
                  )}
                  
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(artwork);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(artwork);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
