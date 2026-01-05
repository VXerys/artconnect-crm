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
  const { isMobile, isTablet, value } = useResponsive();
  
  // Make the column a droppable target for cross-column drops
  const { setNodeRef, isOver } = useDroppable({
    id: columnKey,
  });

  const theme = COLUMN_THEMES[columnKey];
  
  // Responsive column width
  const columnWidth = value({
    xs: 'w-[85vw]',
    sm: 'w-[75vw]',
    md: 'w-80',
    lg: 'w-80',
    default: 'w-80',
  });

  // Responsive max height for cards container
  const maxHeight = value({
    xs: 'max-h-[50vh]',
    sm: 'max-h-[55vh]',
    md: 'max-h-[60vh]',
    lg: 'max-h-[65vh]',
    default: 'max-h-[65vh]',
  });

  const minHeight = value({
    xs: 'min-h-[200px]',
    md: 'min-h-[300px]',
    default: 'min-h-[300px]',
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
        <CardHeader className="pb-2 pt-4 px-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Drag handle for mobile column reorder (future feature) */}
              {isMobile && (
                <GripVertical className="w-4 h-4 text-muted-foreground/50" />
              )}
              <CardTitle className="text-base font-bold tracking-tight">
                {column.title}
              </CardTitle>
              <span className={cn(
                "px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums",
                theme.badge
              )}>
                {column.items.length}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              className={cn(
                "h-8 w-8 rounded-lg transition-all",
                "hover:bg-white/10 hover:text-white",
                "active:scale-95"
              )}
              onClick={() => onAddItem(columnKey)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Cards Container */}
        <CardContent className="pt-0 pb-0 px-0 flex-1 overflow-hidden flex flex-col">
          <div 
            className={cn(
              "flex-1 px-3 pb-4 pt-1 space-y-3 overflow-y-auto",
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
                  "flex flex-col items-center justify-center py-12 text-center",
                  "rounded-xl border-2 border-dashed transition-all duration-200",
                  isOver 
                    ? "border-primary bg-primary/10 scale-[1.02]" 
                    : "border-white/10 hover:border-white/20"
                )}>
                  <div className={cn(
                    "p-4 rounded-2xl mb-4 transition-transform",
                    theme.badge,
                    isOver && "scale-110"
                  )}>
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Belum ada karya
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className={cn(
                      "gap-2 border-white/20 hover:bg-white/10",
                      "transition-all active:scale-95"
                    )}
                    onClick={() => onAddItem(columnKey)}
                  >
                    <Plus className="w-3 h-3" />
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
          <div className="px-3 pb-3">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "w-full justify-start gap-2 text-muted-foreground",
                "hover:bg-white/10 hover:text-white",
                "transition-all rounded-lg",
                isMobile && "py-3"
              )}
              onClick={() => onAddItem(columnKey)}
            >
              <Plus className="w-4 h-4" />
              Tambah karya...
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};
