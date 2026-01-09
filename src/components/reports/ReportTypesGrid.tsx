import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportType } from "./types";

interface ReportTypesGridProps {
  reportTypes: ReportType[];
  onGenerateReport: (reportId: string, format: "csv" | "pdf") => void;
}

export const ReportTypesGrid = ({ reportTypes, onGenerateReport }: ReportTypesGridProps) => {
  // Filter out any undefined items
  const validReports = reportTypes?.filter(r => r && r.icon) || [];
  
  if (validReports.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>Tidak ada tipe laporan tersedia</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
      {validReports.map((report, index) => (
        <Card 
          key={report.id} 
          className={cn(
            "group relative overflow-hidden bg-card/50 backdrop-blur-sm border-border/50",
            "hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/5",
            "transition-all duration-500 ease-out"
          )}
        >
          {/* Enhanced Hover gradient */}
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            "bg-gradient-to-br from-primary/10 via-transparent to-transparent"
          )} />

          {/* Side accent with glow */}
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 transition-all duration-300",
            "group-hover:w-1 sm:group-hover:w-1.5 group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]",
            report.color.replace('text-', 'bg-')
          )} />

          <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6 relative z-10 flex flex-col h-full">
            <div className="flex items-start gap-2 sm:gap-3 md:gap-4 lg:gap-5">
              {/* Animated Icon Container */}
              <div className={cn(
                "w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg sm:rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0",
                "transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                "bg-gradient-to-br from-background to-secondary shadow-inner border border-white/5",
                report.bgColor
              )}>
                <report.icon className={cn("w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 transition-colors duration-300", report.color)} />
              </div>

              {/* Header Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-sm sm:text-base md:text-lg tracking-tight group-hover:text-primary transition-colors leading-tight">
                  {report.title}
                </h3>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-0.5 sm:mt-1 md:mt-1.5 leading-relaxed line-clamp-2">
                  {report.description}
                </p>
              </div>
            </div>

            <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-6 flex-1">
              {/* Features as Chips */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                {report.features.slice(0, 3).map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1 sm:gap-1.5 px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-2.5 md:py-1 rounded-md bg-secondary/50 border border-border/50 text-[9px] sm:text-[10px] md:text-xs text-muted-foreground"
                  >
                    <Check className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3", report.color)} />
                    <span className="truncate">{feature}</span>
                  </span>
                ))}
                {report.features.length > 3 && (
                  <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground px-1 py-0.5 sm:py-1 self-center">
                    +{report.features.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2 sm:gap-2.5 md:gap-3 mt-auto pt-3 sm:pt-4 border-t border-border/50">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-1 sm:gap-1.5 md:gap-2 h-8 sm:h-9 md:h-10 text-[10px] sm:text-xs md:text-sm border-primary/20 hover:border-primary/50 hover:bg-primary/5 group/btn px-2 sm:px-3"
                onClick={() => onGenerateReport(report.id, "csv")}
              >
                <Download className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover/btn:translate-y-0.5 transition-transform" />
                <span className="font-medium">CSV</span>
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full gap-1 sm:gap-1.5 md:gap-2 h-8 sm:h-9 md:h-10 text-[10px] sm:text-xs md:text-sm shadow-lg shadow-primary/20 hover:shadow-primary/30 group/btn px-2 sm:px-3"
                onClick={() => onGenerateReport(report.id, "pdf")}
              >
                <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                <span className="font-medium">PDF</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
