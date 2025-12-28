// Artworks Types

export interface Artwork {
  id: number;
  title: string;
  medium: string;
  dimensions: string;
  status: "concept" | "wip" | "finished" | "sold";
  price: number | null;
  year: number;
  image: string;
  description?: string;
  dbId?: string; // Database ID for Supabase operations
}

export interface ArtworkFormData {
  title: string;
  medium: string;
  dimensions: string;
  status: "concept" | "wip" | "finished" | "sold";
  price: string;
  year: string;
  image: string;
  description: string;
}

export interface ArtworkFormErrors {
  title?: string;
  medium?: string;
  dimensions?: string;
  status?: string;
  price?: string;
  year?: string;
  image?: string;
}

export type ArtworkStatus = "concept" | "wip" | "finished" | "sold";
export type ViewMode = "grid" | "list";
