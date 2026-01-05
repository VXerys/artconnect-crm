import React, { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useAuth } from "@/context/AuthContext";
import { reportGeneratorService } from "@/lib/services/report-generator.service";
import useReportsData from "@/hooks/useReportsData";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  ReportsHero,
  ReportMetricsGrid,
  ReportTypesGrid,
  CustomReportBuilder,
  RecentReportsList,
  ScheduledReportsList,
  reportTypes,
  CustomReportFormData,
  ScheduledReport
} from "@/components/reports";
import { ScheduledReportDialog } from "@/components/reports/ScheduledReportDialog";

const Reports = () => {
  const { profile } = useAuth();
  const userId = profile?.id;
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Dialog state
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduledReport | undefined>(undefined);

  // Fetch data
  const {
    metrics,
    totalReports,
    lastReportDate,
    recentReports,
    scheduledReports,
    loading,
    error,
    refreshReports,
    addScheduledReport,
    updateScheduledReport,
    deleteScheduledReport
  } = useReportsData();

  // Handle quick report generation with AI
  const handleGenerateReport = async (reportId: string, format: "csv" | "pdf") => {
    if (!userId) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    setIsGenerating(true);
    toast.loading(`🤖 AI sedang menganalisis data dan membuat laporan ${format.toUpperCase()}...`, {
      id: 'report-generating',
      description: `Laporan ${reportId} sedang diproses`,
    });
    
    try {
      const result = await reportGeneratorService.generateReport({
        type: reportId as 'inventory' | 'sales' | 'contacts' | 'activity' | 'combined',
        format: format,
        userId: userId,
        includeCharts: true,
        includeImages: false,
      });

      if (result.success) {
        toast.success("✨ Laporan AI berhasil dibuat!", {
          id: 'report-generating',
          description: `File ${result.filename} siap didownload`,
        });
        await refreshReports();
      } else {
        toast.error("Gagal membuat laporan", {
          id: 'report-generating',
          description: result.error || "Terjadi kesalahan saat membuat laporan",
        });
      }
    } catch (error) {
      console.error('Error generating report:', error);
      toast.error("Gagal membuat laporan", {
        id: 'report-generating',
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle quick report generation from hero (combined report in PDF)
  const handleQuickGenerate = async () => {
    if (!userId) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    setIsGenerating(true);
    toast.loading("🚀 Membuat laporan lengkap...", {
      id: 'quick-report-generating',
      description: 'AI sedang menganalisis semua data bisnis Anda',
    });

    try {
      const result = await reportGeneratorService.generateReport({
        type: 'combined',
        format: 'pdf',
        userId: userId,
        includeCharts: true,
        includeImages: false,
      });

      if (result.success) {
        toast.success("✨ Laporan lengkap berhasil dibuat!", {
          id: 'quick-report-generating',
          description: `File ${result.filename} siap didownload`,
        });
        await refreshReports();
      } else {
        toast.error("Gagal membuat laporan", {
          id: 'quick-report-generating',
          description: result.error || "Terjadi kesalahan",
        });
      }
    } catch (error) {
      console.error('Error generating quick report:', error);
      toast.error("Gagal membuat laporan", {
        id: 'quick-report-generating',
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle custom report generation
  const handleCustomReportGenerate = async (formData: CustomReportFormData) => {
    if (!userId) {
      toast.error("Silakan login terlebih dahulu");
      return;
    }

    setIsGenerating(true);
    toast.loading("🤖 AI sedang menganalisis data...", {
      id: 'custom-report-generating',
      description: `Tipe: ${formData.reportType}, Format: ${formData.format.toUpperCase()}`,
    });

    try {
      const result = await reportGeneratorService.generateReport({
        type: formData.reportType as any,
        format: formData.format,
        period: formData.startDate && formData.endDate ? {
          startDate: formData.startDate,
          endDate: formData.endDate,
        } : undefined,
        includeCharts: formData.includeCharts,
        includeImages: formData.includeImages,
        userId: userId,
      });

      if (result.success) {
        toast.success("✨ Laporan kustom AI berhasil dibuat!", {
          id: 'custom-report-generating',
          description: "File siap didownload",
        });
        await refreshReports();
      } else {
        toast.error("Gagal membuat laporan kustom", {
          id: 'custom-report-generating',
          description: result.error || "Terjadi kesalahan",
        });
      }
    } catch (error) {
      console.error('Error generating custom report:', error);
      toast.error("Gagal membuat laporan kustom", {
        id: 'custom-report-generating',
        description: error instanceof Error ? error.message : "Terjadi kesalahan",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // --- Actions ---

  const handleDownloadReport = (reportId: number) => {
    const report = recentReports.find(r => r.id === reportId);
    if (report) {
      toast.success(`Downloading ${report.name}...`);
    }
  };

  const handleDeleteReport = (reportId: number) => {
    toast.info("Penghapusan log laporan belum tersedia");
  };

  // --- Scheduled Reports Handlers ---

  const handleAddScheduleClick = () => {
    setEditingSchedule(undefined);
    setScheduleDialogOpen(true);
  };

  const handleEditScheduledReport = (reportId: number) => {
    const report = scheduledReports.find(r => r.id === reportId);
    if (report) {
      setEditingSchedule(report);
      setScheduleDialogOpen(true);
    }
  };

  const handleDeleteScheduledReport = (reportId: number) => {
    deleteScheduledReport(reportId);
    toast.success("Jadwal dihapus");
  };

  const handleToggleScheduledReport = (reportId: number) => {
    const report = scheduledReports.find(r => r.id === reportId);
    if (report) {
      updateScheduledReport(reportId, { isActive: !report.isActive });
      toast.success(report.isActive ? "Jadwal dinonaktifkan" : "Jadwal diaktifkan");
    }
  };

  const handleSaveSchedule = (reportData: Omit<ScheduledReport, 'id'>) => {
    if (editingSchedule) {
      updateScheduledReport(editingSchedule.id, reportData);
      toast.success("Jadwal berhasil diperbarui");
    } else {
      addScheduledReport(reportData);
      toast.success("Jadwal baru berhasil dibuat");
    }
    setScheduleDialogOpen(false);
  };

  // Handler for custom builder 'schedule' button
  const handleScheduleCustomReport = () => {
    handleAddScheduleClick();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary mr-2" />
          <p className="text-muted-foreground">Memuat data laporan...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <p className="text-destructive">Error: {error}</p>
          <button onClick={() => window.location.reload()} className="text-primary hover:underline">
            Coba lagi
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Hero */}
        <ReportsHero 
          totalReports={recentReports.length || totalReports}
          lastReportDate={recentReports[0]?.date || lastReportDate}
          onQuickGenerate={handleQuickGenerate}
          onSchedule={handleAddScheduleClick}
          isGenerating={isGenerating}
        />

        {/* Metrics */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-emerald-400 rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Ringkasan Performa
            </h2>
          </div>
          <ReportMetricsGrid metrics={metrics} />
        </div>

        {/* Top Section: Quick Actions & Scheduled Reports */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Quick Actions (Types) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-primary rounded-full" />
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Buat Laporan Cepat
              </h2>
            </div>
            <ReportTypesGrid 
              reportTypes={reportTypes}
              onGenerateReport={handleGenerateReport}
            />
          </div>

          {/* Scheduled Reports */}
          <div className="flex flex-col h-full gap-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-400 rounded-full" />
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Monitor Jadwal
              </h2>
            </div>
            <div className="flex-1 min-h-0">
              <ScheduledReportsList 
                reports={scheduledReports}
                onToggle={handleToggleScheduledReport}
                onEdit={handleEditScheduledReport}
                onDelete={handleDeleteScheduledReport}
                onAdd={handleAddScheduleClick}
              />
            </div>
          </div>
        </div>

        {/* Custom Report Builder - Full Width */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 bg-purple-400 rounded-full" />
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              Laporan Kustom
            </h2>
          </div>
          <CustomReportBuilder 
            onGenerate={handleCustomReportGenerate}
            onSchedule={handleScheduleCustomReport}
            isGenerating={isGenerating}
          />
        </div>

        {/* Recent Reports - Full Width */}
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-amber-400 rounded-full" />
                <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Riwayat Laporan
                </h2>
            </div>
            <RecentReportsList 
              reports={recentReports}
              onDownload={handleDownloadReport}
              onDelete={handleDeleteReport}
            />
        </div>

      </div>

      <ScheduledReportDialog 
        open={scheduleDialogOpen}
        onOpenChange={setScheduleDialogOpen}
        onSubmit={handleSaveSchedule}
        initialData={editingSchedule}
      />
    </DashboardLayout>
  );
};

export default Reports;
