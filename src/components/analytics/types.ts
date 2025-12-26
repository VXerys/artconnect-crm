import { LucideIcon } from "lucide-react";

// Stat Card Types
export interface AnalyticsStat {
  id: string;
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description?: string;
}

// Sales Data Point
export interface SalesDataPoint {
  month: string;
  value: number;
}

// Artwork Stats for Pie Chart
export interface ArtworkStatusData {
  name: string;
  value: number;
  color: string;
  percentage?: number;
}

// Contact Activity Data
export interface ContactActivityData {
  month: string;
  interactions: number;
}

// Top Artwork Performance
export interface TopArtwork {
  id: number;
  title: string;
  medium: string;
  views: number;
  inquiries: number;
  sales: number;
  revenue: number;
  image?: string;
}

// Source Traffic Data
export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

// Date Range Type
export type DateRange = "7d" | "30d" | "90d" | "12m" | "all";
