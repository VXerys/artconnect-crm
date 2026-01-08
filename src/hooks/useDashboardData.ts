import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { artworksService } from '@/lib/services/artworks.service';
import { contactsService } from '@/lib/services/contacts.service';
import { salesService } from '@/lib/services/sales.service';
import { activityService } from '@/lib/services/activity.service';
import { pipelineService } from '@/lib/services/pipeline.service';
import type { StatItem, DashboardArtwork, DashboardContact, ActivityItem, ChartDataPoint } from '@/components/dashboard/types';
import { Palette, Users, DollarSign, TrendingUp, ShoppingBag, UserPlus, Eye, RefreshCw } from 'lucide-react';

interface DashboardData {
  userName: string;
  stats: StatItem[];
  recentArtworks: DashboardArtwork[];
  recentContacts: DashboardContact[];
  recentActivities: ActivityItem[];
  salesChartData: ChartDataPoint[];
  artworkStatusCounts: {
    concept: number;
    wip: number;
    finished: number;
    sold: number;
  };
  totalArtworks: number;
  totalSales: string;
  loading: boolean;
  error: string | null;
}

export const useDashboardData = (): DashboardData => {
  const { user, getUserId, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Initial empty state
  const [stats, setStats] = useState<StatItem[]>([
    {
      id: "total-artworks",
      title: "Total Karya",
      value: "0",
      change: "+0",
      trend: "up",
      icon: Palette,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      description: "bulan ini",
    },
    {
      id: "active-contacts",
      title: "Kontak Aktif",
      value: "0",
      change: "+0",
      trend: "up",
      icon: Users,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      description: "bulan ini",
    },
    {
      id: "monthly-sales",
      title: "Penjualan",
      value: "Rp 0",
      change: "+0%",
      trend: "up",
      icon: DollarSign,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      description: "bulan ini",
    },
    {
      id: "interactions",
      title: "Pipeline Aktif",
      value: "0",
      change: "+0",
      trend: "up",
      icon: TrendingUp,
      color: "text-primary",
      bgColor: "bg-primary/10",
      description: "proses berlangsung",
    },
  ]);

  const [recentArtworks, setRecentArtworks] = useState<DashboardArtwork[]>([]);
  const [recentContacts, setRecentContacts] = useState<DashboardContact[]>([]);
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);
  const [salesChartData, setSalesChartData] = useState<ChartDataPoint[]>([]);
  const [artworkStatusCounts, setArtworkStatusCounts] = useState({
    concept: 0,
    wip: 0,
    finished: 0,
    sold: 0,
  });
  const [totalSales, setTotalSales] = useState("Rp 0");

  // Use profile.full_name from database as primary source (updated via Settings)
  const userName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Seniman';

  // Get userId from profile
  const userId = profile?.id || null;

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const now = new Date();
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        // ==========================================
        // PARALLEL FETCH - All API calls at once
        // ==========================================
        const [
          statusCountsResult,
          recentArtworksResult,
          contactsResult,
          allArtworksResult,
          activitiesResult,
          pipelineResult,
        ] = await Promise.allSettled([
          // 1. Artwork counts by status
          artworksService.getCountByStatus(userId),
          // 2. Recent artworks (top 4)
          artworksService.getRecent(userId, 4),
          // 3. Contacts (top 4)
          contactsService.getAll(userId, {}, { limit: 4 }),
          // 4. All artworks for sales calculation (limit to 100 for performance)
          artworksService.getAll(userId, {}, { limit: 100 }),
          // 5. Recent activities
          activityService.getRecent(userId, 5),
          // 6. Pipeline data
          pipelineService.getPipelineData(userId),
        ]);

        // ==========================================
        // PROCESS RESULTS
        // ==========================================

        // 1. Status counts
        let statusCounts = { concept: 0, wip: 0, finished: 0, sold: 0 };
        if (statusCountsResult.status === 'fulfilled') {
          statusCounts = statusCountsResult.value;
        }
        setArtworkStatusCounts(statusCounts);
        const totalArtworksCount = Object.values(statusCounts).reduce((a, b) => a + b, 0);

        // 2. Recent artworks
        let mappedArtworks: DashboardArtwork[] = [];
        if (recentArtworksResult.status === 'fulfilled') {
          mappedArtworks = recentArtworksResult.value.map(artwork => ({
            id: artwork.id as unknown as number,
            title: artwork.title,
            status: artwork.status,
            price: artwork.price ? `Rp ${artwork.price.toLocaleString('id-ID')}` : null,
            date: formatRelativeDate(artwork.created_at),
            image: artwork.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100',
            medium: artwork.medium || 'Unknown',
          }));
        }
        setRecentArtworks(mappedArtworks);

        // 3. Contacts
        let totalContacts = 0;
        let mappedContacts: DashboardContact[] = [];
        if (contactsResult.status === 'fulfilled') {
          totalContacts = contactsResult.value.count;
          mappedContacts = contactsResult.value.data.map(contact => ({
            id: contact.id as unknown as number,
            name: contact.name,
            type: contact.type || 'Kontak',
            lastContact: formatRelativeDate(contact.updated_at || contact.created_at),
            email: contact.email || '',
          }));
        }
        setRecentContacts(mappedContacts);

        // 4. All artworks - calculate sales
        let totalSalesAmount = 0;
        const salesByMonth: Record<string, { sales: number; artworks: number }> = {};
        
        if (allArtworksResult.status === 'fulfilled') {
          allArtworksResult.value.data.forEach(artwork => {
            if (artwork.status === 'sold' && artwork.price) {
              totalSalesAmount += artwork.price;
              
              const saleDate = new Date(artwork.updated_at || artwork.created_at);
              const monthKey = `${saleDate.getFullYear()}-${saleDate.getMonth()}`;
              if (!salesByMonth[monthKey]) {
                salesByMonth[monthKey] = { sales: 0, artworks: 0 };
              }
              salesByMonth[monthKey].sales += artwork.price;
              salesByMonth[monthKey].artworks += 1;
            }
          });
        }

        // Generate chart data for last 6 months
        const monthlySalesData: ChartDataPoint[] = [];
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
          monthlySalesData.push({
            month: monthNames[date.getMonth()],
            sales: salesByMonth[monthKey]?.sales || 0,
            artworks: salesByMonth[monthKey]?.artworks || 0,
          });
        }
        setSalesChartData(monthlySalesData);
        setTotalSales(formatCurrency(totalSalesAmount));

        // 5. Activities
        let mappedActivities: ActivityItem[] = [];
        if (activitiesResult.status === 'fulfilled') {
          mappedActivities = activitiesResult.value.map((activity, index) => ({
            id: index + 1,
            type: mapActivityType(activity.activity_type),
            title: activity.title || getActivityTitle(activity.activity_type),
            description: activity.description || '',
            time: activity.relativeTime || formatRelativeDate(activity.created_at),
            icon: getActivityIcon(activity.activity_type),
            color: activity.color || getActivityColor(activity.activity_type),
          }));
        }
        setRecentActivities(mappedActivities);

        // 6. Pipeline count
        let activePipelineCount = 0;
        if (pipelineResult.status === 'fulfilled') {
          const pipelineData = pipelineResult.value;
          activePipelineCount = 
            pipelineData.concept.items.length + 
            pipelineData.wip.items.length + 
            pipelineData.finished.items.length;
        }

        // Update stats
        setStats([
          {
            id: "total-artworks",
            title: "Total Karya",
            value: totalArtworksCount.toString(),
            change: "+0",
            trend: "up" as const,
            icon: Palette,
            color: "text-purple-400",
            bgColor: "bg-purple-500/10",
            description: "karya seni",
          },
          {
            id: "active-contacts",
            title: "Kontak Aktif",
            value: totalContacts.toString(),
            change: "+0",
            trend: "up" as const,
            icon: Users,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
            description: "kontak",
          },
          {
            id: "monthly-sales",
            title: "Penjualan",
            value: formatCurrency(totalSalesAmount),
            change: "+0%",
            trend: "up" as const,
            icon: DollarSign,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
            description: "total",
          },
          {
            id: "interactions",
            title: "Pipeline Aktif",
            value: activePipelineCount.toString(),
            change: "+0",
            trend: "up" as const,
            icon: TrendingUp,
            color: "text-primary",
            bgColor: "bg-primary/10",
            description: "proses berlangsung",
          },
        ]);

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [userId]);


  const totalArtworks = Object.values(artworkStatusCounts).reduce((a, b) => a + b, 0);

  return {
    userName,
    stats,
    recentArtworks,
    recentContacts,
    recentActivities,
    salesChartData,
    artworkStatusCounts,
    totalArtworks,
    totalSales,
    loading,
    error,
  };
};

