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
  MoveRight,
  Calendar 
} from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { PipelineItem, PipelineStatus, PipelineColumn } from "./types";

interface PipelineCardProps {
  item: PipelineItem;
  column: PipelineColumn;
  onView: (item: PipelineItem) => void;
  onEdit: (item: PipelineItem) => void;
  onDelete: (item: PipelineItem) => void;
  onMoveToColumn: (item: PipelineItem, status: PipelineStatus) => void;
}

export const PipelineCard = ({ 
  item, 
  column,
  onView,
  onEdit,
  onDelete,
  onMoveToColumn
}: PipelineCardProps) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group bg-secondary/50 rounded-lg p-3 border border-border hover:border-primary/30 transition-all duration-200",
        isDragging && "opacity-50 shadow-lg ring-2 ring-primary/50"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1 -ml-1 rounded hover:bg-primary/10 transition-colors"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">{item.title}</h4>
            <p className="text-xs text-muted-foreground">{item.medium}</p>
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => onView(item)}>
              <Eye className="w-4 h-4 mr-2" />
              Lihat Detail
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onMoveToColumn(item, "concept")}
              className="text-purple-400"
            >
              <MoveRight className="w-4 h-4 mr-2" />
              Pindah ke Konsep
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onMoveToColumn(item, "wip")}
              className="text-blue-400"
            >
              <MoveRight className="w-4 h-4 mr-2" />
              Pindah ke Proses
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onMoveToColumn(item, "finished")}
              className="text-emerald-400"
            >
              <MoveRight className="w-4 h-4 mr-2" />
              Pindah ke Selesai
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onMoveToColumn(item, "sold")}
              className="text-primary"
            >
              <MoveRight className="w-4 h-4 mr-2" />
              Pindah ke Terjual
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onDelete(item)}
              className="text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-border/50">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="w-3 h-3" />
          {item.dueDate}
        </div>
        {item.price && (
          <span className="text-xs font-medium text-primary">{item.price}</span>
        )}
      </div>
    </div>
  );
};

// Drag Overlay Item for visual feedback during drag
export const DragOverlayItem = ({ item }: { item: PipelineItem }) => (
  <div className="bg-card/95 backdrop-blur-sm rounded-lg p-3 border-2 border-primary shadow-xl shadow-primary/20 w-72">
    <div className="flex items-start gap-2">
      <GripVertical className="w-4 h-4 text-primary mt-0.5" />
      <div>
        <h4 className="font-medium text-sm">{item.title}</h4>
        <p className="text-xs text-muted-foreground">{item.medium}</p>
      </div>
    </div>
  </div>
);
