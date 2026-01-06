import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScheduledReport } from "./types";

interface ScheduledReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (report: Omit<ScheduledReport, "id">) => void;
  initialData?: ScheduledReport;
}

export const ScheduledReportDialog = ({
  open,
  onOpenChange,
  onSubmit,
  initialData
}: ScheduledReportDialogProps) => {
  const [formData, setFormData] = useState<Partial<ScheduledReport>>({
    name: "",
    type: "stats",
    frequency: "monthly",
    recipients: [],
    isActive: true,
    nextRun: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Default for new
      setFormData({
        name: "",
        type: "inventory",
        frequency: "weekly",
        recipients: [],
        isActive: true,
        nextRun: new Date(Date.now() + 86400000).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
      });
    }
  }, [initialData, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.frequency) return;

    onSubmit({
      name: formData.name,
      type: formData.type || "inventory",
      frequency: formData.frequency as "daily" | "weekly" | "monthly",
      recipients: formData.recipients || [],
      isActive: formData.isActive ?? true,
      nextRun: formData.nextRun || "Besok"
    });
    onOpenChange(false);
  };

  const [recipientInput, setRecipientInput] = useState("");

  const handleAddRecipient = () => {
    if (recipientInput && !formData.recipients?.includes(recipientInput)) {
      setFormData(prev => ({
        ...prev,
        recipients: [...(prev.recipients || []), recipientInput]
      }));
      setRecipientInput("");
    }
  };

  const removeRecipient = (email: string) => {
    setFormData(prev => ({
      ...prev,
      recipients: prev.recipients?.filter(r => r !== email)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">{initialData ? "Edit Jadwal Laporan" : "Buat Jadwal Laporan Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 py-3 sm:py-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="name" className="text-xs sm:text-sm">Nama Jadwal</Label>
            <Input
              id="name"
              placeholder="Contoh: Laporan Penjualan Mingguan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="text-xs sm:text-sm h-9 sm:h-10"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="type" className="text-xs sm:text-sm">Tipe Laporan</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory" className="text-xs sm:text-sm">Inventaris</SelectItem>
                  <SelectItem value="sales" className="text-xs sm:text-sm">Penjualan</SelectItem>
                  <SelectItem value="contacts" className="text-xs sm:text-sm">Kontak</SelectItem>
                  <SelectItem value="activity" className="text-xs sm:text-sm">Aktivitas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-1.5 sm:space-y-2">
              <Label htmlFor="frequency" className="text-xs sm:text-sm">Frekuensi</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value as any })}
              >
                <SelectTrigger className="text-xs sm:text-sm h-9 sm:h-10">
                  <SelectValue placeholder="Pilih frekuensi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily" className="text-xs sm:text-sm">Harian</SelectItem>
                  <SelectItem value="weekly" className="text-xs sm:text-sm">Mingguan</SelectItem>
                  <SelectItem value="monthly" className="text-xs sm:text-sm">Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label className="text-xs sm:text-sm">Penerima (Email)</Label>
            <div className="flex gap-1.5 sm:gap-2">
              <Input
                placeholder="email@example.com"
                value={recipientInput}
                onChange={(e) => setRecipientInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRecipient();
                  }
                }}
                className="text-xs sm:text-sm h-9 sm:h-10"
              />
              <Button type="button" onClick={handleAddRecipient} variant="secondary" size="sm" className="h-9 sm:h-10 px-2 sm:px-3 text-xs sm:text-sm">
                Tambah
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
              {formData.recipients?.map((email) => (
                <div key={email} className="bg-secondary text-secondary-foreground px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md text-[10px] sm:text-xs flex items-center gap-0.5 sm:gap-1">
                  <span className="truncate max-w-[120px]">{email}</span>
                  <button
                    type="button"
                    onClick={() => removeRecipient(email)}
                    className="hover:text-destructive flex-shrink-0"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {(!formData.recipients || formData.recipients.length === 0) && (
                <span className="text-[10px] sm:text-xs text-muted-foreground italic">Belum ada penerima</span>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-9 sm:h-10 text-xs sm:text-sm">
              Batal
            </Button>
            <Button type="submit" className="h-9 sm:h-10 text-xs sm:text-sm">
              {initialData ? "Simpan Perubahan" : "Buat Jadwal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
