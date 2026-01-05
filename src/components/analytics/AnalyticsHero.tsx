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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-blue-500/5 border border-border p-6 lg:p-8">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left side */}
        <div className="space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-sm text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Pusat Analitik & Insight
          </div>

          {/* Title */}
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold">
              Analitik & <span className="text-primary">Performa</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg max-w-xl">
              Pantau perkembangan bisnis seni Anda dengan insight real-time yang powerful.
            </p>
          </div>

          {/* Summary stats */}
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <BarChart3 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-bold text-xl">{totalRevenue}</span>
                <span className="text-muted-foreground text-sm ml-1">total</span>
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Sparkles className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="font-bold text-xl text-emerald-400">{revenueGrowth}</span>
                <span className="text-muted-foreground text-sm ml-1">pertumbuhan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Date Range & Actions */}
        <div className="flex flex-col gap-4">
          {/* Date Range Selector */}
          <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl border border-border">
            {dateRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onRangeChange(option.value as DateRange)}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-lg transition-all",
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
          <div className="flex gap-3">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar className="w-4 h-4" />
              Kustom Range
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
