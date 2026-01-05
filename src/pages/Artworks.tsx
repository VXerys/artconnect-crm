import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Palette, Sparkles, Image, TrendingUp } from "lucide-react";
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
        {/* Hero Header Section */}
        <div className="relative overflow-hidden">
          {/* Decorative backgrounds */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-5 right-10 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl" />
          <div className="absolute top-10 right-40 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl" />
          
          <div className="relative">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              {/* Left side - Title & Description */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
                    <Palette className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider">Inventaris</span>
                  </div>
                </div>
                
                <div>
                  <h1 className="font-display text-4xl lg:text-5xl font-bold">
                    Karya Seni
                  </h1>
                  <p className="text-muted-foreground mt-2 max-w-lg">
                    Kelola koleksi karya seni Anda dengan mudah. Tambah, edit, dan pantau status dari setiap karya.
                  </p>
                </div>

                {/* Quick Stats */}
                <div className="flex items-center gap-6 pt-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-secondary/50">
                      <Image className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{artworks.length}</p>
                      <p className="text-xs text-muted-foreground">Total Karya</p>
                    </div>
                  </div>
                  
                  <div className="w-px h-10 bg-border" />
                  
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-emerald-400">{soldCount}</p>
                      <p className="text-xs text-muted-foreground">Terjual</p>
                    </div>
                  </div>
                  
                  <div className="w-px h-10 bg-border hidden sm:block" />
                  
                  <div className="hidden sm:flex items-center gap-2">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{formatCurrency(totalValue)}</p>
                      <p className="text-xs text-muted-foreground">Estimasi Nilai</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right side - Add Button */}
              <div className="flex-shrink-0">
                <Button 
                  size="lg"
                  className="gap-2 shadow-glow hover:shadow-lg transition-all duration-300 group h-12 px-6"
                  onClick={() => setIsAddDialogOpen(true)}
                >
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span>Tambah Karya</span>
                  <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </div>
            </div>
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
