import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Clock, 
  ArrowRight,
  CheckCircle,
  Loader2,
  AlertCircle,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RecentReport } from "./types";
import { reportTypeConfig, formatConfig } from "./constants";

interface RecentReportsListProps {
  reports: RecentReport[];
  onDownload: (reportId: number) => void;
  onDelete?: (reportId: number) => void;
  maxHeight?: string; // Optional max height for scroll area
}

export const RecentReportsList = ({ 
  reports, 
  onDownload,
  onDelete,
  maxHeight = "380px",
}: RecentReportsListProps) => {
  const getStatusIcon = (status: RecentReport["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case "processing":
        return <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-rose-400" />;
    }
  };

  return (
    <Card className="bg-card border-border overflow-hidden w-full h-fit">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Laporan Terbaru</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {reports.length} laporan terakhir
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-amber-400 hover:text-amber-400">
          Lihat Semua
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardHeader>

      {/* Reports List - Scrollable */}
      <CardContent className="p-0 overflow-hidden relative">
        {reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-secondary/5">
             {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent opacity-50" />
            
            <div className="relative z-10 bg-card border border-border/50 p-4 rounded-full mb-4 shadow-xl shadow-amber-500/10">
              <Clock className="w-8 h-8 text-amber-400/80" />
            </div>
            
            <h3 className="relative z-10 font-display font-medium text-lg mb-2">
              Belum Ada Laporan
            </h3>
            <p className="relative z-10 text-muted-foreground text-sm max-w-[250px] leading-relaxed">
              Generate laporan baru atau jadwalkan pengiriman otomatis untuk melihat riwayat di sini.
            </p>
          </div>
        ) : (
          <div 
            className="divide-y divide-border/50 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
            style={{ maxHeight }}
          >
            {reports.map((report, index) => {
              const typeConfig = reportTypeConfig[report.type];
              const format = formatConfig[report.format];
              
              // Skip if config is missing
              if (!typeConfig || !typeConfig.icon || !format) {
                return null;
              }
              
              const TypeIcon = typeConfig.icon;

              return (
                <div 
                  key={report.id}
                  className={cn(
                    "group flex items-center gap-4 px-6 py-4",
                    "hover:bg-secondary/40 transition-all duration-300"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Icon */}
                  <div className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    "transition-all duration-300 group-hover:scale-110 shadow-sm",
                    typeConfig.bgColor,
                    "border border-white/5"
                  )}>
                    <TypeIcon className={cn("w-5 h-5 sm:w-6 sm:h-6", typeConfig.color)} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h4 className="font-medium truncate text-sm sm:text-base group-hover:text-primary transition-colors">
                        {report.name}
                      </h4>
                      {getStatusIcon(report.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className={cn(
                        "px-1.5 py-0.5 rounded text-[10px] font-semibold border uppercase tracking-wider",
                        format.bgColor,
                        format.color,
                        "border-current/20"
                      )}>
                        {format.label}
                      </span>
                      <span className="text-muted-foreground">{report.date}</span>
                      <span className="text-muted-foreground/30">•</span>
                      <span className="text-muted-foreground">{report.size}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 hover:bg-primary/10 hover:text-primary rounded-lg"
                      onClick={() => onDownload(report.id)}
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">Unduh</span>
                    </Button>
                    {onDelete && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0 hover:bg-destructive/10 hover:text-destructive rounded-lg delay-75"
                        onClick={() => onDelete(report.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
