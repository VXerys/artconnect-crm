import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Settings2, 
  Download, 
  Calendar,
  FileSpreadsheet,
  FileText,
  Image,
  BarChart3,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomReportBuilderProps {
  onGenerate: (formData: CustomReportFormData) => void;
  onSchedule: () => void;
  isGenerating?: boolean;
}

export interface CustomReportFormData {
  reportType: string;
  startDate: string;
  endDate: string;
  format: "csv" | "pdf" | "xlsx";
  includeCharts: boolean;
  includeImages: boolean;
}

const reportTypeOptions = [
  { value: "inventory", label: "Inventaris Karya" },
  { value: "sales", label: "Penjualan" },
  { value: "contacts", label: "Kontak" },
  { value: "activity", label: "Aktivitas" },
  { value: "combined", label: "Laporan Lengkap" },
];

const formatOptions = [
  { value: "csv", label: "CSV", icon: FileSpreadsheet, color: "text-green-400" },
  { value: "pdf", label: "PDF", icon: FileText, color: "text-red-400" },
  { value: "xlsx", label: "Excel", icon: FileSpreadsheet, color: "text-emerald-400" },
];

export const CustomReportBuilder = ({ 
  onGenerate, 
  onSchedule,
  isGenerating = false,
}: CustomReportBuilderProps) => {
  const [formData, setFormData] = useState<CustomReportFormData>({
    reportType: "inventory",
    startDate: "",
    endDate: "",
    format: "pdf",
    includeCharts: true,
    includeImages: false,
  });

  const handleSubmit = () => {
    onGenerate(formData);
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Settings2 className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Laporan Kustom</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Buat laporan sesuai kebutuhan Anda
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Report Type */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Tipe Laporan</Label>
            <select 
              className={cn(
                "w-full h-10 px-3 bg-secondary/50 border border-border rounded-lg",
                "text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
                "transition-all duration-200"
              )}
              value={formData.reportType}
              onChange={(e) => setFormData({ ...formData, reportType: e.target.value })}
            >
              {reportTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="space-y-2 md:col-span-2 lg:col-span-2">
            <Label className="text-sm font-medium">Periode</Label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input 
                  type="date" 
                  className="bg-secondary/50 border-border focus:ring-primary/50 focus:border-primary pl-3"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <span className="text-muted-foreground">—</span>
              <div className="relative flex-1">
                <Input 
                  type="date" 
                  className="bg-secondary/50 border-border focus:ring-primary/50 focus:border-primary"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Format */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Format</Label>
            <div className="flex gap-2">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, format: option.value as "csv" | "pdf" | "xlsx" })}
                  className={cn(
                    "flex-1 h-10 px-3 rounded-lg border text-sm font-medium",
                    "transition-all duration-200 flex items-center justify-center gap-1.5",
                    formData.format === option.value
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/50"
                  )}
                >
                  <option.icon className="w-4 h-4" />
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="mt-5 pt-5 border-t border-border">
          <Label className="text-sm font-medium mb-3 block">Opsi Tambahan</Label>
          <div className="flex flex-wrap gap-3">
            <label className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all",
              formData.includeCharts
                ? "bg-primary/10 border-primary text-primary"
                : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/50"
            )}>
              <input
                type="checkbox"
                checked={formData.includeCharts}
                onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
                className="sr-only"
              />
              <BarChart3 className="w-4 h-4" />
              <span className="text-sm font-medium">Sertakan Grafik</span>
            </label>

            <label className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all",
              formData.includeImages
                ? "bg-primary/10 border-primary text-primary"
                : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/50"
            )}>
              <input
                type="checkbox"
                checked={formData.includeImages}
                onChange={(e) => setFormData({ ...formData, includeImages: e.target.checked })}
                className="sr-only"
              />
              <Image className="w-4 h-4" />
              <span className="text-sm font-medium">Sertakan Gambar</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6 pt-5 border-t border-border">
          <Button 
            onClick={handleSubmit} 
            disabled={isGenerating}
            className="gap-2 shadow-glow"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate Laporan
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onSchedule} className="gap-2">
            <Calendar className="w-4 h-4" />
            Jadwalkan Report
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
