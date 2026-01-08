import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { SalesDataPoint } from "./types";
import { formatCurrency, formatCompactCurrency } from "./constants";

interface SalesTrendChartProps {
  data: SalesDataPoint[];
}

export const SalesTrendChart = ({ data }: SalesTrendChartProps) => {
  // Calculate totals and trends
  const totalSales = data.reduce((sum, d) => sum + d.value, 0);
  const lastMonth = data[data.length - 1]?.value || 0;
  const prevMonth = data[data.length - 2]?.value || 0;
  const trendPercent = prevMonth > 0 
    ? Math.round(((lastMonth - prevMonth) / prevMonth) * 100) 
    : 0;
  const isPositiveTrend = trendPercent >= 0;

  return (
    <Card className="bg-card border-border overflow-hidden h-full">
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-border px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-primary/10">
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-sm sm:text-base md:text-lg">Trend Penjualan</CardTitle>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              6 bulan terakhir
            </p>
          </div>
        </div>
        
        {/* Trend indicator */}
        <div className={cn(
          "flex items-center gap-0.5 sm:gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium",
          isPositiveTrend 
            ? "bg-emerald-500/10 text-emerald-400" 
            : "bg-rose-500/10 text-rose-400"
        )}>
          {isPositiveTrend ? <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />}
          <span className="whitespace-nowrap">{Math.abs(trendPercent)}% vs bulan lalu</span>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-6">
        {totalSales === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 text-center">
            <div className="relative mb-3 sm:mb-4">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative p-3 sm:p-4 rounded-full bg-secondary/50 border-2 border-dashed border-border">
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-1.5">Belum Ada Data Penjualan</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">
              Grafik akan muncul setelah ada penjualan karya seni Anda
            </p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Total Penjualan</p>
                <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">
                  {formatCompactCurrency(totalSales)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Bulan Ini</p>
                <p className="text-sm sm:text-base md:text-lg font-semibold">
                  {formatCompactCurrency(lastMonth)}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[200px] sm:h-[240px] md:h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="month" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={10}
                    tickFormatter={(value) => `${(value / 1000000)}M`}
                    tickLine={false}
                    axisLine={false}
                    width={35}
                  />
                  <Tooltip 
                    cursor={false}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(value: number) => [formatCurrency(value), 'Penjualan']}
                    labelStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorSales)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
