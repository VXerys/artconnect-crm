// Contacts Types

export type ContactType = "gallery" | "collector" | "museum" | "curator";

export interface Contact {
  id: number;
  name: string;
  type: ContactType;
  email: string;
  phone: string;
  location: string;
  rating: number;
  lastContact: string;
  notes?: string;
  website?: string;
  address?: string;
}

export interface ContactFormData {
  name: string;
  type: ContactType;
  email: string;
  phone: string;
  location: string;
  rating: number;
  notes: string;
  website: string;
  address: string;
}

export interface ContactFormErrors {
  name?: string;
  type?: string;
  email?: string;
  phone?: string;
  location?: string;
}

export interface TypeConfig {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bg: string;
}

export interface ContactsByType {
  all: number;
  gallery: number;
  collector: number;
  museum: number;
  curator: number;
}
