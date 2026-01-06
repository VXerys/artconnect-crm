import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import PageLoading from "@/components/ui/PageLoading";

// Dashboard Components
import {
  DashboardHero,
  StatsGrid,
  RecentArtworks,
  RecentContacts,
  ActivityFeed,
  QuickActions,
  SalesChart,
  ArtworkStatusSummary,
  quickActions,
} from "@/components/dashboard";

// Dialog Components
import { AddArtworkDialog } from "@/components/artworks/AddArtworkDialog";
import { AddContactDialog } from "@/components/contacts/AddContactDialog";

// Hooks for dialog state management
import { useArtworks } from "@/components/artworks/useArtworks";
import { useContacts } from "@/components/contacts/useContacts";


const Dashboard = () => {
  const navigate = useNavigate();
  
  const {
    userName,
    stats,
    recentArtworks,
    recentContacts,
    recentActivities,
    salesChartData,
    artworkStatusCounts,
    totalArtworks,
    totalSales,
    loading,
    error,
  } = useDashboardData();

  // Artwork dialog state from hook
  const {
    isAddDialogOpen: isAddArtworkDialogOpen,
    handleAddDialogClose: handleAddArtworkDialogClose,
    formData: artworkFormData,
    formErrors: artworkFormErrors,
    isSubmitting: isArtworkSubmitting,
    imagePreview: artworkImagePreview,
    fileInputRef: artworkFileInputRef,
    handleInputChange: handleArtworkInputChange,
    handleImageUpload: handleArtworkImageUpload,
    handleImageUrlChange: handleArtworkImageUrlChange,
    removeImagePreview: removeArtworkImagePreview,
    handleAddSubmit: handleArtworkSubmit,
    setIsAddDialogOpen: setIsAddArtworkDialogOpen,
  } = useArtworks();

  // Contact dialog state from hook
  const {
    isAddDialogOpen: isAddContactDialogOpen,
    handleAddDialogClose: handleAddContactDialogClose,
    formData: contactFormData,
    formErrors: contactFormErrors,
    isSubmitting: isContactSubmitting,
    handleInputChange: handleContactInputChange,
    handleAddContact: handleContactSubmit,
    setIsAddDialogOpen: setIsAddContactDialogOpen,
  } = useContacts();

  // Quick action handlers - memoized for performance
  const handleOpenAddArtworkDialog = useCallback((): void => {
    setIsAddArtworkDialogOpen(true);
  }, [setIsAddArtworkDialogOpen]);

  const handleOpenAddContactDialog = useCallback((): void => {
    setIsAddContactDialogOpen(true);
  }, [setIsAddContactDialogOpen]);

  // Handler to view artwork details - navigates to artworks page
  const handleViewArtwork = useCallback((artworkId: number): void => {
    // Navigate to artworks page - could optionally open a dialog or specific artwork
    navigate('/artworks');
  }, [navigate]);

  // Handler to view contact details - navigates to contacts page
  const handleViewContact = useCallback((contactId: number): void => {
    // Navigate to contacts page - could optionally open a dialog or specific contact
    navigate('/contacts');
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <PageLoading title="Memuat dashboard..." subtitle="Mengambil data terbaru" />
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-primary hover:underline"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Hero Section */}
        <DashboardHero 
          userName={userName}
          totalArtworks={totalArtworks}
          totalSales={totalSales}
        />

        {/* Stats Grid */}
        <section>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
            <div className="w-0.5 sm:w-1 h-3 sm:h-3.5 md:h-4 bg-primary rounded-full" />
            <h2 className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Statistik Utama
            </h2>
          </div>
          <StatsGrid stats={stats} />
        </section>

        {/* Recent Artworks - Full width */}
        <section>
          <RecentArtworks 
            artworks={recentArtworks} 
            onViewArtwork={handleViewArtwork}
          />
        </section>

        {/* Artwork Status Summary - Full width */}
        <section>
          <ArtworkStatusSummary 
            statusCounts={artworkStatusCounts}
            totalArtworks={totalArtworks}
          />
        </section>

        {/* Sales Chart & Recent Contacts - Side by Side with Equal Heights */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-5 md:gap-6 items-stretch">
          {/* Sales Chart - Takes 3 columns */}
          <div className="lg:col-span-3 flex">
            <SalesChart data={salesChartData} />
          </div>

          {/* Recent Contacts - Takes 2 columns */}
          <div className="lg:col-span-2 flex">
            <RecentContacts 
              contacts={recentContacts} 
              onViewContact={handleViewContact}
            />
          </div>
        </div>

        {/* Activity Feed */}
        <section>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
            <div className="w-0.5 sm:w-1 h-3 sm:h-3.5 md:h-4 bg-amber-400 rounded-full" />
            <h2 className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Aktivitas Terkini
            </h2>
          </div>
          <ActivityFeed activities={recentActivities} />
        </section>

        {/* Quick Actions */}
        <section>
          <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-2.5 md:mb-3 lg:mb-4">
            <div className="w-0.5 sm:w-1 h-3 sm:h-3.5 md:h-4 bg-primary rounded-full" />
            <h2 className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Aksi Cepat
            </h2>
          </div>
          <QuickActions 
            actions={quickActions}
            onAddArtwork={handleOpenAddArtworkDialog}
            onAddContact={handleOpenAddContactDialog}
          />
        </section>
      </div>

      {/* Add Artwork Dialog */}
      <AddArtworkDialog
        isOpen={isAddArtworkDialogOpen}
        onOpenChange={handleAddArtworkDialogClose}
        formData={artworkFormData}
        formErrors={artworkFormErrors}
        isSubmitting={isArtworkSubmitting}
        imagePreview={artworkImagePreview}
        fileInputRef={artworkFileInputRef}
        onInputChange={handleArtworkInputChange}
        onImageUpload={handleArtworkImageUpload}
        onImageUrlChange={handleArtworkImageUrlChange}
        onRemoveImagePreview={removeArtworkImagePreview}
        onSubmit={handleArtworkSubmit}
      />

      {/* Add Contact Dialog */}
      <AddContactDialog
        isOpen={isAddContactDialogOpen}
        onOpenChange={handleAddContactDialogClose}
        formData={contactFormData}
        formErrors={contactFormErrors}
        isSubmitting={isContactSubmitting}
        onInputChange={handleContactInputChange}
        onSubmit={handleContactSubmit}
      />
    </DashboardLayout>
  );
};

export default Dashboard;

