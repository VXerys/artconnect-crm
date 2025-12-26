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
  maxHeight?: string; // Optional max height for scroll area
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
  maxHeight = "280px",
}: ScheduledReportsListProps) => {
  return (
    <Card className="bg-card border-border overflow-hidden h-full flex flex-col w-full">
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
        <Button variant="ghost" size="sm" className="gap-2 text-blue-400 hover:text-blue-400">
          Kelola
          <ArrowRight className="w-4 h-4" />
        </Button>
      </CardHeader>

      {/* List */}
      <CardContent className="p-0 flex flex-col flex-1 overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-8 text-center flex-1 flex flex-col items-center justify-center">
            <CalendarClock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">
              Belum ada laporan terjadwal
            </p>
            <Button variant="outline" size="sm" className="mt-3 gap-2">
              <Plus className="w-4 h-4" />
              Buat Jadwal Baru
            </Button>
          </div>
        ) : (
          <>
            {/* Scrollable List */}
            <div 
              className="divide-y divide-border overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent flex-1"
              style={{ maxHeight }}
            >
              {reports.map((report, index) => {
                const freq = frequencyLabels[report.frequency];

                return (
                  <div 
                    key={report.id}
                    className={cn(
                      "group flex items-center gap-4 px-6 py-4",
                      "hover:bg-secondary/30 transition-all duration-200",
                      !report.isActive && "opacity-50"
                    )}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    {/* Status indicator */}
                    <button
                      onClick={() => onToggle(report.id)}
                      className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                        "transition-all duration-300 hover:scale-110",
                        report.isActive 
                          ? "bg-emerald-500/10 text-emerald-400" 
                          : "bg-secondary text-muted-foreground"
                      )}
                    >
                      {report.isActive ? (
                        <Pause className="w-5 h-5" />
                      ) : (
                        <Play className="w-5 h-5" />
                      )}
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{report.name}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-xs font-medium",
                          freq.bgColor,
                          freq.color
                        )}>
                          {freq.label}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>Berikutnya: {report.nextRun}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="w-3 h-3" />
                          <span>{report.recipients.length} penerima</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                        onClick={() => onEdit(report.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => onDelete(report.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer - Add New Schedule Button & Tips */}
            <div className="p-4 border-t border-border space-y-4 flex-shrink-0">
              {/* Add New Button */}
              <Button variant="outline" className="w-full gap-2">
                <Plus className="w-4 h-4" />
                Buat Jadwal Baru
              </Button>

              {/* Tips Section */}
              <div className="p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <h5 className="text-xs font-semibold text-blue-400 mb-1">Tips Otomasi</h5>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Jadwalkan laporan penjualan mingguan untuk memantau performa bisnis secara konsisten.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
