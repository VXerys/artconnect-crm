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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Jadwal Laporan" : "Buat Jadwal Laporan Baru"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Jadwal</Label>
            <Input
              id="name"
              placeholder="Contoh: Laporan Penjualan Mingguan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipe Laporan</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inventory">Inventaris</SelectItem>
                  <SelectItem value="sales">Penjualan</SelectItem>
                  <SelectItem value="contacts">Kontak</SelectItem>
                  <SelectItem value="activity">Aktivitas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="frequency">Frekuensi</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData({ ...formData, frequency: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih frekuensi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Harian</SelectItem>
                  <SelectItem value="weekly">Mingguan</SelectItem>
                  <SelectItem value="monthly">Bulanan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Penerima (Email)</Label>
            <div className="flex gap-2">
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
              />
              <Button type="button" onClick={handleAddRecipient} variant="secondary">Tambah</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.recipients?.map((email) => (
                <div key={email} className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs flex items-center gap-1">
                  {email}
                  <button
                    type="button"
                    onClick={() => removeRecipient(email)}
                    className="hover:text-destructive"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {(!formData.recipients || formData.recipients.length === 0) && (
                <span className="text-xs text-muted-foreground italic">Belum ada penerima</span>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              {initialData ? "Simpan Perubahan" : "Buat Jadwal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
