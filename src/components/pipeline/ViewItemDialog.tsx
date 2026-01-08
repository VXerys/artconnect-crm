import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Edit, Palette, DollarSign, ImageIcon } from "lucide-react";
import { PipelineItem } from "./types";

interface ViewItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  item: PipelineItem | null;
  onEdit: () => void;
}

export const ViewItemDialog = ({
  isOpen,
  onOpenChange,
  item,
  onEdit,
}: ViewItemDialogProps) => {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] bg-card border-border overflow-hidden p-0 max-h-[90vh] overflow-y-auto">
        {/* Image Section */}
        {item.image ? (
          <div className="relative w-full h-36 sm:h-44 md:h-48 bg-muted/30">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>
        ) : (
          <div className="relative w-full h-24 sm:h-28 md:h-32 bg-muted/30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1.5 sm:gap-2 text-muted-foreground/50">
              <ImageIcon className="w-8 h-8 sm:w-10 sm:h-10" />
              <span className="text-[10px] sm:text-xs">Tidak ada gambar</span>
            </div>
          </div>
        )}

        <div className="px-4 sm:px-5 md:px-6">
          <DialogHeader className="pb-3 sm:pb-4 border-b border-border">
            <DialogTitle className="font-display text-base sm:text-lg md:text-xl flex items-center gap-1.5 sm:gap-2">
              <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
              Detail Karya
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-3 sm:py-4 space-y-3 sm:space-y-4">
            {/* Title & Medium */}
            <div>
              <h3 className="text-base sm:text-lg font-semibold">{item.title}</h3>
              <div className="flex items-center gap-1.5 sm:gap-2 mt-0.5 sm:mt-1 text-muted-foreground">
                <Palette className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">{item.medium || 'Tidak ada medium'}</span>
              </div>
            </div>

            {/* Price */}
            {item.price && (
              <div className="flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-primary/10 border border-primary/20">
                <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-primary flex-shrink-0" />
                <div>
                  <span className="text-[10px] sm:text-xs text-muted-foreground">Harga</span>
                  <p className="font-semibold text-primary text-sm sm:text-base">{item.price}</p>
                </div>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <div className="p-2.5 sm:p-3 rounded-lg bg-muted/30">
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">Deskripsi</span>
                <p className="text-xs sm:text-sm mt-0.5 sm:mt-1 whitespace-pre-wrap">{item.description}</p>
              </div>
            )}
          </div>

          <DialogFooter className="py-3 sm:py-4 border-t border-border gap-2 flex-col sm:flex-row">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
            >
              Tutup
            </Button>
            <Button 
              onClick={onEdit}
              className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10 gap-1.5 sm:gap-2"
            >
              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Edit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
