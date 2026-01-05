import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { artworksService } from "@/lib/services/artworks.service";
import { activityService } from "@/lib/services/activity.service";
import { Artwork, ArtworkFormData, ArtworkFormErrors, ViewMode, ArtworkStatus } from "./types";
import { initialFormData } from "./constants";
import { toast } from "sonner";

export const useArtworks = () => {
  const { user, getUserId, profile, profileLoading, refreshProfile } = useAuth();
  const userId = profile?.id || null;
  const [view, setView] = useState<ViewMode>('grid');
  const [filter, setFilter] = useState<string>('all');
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Dialog states
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [formData, setFormData] = useState<ArtworkFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<ArtworkFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch artworks from Supabase
  const fetchArtworks = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await artworksService.getAll(userId, {}, { limit: 50 });
      
      // Map database artworks to local Artwork type
      const mappedArtworks: Artwork[] = result.data.map(dbArtwork => ({
        id: dbArtwork.id as unknown as number,
        title: dbArtwork.title,
        medium: dbArtwork.medium || '',
        dimensions: dbArtwork.dimensions || '',
        status: dbArtwork.status,
        price: dbArtwork.price || null,
        year: dbArtwork.year || new Date().getFullYear(),
        image: dbArtwork.image_url || "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400",
        description: dbArtwork.description || '',
        dbId: dbArtwork.id, // Keep original string ID for database operations
      }));
      
      setArtworks(mappedArtworks);
    } catch (error) {
      console.error('Error fetching artworks:', error);
      toast.error('Gagal memuat karya seni');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // Initial fetch - wait for profile to be loaded
  useEffect(() => {
    // Still loading profile, wait
    if (profileLoading) {
      return;
    }
    
    if (userId) {
      fetchArtworks();
    } else {
      // Profile loaded but no userId - user might not have profile yet
      setLoading(false);
    }
  }, [fetchArtworks, userId, profileLoading]);

  // Filtered artworks
  const filteredArtworks = useMemo(() => {
    return filter === 'all' 
      ? artworks 
      : artworks.filter(a => a.status === filter);
  }, [artworks, filter]);

  // Handle form input changes
  const handleInputChange = useCallback((field: keyof ArtworkFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof ArtworkFormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]);

  // Handle image upload
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setFormErrors(prev => ({ ...prev, image: "File harus berupa gambar" }));
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setFormErrors(prev => ({ ...prev, image: "Ukuran gambar maksimal 5MB" }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImagePreview(result);
        setFormData(prev => ({ ...prev, image: result }));
        setFormErrors(prev => ({ ...prev, image: undefined }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Handle image URL input
  const handleImageUrlChange = useCallback((url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
    if (url) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
    setFormErrors(prev => ({ ...prev, image: undefined }));
  }, []);

  // Remove image preview
  const removeImagePreview = useCallback(() => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, image: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors: ArtworkFormErrors = {};

    if (!formData.title.trim()) {
      errors.title = "Judul karya wajib diisi";
    }

    if (!formData.medium) {
      errors.medium = "Medium wajib dipilih";
    }

    if (!formData.dimensions.trim()) {
      errors.dimensions = "Dimensi wajib diisi";
    }

    if (!formData.status) {
      errors.status = "Status wajib dipilih";
    }

    const year = typeof formData.year === 'string' ? parseInt(formData.year) : formData.year;
    if (!year || isNaN(year) || year < 1900 || year > new Date().getFullYear()) {
      errors.year = "Tahun tidak valid";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFormErrors({});
    setImagePreview(null);
    setSelectedArtwork(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  // Handle Add artwork submit
  const handleAddSubmit = useCallback(async () => {
    // Wait for profile if still loading
    if (profileLoading) {
      toast.info('Menunggu sesi siap...');
      return;
    }
    
    if (!validateForm()) return;
    
    // Check if user exists but profile is missing - try to refresh
    if (!userId && user) {
      toast.info('Memperbarui profil...');
      // Profile might not be ready, try refreshing
      await refreshProfile();
      // Give a moment for state to update
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Re-check userId after potential refresh
    const currentUserId = profile?.id;
    if (!currentUserId) {
      toast.error('Profil tidak ditemukan. Silakan logout dan login kembali.');
      return;
    }

    setIsSubmitting(true);

    try {
      const priceValue = typeof formData.price === 'string' 
        ? parseInt(formData.price.replace(/\D/g, '')) 
        : formData.price;
      const yearValue = typeof formData.year === 'string' 
        ? parseInt(formData.year) 
        : formData.year;

      const newArtwork = await artworksService.create({
        user_id: currentUserId,
        title: formData.title,
        medium: formData.medium,
        dimensions: formData.dimensions,
        status: formData.status as ArtworkStatus,
        price: priceValue || null,
        year: yearValue,
        image_url: formData.image || null,
        description: formData.description || null,
      });

      // Log activity
      try {
        await activityService.logArtworkCreated(currentUserId, newArtwork.id, newArtwork.title);
      } catch (e) {
        console.warn('Could not log activity:', e);
      }

      // Refresh the list
      await fetchArtworks();
      
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Karya seni berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding artwork:', error);
      toast.error('Gagal menambahkan karya seni');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, userId, validateForm, resetForm, fetchArtworks, profileLoading, user, profile, refreshProfile]);

  // Handle Edit artwork submit
  const handleEditSubmit = useCallback(async () => {
    if (!validateForm() || !selectedArtwork || !userId) return;

    setIsSubmitting(true);

    try {
      const priceValue = typeof formData.price === 'string' 
        ? parseInt(formData.price.replace(/\D/g, '')) 
        : formData.price;
      const yearValue = typeof formData.year === 'string' 
        ? parseInt(formData.year) 
        : formData.year;

      const dbId = (selectedArtwork as any).dbId || selectedArtwork.id.toString();

      await artworksService.update(dbId, {
        title: formData.title,
        medium: formData.medium,
        dimensions: formData.dimensions,
        status: formData.status as ArtworkStatus,
        price: priceValue || null,
        year: yearValue,
        image_url: formData.image || null,
        description: formData.description || null,
      });

      // Log activity
      try {
        await activityService.logArtworkUpdated(userId, dbId, formData.title);
      } catch (e) {
        console.warn('Could not log activity:', e);
      }

      // Refresh the list
      await fetchArtworks();
      
      setIsEditDialogOpen(false);
      resetForm();
      toast.success('Karya seni berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating artwork:', error);
      toast.error('Gagal memperbarui karya seni');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedArtwork, userId, validateForm, resetForm, fetchArtworks]);

  // Handle Delete artwork
  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedArtwork) return;

    try {
      const dbId = (selectedArtwork as any).dbId || selectedArtwork.id.toString();
      
      // Delete the artwork
      await artworksService.delete(dbId);

      // Refresh the list
      await fetchArtworks();
      
      setIsDeleteDialogOpen(false);
      setSelectedArtwork(null);
      toast.success('Karya seni berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting artwork:', error);
      toast.error('Gagal menghapus karya seni');
    }
  }, [selectedArtwork, fetchArtworks]);

  // Open View dialog
  const openViewDialog = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsViewDialogOpen(true);
  }, []);

  // Open Edit dialog
  const openEditDialog = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setFormData({
      title: artwork.title,
      medium: artwork.medium,
      dimensions: artwork.dimensions,
      status: artwork.status,
      price: artwork.price?.toString() || "",
      year: artwork.year.toString(),
      image: artwork.image,
      description: artwork.description || "",
    });
    setImagePreview(artwork.image);
    setIsEditDialogOpen(true);
  }, []);

  // Open Delete dialog
  const openDeleteDialog = useCallback((artwork: Artwork) => {
    setSelectedArtwork(artwork);
    setIsDeleteDialogOpen(true);
  }, []);

  // View to Edit transition
  const handleViewToEdit = useCallback(() => {
    setIsViewDialogOpen(false);
    if (selectedArtwork) {
      openEditDialog(selectedArtwork);
    }
  }, [selectedArtwork, openEditDialog]);

  // Dialog close handlers
  const handleAddDialogClose = useCallback((open: boolean) => {
    if (!open) resetForm();
    setIsAddDialogOpen(open);
  }, [resetForm]);

  const handleViewDialogClose = useCallback((open: boolean) => {
    if (!open) setSelectedArtwork(null);
    setIsViewDialogOpen(open);
  }, []);

  const handleEditDialogClose = useCallback((open: boolean) => {
    if (!open) resetForm();
    setIsEditDialogOpen(open);
  }, [resetForm]);

  const handleDeleteDialogClose = useCallback((open: boolean) => {
    if (!open) setSelectedArtwork(null);
    setIsDeleteDialogOpen(open);
  }, []);

  return {
    // State
    view,
    filter,
    artworks,
    filteredArtworks,
    selectedArtwork,
    formData,
    formErrors,
    isSubmitting,
    imagePreview,
    fileInputRef,
    loading,
    
    // Dialog states
    isAddDialogOpen,
    isViewDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    
    // Actions
    setView,
    setFilter,
    setIsAddDialogOpen,
    handleInputChange,
    handleImageUpload,
    handleImageUrlChange,
    removeImagePreview,
    
    // CRUD operations
    handleAddSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
    openViewDialog,
    openEditDialog,
    openDeleteDialog,
    handleViewToEdit,
    
    // Dialog close handlers
    handleAddDialogClose,
    handleViewDialogClose,
    handleEditDialogClose,
    handleDeleteDialogClose,

    // Legacy compatibility (for AddArtworkDialog)
    isDialogOpen: isAddDialogOpen,
    handleDialogClose: handleAddDialogClose,
    handleSubmit: handleAddSubmit,

    // Refresh function
    refreshArtworks: fetchArtworks,
  };
};
