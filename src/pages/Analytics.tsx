import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  TrendingDown,
  Palette,
  Users,
  DollarSign,
  Activity
} from "lucide-react";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts";

const salesData = [
  { month: "Jul", value: 15000000 },
  { month: "Agu", value: 22000000 },
  { month: "Sep", value: 18000000 },
  { month: "Okt", value: 35000000 },
  { month: "Nov", value: 28000000 },
  { month: "Des", value: 45500000 },
];

const artworkStats = [
  { name: "Konsep", value: 5, color: "#a855f7" },
  { name: "Proses", value: 8, color: "#3b82f6" },
  { name: "Selesai", value: 7, color: "#22c55e" },
  { name: "Terjual", value: 4, color: "#f59e0b" },
];

const contactActivity = [
  { month: "Jul", interactions: 12 },
  { month: "Agu", interactions: 18 },
  { month: "Sep", interactions: 15 },
  { month: "Okt", interactions: 25 },
  { month: "Nov", interactions: 22 },
  { month: "Des", interactions: 30 },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const Analytics = () => {
  const totalSales = salesData.reduce((acc, curr) => acc + curr.value, 0);
  const lastMonthSales = salesData[salesData.length - 1].value;
  const previousMonthSales = salesData[salesData.length - 2].value;
  const salesGrowth = ((lastMonthSales - previousMonthSales) / previousMonthSales * 100).toFixed(1);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold">Analitik</h1>
          <p className="text-muted-foreground">Pantau performa dan insight bisnis seni Anda</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-primary" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                  +{salesGrowth}%
                  <TrendingUp className="w-3 h-3" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold">{formatCurrency(lastMonthSales)}</div>
                <div className="text-sm text-muted-foreground">Penjualan Bulan Ini</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-purple-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                  +3
                  <TrendingUp className="w-3 h-3" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-muted-foreground">Total Karya</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-emerald-400">
                  +12
                  <TrendingUp className="w-3 h-3" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold">156</div>
                <div className="text-sm text-muted-foreground">Total Kontak</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex items-center gap-1 text-xs font-medium text-rose-400">
                  -5
                  <TrendingDown className="w-3 h-3" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-2xl font-bold">89</div>
                <div className="text-sm text-muted-foreground">Interaksi Bulan Ini</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Sales Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">Trend Penjualan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <YAxis 
                      stroke="hsl(var(--muted-foreground))" 
                      fontSize={12}
                      tickFormatter={(value) => `${(value / 1000000)}M`}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                      formatter={(value: number) => [formatCurrency(value), 'Penjualan']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="value" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Artwork Status Pie Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-lg">Status Karya</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={artworkStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {artworkStats.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 flex-wrap mt-4">
                {artworkStats.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-muted-foreground">{item.name}: {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Activity */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Aktivitas Interaksi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={contactActivity}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="interactions" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
