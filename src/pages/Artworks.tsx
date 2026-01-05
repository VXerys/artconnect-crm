import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Palette, Sparkles } from "lucide-react";
import PageLoading from "@/components/ui/PageLoading";

// Artworks Components
import {
  AddArtworkDialog,
  EditArtworkDialog,
  ViewArtworkDialog,
  DeleteArtworkDialog,
  ArtworkFilters,
  ArtworkGrid,
  ArtworkList,
  useArtworks,
  formatCurrency,
} from "@/components/artworks";

const Artworks = () => {
  // Use the custom hook for all artworks logic
  const {
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
    isAddDialogOpen,
    isViewDialogOpen,
    isEditDialogOpen,
    isDeleteDialogOpen,
    setView,
    setFilter,
    setIsAddDialogOpen,
    handleInputChange,
    handleImageUpload,
    handleImageUrlChange,
    removeImagePreview,
    handleAddSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
    openViewDialog,
    openEditDialog,
    openDeleteDialog,
    handleViewToEdit,
    handleAddDialogClose,
    handleViewDialogClose,
    handleEditDialogClose,
    handleDeleteDialogClose,
    loading,
  } = useArtworks();

  // Loading Screen
  if (loading) {
    return (
      <DashboardLayout>
        <PageLoading title="Memuat koleksi karya..." subtitle="Mengambil data inventaris" />
      </DashboardLayout>
    );
  }

  // Calculate stats
  const totalValue = artworks
    .filter(a => a.price)
    .reduce((sum, a) => sum + (a.price || 0), 0);
  
  const soldCount = artworks.filter(a => a.status === 'sold').length;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header Section - Consistent with Contacts */}
        <div className="relative">
          {/* Decorative gradient */}
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-2 right-20 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
          
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary uppercase tracking-wider">Inventaris</span>
              </div>
              <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Karya Seni
              </h1>
              <p className="text-muted-foreground mt-1 max-w-md">
                Kelola koleksi karya seni Anda dengan mudah. Tambah, edit, dan pantau status setiap karya.
              </p>
            </div>
            
            <Button 
              variant="default" 
              size="lg"
              className="gap-2 shadow-glow hover:shadow-lg transition-all duration-300 group"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Tambah Karya
              <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </div>

        {/* Filters Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Filter & Tampilan
            </h2>
          </div>
          <ArtworkFilters
            filter={filter}
            view={view}
            artworks={artworks}
            onFilterChange={setFilter}
            onViewChange={setView}
          />
        </section>

        {/* Artworks Grid/List */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Koleksi Karya
            </h2>
          </div>
          
          {view === 'grid' ? (
            <ArtworkGrid 
              artworks={filteredArtworks}
              onView={openViewDialog}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          ) : (
            <ArtworkList 
              artworks={filteredArtworks}
              onView={openViewDialog}
              onEdit={openEditDialog}
              onDelete={openDeleteDialog}
            />
          )}
        </section>

        {/* Add Artwork Dialog */}
        <AddArtworkDialog
          isOpen={isAddDialogOpen}
          onOpenChange={handleAddDialogClose}
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          imagePreview={imagePreview}
          fileInputRef={fileInputRef}
          onInputChange={handleInputChange}
          onImageUpload={handleImageUpload}
          onImageUrlChange={handleImageUrlChange}
          onRemoveImagePreview={removeImagePreview}
          onSubmit={handleAddSubmit}
        />

        {/* View Artwork Dialog */}
        <ViewArtworkDialog
          isOpen={isViewDialogOpen}
          onOpenChange={handleViewDialogClose}
          artwork={selectedArtwork}
          onEdit={handleViewToEdit}
        />

        {/* Edit Artwork Dialog */}
        <EditArtworkDialog
          isOpen={isEditDialogOpen}
          onOpenChange={handleEditDialogClose}
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSubmit={handleEditSubmit}
        />

        {/* Delete Artwork Dialog */}
        <DeleteArtworkDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={handleDeleteDialogClose}
          artwork={selectedArtwork}
          onConfirm={handleDeleteConfirm}
        />
      </div>
    </DashboardLayout>
  );
};

export default Artworks;
