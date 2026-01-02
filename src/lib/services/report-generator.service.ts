/**
 * Report Generator Service
 * Service for generating formatted reports in PDF, CSV, and Excel formats
 * Integrated with Groq AI for intelligent report formatting
 */

import { groqService, FormattedReport, ReportData, TableData, StatItem } from './groq.service';
import { artworksService } from './artworks.service';
import { contactsService } from './contacts.service';
import { salesService  } from './sales.service';
import { activityService } from './activity.service';

export interface GenerateReportOptions {
  type: 'inventory' | 'sales' | 'contacts' | 'activity' | 'combined';
  format: 'csv' | 'pdf' | 'xlsx';
  period?: {
    startDate: string;
    endDate: string;
  };
  includeCharts?: boolean;
  includeImages?: boolean;
  userId: string;
}

export interface GeneratedReportResult {
  success: boolean;
  filename: string;
  blob?: Blob;
  error?: string;
  formattedReport?: FormattedReport;
}

class ReportGeneratorService {
  /**
   * Generate a complete report with AI formatting
   */
  async generateReport(options: GenerateReportOptions): Promise<GeneratedReportResult> {
    try {
      // 1. Fetch data based on report type
      const data = await this.fetchReportData(options);
      
      // 2. Generate AI-formatted report
      const reportData: ReportData = {
        type: options.type,
        title: this.getReportTitle(options.type),
        period: options.period,
        data,
        includeCharts: options.includeCharts,
        includeImages: options.includeImages,
      };

      const formattedReport = await groqService.generateReport(reportData);

      // 3. Generate file based on format
      const filename = this.generateFilename(options);
      let blob: Blob;

      switch (options.format) {
        case 'csv':
          blob = this.generateCSV(formattedReport);
          break;
        case 'xlsx':
          blob = this.generateExcel(formattedReport);
          break;
        case 'pdf':
        default:
          blob = await this.generatePDF(formattedReport);
          break;
      }

      // 4. Trigger download
      this.downloadBlob(blob, filename);

      return {
        success: true,
        filename,
        blob,
        formattedReport,
      };
    } catch (error) {
      console.error('Error generating report:', error);
      return {
        success: false,
        filename: '',
        error: error instanceof Error ? error.message : 'Gagal membuat laporan',
      };
    }
  }

  /**
   * Fetch report data based on type
   */
  private async fetchReportData(options: GenerateReportOptions): Promise<Record<string, unknown>> {
    const { type, userId, period } = options;

    switch (type) {
      case 'inventory':
        return this.fetchInventoryData(userId);
      
      case 'sales':
        return this.fetchSalesData(userId, period);
      
      case 'contacts':
        return this.fetchContactsData(userId);
      
      case 'activity':
        return this.fetchActivityData(userId, period);
      
      case 'combined':
        const [inventory, sales, contacts, activity] = await Promise.all([
          this.fetchInventoryData(userId),
          this.fetchSalesData(userId, period),
          this.fetchContactsData(userId),
          this.fetchActivityData(userId, period),
        ]);
        return { inventory, sales, contacts, activity };
      
      default:
        return {};
    }
  }

  /**
   * Fetch inventory data for report
   */
  private async fetchInventoryData(userId: string): Promise<Record<string, unknown>> {
    try {
      const [artworksResult, statusCounts] = await Promise.all([
        artworksService.getAll(userId, {}, { limit: 100 }),
        artworksService.getCountByStatus(userId),
      ]);

      const artworks = artworksResult.data;
      const totalValue = artworks.reduce((sum, a) => sum + (a.price || 0), 0);
      
      // Group by medium
      const byMedium: Record<string, number> = {};
      artworks.forEach(a => {
        const medium = a.medium || 'Tidak diketahui';
        byMedium[medium] = (byMedium[medium] || 0) + 1;
      });

      // Top valued artworks
      const topArtworks = [...artworks]
        .sort((a, b) => (b.price || 0) - (a.price || 0))
        .slice(0, 5)
        .map(a => ({
          title: a.title,
          price: a.price,
          medium: a.medium,
          status: a.status,
        }));

      return {
        totalArtworks: artworks.length,
        statusDistribution: statusCounts,
        totalEstimatedValue: totalValue,
        averageValue: artworks.length > 0 ? Math.round(totalValue / artworks.length) : 0,
        byMedium,
        topValuedArtworks: topArtworks,
        artworksList: artworks.slice(0, 20).map(a => ({
          title: a.title,
          medium: a.medium,
          status: a.status,
          price: a.price,
          year: a.year,
          dimensions: a.dimensions,
        })),
      };
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      return { error: 'Gagal mengambil data inventaris' };
    }
  }

