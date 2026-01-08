import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from "recharts";
import { ContactActivityData } from "./types";

interface ContactActivityChartProps {
  data: ContactActivityData[];
}

export const ContactActivityChart = ({ data }: ContactActivityChartProps) => {
  // Calculate totals and trends
  const totalInteractions = data.reduce((sum, d) => sum + d.interactions, 0);
  const lastMonth = data[data.length - 1]?.interactions || 0;
  const prevMonth = data[data.length - 2]?.interactions || 0;
  const trendPercent = prevMonth > 0 
    ? Math.round(((lastMonth - prevMonth) / prevMonth) * 100) 
    : 0;
  const isPositiveTrend = trendPercent >= 0;

  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* Header */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pb-3 sm:pb-4 border-b border-border px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-blue-500/10">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="font-display text-sm sm:text-base md:text-lg">Aktivitas Interaksi</CardTitle>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              6 bulan terakhir
            </p>
          </div>
        </div>
        
        {/* Summary stats */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="text-right">
            <p className="text-[10px] sm:text-xs text-muted-foreground">Total</p>
            <p className="text-sm sm:text-base md:text-lg font-bold text-blue-400">{totalInteractions}</p>
          </div>
          <div className={cn(
            "flex items-center gap-0.5 sm:gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium",
            isPositiveTrend 
              ? "bg-emerald-500/10 text-emerald-400" 
              : "bg-rose-500/10 text-rose-400"
          )}>
            {isPositiveTrend ? <ArrowUp className="w-3 h-3 sm:w-4 sm:h-4" /> : <ArrowDown className="w-3 h-3 sm:w-4 sm:h-4" />}
            {Math.abs(trendPercent)}%
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-6">
        {totalInteractions === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 text-center">
            <div className="relative mb-3 sm:mb-4">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative p-3 sm:p-4 rounded-full bg-secondary/50 border-2 border-dashed border-border">
                <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-1.5">Belum Ada Aktivitas</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">
              Grafik akan muncul setelah ada interaksi dengan kontak Anda
            </p>
          </div>
        ) : (
          /* Chart */
          <div className="h-[160px] sm:h-[190px] md:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorInteractions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={1}/>
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.6}/>
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
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  width={30}
                />
                <Tooltip 
                  cursor={false}
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg p-2 sm:p-3 shadow-lg">
                          <p className="font-medium text-xs sm:text-sm">{label}</p>
                          <p className="text-blue-400 font-bold text-xs sm:text-sm">
                            {payload[0].value} interaksi
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar 
                  dataKey="interactions" 
                  fill="url(#colorInteractions)" 
                  radius={[4, 4, 0, 0]}
                  maxBarSize={40}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
