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
import { Plus, Palette, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PipelineFormData, PipelineFormErrors, PipelineStatus } from "./types";
import { mediumOptions } from "./constants";

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PipelineFormData;
  formErrors: PipelineFormErrors;
  isSubmitting: boolean;
  onInputChange: (field: keyof PipelineFormData, value: string) => void;
  onSubmit: () => void;
  formatPriceInput: (value: string) => string;
}

export const AddItemDialog = ({
  isOpen,
  onOpenChange,
  formData,
  formErrors,
  isSubmitting,
  onInputChange,
  onSubmit,
  formatPriceInput,
}: AddItemDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="pb-3 sm:pb-4 border-b border-border">
          <DialogTitle className="font-display text-lg sm:text-xl md:text-2xl flex items-center gap-1.5 sm:gap-2">
            <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            Tambah Karya ke Pipeline
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Tambahkan karya baru ke dalam pipeline. Field dengan * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:gap-5 py-4 sm:py-5">
          {/* Title */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="add-title" className="text-xs sm:text-sm">
              Judul Karya <span className="text-destructive">*</span>
            </Label>
            <Input
              id="add-title"
              placeholder="Masukkan judul karya..."
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              className={cn(
                "bg-secondary/50 text-sm",
                formErrors.title && "border-destructive"
              )}
            />
            {formErrors.title && <p className="text-[10px] sm:text-xs text-destructive">{formErrors.title}</p>}
          </div>

          {/* Medium & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="add-medium" className="text-xs sm:text-sm">
                Medium <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.medium} onValueChange={(v) => onInputChange('medium', v)}>
                <SelectTrigger className={cn("bg-secondary/50 text-sm", formErrors.medium && "border-destructive")}>
                  <SelectValue placeholder="Pilih medium" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mediumOptions.map(m => <SelectItem key={m} value={m} className="text-sm">{m}</SelectItem>)}
                </SelectContent>
              </Select>
              {formErrors.medium && <p className="text-[10px] sm:text-xs text-destructive">{formErrors.medium}</p>}
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="add-dueDate" className="text-xs sm:text-sm">
                Target Tanggal <span className="text-destructive">*</span>
              </Label>
              <Input
                id="add-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => onInputChange('dueDate', e.target.value)}
                className={cn("bg-secondary/50 text-sm", formErrors.dueDate && "border-destructive")}
              />
              {formErrors.dueDate && <p className="text-[10px] sm:text-xs text-destructive">{formErrors.dueDate}</p>}
            </div>
          </div>

          {/* Status & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="add-status" className="text-xs sm:text-sm">Status Awal</Label>
              <Select value={formData.status} onValueChange={(v) => onInputChange('status', v)}>
                <SelectTrigger className="bg-secondary/50 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="concept" className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Konsep
                    </div>
                  </SelectItem>
                  <SelectItem value="wip" className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Proses
                    </div>
                  </SelectItem>
                  <SelectItem value="finished" className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Selesai
                    </div>
                  </SelectItem>
                  <SelectItem value="sold" className="text-sm">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Terjual
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="add-price" className="text-xs sm:text-sm">Harga (Opsional)</Label>
              <Input
                id="add-price"
                placeholder="Rp 0"
                value={formData.price}
                onChange={(e) => onInputChange('price', formatPriceInput(e.target.value))}
                className="bg-secondary/50 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="add-desc" className="text-xs sm:text-sm">Deskripsi (Opsional)</Label>
            <Textarea
              id="add-desc"
              placeholder="Deskripsi singkat..."
              value={formData.description}
              onChange={(e) => onInputChange('description', e.target.value)}
              className="bg-secondary/50 min-h-[70px] sm:min-h-[80px] resize-none text-sm"
            />
          </div>
        </div>

        <DialogFooter className="pt-3 sm:pt-4 border-t border-border gap-2 sm:gap-3 flex-col sm:flex-row">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            disabled={isSubmitting}
            className="w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
          >
            Batal
          </Button>
          <Button 
            onClick={onSubmit} 
            disabled={isSubmitting} 
            className="gap-1.5 sm:gap-2 min-w-[100px] sm:min-w-[120px] shadow-glow w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Tambah
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
