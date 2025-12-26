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
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Aktivitas Interaksi</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              6 bulan terakhir
            </p>
          </div>
        </div>
        
        {/* Summary stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-lg font-bold text-blue-400">{totalInteractions}</p>
          </div>
          <div className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
            isPositiveTrend 
              ? "bg-emerald-500/10 text-emerald-400" 
              : "bg-rose-500/10 text-rose-400"
          )}>
            {isPositiveTrend ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {Math.abs(trendPercent)}%
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        {/* Chart */}
        <div className="h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip 
                cursor={false}
                content={({ active, payload, label }: any) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                        <p className="font-medium text-sm">{label}</p>
                        <p className="text-blue-400 font-bold">
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
                radius={[6, 6, 0, 0]}
                maxBarSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
