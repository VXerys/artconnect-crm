import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Sparkles, 
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DateRange } from "./types";
import { dateRangeOptions } from "./constants";

interface AnalyticsHeroProps {
  totalRevenue: string;
  revenueGrowth: string;
  selectedRange: DateRange;
  onRangeChange: (range: DateRange) => void;
}

export const AnalyticsHero = ({ 
  totalRevenue,
  revenueGrowth,
  selectedRange,
  onRangeChange,
}: AnalyticsHeroProps) => {
  return (
    <div className="relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary/5 via-background to-blue-500/5 border border-border p-3 sm:p-5 md:p-6 lg:p-8">
      {/* Decorative elements */}
      <div className="absolute -top-16 -right-16 w-40 h-40 sm:w-60 sm:h-60 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-8 -left-8 w-28 h-28 sm:w-40 sm:h-40 bg-blue-500/10 rounded-full blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-14 h-14 sm:w-20 sm:h-20 bg-purple-500/10 rounded-full blur-xl hidden sm:block" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-4 sm:gap-5 md:gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left side */}
        <div className="space-y-2 sm:space-y-3 md:space-y-4 flex-1 min-w-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 rounded-full bg-secondary/50 border border-border text-[10px] sm:text-xs md:text-sm text-muted-foreground">
            <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 text-primary flex-shrink-0" />
            <span className="truncate">Pusat Analitik & Insight</span>
          </div>

          {/* Title */}
          <div>
            <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
              Analitik & <span className="text-primary">Performa</span>
            </h1>
            <p className="text-muted-foreground mt-0.5 sm:mt-1 md:mt-2 text-xs sm:text-sm md:text-base lg:text-lg max-w-xl leading-relaxed">
              Pantau perkembangan bisnis seni Anda dengan insight real-time yang powerful.
            </p>
          </div>

          {/* Summary stats */}
          <div className="flex flex-col xs:flex-row items-start xs:items-center gap-3 sm:gap-4 md:gap-6 pt-1 sm:pt-2">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-primary/10">
                <BarChart3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary" />
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg md:text-xl">{totalRevenue}</span>
                <span className="text-muted-foreground text-[10px] sm:text-xs md:text-sm ml-0.5 sm:ml-1">total</span>
              </div>
            </div>
            <div className="w-px h-6 sm:h-8 bg-border hidden xs:block" />
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-emerald-500/10">
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-base sm:text-lg md:text-xl text-emerald-400">{revenueGrowth}</span>
                <span className="text-muted-foreground text-[10px] sm:text-xs md:text-sm ml-0.5 sm:ml-1">pertumbuhan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Date Range & Actions */}
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4 w-full lg:w-auto">
          {/* Date Range Selector */}
          <div className="flex items-center gap-0.5 sm:gap-1 p-0.5 sm:p-1 bg-secondary/50 rounded-lg sm:rounded-xl border border-border overflow-x-auto">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onRangeChange(option.value as DateRange)}
                className={cn(
                  "px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs md:text-sm font-medium rounded-md sm:rounded-lg transition-all whitespace-nowrap",
                  selectedRange === option.value
                    ? "bg-primary text-primary-foreground shadow-glow"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {option.label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-2 sm:gap-3">
            <Button variant="outline" size="sm" className="gap-1 sm:gap-1.5 md:gap-2 h-8 sm:h-9 md:h-10 text-[10px] sm:text-xs md:text-sm w-full lg:w-auto">
              <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 flex-shrink-0" />
              <span className="truncate">Kustom Range</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
