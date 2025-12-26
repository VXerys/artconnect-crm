import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { StatItem } from "./types";

interface StatsGridProps {
  stats: StatItem[];
}

export const StatsGrid = ({ stats }: StatsGridProps) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card 
          key={stat.id} 
          className={cn(
            "group relative overflow-hidden bg-card border-border",
            "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
            "transition-all duration-300"
          )}
          style={{ 
            animationDelay: `${index * 100}ms`,
          }}
        >
          {/* Gradient accent on hover */}
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
            "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
          )} />

          {/* Top gradient bar */}
          <div className={cn(
            "absolute top-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
            stat.color.replace('text-', 'bg-')
          )} />

          <CardContent className="p-5 relative z-10">
            <div className="flex items-start justify-between">
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                "transition-transform duration-300 group-hover:scale-110",
                stat.bgColor
              )}>
                <stat.icon className={cn("w-6 h-6", stat.color)} />
              </div>
              
              {/* Trend Badge */}
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold",
                stat.trend === 'up' 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : 'bg-rose-500/10 text-rose-400'
              )}>
                {stat.change}
                {stat.trend === 'up' 
                  ? <ArrowUpRight className="w-3 h-3" /> 
                  : <ArrowDownRight className="w-3 h-3" />
                }
              </div>
            </div>

            {/* Value & Title */}
            <div className="mt-4 space-y-1">
              <div className="text-3xl font-bold tracking-tight">
                {stat.value}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{stat.title}</span>
                {stat.description && (
                  <>
                    <span className="text-muted-foreground/50">•</span>
                    <span className="text-xs text-muted-foreground/70">{stat.description}</span>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
