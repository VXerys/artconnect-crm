import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Palette, 
  Users, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const stats = [
  {
    title: "Total Karya",
    value: "24",
    change: "+3",
    trend: "up",
    icon: Palette,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    title: "Kontak Aktif",
    value: "156",
    change: "+12",
    trend: "up",
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    title: "Penjualan Bulan Ini",
    value: "Rp 45.5M",
    change: "+23%",
    trend: "up",
    icon: DollarSign,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Interaksi",
    value: "89",
    change: "-5",
    trend: "down",
    icon: TrendingUp,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const recentArtworks = [
  { id: 1, title: "Sunset Horizon", status: "finished", price: "Rp 15.000.000", date: "2 hari lalu" },
  { id: 2, title: "Urban Dreams", status: "wip", price: "-", date: "5 hari lalu" },
  { id: 3, title: "Abstract Motion", status: "sold", price: "Rp 25.000.000", date: "1 minggu lalu" },
  { id: 4, title: "Nature's Call", status: "concept", price: "-", date: "2 minggu lalu" },
];

const recentContacts = [
  { id: 1, name: "Galeri Nasional", type: "Galeri", lastContact: "Kemarin" },
  { id: 2, name: "Ahmad Wijaya", type: "Kolektor", lastContact: "3 hari lalu" },
  { id: 3, name: "Museum Modern", type: "Museum", lastContact: "1 minggu lalu" },
];

const getStatusBadge = (status: string) => {
  const styles = {
    concept: "status-concept",
    wip: "status-wip",
    finished: "status-finished",
    sold: "status-sold",
  };
  const labels = {
    concept: "Konsep",
    wip: "Proses",
    finished: "Selesai",
    sold: "Terjual",
  };
  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
      {labels[status as keyof typeof labels]}
    </span>
  );
};

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Selamat datang kembali! Ini ringkasan aktivitas Anda.</p>
          </div>
          <Link to="/artworks">
            <Button variant="default" className="gap-2">
              <Plus className="w-4 h-4" />
              Tambah Karya Baru
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="bg-card border-border hover:border-primary/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                    <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-xs font-medium ${stat.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {stat.change}
                    {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  </div>
                </div>
                <div className="mt-3">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.title}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Artworks */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-display text-lg">Karya Terbaru</CardTitle>
              <Link to="/artworks">
                <Button variant="ghost" size="sm">Lihat Semua</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentArtworks.map((artwork) => (
                  <div key={artwork.id} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center">
                        <Palette className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <div className="font-medium">{artwork.title}</div>
                        <div className="text-sm text-muted-foreground">{artwork.date}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {getStatusBadge(artwork.status)}
                      <span className="text-sm font-medium hidden sm:block">{artwork.price}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Contacts */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="font-display text-lg">Kontak Terbaru</CardTitle>
              <Link to="/contacts">
                <Button variant="ghost" size="sm">Lihat Semua</Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {recentContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {contact.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-sm">{contact.name}</div>
                        <div className="text-xs text-muted-foreground">{contact.type}</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">{contact.lastContact}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Aksi Cepat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link to="/artworks">
                <Button variant="gallery" className="w-full h-auto py-6 flex-col gap-2">
                  <Palette className="w-6 h-6 text-primary" />
                  <span>Tambah Karya</span>
                </Button>
              </Link>
              <Link to="/contacts">
                <Button variant="gallery" className="w-full h-auto py-6 flex-col gap-2">
                  <Users className="w-6 h-6 text-primary" />
                  <span>Tambah Kontak</span>
                </Button>
              </Link>
              <Link to="/pipeline">
                <Button variant="gallery" className="w-full h-auto py-6 flex-col gap-2">
                  <TrendingUp className="w-6 h-6 text-primary" />
                  <span>Lihat Pipeline</span>
                </Button>
              </Link>
              <Link to="/reports">
                <Button variant="gallery" className="w-full h-auto py-6 flex-col gap-2">
                  <DollarSign className="w-6 h-6 text-primary" />
                  <span>Catat Penjualan</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
