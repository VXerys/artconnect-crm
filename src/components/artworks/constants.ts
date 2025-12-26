import { Artwork, ArtworkFormData } from "./types";

// Initial form data
export const initialFormData: ArtworkFormData = {
  title: "",
  medium: "",
  dimensions: "",
  status: "concept",
  price: "",
  year: new Date().getFullYear().toString(),
  image: "",
  description: "",
};

// Initial artworks data
export const initialArtworks: Artwork[] = [
  { 
    id: 1, 
    title: "Sunset Horizon", 
    medium: "Acrylic on Canvas",
    dimensions: "100 x 80 cm",
    status: "finished", 
    price: 15000000,
    year: 2024,
    image: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=400"
  },
  { 
    id: 2, 
    title: "Urban Dreams", 
    medium: "Oil on Canvas",
    dimensions: "120 x 90 cm",
    status: "wip", 
    price: null,
    year: 2024,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400"
  },
  { 
    id: 3, 
    title: "Abstract Motion", 
    medium: "Mixed Media",
    dimensions: "150 x 100 cm",
    status: "sold", 
    price: 25000000,
    year: 2024,
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400"
  },
  { 
    id: 4, 
    title: "Nature's Call", 
    medium: "Watercolor",
    dimensions: "60 x 40 cm",
    status: "concept", 
    price: null,
    year: 2024,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400"
  },
  { 
    id: 5, 
    title: "Digital Echoes", 
    medium: "Digital Print",
    dimensions: "80 x 60 cm",
    status: "finished", 
    price: 8000000,
    year: 2024,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400"
  },
  { 
    id: 6, 
    title: "Cosmic Dance", 
    medium: "Acrylic on Canvas",
    dimensions: "200 x 150 cm",
    status: "wip", 
    price: null,
    year: 2024,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ez92a6?w=400"
  },
];

// Medium options for artwork
export const mediumOptions = [
  "Acrylic on Canvas",
  "Oil on Canvas",
  "Watercolor",
  "Mixed Media",
  "Digital Print",
  "Charcoal",
  "Pastel",
  "Ink on Paper",
  "Sculpture",
  "Photography",
  "Lainnya",
];

// Status configuration
export const statusConfig = {
  concept: { label: "Konsep", class: "status-concept" },
  wip: { label: "Proses", class: "status-wip" },
  finished: { label: "Selesai", class: "status-finished" },
  sold: { label: "Terjual", class: "status-sold" },
};

// Format currency helper
export const formatCurrency = (value: number | null) => {
  if (!value) return "-";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

// Format price input helper
export const formatPriceInput = (value: string) => {
  const numericValue = value.replace(/\D/g, '');
  if (numericValue) {
    return new Intl.NumberFormat('id-ID').format(parseInt(numericValue));
  }
  return '';
};
