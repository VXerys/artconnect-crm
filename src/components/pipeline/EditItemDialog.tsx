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
import { Edit, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { PipelineFormData, PipelineFormErrors } from "./types";
import { mediumOptions } from "./constants";

interface EditItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  formData: PipelineFormData;
  formErrors: PipelineFormErrors;
  isSubmitting: boolean;
  onInputChange: (field: keyof PipelineFormData, value: string) => void;
  onSubmit: () => void;
  formatPriceInput: (value: string) => string;
}

export const EditItemDialog = ({
  isOpen,
  onOpenChange,
  formData,
  formErrors,
  isSubmitting,
  onInputChange,
  onSubmit,
  formatPriceInput,
}: EditItemDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-card border-border">
        <DialogHeader className="pb-4 border-b border-border">
          <DialogTitle className="font-display text-2xl flex items-center gap-2">
            <Edit className="w-6 h-6 text-primary" />
            Edit Karya
          </DialogTitle>
          <DialogDescription>
            Perbarui detail karya. Field dengan * wajib diisi.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 py-5">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Judul Karya <span className="text-destructive">*</span></Label>
            <Input
              id="edit-title"
              placeholder="Masukkan judul karya..."
              value={formData.title}
              onChange={(e) => onInputChange('title', e.target.value)}
              className={cn("bg-secondary/50", formErrors.title && "border-destructive")}
            />
            {formErrors.title && <p className="text-xs text-destructive">{formErrors.title}</p>}
          </div>

          {/* Medium & Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-medium">Medium <span className="text-destructive">*</span></Label>
              <Select value={formData.medium} onValueChange={(v) => onInputChange('medium', v)}>
                <SelectTrigger className={cn("bg-secondary/50", formErrors.medium && "border-destructive")}>
                  <SelectValue placeholder="Pilih medium" />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  {mediumOptions.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
                </SelectContent>
              </Select>
              {formErrors.medium && <p className="text-xs text-destructive">{formErrors.medium}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-dueDate">Target Tanggal <span className="text-destructive">*</span></Label>
              <Input
                id="edit-dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => onInputChange('dueDate', e.target.value)}
                className={cn("bg-secondary/50", formErrors.dueDate && "border-destructive")}
              />
              {formErrors.dueDate && <p className="text-xs text-destructive">{formErrors.dueDate}</p>}
            </div>
          </div>

          {/* Status & Price */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(v) => onInputChange('status', v)}>
                <SelectTrigger className="bg-secondary/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover">
                  <SelectItem value="concept">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Konsep
                    </div>
                  </SelectItem>
                  <SelectItem value="wip">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      Proses
                    </div>
                  </SelectItem>
                  <SelectItem value="finished">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      Selesai
                    </div>
                  </SelectItem>
                  <SelectItem value="sold">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      Terjual
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-price">Harga (Opsional)</Label>
              <Input
                id="edit-price"
                placeholder="Rp 0"
                value={formData.price}
                onChange={(e) => onInputChange('price', formatPriceInput(e.target.value))}
                className="bg-secondary/50"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-desc">Deskripsi (Opsional)</Label>
            <Textarea
              id="edit-desc"
              placeholder="Deskripsi singkat..."
              value={formData.description}
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
