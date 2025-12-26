import { useState, useCallback, useMemo } from "react";
import { Contact, ContactFormData, ContactFormErrors, ContactType, ContactsByType } from "./types";
import { initialContacts, initialFormData, isValidEmail, isValidPhone } from "./constants";

export const useContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
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
    if (!validateForm()) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const newContact: Contact = {
      id: Math.max(...contacts.map(c => c.id), 0) + 1,
      name: formData.name,
      type: formData.type as ContactType,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      rating: formData.rating,
      lastContact: "Baru ditambahkan",
      notes: formData.notes || undefined,
      website: formData.website || undefined,
      address: formData.address || undefined,
    };

    setContacts(prev => [newContact, ...prev]);
    setIsSubmitting(false);
    setIsAddDialogOpen(false);
    resetForm();
  }, [formData, contacts, validateForm, resetForm]);

  // Edit contact
  const handleEditContact = useCallback(async () => {
    if (!validateForm() || !selectedContact) return;

    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const updatedContact: Contact = {
      ...selectedContact,
      name: formData.name,
      type: formData.type as ContactType,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      rating: formData.rating,
      notes: formData.notes || undefined,
      website: formData.website || undefined,
      address: formData.address || undefined,
    };

    setContacts(prev => prev.map(c => c.id === selectedContact.id ? updatedContact : c));
    setIsSubmitting(false);
    setIsEditDialogOpen(false);
    resetForm();
  }, [formData, selectedContact, validateForm, resetForm]);

  // Delete contact
  const handleDeleteContact = useCallback(() => {
    if (!selectedContact) return;

    setContacts(prev => prev.filter(c => c.id !== selectedContact.id));
    setIsDeleteDialogOpen(false);
    setSelectedContact(null);
  }, [selectedContact]);

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
  };
};
