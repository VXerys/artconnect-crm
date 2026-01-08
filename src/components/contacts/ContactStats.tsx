import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ContactsByType } from "./types";
import { typeConfig } from "./constants";
import { Users } from "lucide-react";

interface ContactStatsProps {
  contactsByType: ContactsByType;
  currentFilter: string;
  onFilterChange: (filter: string) => void;
}

export const ContactStats = ({
  contactsByType,
  currentFilter,
  onFilterChange,
}: ContactStatsProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 md:gap-4">
      {/* All Contacts Card - Featured */}
      <Card 
        className={cn(
          "relative overflow-hidden cursor-pointer transition-all duration-300",
          "bg-gradient-to-br from-primary/20 via-primary/10 to-transparent",
          "border-primary/30 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10",
          "group col-span-2 sm:col-span-1",
          currentFilter === 'all' && "ring-2 ring-primary ring-offset-2 ring-offset-background"
        )}
        onClick={() => onFilterChange('all')}
      >
        {/* Decorative gradient circle */}
        <div className="absolute -top-6 -right-6 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-primary/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
        
        <CardContent className="p-3 sm:p-4 text-center relative">
          <div className="inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full bg-primary/10 mb-1.5 sm:mb-2 group-hover:scale-110 transition-transform">
            <Users className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 text-primary" />
          </div>
          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">{contactsByType.all}</div>
          <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground font-medium">Semua Kontak</div>
        </CardContent>
      </Card>

      {/* Type-specific Cards */}
      {Object.entries(typeConfig).map(([key, config]) => {
        const Icon = config.icon;
        const count = contactsByType[key as keyof ContactsByType];
        const isActive = currentFilter === key;
        
        return (
          <Card 
            key={key}
            className={cn(
              "relative overflow-hidden cursor-pointer transition-all duration-300",
              "bg-card border-border hover:-translate-y-1 hover:shadow-lg group",
              isActive && "ring-2 ring-offset-2 ring-offset-background",
              isActive && key === 'gallery' && "ring-purple-400",
              isActive && key === 'collector' && "ring-blue-400",
              isActive && key === 'museum' && "ring-emerald-400",
              isActive && key === 'curator' && "ring-primary"
            )}
            onClick={() => onFilterChange(key)}
          >
            {/* Hover gradient overlay */}
            <div className={cn(
              "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
              config.bg
            )} />
            
            <CardContent className="p-3 sm:p-4 text-center relative">
              <div className={cn(
                "inline-flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-full mb-1.5 sm:mb-2",
                "transition-all duration-300 group-hover:scale-110",
                config.bg
              )}>
                <Icon className={cn("w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5", config.color)} />
              </div>
              <div className={cn(
                "text-lg sm:text-xl md:text-2xl font-bold transition-colors duration-300",
                isActive ? config.color : "text-foreground",
                "group-hover:" + config.color.replace('text-', 'text-')
              )}>
                {count}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground font-medium">{config.label}</div>
              
              {/* Active indicator bar */}
              <div className={cn(
                "absolute bottom-0 left-0 right-0 h-0.5 sm:h-1 transition-all duration-300",
                isActive ? "opacity-100" : "opacity-0 group-hover:opacity-50",
                key === 'gallery' && "bg-purple-400",
                key === 'collector' && "bg-blue-400",
                key === 'museum' && "bg-emerald-400",
                key === 'curator' && "bg-primary"
              )} />
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
