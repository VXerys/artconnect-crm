import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Palette, TrendingUp, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ArtworkStatusData } from "./types";

interface ArtworkStatusChartProps {
  data: ArtworkStatusData[];
}

export const ArtworkStatusChart = ({ data }: ArtworkStatusChartProps) => {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  const soldCount = data.find(d => d.name === "Terjual")?.value || 0;
  const completedCount = data.find(d => d.name === "Selesai")?.value || 0;
  const wipCount = data.find(d => d.name === "Proses")?.value || 0;
  const conversionRate = total > 0 ? Math.round((soldCount / total) * 100) : 0;

  return (
    <Card className="bg-card border-border overflow-hidden h-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-3 sm:pb-4 border-b border-border px-3 sm:px-4 md:px-6 pt-3 sm:pt-4 md:pt-6">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="p-1.5 sm:p-2 rounded-md sm:rounded-lg bg-purple-500/10">
            <Palette className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
          </div>
          <div>
            <CardTitle className="font-display text-sm sm:text-base md:text-lg">Status Karya</CardTitle>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              Distribusi {total} karya
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3 sm:p-4 md:p-6 flex-1 flex flex-col">
        {total === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-8 sm:py-10 md:py-12 text-center flex-1">
            <div className="relative mb-3 sm:mb-4">
              <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative p-3 sm:p-4 rounded-full bg-secondary/50 border-2 border-dashed border-border">
                <Palette className="w-6 h-6 sm:w-8 sm:h-8 text-muted-foreground" />
              </div>
            </div>
            <h3 className="text-sm sm:text-base font-semibold mb-1 sm:mb-1.5">Belum Ada Karya</h3>
            <p className="text-[10px] sm:text-xs text-muted-foreground max-w-[200px] sm:max-w-xs">
              Grafik status akan muncul setelah Anda menambahkan karya seni
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-5 md:gap-6">
            {/* Pie Chart */}
            <div className="h-[140px] sm:h-[160px] md:h-[180px] w-full lg:w-1/2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip 
                    cursor={false}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                      fontSize: '12px',
                    }}
                    formatter={(value: number, name: string) => [`${value} karya`, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

          {/* Legend with Stats */}
          <div className="flex-1 w-full space-y-2 sm:space-y-3">
            {data.map((item) => {
              const percentage = Math.round((item.value / total) * 100);
              
              return (
                <div key={item.name} className="group">
                  <div className="flex items-center justify-between mb-0.5 sm:mb-1">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <div 
                        className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="text-xs sm:text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="font-bold text-xs sm:text-sm" style={{ color: item.color }}>
                        {item.value}
                      </span>
                      <span className="text-[10px] sm:text-xs text-muted-foreground">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1 sm:h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${percentage}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}

        {/* Summary Stats - Fills empty space */}
        <div className="mt-auto pt-3 sm:pt-4 md:pt-5 border-t border-border">
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {/* Conversion Rate */}
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-amber-400" />
                <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Konversi</span>
              </div>
              <p className="text-sm sm:text-base md:text-lg font-bold text-amber-400">{conversionRate}%</p>
            </div>

            {/* Ready to Sell */}
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Siap Jual</span>
              </div>
              <p className="text-sm sm:text-base md:text-lg font-bold text-emerald-400">{completedCount}</p>
            </div>

            {/* In Progress */}
            <div className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-1 sm:gap-2 mb-0.5 sm:mb-1">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-blue-400" />
                <span className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground">Dikerjakan</span>
              </div>
              <p className="text-sm sm:text-base md:text-lg font-bold text-blue-400">{wipCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
