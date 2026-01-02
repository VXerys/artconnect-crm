import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { PipelineCard } from "./PipelineCard";
import { PipelineItem, PipelineStatus, PipelineColumn as PipelineColumnType } from "./types";
import { cn } from "@/lib/utils";

interface PipelineColumnProps {
  columnKey: PipelineStatus;
  column: PipelineColumnType;
  onAddItem: (status: PipelineStatus) => void;
  onViewItem: (item: PipelineItem) => void;
  onEditItem: (item: PipelineItem) => void;
  onDeleteItem: (item: PipelineItem) => void;
  onMoveToColumn: (item: PipelineItem, status: PipelineStatus) => void;
  maxVisibleCards?: number;
}

export const PipelineColumnComponent = ({
  columnKey,
  column,
  onAddItem,
  onViewItem,
  onEditItem,
  onDeleteItem,
  onMoveToColumn,
  maxVisibleCards = 4,
}: PipelineColumnProps) => {
  // Make the column a droppable target for cross-column drops
  const { setNodeRef, isOver } = useDroppable({
    id: columnKey,
  });

  // Calculate max height based on card height (~120px per card) + padding
  const maxHeight = maxVisibleCards * 130 + 20;

  return (
    <div ref={setNodeRef} className="flex-shrink-0 w-80">
      <Card 
        className={cn(
          "bg-card border-border border-t-4 flex flex-col transition-all duration-200",
          column.color,
          isOver && "ring-2 ring-primary/50 bg-primary/5"
        )}
      >
        <CardHeader className="pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-sm font-semibold">{column.title}</CardTitle>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${column.bgColor} ${column.textColor}`}>
                {column.items.length}
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
              onClick={() => onAddItem(columnKey)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 pb-3 px-3 flex-1 overflow-hidden">
          <div 
            className="space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent pr-1"
            style={{ maxHeight: `${maxHeight}px`, minHeight: '200px' }}
          >
            <SortableContext
              items={column.items.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              {column.items.length === 0 ? (
                <div className={cn(
                  "flex flex-col items-center justify-center py-8 text-center rounded-lg border-2 border-dashed transition-colors",
                  isOver ? "border-primary bg-primary/10" : "border-transparent"
                )}>
                  <div className={`p-3 rounded-full ${column.bgColor} mb-3`}>
                    <Sparkles className={`w-5 h-5 ${column.textColor}`} />
                  </div>
                  <p className="text-sm text-muted-foreground">Belum ada karya</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 gap-1"
                    onClick={() => onAddItem(columnKey)}
                  >
                    <Plus className="w-3 h-3" />
                    Tambah
                  </Button>
                </div>
              ) : (
                column.items.map((item) => (
                  <PipelineCard
                    key={item.id}
                    item={item}
                    column={column}
                    onView={onViewItem}
                    onEdit={onEditItem}
                    onDelete={onDeleteItem}
                    onMoveToColumn={onMoveToColumn}
                  />
                ))
              )}
            </SortableContext>
          </div>
          
          {/* Scroll indicator when there are more items */}
          {column.items.length > maxVisibleCards && (
            <div className="pt-2 mt-2 border-t border-border/50 text-center">
              <span className="text-xs text-muted-foreground">
                Scroll untuk {column.items.length - maxVisibleCards} karya lainnya
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
