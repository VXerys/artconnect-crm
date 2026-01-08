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
import { Plus, Loader2, Users, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ContactFormData, ContactFormErrors } from "./types";
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
      <DialogContent className="w-[95vw] max-w-[550px] max-h-[90vh] overflow-y-auto bg-card border-border p-4 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4 border-b border-border">
          <DialogTitle className="font-display text-lg sm:text-xl md:text-2xl flex items-center gap-1.5 sm:gap-2">
            <Users className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-primary" />
            Tambah Kontak Baru
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Tambahkan kontak baru ke jejaring profesional Anda. Field dengan * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 sm:gap-4 md:gap-5 py-3 sm:py-4 md:py-5">
          {/* Name */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="add-name" className="text-xs sm:text-sm">Nama <span className="text-destructive">*</span></Label>
            <Input
              id="add-name"
              placeholder="Masukkan nama kontak..."
              value={formData.name}
              onChange={(e) => onInputChange('name', e.target.value)}
              className={cn(
                "bg-secondary/50 h-9 sm:h-10 text-xs sm:text-sm",
                formErrors.name && "border-destructive"
              )}
            />
            {formErrors.name && <p className="text-[10px] sm:text-xs text-destructive">{formErrors.name}</p>}
          </div>

          {/* Type & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Tipe <span className="text-destructive">*</span></Label>
              <Select value={formData.type} onValueChange={(v) => onInputChange('type', v)}>
                <SelectTrigger className={cn("bg-secondary/50 h-9 sm:h-10 text-xs sm:text-sm", formErrors.type && "border-destructive")}>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {Object.entries(typeConfig).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="text-xs sm:text-sm">
                      <div className="flex items-center gap-1.5 sm:gap-2">
                        <config.icon className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4", config.color)} />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.type && <p className="text-[10px] sm:text-xs text-destructive">{formErrors.type}</p>}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label className="text-xs sm:text-sm">Lokasi <span className="text-destructive">*</span></Label>
              <Select value={formData.location} onValueChange={(v) => onInputChange('location', v)}>
                <SelectTrigger className={cn("bg-secondary/50 h-9 sm:h-10 text-xs sm:text-sm", formErrors.location && "border-destructive")}>
                  <SelectValue placeholder="Pilih lokasi" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {locationOptions.map((loc) => (
                    <SelectItem key={loc} value={loc} className="text-xs sm:text-sm">{loc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.location && <p className="text-[10px] sm:text-xs text-destructive">{formErrors.location}</p>}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="add-email" className="text-xs sm:text-sm">Email <span className="text-destructive">*</span></Label>
              <Input
                id="add-email"
                type="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={(e) => onInputChange('email', e.target.value)}
                className={cn("bg-secondary/50 h-9 sm:h-10 text-xs sm:text-sm", formErrors.email && "border-destructive")}
              />
              {formErrors.email && <p className="text-[10px] sm:text-xs text-destructive">{formErrors.email}</p>}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="add-phone" className="text-xs sm:text-sm">Telepon <span className="text-destructive">*</span></Label>
              <Input
                id="add-phone"
                type="tel"
                placeholder="+62 xxx xxxx xxxx"
                value={formData.phone}
                onChange={(e) => onInputChange('phone', e.target.value)}
                className={cn("bg-secondary/50 h-9 sm:h-10 text-xs sm:text-sm", formErrors.phone && "border-destructive")}
              />
              {formErrors.phone && <p className="text-[10px] sm:text-xs text-destructive">{formErrors.phone}</p>}
            </div>
          </div>

          {/* Website */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="add-website" className="text-xs sm:text-sm">Website (Opsional)</Label>
            <Input
              id="add-website"
              type="url"
              placeholder="https://..."
              value={formData.website}
              onChange={(e) => onInputChange('website', e.target.value)}
              className="bg-secondary/50 h-9 sm:h-10 text-xs sm:text-sm"
            />
          </div>

          {/* Address */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="add-address" className="text-xs sm:text-sm">Alamat (Opsional)</Label>
            <Input
              id="add-address"
              placeholder="Alamat lengkap..."
              value={formData.address}
              onChange={(e) => onInputChange('address', e.target.value)}
              className="bg-secondary/50 h-9 sm:h-10 text-xs sm:text-sm"
            />
          </div>

          {/* Rating */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm">Rating Prioritas</Label>
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => onInputChange('rating', star)}
                  className="p-0.5 sm:p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={cn(
                      "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
                      star <= formData.rating
                        ? "text-primary fill-primary"
                        : "text-muted-foreground hover:text-primary/50"
                    )}
                  />
                </button>
              ))}
              <span className="ml-1.5 sm:ml-2 text-xs sm:text-sm text-muted-foreground">
                {formData.rating}/5
              </span>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="add-notes" className="text-xs sm:text-sm">Catatan (Opsional)</Label>
            <Textarea
              id="add-notes"
              placeholder="Catatan tentang kontak ini..."
              value={formData.notes}
              onChange={(e) => onInputChange('notes', e.target.value)}
              className="bg-secondary/50 min-h-[60px] sm:min-h-[80px] resize-none text-xs sm:text-sm"
            />
          </div>
        </div>

        <DialogFooter className="pt-3 sm:pt-4 border-t border-border gap-2 sm:gap-3 flex-col-reverse sm:flex-row">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isSubmitting}
            className="h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto"
          >
            Batal
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting} 
            className="gap-1.5 sm:gap-2 min-w-[110px] sm:min-w-[130px] shadow-glow h-9 sm:h-10 text-xs sm:text-sm w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Tambah Kontak
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
