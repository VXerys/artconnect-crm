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
    const systemPrompt = `Kamu adalah asisten AI profesional yang ahli dalam membuat laporan bisnis untuk seniman dan galeri seni. 
Tugasmu adalah menganalisis data dan menghasilkan laporan yang terstruktur, informatif, dan mudah dipahami.

INSTRUKSI PENTING:
1. Selalu gunakan Bahasa Indonesia yang formal namun mudah dipahami
2. Format output dalam JSON yang valid
3. Berikan ringkasan eksekutif yang jelas di bagian summary
4. Buat struktur sections yang rapi dengan tipe yang sesuai:
   - "text" untuk paragraf deskriptif
   - "table" untuk data tabular dengan headers dan rows
   - "stats" untuk statistik dengan label, value, trend (up/down/neutral), dan change
   - "chart" untuk rekomendasi visualisasi (deskripsi saja)
5. Sertakan rekomendasi yang actionable berdasarkan analisis data
6. Pastikan semua angka mata uang diformat dalam Rupiah (Rp)
7. Berikan insight yang berguna dan tidak hanya merepetisi data

FORMAT OUTPUT JSON:
{
  "title": "Judul Laporan",
  "summary": "Ringkasan eksekutif 2-3 paragraf yang menjelaskan highlight utama dan insight penting",
  "sections": [
    {
      "title": "Judul Bagian",
      "type": "text|table|stats|chart",
      "content": "Konten sesuai tipe"
    }
  ],
  "recommendations": ["Rekomendasi 1", "Rekomendasi 2"]
}`;

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
        prompt += `FOKUS ANALISIS:
- Total karya seni dan distribusi berdasarkan status (tersedia, terjual, dipamerkan, dll)
- Nilai total estimasi inventaris
- Distribusi berdasarkan medium/kategori
- Karya dengan nilai tertinggi
- Rekomendasi pengelolaan inventaris`;
        break;

      case 'sales':
        prompt += `FOKUS ANALISIS:
- Total pendapatan dan tren penjualan
- Karya terjual terbaik (top performers)
- Rata-rata harga penjualan
- Perbandingan dengan periode sebelumnya jika tersedia
- Proyeksi dan rekomendasi strategi penjualan`;
        break;

      case 'contacts':
        prompt += `FOKUS ANALISIS:
- Total kontak dan segmentasi (galeri, kolektor, museum, dll)
- Distribusi berdasarkan kategori
- Kontak paling aktif atau bernilai tinggi
- Peluang kolaborasi atau follow-up
- Rekomendasi strategi networking`;
        break;

      case 'activity':
        prompt += `FOKUS ANALISIS:
- Total aktivitas dan jenisnya
- Timeline aktivitas penting
- Meeting dan event yang direncanakan
- Follow-up yang pending
- Rekomendasi prioritas aktivitas`;
        break;

      case 'combined':
        prompt += `FOKUS ANALISIS:
- Overview menyeluruh dari semua aspek bisnis
- Korelasi antara inventaris, penjualan, kontak, dan aktivitas
- Performa keseluruhan bisnis seni
- Highlight pencapaian utama
- Rekomendasi strategis untuk pengembangan`;
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
   */
  private sanitizeJsonString(jsonStr: string): string {
    // Remove BOM and other invisible characters
    let sanitized = jsonStr.trim();
    
    // Replace problematic control characters inside string values
    // This regex matches strings and replaces control chars within them
    sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, (char) => {
      switch (char) {
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '\t': return '\\t';
        case '\b': return '\\b';
        case '\f': return '\\f';
        default: return ''; // Remove other control characters
      }
    });
    
    // Fix common JSON issues from AI responses
    // Remove trailing commas before closing brackets
    sanitized = sanitized.replace(/,(\s*[}\]])/g, '$1');
    
    // Ensure proper escaping of backslashes
    sanitized = sanitized.replace(/\\(?!["\\/bfnrtu])/g, '\\\\');
    
    return sanitized;
  }

  /**
   * Create a fallback report when AI response parsing fails
   */
  private createFallbackReport(reportData: ReportData): FormattedReport {
    console.log('[Groq] Creating fallback report for:', reportData.type);
    
    const titles: Record<string, string> = {
      inventory: 'Laporan Inventaris Karya Seni',
      sales: 'Laporan Penjualan',
      contacts: 'Laporan Kontak & Jaringan',
      activity: 'Laporan Aktivitas',
      combined: 'Laporan Lengkap Bisnis Seni',
    };
    
    // Extract basic stats from data
    const data = reportData.data;
    const statsSection: StatItem[] = [];
    
    // Try to extract common data points
    if (typeof data.totalArtworks === 'number') {
      statsSection.push({ label: 'Total Karya', value: String(data.totalArtworks) });
    }
    if (typeof data.totalRevenue === 'number') {
      statsSection.push({ 
        label: 'Total Pendapatan', 
        value: new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(data.totalRevenue as number) 
      });
    }
    if (typeof data.totalContacts === 'number') {
      statsSection.push({ label: 'Total Kontak', value: String(data.totalContacts) });
    }
    if (typeof data.totalSalesCount === 'number') {
      statsSection.push({ label: 'Jumlah Penjualan', value: String(data.totalSalesCount) });
    }
    if (typeof data.totalActivities === 'number') {
      statsSection.push({ label: 'Total Aktivitas', value: String(data.totalActivities) });
    }

    return {
      title: titles[reportData.type] || reportData.title,
      summary: `Laporan ini dibuat secara otomatis berdasarkan data yang tersedia. ` +
               `Terdapat ${statsSection.length} metrik utama yang berhasil dianalisis. ` +
               `Silakan gunakan data ini sebagai dasar untuk analisis lebih lanjut.`,
      sections: [
        {
          title: 'Statistik Utama',
          type: 'stats',
          content: statsSection.length > 0 ? statsSection : [
            { label: 'Status', value: 'Data berhasil dimuat' }
          ],
        },
        {
          title: 'Catatan',
          type: 'text',
          content: 'Laporan ini menggunakan template fallback karena terjadi kesalahan saat memproses respons AI. ' +
                   'Data dasar tetap tersedia dan dapat digunakan untuk referensi.',
        },
      ],
      recommendations: [
        'Periksa koneksi internet dan coba generate laporan kembali',
        'Jika masalah berlanjut, hubungi dukungan teknis',
      ],
      generatedAt: new Date().toISOString(),
    };
  }
}

export const groqService = new GroqService();
export default groqService;
