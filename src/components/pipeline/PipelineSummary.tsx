import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // Get icon for each status with responsive sizing
  const getStatusIcon = (status: PipelineStatus) => {
    const iconClass = "w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4";
    switch (status) {
      case 'concept': return <Clock className={iconClass} />;
      case 'wip': return <Palette className={iconClass} />;
      case 'finished': return <Sparkles className={iconClass} />;
      case 'sold': return <DollarSign className={iconClass} />;
    }
  };

  return (
    <Card className="bg-card/40 backdrop-blur-xl border-white/10 shadow-2xl overflow-hidden w-full max-w-full">
      {/* Header */}
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 border-b border-white/5">
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="font-display text-sm sm:text-base md:text-lg lg:text-xl flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-primary flex-shrink-0" />
              <span className="truncate">Ringkasan Pipeline</span>
            </CardTitle>
            <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-0.5 sm:mt-1">
              Overview performa dan status karya seni Anda
            </p>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
            <div>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Total Karya</p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-foreground">{totalItems}</p>
            </div>
            <div className="w-px h-6 sm:h-8 md:h-10 bg-border" />
            <div>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground uppercase tracking-wide">Total Nilai</p>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-primary truncate max-w-[120px] sm:max-w-none">
                {totalValue > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(totalValue)}` : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
        {totalItems === 0 ? (
          /* Empty State - Compact for mobile */
          <div className="flex flex-col items-center justify-center py-4 sm:py-6 text-center">
            <div className="relative mb-2">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg animate-pulse" />
              <div className="relative p-2 sm:p-2.5 rounded-full bg-secondary/50 border-2 border-dashed border-border">
                <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-[11px] sm:text-xs font-semibold mb-0.5">Belum Ada Karya di Pipeline</h3>
            <p className="text-[9px] sm:text-[10px] text-muted-foreground max-w-[160px] sm:max-w-[180px] leading-tight">
              Tambahkan karya seni untuk melihat ringkasan
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
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
                    "relative p-2.5 sm:p-3.5 md:p-4 lg:p-5 rounded-lg sm:rounded-xl border-2 transition-all duration-300 group",
                    column.bgColor,
                    column.color.replace('border-', 'border-').replace('-500', '-500/50'),
                    // Hover animation - lift up effect
                    "hover:-translate-y-1 hover:shadow-lg hover:shadow-black/10"
                  )}
                >
                  {/* Icon */}
                  <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-3">
                    <div className={`p-1 sm:p-1.5 md:p-2 rounded-md sm:rounded-lg ${column.textColor} bg-background/50 transition-transform duration-300 group-hover:scale-110`}>
                      {getStatusIcon(key)}
                    </div>
                  </div>

                  {/* Count with animation */}
                  <div className={`text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold ${column.textColor} transition-transform duration-300 group-hover:scale-105`}>
                    {column.items.length}
                  </div>

                  {/* Title */}
                  <div className="text-[10px] sm:text-xs md:text-sm font-medium text-foreground/80 mt-0.5 sm:mt-1">
                    {column.title}
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between mt-1.5 sm:mt-2 md:mt-3 pt-1.5 sm:pt-2 md:pt-3 border-t border-border/30">
                    <span className="text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs text-muted-foreground">
                      {percentage}% dari total
                    </span>
                    {columnValue > 0 && (
                      <span className={`text-[8px] sm:text-[9px] md:text-[10px] lg:text-xs font-medium ${column.textColor}`}>
                        Rp {new Intl.NumberFormat('id-ID').format(columnValue / 1000000)}jt
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 bg-background/30 rounded-b-lg sm:rounded-b-xl overflow-hidden">
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
                    "absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none",
                    "bg-gradient-to-t from-transparent via-transparent to-white/5"
                  )} />
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