  /**
   * Fetch sales data for report
   */
  private async fetchSalesData(userId: string, period?: { startDate: string; endDate: string }): Promise<Record<string, unknown>> {
    try {
      // Get sales from sales service
      const salesResult = await salesService.getAll(userId, {}, { limit: 100 });
      const sales = salesResult.data;

      // Filter by period if provided
      let filteredSales = sales;
      if (period?.startDate && period?.endDate) {
        const start = new Date(period.startDate);
        const end = new Date(period.endDate);
        filteredSales = sales.filter(s => {
          const saleDate = new Date(s.created_at);
          return saleDate >= start && saleDate <= end;
        });
      }

      const totalRevenue = filteredSales.reduce((sum, s) => sum + (s.total_amount || 0), 0);
      const totalSalesCount = filteredSales.length;

      // Monthly breakdown
      const monthlyData: Record<string, { revenue: number; count: number }> = {};
      filteredSales.forEach(s => {
        const date = new Date(s.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { revenue: 0, count: 0 };
        }
        monthlyData[monthKey].revenue += s.total_amount || 0;
        monthlyData[monthKey].count += 1;
      });

      // Top sales
      const topSales = [...filteredSales]
        .sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0))
        .slice(0, 5)
        .map(s => ({
          title: s.title || 'N/A',
          description: s.description || '',
          amount: s.total_amount,
          date: s.created_at,
          status: s.status,
        }));

