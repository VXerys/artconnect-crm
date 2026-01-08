import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { ChartDataPoint } from "./types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  data: ChartDataPoint[];
}

export const SalesChart = ({ data }: SalesChartProps) => {
  // Calculate totals
  const totalSales = data.reduce((sum, d) => sum + d.sales, 0);
  const totalArtworksSold = data.reduce((sum, d) => sum + (d.artworks || 0), 0);
  
  // Calculate trend (comparing last 2 months)
  const lastMonth = data[data.length - 1]?.sales || 0;
  const prevMonth = data[data.length - 2]?.sales || 0;
  const trendPercent = prevMonth > 0 
    ? Math.round(((lastMonth - prevMonth) / prevMonth) * 100) 
    : 0;
  const isPositiveTrend = trendPercent >= 0;

  // Format currency
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `Rp ${(value / 1000).toFixed(0)}K`;
    }
    return `Rp ${value}`;
  };

  // Format for Y axis
  const formatYAxis = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-emerald-400 font-bold">
            {formatCurrency(payload[0].value)}
          </p>
          {payload[0].payload.artworks && (
            <p className="text-xs text-muted-foreground mt-1">
              {payload[0].payload.artworks} karya terjual
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="bg-card border-border overflow-hidden h-full w-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <TrendingUp className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Ringkasan Penjualan</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              6 bulan terakhir
            </p>
          </div>
        </div>
        
        {/* Trend indicator */}
        <div className={cn(
          "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
          isPositiveTrend 
            ? "bg-emerald-500/10 text-emerald-400" 
            : "bg-rose-500/10 text-rose-400"
        )}>
          {isPositiveTrend ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
          {Math.abs(trendPercent)}% vs bulan lalu
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1">
        {totalSales === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 text-center h-full">
            <div className="relative mb-3 sm:mb-4">
              <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative p-3 sm:p-4 rounded-full bg-secondary/50 border-2 border-dashed border-border">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-1.5">Belum Ada Data Penjualan</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">
              Grafik akan muncul setelah ada transaksi penjualan karya seni Anda
            </p>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Penjualan</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {formatCurrency(totalSales)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Karya Terjual</p>
                <p className="text-lg font-semibold">
                  {totalArtworksSold} karya
                </p>
              </div>
            </div>

            {/* Bar Chart using Recharts */}
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorSalesDashboard" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                      <stop offset="100%" stopColor="#10b981" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid 
                    strokeDasharray="3 3" 
                    stroke="hsl(var(--border))" 
                    vertical={false}
                  />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12}
                    tickFormatter={formatYAxis}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={false} />
                  <Bar 
                    dataKey="sales" 
                    fill="url(#colorSalesDashboard)" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
