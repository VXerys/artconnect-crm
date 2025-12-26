import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Sparkles, 
  Calendar,
  Download,
} from "lucide-react";

interface ReportsHeroProps {
  totalReports: number;
  lastReportDate: string;
}

export const ReportsHero = ({ 
  totalReports,
  lastReportDate,
}: ReportsHeroProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/5 via-background to-emerald-500/5 border border-border p-6 lg:p-8">
      {/* Decorative elements */}
      <div className="absolute -top-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-purple-500/10 rounded-full blur-xl" />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left side */}
        <div className="space-y-4">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-sm text-muted-foreground">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            Pusat Laporan & Export
          </div>

          {/* Title */}
          <div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold">
              Laporan & <span className="text-primary">Analitik</span>
            </h1>
            <p className="text-muted-foreground mt-2 text-lg max-w-xl">
              Generate laporan bisnis yang komprehensif dan download dalam berbagai format.
            </p>
          </div>

          {/* Summary stats */}
          <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <FileText className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="font-bold text-xl">{totalReports}</span>
                <span className="text-muted-foreground text-sm ml-1">laporan</span>
              </div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Calendar className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <span className="text-muted-foreground text-sm">Terakhir: </span>
                <span className="font-medium">{lastReportDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
          <Button size="lg" className="gap-2 shadow-glow group">
            <Download className="w-5 h-5" />
            Generate Laporan Cepat
          </Button>
          <Button variant="outline" size="lg" className="gap-2">
            <Calendar className="w-5 h-5" />
            Jadwalkan Laporan
          </Button>
        </div>
      </div>
    </div>
  );
};
