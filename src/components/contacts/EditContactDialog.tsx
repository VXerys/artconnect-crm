import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Edit, Loader2, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactFormData, ContactFormErrors } from "./types";
import { typeConfig, locationOptions } from "./constants";

interface EditContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ContactFormData;
  formErrors: ContactFormErrors;
  isSubmitting: boolean;
  onInputChange: (field: keyof ContactFormData, value: string | number) => void;
  onSubmit: () => void;
}

export const EditContactDialog = ({
  isOpen,
  onOpenChange,
  formData,
  formErrors,
  isSubmitting,
  onInputChange,
  onSubmit,
}: EditContactDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Edit className="w-6 h-6 text-primary" />
            Edit Kontak
          </DialogTitle>
          <DialogDescription>
            Perbarui informasi kontak. Field dengan * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="edit-name">Nama <span className="text-destructive">*</span></Label>
            <Input
              id="edit-name"
              placeholder="Masukkan nama kontak..."
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className={cn("bg-secondary/50", formErrors.name && "border-destructive")}
            />
            {formErrors.name && <p className="text-xs text-destructive">{formErrors.name}</p>}
          </div>

          {/* Type & Location */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Tipe <span className="text-destructive">*</span></Label>
              <Select value={formData.type} onValueChange={(v) => onInputChange('type', v)}>
                <SelectTrigger className={cn("bg-secondary/50", formErrors.type && "border-destructive")}>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <config.icon className={cn("w-4 h-4", config.color)} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Lokasi <span className="text-destructive">*</span></Label>
              <Select value={formData.location} onValueChange={(v) => onInputChange('location', v)}>
                <SelectTrigger className={cn("bg-secondary/50", formErrors.location && "border-destructive")}>
                  <SelectValue placeholder="Pilih lokasi" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {locationOptions.map((loc) => (
                    <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className={cn("bg-secondary/50", formErrors.email && "border-destructive")}
              />
              {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">Telepon <span className="text-destructive">*</span></Label>
              <Input
                id="edit-phone"
                type="tel"
                placeholder="+62 xxx xxxx xxxx"
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                className={cn("bg-secondary/50", formErrors.phone && "border-destructive")}
              />
              {formErrors.phone && <p className="text-xs text-destructive">{formErrors.phone}</p>}
            </div>
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="edit-website">Website (Opsional)</Label>
            <Input
              id="edit-website"
              type="url"
              placeholder="https://..."
              value={formData.website}
              onChange={(e) => onInputChange('website', e.target.value)}
              className="bg-secondary/50"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="edit-address">Alamat (Opsional)</Label>
            <Input
              id="edit-address"
              placeholder="Alamat lengkap..."
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              className="bg-secondary/50"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label>Rating Prioritas</Label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onInputChange('rating', star)}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={cn(
                      "w-6 h-6 transition-colors",
                      star <= formData.rating
                        ? "text-primary fill-primary"
                        : "text-muted-foreground hover:text-primary/50"
                    )}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {formData.rating}/5
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Catatan (Opsional)</Label>
            <Textarea
              id="edit-notes"
              placeholder="Catatan tentang kontak ini..."
              value={formData.notes}
              onChange={(e) => onInputChange('notes', e.target.value)}
              className="bg-secondary/50 min-h-[80px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-border gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Batal
          </Button>
          <Button onClick={onSubmit} disabled={isSubmitting} className="gap-2 min-w-[120px] shadow-glow">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" />
                Simpan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