// Helper functions
function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hari ini';
  if (diffDays === 1) return 'Kemarin';
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 14) return '1 minggu lalu';
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  if (diffDays < 60) return '1 bulan lalu';
  return `${Math.floor(diffDays / 30)} bulan lalu`;
}

function mapActivityType(type: string): 'sale' | 'new_artwork' | 'new_contact' | 'interaction' | 'status_change' {
  switch (type) {
    case 'artwork_sold':
    case 'sale_created':
    case 'sale_completed':
      return 'sale';
    case 'artwork_created':
      return 'new_artwork';
    case 'contact_added':
      return 'new_contact';
    case 'artwork_updated':
    case 'user_profile_updated':
      return 'status_change';
    default:
      return 'interaction';
  }
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000000) {
    return `Rp ${(amount / 1000000000).toFixed(1)}B`;
  }
  if (amount >= 1000000) {
    return `Rp ${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `Rp ${(amount / 1000).toFixed(0)}K`;
  }
  return `Rp ${amount.toLocaleString('id-ID')}`;
}

function getActivityTitle(type: string): string {
  switch (type) {
    case 'sale':
    case 'artwork_sold':
    case 'sale_created':
    case 'sale_completed':
      return 'Penjualan Baru';
    case 'new_artwork':
    case 'artwork_created':
      return 'Karya Baru Ditambahkan';
    case 'new_contact':
    case 'contact_added':
      return 'Kontak Baru';
    case 'interaction':
    case 'user_login':
      return 'Interaksi';
    case 'status_change':
    case 'artwork_updated':
    case 'contact_updated':
    case 'user_profile_updated':
      return 'Status Diperbarui';
    case 'report_generated':
      return 'Laporan Dibuat';
    default:
      return 'Aktivitas';
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case 'sale':
    case 'artwork_sold':
    case 'sale_created':
    case 'sale_completed':
      return ShoppingBag;
    case 'new_artwork':
    case 'artwork_created':
      return Palette;
    case 'new_contact':
    case 'contact_added':
      return UserPlus;
    case 'status_change':
    case 'artwork_updated':
    case 'contact_updated':
    case 'user_profile_updated':
      return RefreshCw;
    case 'interaction':
    case 'user_login':
    default:
      return Eye;
  }
}

function getActivityColor(type: string): string {
  switch (type) {
    case 'sale':
    case 'artwork_sold':
    case 'sale_created':
    case 'sale_completed':
      return 'text-emerald-400';
    case 'new_artwork':
    case 'artwork_created':
      return 'text-purple-400';
    case 'new_contact':
    case 'contact_added':
      return 'text-blue-400';
    case 'interaction':
    case 'user_login':
      return 'text-amber-400';
    case 'status_change':
    case 'artwork_updated':
    case 'contact_updated':
    case 'user_profile_updated':
      return 'text-primary';
    default:
      return 'text-muted-foreground';
  }
}

export default useDashboardData;
