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
import type { ArtworkStatus, Artwork } from "@/lib/database.types";

export const usePipeline = () => {
  const { user, profile } = useAuth();
  const userId = profile?.id || null;
  const [pipelineData, setPipelineData] = useState<PipelineData>(getEmptyPipelineData());
  const [loading, setLoading] = useState(true);
  const [activeItem, setActiveItem] = useState<PipelineItem | null>(null);
  const [dragStartColumn, setDragStartColumn] = useState<PipelineStatus | null>(null); // Track original column
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PipelineItem | null>(null);
  const [formData, setFormData] = useState<PipelineFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<PipelineFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch pipeline data directly from artworks table
  const fetchPipeline = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Fetch all artworks and group by status (limit 50 for performance)
      const result = await artworksService.getAll(userId, {}, { limit: 50 });
      const artworks = result.data;
      
      // Group artworks by status
      const groupedArtworks: Record<ArtworkStatus, typeof artworks> = {
        concept: [],
        wip: [],
        finished: [],
        sold: [],
      };
      
      artworks.forEach(artwork => {
        if (groupedArtworks[artwork.status]) {
          groupedArtworks[artwork.status].push(artwork);
        }
      });
      
      // Map to PipelineData structure
      const mappedData: PipelineData = {
        concept: {
          title: "Konsep",
          color: "border-purple-500",
          bgColor: "bg-purple-500/10",
          textColor: "text-purple-400",
          items: groupedArtworks.concept.map(mapArtworkToPipelineItem),
        },
        wip: {
          title: "Proses",
          color: "border-blue-500",
          bgColor: "bg-blue-500/10",
          textColor: "text-blue-400",
          items: groupedArtworks.wip.map(mapArtworkToPipelineItem),
        },
        finished: {
          title: "Selesai",
          color: "border-emerald-500",
          bgColor: "bg-emerald-500/10",
          textColor: "text-emerald-400",
          items: groupedArtworks.finished.map(mapArtworkToPipelineItem),
        },
        sold: {
          title: "Terjual",
          color: "border-primary",
          bgColor: "bg-primary/10",
          textColor: "text-primary",
          items: groupedArtworks.sold.map(mapArtworkToPipelineItem),
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

  // Initial fetch - optimized
  useEffect(() => {
    if (userId) {
      fetchPipeline();
    } else {
      setLoading(false);
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
        setDragStartColumn(columnKey); // Save the original column
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
    const originalColumn = dragStartColumn; // Use saved original column
    const draggedItem = activeItem; // Save reference before clearing
    
    setActiveItem(null);
    setDragStartColumn(null); // Clear the saved column

    if (!over || !userId) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Get dbId from the dragged item
    const dbId = draggedItem ? (draggedItem as any).dbId : null;

    // Determine the target column (where the item is dropped)
    let targetColumn = findColumnByItemId(activeId); // Item is already moved by dragOver
    if (!targetColumn && Object.keys(pipelineData).includes(overId)) {
      targetColumn = overId as PipelineStatus;
    }

    if (!targetColumn) return;

    // Handle reorder within same column
    if (originalColumn && originalColumn === targetColumn && activeId !== overId) {
      setPipelineData(prev => {
        const items = [...prev[targetColumn!].items];
        const oldIndex = items.findIndex(item => item.id === activeId);
        const newIndex = items.findIndex(item => item.id === overId);

        if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
          return {
            ...prev,
            [targetColumn!]: {
              ...prev[targetColumn!],
              items: arrayMove(items, oldIndex, newIndex),
            },
          };
        }
        return prev;
      });
    }

    // Save to database if column changed - update artwork status directly
    if (dbId && originalColumn && targetColumn !== originalColumn) {
      try {
        console.log('Updating artwork status:', dbId, 'from', originalColumn, 'to', targetColumn);
        await artworksService.updateStatus(dbId, targetColumn);
        toast.success(`Karya dipindahkan ke ${pipelineData[targetColumn].title}`);
        console.log('Artwork status updated successfully!');
      } catch (error) {
        console.error('Error updating artwork status:', error);
        toast.error('Gagal memperbarui status karya');
        // Revert on error by refetching
        await fetchPipeline();
      }
    }
  }, [findColumnByItemId, pipelineData, userId, fetchPipeline, dragStartColumn, activeItem]);

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

    // Update artwork status in database
    try {
      const dbId = (item as any).dbId;
      if (dbId) {
        await artworksService.updateStatus(dbId, targetStatus);
      }
    } catch (error) {
      console.error('Error updating artwork status:', error);
      toast.error('Gagal memperbarui status karya');
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

  // Add item - creates a new artwork
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

      // Create artwork with the specified status
      await artworksService.create({
        user_id: userId,
        title: formData.title,
        medium: formData.medium,
        dimensions: '', // Default empty
        price: priceValue,
        description: formData.description || null,
        status: formData.status as ArtworkStatus,
        image_url: formData.image || null,
        year: new Date().getFullYear(),
      });

      await fetchPipeline();
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Karya berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding artwork:', error);
      toast.error('Gagal menambahkan karya');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, userId, validateForm, resetForm, fetchPipeline]);

  // Edit item - updates the artwork
  const handleEditItem = useCallback(async () => {
    if (!validateForm() || !selectedItem || !userId) return;
    setIsSubmitting(true);

    try {
      const priceValue = formData.price 
        ? parseInt(formData.price.replace(/\D/g, '')) 
        : null;

      const dbId = (selectedItem as any).dbId;
      if (dbId) {
        await artworksService.update(dbId, {
          title: formData.title,
          medium: formData.medium,
          price: priceValue,
          description: formData.description || null,
          status: formData.status as ArtworkStatus,
          image_url: formData.image || null,
        });
      }

      await fetchPipeline();
      setIsEditDialogOpen(false);
      resetForm();
      toast.success('Karya berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating artwork:', error);
      toast.error('Gagal memperbarui karya');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedItem, userId, validateForm, resetForm, fetchPipeline]);

  // Delete item - deletes the artwork
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

    // Delete artwork from database
    try {
      const dbId = (item as any).dbId;
      if (dbId) {
        await artworksService.delete(dbId);
      }
      toast.success('Karya berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast.error('Gagal menghapus karya');
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

// Helper function to map artwork to pipeline item
function mapArtworkToPipelineItem(artwork: Artwork): PipelineItem {
  return {
    id: artwork.id,
    title: artwork.title,
    medium: artwork.medium || '',
    dueDate: '', // Artworks don't have due_date
    price: artwork.price 
      ? `Rp ${new Intl.NumberFormat('id-ID').format(artwork.price)}`
      : undefined,
    image: artwork.image_url || undefined,
    description: artwork.description || undefined,
    dbId: artwork.id, // Keep for database operations (this is the artwork ID)
  };
}
