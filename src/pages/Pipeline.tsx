import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Layers, RotateCcw } from "lucide-react";
import PageLoading from "@/components/ui/PageLoading";
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
import { useResponsive } from "@/lib/responsive";

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
  const { isMobile, isTablet, isPortrait } = useResponsive();
  
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
        <PageLoading title="Memuat pipeline..." subtitle="Mengambil data karya seni" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full">
        {/* Header Section - Consistent with Contacts */}
        <div className="relative mb-6">
          {/* Decorative gradient */}
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-2 right-20 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl" />
          
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Pipeline</span>
              </div>
              <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Pipeline Karya
              </h1>
              <p className="text-muted-foreground mt-1 max-w-md">
                {totalItems} karya dalam pipeline. Kelola alur kerja karya seni Anda.
              </p>
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
                size="lg"
                className={cn(
                  "gap-2 shadow-glow hover:shadow-lg transition-all duration-300 group",
                  isMobile && "flex-1"
                )}
                onClick={() => handleOpenAddDialogForColumn("concept")}
              >
                <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                Tambah Karya
              </Button>
            </div>
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
