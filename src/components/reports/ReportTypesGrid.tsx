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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {reportTypes.map((report, index) => (
        <Card 
          key={report.id} 
          className={cn(
            "group relative overflow-hidden bg-card border-border",
            "hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5",
            "transition-all duration-300"
          )}
        >
          {/* Hover gradient */}
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
          )} />

          {/* Side accent */}
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-1 transition-all duration-300",
            "group-hover:w-1.5",
            report.color.replace('text-', 'bg-')
          )} />

          <CardContent className="p-6 relative z-10">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={cn(
                "w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0",
                "transition-all duration-300 group-hover:scale-110",
                report.bgColor
              )}>
                <report.icon className={cn("w-7 h-7", report.color)} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {report.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {report.description}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>

                {/* Features */}
                <ul className="mt-3 grid grid-cols-2 gap-1">
                  {report.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Check className={cn("w-3 h-3 flex-shrink-0", report.color)} />
                      <span className="truncate">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4">
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="gap-2 shadow-glow"
                    onClick={() => onGenerateReport(report.id, "csv")}
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export CSV
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => onGenerateReport(report.id, "pdf")}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
