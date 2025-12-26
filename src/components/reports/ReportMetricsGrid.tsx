import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReportMetric } from "./types";

interface ReportMetricsGridProps {
  metrics: ReportMetric[];
}

export const ReportMetricsGrid = ({ metrics }: ReportMetricsGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
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

          <CardContent className="p-5 relative z-10">
            <div className="flex items-start justify-between">
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                "transition-transform duration-300 group-hover:scale-110",
                metric.bgColor
              )}>
                <metric.icon className={cn("w-6 h-6", metric.color)} />
              </div>
              
              {/* Trend Badge */}
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                metric.trend === 'up' 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : metric.trend === 'down'
                    ? 'bg-rose-500/10 text-rose-400'
                    : 'bg-secondary text-muted-foreground'
              )}>
                {metric.change}
                {metric.trend === 'up' 
                  ? <ArrowUpRight className="w-3 h-3" /> 
                  : metric.trend === 'down'
                    ? <ArrowDownRight className="w-3 h-3" />
                    : null
                }
              </div>
            </div>

            {/* Value & Label */}
            <div className="mt-4 space-y-1">
              <div className={cn("text-3xl font-bold tracking-tight", metric.color)}>
                {metric.value}
              </div>
              <div className="text-sm text-muted-foreground">{metric.label}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
