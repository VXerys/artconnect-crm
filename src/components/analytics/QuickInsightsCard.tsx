import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { quickInsights } from "./constants";

export const QuickInsightsCard = () => {
  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Lightbulb className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Insight Cepat</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Rekomendasi berdasarkan data
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Insights Grid */}
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickInsights.map((insight, index) => (
            <div 
              key={insight.id}
              className={cn(
                "group relative p-4 rounded-xl",
                "bg-secondary/30 border border-border",
                "hover:border-primary/40 hover:bg-secondary/50",
                "transition-all duration-300 cursor-pointer"
              )}
            >
              {/* Gradient glow on hover */}
              <div className={cn(
                "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl",
                "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
              )} />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center mb-3",
                  "transition-transform duration-300 group-hover:scale-110",
                  insight.bgColor
                )}>
                  <insight.icon className={cn("w-5 h-5", insight.color)} />
                </div>

                {/* Text */}
                <h4 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                  {insight.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {insight.description}
                </p>

                {/* Arrow that appears on hover */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="w-4 h-4 text-primary" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
