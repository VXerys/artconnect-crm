import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  GripVertical, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2, 
  ArrowRight,
  Palette,
  DollarSign
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { useResponsive } from "@/lib/responsive";
import { PipelineItem, PipelineStatus, PipelineColumn } from "./types";

interface PipelineCardProps {
  item: PipelineItem;
  column: PipelineColumn;
  columnKey: PipelineStatus;
  onView: (item: PipelineItem) => void;
  onEdit: (item: PipelineItem) => void;
  onDelete: (item: PipelineItem) => void;
  onMoveToColumn: (item: PipelineItem, status: PipelineStatus) => void;
}

// Status color configs
const STATUS_COLORS: Record<PipelineStatus, string> = {
  concept: 'bg-violet-500',
  wip: 'bg-blue-500',
  finished: 'bg-emerald-500',
  sold: 'bg-amber-500',
};

const STATUS_LABELS: Record<PipelineStatus, string> = {
  concept: 'Konsep',
  wip: 'Proses',
  finished: 'Selesai',
  sold: 'Terjual',
};

export const PipelineCard = ({ 
  item, 
  column,
  columnKey,
  onView,
  onEdit,
  onDelete,
  onMoveToColumn
}: PipelineCardProps) => {
  const { isMobile, isTouchDevice } = useResponsive();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Available columns to move to (exclude current)
  const availableColumns: PipelineStatus[] = ['concept', 'wip', 'finished', 'sold']
    .filter(s => s !== columnKey) as PipelineStatus[];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        // Base styles
        "group relative bg-card/90 backdrop-blur-sm rounded-lg sm:rounded-xl",
        "border border-white/10 hover:border-white/20",
        // Shadow and glow
        "shadow-sm hover:shadow-lg",
        // Transitions
        "transition-all duration-200",
        // Touch friendly
        isTouchDevice && "active:scale-[0.98]",
        // Dragging state
        isDragging && [
          "opacity-60 shadow-2xl scale-105",
          "ring-2 ring-primary/50 z-50"
        ]
      )}
    >
      {/* Card Content */}
      <div className="p-1.5 xs:p-2 sm:p-2.5 md:p-3">
        {/* Top row: Drag handle + title + menu */}
        <div className="flex items-start gap-1 xs:gap-1.5 sm:gap-2">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className={cn(
              "flex-shrink-0 p-0.5 xs:p-1 sm:p-1.5 -ml-0.5 rounded-md cursor-grab",
              "hover:bg-white/10 active:cursor-grabbing",
              "transition-colors touch-none",
              // Larger touch target on mobile
              isMobile && "p-1 xs:p-1.5"
            )}
          >
            <GripVertical className={cn(
              "text-muted-foreground/40 group-hover:text-muted-foreground/80",
              "transition-colors",
              "w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
            )} />
          </div>

          {/* Title & Medium */}
          <div className="flex-1 min-w-0 py-0.5">
            <h4 className="font-semibold text-[10px] xs:text-[11px] sm:text-xs md:text-sm leading-tight truncate">
              {item.title}
            </h4>
            <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 mt-0.5">
              <Palette className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3 text-muted-foreground/60 flex-shrink-0" />
              <span className="text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs text-muted-foreground truncate">
                {item.medium || 'Tidak ada medium'}
              </span>
            </div>
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 rounded-md flex-shrink-0",
                  "opacity-0 group-hover:opacity-100 focus:opacity-100",
                  "hover:bg-white/10 transition-all",
                  // Always visible on touch devices
                  isTouchDevice && "opacity-100"
                )}
              >
                <MoreHorizontal className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-44 sm:w-48 md:w-52 backdrop-blur-xl bg-card/95"
            >
              <DropdownMenuItem onClick={() => onView(item)} className="gap-2 text-xs sm:text-sm">
                <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(item)} className="gap-2 text-xs sm:text-sm">
                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Edit Karya
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              
              {/* Move to column options */}
              <div className="px-2 py-1.5">
                <span className="text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Pindahkan ke
                </span>
              </div>
              {availableColumns.map((status) => (
                <DropdownMenuItem 
                  key={status}
                  onClick={() => onMoveToColumn(item, status)}
                  className="gap-2 text-xs sm:text-sm"
                >
                  <div className={cn("w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full", STATUS_COLORS[status])} />
                  <ArrowRight className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  <span>{STATUS_LABELS[status]}</span>
                </DropdownMenuItem>
              ))}
              
              <DropdownMenuSeparator />
              
              <DropdownMenuItem 
                onClick={() => onDelete(item)}
                className="gap-2 text-destructive focus:text-destructive focus:bg-destructive/10 text-xs sm:text-sm"
              >
                <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Hapus Karya
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom row: Price info */}
        {item.price && (
          <div className="flex items-center justify-end mt-1.5 xs:mt-2 sm:mt-2.5 pt-1 xs:pt-1.5 sm:pt-2 border-t border-white/5">
            <div className="flex items-center gap-0.5 text-[8px] xs:text-[9px] sm:text-[10px] md:text-xs font-semibold text-primary">
              <DollarSign className="w-2 h-2 xs:w-2.5 xs:h-2.5 sm:w-3 sm:h-3" />
              <span className="truncate">{item.price}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Drag Overlay Item for visual feedback during drag
export const DragOverlayItem = ({ item }: { item: PipelineItem }) => (
  <div className={cn(
    "w-52 sm:w-60 md:w-72 bg-card/95 backdrop-blur-xl rounded-lg sm:rounded-xl p-2 sm:p-2.5 md:p-3",
    "border-2 border-primary shadow-2xl shadow-primary/30",
    "rotate-3 scale-105"
  )}>
    <div className="flex items-start gap-1.5 sm:gap-2">
      <GripVertical className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 text-primary mt-0.5" />
      <div className="flex-1">
        <h4 className="font-semibold text-[11px] sm:text-xs md:text-sm">{item.title}</h4>
        <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5">{item.medium}</p>
      </div>
    </div>
    {item.price && (
      <div className="mt-1.5 sm:mt-2 pt-1.5 sm:pt-2 border-t border-white/10 text-right">
        <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-primary">{item.price}</span>
      </div>
    )}
  </div>
);
