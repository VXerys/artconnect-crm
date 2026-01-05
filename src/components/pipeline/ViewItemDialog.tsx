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
// Updated: Image section added

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
      <DialogContent className="sm:max-w-[500px] bg-card border-border overflow-hidden p-0">
        {/* Image Section */}
        {item.image ? (
          <div className="relative w-full h-48 bg-muted/30">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
          </div>
        ) : (
          <div className="relative w-full h-32 bg-muted/30 flex items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
              <ImageIcon className="w-10 h-10" />
              <span className="text-xs">Tidak ada gambar</span>
            </div>
          </div>
        )}

        <div className="px-6">
          <DialogHeader className="pb-4 border-b border-border">
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              Detail Karya
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            {/* Title & Medium */}
            <div>
              <h3 className="text-lg font-semibold">{item.title}</h3>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                <Palette className="w-4 h-4" />
                <span>{item.medium || 'Tidak ada medium'}</span>
              </div>
            </div>

            {/* Price */}
            {item.price && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <DollarSign className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-xs text-muted-foreground">Harga</span>
                  <p className="font-semibold text-primary">{item.price}</p>
                </div>
              </div>
            )}

            {/* Description */}
            {item.description && (
              <div className="p-3 rounded-lg bg-muted/30">
                <span className="text-sm font-medium text-muted-foreground">Deskripsi</span>
                <p className="text-sm mt-1 whitespace-pre-wrap">{item.description}</p>
              </div>
            )}
          </div>

          <DialogFooter className="py-4 border-t border-border gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Tutup
            </Button>
            <Button onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
};
