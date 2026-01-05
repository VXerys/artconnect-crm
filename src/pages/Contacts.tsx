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
      <div className="space-y-8">
        {/* Header Section */}
        <div className="relative">
          {/* Decorative gradient */}
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -top-2 right-20 w-20 h-20 bg-purple-500/10 rounded-full blur-2xl" />
          
          <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl bg-primary/10">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <span className="text-xs font-medium text-primary uppercase tracking-wider">CRM</span>
              </div>
              <h1 className="font-display text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
                Jejaring Kontak
              </h1>
              <p className="text-muted-foreground mt-1 max-w-md">
                Kelola hubungan profesional dengan galeri, kolektor, museum, dan kurator seni
              </p>
            </div>
            
            <Button 
              variant="default" 
              size="lg"
              className="gap-2 shadow-glow hover:shadow-lg transition-all duration-300 group"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Tambah Kontak
              <Sparkles className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
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
        <section className="space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
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
