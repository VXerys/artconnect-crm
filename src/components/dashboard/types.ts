import { LucideIcon } from "lucide-react";

// Stat Card Types
export interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description?: string;
}

// Artwork Types for Dashboard
export interface DashboardArtwork {
  id: number;
  title: string;
  status: "concept" | "wip" | "finished" | "sold";
  price: string | null;
  date: string;
  image?: string;
  medium?: string;
}

// Contact Types for Dashboard
export interface DashboardContact {
  id: number;
  name: string;
  type: string;
  lastContact: string;
  avatar?: string;
  email?: string;
}

// Activity Types
export interface ActivityItem {
  id: number;
  type: "sale" | "new_artwork" | "new_contact" | "interaction" | "status_change";
  title: string;
  description: string;
  time: string;
  icon: LucideIcon;
  color: string;
}

// Quick Action Types
export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  onClick?: () => void;
  color: string;
  bgColor: string;
}

// Chart Data Types
export interface ChartDataPoint {
  month: string;
  sales: number;
  artworks: number;
}
