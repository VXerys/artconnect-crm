import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { artworksService } from '@/lib/services/artworks.service';
import { contactsService } from '@/lib/services/contacts.service';
import { salesService } from '@/lib/services/sales.service';
import type { ReportMetric, SalesSummary } from '@/components/reports/types';
import { DollarSign, ShoppingBag, Palette, TrendingUp } from 'lucide-react';

interface ReportsData {
  metrics: ReportMetric[];
  salesSummary: SalesSummary;
  totalReports: number;
  lastReportDate: string;
  loading: boolean;
  error: string | null;
}

export const useReportsData = (): ReportsData => {
  const { profile } = useAuth();
  const userId = profile?.id || null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [metrics, setMetrics] = useState<ReportMetric[]>([]);
  const [salesSummary, setSalesSummary] = useState<SalesSummary>({
    totalSales: 0,
    totalArtworks: 0,
    averagePrice: 0,
    topArtwork: { title: 'N/A', price: 0 },
    monthlyData: [],
  });
  const [totalReports] = useState(0);
  const [lastReportDate] = useState('Belum ada');

  useEffect(() => {
    const fetchReportsData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Get artwork counts
        const statusCounts = await artworksService.getCountByStatus(userId);
        const totalArtworks = Object.values(statusCounts).reduce((a, b) => a + b, 0);
        const soldCount = statusCounts.sold;

        // Get sales data
        let totalSalesAmount = 0;
        let monthlyData: Array<{ month: string; sales: number; count: number }> = [];
        let topArtworkData = { title: 'N/A', price: 0 };
        let conversionRate = 0;

        try {
          const salesResult = await salesService.getAll(userId, {}, { limit: 500 });
          totalSalesAmount = salesResult.data.reduce((sum, sale) => sum + (sale.amount || 0), 0);
          
          // Calculate conversion rate (sold / total artworks)
          conversionRate = totalArtworks > 0 ? Math.round((soldCount / totalArtworks) * 100) : 0;
          
          // Group sales by month
          const salesByMonth: Record<string, { sales: number; count: number }> = {};
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
          const now = new Date();
          
          salesResult.data.forEach(sale => {
            const date = new Date(sale.created_at);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            if (!salesByMonth[monthKey]) {
              salesByMonth[monthKey] = { sales: 0, count: 0 };
            }
            salesByMonth[monthKey].sales += sale.amount || 0;
            salesByMonth[monthKey].count += 1;
          });

          // Get last 6 months for chart
          for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
            const data = salesByMonth[monthKey] || { sales: 0, count: 0 };
            monthlyData.push({
              month: monthNames[date.getMonth()],
              sales: data.sales,
              count: data.count,
            });
          }

          // Get top selling artwork
          const topSale = salesResult.data
            .sort((a, b) => (b.amount || 0) - (a.amount || 0))[0];
          if (topSale) {
            topArtworkData = {
              title: topSale.title || 'Artwork',
              price: topSale.amount || 0,
            };
          }
        } catch (e) {
          console.warn('Could not fetch sales data:', e);
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];
          monthlyData = monthNames.map(month => ({ month, sales: 0, count: 0 }));
        }

        // Get contacts count
        const contactsResult = await contactsService.getAll(userId, {}, { limit: 1 });
        const totalContacts = contactsResult.count;

        // Calculate average price
        const avgPrice = soldCount > 0 ? Math.round(totalSalesAmount / soldCount) : 0;

        // Set sales summary
        setSalesSummary({
          totalSales: totalSalesAmount,
          totalArtworks: soldCount,
          averagePrice: avgPrice,
          topArtwork: topArtworkData,
          monthlyData,
        });

        // Set metrics
        setMetrics([
          {
            id: "total-sales",
            label: "Total Penjualan",
            value: formatCompactCurrency(totalSalesAmount),
            change: "+0%",
            trend: "up" as const,
            icon: DollarSign,
            color: "text-emerald-400",
            bgColor: "bg-emerald-500/10",
          },
          {
            id: "artworks-sold",
            label: "Karya Terjual",
            value: soldCount.toString(),
            change: "+0",
            trend: "up" as const,
            icon: ShoppingBag,
            color: "text-purple-400",
            bgColor: "bg-purple-500/10",
          },
          {
            id: "total-artworks",
            label: "Total Karya",
            value: totalArtworks.toString(),
            change: "+0",
            trend: "up" as const,
            icon: Palette,
            color: "text-blue-400",
            bgColor: "bg-blue-500/10",
          },
          {
            id: "conversion-rate",
            label: "Conversion Rate",
            value: `${conversionRate}%`,
            change: "+0%",
            trend: "up" as const,
            icon: TrendingUp,
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
        ]);

      } catch (err) {
        console.error('Error fetching reports data:', err);
        setError('Gagal memuat data laporan');
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, [userId]);

  return {
    metrics,
    salesSummary,
    totalReports,
    lastReportDate,
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

export default useReportsData;
