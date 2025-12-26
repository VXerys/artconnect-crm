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
import { Edit, Loader2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Artwork, ArtworkFormData, ArtworkFormErrors, ArtworkStatus } from "./types";
import { mediumOptions, statusConfig } from "./constants";

interface EditArtworkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ArtworkFormData;
  formErrors: ArtworkFormErrors;
  isSubmitting: boolean;
  onInputChange: (field: keyof ArtworkFormData, value: string | number) => void;
  onSubmit: () => void;
}

export const EditArtworkDialog = ({
  isOpen,
  onOpenChange,
  formData,
  formErrors,
  isSubmitting,
  onInputChange,
  onSubmit,
}: EditArtworkDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Edit className="w-6 h-6 text-primary" />
            Edit Karya Seni
          </DialogTitle>
          <DialogDescription>
            Perbarui informasi karya seni Anda. Field dengan * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Judul <span className="text-destructive">*</span></Label>
            <Input
              id="edit-title"
              placeholder="Masukkan judul karya..."
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              className={cn("bg-secondary/50", formErrors.title && "border-destructive")}
            />
            {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
          </div>

          {/* Medium & Year */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Medium <span className="text-destructive">*</span></Label>
              <Select value={formData.medium} onValueChange={(v) => onInputChange('medium', v)}>
                <SelectTrigger className={cn("bg-secondary/50", formErrors.medium && "border-destructive")}>
                  <SelectValue placeholder="Pilih medium" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mediumOptions.map((medium) => (
                    <SelectItem key={medium} value={medium}>{medium}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.medium && <p className="text-xs text-destructive">{formErrors.medium}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-year">Tahun <span className="text-destructive">*</span></Label>
              <Input
                id="edit-year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                value={formData.year}
                onChange={(e) => onInputChange('year', parseInt(e.target.value) || 0)}
                className={cn("bg-secondary/50", formErrors.year && "border-destructive")}
              />
              {formErrors.year && <p className="text-xs text-destructive">{formErrors.year}</p>}
            </div>
          </div>

          {/* Dimensions */}
          <div className="space-y-2">
            <Label htmlFor="edit-dimensions">Dimensi <span className="text-destructive">*</span></Label>
            <Input
              id="edit-dimensions"
              placeholder="Contoh: 100 x 80 cm"
              value={formData.dimensions}
              onChange={(e) => onInputChange('dimensions', e.target.value)}
              className={cn("bg-secondary/50", formErrors.dimensions && "border-destructive")}
            />
            {formErrors.dimensions && <p className="text-xs text-destructive">{formErrors.dimensions}</p>}
          </div>

          {/* Status & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status <span className="text-destructive">*</span></Label>
              <Select value={formData.status} onValueChange={(v) => onInputChange('status', v)}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {Object.entries(statusConfig).map(([key, value]) => (
                    <SelectItem key={key} value={key}>{value.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Harga (IDR)</Label>
              <Input
                id="edit-price"
                type="number"
                min="0"
                placeholder="Contoh: 15000000"
                value={formData.price || ''}
                onChange={(e) => onInputChange('price', parseInt(e.target.value) || 0)}
                className="bg-secondary/50"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Deskripsi</Label>
            <Textarea
              id="edit-description"
              placeholder="Ceritakan tentang karya ini..."
              value={formData.description || ''}
              onChange={(e) => onInputChange('description', e.target.value)}
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
                <Save className="w-4 h-4" />
                Simpan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
