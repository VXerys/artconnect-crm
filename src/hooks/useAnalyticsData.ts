import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { artworksService } from '@/lib/services/artworks.service';
import { contactsService } from '@/lib/services/contacts.service';
import { salesService } from '@/lib/services/sales.service';
import { activityService } from '@/lib/services/activity.service';
import type { 
  AnalyticsStat, 
  SalesDataPoint, 
  ArtworkStatusData, 
  ContactActivityData,
  TopArtwork,
  TrafficSource,
} from '@/components/analytics/types';
import { DollarSign, Palette, Users, Activity } from 'lucide-react';

interface AnalyticsData {
  stats: AnalyticsStat[];
  salesData: SalesDataPoint[];
  artworkStatusData: ArtworkStatusData[];
  contactActivityData: ContactActivityData[];
  topArtworks: TopArtwork[];
  trafficSources: TrafficSource[];
  totalRevenue: number;
  revenueGrowth: string;
  loading: boolean;
  error: string | null;
}

export const useAnalyticsData = (): AnalyticsData => {
  const { profile } = useAuth();
  const userId = profile?.id || null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for data
  const [stats, setStats] = useState<AnalyticsStat[]>([]);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [artworkStatusData, setArtworkStatusData] = useState<ArtworkStatusData[]>([]);
  const [contactActivityData, setContactActivityData] = useState<ContactActivityData[]>([]);
  const [topArtworks, setTopArtworks] = useState<TopArtwork[]>([]);
  const [trafficSources, setTrafficSources] = useState<TrafficSource[]>([]); // Changed to state
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [revenueGrowth, setRevenueGrowth] = useState('+0%');

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get artwork counts by status
        const statusCounts = await artworksService.getCountByStatus(userId);
        const totalArtworks = Object.values(statusCounts).reduce((a, b) => a + b, 0);

        // Get contacts count
        const contactsResult = await contactsService.getAll(userId, {}, { limit: 1 });
        const totalContacts = contactsResult.count;

        // Get sales data and artworks for medium analysis
        let totalSalesAmount = 0;
        let monthlySalesData: SalesDataPoint[] = [];
        let currentMonthSales = 0;
        let lastMonthSales = 0;
        let allArtworks: any[] = []; // Store fetched artworks here
        
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        const salesByMonth: Record<string, number> = {};
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        try {
          // Get all artworks (limit 500)
          const allArtworksResult = await artworksService.getAll(userId, {}, { limit: 500 });
          allArtworks = allArtworksResult.data;
          
          allArtworks.forEach(artwork => {
            if (artwork.status === 'sold' && artwork.price) {
              totalSalesAmount += artwork.price;
              
              // Use updated_at as sale date
              const saleDate = new Date(artwork.updated_at || artwork.created_at);
              const monthKey = `${saleDate.getFullYear()}-${saleDate.getMonth()}`;
              salesByMonth[monthKey] = (salesByMonth[monthKey] || 0) + artwork.price;
              
              // Track current and last month
              if (saleDate.getMonth() === currentMonth && saleDate.getFullYear() === currentYear) {
                currentMonthSales += artwork.price;
              }
              const lastMonthIndex = (currentMonth - 1 + 12) % 12;
              const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
              if (saleDate.getMonth() === lastMonthIndex && saleDate.getFullYear() === lastMonthYear) {
                lastMonthSales += artwork.price;
              }
            }
          });

          // Get last 6 months for chart
          for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            monthlySalesData.push({
              month: monthNames[date.getMonth()],
              value: salesByMonth[monthKey] || 0,
            });
          }
        } catch (e) {
          console.warn('Could not fetch artworks for sales data:', e);
          for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            monthlySalesData.push({ month: monthNames[date.getMonth()], value: 0 });
          }
        }

        setSalesData(monthlySalesData);
        setTotalRevenue(totalSalesAmount);

        // Calculate growth
        if (lastMonthSales > 0) {
          const growth = ((currentMonthSales - lastMonthSales) / lastMonthSales) * 100;
          setRevenueGrowth(`${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`);
        } else if (currentMonthSales > 0) {
          setRevenueGrowth('+100%');
        } else {
          setRevenueGrowth('+0%');
        }

        // Calculate Medium Distribution (replacing Traffic Sources)
        const mediumCounts: Record<string, number> = {};
        allArtworks.forEach(artwork => {
          const medium = artwork.medium || 'Lainnya';
          mediumCounts[medium] = (mediumCounts[medium] || 0) + 1;
        });

        const sortedMediums = Object.entries(mediumCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 4); // Top 4 mediums

        const totalMediumsCount = Object.values(mediumCounts).reduce((a, b) => a + b, 0);

        const mediumDistribution: TrafficSource[] = sortedMediums.map(([source, count], index) => ({
          source,
          visitors: count,
          percentage: totalMediumsCount > 0 ? Math.round((count / totalMediumsCount) * 100) : 0,
          color: [
            "#a855f7", // Purple
            "#3b82f6", // Blue
            "#f59e0b", // Amber
            "#22c55e"  // Green
          ][index] || "#64748b" // Slate default
        }));
        
        setTrafficSources(mediumDistribution);
        
        // Artwork status data for pie chart
        const total = totalArtworks || 1; // Avoid division by zero
        setArtworkStatusData([
          { name: "Konsep", value: statusCounts.concept, color: "#a855f7", percentage: Math.round((statusCounts.concept / total) * 100) },
          { name: "Proses", value: statusCounts.wip, color: "#3b82f6", percentage: Math.round((statusCounts.wip / total) * 100) },
          { name: "Selesai", value: statusCounts.finished, color: "#22c55e", percentage: Math.round((statusCounts.finished / total) * 100) },
          { name: "Terjual", value: statusCounts.sold, color: "#f59e0b", percentage: Math.round((statusCounts.sold / total) * 100) },
        ]);

        // Get activities for contact activity chart
        let activityChartData: ContactActivityData[] = [];
        try {
          const activityStats = await activityService.getStats(userId, 180);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
          const now = new Date();
          
          // Calculate total activities per month (simplified)
          for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            activityChartData.push({
              month: monthNames[date.getMonth()],
              interactions: 0, // Would need more detailed tracking
            });
          }

          // Get total activities count
          const totalActivities = Object.values(activityStats).reduce((a, b) => a + b, 0);
          if (activityChartData.length > 0 && totalActivities > 0) {
            // Distribute activities roughly across months (placeholder logic)
            activityChartData[activityChartData.length - 1].interactions = totalActivities;
          }
        } catch (e) {
          console.warn('Could not fetch activity data:', e);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
          activityChartData = monthNames.map(month => ({ month, interactions: 0 }));
        }
        setContactActivityData(activityChartData);

        // Get top artworks (most expensive or recently sold)
        try {
          const artworksResult = await artworksService.getAll(userId, {}, { limit: 10, orderBy: 'price', orderDirection: 'desc' });
          const topArtworksList: TopArtwork[] = artworksResult.data
            .filter(a => a.price && a.price > 0)
            .slice(0, 4)
            .map((artwork, index) => ({
              id: index + 1,
              title: artwork.title,
              medium: artwork.medium || 'Unknown',
              views: 0, // Would need view tracking
              inquiries: 0,
              sales: artwork.status === 'sold' ? 1 : 0,
              revenue: artwork.price || 0, // Estimated value based on price
              image: artwork.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100',
            }));
          setTopArtworks(topArtworksList);
        } catch (e) {
          console.warn('Could not fetch top artworks:', e);
          setTopArtworks([]);
        }

        // Build stats
        setStats([
          {
            id: "monthly-sales",
            title: "Penjualan Bulan Ini",
            value: formatCompactCurrency(currentMonthSales),
            change: revenueGrowth,
            trend: currentMonthSales >= lastMonthSales ? "up" : "down",
            icon: DollarSign,
            color: "text-primary",
            bgColor: "bg-primary/10",
            description: "vs bulan lalu",
          },
          {
            id: "total-artworks",
            title: "Total Karya",
            value: totalArtworks.toString(),
            change: "+0",
            trend: "up" as const,
            icon: Palette,
            color: "text-purple-400",
            bgColor: "bg-purple-500/10",
            description: "karya seni",
          },
          {
            id: "total-contacts",
            title: "Total Kontak",
            value: totalContacts.toString(),
            change: "+0",
            trend: "up" as const,
            icon: Users,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
            description: "kontak",
          },
          {
            id: "interactions",
            title: "Pipeline Aktif",
            value: statusCounts.wip.toString(),
            change: "+0",
            trend: "up" as const,
            icon: Activity,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
            description: "dalam proses",
          },
        ]);

      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Gagal memuat data analitik');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [userId]);

  return {
    stats,
    salesData,
    artworkStatusData,
    contactActivityData,
    topArtworks,
    trafficSources,
    totalRevenue,
    revenueGrowth,
    loading,
    error,
  };
};

// Helper function
function formatCompactCurrency(value: number): string {
  if (value >= 1000000000) {
    return `Rp ${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `Rp ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `Rp ${(value / 1000).toFixed(0)}K`;
  }
  return `Rp ${value.toLocaleString('id-ID')}`;
}

export default useAnalyticsData;
