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
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-purple-500/10">
            <Palette className="w-5 h-5 text-purple-400" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Status Karya</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              Distribusi {total} karya
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex flex-col lg:flex-row items-center gap-6">
          {/* Pie Chart */}
          <div className="h-[180px] w-full lg:w-1/2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
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
                  }}
                  formatter={(value: number, name: string) => [`${value} karya`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend with Stats */}
          <div className="flex-1 w-full space-y-3">
            {data.map((item) => {
              const percentage = Math.round((item.value / total) * 100);
              
              return (
                <div key={item.name} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }} 
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold" style={{ color: item.color }}>
                        {item.value}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ({percentage}%)
                      </span>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
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

        {/* Summary Stats - Fills empty space */}
        <div className="mt-auto pt-5 border-t border-border">
          <div className="grid grid-cols-3 gap-3">
            {/* Conversion Rate */}
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span className="text-xs text-muted-foreground">Konversi</span>
              </div>
              <p className="text-lg font-bold text-amber-400">{conversionRate}%</p>
            </div>

            {/* Ready to Sell */}
            <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-4 h-4 text-emerald-400" />
                <span className="text-xs text-muted-foreground">Siap Jual</span>
              </div>
              <p className="text-lg font-bold text-emerald-400">{completedCount}</p>
            </div>

            {/* In Progress */}
            <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span className="text-xs text-muted-foreground">Dikerjakan</span>
              </div>
              <p className="text-lg font-bold text-blue-400">{wipCount}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
