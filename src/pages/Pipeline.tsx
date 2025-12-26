import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

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
  // Use the custom hook for all pipeline logic
  const {
    pipelineData,
    activeItem,
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
  } = usePipeline();

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Pipeline Karya</h1>
            <p className="text-muted-foreground">Visualisasi siklus hidup karya seni Anda</p>
          </div>
          
          <Button 
            variant="default" 
            className="gap-2 shadow-glow hover:shadow-lg transition-all duration-300"
            onClick={() => handleOpenAddDialogForColumn("concept")}
          >
            <Plus className="w-4 h-4" />
            Tambah Karya
          </Button>
        </div>

        {/* Kanban Board with DnD */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0">
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

          <DragOverlay>
            {activeItem ? <DragOverlayItem item={activeItem} /> : null}
          </DragOverlay>
        </DndContext>

        {/* Summary Section */}
        <PipelineSummary pipelineData={pipelineData} />

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
