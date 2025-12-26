import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Trash2, AlertTriangle } from "lucide-react";
import { Artwork } from "./types";

interface DeleteArtworkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  artwork: Artwork | null;
  onConfirm: () => void;
}

export const DeleteArtworkDialog = ({
  isOpen,
  onOpenChange,
  artwork,
  onConfirm,
}: DeleteArtworkDialogProps) => {
  if (!artwork) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="bg-card border-border">
        <AlertDialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-full bg-destructive/10">
              <AlertTriangle className="w-5 h-5 text-destructive" />
            </div>
            <AlertDialogTitle>Hapus Karya Seni?</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="space-y-2">
            <p>
              Apakah Anda yakin ingin menghapus karya seni <strong>"{artwork.title}"</strong>?
            </p>
            <p className="text-destructive/80">
              Tindakan ini tidak dapat dibatalkan.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
