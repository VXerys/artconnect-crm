import { useState, useCallback, useMemo, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { contactsService } from "@/lib/services/contacts.service";
import { activityService } from "@/lib/services/activity.service";
import { notificationsService } from "@/lib/services/notifications.service";
import { Contact, ContactFormData, ContactFormErrors, ContactType, ContactsByType } from "./types";
import { initialFormData, isValidEmail, isValidPhone } from "./constants";
import { toast } from "sonner";

export const useContacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>(initialFormData);
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch contacts from Supabase
  const fetchContacts = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const result = await contactsService.getAll(user.id, {}, { limit: 100 });
      
      // Map database contacts to local Contact type
      const mappedContacts: Contact[] = result.data.map(dbContact => ({
        id: dbContact.id as unknown as number,
        name: dbContact.name,
        type: (dbContact.type || 'collector') as ContactType,
        email: dbContact.email || '',
        phone: dbContact.phone || '',
        location: dbContact.location || '',
        rating: dbContact.rating || 5,
        lastContact: formatLastContact(dbContact.last_contact_at || dbContact.created_at),
        notes: dbContact.notes || undefined,
        website: dbContact.website || undefined,
        address: dbContact.address || undefined,
        dbId: dbContact.id, // Keep original string ID for database operations
      }));
      
      setContacts(mappedContacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Gagal memuat kontak');
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Initial fetch
  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Filtered contacts
  const filteredContacts = useMemo(() => {
    return contacts.filter(contact => {
      const matchesFilter = filter === 'all' || contact.type === filter;
      const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           contact.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [contacts, filter, searchQuery]);

  // Contacts count by type
  const contactsByType: ContactsByType = useMemo(() => ({
    all: contacts.length,
    gallery: contacts.filter(c => c.type === 'gallery').length,
    collector: contacts.filter(c => c.type === 'collector').length,
    museum: contacts.filter(c => c.type === 'museum').length,
    curator: contacts.filter(c => c.type === 'curator').length,
  }), [contacts]);

  // Handle form input changes
  const handleInputChange = useCallback((field: keyof ContactFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof ContactFormErrors]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [formErrors]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const errors: ContactFormErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Nama wajib diisi";
    }

    if (!formData.type) {
      errors.type = "Tipe wajib dipilih";
    }

    if (!formData.email.trim()) {
      errors.email = "Email wajib diisi";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Format email tidak valid";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Telepon wajib diisi";
    } else if (!isValidPhone(formData.phone)) {
      errors.phone = "Format telepon tidak valid";
    }

    if (!formData.location) {
      errors.location = "Lokasi wajib dipilih";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setFormErrors({});
    setSelectedContact(null);
  }, []);

  // Add contact
  const handleAddContact = useCallback(async () => {
    if (!validateForm() || !user?.id) return;

    setIsSubmitting(true);

    try {
      const newContact = await contactsService.create({
        user_id: user.id,
        name: formData.name,
        type: formData.type as ContactType,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        rating: formData.rating,
        notes: formData.notes || null,
        website: formData.website || null,
        address: formData.address || null,
      });

      // Log activity and create notification
      try {
        await activityService.logContactAdded(user.id, newContact.id, newContact.name);
        await notificationsService.notifyNewContact(user.id, newContact.name, newContact.id);
      } catch (e) {
        console.warn('Could not log activity or notification:', e);
      }

      // Refresh the list
      await fetchContacts();
      
      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Kontak berhasil ditambahkan!');
    } catch (error) {
      console.error('Error adding contact:', error);
      toast.error('Gagal menambahkan kontak');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, user?.id, validateForm, resetForm, fetchContacts]);

  // Edit contact
  const handleEditContact = useCallback(async () => {
    if (!validateForm() || !selectedContact || !user?.id) return;

    setIsSubmitting(true);

    try {
      const dbId = (selectedContact as any).dbId || selectedContact.id.toString();

      await contactsService.update(dbId, {
        name: formData.name,
        type: formData.type as ContactType,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        rating: formData.rating,
        notes: formData.notes || null,
        website: formData.website || null,
        address: formData.address || null,
      });

      // Refresh the list
      await fetchContacts();
      
      setIsEditDialogOpen(false);
      resetForm();
      toast.success('Kontak berhasil diperbarui!');
    } catch (error) {
      console.error('Error updating contact:', error);
      toast.error('Gagal memperbarui kontak');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedContact, user?.id, validateForm, resetForm, fetchContacts]);

  // Delete contact
  const handleDeleteContact = useCallback(async () => {
    if (!selectedContact) return;

    try {
      const dbId = (selectedContact as any).dbId || selectedContact.id.toString();
      await contactsService.delete(dbId);

      // Refresh the list
      await fetchContacts();
      
      setIsDeleteDialogOpen(false);
      setSelectedContact(null);
      toast.success('Kontak berhasil dihapus!');
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('Gagal menghapus kontak');
    }
  }, [selectedContact, fetchContacts]);

  // Open view dialog
  const openViewDialog = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setIsViewDialogOpen(true);
  }, []);

  // Open edit dialog
  const openEditDialog = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setFormData({
      name: contact.name,
      type: contact.type,
      email: contact.email,
      phone: contact.phone,
      location: contact.location,
      rating: contact.rating,
      notes: contact.notes || "",
      website: contact.website || "",
      address: contact.address || "",
    });
    setIsEditDialogOpen(true);
  }, []);

  // Open delete dialog
  const openDeleteDialog = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setIsDeleteDialogOpen(true);
  }, []);

  // View to edit transition
  const handleViewToEdit = useCallback(() => {
    setIsViewDialogOpen(false);
    if (selectedContact) openEditDialog(selectedContact);
  }, [selectedContact, openEditDialog]);

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
    if (!open) setSelectedContact(null);
    setIsViewDialogOpen(open);
  }, []);

  const handleDeleteDialogClose = useCallback((open: boolean) => {
    if (!open) setSelectedContact(null);
    setIsDeleteDialogOpen(open);
  }, []);

  return {
    // State
    contacts,
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

    // Actions
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

    // Dialog handlers
    handleAddDialogClose,
    handleEditDialogClose,
    handleViewDialogClose,
    handleDeleteDialogClose,

    // Refresh function
    refreshContacts: fetchContacts,
  };
};

// Helper function
function formatLastContact(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 14) return '1 minggu lalu';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  if (diffDays < 60) return '1 bulan lalu';
  return `${Math.floor(diffDays / 30)} bulan lalu`;
}
