import { 
  Palette, 
  Users, 
  TrendingUp, 
  DollarSign,
  ShoppingBag,
  UserPlus,
  Eye,
  RefreshCw,
} from "lucide-react";
import { StatItem, DashboardArtwork, DashboardContact, ActivityItem, QuickAction, ChartDataPoint } from "./types";

// Dashboard Stats
export const dashboardStats: StatItem[] = [
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
    id: "active-contacts",
    title: "Kontak Aktif",
    value: "156",
    change: "+12",
    trend: "up",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    description: "bulan ini",
  },
  {
    id: "monthly-sales",
    title: "Penjualan",
    value: "Rp 45.5M",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    description: "bulan ini",
  },
  {
    id: "interactions",
    title: "Pipeline Aktif",
    value: "12",
    change: "+2",
    trend: "up",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "proses berlangsung",
  },
];

// Recent Artworks Data
export const recentArtworks: DashboardArtwork[] = [
  { 
    id: 1, 
    title: "Sunset Horizon", 
    status: "finished", 
    price: "Rp 15.000.000", 
    date: "2 hari lalu",
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100",
    medium: "Oil on Canvas",
  },
  { 
    id: 2, 
    title: "Urban Dreams", 
    status: "wip", 
    price: null, 
    date: "5 hari lalu",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=100",
    medium: "Acrylic",
  },
  { 
    id: 3, 
    title: "Abstract Motion", 
    status: "sold", 
    price: "Rp 25.000.000", 
    date: "1 minggu lalu",
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=100",
    medium: "Mixed Media",
  },
  { 
    id: 4, 
    title: "Nature's Call", 
    status: "concept", 
    price: null, 
    date: "2 minggu lalu",
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=100",
    medium: "Watercolor",
  },
];

// Recent Contacts Data
export const recentContacts: DashboardContact[] = [
  { 
    id: 1, 
    name: "Galeri Nasional", 
    type: "Galeri", 
    lastContact: "Kemarin",
    email: "info@galerinasional.id",
  },
  { 
    id: 2, 
    name: "Ahmad Wijaya", 
    type: "Kolektor", 
    lastContact: "3 hari lalu",
    email: "ahmad.w@email.com",
  },
  { 
    id: 3, 
    name: "Museum Modern", 
    type: "Museum", 
    lastContact: "1 minggu lalu",
    email: "contact@museummodern.id",
  },
  { 
    id: 4, 
    name: "Sarah Chen", 
    type: "Kurator", 
    lastContact: "2 minggu lalu",
    email: "sarah.c@artworld.com",
  },
];

// Recent Activity Data
export const recentActivities: ActivityItem[] = [
  {
    id: 1,
    type: "sale",
    title: "Penjualan Baru",
    description: "Abstract Motion terjual seharga Rp 25.000.000",
    time: "1 jam lalu",
    icon: ShoppingBag,
    color: "text-emerald-400",
  },
  {
    id: 2,
    type: "new_artwork",
    title: "Karya Baru Ditambahkan",
    description: "Sunset Horizon ditambahkan ke koleksi",
    time: "2 hari lalu",
    icon: Palette,
    color: "text-purple-400",
  },
  {
    id: 3,
    type: "new_contact",
    title: "Kontak Baru",
    description: "Sarah Chen bergabung sebagai Kurator",
    time: "3 hari lalu",
    icon: UserPlus,
    color: "text-blue-400",
  },
  {
    id: 4,
    type: "interaction",
    title: "Galeri Mengunjungi",
    description: "Galeri Nasional melihat profil Anda",
    time: "5 hari lalu",
    icon: Eye,
    color: "text-amber-400",
  },
  {
    id: 5,
    type: "status_change",
    title: "Status Diperbarui",
    description: "Urban Dreams berubah ke status Proses",
    time: "1 minggu lalu",
    icon: RefreshCw,
    color: "text-primary",
  },
];

// Quick Actions
export const quickActions: QuickAction[] = [
  {
    id: "add-artwork",
    label: "Tambah Karya",
    description: "Tambahkan karya seni baru",
    icon: Palette,
    href: "/artworks",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "add-contact",
    label: "Tambah Kontak",
    description: "Tambahkan kontak baru",
    icon: Users,
    href: "/contacts",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "view-pipeline",
    label: "Lihat Pipeline",
    description: "Pantau proses penjualan",
    icon: TrendingUp,
    href: "/pipeline",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "record-sale",
    label: "Catat Penjualan",
    description: "Catat transaksi penjualan",
    icon: DollarSign,
    href: "/reports",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

// Chart Data (for sales overview)
export const salesChartData: ChartDataPoint[] = [
  { month: "Jan", sales: 12000000, artworks: 2 },
  { month: "Feb", sales: 8500000, artworks: 1 },
  { month: "Mar", sales: 25000000, artworks: 3 },
  { month: "Apr", sales: 15000000, artworks: 2 },
  { month: "Mei", sales: 32000000, artworks: 4 },
  { month: "Jun", sales: 45500000, artworks: 5 },
];

// Status configuration
export const statusConfig = {
  concept: { 
    label: "Konsep", 
    className: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    dotColor: "bg-purple-500",
  },
  wip: { 
    label: "Proses", 
    className: "bg-blue-500/10 text-blue-400 border-blue-500/30",
    dotColor: "bg-blue-500",
  },
  finished: { 
    label: "Selesai", 
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dotColor: "bg-emerald-500",
  },
  sold: { 
    label: "Terjual", 
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    dotColor: "bg-amber-500",
  },
};

// Contact type configuration
export const contactTypeConfig: Record<string, { color: string; bgColor: string }> = {
  "Galeri": { color: "text-purple-400", bgColor: "bg-purple-500/20" },
  "Kolektor": { color: "text-emerald-400", bgColor: "bg-emerald-500/20" },
  "Museum": { color: "text-blue-400", bgColor: "bg-blue-500/20" },
  "Kurator": { color: "text-amber-400", bgColor: "bg-amber-500/20" },
  "Agen": { color: "text-rose-400", bgColor: "bg-rose-500/20" },
};
