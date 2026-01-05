import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Layers, RotateCcw, Loader2 } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { cn } from "@/lib/utils";
import { useResponsive, useOrientation } from "@/lib/responsive";

// Pipeline Components
import {
  PipelineStatus,
  PipelineColumn,
  DragOverlayItem,
  PipelineColumnComponent,
  PipelineSummary,
  AddItemDialog,
  EditItemDialog,
  ViewItemDialog,
  usePipeline,
} from "@/components/pipeline";

const Pipeline = () => {
  const { isMobile, isTablet, isTouchDevice, isLgUp, value } = useResponsive();
  const { isLandscape, isPortrait } = useOrientation();
  
  // Use the custom hook for all pipeline logic
  const {
    pipelineData,
    activeItem,
    loading,
    isAddDialogOpen,
    isViewDialogOpen,
    isEditDialogOpen,
    selectedItem,
    formData,
    formErrors,
    isSubmitting,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleMoveToColumn,
    handleInputChange,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleViewItem,
    handleOpenEditDialog,
    handleOpenAddDialogForColumn,
    handleAddDialogClose,
    handleEditDialogClose,
    handleViewDialogClose,
    handleViewToEdit,
    formatPriceInput,
    refreshPipeline,
  } = usePipeline();

  // DnD Sensors - optimized for touch devices
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Calculate total items
  const totalItems = Object.values(pipelineData).reduce(
    (sum, col) => sum + col.items.length, 
    0
  );

  // Loading Screen
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="relative">
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
              <div className="absolute inset-0 w-12 h-12 mx-auto rounded-full bg-primary/20 animate-ping" />
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground font-medium">Memuat pipeline...</p>
              <p className="text-xs text-muted-foreground/60">Mengambil data karya seni</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Header Section */}
        <div className={cn(
          "flex flex-col gap-4 mb-6",
          isLgUp && "flex-row items-center justify-between"
        )}>
          {/* Title & Description */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                <Layers className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className={cn(
                  "font-display font-bold leading-tight",
                  value({ xs: "text-2xl", md: "text-3xl", default: "text-3xl" })
                )}>
                  Pipeline Karya
                </h1>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {totalItems} karya dalam pipeline
                </p>
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className={cn(
            "flex gap-2",
            isMobile && "w-full"
          )}>
            <Button
              variant="outline"
              size={isMobile ? "default" : "sm"}
              className="gap-2"
              onClick={refreshPipeline}
              disabled={loading}
            >
              <RotateCcw className={cn("w-4 h-4", loading && "animate-spin")} />
              {!isMobile && "Refresh"}
            </Button>
            <Button 
              variant="default" 
              size={isMobile ? "default" : "default"}
              className={cn(
                "gap-2 shadow-lg shadow-primary/25",
                "hover:shadow-xl hover:shadow-primary/30",
                "transition-all duration-300",
                isMobile && "flex-1"
              )}
              onClick={() => handleOpenAddDialogForColumn("concept")}
            >
              <Plus className="w-4 h-4" />
              Tambah Karya
            </Button>
          </div>
        </div>

        {/* Mobile/Tablet Orientation Hint */}
        {(isMobile || isTablet) && isPortrait && (
          <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <RotateCcw className="w-4 h-4 text-primary" />
            </div>
            <p className="text-sm text-primary">
              Putar perangkat ke landscape untuk tampilan yang lebih baik.
            </p>
          </div>
        )}

        {/* Kanban Board with DnD */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          {/* Scrollable Kanban Container */}
          <div className={cn(
            // Base layout
            "flex gap-5 pt-4 pb-8",
            // Allow horizontal scroll
            "overflow-x-auto overflow-y-visible",
            // Scroll snap for mobile
            isMobile && "snap-x snap-mandatory",
            // Extended padding for shadows/glow to not be clipped
            "-mx-6 px-6 lg:-mx-8 lg:px-8",
            // Ensure columns don't shrink
            "min-w-0",
            // Scrollbar styling
            "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20",
            // Add padding at the end for last column
            "pr-8",
            // Ensure shadows render above the summary
            "relative z-10"
          )}>
            {(Object.entries(pipelineData) as [PipelineStatus, PipelineColumn][]).map(([key, column]) => (
              <PipelineColumnComponent
                key={key}
                columnKey={key}
                column={column}
                onAddItem={handleOpenAddDialogForColumn}
                onViewItem={handleViewItem}
                onEditItem={handleOpenEditDialog}
                onDeleteItem={handleDeleteItem}
                onMoveToColumn={handleMoveToColumn}
              />
            ))}
            {/* Spacer for end padding */}
            <div className="w-4 flex-shrink-0" aria-hidden="true" />
          </div>

          {/* Drag Overlay */}
          <DragOverlay dropAnimation={{
            duration: 250,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}>
            {activeItem ? <DragOverlayItem item={activeItem} /> : null}
          </DragOverlay>
        </DndContext>

        {!(isMobile && isPortrait) && (
          <div className="mt-2 relative z-0 px-1">
            <PipelineSummary pipelineData={pipelineData} />
          </div>
        )}

        {/* Dialogs */}
        <AddItemDialog
          isOpen={isAddDialogOpen}
          onOpenChange={handleAddDialogClose}
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSubmit={handleAddItem}
          formatPriceInput={formatPriceInput}
        />

        <EditItemDialog
          isOpen={isEditDialogOpen}
          onOpenChange={handleEditDialogClose}
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSubmit={handleEditItem}
          formatPriceInput={formatPriceInput}
        />

        <ViewItemDialog
          isOpen={isViewDialogOpen}
          onOpenChange={handleViewDialogClose}
          item={selectedItem}
          onEdit={handleViewToEdit}
        />
      </div>
    </DashboardLayout>
  );
};

export default Pipeline;
