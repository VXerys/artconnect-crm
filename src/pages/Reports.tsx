import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";
import { useReportsData } from "@/hooks/useReportsData";
import { Loader2 } from "lucide-react";

// Reports Components
import {
  ReportsHero,
  ReportMetricsGrid,
  ReportTypesGrid,
  CustomReportBuilder,
  RecentReportsList,
  SalesOverviewChart,
  ScheduledReportsList,
  reportTypes,
  recentReports as staticRecentReports,
  scheduledReports as initialScheduledReports,
  CustomReportFormData,
} from "@/components/reports";

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledReports, setScheduledReports] = useState(initialScheduledReports);
  const [recentReports, setRecentReports] = useState(staticRecentReports);

  // Fetch real data from Supabase
  const {
    metrics,
    salesSummary,
    totalReports,
    lastReportDate,
    loading,
    error,
  } = useReportsData();

  // Handle quick report generation
  const handleGenerateReport = (reportId: string, format: "csv" | "pdf") => {
    toast.success(`Generating ${format.toUpperCase()} report...`, {
      description: `Laporan ${reportId} sedang dibuat`,
    });
    
    // Simulate download
    setTimeout(() => {
      toast.success("Laporan berhasil dibuat!", {
        description: `File ${reportId}_report.${format} siap didownload`,
      });

      // Add to recent reports
      const newReport = {
        id: Date.now(),
        name: `${reportId}_${new Date().toISOString().split('T')[0]}.${format}`,
        type: reportId as 'inventory' | 'sales' | 'contacts' | 'activity',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        size: `${Math.floor(Math.random() * 100 + 20)} KB`,
        format: format as 'csv' | 'pdf' | 'xlsx',
        status: 'completed' as const,
      };
      setRecentReports(prev => [newReport, ...prev].slice(0, 10));
    }, 1500);
  };

  // Handle custom report generation
  const handleCustomReportGenerate = (formData: CustomReportFormData) => {
    setIsGenerating(true);
    
    toast.success("Memproses laporan kustom...", {
      description: `Tipe: ${formData.reportType}, Format: ${formData.format.toUpperCase()}`,
    });

    // Simulate generation
    setTimeout(() => {
      setIsGenerating(false);
      toast.success("Laporan kustom berhasil dibuat!", {
        description: "File siap didownload",
      });

      // Add to recent reports
      const newReport = {
        id: Date.now(),
        name: `custom_${formData.reportType}_${new Date().toISOString().split('T')[0]}.${formData.format}`,
        type: formData.reportType as 'inventory' | 'sales' | 'contacts' | 'activity',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        size: `${Math.floor(Math.random() * 100 + 50)} KB`,
        format: formData.format as 'csv' | 'pdf' | 'xlsx',
        status: 'completed' as const,
      };
      setRecentReports(prev => [newReport, ...prev].slice(0, 10));
    }, 2000);
  };

  // Handle schedule report
  const handleScheduleReport = () => {
    toast.info("Fitur jadwal laporan", {
      description: "Akan segera tersedia",
    });
  };

  // Handle download recent report
  const handleDownloadReport = (reportId: number) => {
    const report = recentReports.find(r => r.id === reportId);
    if (report) {
      toast.success(`Downloading ${report.name}...`);
    }
  };

  // Handle delete recent report
  const handleDeleteReport = (reportId: number) => {
    setRecentReports(prev => prev.filter(r => r.id !== reportId));
    toast.success("Laporan dihapus");
  };

  // Handle toggle scheduled report
  const handleToggleScheduledReport = (reportId: number) => {
    setScheduledReports(prev => 
      prev.map(r => 
        r.id === reportId ? { ...r, isActive: !r.isActive } : r
      )
    );
    const report = scheduledReports.find(r => r.id === reportId);
    toast.success(report?.isActive ? "Jadwal dinonaktifkan" : "Jadwal diaktifkan");
  };

  // Handle edit scheduled report
  const handleEditScheduledReport = (reportId: number) => {
    toast.info("Edit jadwal", {
      description: "Akan segera tersedia",
    });
  };

  // Handle delete scheduled report
  const handleDeleteScheduledReport = (reportId: number) => {
    setScheduledReports(prev => prev.filter(r => r.id !== reportId));
    toast.success("Jadwal dihapus");
  };

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">Memuat data laporan...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <p className="text-destructive">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="text-primary hover:underline"
            >
              Coba lagi
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <ReportsHero 
          totalReports={recentReports.length || totalReports}
          lastReportDate={recentReports[0]?.date || lastReportDate}
        />

        {/* Metrics Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-emerald-400 rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Ringkasan Performa
            </h2>
          </div>
          <ReportMetricsGrid metrics={metrics} />
        </section>

        {/* Report Types Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Tipe Laporan
            </h2>
          </div>
          <ReportTypesGrid 
            reportTypes={reportTypes}
            onGenerateReport={handleGenerateReport}
          />
        </section>

        {/* Custom Report Builder */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-purple-400 rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Laporan Kustom
            </h2>
          </div>
          <CustomReportBuilder 
            onGenerate={handleCustomReportGenerate}
            onSchedule={handleScheduleReport}
            isGenerating={isGenerating}
          />
        </section>

        {/* Sales Overview - Full Width */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-emerald-400 rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Analitik Penjualan
            </h2>
          </div>
          <SalesOverviewChart data={salesSummary} />
        </section>

        {/* Recent Reports & Scheduled Reports - Side by Side */}
        <div className="grid lg:grid-cols-5 gap-6 items-stretch">
          {/* Recent Reports - Takes more space (3 columns) */}
          <div className="lg:col-span-3 flex">
            <RecentReportsList 
              reports={recentReports}
              onDownload={handleDownloadReport}
              onDelete={handleDeleteReport}
            />
          </div>

          {/* Scheduled Reports - Takes less space (2 columns) */}
          <div className="lg:col-span-2 flex">
            <ScheduledReportsList 
              reports={scheduledReports}
              onToggle={handleToggleScheduledReport}
              onEdit={handleEditScheduledReport}
              onDelete={handleDeleteScheduledReport}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
