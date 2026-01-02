/**
 * Groq AI Service
 * Service for interacting with Groq API for AI-powered report generation
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Get API key from environment variables
// Supports multiple naming conventions for different platforms:
// - VITE_GROQ_API_KEY (Vite standard - required prefix for client-side access)
// - PUBLIC_GROQ_API_KEY (Some platforms like SvelteKit)
const getApiKey = (): string => {
  // Debug: Log available env vars (will be replaced at build time by Vite)
  console.log('[Groq] Checking environment variables...');
  
  // Vite replaces these at build time, so we need to check them explicitly
  // The string "import.meta.env.VITE_GROQ_API_KEY" gets replaced with the actual value
  let apiKey = '';
  
  // Check VITE_ prefix first (standard Vite convention)
  if (typeof import.meta.env.VITE_GROQ_API_KEY === 'string' && 
      import.meta.env.VITE_GROQ_API_KEY.length > 0 &&
      !import.meta.env.VITE_GROQ_API_KEY.includes('VITE_GROQ_API_KEY')) {
    apiKey = import.meta.env.VITE_GROQ_API_KEY;
    console.log('[Groq] Found VITE_GROQ_API_KEY');
  }
  // Fallback to PUBLIC_ prefix
  else if (typeof import.meta.env.PUBLIC_GROQ_API_KEY === 'string' && 
           import.meta.env.PUBLIC_GROQ_API_KEY.length > 0 &&
           !import.meta.env.PUBLIC_GROQ_API_KEY.includes('PUBLIC_GROQ_API_KEY')) {
    apiKey = import.meta.env.PUBLIC_GROQ_API_KEY;
    console.log('[Groq] Found PUBLIC_GROQ_API_KEY');
  }
  
  if (!apiKey) {
    // Log what we found for debugging
    console.error('[Groq] API key not found in environment variables');
    console.error('[Groq] VITE_GROQ_API_KEY:', import.meta.env.VITE_GROQ_API_KEY ? 'exists but empty/invalid' : 'undefined');
    console.error('[Groq] MODE:', import.meta.env.MODE);
    console.error('[Groq] All env keys:', Object.keys(import.meta.env));
    
    throw new Error(
      'Groq API key not found. Please ensure VITE_GROQ_API_KEY is set in your environment. ' +
      'For Netlify: 1) Add VITE_GROQ_API_KEY to Environment Variables, 2) Trigger a new deployment (Clear cache and deploy).'
    );
  }
  
  console.log('[Groq] API key loaded successfully (length:', apiKey.length, ')');
  return apiKey;
};

export interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface GroqResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ReportData {
  type: 'inventory' | 'sales' | 'contacts' | 'activity' | 'combined';
  title: string;
  period?: {
    startDate: string;
    endDate: string;
  };
  data: Record<string, unknown>;
  includeCharts?: boolean;
  includeImages?: boolean;
}

export interface FormattedReport {
  title: string;
  summary: string;
  sections: ReportSection[];
  recommendations?: string[];
  generatedAt: string;
}

export interface ReportSection {
  title: string;
  type: 'text' | 'table' | 'stats' | 'chart';
  content: string | TableData | StatItem[];
}

export interface TableData {
  headers: string[];
  rows: string[][];
}

export interface StatItem {
  label: string;
  value: string;
  trend?: 'up' | 'down' | 'neutral';
  change?: string;
}

class GroqService {
  private model = 'llama-3.3-70b-versatile'; // Fast and capable model for report generation

  /**
   * Generate a chat completion using Groq API
   */
  async generateCompletion(messages: GroqMessage[]): Promise<string> {
    try {
      const apiKey = getApiKey();
      
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: 0.3, // Keep responses consistent for reports
          max_tokens: 4096,
          top_p: 1,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Groq API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data: GroqResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('Error calling Groq API:', error);
      throw error;
    }
  }

  /**
   * Generate a formatted report using AI
   */
  async generateReport(reportData: ReportData): Promise<FormattedReport> {
    // Best practices prompt for reliable JSON output
    const systemPrompt = `Kamu adalah asisten AI profesional yang ahli membuat laporan bisnis untuk seniman dan galeri seni.

ATURAN KETAT UNTUK OUTPUT:
1. HANYA keluarkan JSON yang valid, TANPA teks tambahan sebelum atau sesudahnya
2. JANGAN gunakan karakter newline (\\n) di dalam string - gunakan spasi saja
3. JANGAN gunakan karakter tab atau special characters
4. Gunakan Bahasa Indonesia yang formal
5. Semua mata uang dalam format "Rp X.XXX.XXX"

STRUKTUR JSON YANG HARUS DIIKUTI:
{
  "title": "Judul Laporan Singkat",
  "summary": "Ringkasan eksekutif dalam 2-3 kalimat yang menjelaskan insight utama. Pastikan tidak ada newline.",
  "sections": [
    {
      "title": "Statistik Utama",
      "type": "stats",
      "content": [
        {"label": "Total Karya", "value": "25", "trend": "up", "change": "+5"},
        {"label": "Pendapatan", "value": "Rp 50.000.000", "trend": "up", "change": "+15%"}
      ]
    },
    {
      "title": "Ringkasan",
      "type": "text",
      "content": "Paragraf deskriptif tanpa karakter newline di dalamnya."
    },
    {
      "title": "Data Detail",
      "type": "table",
      "content": {
        "headers": ["Kolom1", "Kolom2", "Kolom3"],
        "rows": [["data1", "data2", "data3"], ["data4", "data5", "data6"]]
      }
    }
  ],
  "recommendations": ["Rekomendasi pertama yang actionable", "Rekomendasi kedua"]
}

TIPE SECTION:
- "stats": content HARUS array of objects dengan {label, value, trend?, change?}
- "text": content HARUS string tanpa newline
- "table": content HARUS object dengan {headers: string[], rows: string[][]}
- "chart": content HARUS string deskripsi grafik

PENTING: Pastikan JSON valid dan dapat di-parse. Tidak boleh ada trailing commas.`;

    const userPrompt = this.buildUserPrompt(reportData);

    const messages: GroqMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ];

    try {
      const response = await this.generateCompletion(messages);
      console.log('[Groq] Raw response length:', response.length);
      
      // Extract JSON from response (AI might include extra text before/after)
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('[Groq] No JSON found in response:', response.substring(0, 500));
        throw new Error('Invalid response format from AI - no JSON object found');
      }

      // Sanitize JSON string to remove control characters
      const sanitizedJson = this.sanitizeJsonString(jsonMatch[0]);
      console.log('[Groq] Sanitized JSON length:', sanitizedJson.length);
      
      try {
        const parsed = JSON.parse(sanitizedJson) as FormattedReport;
        parsed.generatedAt = new Date().toISOString();
        
        // Validate required fields
        if (!parsed.title || !parsed.summary || !parsed.sections) {
          console.error('[Groq] Parsed JSON missing required fields:', Object.keys(parsed));
          throw new Error('Invalid report structure from AI');
        }
        
        console.log('[Groq] Report parsed successfully:', parsed.title);
        return parsed;
      } catch (parseError) {
        console.error('[Groq] JSON parse error:', parseError);
        console.error('[Groq] Problematic JSON (first 1000 chars):', sanitizedJson.substring(0, 1000));
        
        // Try to create a fallback report
        return this.createFallbackReport(reportData);
      }
    } catch (error) {
      console.error('[Groq] Error generating report:', error);
      throw new Error('Gagal menghasilkan laporan. Silakan coba lagi.');
    }
  }

  /**
   * Build user prompt based on report type and data
   */
  private buildUserPrompt(reportData: ReportData): string {
    const { type, title, period, data } = reportData;

    let prompt = `Buatkan laporan "${title}" dengan tipe "${type}".\n\n`;

    if (period?.startDate && period?.endDate) {
      prompt += `Periode: ${period.startDate} - ${period.endDate}\n\n`;
    }

    prompt += `DATA:\n${JSON.stringify(data, null, 2)}\n\n`;

    // Add type-specific instructions
    switch (type) {
      case 'inventory':
        prompt += `FOKUS ANALISIS DAN SECTIONS YANG HARUS DIBUAT:

1. SECTION "Statistik Utama" (type: stats):
   - Total karya seni dan persentase berdasarkan status
   - Total nilai estimasi inventaris dan nilai rata-rata
   - Jumlah karya tersedia untuk dijual

2. SECTION "Distribusi Berdasarkan Status" (type: table):
   - Tabel dengan kolom: Status, Jumlah, Persentase
   - Gunakan data dari statusDistribution

3. SECTION "Distribusi Berdasarkan Medium" (type: table):
   - Tabel dengan kolom: Medium, Jumlah, Total Nilai
   - Gunakan data dari byMedium

4. SECTION "Karya Bernilai Tertinggi" (type: table):
   - Tabel dengan kolom: Judul, Harga, Medium, Status
   - Gunakan data dari topValuedArtworks (maksimal 10)

5. SECTION "Daftar Inventaris" (type: table):
   - Tabel lengkap karya seni dengan kolom: Judul, Medium, Dimensi, Tahun, Status, Harga
   - Gunakan data dari artworksList

6. SECTION "Analisis dan Insight" (type: text):
   - Berikan analisis mendalam tentang kondisi inventaris
   - Identifikasi pola dan peluang

Berikan 3-5 rekomendasi konkret untuk pengelolaan inventaris.`;
        break;

      case 'sales':
        prompt += `FOKUS ANALISIS DAN SECTIONS YANG HARUS DIBUAT:

1. SECTION "Ringkasan Penjualan" (type: stats):
   - Total pendapatan (gunakan totalRevenueFormatted)
   - Jumlah penjualan total
   - Rata-rata nilai penjualan
   - Penjualan selesai vs pending

2. SECTION "Tren Penjualan Bulanan" (type: table):
   - Tabel dengan kolom: Periode, Pendapatan, Jumlah Transaksi
   - Gunakan data dari monthlyBreakdown
   - Jelaskan tren yang terlihat

3. SECTION "Top Penjualan" (type: table):
   - Tabel dengan kolom: Judul, Nilai, Tanggal, Status
   - Gunakan data dari topSales (maksimal 10)

4. SECTION "Status Penjualan" (type: table):
   - Tabel dengan kolom: Status, Jumlah, Total Nilai
   - Gunakan data dari salesByStatus

5. SECTION "Daftar Transaksi" (type: table):
   - Tabel lengkap dengan kolom: Judul, Nilai, Tanggal, Status, Metode Pembayaran
   - Gunakan data dari salesList

6. SECTION "Analisis Performa" (type: text):
   - Analisis tren penjualan
   - Identifikasi periode terbaik dan terburuk
   - Insight tentang preferensi pembeli

Berikan 3-5 rekomendasi konkret untuk meningkatkan penjualan.`;
        break;

      case 'contacts':
        prompt += `FOKUS ANALISIS DAN SECTIONS YANG HARUS DIBUAT:

1. SECTION "Statistik Jaringan" (type: stats):
   - Total kontak
   - Kontak aktif
   - Kontak VIP
   - Total nilai pembelian dari kontak

2. SECTION "Segmentasi Kontak" (type: table):
   - Tabel dengan kolom: Kategori, Jumlah, Persentase
   - Gunakan data dari byType

3. SECTION "Distribusi Lokasi" (type: table):
   - Tabel dengan kolom: Lokasi, Jumlah
   - Gunakan data dari topLocations (top 10)

4. SECTION "Top Pembeli" (type: table):
   - Tabel dengan kolom: Nama, Tipe, Perusahaan, Total Pembelian
   - Gunakan data dari topBuyers

5. SECTION "Kontak VIP" (type: table):
   - Tabel dengan kolom: Nama, Tipe, Perusahaan, Lokasi
   - Gunakan data dari vipContacts

6. SECTION "Daftar Kontak" (type: table):
   - Tabel lengkap dengan kolom: Nama, Tipe, Perusahaan, Lokasi, Email
   - Gunakan data dari contactsList

7. SECTION "Peluang Kolaborasi" (type: text):
   - Identifikasi peluang kerjasama berdasarkan segmentasi
   - Rekomendasi follow-up untuk kontak potensial

Berikan 3-5 rekomendasi konkret untuk memperluas jaringan.`;
        break;

      case 'activity':
        prompt += `FOKUS ANALISIS DAN SECTIONS YANG HARUS DIBUAT:

1. SECTION "Statistik Aktivitas" (type: stats):
   - Total aktivitas
   - Aktivitas minggu ini
   - Aktivitas bulan ini

2. SECTION "Distribusi Tipe Aktivitas" (type: table):
   - Tabel dengan kolom: Tipe Aktivitas, Jumlah, Persentase
   - Gunakan data dari byType

3. SECTION "Timeline Aktivitas" (type: table):
   - Tabel dengan kolom: Tanggal, Jumlah Aktivitas
   - Gunakan data dari timeline

4. SECTION "Aktivitas Penting" (type: table):
   - Tabel dengan kolom: Tipe, Judul, Tanggal
   - Gunakan data dari importantActivities (penjualan, dll)

5. SECTION "Aktivitas Terbaru" (type: table):
   - Tabel lengkap dengan kolom: Tipe, Judul, Tanggal, Waktu
   - Gunakan data dari recentActivities (maksimal 20)

6. SECTION "Analisis Produktivitas" (type: text):
   - Analisis pola aktivitas
   - Identifikasi periode paling produktif
   - Insight tentang fokus kerja

Berikan 3-5 rekomendasi konkret untuk meningkatkan produktivitas.`;
        break;

      case 'combined':
        prompt += `FOKUS ANALISIS DAN SECTIONS YANG HARUS DIBUAT:

1. SECTION "Ringkasan Bisnis" (type: stats):
   - Total karya seni
   - Total pendapatan
   - Total kontak
   - Total aktivitas

2. SECTION "Performa Inventaris" (type: text):
   - Ringkasan kondisi inventaris
   - Status karya dan nilai total

3. SECTION "Performa Penjualan" (type: text):
   - Ringkasan tren penjualan
   - Top performer

4. SECTION "Jaringan & Kontak" (type: text):
   - Ringkasan segmentasi kontak
   - VIP dan top buyers

5. SECTION "Aktivitas Bisnis" (type: text):
   - Ringkasan aktivitas
   - Highlight penting

6. SECTION "Analisis Korelasi" (type: text):
   - Hubungan antara inventaris, penjualan, kontak, dan aktivitas
   - Insight bisnis keseluruhan

Berikan 5-7 rekomendasi strategis untuk pengembangan bisnis seni.`;
        break;
    }

    return prompt;
  }

  /**
   * Generate a quick summary for a report
   */
  async generateQuickSummary(data: Record<string, unknown>, context: string): Promise<string> {
    const messages: GroqMessage[] = [
      {
        role: 'system',
        content: 'Kamu adalah asisten AI yang memberikan ringkasan singkat dan jelas dalam Bahasa Indonesia. Berikan ringkasan dalam 2-3 kalimat saja.',
      },
      {
        role: 'user',
        content: `Berikan ringkasan singkat untuk konteks berikut:\n\nKonteks: ${context}\n\nData: ${JSON.stringify(data)}`,
      },
    ];

    return this.generateCompletion(messages);
  }

  /**
   * Sanitize JSON string to remove control characters that break parsing
   * This handles the case where AI returns JSON with newlines that need cleaning
   */
  private sanitizeJsonString(jsonStr: string): string {
    // Step 1: Remove BOM and trim
    let sanitized = jsonStr.trim();
    
    // Step 2: First, try to parse as-is (maybe it's already valid)
    try {
      JSON.parse(sanitized);
      return sanitized; // Already valid JSON
    } catch {
      // Continue with sanitization
    }
    
    // Step 3: Remove all newlines, carriage returns, and tabs 
    // (they're only used for formatting, not needed in JSON structure)
    sanitized = sanitized
      .replace(/\r\n/g, ' ')  // Windows newlines
      .replace(/\n/g, ' ')    // Unix newlines  
      .replace(/\r/g, ' ')    // Old Mac newlines
      .replace(/\t/g, ' ');   // Tabs
    
    // Step 4: Clean up multiple spaces
    sanitized = sanitized.replace(/\s+/g, ' ');
    
    // Step 5: Remove spaces after { and [ and before } and ]
    sanitized = sanitized
      .replace(/\{\s+/g, '{')
      .replace(/\s+\}/g, '}')
      .replace(/\[\s+/g, '[')
      .replace(/\s+\]/g, ']')
      .replace(/,\s+/g, ',')
      .replace(/:\s+/g, ':');
    
    // Step 6: Fix common JSON issues from AI responses
    // Remove trailing commas before closing brackets
    sanitized = sanitized.replace(/,(\s*[}\]])/g, '$1');
    
    // Step 7: Try parsing again
    try {
      JSON.parse(sanitized);
      return sanitized;
    } catch (e) {
      console.error('[Groq] JSON still invalid after sanitization:', e);
      // Return the sanitized version anyway, let the caller handle the error
      return sanitized;
    }
  }

  /**
   * Create a comprehensive fallback report when AI response parsing fails
   * This generates actual data tables from the raw data, not just summaries
   */
  private createFallbackReport(reportData: ReportData): FormattedReport {
    console.log('[Groq] Creating comprehensive fallback report for:', reportData.type);
    
    const titles: Record<string, string> = {
      inventory: 'Laporan Inventaris Karya Seni',
      sales: 'Laporan Penjualan',
      contacts: 'Laporan Kontak & Jaringan',
      activity: 'Laporan Aktivitas',
      combined: 'Laporan Lengkap Bisnis Seni',
    };
    
    const data = reportData.data;
    const sections: ReportSection[] = [];
    
    // Build stats section
    const statsSection: StatItem[] = [];
    
    // Extract all available stats
    if (typeof data.totalArtworks === 'number') {
      statsSection.push({ label: 'Total Karya', value: String(data.totalArtworks), trend: 'neutral' });
    }
    if (data.totalEstimatedValueFormatted) {
      statsSection.push({ label: 'Nilai Estimasi', value: String(data.totalEstimatedValueFormatted), trend: 'neutral' });
    }
    if (typeof data.totalRevenue === 'number' || data.totalRevenueFormatted) {
      statsSection.push({ 
        label: 'Total Pendapatan', 
        value: data.totalRevenueFormatted as string || new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.totalRevenue as number),
        trend: 'neutral'
      });
    }
    if (typeof data.totalContacts === 'number') {
      statsSection.push({ label: 'Total Kontak', value: String(data.totalContacts), trend: 'neutral' });
    }
    if (typeof data.totalSalesCount === 'number') {
      statsSection.push({ label: 'Jumlah Penjualan', value: String(data.totalSalesCount), trend: 'neutral' });
    }
    if (typeof data.totalActivities === 'number') {
      statsSection.push({ label: 'Total Aktivitas', value: String(data.totalActivities), trend: 'neutral' });
    }
    if (typeof data.availableArtworksCount === 'number') {
      statsSection.push({ label: 'Karya Tersedia', value: String(data.availableArtworksCount), trend: 'neutral' });
    }
    if (typeof data.vipContactsCount === 'number') {
      statsSection.push({ label: 'Kontak VIP', value: String(data.vipContactsCount), trend: 'neutral' });
    }

    if (statsSection.length > 0) {
      sections.push({
        title: 'Statistik Utama',
        type: 'stats',
        content: statsSection,
      });
    }

    // Build data tables based on report type
    if (reportData.type === 'inventory' || reportData.type === 'combined') {
      // Status distribution table
      if (Array.isArray(data.statusDistribution) && data.statusDistribution.length > 0) {
        sections.push({
          title: 'Distribusi Status Karya',
          type: 'table',
          content: {
            headers: ['Status', 'Jumlah', 'Persentase'],
            rows: (data.statusDistribution as Array<{status: string; count: number; percentage: number}>)
              .map(s => [s.status, String(s.count), `${s.percentage}%`]),
          },
        });
      }
      
      // Top artworks table
      if (Array.isArray(data.topValuedArtworks) && data.topValuedArtworks.length > 0) {
        sections.push({
          title: 'Karya Bernilai Tertinggi',
          type: 'table',
          content: {
            headers: ['Judul', 'Harga', 'Medium', 'Status'],
            rows: (data.topValuedArtworks as Array<{title: string; priceFormatted: string; medium: string; status: string}>)
              .slice(0, 10)
              .map(a => [a.title, a.priceFormatted, a.medium, a.status]),
          },
        });
      }

      // Artworks list table
      if (Array.isArray(data.artworksList) && data.artworksList.length > 0) {
        sections.push({
          title: 'Daftar Karya Seni',
          type: 'table',
          content: {
            headers: ['Judul', 'Medium', 'Dimensi', 'Tahun', 'Status', 'Harga'],
            rows: (data.artworksList as Array<{title: string; medium: string; dimensions: string; year: string; status: string; priceFormatted: string}>)
              .slice(0, 20)
              .map(a => [a.title, a.medium, a.dimensions, a.year, a.status, a.priceFormatted]),
          },
        });
      }
    }

    if (reportData.type === 'sales' || reportData.type === 'combined') {
      // Monthly breakdown table
      if (Array.isArray(data.monthlyBreakdown) && data.monthlyBreakdown.length > 0) {
        sections.push({
          title: 'Tren Penjualan Bulanan',
          type: 'table',
          content: {
            headers: ['Periode', 'Pendapatan', 'Jumlah Transaksi'],
            rows: (data.monthlyBreakdown as Array<{period: string; revenueFormatted: string; salesCount: number}>)
              .map(m => [m.period, m.revenueFormatted, String(m.salesCount)]),
          },
        });
      }

      // Top sales table  
      if (Array.isArray(data.topSales) && data.topSales.length > 0) {
        sections.push({
          title: 'Top Penjualan',
          type: 'table',
          content: {
            headers: ['Judul', 'Nilai', 'Tanggal', 'Status'],
            rows: (data.topSales as Array<{title: string; amountFormatted: string; date: string; status: string}>)
              .slice(0, 10)
              .map(s => [s.title, s.amountFormatted, s.date, s.status]),
          },
        });
      }

      // Sales list table
      if (Array.isArray(data.salesList) && data.salesList.length > 0) {
        sections.push({
          title: 'Daftar Transaksi',
          type: 'table',
          content: {
            headers: ['Judul', 'Nilai', 'Tanggal', 'Status', 'Metode Pembayaran'],
            rows: (data.salesList as Array<{title: string; amountFormatted: string; date: string; status: string; paymentMethod: string}>)
              .slice(0, 20)
              .map(s => [s.title, s.amountFormatted, s.date, s.status, s.paymentMethod]),
          },
        });
      }
    }

    if (reportData.type === 'contacts' || reportData.type === 'combined') {
      // Contact type distribution table
      if (Array.isArray(data.byType) && data.byType.length > 0) {
        sections.push({
          title: 'Segmentasi Kontak',
          type: 'table',
          content: {
            headers: ['Kategori', 'Jumlah', 'Persentase'],
            rows: (data.byType as Array<{type: string; count: number; percentage: number}>)
              .map(t => [t.type, String(t.count), `${t.percentage}%`]),
          },
        });
      }

      // Top buyers table
      if (Array.isArray(data.topBuyers) && data.topBuyers.length > 0) {
        sections.push({
          title: 'Top Pembeli',
          type: 'table',
          content: {
            headers: ['Nama', 'Tipe', 'Perusahaan', 'Total Pembelian'],
            rows: (data.topBuyers as Array<{name: string; type: string; company: string; totalPurchasesFormatted: string}>)
              .slice(0, 10)
              .map(b => [b.name, b.type, b.company, b.totalPurchasesFormatted]),
          },
        });
      }

      // Contacts list table
      if (Array.isArray(data.contactsList) && data.contactsList.length > 0) {
        sections.push({
          title: 'Daftar Kontak',
          type: 'table',
          content: {
            headers: ['Nama', 'Tipe', 'Perusahaan', 'Lokasi', 'Email'],
            rows: (data.contactsList as Array<{name: string; type: string; company: string; location: string; email: string}>)
              .slice(0, 20)
              .map(c => [c.name, c.type, c.company, c.location, c.email]),
          },
        });
      }
    }

    if (reportData.type === 'activity' || reportData.type === 'combined') {
      // Activity type distribution table
      if (Array.isArray(data.byType) && data.byType.length > 0) {
        sections.push({
          title: 'Distribusi Tipe Aktivitas',
          type: 'table',
          content: {
            headers: ['Tipe', 'Jumlah', 'Persentase'],
            rows: (data.byType as Array<{type: string; count: number; percentage: number}>)
              .map(t => [t.type, String(t.count), `${t.percentage}%`]),
          },
        });
      }

      // Recent activities table
      if (Array.isArray(data.recentActivities) && data.recentActivities.length > 0) {
        sections.push({
          title: 'Aktivitas Terbaru',
          type: 'table',
          content: {
            headers: ['Tipe', 'Judul', 'Tanggal', 'Waktu'],
            rows: (data.recentActivities as Array<{type: string; title: string; date: string; time: string}>)
              .slice(0, 20)
              .map(a => [a.type, a.title, a.date, a.time]),
          },
        });
      }
    }

    // Add summary section
    sections.push({
      title: 'Ringkasan',
      type: 'text',
      content: `Laporan ini berisi ${sections.length - 1} bagian data yang berhasil diproses. ` +
               `Data telah diformat secara otomatis dari sistem untuk memudahkan analisis. ` +
               `Untuk insight dan rekomendasi yang lebih mendalam, silakan coba generate laporan kembali.`,
    });

    return {
      title: titles[reportData.type] || reportData.title,
      summary: `Laporan ${titles[reportData.type] || reportData.title} ini menampilkan data lengkap dari sistem ArtConnect CRM. ` +
               `Terdapat ${statsSection.length} metrik utama dan ${sections.length - 1} tabel data yang telah dianalisis.`,
      sections,
      recommendations: [
        'Tinjau data di atas untuk memahami kondisi bisnis saat ini',
        'Gunakan data statistik sebagai dasar pengambilan keputusan',
        'Lakukan follow-up pada item yang memerlukan perhatian',
        'Update data secara berkala untuk analisis yang akurat',
      ],
      generatedAt: new Date().toISOString(),
    };
  }
}

export const groqService = new GroqService();
export default groqService;
