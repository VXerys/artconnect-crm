import { useState, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragStartEvent, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { 
  PipelineData, 
  PipelineItem, 
  PipelineStatus, 
  PipelineFormData, 
  PipelineFormErrors 
} from "./types";
import { initialPipelineData, initialFormData } from "./constants";

export const usePipeline = () => {
  const [pipelineData, setPipelineData] = useState<PipelineData>(initialPipelineData);
  const [activeItem, setActiveItem] = useState<PipelineItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PipelineItem | null>(null);
  const [formData, setFormData] = useState<PipelineFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<PipelineFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find which column an item belongs to
  const findColumnByItemId = useCallback((itemId: string): PipelineStatus | null => {
    for (const [key, column] of Object.entries(pipelineData)) {
      if (column.items.some(item => item.id === itemId)) {
        return key as PipelineStatus;
      }
    }
    return null;
  }, [pipelineData]);

  // Drag handlers
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const columnKey = findColumnByItemId(active.id as string);
    if (columnKey) {
      const item = pipelineData[columnKey].items.find(i => i.id === active.id);
      if (item) {
        setActiveItem(item);
      }
    }
  }, [findColumnByItemId, pipelineData]);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumnByItemId(activeId);
    let overColumn = findColumnByItemId(overId);

    if (!overColumn && Object.keys(pipelineData).includes(overId)) {
      overColumn = overId as PipelineStatus;
    }

    if (!activeColumn || !overColumn || activeColumn === overColumn) return;

    setPipelineData(prev => {
      const activeItems = [...prev[activeColumn].items];
      const overItems = [...prev[overColumn!].items];

      const activeIndex = activeItems.findIndex(item => item.id === activeId);
      const [movedItem] = activeItems.splice(activeIndex, 1);

      const overIndex = overItems.findIndex(item => item.id === overId);
      if (overIndex >= 0) {
        overItems.splice(overIndex, 0, movedItem);
      } else {
        overItems.push(movedItem);
      }

      return {
        ...prev,
        [activeColumn]: { ...prev[activeColumn], items: activeItems },
        [overColumn!]: { ...prev[overColumn!], items: overItems },
      };
    });
  }, [findColumnByItemId, pipelineData]);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumnByItemId(activeId);
    let overColumn = findColumnByItemId(overId);

    if (!overColumn && Object.keys(pipelineData).includes(overId)) {
      overColumn = overId as PipelineStatus;
    }

    if (!activeColumn || !overColumn) return;

    if (activeColumn === overColumn) {
      setPipelineData(prev => {
        const items = [...prev[activeColumn].items];
        const oldIndex = items.findIndex(item => item.id === activeId);
        const newIndex = items.findIndex(item => item.id === overId);

        if (oldIndex !== -1 && newIndex !== -1) {
          return {
            ...prev,
            [activeColumn]: {
              ...prev[activeColumn],
              items: arrayMove(items, oldIndex, newIndex),
            },
          };
        }
        return prev;
      });
    }
  }, [findColumnByItemId, pipelineData]);

  // Move item via menu
  const handleMoveToColumn = useCallback((item: PipelineItem, targetStatus: PipelineStatus) => {
    const currentColumn = findColumnByItemId(item.id);
    if (!currentColumn || currentColumn === targetStatus) return;

    setPipelineData(prev => {
      const sourceItems = prev[currentColumn].items.filter(i => i.id !== item.id);
      const targetItems = [...prev[targetStatus].items, item];

      return {
        ...prev,
        [currentColumn]: { ...prev[currentColumn], items: sourceItems },
        [targetStatus]: { ...prev[targetStatus], items: targetItems },
      };
    });
  }, [findColumnByItemId]);

  // Form handlers
  const handleInputChange = useCallback((field: keyof PipelineFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof PipelineFormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]);

  const validateForm = useCallback((): boolean => {
    const errors: PipelineFormErrors = {};
    if (!formData.title.trim()) errors.title = "Judul wajib diisi";
    if (!formData.medium) errors.medium = "Medium wajib dipilih";
    if (!formData.dueDate) errors.dueDate = "Target tanggal wajib diisi";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFormErrors({});
    setSelectedItem(null);
  }, []);

  const formatPriceInput = useCallback((value: string) => {
    const numericValue = value.replace(/\D/g, '');
    if (numericValue) {
      return `Rp ${new Intl.NumberFormat('id-ID').format(parseInt(numericValue))}`;
    }
    return '';
  }, []);

  // Add item
  const handleAddItem = useCallback(async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newItem: PipelineItem = {
      id: `item-${Date.now()}`,
      title: formData.title,
      medium: formData.medium,
      dueDate: formData.dueDate,
      price: formData.price || undefined,
      description: formData.description || undefined,
    };

    setPipelineData(prev => ({
      ...prev,
      [formData.status]: {
        ...prev[formData.status],
        items: [...prev[formData.status].items, newItem],
      },
    }));

    setIsSubmitting(false);
    setIsAddDialogOpen(false);
    resetForm();
  }, [formData, validateForm, resetForm]);

  // Edit item
  const handleEditItem = useCallback(async () => {
    if (!validateForm() || !selectedItem) return;
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const currentColumn = findColumnByItemId(selectedItem.id);
    if (!currentColumn) return;

    const updatedItem: PipelineItem = {
      ...selectedItem,
      title: formData.title,
      medium: formData.medium,
      dueDate: formData.dueDate,
      price: formData.price || undefined,
      description: formData.description || undefined,
    };

    if (formData.status !== currentColumn) {
      setPipelineData(prev => {
        const sourceItems = prev[currentColumn].items.filter(i => i.id !== selectedItem.id);
        const targetItems = [...prev[formData.status].items, updatedItem];
        return {
          ...prev,
          [currentColumn]: { ...prev[currentColumn], items: sourceItems },
          [formData.status]: { ...prev[formData.status], items: targetItems },
        };
      });
    } else {
      setPipelineData(prev => ({
        ...prev,
        [currentColumn]: {
          ...prev[currentColumn],
          items: prev[currentColumn].items.map(i => 
            i.id === selectedItem.id ? updatedItem : i
          ),
        },
      }));
    }

    setIsSubmitting(false);
    setIsEditDialogOpen(false);
    resetForm();
  }, [formData, selectedItem, validateForm, findColumnByItemId, resetForm]);

  // Delete item
  const handleDeleteItem = useCallback((item: PipelineItem) => {
    const column = findColumnByItemId(item.id);
    if (!column) return;

    setPipelineData(prev => ({
      ...prev,
      [column]: {
        ...prev[column],
        items: prev[column].items.filter(i => i.id !== item.id),
      },
    }));
  }, [findColumnByItemId]);

  // View item
  const handleViewItem = useCallback((item: PipelineItem) => {
    setSelectedItem(item);
    setIsViewDialogOpen(true);
  }, []);

  // Open edit dialog
  const handleOpenEditDialog = useCallback((item: PipelineItem) => {
    const column = findColumnByItemId(item.id);
    setSelectedItem(item);
    setFormData({
      title: item.title,
      medium: item.medium,
      dueDate: item.dueDate,
      price: item.price || "",
      image: item.image || "",
      description: item.description || "",
      status: column || "concept",
    });
    setIsEditDialogOpen(true);
  }, [findColumnByItemId]);

  // Open add dialog for column
  const handleOpenAddDialogForColumn = useCallback((status: PipelineStatus) => {
    setFormData({ ...initialFormData, status });
    setIsAddDialogOpen(true);
  }, []);

  // Dialog close handlers
  const handleAddDialogClose = useCallback((open: boolean) => {
    if (!open) resetForm();
    setIsAddDialogOpen(open);
  }, [resetForm]);

  const handleEditDialogClose = useCallback((open: boolean) => {
    if (!open) resetForm();
    setIsEditDialogOpen(open);
  }, [resetForm]);

  const handleViewDialogClose = useCallback((open: boolean) => {
    if (!open) setSelectedItem(null);
    setIsViewDialogOpen(open);
  }, []);

  const handleViewToEdit = useCallback(() => {
    setIsViewDialogOpen(false);
    if (selectedItem) handleOpenEditDialog(selectedItem);
  }, [selectedItem, handleOpenEditDialog]);

  return {
    // State
    pipelineData,
    activeItem,
    isAddDialogOpen,
    isViewDialogOpen,
    isEditDialogOpen,
    selectedItem,
    formData,
    formErrors,
    isSubmitting,
    
    // Drag handlers
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    
    // Actions
    handleMoveToColumn,
    handleInputChange,
    handleAddItem,
    handleEditItem,
    handleDeleteItem,
    handleViewItem,
    handleOpenEditDialog,
    handleOpenAddDialogForColumn,
    
    // Dialog handlers
    handleAddDialogClose,
    handleEditDialogClose,
    handleViewDialogClose,
    handleViewToEdit,
    
    // Utils
    formatPriceInput,
  };
};
