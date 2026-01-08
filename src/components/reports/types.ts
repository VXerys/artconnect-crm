import { LucideIcon } from "lucide-react";

// Report Type Interface
export interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  features: string[];
}

// Recent Report Interface
export interface RecentReport {
  id: number;
  name: string;
  type: "inventory" | "sales" | "contacts" | "activity" | "combined";
  date: string;
  size: string;
  format: "csv" | "pdf" | "xlsx";
  status: "completed" | "processing" | "failed";
}

// Report Metric Interface
export interface ReportMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

// Custom Report Form Data
export interface CustomReportForm {
  reportType: string;
  startDate: string;
  endDate: string;
  format: "csv" | "pdf" | "xlsx";
  includeCharts: boolean;
  includeImages: boolean;
}

// Scheduled Report Interface
export interface ScheduledReport {
  id: number;
  name: string;
  type: string;
  frequency: "daily" | "weekly" | "monthly";
  nextRun: string;
  recipients: string[];
  isActive: boolean;
}

// Sales Summary Interface
export interface SalesSummary {
  totalSales: number;
  totalArtworks: number;
  averagePrice: number;
  topArtwork: {
    title: string;
    price: number;
  };
  monthlyData: Array<{
    month: string;
    sales: number;
    count: number;
  }>;
}
