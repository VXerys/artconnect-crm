import DashboardLayout from "@/components/layout/DashboardLayout";
import { useDashboardData } from "@/hooks/useDashboardData";
import { Loader2 } from "lucide-react";

// Dashboard Components
import {
  DashboardHero,
  StatsGrid,
  RecentArtworks,
  RecentContacts,
  ActivityFeed,
  QuickActions,
  SalesChart,
  ArtworkStatusSummary,
  quickActions,
} from "@/components/dashboard";

const Dashboard = () => {
  const {
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
  } = useDashboardData();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Memuat dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

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
        <DashboardHero 
          userName={userName}
          totalArtworks={totalArtworks}
          totalSales={totalSales}
        />

        {/* Stats Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Statistik Utama
            </h2>
          </div>
          <StatsGrid stats={stats} />
        </section>

        {/* Recent Artworks - Full width */}
        <section>
          <RecentArtworks artworks={recentArtworks} />
        </section>

        {/* Artwork Status Summary - Full width */}
        <section>
          <ArtworkStatusSummary 
            statusCounts={artworkStatusCounts}
            totalArtworks={totalArtworks}
          />
        </section>

        {/* Sales Chart & Recent Contacts - Side by Side with Equal Heights */}
        <div className="grid lg:grid-cols-5 gap-6 items-stretch">
          {/* Sales Chart - Takes 3 columns */}
          <div className="lg:col-span-3 flex">
            <SalesChart data={salesChartData} />
          </div>

          {/* Recent Contacts - Takes 2 columns */}
          <div className="lg:col-span-2 flex">
            <RecentContacts contacts={recentContacts} />
          </div>
        </div>

        {/* Activity Feed */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-amber-400 rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Aktivitas Terkini
            </h2>
          </div>
          <ActivityFeed activities={recentActivities} />
        </section>

        {/* Quick Actions */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Aksi Cepat
            </h2>
          </div>
          <QuickActions actions={quickActions} />
        </section>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
