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
import { Plus, Loader2, Users, Star, Building2, User, Palette } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactFormData, ContactFormErrors, ContactType } from "./types";
import { typeConfig, locationOptions } from "./constants";

interface AddContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ContactFormData;
  formErrors: ContactFormErrors;
  isSubmitting: boolean;
  onInputChange: (field: keyof ContactFormData, value: string | number) => void;
  onSubmit: () => void;
}

export const AddContactDialog = ({
  isOpen,
  onOpenChange,
  formData,
  formErrors,
  isSubmitting,
  onInputChange,
  onSubmit,
}: AddContactDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Users className="w-6 h-6 text-primary" />
            Tambah Kontak Baru
          </DialogTitle>
          <DialogDescription>
            Tambahkan kontak baru ke jejaring profesional Anda. Field dengan * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-5">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="add-name">Nama <span className="text-destructive">*</span></Label>
            <Input
              id="add-name"
              placeholder="Masukkan nama kontak..."
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className={cn(
                "bg-secondary/50",
                formErrors.name && "border-destructive"
              )}
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
              {formErrors.type && <p className="text-xs text-destructive">{formErrors.type}</p>}
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
              {formErrors.location && <p className="text-xs text-destructive">{formErrors.location}</p>}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="add-email">Email <span className="text-destructive">*</span></Label>
              <Input
                id="add-email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className={cn("bg-secondary/50", formErrors.email && "border-destructive")}
              />
              {formErrors.email && <p className="text-xs text-destructive">{formErrors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone">Telepon <span className="text-destructive">*</span></Label>
              <Input
                id="add-phone"
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
            <Label htmlFor="add-website">Website (Opsional)</Label>
            <Input
              id="add-website"
              type="url"
              placeholder="https://..."
              value={formData.website}
              onChange={(e) => onInputChange('website', e.target.value)}
              className="bg-secondary/50"
            />
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="add-address">Alamat (Opsional)</Label>
            <Input
              id="add-address"
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
            <Label htmlFor="add-notes">Catatan (Opsional)</Label>
            <Textarea
              id="add-notes"
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
          <Button onClick={onSubmit} disabled={isSubmitting} className="gap-2 min-w-[130px] shadow-glow">
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Tambah Kontak
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
