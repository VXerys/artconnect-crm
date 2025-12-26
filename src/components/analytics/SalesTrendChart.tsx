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
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Trend Penjualan</CardTitle>
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

      <CardContent className="p-6">
        {/* Summary */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Total Penjualan</p>
            <p className="text-2xl font-bold text-primary">
              {formatCompactCurrency(totalSales)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Bulan Ini</p>
            <p className="text-lg font-semibold">
              {formatCompactCurrency(lastMonth)}
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="h-[280px]">
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
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickFormatter={(value) => `${(value / 1000000)}M`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={false}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
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
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: 'hsl(var(--primary))', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
