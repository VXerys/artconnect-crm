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
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Globe className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Sumber Traffic</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {totalVisitors.toLocaleString()} total pengunjung
            </p>
          </div>
        </div>
      </CardHeader>

      {/* Sources List */}
      <CardContent className="p-6 flex-1">
        {totalVisitors === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="p-3 rounded-xl bg-secondary/50 mb-4">
              <Globe className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground text-sm">
              Data traffic belum tersedia
            </p>
            <p className="text-muted-foreground/60 text-xs mt-1 max-w-[200px]">
              Integrasikan dengan website Anda untuk melihat sumber pengunjung
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sources.map((source) => (
              <div key={source.source} className="group">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: source.color }} 
                    />
                    <span className="text-sm font-medium">{source.source}</span>
                    <ExternalLink className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{source.visitors.toLocaleString()}</span>
                    <span className="text-xs text-muted-foreground">({source.percentage}%)</span>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
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
