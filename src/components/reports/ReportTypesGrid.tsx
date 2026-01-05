import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportType } from "./types";

interface ReportTypesGridProps {
  reportTypes: ReportType[];
  onGenerateReport: (reportId: string, format: "csv" | "pdf") => void;
}

export const ReportTypesGrid = ({ reportTypes, onGenerateReport }: ReportTypesGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reportTypes.map((report, index) => (
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
            "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
            "group-hover:w-1.5 group-hover:shadow-[0_0_10px_rgba(0,0,0,0.5)]",
            report.color.replace('text-', 'bg-')
          )} />

          <CardContent className="p-6 relative z-10 flex flex-col h-full">
            <div className="flex items-start gap-5">
              {/* Animated Icon Container */}
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                "transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                "bg-gradient-to-br from-background to-secondary shadow-inner border border-white/5",
                report.bgColor
              )}>
                <report.icon className={cn("w-7 h-7 transition-colors duration-300", report.color)} />
              </div>

              {/* Header Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display font-semibold text-lg tracking-tight group-hover:text-primary transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">
                      {report.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/50 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 flex-shrink-0" />
                </div>
              </div>
            </div>

            <div className="mt-6 flex-1">
              {/* Features as Chips */}
              <div className="flex flex-wrap gap-2 mb-6">
                {report.features.slice(0, 3).map((feature, idx) => (
                  <span 
                    key={idx} 
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-secondary/50 border border-border/50 text-xs text-muted-foreground"
                  >
                    <Check className={cn("w-3 h-3", report.color)} />
                    {feature}
                  </span>
                ))}
                {report.features.length > 3 && (
                  <span className="text-xs text-muted-foreground px-1 py-1 self-center">
                    +{report.features.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-border/50">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full gap-2 border-primary/20 hover:border-primary/50 hover:bg-primary/5 group/btn"
                onClick={() => onGenerateReport(report.id, "csv")}
              >
                <Download className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" />
                CSV
              </Button>
              <Button 
                variant="default" 
                size="sm" 
                className="w-full gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/30 group/btn"
                onClick={() => onGenerateReport(report.id, "pdf")}
              >
                <FileText className="w-3.5 h-3.5" />
                PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
