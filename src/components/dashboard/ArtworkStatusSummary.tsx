import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, Clock, CheckCircle, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtworkStatus {
  concept: number;
  wip: number;
  finished: number;
  sold: number;
}

interface ArtworkStatusSummaryProps {
  statusCounts: ArtworkStatus;
  totalArtworks: number;
}

export const ArtworkStatusSummary = ({ statusCounts, totalArtworks }: ArtworkStatusSummaryProps) => {
  const statuses = [
    { 
      key: "concept", 
      label: "Konsep", 
      count: statusCounts.concept, 
      icon: Palette,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      progressColor: "bg-purple-500",
    },
    { 
      key: "wip", 
      label: "Proses", 
      count: statusCounts.wip, 
      icon: Clock,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      progressColor: "bg-blue-500",
    },
    { 
      key: "finished", 
      label: "Selesai", 
      count: statusCounts.finished, 
      icon: CheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      progressColor: "bg-emerald-500",
    },
    { 
      key: "sold", 
      label: "Terjual", 
      count: statusCounts.sold, 
      icon: ShoppingBag,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      progressColor: "bg-amber-500",
    },
  ];

  return (
    <Card className="bg-card border-border overflow-hidden h-full">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle className="font-display text-lg">Status Karya</CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Ringkasan status semua karya
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <div className="space-y-4">
          {statuses.map((status, index) => {
            const percentage = totalArtworks > 0 
              ? Math.round((status.count / totalArtworks) * 100) 
              : 0;

            return (
              <div 
                key={status.key}
                className="group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Label & Count */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1.5 rounded-lg transition-transform group-hover:scale-110",
                      status.bgColor
                    )}>
                      <status.icon className={cn("w-4 h-4", status.color)} />
                    </div>
                    <span className="text-sm font-medium">{status.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={cn("font-bold", status.color)}>
                      {status.count}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({percentage}%)
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out",
                      status.progressColor
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                  {/* Glow effect */}
                  <div 
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full blur-sm",
                      status.progressColor,
                      "opacity-50"
                    )}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Total Karya</span>
          <span className="text-2xl font-bold text-primary">{totalArtworks}</span>
        </div>
      </CardContent>
    </Card>
  );
};
