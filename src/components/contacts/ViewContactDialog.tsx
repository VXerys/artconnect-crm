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
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Star, 
  Calendar,
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Contact } from "./types";
import { typeConfig } from "./constants";

interface ViewContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  contact: Contact | null;
  onEdit: () => void;
}

export const ViewContactDialog = ({
  isOpen,
  onOpenChange,
  contact,
  onEdit,
}: ViewContactDialogProps) => {
  if (!contact) return null;

  const config = typeConfig[contact.type];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-[500px] bg-card border-border p-4 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4 border-b border-border">
          <DialogTitle className="font-display text-base sm:text-lg md:text-xl flex items-center gap-1.5 sm:gap-2">
            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
            Detail Kontak
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-3 sm:py-4 space-y-3 sm:space-y-4 md:space-y-5">
          {/* Header with type icon */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={cn("w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl flex items-center justify-center", config.bg)}>
              <config.icon className={cn("w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7", config.color)} />
            </div>
            <div>
              <h3 className="text-sm sm:text-base md:text-lg font-semibold">{contact.name}</h3>
              <span className={cn("text-xs sm:text-sm font-medium", config.color)}>{config.label}</span>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-md sm:rounded-lg bg-secondary/30">
              <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] sm:text-xs text-muted-foreground">Email</p>
                <p className="font-medium truncate">{contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-md sm:rounded-lg bg-secondary/30">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Telepon</p>
                <p className="font-medium">{contact.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-md sm:rounded-lg bg-secondary/30">
              <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
              <div>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Lokasi</p>
                <p className="font-medium">{contact.location}</p>
              </div>
            </div>
            {contact.website && (
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-md sm:rounded-lg bg-secondary/30">
                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Website</p>
                  <a href={contact.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate block">
                    {contact.website}
                  </a>
                </div>
              </div>
            )}
            {contact.address && (
              <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-md sm:rounded-lg bg-secondary/30">
                <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground">Alamat</p>
                  <p className="font-medium">{contact.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Rating & Last Contact */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0 p-2 sm:p-3 rounded-md sm:rounded-lg bg-secondary/30">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs text-muted-foreground mr-1 sm:mr-2">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-3 h-3 sm:w-4 sm:h-4",
                    star <= contact.rating
                      ? "text-primary fill-primary"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
              <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
              {contact.lastContact}
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="p-2 sm:p-3 rounded-md sm:rounded-lg bg-secondary/30">
              <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground mb-1.5 sm:mb-2">
                <FileText className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                Catatan
              </div>
              <p className="text-xs sm:text-sm">{contact.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-3 sm:pt-4 border-t border-border gap-2 flex-col-reverse sm:flex-row">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto"
          >
            Tutup
          </Button>
          <Button 
            onClick={onEdit} 
            className="gap-1.5 sm:gap-2 h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto"
          >
            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
