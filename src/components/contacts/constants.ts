import { Building2, User, Palette, Star } from "lucide-react";
import { Contact, ContactFormData, TypeConfig } from "./types";

// Initial form data
export const initialFormData: ContactFormData = {
  name: "",
  type: "collector",
  email: "",
  phone: "",
  location: "",
  rating: 3,
  notes: "",
  website: "",
  address: "",
};

// Initial contacts data
export const initialContacts: Contact[] = [
  {
    id: 1,
    name: "Galeri Nasional Indonesia",
    type: "gallery",
    email: "info@galnas.go.id",
    phone: "+62 21 1234 5678",
    location: "Jakarta",
    rating: 5,
    lastContact: "2 hari lalu",
    notes: "Tertarik dengan seri landscape"
  },
  {
    id: 2,
    name: "Ahmad Wijaya",
    type: "collector",
    email: "ahmad.w@email.com",
    phone: "+62 812 3456 7890",
    location: "Surabaya",
    rating: 4,
    lastContact: "1 minggu lalu",
    notes: "Koleksi fokus pada contemporary art"
  },
  {
    id: 3,
    name: "Museum Seni Rupa dan Keramik",
    type: "museum",
    email: "contact@museumsenirupa.id",
    phone: "+62 21 9876 5432",
    location: "Jakarta",
    rating: 5,
    lastContact: "3 hari lalu",
    notes: "Diskusi untuk pameran kolaborasi"
  },
  {
    id: 4,
    name: "Sarah Chen",
    type: "curator",
    email: "sarah.chen@artworld.com",
    phone: "+65 9123 4567",
    location: "Singapore",
    rating: 4,
    lastContact: "2 minggu lalu",
    notes: "Kurator untuk Singapore Art Week"
  },
  {
    id: 5,
    name: "Budi Santoso",
    type: "collector",
    email: "budi.s@company.com",
    phone: "+62 811 2233 4455",
    location: "Bandung",
    rating: 3,
    lastContact: "1 bulan lalu",
    notes: "Pemula dalam koleksi seni"
  },
  {
    id: 6,
    name: "Art Space Gallery",
    type: "gallery",
    email: "hello@artspace.id",
    phone: "+62 22 7654 3210",
    location: "Yogyakarta",
    rating: 4,
    lastContact: "5 hari lalu",
    notes: "Gallery fokus pada emerging artists"
  },
];

// Type configuration
export const typeConfig: Record<string, TypeConfig> = {
  gallery: { label: "Galeri", icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10" },
  collector: { label: "Kolektor", icon: User, color: "text-blue-400", bg: "bg-blue-500/10" },
  museum: { label: "Museum", icon: Palette, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  curator: { label: "Kurator", icon: Star, color: "text-primary", bg: "bg-primary/10" },
};

// Location options
export const locationOptions = [
  "Jakarta",
  "Surabaya",
  "Bandung",
  "Yogyakarta",
  "Bali",
  "Semarang",
  "Medan",
  "Makassar",
  "Singapore",
  "Kuala Lumpur",
  "Lainnya",
];

// Format date helper
export const formatLastContact = (date: Date): string => {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
  return `${Math.floor(diffDays / 365)} tahun lalu`;
};

// Validate email
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate phone
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};
