import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Download, 
  Calendar,
  Filter,
  FileSpreadsheet,
  File
} from "lucide-react";

const reportTypes = [
  {
    id: "inventory",
    title: "Laporan Inventaris",
    description: "Daftar lengkap semua karya seni dengan status dan nilai",
    icon: FileText,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    id: "sales",
    title: "Laporan Penjualan",
    description: "Ringkasan penjualan dan pendapatan per periode",
    icon: FileSpreadsheet,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    id: "contacts",
    title: "Laporan Kontak",
    description: "Daftar jejaring profesional dan riwayat interaksi",
    icon: File,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    id: "activity",
    title: "Laporan Aktivitas",
    description: "Log semua aktivitas dan touchpoint dengan kontak",
    icon: Calendar,
    color: "text-primary",
    bg: "bg-primary/10",
  },
];

const recentReports = [
  { id: 1, name: "Inventaris_Des2024.csv", type: "inventory", date: "16 Des 2024", size: "45 KB" },
  { id: 2, name: "Penjualan_Q4_2024.pdf", type: "sales", date: "15 Des 2024", size: "128 KB" },
  { id: 3, name: "Kontak_Export.csv", type: "contacts", date: "10 Des 2024", size: "32 KB" },
];

const Reports = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="font-display text-3xl font-bold">Laporan & Export</h1>
          <p className="text-muted-foreground">Generate dan download laporan bisnis Anda</p>
        </div>

        {/* Report Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reportTypes.map((report) => (
            <Card key={report.id} className="bg-card border-border hover:border-primary/30 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${report.bg} flex items-center justify-center flex-shrink-0`}>
                    <report.icon className={`w-6 h-6 ${report.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{report.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                    <div className="flex items-center gap-2">
                      <Button variant="default" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export CSV
                      </Button>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Download className="w-4 h-4" />
                        Export PDF
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Custom Report */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Laporan Kustom</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Tipe Laporan</label>
                <select className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>Inventaris Karya</option>
                  <option>Penjualan</option>
                  <option>Kontak</option>
                  <option>Aktivitas</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Periode</label>
                <div className="flex items-center gap-2">
                  <input 
                    type="date" 
                    className="flex-1 h-10 px-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input 
                    type="date" 
                    className="flex-1 h-10 px-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Format</label>
                <select className="w-full h-10 px-3 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                  <option>CSV</option>
                  <option>PDF</option>
                  <option>Excel</option>
                </select>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-6">
              <Button variant="default" className="gap-2">
                <Filter className="w-4 h-4" />
                Generate Laporan
              </Button>
              <Button variant="outline" className="gap-2">
                <Calendar className="w-4 h-4" />
                Jadwalkan Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-lg">Laporan Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between px-6 py-4 hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{report.name}</div>
                      <div className="text-sm text-muted-foreground">{report.date} • {report.size}</div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Download className="w-4 h-4" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Reports;
