import { 
  DollarSign, 
  Palette, 
  Users, 
  Activity,
  Eye,
  ShoppingBag,
  MessageCircle,
  TrendingUp,
} from "lucide-react";
import { 
  AnalyticsStat, 
  SalesDataPoint, 
  ArtworkStatusData, 
  ContactActivityData,
  TopArtwork,
  TrafficSource,
} from "./types";

// Analytics Stats Data
export const analyticsStats: AnalyticsStat[] = [
  {
    id: "monthly-sales",
    title: "Penjualan Bulan Ini",
    value: "Rp 45.5M",
    change: "+62.5%",
    trend: "up",
    icon: DollarSign,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "vs bulan lalu",
  },
  {
    id: "total-artworks",
    title: "Total Karya",
    value: "24",
    change: "+3",
    trend: "up",
    icon: Palette,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    description: "bulan ini",
  },
  {
    id: "total-contacts",
    title: "Total Kontak",
    value: "156",
    change: "+12",
    trend: "up",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    description: "bulan ini",
  },
  {
    id: "interactions",
    title: "Interaksi Bulan Ini",
    value: "89",
    change: "-5",
    trend: "down",
    icon: Activity,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    description: "vs bulan lalu",
  },
];

// Sales Trend Data
export const salesData: SalesDataPoint[] = [
  { month: "Jul", value: 15000000 },
  { month: "Agu", value: 22000000 },
  { month: "Sep", value: 18000000 },
  { month: "Okt", value: 35000000 },
  { month: "Nov", value: 28000000 },
  { month: "Des", value: 45500000 },
];

// Artwork Status Data for Pie Chart
export const artworkStatusData: ArtworkStatusData[] = [
  { name: "Konsep", value: 5, color: "#a855f7", percentage: 21 },
  { name: "Proses", value: 8, color: "#3b82f6", percentage: 33 },
  { name: "Selesai", value: 7, color: "#22c55e", percentage: 29 },
  { name: "Terjual", value: 4, color: "#f59e0b", percentage: 17 },
];

// Contact Activity Data
export const contactActivityData: ContactActivityData[] = [
  { month: "Jul", interactions: 12 },
  { month: "Agu", interactions: 18 },
  { month: "Sep", interactions: 15 },
  { month: "Okt", interactions: 25 },
  { month: "Nov", interactions: 22 },
  { month: "Des", interactions: 30 },
];

// Top Performing Artworks
export const topArtworks: TopArtwork[] = [
  {
    id: 1,
    title: "Abstract Motion",
    medium: "Mixed Media",
    views: 245,
    inquiries: 12,
    sales: 1,
    revenue: 35000000,
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=100",
  },
  {
    id: 2,
    title: "Sunset Horizon",
    medium: "Oil on Canvas",
    views: 189,
    inquiries: 8,
    sales: 1,
    revenue: 25000000,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100",
  },
  {
    id: 3,
    title: "Urban Dreams",
    medium: "Acrylic",
    views: 156,
    inquiries: 6,
    sales: 0,
    revenue: 0,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100",
  },
  {
    id: 4,
    title: "Nature's Call",
    medium: "Watercolor",
    views: 134,
    inquiries: 5,
    sales: 0,
    revenue: 0,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=100",
  },
];

// Traffic Sources
export const trafficSources: TrafficSource[] = [
  { source: "Instagram", visitors: 1250, percentage: 45, color: "#E1306C" },
  { source: "Direct", visitors: 680, percentage: 24, color: "#3b82f6" },
  { source: "Google", visitors: 520, percentage: 19, color: "#22c55e" },
  { source: "Referral", visitors: 340, percentage: 12, color: "#a855f7" },
];

// Quick Insights
export const quickInsights = [
  {
    id: 1,
    icon: TrendingUp,
    title: "Penjualan Naik",
    description: "Penjualan Anda naik 62.5% dibanding bulan lalu",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: 2,
    icon: Eye,
    title: "Karya Populer",
    description: "Abstract Motion menjadi karya paling banyak dilihat",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: 3,
    icon: MessageCircle,
    title: "Inquiry Meningkat",
    description: "12 inquiry baru bulan ini, naik 50% dari bulan lalu",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    id: 4,
    icon: ShoppingBag,
    title: "Konversi Tinggi",
    description: "Rate konversi 33% dari inquiry ke penjualan",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

// Utility function for currency formatting
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

// Utility function for compact currency
export const formatCompactCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `Rp ${(value / 1000).toFixed(0)}K`;
  }
  return `Rp ${value}`;
};

// Date range options
export const dateRangeOptions = [
  { value: "7d", label: "7 Hari" },
  { value: "30d", label: "30 Hari" },
  { value: "90d", label: "90 Hari" },
  { value: "12m", label: "12 Bulan" },
  { value: "all", label: "Semua" },
];
