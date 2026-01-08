import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { TrafficSource } from "./types";

interface TrafficSourcesCardProps {
  sources: TrafficSource[];
}

export const TrafficSourcesCard = ({ sources }: TrafficSourcesCardProps) => {
  const totalVisitors = sources.reduce((sum, s) => sum + s.visitors, 0);

  return (
    <Card className="bg-card border-border overflow-hidden h-full w-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-4 border-b border-border px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-emerald-500/10">
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
          </div>
          <div>
            <CardTitle className="font-display text-sm sm:text-base md:text-lg">Komposisi Karya</CardTitle>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              Distribusi berdasarkan medium
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Sources List */}
      <CardContent className="p-3 sm:p-4 md:p-6 flex-1">
        {totalVisitors === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 text-center">
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-secondary/50 mb-3 sm:mb-4">
              <Globe className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Data komposisi belum tersedia
            </p>
            <p className="text-muted-foreground/60 text-[10px] sm:text-xs mt-0.5 sm:mt-1 max-w-[180px] sm:max-w-[200px]">
              Tambahkan medium pada karya Anda untuk melihat grafik
            </p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {sources.map((source) => (
              <div key={source.source} className="group">
                <div className="flex items-center justify-between mb-1 sm:mb-2">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <div 
                      className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
                      style={{ backgroundColor: source.color }} 
                    />
                    <span className="text-xs sm:text-sm font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2">
                    <span className="font-bold text-xs sm:text-sm">{source.visitors.toLocaleString()}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground">({source.percentage}%)</span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-1.5 sm:h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${source.percentage}%`,
                      backgroundColor: source.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