      return {
        totalRevenue,
        totalSalesCount,
        averageSaleValue: totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount) : 0,
        monthlyBreakdown: monthlyData,
        topSales,
        salesList: filteredSales.slice(0, 20).map(s => ({
          title: s.title || 'N/A',
          description: s.description || '',
          amount: s.total_amount,
          date: s.created_at,
          status: s.status,
          paymentMethod: s.payment_method,
        })),
        period: period || 'Semua waktu',
      };
    } catch (error) {
      console.error('Error fetching sales data:', error);
      // Fallback to artwork-based sales data
      try {
        const artworksResult = await artworksService.getAll(userId, { status: 'sold' }, { limit: 100 });
        const soldArtworks = artworksResult.data;
        const totalRevenue = soldArtworks.reduce((sum, a) => sum + (a.price || 0), 0);

        return {
          totalRevenue,
          totalSalesCount: soldArtworks.length,
          averageSaleValue: soldArtworks.length > 0 ? Math.round(totalRevenue / soldArtworks.length) : 0,
          soldArtworks: soldArtworks.map(a => ({
            title: a.title,
            price: a.price,
            medium: a.medium,
            soldDate: a.updated_at,
          })),
        };
      } catch (e) {
        return { error: 'Gagal mengambil data penjualan' };
      }
    }
  }

  /**
   * Fetch contacts data for report
   */
  private async fetchContactsData(userId: string): Promise<Record<string, unknown>> {
    try {
      const contactsResult = await contactsService.getAll(userId, {}, { limit: 100 });
      const contacts = contactsResult.data;

      // Group by type (gallery, collector, museum, curator)
      const byType: Record<string, number> = {};
      contacts.forEach(c => {
        const contactType = c.type || 'Lainnya';
        byType[contactType] = (byType[contactType] || 0) + 1;
      });

      // Group by location
      const byLocation: Record<string, number> = {};
      contacts.forEach(c => {
        const location = c.location || 'Tidak diketahui';
        byLocation[location] = (byLocation[location] || 0) + 1;
      });

      return {
        totalContacts: contacts.length,
        byType,
        byLocation,
        contactsList: contacts.slice(0, 20).map(c => ({
          name: c.name,
          type: c.type,
          company: c.company,
          location: c.location,
          email: c.email,
          phone: c.phone,
        })),
      };
    } catch (error) {
      console.error('Error fetching contacts data:', error);
      return { error: 'Gagal mengambil data kontak' };
    }
  }

  /**
   * Fetch activity data for report
   */
  private async fetchActivityData(userId: string, period?: { startDate: string; endDate: string }): Promise<Record<string, unknown>> {
    try {
      // activityService.getAll returns FormattedActivity[] directly
      const activities = await activityService.getAll(userId, 100);

      // Filter by period if provided
      let filteredActivities = activities;
      if (period?.startDate && period?.endDate) {
        const start = new Date(period.startDate);
        const end = new Date(period.endDate);
        filteredActivities = activities.filter(a => {
          const actDate = new Date(a.created_at);
          return actDate >= start && actDate <= end;
        });
      }

      // Group by activity_type
      const byType: Record<string, number> = {};
      filteredActivities.forEach(a => {
        const type = a.activity_type || 'Lainnya';
        byType[type] = (byType[type] || 0) + 1;
      });

      return {
        totalActivities: filteredActivities.length,
        byType,
        recentActivities: filteredActivities.slice(0, 20).map(a => ({
          type: a.activity_type,
          title: a.title,
          description: a.description,
          date: a.created_at,
          relativeTime: a.relativeTime,
        })),
        period: period || 'Semua waktu',
      };
    } catch (error) {
      console.error('Error fetching activity data:', error);
      return { error: 'Gagal mengambil data aktivitas' };
    }
  }

  /**
   * Generate PDF from formatted report
   */
  private async generatePDF(report: FormattedReport): Promise<Blob> {
    // Create PDF content as HTML that can be printed/saved as PDF
    const htmlContent = this.createPDFHTML(report);
    
    // Create blob from HTML
    const blob = new Blob([htmlContent], { type: 'text/html' });
    
    // Open in new window for printing/saving as PDF
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, '_blank');
    
    if (printWindow) {
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };
    }

    // Return HTML blob (user can save as PDF using print dialog)
    return blob;
  }

  /**
   * Create HTML content for PDF
   */
  private createPDFHTML(report: FormattedReport): string {
    const formatCurrency = (value: number) => {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    };

    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    };

    let sectionsHTML = '';
    
    // Safely iterate through sections with validation
    const sections = Array.isArray(report.sections) ? report.sections : [];
    
    for (const section of sections) {
      if (!section || !section.title) continue;
      
      sectionsHTML += `<div class="section">
        <h2>${this.escapeHtml(section.title)}</h2>`;

      if (section.type === 'text') {
        const textContent = typeof section.content === 'string' ? section.content : String(section.content || '');
        sectionsHTML += `<p>${this.escapeHtml(textContent)}</p>`;
        
      } else if (section.type === 'table') {
        // Validate table structure
        const tableData = section.content as TableData;
        if (tableData && Array.isArray(tableData.headers) && Array.isArray(tableData.rows)) {
          sectionsHTML += `
            <table>
              <thead>
                <tr>
                  ${tableData.headers.map(h => `<th>${this.escapeHtml(String(h))}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${tableData.rows.map(row => `
                  <tr>
                    ${Array.isArray(row) ? row.map(cell => `<td>${this.escapeHtml(String(cell))}</td>`).join('') : ''}
                  </tr>
                `).join('')}
              </tbody>
            </table>`;
        } else {
          // Fallback for invalid table data
          sectionsHTML += `<p><em>Data tabel tidak tersedia</em></p>`;
        }
        
      } else if (section.type === 'stats') {
        // Validate stats is an array
        const stats = Array.isArray(section.content) ? section.content as StatItem[] : [];
        if (stats.length > 0) {
          sectionsHTML += `
            <div class="stats-grid">
              ${stats.map(stat => {
                if (!stat || typeof stat !== 'object') return '';
                const label = stat.label || 'N/A';
                const value = stat.value || '0';
                const trend = stat.trend || '';
                const change = stat.change || '';
                return `
                  <div class="stat-card">
                    <div class="stat-label">${this.escapeHtml(String(label))}</div>
                    <div class="stat-value">${this.escapeHtml(String(value))}</div>
                    ${change ? `<div class="stat-change ${trend}">${this.escapeHtml(String(change))}</div>` : ''}
                  </div>
                `;
              }).join('')}
            </div>`;
        } else {
          sectionsHTML += `<p><em>Statistik tidak tersedia</em></p>`;
        }
        
      } else if (section.type === 'chart') {
        const chartContent = typeof section.content === 'string' ? section.content : 'Grafik akan ditampilkan di sini';
        sectionsHTML += `<div class="chart-placeholder">
          <p><em>${this.escapeHtml(chartContent)}</em></p>
        </div>`;
      }

      sectionsHTML += `</div>`;
    }

    let recommendationsHTML = '';
    if (report.recommendations && report.recommendations.length > 0) {
      recommendationsHTML = `
        <div class="section recommendations">
          <h2>📌 Rekomendasi</h2>
          <ul>
            ${report.recommendations.map(r => `<li>${r}</li>`).join('')}
          </ul>
        </div>`;
    }

    return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${report.title}</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background: #fff;
      padding: 40px;
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 3px solid #d4a853;
    }
    
    .logo {
      font-size: 24px;
      font-weight: 700;
      color: #d4a853;
      margin-bottom: 10px;
    }
    
    h1 {
      font-size: 28px;
      color: #1a1a1a;
      margin-bottom: 10px;
    }
    
    .report-meta {
      font-size: 14px;
      color: #666;
    }
    
    .summary {
      background: linear-gradient(135deg, #fdf6e9 0%, #fff 100%);
      border: 1px solid #d4a853;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 30px;
    }
    
    .summary h2 {
      color: #d4a853;
      margin-bottom: 15px;
      font-size: 18px;
    }
    
    .summary p {
      color: #333;
      font-size: 15px;
    }
    
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .section h2 {
      color: #1a1a1a;
      font-size: 20px;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 2px solid #eee;
    }
    
    .section p {
      color: #444;
      font-size: 14px;
      margin-bottom: 12px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
      font-size: 13px;
    }
    
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }
    
    th {
      background: #f8f8f8;
      font-weight: 600;
      color: #333;
    }
    
    tr:hover {
      background: #fafafa;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 15px;
    }
    
    .stat-card {
      background: #f8f8f8;
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    
    .stat-label {
      font-size: 12px;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 8px 0;
    }
    
    .stat-change {
      font-size: 12px;
      font-weight: 600;
    }
    
    .stat-change.up {
      color: #22c55e;
    }
    
    .stat-change.down {
      color: #ef4444;
    }
    
    .chart-placeholder {
      background: #f8f8f8;
      border: 2px dashed #ddd;
      border-radius: 8px;
      padding: 30px;
      text-align: center;
      color: #666;
    }
    
    .recommendations {
      background: #f0fdf4;
      border: 1px solid #22c55e;
      border-radius: 12px;
      padding: 24px;
    }
    
    .recommendations h2 {
      color: #22c55e;
      border-bottom-color: #22c55e;
    }
    
    .recommendations ul {
      margin-left: 20px;
      margin-top: 10px;
    }
    
    .recommendations li {
      color: #333;
      margin-bottom: 8px;
      font-size: 14px;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      text-align: center;
      font-size: 12px;
      color: #999;
    }
    
    @media print {
      body {
        padding: 20px;
      }
      
      .section {
        page-break-inside: avoid;
      }
      
      @page {
        margin: 1cm;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🎨 ArtConnect CRM</div>
    <h1>${report.title}</h1>
    <p class="report-meta">
      Dibuat pada: ${formatDate(report.generatedAt)}
    </p>
  </div>
  
  <div class="summary">
    <h2>📋 Ringkasan Eksekutif</h2>
    <p>${report.summary}</p>
  </div>
  
  ${sectionsHTML}
  
  ${recommendationsHTML}
  
  <div class="footer">
    <p>Laporan ini dibuat secara otomatis oleh ArtConnect CRM dengan bantuan AI.</p>
    <p>© ${new Date().getFullYear()} ArtConnect CRM - All rights reserved</p>
  </div>
</body>
</html>`;
  }

  /**
   * Generate CSV from formatted report
   */
  private generateCSV(report: FormattedReport): Blob {
    let csvContent = '';
    
    // Add title and summary
    csvContent += `"${report.title}"\n`;
    csvContent += `"Dibuat: ${new Date(report.generatedAt).toLocaleDateString('id-ID')}"\n\n`;
    csvContent += `"RINGKASAN"\n`;
    csvContent += `"${report.summary.replace(/"/g, '""')}"\n\n`;

    // Process sections
    for (const section of report.sections) {
      csvContent += `"${section.title}"\n`;

      if (section.type === 'table') {
        const tableData = section.content as TableData;
        csvContent += tableData.headers.map(h => `"${h}"`).join(',') + '\n';
        for (const row of tableData.rows) {
          csvContent += row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',') + '\n';
        }
      } else if (section.type === 'stats') {
        const stats = section.content as StatItem[];
        csvContent += '"Label","Value","Trend","Change"\n';
        for (const stat of stats) {
          csvContent += `"${stat.label}","${stat.value}","${stat.trend || ''}","${stat.change || ''}"\n`;
        }
      } else if (section.type === 'text') {
        csvContent += `"${String(section.content).replace(/"/g, '""')}"\n`;
      }

      csvContent += '\n';
    }

    // Add recommendations
    if (report.recommendations && report.recommendations.length > 0) {
      csvContent += '"REKOMENDASI"\n';
      for (const rec of report.recommendations) {
        csvContent += `"- ${rec.replace(/"/g, '""')}"\n`;
      }
    }

    return new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8' });
  }

  /**
   * Generate Excel-compatible CSV (XLSX simulation)
   */
  private generateExcel(report: FormattedReport): Blob {
    // For now, generate a more Excel-friendly CSV
    // In production, you might want to use a library like xlsx
    return this.generateCSV(report);
  }

  /**
   * Generate filename based on options
   */
  private generateFilename(options: GenerateReportOptions): string {
    const date = new Date().toISOString().split('T')[0];
    const typeNames: Record<string, string> = {
      inventory: 'Inventaris',
      sales: 'Penjualan',
      contacts: 'Kontak',
      activity: 'Aktivitas',
      combined: 'LaporanLengkap',
    };
    
    const extension = options.format === 'xlsx' ? 'csv' : options.format === 'pdf' ? 'html' : options.format;
    return `Laporan_${typeNames[options.type] || options.type}_${date}.${extension}`;
  }

  /**
   * Get report title based on type
   */
  private getReportTitle(type: string): string {
    const titles: Record<string, string> = {
      inventory: 'Laporan Inventaris Karya Seni',
      sales: 'Laporan Penjualan',
      contacts: 'Laporan Kontak & Jaringan',
      activity: 'Laporan Aktivitas',
      combined: 'Laporan Lengkap Bisnis Seni',
    };
    return titles[type] || 'Laporan';
  }

  /**
   * Trigger file download
   */
  private downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Escape HTML special characters to prevent XSS
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export const reportGeneratorService = new ReportGeneratorService();
export default reportGeneratorService;
