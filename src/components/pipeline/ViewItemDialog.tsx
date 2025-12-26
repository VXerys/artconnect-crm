import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Edit } from "lucide-react";
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
      <DialogContent className="sm:max-w-[450px] bg-card border-border">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Detail Karya
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="text-muted-foreground">{item.medium}</p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Target Tanggal</span>
              <p className="font-medium">{item.dueDate}</p>
            </div>
            {item.price && (
              <div>
                <span className="text-muted-foreground">Harga</span>
                <p className="font-medium text-primary">{item.price}</p>
              </div>
            )}
          </div>
          {item.description && (
            <div>
              <span className="text-sm text-muted-foreground">Deskripsi</span>
              <p className="text-sm mt-1">{item.description}</p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-border gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button onClick={onEdit}>
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
