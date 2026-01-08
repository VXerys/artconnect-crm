import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, GripVertical } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { PipelineCard } from "./PipelineCard";
import { PipelineItem, PipelineStatus, PipelineColumn as PipelineColumnType } from "./types";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/lib/responsive";

interface PipelineColumnProps {
  columnKey: PipelineStatus;
  column: PipelineColumnType;
  onAddItem: (status: PipelineStatus) => void;
  onViewItem: (item: PipelineItem) => void;
  onEditItem: (item: PipelineItem) => void;
  onDeleteItem: (item: PipelineItem) => void;
  onMoveToColumn: (item: PipelineItem, status: PipelineStatus) => void;
}

// Trello-inspired column colors
const COLUMN_THEMES: Record<PipelineStatus, { 
  gradient: string; 
  glow: string; 
  accent: string;
  badge: string;
}> = {
  concept: {
    gradient: 'from-violet-500/20 to-purple-600/10',
    glow: 'hover:shadow-violet-500/20',
    accent: 'border-t-violet-500',
    badge: 'bg-violet-500/20 text-violet-300',
  },
  wip: {
    gradient: 'from-blue-500/20 to-cyan-600/10',
    glow: 'hover:shadow-blue-500/20',
    accent: 'border-t-blue-500',
    badge: 'bg-blue-500/20 text-blue-300',
  },
  finished: {
    gradient: 'from-emerald-500/20 to-green-600/10',
    glow: 'hover:shadow-emerald-500/20',
    accent: 'border-t-emerald-500',
    badge: 'bg-emerald-500/20 text-emerald-300',
  },
  sold: {
    gradient: 'from-amber-500/20 to-orange-600/10',
    glow: 'hover:shadow-amber-500/20',
    accent: 'border-t-amber-500',
    badge: 'bg-amber-500/20 text-amber-300',
  },
};

