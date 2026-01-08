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
        <PageLoading />
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
      <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section - Consistent with Contacts */}
        <div className="relative">
          {/* Decorative gradient */}
          <div className="absolute -top-4 -left-4 w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-2 right-16 sm:right-20 w-16 h-16 sm:w-20 sm:h-20 bg-purple-500/10 rounded-full blur-2xl" />
          
          <div className="relative flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <div className="p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-primary/10">
                    <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium text-primary uppercase tracking-wider">Karya Seni</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text leading-tight">
                  Inventaris Karya Seni
                </h1>
                <p className="text-muted-foreground text-xs sm:text-sm md:text-base mt-0.5 sm:mt-1 max-w-md leading-relaxed">
                  Kelola koleksi karya seni Anda.
                </p>
              </div>
              
              <Button 
                variant="default" 
                size="lg"
                className="gap-1.5 sm:gap-2 shadow-glow hover:shadow-lg transition-all duration-300 group h-9 sm:h-10 md:h-11 lg:h-12 text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6 w-full sm:w-auto"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 group-hover:rotate-90 transition-transform duration-300 flex-shrink-0" />
                <span className="font-medium">Tambah Karya</span>
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Button>
            </div>
          </div>
        </div>

        {/* Filters Section */}
        <section>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
            <div className="w-0.5 sm:w-1 h-3 sm:h-3.5 md:h-4 bg-primary rounded-full" />
            <h2 className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
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
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
            <div className="w-0.5 sm:w-1 h-3 sm:h-3.5 md:h-4 bg-primary rounded-full" />
            <h2 className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
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
