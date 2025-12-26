import DashboardLayout from "@/components/layout/DashboardLayout";

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
  dashboardStats,
  recentArtworks,
  recentContacts,
  recentActivities,
  quickActions,
  salesChartData,
} from "@/components/dashboard";

const Dashboard = () => {
  // Calculate artwork status counts (in real app, this would come from API)
  const artworkStatusCounts = {
    concept: 4,
    wip: 6,
    finished: 8,
    sold: 6,
  };
  const totalArtworks = Object.values(artworkStatusCounts).reduce((a, b) => a + b, 0);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <DashboardHero 
          userName="Seniman"
          totalArtworks={totalArtworks}
          totalSales="Rp 45.5M"
        />

        {/* Stats Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Statistik Utama
            </h2>
          </div>
          <StatsGrid stats={dashboardStats} />
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