export const PipelineColumnComponent = ({
  columnKey,
  column,
  onAddItem,
  onViewItem,
  onEditItem,
  onDeleteItem,
  onMoveToColumn,
}: PipelineColumnProps) => {
  const { isMobile, value } = useResponsive();
  
  // Make the column a droppable target for cross-column drops
  const { setNodeRef, isOver } = useDroppable({
    id: columnKey,
  });

  const theme = COLUMN_THEMES[columnKey];
  
  // Responsive column width - optimized for mobile-first
  const columnWidth = value({
    xs: 'w-[220px] min-w-[200px]',
    sm: 'w-[260px] min-w-[240px]',
    md: 'w-64',
    lg: 'w-72',
    xl: 'w-80',
    default: 'w-80',
  });

  // Responsive max height for cards container
  const maxHeight = value({
    xs: 'max-h-[35vh]',
    sm: 'max-h-[40vh]',
    md: 'max-h-[50vh]',
    lg: 'max-h-[55vh]',
    default: 'max-h-[60vh]',
  });

  const minHeight = value({
    xs: 'min-h-[120px]',
    sm: 'min-h-[150px]',
    md: 'min-h-[200px]',
    default: 'min-h-[250px]',
  });

  return (
    <div 
      ref={setNodeRef} 
      className={cn(
        "flex-shrink-0 snap-center",
        columnWidth,
        // Add padding for shadow overflow
        "py-1"
      )}
    >
      <Card 
        className={cn(
          // Base styles - NO overflow-hidden to prevent shadow clipping
          "relative flex flex-col transition-all duration-300",
          // Gradient background
          `bg-gradient-to-b ${theme.gradient}`,
          // Border accent
          `border-t-4 ${theme.accent}`,
          // Glass effect
          "backdrop-blur-xl bg-card/80",
          // Shadow and glow
          "shadow-md hover:shadow-xl",
          theme.glow,
          // Drop target highlight
          isOver && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-[1.02]"
        )}
      >
        {/* Column Header */}
        <CardHeader className="pb-1 xs:pb-1.5 sm:pb-2 pt-2 xs:pt-2.5 sm:pt-3 md:pt-4 px-2 xs:px-2.5 sm:px-3 md:px-4 flex-shrink-0">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 md:gap-3 min-w-0 flex-1">
              {/* Drag handle for mobile column reorder (future feature) */}
              {isMobile && (
                <GripVertical className="w-2.5 h-2.5 xs:w-3 xs:h-3 text-muted-foreground/50 flex-shrink-0" />
              )}
              <CardTitle className="text-[11px] xs:text-xs sm:text-sm md:text-base font-bold tracking-tight truncate">
                {column.title}
              </CardTitle>
              <span className={cn(
                "px-1 xs:px-1.5 sm:px-2 md:px-2.5 py-0.5 rounded-full text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-bold tabular-nums flex-shrink-0",
                theme.badge
              )}>
                {column.items.length}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "h-5 w-5 xs:h-6 xs:w-6 sm:h-7 sm:w-7 md:h-8 md:w-8 rounded-md sm:rounded-lg transition-all flex-shrink-0",
                "hover:bg-white/10 hover:text-white",
                "active:scale-95"
              )}
              onClick={() => onAddItem(columnKey)}
            >
              <Plus className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Cards Container */}
        <CardContent className="pt-0 pb-0 px-0 flex-1 overflow-hidden flex flex-col">
          <div 
            className={cn(
              "flex-1 px-1.5 xs:px-2 sm:px-2.5 md:px-3 pb-2 xs:pb-2.5 sm:pb-3 md:pb-4 pt-0.5 space-y-1.5 xs:space-y-2 sm:space-y-2.5 md:space-y-3 overflow-y-auto",
              "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent",
              maxHeight,
              minHeight
            )}
          >
            <SortableContext
              items={column.items.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {column.items.length === 0 ? (
                // Empty state
                <div className={cn(
                  "flex flex-col items-center justify-center py-4 xs:py-6 sm:py-8 md:py-10 lg:py-12 text-center",
                  "rounded-lg sm:rounded-xl border-2 border-dashed transition-all duration-200",
                  isOver 
                    ? "border-primary bg-primary/10 scale-[1.02]" 
                    : "border-white/10 hover:border-white/20"
                )}>
                  <div className={cn(
                    "p-2 xs:p-2.5 sm:p-3 md:p-4 rounded-lg sm:rounded-xl md:rounded-2xl mb-2 xs:mb-2.5 sm:mb-3 md:mb-4 transition-transform",
                    theme.badge,
                    isOver && "scale-110"
                  )}>
                    <Sparkles className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 md:w-6 md:h-6" />
                  </div>
                  <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-1.5 xs:mb-2 sm:mb-2.5 md:mb-3">
                    Belum ada karya
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "gap-1 sm:gap-1.5 md:gap-2 border-white/20 hover:bg-white/10 text-[9px] xs:text-[10px] sm:text-xs md:text-sm",
                      "transition-all active:scale-95 h-6 xs:h-7 sm:h-8 md:h-9 px-2 sm:px-3"
                    )}
                    onClick={() => onAddItem(columnKey)}
                  >
                    <Plus className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                    Tambah Karya
                  </Button>
                </div>
              ) : (
                // Cards list
                column.items.map((item) => (
                  <PipelineCard
                    key={item.id}
                    item={item}
                    column={column}
                    columnKey={columnKey}
                    onView={onViewItem}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                    onMoveToColumn={onMoveToColumn}
                  />
                ))
              )}
            </SortableContext>
          </div>
        </CardContent>

        {/* Add Card Button - Trello style (at bottom) */}
        {column.items.length > 0 && (
          <div className="px-1.5 xs:px-2 sm:px-2.5 md:px-3 pb-1.5 xs:pb-2 sm:pb-2.5 md:pb-3">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-1 xs:gap-1.5 sm:gap-2 text-muted-foreground text-[9px] xs:text-[10px] sm:text-xs md:text-sm",
                "hover:bg-white/10 hover:text-white",
                "transition-all rounded-md sm:rounded-lg h-6 xs:h-7 sm:h-8 md:h-9",
                isMobile && "py-1.5 xs:py-2 sm:py-2.5"
              )}
              onClick={() => onAddItem(columnKey)}
            >
              <Plus className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              <span className="truncate">Tambah karya...</span>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
