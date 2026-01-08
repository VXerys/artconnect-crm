import DashboardLayout from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Plus, Users, Sparkles } from "lucide-react";
import PageLoading from "@/components/ui/PageLoading";

// Contacts Components
import {
  AddContactDialog,
  EditContactDialog,
  ViewContactDialog,
  DeleteContactDialog,
  ContactStats,
  ContactSearch,
  ContactGrid,
  useContacts,
} from "@/components/contacts";

const Contacts = () => {
  // Use the custom hook for all contacts logic
  const {
    filteredContacts,
    contactsByType,
    filter,
    searchQuery,
    isAddDialogOpen,
    isEditDialogOpen,
    isViewDialogOpen,
    isDeleteDialogOpen,
    selectedContact,
    formData,
    formErrors,
    isSubmitting,
    loading,
    setFilter,
    setSearchQuery,
    setIsAddDialogOpen,
    handleInputChange,
    handleAddContact,
    handleEditContact,
    handleDeleteContact,
    openViewDialog,
    openEditDialog,
    openDeleteDialog,
    handleViewToEdit,
    handleAddDialogClose,
    handleEditDialogClose,
    handleViewDialogClose,
    handleDeleteDialogClose,
  } = useContacts();

  // Loading Screen
  if (loading) {
    return (
      <DashboardLayout>
        <PageLoading title="Memuat kontak..." subtitle="Mengambil data jejaring" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-5 md:space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Section */}
        <div className="relative overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl bg-gradient-to-br from-primary/5 via-background to-purple-500/5 border border-border p-3 sm:p-5 md:p-6 lg:p-8">
          {/* Decorative gradient */}
          <div className="absolute -top-20 -right-20 w-40 h-40 sm:w-60 sm:h-60 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 sm:w-40 sm:h-40 bg-purple-500/10 rounded-full blur-2xl" />
          
          <div className="relative z-10 flex flex-col gap-3 sm:gap-4 md:gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="space-y-2 sm:space-y-3 md:space-y-4 flex-1 min-w-0">
              <div className="inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 rounded-full bg-secondary/50 border border-border text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                <Users className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 flex-shrink-0 text-primary" />
                <span className="font-medium text-primary uppercase tracking-wider">CRM</span>
              </div>
              <div>
                <h1 className="font-display text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                  Jejaring Kontak
                </h1>
                <p className="text-muted-foreground mt-0.5 sm:mt-1 md:mt-2 text-xs sm:text-sm md:text-base lg:text-lg max-w-xl leading-relaxed">
                  Kelola hubungan profesional dengan galeri, kolektor, museum, dan kurator seni
                </p>
              </div>
            </div>
            
            <div className="w-full lg:w-auto lg:min-w-[180px] xl:min-w-[200px]">
              <Button 
                variant="default" 
                size="lg"
                className="gap-1.5 sm:gap-2 shadow-glow hover:shadow-lg transition-all duration-300 group h-9 sm:h-10 md:h-11 lg:h-12 text-[11px] sm:text-xs md:text-sm lg:text-base w-full justify-center px-3 sm:px-4"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-4.5 md:h-4.5 lg:w-5 lg:h-5 group-hover:rotate-90 transition-transform duration-300 flex-shrink-0" />
                <span className="truncate font-medium">Tambah Kontak</span>
                <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <section className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-0.5 sm:w-1 h-3 sm:h-3.5 md:h-4 bg-primary rounded-full" />
            <h2 className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Ringkasan
            </h2>
          </div>
          <ContactStats
            contactsByType={contactsByType}
            currentFilter={filter}
            onFilterChange={setFilter}
          />
        </section>

        {/* Search & Results */}
        <section className="space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-0.5 sm:w-1 h-3 sm:h-3.5 md:h-4 bg-emerald-400 rounded-full" />
            <h2 className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Daftar Kontak
            </h2>
          </div>
          
          <ContactSearch
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />

          <ContactGrid
            contacts={filteredContacts}
            onView={openViewDialog}
            onEdit={openEditDialog}
            onDelete={openDeleteDialog}
            onAddNew={() => setIsAddDialogOpen(true)}
          />
        </section>

        {/* Dialogs */}
        <AddContactDialog
          isOpen={isAddDialogOpen}
          onOpenChange={handleAddDialogClose}
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSubmit={handleAddContact}
        />

        <EditContactDialog
          isOpen={isEditDialogOpen}
          onOpenChange={handleEditDialogClose}
          formData={formData}
          formErrors={formErrors}
          isSubmitting={isSubmitting}
          onInputChange={handleInputChange}
          onSubmit={handleEditContact}
        />

        <ViewContactDialog
          isOpen={isViewDialogOpen}
          onOpenChange={handleViewDialogClose}
          contact={selectedContact}
          onEdit={handleViewToEdit}
        />

        <DeleteContactDialog
          isOpen={isDeleteDialogOpen}
          onOpenChange={handleDeleteDialogClose}
          contact={selectedContact}
          onConfirm={handleDeleteContact}
        />
      </div>
    </DashboardLayout>
  );
};

export default Contacts;
