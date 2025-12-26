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
import { 
  Plus, 
  ImagePlus,
  X,
  Loader2,
  Palette
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ArtworkFormData, ArtworkFormErrors } from "./types";
import { mediumOptions, statusConfig, formatPriceInput } from "./constants";

interface AddArtworkDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: ArtworkFormData;
  formErrors: ArtworkFormErrors;
  isSubmitting: boolean;
  imagePreview: string | null;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onInputChange: (field: keyof ArtworkFormData, value: string) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onImageUrlChange: (url: string) => void;
  onRemoveImagePreview: () => void;
  onSubmit: () => void;
}

export const AddArtworkDialog = ({
  isOpen,
  onOpenChange,
  formData,
  formErrors,
  isSubmitting,
  imagePreview,
  fileInputRef,
  onInputChange,
  onImageUpload,
  onImageUrlChange,
  onRemoveImagePreview,
  onSubmit,
}: AddArtworkDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Palette className="w-6 h-6 text-primary" />
            Tambah Karya Baru
          </DialogTitle>
          <DialogDescription>
            Isi detail karya seni Anda. Field dengan tanda * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-6">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Gambar Karya</Label>
            <div className="flex flex-col gap-4">
              {/* Image Preview */}
              {imagePreview ? (
                <div className="relative group">
                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-secondary border border-border">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                      onError={() => onRemoveImagePreview()}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={onRemoveImagePreview}
                    className="absolute top-2 right-2 p-1.5 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-video w-full rounded-lg border-2 border-dashed border-border hover:border-primary/50 bg-secondary/30 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-300 hover:bg-secondary/50"
                >
                  <div className="p-4 rounded-full bg-primary/10">
                    <ImagePlus className="w-8 h-8 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium">Klik untuk upload gambar</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, atau WEBP (maks. 5MB)</p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onImageUpload}
                className="hidden"
              />

              {/* Or use URL */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">atau gunakan URL</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Input
                placeholder="Masukkan URL gambar..."
                value={formData.image.startsWith('data:') ? '' : formData.image}
                onChange={(e) => onImageUrlChange(e.target.value)}
                className="bg-secondary/50 border-border focus:border-primary"
              />

              {formErrors.image && (
                <p className="text-xs text-destructive">{formErrors.image}</p>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Judul Karya <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Masukkan judul karya..."
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              className={cn(
                "bg-secondary/50 border-border focus:border-primary",
                formErrors.title && "border-destructive focus:border-destructive"
              )}
            />
            {formErrors.title && (
              <p className="text-xs text-destructive">{formErrors.title}</p>
            )}
          </div>

          {/* Medium & Dimensions Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Medium */}
            <div className="space-y-2">
              <Label htmlFor="medium" className="text-sm font-medium">
                Medium <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.medium}
                onValueChange={(value) => onInputChange('medium', value)}
              >
                <SelectTrigger 
                  className={cn(
                    "bg-secondary/50 border-border focus:border-primary",
                    formErrors.medium && "border-destructive"
                  )}
                >
                  <SelectValue placeholder="Pilih medium" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {mediumOptions.map((medium) => (
                    <SelectItem key={medium} value={medium}>
                      {medium}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {formErrors.medium && (
                <p className="text-xs text-destructive">{formErrors.medium}</p>
              )}
            </div>

            {/* Dimensions */}
            <div className="space-y-2">
              <Label htmlFor="dimensions" className="text-sm font-medium">
                Dimensi <span className="text-destructive">*</span>
              </Label>
              <Input
                id="dimensions"
                placeholder="contoh: 100 x 80 cm"
                value={formData.dimensions}
                onChange={(e) => onInputChange('dimensions', e.target.value)}
                className={cn(
                  "bg-secondary/50 border-border focus:border-primary",
                  formErrors.dimensions && "border-destructive focus:border-destructive"
                )}
              />
              {formErrors.dimensions && (
                <p className="text-xs text-destructive">{formErrors.dimensions}</p>
              )}
            </div>
          </div>

          {/* Status & Year Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status <span className="text-destructive">*</span>
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) => onInputChange('status', value as "concept" | "wip" | "finished" | "sold")}
              >
                <SelectTrigger className="bg-secondary/50 border-border focus:border-primary">
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {Object.entries(statusConfig).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          key === 'concept' ? 'bg-purple-400' :
                          key === 'wip' ? 'bg-blue-400' :
                          key === 'finished' ? 'bg-emerald-400' :
                          'bg-primary'
                        }`} />
                        {value.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Year */}
            <div className="space-y-2">
              <Label htmlFor="year" className="text-sm font-medium">
                Tahun Pembuatan <span className="text-destructive">*</span>
              </Label>
              <Input
                id="year"
                type="number"
                min="1900"
                max={new Date().getFullYear()}
                placeholder={new Date().getFullYear().toString()}
                value={formData.year}
                onChange={(e) => onInputChange('year', e.target.value)}
                className={cn(
                  "bg-secondary/50 border-border focus:border-primary",
                  formErrors.year && "border-destructive focus:border-destructive"
                )}
              />
              {formErrors.year && (
                <p className="text-xs text-destructive">{formErrors.year}</p>
              )}
            </div>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm font-medium">
              Harga (IDR)
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                Rp
              </span>
              <Input
                id="price"
                placeholder="0"
                value={formData.price}
                onChange={(e) => onInputChange('price', formatPriceInput(e.target.value))}
                className={cn(
                  "bg-secondary/50 border-border focus:border-primary pl-10",
                  formErrors.price && "border-destructive focus:border-destructive"
                )}
              />
            </div>
            {formErrors.price && (
              <p className="text-xs text-destructive">{formErrors.price}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Kosongkan jika karya belum memiliki harga
            </p>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Deskripsi
            </Label>
            <Textarea
              id="description"
              placeholder="Ceritakan tentang karya ini..."
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              className="bg-secondary/50 border-border focus:border-primary min-h-[100px] resize-none"
            />
          </div>
        </div>

        <DialogFooter className="pt-4 border-t border-border gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="border-border hover:bg-secondary"
          >
            Batal
          </Button>
          <Button
            type="submit"
            onClick={onSubmit}
            disabled={isSubmitting}
            className="gap-2 min-w-[140px] shadow-glow hover:shadow-lg transition-all duration-300"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                Simpan Karya
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
