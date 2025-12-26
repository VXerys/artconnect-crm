import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { ActivityItem } from "./types";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Aktivitas Terkini</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Pembaruan terbaru
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="gap-2 text-amber-400 hover:text-amber-400">
          Semua
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardHeader>

      {/* Activity Timeline */}
      <CardContent className="p-0">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border" />

          {activities.map((activity, index) => (
            <div 
              key={activity.id}
              className={cn(
                "group relative flex gap-4 px-6 py-4",
                "hover:bg-secondary/30 transition-all duration-200",
                index !== activities.length - 1 && "border-b border-border/50"
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Timeline dot */}
              <div className={cn(
                "relative z-10 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0",
                "bg-card border-2 border-border",
                "group-hover:border-primary/50 transition-colors"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  activity.color.replace('text-', 'bg-')
                )} />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <activity.icon className={cn("w-4 h-4 flex-shrink-0", activity.color)} />
                      <h4 className="font-medium text-sm truncate">
                        {activity.title}
                      </h4>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 truncate">
                      {activity.description}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {activity.time}
                  </span>
                </div>
              </div>

              {/* Hover action */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
