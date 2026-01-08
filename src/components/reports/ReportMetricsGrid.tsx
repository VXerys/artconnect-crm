import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportMetric } from "./types";

interface ReportMetricsGridProps {
  metrics: ReportMetric[];
}

export const ReportMetricsGrid = ({ metrics }: ReportMetricsGridProps) => {
  // Filter out any undefined items
  const validMetrics = metrics?.filter(m => m && m.icon) || [];
  
  if (validMetrics.length === 0) {
    return null;
  }
  
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
      {validMetrics.map((metric, index) => (
        <Card 
          key={metric.id} 
          className={cn(
            "group relative overflow-hidden bg-card border-border",
            "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
            "transition-all duration-300"
          )}
        >
          {/* Gradient accent on hover */}
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
          )} />

          {/* Top accent bar */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-0.5",
            metric.color.replace('text-', 'bg-')
          )} />

          <CardContent className="p-3 sm:p-4 md:p-5 relative z-10">
            <div className="flex items-start justify-between gap-2">
              {/* Icon */}
              <div className={cn(
                "w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg sm:rounded-xl flex items-center justify-center",
                "transition-transform duration-300 group-hover:scale-110",
                metric.bgColor
              )}>
                <metric.icon className={cn("w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6", metric.color)} />
              </div>
              
              {/* Trend Badge */}
              <div className={cn(
                "flex items-center gap-0.5 sm:gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-[9px] sm:text-[10px] md:text-xs font-semibold",
                metric.trend === 'up' 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : metric.trend === 'down'
                    ? 'bg-rose-500/10 text-rose-400'
                    : 'bg-secondary text-muted-foreground'
              )}>
                {metric.change}
                {metric.trend === 'up' 
                  ? <ArrowUpRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" /> 
                  : metric.trend === 'down'
                    ? <ArrowDownRight className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3" />
                    : null
                }
              </div>
            </div>

            {/* Value & Label */}
            <div className="mt-2 sm:mt-3 md:mt-4 space-y-0.5 sm:space-y-1">
              <div className={cn("text-xl sm:text-2xl md:text-3xl font-bold tracking-tight", metric.color)}>
                {metric.value}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground leading-tight">{metric.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
