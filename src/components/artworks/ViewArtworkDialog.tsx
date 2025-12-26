import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Eye, 
  Edit, 
  Ruler, 
  Calendar,
  Palette,
  DollarSign,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Artwork } from "./types";
import { statusConfig, formatCurrency } from "./constants";

interface ViewArtworkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  artwork: Artwork | null;
  onEdit: () => void;
}

// Status colors
const statusColors = {
  concept: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  wip: "bg-blue-500/10 text-blue-400 border-blue-500/30",
  finished: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
  sold: "bg-amber-500/10 text-amber-400 border-amber-500/30",
};

export const ViewArtworkDialog = ({
  isOpen,
  onOpenChange,
  artwork,
  onEdit,
}: ViewArtworkDialogProps) => {
  if (!artwork) return null;

  const status = artwork.status as keyof typeof statusColors;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-card border-border">
        {/* Image Header */}
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <img 
            src={artwork.image} 
            alt={artwork.title}
            className="w-full h-full object-cover"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          
          {/* Close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Status badge */}
          <div className="absolute bottom-4 left-4">
            <span className={cn(
              "px-3 py-1.5 rounded-full text-sm font-medium border backdrop-blur-sm",
              statusColors[status]
            )}>
              {statusConfig[status].label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <DialogHeader className="p-0 space-y-1">
            <DialogTitle className="font-display text-2xl">
              {artwork.title}
            </DialogTitle>
            <p className="text-muted-foreground">{artwork.medium}</p>
          </DialogHeader>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <Ruler className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Dimensi</p>
                <p className="font-medium">{artwork.dimensions}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tahun</p>
                <p className="font-medium">{artwork.year}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <Palette className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Medium</p>
                <p className="font-medium">{artwork.medium}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Harga</p>
                <p className="font-medium text-primary">
                  {artwork.price ? formatCurrency(artwork.price) : "Belum ada harga"}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          {artwork.description && (
            <div className="p-4 rounded-xl bg-secondary/30 border-l-2 border-primary/30">
              <p className="text-sm text-muted-foreground italic">
                "{artwork.description}"
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="p-6 pt-0 gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button onClick={onEdit} className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Karya
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
