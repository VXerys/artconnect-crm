import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CalendarClock, 
  ArrowRight,
  Play,
  Pause,
  Edit2,
  Trash2,
  Mail,
  Clock,
  Plus,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScheduledReport } from "./types";

interface ScheduledReportsListProps {
  reports: ScheduledReport[];
  onToggle: (reportId: number) => void;
  onEdit: (reportId: number) => void;
  onDelete: (reportId: number) => void;
  onAdd: () => void;
  maxHeight?: string; 
}

const frequencyLabels = {
  daily: { label: "Harian", color: "text-blue-400", bgColor: "bg-blue-500/10" },
  weekly: { label: "Mingguan", color: "text-purple-400", bgColor: "bg-purple-500/10" },
  monthly: { label: "Bulanan", color: "text-emerald-400", bgColor: "bg-emerald-500/10" },
};

export const ScheduledReportsList = ({ 
  reports, 
  onToggle, 
  onEdit, 
  onDelete,
  onAdd,
  maxHeight = "380px",
}: ScheduledReportsListProps) => {

  return (
    <Card className="bg-card border-border overflow-hidden w-full h-full flex flex-col">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <CalendarClock className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Laporan Terjadwal</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {reports.filter(r => r.isActive).length} aktif dari {reports.length} jadwal
            </p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2 text-blue-400 hover:text-blue-400"
          onClick={onAdd}
        >
          Kelola
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardHeader>

      {/* List */}
      <CardContent className="p-0 flex flex-col flex-1 overflow-hidden relative">
        {reports.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent opacity-50" />
            
            <div className="relative z-10 bg-card border border-border/50 p-4 rounded-full mb-4 shadow-xl shadow-primary/10">
              <CalendarClock className="w-8 h-8 text-primary" />
            </div>
            
            <h3 className="relative z-10 font-display font-medium text-lg mb-2">
              Otomatisasi Laporan
            </h3>
            <p className="relative z-10 text-muted-foreground text-sm max-w-[200px] mb-6 leading-relaxed">
              Jadwalkan laporan rutin agar terkirim otomatis ke email Anda.
            </p>
            
            <Button onClick={onAdd} className="relative z-10 shadow-glow gap-2" size="sm">
              <Plus className="w-4 h-4" />
              Buat Jadwal Baru
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable List */}
            <div 
              className="divide-y divide-border/50 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex-1"
              style={{ maxHeight }}
            >
              {reports.map((report, index) => {
                const freq = frequencyLabels[report.frequency as keyof typeof frequencyLabels] || frequencyLabels.monthly;

                return (
                  <div 
                    key={report.id}
                    className={cn(
                      "group flex items-center gap-4 px-6 py-4",
                      "hover:bg-secondary/40 transition-all duration-300",
                      !report.isActive && "opacity-60 grayscale-[0.5]"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Status indicator */}
                    <button
                      onClick={() => onToggle(report.id)}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border",
                        "transition-all duration-300 hover:scale-105 hover:shadow-lg",
                        report.isActive 
                          ? "bg-primary/10 border-primary/20 text-primary shadow-primary/10" 
                          : "bg-secondary border-border text-muted-foreground"
                      )}
                      title={report.isActive ? "Nonaktifkan jadwal" : "Aktifkan jadwal"}
                    >
                      {report.isActive ? (
                        <Pause className="w-4 h-4 fill-current" />
                      ) : (
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      )}
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate text-sm sm:text-base group-hover:text-primary transition-colors">
                        {report.name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[10px] uppercase tracking-wider font-semibold border",
                          freq.bgColor,
                          freq.color,
                          "border-current/20"
                        )}>
                          {freq.label}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span className="truncate max-w-[80px]">{report.nextRun}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-2 group-hover:translate-x-0">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary rounded-lg"
                        onClick={() => onEdit(report.id)}
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive rounded-lg"
                        onClick={() => onDelete(report.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer - Add New Schedule Button & Tips */}
            <div className="p-4 border-t border-border/50 space-y-4 flex-shrink-0 bg-secondary/10">
              {/* Add New Button */}
              <Button variant="outline" className="w-full gap-2 border-dashed border-primary/30 hover:border-primary hover:bg-primary/5 text-primary/80 hover:text-primary" onClick={onAdd}>
                <Plus className="w-4 h-4" />
                Buat Jadwal Baru
              </Button>

              {/* Tips Section */}
              <div className="flex gap-3 px-3 py-2 rounded-lg bg-blue-500/5 border border-blue-500/10">
                <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="font-medium text-blue-400">Tips:</span> Jadwalkan laporan mingguan untuk memantau performa bisnis.
                </p>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
