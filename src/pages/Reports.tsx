import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { toast } from "sonner";

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
  recentReports,
  reportMetrics,
  scheduledReports as initialScheduledReports,
  salesSummary,
  CustomReportFormData,
} from "@/components/reports";

const Reports = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [scheduledReports, setScheduledReports] = useState(initialScheduledReports);

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <ReportsHero 
          totalReports={recentReports.length}
          lastReportDate="16 Des 2024"
        />

        {/* Metrics Grid */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-4 bg-emerald-400 rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Ringkasan Performa
            </h2>
          </div>
          <ReportMetricsGrid metrics={reportMetrics} />
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
