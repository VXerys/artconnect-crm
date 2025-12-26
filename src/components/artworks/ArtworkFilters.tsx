import { Button } from "@/components/ui/button";
import { Grid3X3, List, Sparkles, Layers, Clock, CheckCircle2, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { ViewMode, Artwork } from "./types";
import { statusConfig } from "./constants";

interface ArtworkFiltersProps {
  filter: string;
  view: ViewMode;
  artworks: Artwork[];
  onFilterChange: (filter: string) => void;
  onViewChange: (view: ViewMode) => void;
}

// Status icons mapping
const statusIcons = {
  all: Layers,
  concept: Sparkles,
  wip: Clock,
  finished: CheckCircle2,
  sold: DollarSign,
};

// Status colors for pills
const statusColors = {
  all: "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20",
  concept: "bg-purple-500/10 text-purple-400 border-purple-500/30 hover:bg-purple-500/20",
  wip: "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20",
  finished: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20",
  sold: "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20",
};

export const ArtworkFilters = ({
  filter,
  view,
  artworks,
  onFilterChange,
  onViewChange,
}: ArtworkFiltersProps) => {
  // Calculate counts for each status
  const counts = {
    all: artworks.length,
    concept: artworks.filter(a => a.status === 'concept').length,
    wip: artworks.filter(a => a.status === 'wip').length,
    finished: artworks.filter(a => a.status === 'finished').length,
    sold: artworks.filter(a => a.status === 'sold').length,
  };

  return (
    <div className="space-y-4">
      {/* Filter Pills */}
      <div className="flex flex-wrap items-center gap-2">
        {/* All filter */}
        <button
          onClick={() => onFilterChange('all')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
            filter === 'all'
              ? "bg-primary text-primary-foreground border-primary shadow-glow"
              : statusColors.all
          )}
        >
          <Layers className="w-4 h-4" />
          Semua
          <span className={cn(
            "px-1.5 py-0.5 rounded-full text-xs",
            filter === 'all' ? "bg-white/20" : "bg-current/10"
          )}>
            {counts.all}
          </span>
        </button>

        {/* Status filters */}
        {Object.entries(statusConfig).map(([key, value]) => {
          const Icon = statusIcons[key as keyof typeof statusIcons];
          const count = counts[key as keyof typeof counts];
          const isActive = filter === key;
          
          return (
            <button
              key={key}
              onClick={() => onFilterChange(key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200",
                isActive
                  ? cn(
                      "shadow-lg",
                      key === 'concept' && "bg-purple-500 text-white border-purple-500",
                      key === 'wip' && "bg-blue-500 text-white border-blue-500",
                      key === 'finished' && "bg-emerald-500 text-white border-emerald-500",
                      key === 'sold' && "bg-amber-500 text-white border-amber-500"
                    )
                  : statusColors[key as keyof typeof statusColors]
              )}
            >
              <Icon className="w-4 h-4" />
              {value.label}
              {count > 0 && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs",
                  isActive ? "bg-white/20" : "bg-current/10"
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* View Toggle & Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-medium text-foreground">{
            filter === 'all' ? counts.all : counts[filter as keyof typeof counts]
          }</span> karya seni
        </p>

        {/* View Toggle */}
        <div className="flex items-center gap-1 p-1 bg-secondary/50 backdrop-blur-sm rounded-xl border border-border">
          <button
            onClick={() => onViewChange('grid')}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              view === 'grid'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <Grid3X3 className="w-4 h-4" />
            <span className="hidden sm:inline">Grid</span>
          </button>
          <button
            onClick={() => onViewChange('list')}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              view === 'list'
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>
    </div>
  );
};
