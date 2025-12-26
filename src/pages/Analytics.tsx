import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

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
  analyticsStats,
  salesData,
  artworkStatusData,
  contactActivityData,
  topArtworks,
  trafficSources,
  DateRange,
} from "@/components/analytics";

const Analytics = () => {
  const [selectedRange, setSelectedRange] = useState<DateRange>("30d");

  // Calculate total revenue
  const totalRevenue = salesData.reduce((sum, d) => sum + d.value, 0);
  const formatTotalRevenue = totalRevenue >= 1000000 
    ? `Rp ${(totalRevenue / 1000000).toFixed(1)}M` 
    : `Rp ${totalRevenue.toLocaleString()}`;

  // Calculate growth
  const lastMonth = salesData[salesData.length - 1]?.value || 0;
  const prevMonth = salesData[salesData.length - 2]?.value || 0;
  const revenueGrowth = prevMonth > 0 
    ? `+${Math.round(((lastMonth - prevMonth) / prevMonth) * 100)}%` 
    : "+0%";

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
          <AnalyticsStatsGrid stats={analyticsStats} />
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
