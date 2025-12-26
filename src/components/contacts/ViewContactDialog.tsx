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
      <DialogContent className="sm:max-w-[500px] bg-card border-border">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Detail Kontak
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4 space-y-5">
          {/* Header with type icon */}
          <div className="flex items-center gap-4">
            <div className={cn("w-14 h-14 rounded-xl flex items-center justify-center", config.bg)}>
              <config.icon className={cn("w-7 h-7", config.color)} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">{contact.name}</h3>
              <span className={cn("text-sm font-medium", config.color)}>{config.label}</span>
            </div>
          </div>

          {/* Contact info */}
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="font-medium">{contact.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Telepon</p>
                <p className="font-medium">{contact.phone}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Lokasi</p>
                <p className="font-medium">{contact.location}</p>
              </div>
            </div>
            {contact.website && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Website</p>
                  <a href={contact.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">
                    {contact.website}
                  </a>
                </div>
              </div>
            )}
            {contact.address && (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Alamat</p>
                  <p className="font-medium">{contact.address}</p>
                </div>
              </div>
            )}
          </div>

          {/* Rating & Last Contact */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground mr-2">Rating:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "w-4 h-4",
                    star <= contact.rating
                      ? "text-primary fill-primary"
                      : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="w-3 h-3" />
              {contact.lastContact}
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div className="p-3 rounded-lg bg-secondary/30">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <FileText className="w-3 h-3" />
                Catatan
              </div>
              <p className="text-sm">{contact.notes}</p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-4 border-t border-border gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
          <Button onClick={onEdit} className="gap-2">
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
