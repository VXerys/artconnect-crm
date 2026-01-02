import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { artworksService } from '@/lib/services/artworks.service';
import { contactsService } from '@/lib/services/contacts.service';
import { salesService } from '@/lib/services/sales.service';
import { activityService } from '@/lib/services/activity.service';
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

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Seniman';

  // Get userId from profile
  const userId = profile?.id || null;

  useEffect(() => {
    const fetchDashboardData = async () => {
      console.log('Dashboard fetching data, userId:', userId);
      if (!userId) {
        console.log('No userId, skipping dashboard fetch');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch artworks count by status
        const statusCounts = await artworksService.getCountByStatus(userId);
        setArtworkStatusCounts(statusCounts);
        const totalArtworksCount = Object.values(statusCounts).reduce((a, b) => a + b, 0);

        // Fetch recent artworks
        const artworksResult = await artworksService.getRecent(userId, 4);
        const mappedArtworks: DashboardArtwork[] = artworksResult.map(artwork => ({
          id: artwork.id as unknown as number,
          title: artwork.title,
          status: artwork.status,
          price: artwork.price ? `Rp ${artwork.price.toLocaleString('id-ID')}` : null,
          date: formatRelativeDate(artwork.created_at),
          image: artwork.image_url || 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=100',
          medium: artwork.medium || 'Unknown',
        }));
        setRecentArtworks(mappedArtworks);

        // Fetch contacts count
        const contactsResult = await contactsService.getAll(userId, {}, { limit: 4 });
        const totalContacts = contactsResult.count;
        const mappedContacts: DashboardContact[] = contactsResult.data.map(contact => ({
          id: contact.id as unknown as number,
          name: contact.name,
          type: contact.type || 'Kontak',
          lastContact: formatRelativeDate(contact.updated_at || contact.created_at),
          email: contact.email || '',
        }));
        setRecentContacts(mappedContacts);

        // Fetch sales data
        let totalSalesAmount = 0;
        let monthlySalesData: ChartDataPoint[] = [];
        try {
          const salesResult = await salesService.getAll(userId, {}, { limit: 100 });
          totalSalesAmount = salesResult.data.reduce((sum, sale) => sum + (sale.amount || 0), 0);
          
          // Group sales by month for chart
          const salesByMonth: Record<string, { sales: number; artworks: number }> = {};
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
          
          salesResult.data.forEach(sale => {
            const date = new Date(sale.created_at);
            const monthKey = monthNames[date.getMonth()];
            if (!salesByMonth[monthKey]) {
              salesByMonth[monthKey] = { sales: 0, artworks: 0 };
            }
            salesByMonth[monthKey].sales += sale.amount || 0;
            salesByMonth[monthKey].artworks += 1;
          });

          // Get last 6 months
          const now = new Date();
          for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = monthNames[date.getMonth()];
            monthlySalesData.push({
              month: monthKey,
              sales: salesByMonth[monthKey]?.sales || 0,
              artworks: salesByMonth[monthKey]?.artworks || 0,
            });
          }
        } catch (e) {
          // Sales service might fail if table doesn't exist
          console.warn('Could not fetch sales data:', e);
          monthlySalesData = [
            { month: 'Jan', sales: 0, artworks: 0 },
            { month: 'Feb', sales: 0, artworks: 0 },
            { month: 'Mar', sales: 0, artworks: 0 },
            { month: 'Apr', sales: 0, artworks: 0 },
            { month: 'Mei', sales: 0, artworks: 0 },
            { month: 'Jun', sales: 0, artworks: 0 },
          ];
        }

        setSalesChartData(monthlySalesData);
        setTotalSales(formatCurrency(totalSalesAmount));

        // Fetch activities
        try {
          const activitiesResult = await activityService.getRecent(userId, 5);
          const mappedActivities: ActivityItem[] = activitiesResult.map((activity, index) => ({
            id: index + 1,
            type: mapActivityType(activity.activity_type),
            title: activity.title || getActivityTitle(activity.activity_type),
            description: activity.description || '',
            time: activity.relativeTime || formatRelativeDate(activity.created_at),
            icon: getActivityIcon(activity.activity_type),
            color: activity.color || getActivityColor(activity.activity_type),
          }));
          setRecentActivities(mappedActivities);
        } catch (e) {
          console.warn('Could not fetch activities:', e);
          setRecentActivities([]);
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
            value: statusCounts.wip.toString(),
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
