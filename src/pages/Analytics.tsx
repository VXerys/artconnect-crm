import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAnalyticsData } from "@/hooks/useAnalyticsData";
import { Loader2 } from "lucide-react";

// Analytics Components
import {
  AnalyticsHero,
  AnalyticsStatsGrid,
  SalesTrendChart,
  ArtworkStatusChart,
  ContactActivityChart,
  TopArtworksList,
  TrafficSourcesCard,
  QuickInsightsCard,
  DateRange,
} from "@/components/analytics";

const Analytics = () => {
  const [selectedRange, setSelectedRange] = useState<DateRange>("30d");
  
  // Fetch real data from Supabase
  const {
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
  } = useAnalyticsData();

  // Format total revenue for display
  const formatTotalRevenue = totalRevenue >= 1000000 
    ? `Rp ${(totalRevenue / 1000000).toFixed(1)}M` 
    : `Rp ${totalRevenue.toLocaleString('id-ID')}`;

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Memuat data analitik...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-primary hover:underline"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <AnalyticsHero 
          totalRevenue={formatTotalRevenue}
          revenueGrowth={revenueGrowth}
          selectedRange={selectedRange}
          onRangeChange={setSelectedRange}
        />

        {/* Stats Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Ringkasan Performa
            </h2>
          </div>
          <AnalyticsStatsGrid stats={stats} />
        </section>

        {/* Charts Row - Sales Trend & Artwork Status */}
        <div className="grid lg:grid-cols-2 gap-6">
          <section>
            <SalesTrendChart data={salesData} />
          </section>
          <section>
            <ArtworkStatusChart data={artworkStatusData} />
          </section>
        </div>

        {/* Contact Activity - Full Width */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-blue-400 rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Aktivitas & Interaksi
            </h2>
          </div>
          <ContactActivityChart data={contactActivityData} />
        </section>

        {/* Top Artworks & Traffic Sources - Side by Side */}
        <div className="grid lg:grid-cols-5 gap-6 items-stretch">
          <div className="lg:col-span-3 flex">
            <TopArtworksList artworks={topArtworks} />
          </div>
          <div className="lg:col-span-2 flex">
            <TrafficSourcesCard sources={trafficSources} />
          </div>
        </div>

        {/* Quick Insights */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-amber-400 rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Insight & Rekomendasi
            </h2>
          </div>
          <QuickInsightsCard />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
