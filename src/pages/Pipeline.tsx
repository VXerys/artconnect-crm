import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Layers, RotateCcw, Sparkles } from "lucide-react";
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
  const { isMobile, isTablet } = useResponsive();
  
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
      <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 overflow-x-hidden">
        {/* Header Section - Fully Responsive */}
        <div className="relative">
          {/* Decorative gradient */}
          <div className="absolute -top-4 -left-4 w-20 h-20 xs:w-24 xs:h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-2 right-8 xs:right-16 sm:right-20 w-12 h-12 xs:w-16 xs:h-16 sm:w-20 sm:h-20 bg-blue-500/10 rounded-full blur-2xl" />
          
          <div className="relative flex flex-col gap-2.5 xs:gap-3 sm:gap-4">
            <div className="flex flex-col gap-2.5 xs:gap-3 sm:gap-4">
              {/* Header Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1 xs:mb-1.5 sm:mb-2">
                  <div className="p-1 xs:p-1.5 sm:p-2 rounded-md xs:rounded-lg sm:rounded-xl bg-primary/10 flex-shrink-0">
                    <Layers className="w-3.5 h-3.5 xs:w-4 xs:h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-[9px] xs:text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider">Pipeline</span>
                </div>
                <h1 className="font-display text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text leading-tight">
                  Pipeline Karya
                </h1>
                <p className="text-muted-foreground text-[11px] xs:text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1 leading-relaxed line-clamp-2 xs:line-clamp-none">
                  {totalItems} karya dalam pipeline. Kelola alur kerja karya seni Anda.
                </p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 sm:gap-2 h-8 sm:h-9 md:h-10 text-xs sm:text-sm px-2.5 sm:px-3 md:px-4"
                  onClick={refreshPipeline}
                  disabled={loading}
                >
                  <RotateCcw className={cn("w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0", loading && "animate-spin")} />
                  <span className="hidden sm:inline font-medium">Refresh</span>
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  className="gap-1.5 sm:gap-2 shadow-glow hover:shadow-lg transition-all duration-300 group h-8 sm:h-9 md:h-10 text-xs sm:text-sm px-3 sm:px-4 md:px-5"
                  onClick={() => handleOpenAddDialogForColumn("concept")}
                >
                  <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-300 flex-shrink-0" />
                  <span className="font-medium">Tambah Karya</span>
                  <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 hidden sm:block" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban Section Header */}
        <section className="overflow-hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
            <div className="w-0.5 sm:w-1 h-3 sm:h-3.5 md:h-4 bg-primary rounded-full" />
            <h2 className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Kanban Board
            </h2>
          </div>

          {/* Kanban Board with DnD */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
          >
            {/* Scrollable Kanban Container - Only this scrolls horizontally */}
            <div className={cn(
              // Base layout
              "flex gap-3 sm:gap-4 md:gap-5 py-2 sm:py-3 md:py-4",
              // Allow horizontal scroll - contained within this element
              "overflow-x-auto overflow-y-visible",
              // Scroll snap for mobile
              isMobile && "snap-x snap-mandatory",
              // Ensure columns don't shrink
              "min-w-0",
              // Scrollbar styling
              "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20",
              // Ensure shadows render above the summary
              "relative z-10",
              // Add slight padding at end for last column visibility
              "pr-2 sm:pr-4"
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
            </div>

            {/* Drag Overlay */}
            <DragOverlay dropAnimation={{
              duration: 250,
              easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            }}>
              {activeItem ? <DragOverlayItem item={activeItem} /> : null}
            </DragOverlay>
          </DndContext>
        </section>

        {/* Pipeline Summary - Always visible, separate from kanban */}
        <section className="w-full">
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
            <div className="w-0.5 sm:w-1 h-3 sm:h-3.5 md:h-4 bg-emerald-400 rounded-full" />
            <h2 className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Ringkasan
            </h2>
          </div>
          <PipelineSummary pipelineData={pipelineData} />
        </section>

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
