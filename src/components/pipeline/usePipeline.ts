import { useState, useCallback, useEffect } from "react";
import { arrayMove } from "@dnd-kit/sortable";
import { DragStartEvent, DragEndEvent, DragOverEvent } from "@dnd-kit/core";
import { useAuth } from "@/context/AuthContext";
import { pipelineService } from "@/lib/services/pipeline.service";
import { artworksService } from "@/lib/services/artworks.service";
import { 
  PipelineData, 
  PipelineItem, 
  PipelineStatus, 
  PipelineFormData, 
  PipelineFormErrors 
} from "./types";
import { initialFormData, getEmptyPipelineData } from "./constants";
import { toast } from "sonner";

export const usePipeline = () => {
  const { user, profile } = useAuth();
  const userId = profile?.id || null;
  const [pipelineData, setPipelineData] = useState<PipelineData>(getEmptyPipelineData());
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<PipelineItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PipelineItem | null>(null);
  const [formData, setFormData] = useState<PipelineFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<PipelineFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch pipeline data from Supabase
  const fetchPipeline = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await pipelineService.getPipelineData(userId);
      
      // Map database items to local PipelineItem type
      const mappedData: PipelineData = {
        concept: {
          title: "Konsep",
          color: "border-purple-500",
          bgColor: "bg-purple-500/10",
          textColor: "text-purple-400",
          items: data.concept.items.map(mapDbItemToLocal),
        },
        wip: {
          title: "Proses",
          color: "border-blue-500",
          bgColor: "bg-blue-500/10",
          textColor: "text-blue-400",
          items: data.wip.items.map(mapDbItemToLocal),
        },
        finished: {
          title: "Selesai",
          color: "border-emerald-500",
          bgColor: "bg-emerald-500/10",
          textColor: "text-emerald-400",
          items: data.finished.items.map(mapDbItemToLocal),
        },
        sold: {
          title: "Terjual",
          color: "border-primary",
          bgColor: "bg-primary/10",
          textColor: "text-primary",
          items: data.sold.items.map(mapDbItemToLocal),
        },
      };
      
      setPipelineData(mappedData);
    } catch (error) {
      console.error('Error fetching pipeline:', error);
      toast.error('Gagal memuat pipeline');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch - wait for profile to load
  useEffect(() => {
    if (userId) {
      fetchPipeline();
    }
  }, [fetchPipeline, userId]);

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

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveItem(null);

    if (!over || !userId) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Find the dbId from the item (it could be in any column now after dragOver)
    let dbId: string | null = null;
    let originalColumn: PipelineStatus | null = null;
    
    // Search for the item in all columns to find its dbId
    for (const [key, column] of Object.entries(pipelineData)) {
      const item = column.items.find(i => i.id === activeId);
      if (item && (item as any).dbId) {
        dbId = (item as any).dbId;
        originalColumn = key as PipelineStatus;
        break;
      }
    }

    // Determine the target column
    let targetColumn = findColumnByItemId(overId);
    if (!targetColumn && Object.keys(pipelineData).includes(overId)) {
      targetColumn = overId as PipelineStatus;
    }

    if (!targetColumn) return;

    // Handle reorder within same column
    const currentColumn = findColumnByItemId(activeId);
    if (currentColumn && currentColumn === targetColumn && activeId !== overId) {
      setPipelineData(prev => {
        const items = [...prev[currentColumn].items];
        const oldIndex = items.findIndex(item => item.id === activeId);
        const newIndex = items.findIndex(item => item.id === overId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          return {
            ...prev,
            [currentColumn]: {
              ...prev[currentColumn],
              items: arrayMove(items, oldIndex, newIndex),
            },
          };
        }
        return prev;
      });
    }

    // Save to database if column changed
    if (dbId && originalColumn && targetColumn !== originalColumn) {
      try {
        console.log('Saving to database:', dbId, 'to', targetColumn);
        await pipelineService.moveToStatus(dbId, targetColumn);
        
        // Also update the linked artwork status if there's an artwork_id
        const pipelineItem = await pipelineService.getById(dbId);
        if (pipelineItem?.artwork_id) {
          try {
            await artworksService.updateStatus(pipelineItem.artwork_id, targetColumn);
            console.log('Artwork status updated to:', targetColumn);
          } catch (artworkError) {
            console.warn('Could not update artwork status:', artworkError);
          }
        }
        
        console.log('Saved successfully!');
      } catch (error) {
        console.error('Error saving item position:', error);
        // Revert on error by refetching
        await fetchPipeline();
      }
    }
  }, [findColumnByItemId, pipelineData, userId, fetchPipeline]);

  // Move item via menu
  const handleMoveToColumn = useCallback(async (item: PipelineItem, targetStatus: PipelineStatus) => {
    const currentColumn = findColumnByItemId(item.id);
    if (!currentColumn || currentColumn === targetStatus) return;

    // Optimistic update
    setPipelineData(prev => {
      const sourceItems = prev[currentColumn].items.filter(i => i.id !== item.id);
      const targetItems = [...prev[targetStatus].items, item];

      return {
        ...prev,
        [currentColumn]: { ...prev[currentColumn], items: sourceItems },
        [targetStatus]: { ...prev[targetStatus], items: targetItems },
      };
    });

    // Update in database
    try {
      const dbId = (item as any).dbId;
      if (dbId) {
        await pipelineService.moveToStatus(dbId, targetStatus);
        
        // Also update the linked artwork status if there's an artwork_id
        const pipelineItem = await pipelineService.getById(dbId);
        if (pipelineItem?.artwork_id) {
          try {
            await artworksService.updateStatus(pipelineItem.artwork_id, targetStatus);
          } catch (artworkError) {
            console.warn('Could not update artwork status:', artworkError);
          }
        }
      }
    } catch (error) {
      console.error('Error moving item:', error);
      toast.error('Gagal memindahkan item');
      // Revert on error
      await fetchPipeline();
    }
  }, [findColumnByItemId, fetchPipeline]);

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
    if (!validateForm() || !userId) {
      if (!userId) toast.error('Sesi belum siap. Silakan refresh halaman.');
      return;
    }
    setIsSubmitting(true);

    try {
      const priceValue = formData.price 
        ? parseInt(formData.price.replace(/\D/g, '')) 
        : null;

      await pipelineService.create({
        user_id: userId,
        title: formData.title,
        medium: formData.medium,
        due_date: formData.dueDate,
        estimated_price: priceValue,
        description: formData.description || null,
        status: formData.status,
        image_url: formData.image || null,
      });

      await fetchPipeline();
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Item berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Gagal menambahkan item');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, userId, validateForm, resetForm, fetchPipeline]);

  // Edit item
  const handleEditItem = useCallback(async () => {
    if (!validateForm() || !selectedItem || !userId) return;
    setIsSubmitting(true);

    try {
      const currentColumn = findColumnByItemId(selectedItem.id);
      if (!currentColumn) return;

      const priceValue = formData.price 
        ? parseInt(formData.price.replace(/\D/g, '')) 
        : null;

      const dbId = (selectedItem as any).dbId;
      if (dbId) {
        await pipelineService.update(dbId, {
          title: formData.title,
          medium: formData.medium,
          due_date: formData.dueDate,
          estimated_price: priceValue,
          description: formData.description || null,
          status: formData.status,
          image_url: formData.image || null,
        });
      }

      await fetchPipeline();
      setIsEditDialogOpen(false);
      resetForm();
      toast.success('Item berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Gagal memperbarui item');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedItem, userId, validateForm, findColumnByItemId, resetForm, fetchPipeline]);

  // Delete item
  const handleDeleteItem = useCallback(async (item: PipelineItem) => {
    const column = findColumnByItemId(item.id);
    if (!column) return;

    // Optimistic update
    setPipelineData(prev => ({
      ...prev,
      [column]: {
        ...prev[column],
        items: prev[column].items.filter(i => i.id !== item.id),
      },
    }));

    // Delete from database
    try {
      const dbId = (item as any).dbId;
      if (dbId) {
        await pipelineService.delete(dbId);
      }
      toast.success('Item berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error('Gagal menghapus item');
      await fetchPipeline();
    }
  }, [findColumnByItemId, fetchPipeline]);

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
    loading,
    
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
    refreshPipeline: fetchPipeline,
  };
};

// Helper function to map database item to local type
function mapDbItemToLocal(dbItem: any): PipelineItem {
  return {
    id: dbItem.id,
    title: dbItem.title,
    medium: dbItem.medium || '',
    dueDate: dbItem.due_date || '',
    price: dbItem.estimated_price 
      ? `Rp ${new Intl.NumberFormat('id-ID').format(dbItem.estimated_price)}`
      : undefined,
    image: dbItem.image_url || undefined,
    description: dbItem.description || undefined,
    dbId: dbItem.id, // Keep for database operations
  };
}
