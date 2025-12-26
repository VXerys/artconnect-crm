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
    <Card className="bg-card border-border overflow-hidden h-full flex flex-col w-full">
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
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div 
          className="divide-y divide-border overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent"
          style={{ maxHeight }}
        >
          {reports.map((report, index) => {
            const typeConfig = reportTypeConfig[report.type];
            const format = formatConfig[report.format];
            const TypeIcon = typeConfig.icon;

            return (
              <div 
                key={report.id}
                className={cn(
                  "group flex items-center gap-4 px-6 py-4",
                  "hover:bg-secondary/30 transition-all duration-200"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Icon */}
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                  "transition-transform duration-300 group-hover:scale-105",
                  typeConfig.bgColor
                )}>
                  <TypeIcon className={cn("w-6 h-6", typeConfig.color)} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                      {report.name}
                    </h4>
                    {getStatusIcon(report.status)}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-xs font-medium",
                      format.bgColor,
                      format.color
                    )}>
                      {format.label}
                    </span>
                    <span className="text-xs text-muted-foreground">{report.date}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="text-xs text-muted-foreground">{report.size}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary/10 hover:text-primary"
                    onClick={() => onDownload(report.id)}
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  {onDelete && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 hover:text-destructive"
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
      </CardContent>
    </Card>
  );
};
