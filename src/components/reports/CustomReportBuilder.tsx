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
  Check,
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
    <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
      <CardHeader className="pb-4 sm:pb-5 md:pb-6 border-b border-border/50 px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          <div className="p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 shadow-inner">
            <Settings2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="font-display text-base sm:text-lg md:text-xl tracking-tight">Generate Laporan Kustom</CardTitle>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-0.5 sm:mt-1 line-clamp-1 sm:line-clamp-none">
              Sesuaikan parameter laporan sesuai kebutuhan spesifik Anda
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6 space-y-4 sm:space-y-5 md:space-y-6 lg:space-y-8">
        {/* Report Type Selection */}
        <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
          <Label className="text-xs sm:text-sm font-medium text-foreground/80">Tipe Laporan</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-2.5 md:gap-3">
            {reportTypeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFormData({ ...formData, reportType: option.value })}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 sm:gap-1.5 md:gap-2 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border text-center transition-all duration-300",
                  "hover:border-primary/50 hover:bg-primary/5",
                  formData.reportType === option.value
                    ? "bg-primary/10 border-primary text-primary shadow-[0_0_15px_rgba(0,0,0,0.1)]"
                    : "bg-secondary/30 border-border text-muted-foreground"
                )}
              >
                <div className={cn(
                  "w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full",
                  formData.reportType === option.value ? "bg-primary" : "bg-transparent"
                )} />
                <span className="text-[10px] sm:text-xs md:text-sm font-medium leading-tight">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
          {/* Format Selection */}
          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <Label className="text-xs sm:text-sm font-medium text-foreground/80">Format File</Label>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5 md:gap-3">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFormData({ ...formData, format: option.value as "csv" | "pdf" | "xlsx" })}
                  className={cn(
                    "relative flex flex-col items-center gap-1 sm:gap-1.5 md:gap-2 p-2 sm:p-2.5 md:p-3 rounded-lg sm:rounded-xl border transition-all duration-300 overflow-hidden group",
                    formData.format === option.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "bg-secondary/30 border-border text-muted-foreground hover:border-primary/30"
                  )}
                >
                  <option.icon className={cn(
                    "w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 transition-colors",
                    formData.format === option.value ? option.color : "text-muted-foreground"
                  )} />
                  <span className="text-[10px] sm:text-xs md:text-sm font-medium">{option.label}</span>
                  {formData.format === option.value && (
                    <div className="absolute inset-0 bg-primary/5 animate-pulse" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <Label className="text-xs sm:text-sm font-medium text-foreground/80">Periode Waktu</Label>
            <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-2.5 md:gap-3 p-1 sm:p-1.5 bg-secondary/30 rounded-lg sm:rounded-xl border border-border">
              <div className="relative flex-1 group min-w-0">
                <Calendar className="absolute left-2 sm:left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  type="date" 
                  className="bg-transparent border-none shadow-none focus-visible:ring-0 pl-7 sm:pl-8 md:pl-9 text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div className="hidden xs:block w-px h-5 sm:h-6 bg-border self-center" />
              <div className="relative flex-1 group min-w-0">
                <Calendar className="absolute left-2 sm:left-2.5 md:left-3 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  type="date" 
                  className="bg-transparent border-none shadow-none focus-visible:ring-0 pl-7 sm:pl-8 md:pl-9 text-xs sm:text-sm h-8 sm:h-9 md:h-10"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-2 sm:space-y-2.5 md:space-y-3 pt-3 sm:pt-4 md:pt-5 lg:pt-6 border-t border-border/50">
          <Label className="text-xs sm:text-sm font-medium text-foreground/80">Kelengkapan Laporan</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 md:gap-4">
            <label className={cn(
              "flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl border cursor-pointer transition-all duration-300 select-none",
              formData.includeCharts
                ? "bg-primary/10 border-primary text-primary shadow-sm"
                : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50"
            )}>
              <div className={cn(
                "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                formData.includeCharts ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                <BarChart3 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-xs sm:text-sm md:text-base block leading-tight">Sertakan Grafik</span>
                <span className="text-[10px] sm:text-xs opacity-80 font-light mt-0.5 block">Visualisasi data analitik</span>
              </div>
              <input
                type="checkbox"
                checked={formData.includeCharts}
                onChange={(e) => setFormData({ ...formData, includeCharts: e.target.checked })}
                className="sr-only"
              />
              <div className={cn(
                "w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
                formData.includeCharts ? "border-primary bg-primary" : "border-muted-foreground/30"
              )}>
                {formData.includeCharts && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />}
              </div>
            </label>

            <label className={cn(
              "flex items-center gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-3.5 rounded-lg sm:rounded-xl border cursor-pointer transition-all duration-300 select-none",
              formData.includeImages
                ? "bg-primary/10 border-primary text-primary shadow-sm"
                : "bg-secondary/30 border-border text-muted-foreground hover:bg-secondary/50"
            )}>
              <div className={cn(
                "w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                formData.includeImages ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
              )}>
                <Image className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="font-medium text-xs sm:text-sm md:text-base block leading-tight">Sertakan Gambar</span>
                <span className="text-[10px] sm:text-xs opacity-80 font-light mt-0.5 block">Foto karya dalam laporan</span>
              </div>
              <input
                type="checkbox"
                checked={formData.includeImages}
                onChange={(e) => setFormData({ ...formData, includeImages: e.target.checked })}
                className="sr-only"
              />
              <div className={cn(
                "w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0",
                formData.includeImages ? "border-primary bg-primary" : "border-muted-foreground/30"
              )}>
                {formData.includeImages && <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary-foreground" />}
              </div>
            </label>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 sm:gap-3 md:gap-4 mt-4 sm:mt-5 md:mt-6 lg:mt-8 pt-3 sm:pt-4 md:pt-5 lg:pt-6 border-t border-border/50">
          <Button 
            className="flex-1 h-10 sm:h-11 md:h-12 text-xs sm:text-sm md:text-base font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300" 
            onClick={handleSubmit} 
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 animate-spin mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Sedang Memproses...</span>
                <span className="xs:hidden">Memproses...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 mr-1.5 sm:mr-2" />
                <span className="hidden xs:inline">Generate Laporan Sekarang</span>
                <span className="xs:hidden">Generate Laporan</span>
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            className="h-10 sm:h-11 md:h-12 px-4 sm:px-5 md:px-6 text-xs sm:text-sm md:text-base font-medium border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/50" 
            onClick={onSchedule}
          >
            <Calendar className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 mr-1.5 sm:mr-2" />
            <span className="hidden xs:inline">Jadwalkan</span>
            <span className="xs:hidden">Jadwal</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
