import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { TrendingUp, Clock, Palette, Sparkles, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { PipelineData, PipelineStatus, PipelineColumn } from "./types";

interface PipelineSummaryProps {
  pipelineData: PipelineData;
}

export const PipelineSummary = ({ pipelineData }: PipelineSummaryProps) => {
  // Calculate statistics
  const totalItems = Object.values(pipelineData).reduce((acc, col) => acc + col.items.length, 0);
  const totalValue = Object.values(pipelineData)
    .flatMap(col => col.items)
    .reduce((acc, item) => {
      if (item.price) {
        const numericPrice = parseInt(item.price.replace(/\D/g, ''));
        return acc + numericPrice;
      }
      return acc;
    }, 0);

  // Get icon for each status
  const getStatusIcon = (status: PipelineStatus) => {
    switch (status) {
      case 'concept': return <Clock className="w-4 h-4" />;
      case 'wip': return <Palette className="w-4 h-4" />;
      case 'finished': return <Sparkles className="w-4 h-4" />;
      case 'sold': return <DollarSign className="w-4 h-4" />;
    }
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="font-display text-xl flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              Ringkasan Pipeline
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Overview performa dan status karya seni Anda
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Karya</p>
              <p className="text-2xl font-bold text-foreground">{totalItems}</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Nilai</p>
              <p className="text-2xl font-bold text-primary">
                {totalValue > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(totalValue)}` : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(Object.entries(pipelineData) as [PipelineStatus, PipelineColumn][]).map(([key, column]) => {
            const percentage = totalItems > 0 ? Math.round((column.items.length / totalItems) * 100) : 0;
            const columnValue = column.items.reduce((acc, item) => {
              if (item.price) {
                return acc + parseInt(item.price.replace(/\D/g, ''));
              }
              return acc;
            }, 0);

            return (
              <div 
                key={key} 
                className={cn(
                  "relative p-5 rounded-xl border-2 transition-all duration-300 group",
                  column.bgColor,
                  column.color.replace('border-', 'border-').replace('-500', '-500/50'),
                  // Hover animation - lift up effect
                  "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10"
                )}
              >
                {/* Icon */}
                <div className="flex items-center justify-between mb-3">
                  <div className={`p-2 rounded-lg ${column.textColor} bg-background/50 transition-transform duration-300 group-hover:scale-110`}>
                    {getStatusIcon(key)}
                  </div>
                </div>

                {/* Count with animation */}
                <div className={`text-3xl font-bold ${column.textColor} transition-transform duration-300 group-hover:scale-105`}>
                  {column.items.length}
                </div>

                {/* Title */}
                <div className="text-sm font-medium text-foreground/80 mt-1">
                  {column.title}
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/30">
                  <span className="text-xs text-muted-foreground">
                    {percentage}% dari total
                  </span>
                  {columnValue > 0 && (
                    <span className={`text-xs font-medium ${column.textColor}`}>
                      Rp {new Intl.NumberFormat('id-ID').format(columnValue / 1000000)}jt
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-background/30 rounded-b-xl overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-500",
                      column.textColor.replace('text-', 'bg-')
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>

                {/* Hover glow effect */}
                <div className={cn(
                  "absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                  "bg-gradient-to-t from-transparent via-transparent to-white/5"
                )} />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
