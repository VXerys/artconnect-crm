import { 
  FileText, 
  FileSpreadsheet, 
  Users,
  Activity,
  TrendingUp,
  DollarSign,
  Palette,
  ShoppingBag,
} from "lucide-react";
import { ReportType, RecentReport, ReportMetric, ScheduledReport, SalesSummary } from "./types";

// Report Types Configuration
export const reportTypes: ReportType[] = [
  {
    id: "inventory",
    title: "Laporan Inventaris",
    description: "Daftar lengkap semua karya seni beserta status, nilai estimasi, dan detail lokasi penyimpanan.",
    icon: FileText,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    features: [
      "Daftar semua karya",
      "Status dan lokasi",
      "Nilai estimasi",
      "Foto thumbnail",
    ],
  },
  {
    id: "sales",
    title: "Laporan Penjualan",
    description: "Ringkasan transaksi penjualan, pendapatan, dan analisis performa per periode waktu.",
    icon: FileSpreadsheet,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    features: [
      "Total pendapatan",
      "Grafik penjualan",
      "Top karya terjual",
      "Analisis pembeli",
    ],
  },
  {
    id: "contacts",
    title: "Laporan Kontak",
    description: "Data jejaring profesional termasuk galeri, kolektor, museum, dan riwayat interaksi.",
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    features: [
      "Daftar kontak",
      "Kategori & segmentasi",
      "Riwayat komunikasi",
      "Peluang kerjasama",
    ],
  },
  {
    id: "activity",
    title: "Laporan Aktivitas",
    description: "Log aktivitas lengkap meliputi interaksi, meeting, follow-up, dan touchpoint lainnya.",
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/10",
    features: [
      "Timeline aktivitas",
      "Meeting & events",
      "Follow-up tasks",
      "Catatan penting",
    ],
  },
];

// Recent Reports Data
export const recentReports: RecentReport[] = [
  { 
    id: 1, 
    name: "Inventaris_Des2024.csv", 
    type: "inventory", 
    date: "16 Des 2024", 
    size: "45 KB",
    format: "csv",
    status: "completed",
  },
  { 
    id: 2, 
    name: "Penjualan_Q4_2024.pdf", 
    type: "sales", 
    date: "15 Des 2024", 
    size: "128 KB",
    format: "pdf",
    status: "completed",
  },
  { 
    id: 3, 
    name: "Kontak_Export.csv", 
    type: "contacts", 
    date: "10 Des 2024", 
    size: "32 KB",
    format: "csv",
    status: "completed",
  },
  { 
    id: 4, 
    name: "Aktivitas_Nov2024.xlsx", 
    type: "activity", 
    date: "5 Des 2024", 
    size: "78 KB",
    format: "xlsx",
    status: "completed",
  },
  { 
    id: 5, 
    name: "Penjualan_Nov2024.pdf", 
    type: "sales", 
    date: "1 Des 2024", 
    size: "156 KB",
    format: "pdf",
    status: "completed",
  },
];

// Report Metrics Data
export const reportMetrics: ReportMetric[] = [
  {
    id: "total-sales",
    label: "Total Penjualan",
    value: "Rp 137.5M",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "artworks-sold",
    label: "Karya Terjual",
    value: "8",
    change: "+2",
    trend: "up",
    icon: ShoppingBag,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
  {
    id: "total-artworks",
    label: "Total Karya",
    value: "24",
    change: "+3",
    trend: "up",
    icon: Palette,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  {
    id: "conversion-rate",
    label: "Conversion Rate",
    value: "33%",
    change: "+5%",
    trend: "up",
    icon: TrendingUp,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
];

// Scheduled Reports Data
export const scheduledReports: ScheduledReport[] = [
  {
    id: 1,
    name: "Laporan Penjualan Mingguan",
    type: "sales",
    frequency: "weekly",
    nextRun: "23 Des 2024",
    recipients: ["seniman@email.com"],
    isActive: true,
  },
  {
    id: 2,
    name: "Inventory Bulanan",
    type: "inventory",
    frequency: "monthly",
    nextRun: "1 Jan 2025",
    recipients: ["seniman@email.com", "manager@gallery.com"],
    isActive: true,
  },
];

// Sales Summary Data
export const salesSummary: SalesSummary = {
  totalSales: 137500000,
  totalArtworks: 8,
  averagePrice: 17187500,
  topArtwork: {
    title: "Abstract Motion",
    price: 35000000,
  },
  monthlyData: [
    { month: "Jul", sales: 15000000, count: 1 },
    { month: "Agu", sales: 22000000, count: 2 },
    { month: "Sep", sales: 8500000, count: 1 },
    { month: "Okt", sales: 28000000, count: 2 },
    { month: "Nov", sales: 19000000, count: 1 },
    { month: "Des", sales: 45000000, count: 3 },
  ],
};

// Report Type Config (for icons and colors)
export const reportTypeConfig = {
  inventory: {
    icon: FileText,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    label: "Inventaris",
  },
  sales: {
    icon: FileSpreadsheet,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    label: "Penjualan",
  },
  contacts: {
    icon: Users,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    label: "Kontak",
  },
  activity: {
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/10",
    label: "Aktivitas",
  },
};

// Format Config
export const formatConfig = {
  csv: {
    label: "CSV",
    extension: ".csv",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
  },
  pdf: {
    label: "PDF",
    extension: ".pdf",
    color: "text-red-400",
    bgColor: "bg-red-500/10",
  },
  xlsx: {
    label: "Excel",
    extension: ".xlsx",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
};
