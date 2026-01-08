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
import { Trash2 } from "lucide-react";
import { Contact } from "./types";

interface DeleteContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onConfirm: () => void;
}

export const DeleteContactDialog = ({
  isOpen,
  onOpenChange,
  contact,
  onConfirm,
}: DeleteContactDialogProps) => {
  if (!contact) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="w-[95vw] max-w-[425px] bg-card border-border p-4 sm:p-6">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-1.5 sm:gap-2 text-base sm:text-lg text-destructive">
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
            Hapus Kontak?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs sm:text-sm">
            Apakah Anda yakin ingin menghapus <strong>"{contact.name}"</strong>? 
            Tindakan ini tidak dapat dibatalkan.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-3 flex-col-reverse sm:flex-row">
          <AlertDialogCancel className="h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto">Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto"
          >
            Hapus
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
