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
   * Includes: Daftar semua karya, Nilai estimasi, Status dan lokasi
   */
  private async fetchInventoryData(userId: string): Promise<Record<string, unknown>> {
    try {
      const [artworksResult, statusCounts] = await Promise.all([
        artworksService.getAll(userId, {}, { limit: 200 }),
        artworksService.getCountByStatus(userId),
      ]);

      const artworks = artworksResult.data;
      const totalValue = artworks.reduce((sum, a) => sum + (a.price || 0), 0);
      
      // Status distribution with labels
      const statusLabels: Record<string, string> = {
        concept: 'Konsep',
        wip: 'Dalam Proses',
        finished: 'Selesai',
        sold: 'Terjual',
      };
      
      const statusDistributionFormatted = Object.entries(statusCounts).map(([status, count]) => ({
        status: statusLabels[status] || status,
        count: count,
        percentage: artworks.length > 0 ? Math.round((count / artworks.length) * 100) : 0,
      }));
      
      // Group by medium
      const byMedium: Record<string, { count: number; totalValue: number }> = {};
      artworks.forEach(a => {
        const medium = a.medium || 'Tidak diketahui';
        if (!byMedium[medium]) {
          byMedium[medium] = { count: 0, totalValue: 0 };
        }
        byMedium[medium].count += 1;
        byMedium[medium].totalValue += a.price || 0;
      });
      
      // Group by category
      const byCategory: Record<string, number> = {};
      artworks.forEach(a => {
        const category = a.category || 'Tanpa Kategori';
        byCategory[category] = (byCategory[category] || 0) + 1;
      });
      
      // Group by year
      const byYear: Record<string, number> = {};
      artworks.forEach(a => {
        const year = a.year ? String(a.year) : 'Tidak diketahui';
        byYear[year] = (byYear[year] || 0) + 1;
      });

      // Top valued artworks
      const topArtworks = [...artworks]
        .filter(a => a.price && a.price > 0)
        .sort((a, b) => (b.price || 0) - (a.price || 0))
        .slice(0, 10)
        .map(a => ({
          title: a.title,
          price: a.price,
          priceFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(a.price || 0),
          medium: a.medium || 'N/A',
          status: statusLabels[a.status] || a.status,
          year: a.year || 'N/A',
          dimensions: a.dimensions || 'N/A',
        }));
      
      // Available artworks (not sold)
      const availableArtworks = artworks.filter(a => a.status !== 'sold');
      const availableValue = availableArtworks.reduce((sum, a) => sum + (a.price || 0), 0);

      // Full artwork list for table (limited to 50 for report)
      const fullArtworkList = artworks.slice(0, 50).map(a => ({
        title: a.title,
        medium: a.medium || 'N/A',
        dimensions: a.dimensions || 'N/A',
        year: a.year || 'N/A',
        status: statusLabels[a.status] || a.status,
        priceFormatted: a.price ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(a.price) : 'Belum ditentukan',
        category: a.category || 'Tanpa Kategori',
      }));

      return {
        // Summary stats
        totalArtworks: artworks.length,
        totalEstimatedValue: totalValue,
        totalEstimatedValueFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalValue),
        averageValue: artworks.length > 0 ? Math.round(totalValue / artworks.length) : 0,
        averageValueFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(artworks.length > 0 ? Math.round(totalValue / artworks.length) : 0),
        
        // Available inventory
        availableArtworksCount: availableArtworks.length,
        availableInventoryValue: availableValue,
        availableInventoryValueFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(availableValue),
        
        // Distributions
        statusDistribution: statusDistributionFormatted,
        byMedium: Object.entries(byMedium).map(([medium, data]) => ({
          medium,
          count: data.count,
          totalValue: data.totalValue,
          totalValueFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.totalValue),
        })),
        byCategory: Object.entries(byCategory).map(([category, count]) => ({ category, count })),
        byYear: Object.entries(byYear).sort((a, b) => b[0].localeCompare(a[0])).map(([year, count]) => ({ year, count })),
        
        // Top artworks
        topValuedArtworks: topArtworks,
        
        // Full list for table
        artworksList: fullArtworkList,
      };
    } catch (error) {
      console.error('Error fetching inventory data:', error);
      return { error: 'Gagal mengambil data inventaris' };
    }
  }

  /**
   * Fetch sales data for report
   * Includes: Total pendapatan, Top karya terjual, Grafik penjualan, Analisis pembeli
   */
  private async fetchSalesData(userId: string, period?: { startDate: string; endDate: string }): Promise<Record<string, unknown>> {
    try {
      // Get sales from sales service
      const salesResult = await salesService.getAll(userId, {}, { limit: 200 });
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
      const completedSales = filteredSales.filter(s => s.status === 'completed');
      const pendingSales = filteredSales.filter(s => s.status === 'pending');

      // Status labels
      const statusLabels: Record<string, string> = {
        pending: 'Menunggu',
        completed: 'Selesai',
        cancelled: 'Dibatalkan',
        refunded: 'Dikembalikan',
      };

      // Monthly breakdown for chart data
      const monthlyData: Record<string, { revenue: number; count: number; month: string }> = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
      
      filteredSales.forEach(s => {
        const date = new Date(s.created_at);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { 
            revenue: 0, 
            count: 0, 
            month: `${monthNames[date.getMonth()]} ${date.getFullYear()}` 
          };
        }
        monthlyData[monthKey].revenue += s.total_amount || 0;
        monthlyData[monthKey].count += 1;
      });

      // Format monthly data for chart (sorted by date)
      const monthlyBreakdownFormatted = Object.entries(monthlyData)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([key, data]) => ({
          period: data.month,
          revenue: data.revenue,
          revenueFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.revenue),
          salesCount: data.count,
        }));

      // Top selling items
      const topSales = [...filteredSales]
        .filter(s => s.total_amount && s.total_amount > 0)
        .sort((a, b) => (b.total_amount || 0) - (a.total_amount || 0))
        .slice(0, 10)
        .map(s => ({
          title: s.title || 'N/A',
          amount: s.total_amount,
          amountFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(s.total_amount || 0),
          date: new Date(s.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
          status: statusLabels[s.status] || s.status,
          paymentMethod: s.payment_method || 'N/A',
        }));

      // Full sales list
      const fullSalesList = filteredSales.slice(0, 50).map(s => ({
        title: s.title || 'N/A',
        amountFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(s.total_amount || 0),
        date: new Date(s.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        status: statusLabels[s.status] || s.status,
        paymentMethod: s.payment_method || 'N/A',
      }));

      // Sales by status
      const salesByStatus = Object.entries(statusLabels).map(([status, label]) => ({
        status: label,
        count: filteredSales.filter(s => s.status === status).length,
        total: filteredSales.filter(s => s.status === status).reduce((sum, s) => sum + (s.total_amount || 0), 0),
      })).filter(s => s.count > 0);

      return {
        // Summary stats
        totalRevenue,
        totalRevenueFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalRevenue),
        totalSalesCount,
        completedSalesCount: completedSales.length,
        pendingSalesCount: pendingSales.length,
        averageSaleValue: totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount) : 0,
        averageSaleValueFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalSalesCount > 0 ? Math.round(totalRevenue / totalSalesCount) : 0),
        
        // Monthly data for chart
        monthlyBreakdown: monthlyBreakdownFormatted,
        
        // Status breakdown
        salesByStatus,

        // Top sales
        topSales,
        
        // Full list
        salesList: fullSalesList,
        
        // Period info
        period: period ? `${new Date(period.startDate).toLocaleDateString('id-ID')} - ${new Date(period.endDate).toLocaleDateString('id-ID')}` : 'Semua waktu',
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
          totalRevenueFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalRevenue),
          totalSalesCount: soldArtworks.length,
          averageSaleValue: soldArtworks.length > 0 ? Math.round(totalRevenue / soldArtworks.length) : 0,
          soldArtworks: soldArtworks.map(a => ({
            title: a.title,
            priceFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(a.price || 0),
            medium: a.medium || 'N/A',
            soldDate: new Date(a.updated_at).toLocaleDateString('id-ID'),
          })),
        };
      } catch (e) {
        return { error: 'Gagal mengambil data penjualan' };
      }
    }
  }

  /**
   * Fetch contacts data for report
   * Includes: Daftar kontak, Kategori & segmentasi, Peluang kerjasama
   */
  private async fetchContactsData(userId: string): Promise<Record<string, unknown>> {
    try {
      const contactsResult = await contactsService.getAll(userId, {}, { limit: 200 });
      const contacts = contactsResult.data;

      // Type labels
      const typeLabels: Record<string, string> = {
        gallery: 'Galeri',
        collector: 'Kolektor',
        museum: 'Museum',
        curator: 'Kurator',
      };

      // Group by type with formatted labels
      const byTypeFormatted = Object.entries(typeLabels).map(([type, label]) => {
        const count = contacts.filter(c => c.type === type).length;
        return {
          type: label,
          count,
          percentage: contacts.length > 0 ? Math.round((count / contacts.length) * 100) : 0,
        };
      }).filter(t => t.count > 0);

      // Group by location
      const byLocation: Record<string, number> = {};
      contacts.forEach(c => {
        const location = c.location || 'Tidak diketahui';
        byLocation[location] = (byLocation[location] || 0) + 1;
      });

      // Top locations
      const topLocations = Object.entries(byLocation)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([location, count]) => ({ location, count }));

      // VIP contacts
      const vipContacts = contacts
        .filter(c => c.is_vip)
        .slice(0, 10)
        .map(c => ({
          name: c.name,
          type: typeLabels[c.type] || c.type,
          company: c.company || 'N/A',
          location: c.location || 'N/A',
          totalPurchases: c.total_purchases || 0,
          purchasesFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(c.total_purchases || 0),
        }));

      // Top contacts by purchase value
      const topBuyers = [...contacts]
        .filter(c => c.total_purchases && c.total_purchases > 0)
        .sort((a, b) => (b.total_purchases || 0) - (a.total_purchases || 0))
        .slice(0, 10)
        .map(c => ({
          name: c.name,
          type: typeLabels[c.type] || c.type,
          company: c.company || 'N/A',
          purchaseCount: c.purchase_count || 0,
          totalPurchasesFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(c.total_purchases || 0),
        }));

      // Active contacts (recently contacted)
      const activeContacts = contacts.filter(c => c.is_active).length;

      // Full contact list
      const fullContactList = contacts.slice(0, 50).map(c => ({
        name: c.name,
        type: typeLabels[c.type] || c.type,
        company: c.company || 'N/A',
        location: c.location || 'N/A',
        email: c.email || 'N/A',
        phone: c.phone || 'N/A',
        isVIP: c.is_vip ? 'Ya' : 'Tidak',
        rating: c.rating ? `${c.rating}/5` : 'N/A',
      }));

      // Calculate total purchase value from all contacts
      const totalContactPurchases = contacts.reduce((sum, c) => sum + (c.total_purchases || 0), 0);

      return {
        // Summary
        totalContacts: contacts.length,
        activeContactsCount: activeContacts,
        vipContactsCount: vipContacts.length,
        totalContactPurchases,
        totalContactPurchasesFormatted: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(totalContactPurchases),

        // Segmentation by type
        byType: byTypeFormatted,

        // Location distribution
        topLocations,

        // VIP and top buyers
        vipContacts,
        topBuyers,

        // Full list
        contactsList: fullContactList,
      };
    } catch (error) {
      console.error('Error fetching contacts data:', error);
      return { error: 'Gagal mengambil data kontak' };
    }
  }

  /**
   * Fetch activity data for report
   * Includes: Timeline aktivitas, Follow-up tasks, Meeting & events, Catatan penting
   */
  private async fetchActivityData(userId: string, period?: { startDate: string; endDate: string }): Promise<Record<string, unknown>> {
    try {
      // activityService.getAll returns FormattedActivity[] directly
      const activities = await activityService.getAll(userId, 200);

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

      // Activity type labels
      const typeLabels: Record<string, string> = {
        artwork_created: 'Karya Dibuat',
        artwork_updated: 'Karya Diperbarui',
        artwork_sold: 'Karya Terjual',
        contact_added: 'Kontak Ditambahkan',
        contact_updated: 'Kontak Diperbarui',
        sale_created: 'Penjualan Dibuat',
        sale_completed: 'Penjualan Selesai',
        report_generated: 'Laporan Dibuat',
        user_login: 'Login',
        user_profile_updated: 'Profil Diperbarui',
      };

      // Group by activity_type with formatted labels
      const byTypeFormatted = Object.entries(
        filteredActivities.reduce((acc, a) => {
          const type = a.activity_type || 'Lainnya';
          acc[type] = (acc[type] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([type, count]) => ({
        type: typeLabels[type] || type,
        count,
        percentage: filteredActivities.length > 0 ? Math.round((count / filteredActivities.length) * 100) : 0,
      })).sort((a, b) => b.count - a.count);

      // Group by date for timeline
      const byDate: Record<string, { date: string; activities: Array<{ type: string; title: string; time: string }> }> = {};
      filteredActivities.forEach(a => {
        const date = new Date(a.created_at);
        const dateKey = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
        const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        if (!byDate[dateKey]) {
          byDate[dateKey] = { date: dateKey, activities: [] };
        }
        byDate[dateKey].activities.push({
          type: typeLabels[a.activity_type] || a.activity_type,
          title: a.title,
          time,
        });
      });

      // Timeline - last 7 days with activity count
      const timeline = Object.values(byDate).slice(0, 7);

      // Recent activities with full details
      const recentActivities = filteredActivities.slice(0, 30).map(a => ({
        type: typeLabels[a.activity_type] || a.activity_type,
        title: a.title,
        description: a.description || 'N/A',
        date: new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        time: new Date(a.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        relativeTime: a.relativeTime,
      }));

      // Important activities (sales completed, artworks sold)
      const importantActivities = filteredActivities
        .filter(a => ['sale_completed', 'artwork_sold', 'sale_created'].includes(a.activity_type))
        .slice(0, 10)
        .map(a => ({
          type: typeLabels[a.activity_type] || a.activity_type,
          title: a.title,
          description: a.description || '',
          date: new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        }));

      // Activity summary by week
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const thisWeekCount = filteredActivities.filter(a => new Date(a.created_at) >= oneWeekAgo).length;
      const thisMonthCount = filteredActivities.filter(a => new Date(a.created_at) >= oneMonthAgo).length;

      return {
        // Summary
        totalActivities: filteredActivities.length,
        thisWeekActivities: thisWeekCount,
        thisMonthActivities: thisMonthCount,

        // By type distribution
        byType: byTypeFormatted,

        // Timeline view
        timeline,

        // Recent activities
        recentActivities,

        // Important activities (sales, etc.)
        importantActivities,

        // Period info
        period: period ? `${new Date(period.startDate).toLocaleDateString('id-ID')} - ${new Date(period.endDate).toLocaleDateString('id-ID')}` : 'Semua waktu',
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
