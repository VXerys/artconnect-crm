<p align="center">
  <img src="public/logo-light.png" alt="ArtConnect Logo" width="120" />
</p>

<h1 align="center">🎨 ArtConnect CRM</h1>

<p align="center">
  <strong>Platform CRM & Workspace Terpadu untuk Seniman Visual Indonesia</strong>
</p>

<p align="center">
  <a href="#-fitur-utama">Fitur</a> •
  <a href="#-teknologi">Teknologi</a> •
  <a href="#-instalasi">Instalasi</a> •
  <a href="#-struktur-proyek">Struktur</a> •
  <a href="#-tim-pengembang">Tim</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4?style=flat-square&logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=flat-square&logo=supabase" alt="Supabase" />
</p>

---

## 🎓 Proyek UAS

> **Proyek Ujian Akhir Semester (UAS)**  
> **Mata Kuliah:** Pengembangan Aplikasi Berbasis Web  
> **Tahun Akademik:** 2024/2025

Proyek ini dikembangkan sebagai tugas akhir mata kuliah **Pengembangan Aplikasi Berbasis Web**. ArtConnect CRM adalah aplikasi web yang dirancang untuk membantu seniman visual dalam mengelola karya seni, kontak profesional, dan aktivitas bisnis mereka.

---

## 📖 Tentang Proyek

**ArtConnect** adalah platform Customer Relationship Management (CRM) yang dirancang khusus untuk seniman visual. Aplikasi ini membantu seniman mengelola inventaris karya seni, membangun jejaring profesional, melacak penjualan, dan mengembangkan karier seni mereka dalam satu ekosistem digital yang terintegrasi.

### 🎯 Mengapa ArtConnect?

| Tantangan Seniman | Solusi ArtConnect |
|-------------------|-------------------|
| Sulit melacak karya yang sudah dibuat | Inventaris digital dengan foto, metadata, dan status |
| Kontak kolektor & galeri tersebar | Database kontak terpusat dengan riwayat interaksi |
| Tidak ada visibilitas proses kreatif | Pipeline Kanban untuk tracking dari konsep hingga terjual |
| Laporan penjualan manual | Dashboard analitik real-time dengan export PDF/CSV |

---

## ✨ Fitur Utama

### 🖼️ Inventaris Karya Seni
- Dokumentasi visual lengkap dengan galeri foto
- Metadata terstruktur (ukuran, media, tahun, harga)
- Kategorisasi fleksibel dengan tag dan koleksi
- Status tracking: Konsep → Proses → Selesai → Terjual

### 👥 Manajemen Jejaring
- Database kontak profesional (kolektor, galeri, kurator)
- Segmentasi kontak berdasarkan tipe dan preferensi
- Riwayat interaksi dan catatan komunikasi
- Quick actions untuk email dan WhatsApp

### 📊 Pipeline Kanban
- Visualisasi siklus hidup karya seni
- Drag-and-drop interface untuk update status
- Filter dan pencarian cepat
- Integrasi dengan data inventaris

### 📈 Dashboard Analitik
- Ringkasan statistik real-time
- Grafik penjualan dan tren
- Aktivitas terbaru
- Widget yang dapat dikustomisasi

### 📑 Pelaporan & Export
- Laporan inventaris, penjualan, kontak, dan aktivitas
- **AI-Powered Report Generation** menggunakan Groq AI
- Export ke PDF, CSV, dan Excel
- Penjadwalan laporan otomatis

### 🔐 Autentikasi & Keamanan
- Login dengan Email/Password
- OAuth dengan Google
- Magic Link (Passwordless)
- Row Level Security (RLS) dengan Supabase

---

## 🚀 Demo

**Live Demo:** [https://artconnect-crm.netlify.app](https://artconnect-crm.netlify.app)

---

## 🛠️ Teknologi

### Frontend
| Teknologi | Kegunaan |
|-----------|----------|
| **React 18** | UI Library dengan Concurrent Features |
| **TypeScript** | Type Safety & Developer Experience |
| **Vite** | Build Tool dengan Hot Module Replacement |
| **Tailwind CSS** | Utility-first Styling |
| **shadcn/ui** | Komponen UI yang Dapat Dikustomisasi |
| **Radix UI** | Headless Component Primitives |
| **Lucide Icons** | Icon Library |
| **React Router** | Client-side Routing |
| **React Query** | Server State Management |
| **React Hook Form** | Form Handling |
| **Zod** | Schema Validation |
| **Recharts** | Data Visualization |
| **GSAP** | Animasi Lanjutan |
| **dnd-kit** | Drag and Drop |

### Backend
| Teknologi | Kegunaan |
|-----------|----------|
| **Supabase** | Backend-as-a-Service |
| **PostgreSQL** | Database Relasional |
| **Supabase Auth** | Autentikasi & Otorisasi |
| **Supabase Storage** | File Storage untuk Gambar |
| **Supabase Edge Functions** | Serverless Functions |

### DevOps & Tooling
| Teknologi | Kegunaan |
|-----------|----------|
| **Netlify** | Hosting & CD |
| **ESLint** | Code Linting |
| **Prettier** | Code Formatting |
| **Git** | Version Control |

---

## 📦 Instalasi

### Prasyarat

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 atau **yarn** >= 1.22.0
- **Git**
- Akun **Supabase** (gratis)

### Langkah-langkah

#### 1. Clone Repository

```bash
git clone https://github.com/your-username/artconnect-crm.git
cd artconnect-crm
```

#### 2. Install Dependencies

```bash
npm install
# atau
yarn install
```

#### 3. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

Edit file `.env` dan isi dengan kredensial Supabase Anda:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional: Groq AI for Report Generation
VITE_GROQ_API_KEY=your-groq-api-key
```

#### 4. Setup Database Supabase

1. Buat proyek baru di [Supabase Dashboard](https://supabase.com/dashboard)
2. Jalankan migration SQL yang ada di folder `supabase/migrations/`
3. Aktifkan Row Level Security (RLS) pada semua tabel
4. Konfigurasi Auth Providers (Email, Google OAuth)

#### 5. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### Scripts yang Tersedia

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Menjalankan development server |
| `npm run build` | Build untuk production |
| `npm run build:dev` | Build untuk development |
| `npm run preview` | Preview production build |
| `npm run lint` | Jalankan ESLint |

---

## 📁 Struktur Proyek

```
artconnect-crm/
├── 📂 public/                 # Static assets
│   ├── favicon.svg
│   ├── logo-light.png
│   └── logo-dark.png
├── 📂 src/
│   ├── 📂 assets/             # Gambar dan media
│   ├── 📂 components/         # React components
│   │   ├── 📂 ui/             # Komponen UI dasar (shadcn)
│   │   ├── 📂 layout/         # Layout components
│   │   ├── 📂 landing/        # Landing page sections
│   │   ├── 📂 dashboard/      # Dashboard widgets
│   │   ├── 📂 artworks/       # Komponen inventaris
│   │   ├── 📂 contacts/       # Komponen kontak
│   │   ├── 📂 pipeline/       # Komponen Kanban
│   │   └── 📂 reports/        # Komponen pelaporan
│   ├── 📂 context/            # React Context (Auth)
│   ├── 📂 hooks/              # Custom React hooks
│   ├── 📂 lib/                # Utilities & configurations
│   │   ├── supabase.ts        # Supabase client
│   │   └── utils.ts           # Helper functions
│   ├── 📂 pages/              # Route pages
│   │   ├── 📂 auth/           # Auth pages
│   │   ├── Dashboard.tsx
│   │   ├── Artworks.tsx
│   │   ├── Contacts.tsx
│   │   ├── Pipeline.tsx
│   │   ├── Reports.tsx
│   │   └── Settings.tsx
│   ├── App.tsx                # Root component & routing
│   ├── main.tsx               # Entry point
│   └── index.css              # Global styles & theme
├── 📂 supabase/               # Supabase configurations
│   └── 📂 migrations/         # SQL migrations
├── 📂 email-templates/        # Email HTML templates
├── .env.example               # Environment template
├── index.html                 # HTML entry point
├── tailwind.config.ts         # Tailwind configuration
├── vite.config.ts             # Vite configuration
└── package.json               # Dependencies & scripts
```

---

## 🎨 Sistem Desain

### Palet Warna

ArtConnect menggunakan tema gelap premium dengan aksen amber/copper:

| Variabel | Nilai HSL | Penggunaan |
|----------|-----------|------------|
| `--background` | `220 15% 3%` | Latar belakang utama |
| `--foreground` | `40 15% 95%` | Teks utama |
| `--primary` | `32 95% 55%` | Aksen utama (amber) |
| `--card` | `220 15% 5%` | Latar kartu |
| `--muted` | `220 12% 12%` | Elemen sekunder |

### Tipografi

- **Display Font:** Playfair Display (serif)
- **Body Font:** DM Sans (sans-serif)

### Komponen UI

Proyek ini menggunakan **shadcn/ui** sebagai fondasi komponen, dengan kustomisasi untuk:
- Glassmorphism effects
- Gradient backgrounds
- Smooth animations dengan GSAP
- Responsive design untuk mobile-first

---

## � Tim Pengembang

Proyek **ArtConnect CRM** dikembangkan oleh tim mahasiswa sebagai tugas akhir mata kuliah Pengembangan Aplikasi Berbasis Web.

### Anggota Tim

| No | Nama | Peran | Tanggung Jawab |
|----|------|-------|----------------|
| 1 | **Sechan** | Fullstack Developer | Pengembangan frontend & backend, integrasi API, arsitektur sistem |
| 2 | **Akbar** | Documentation | Pembuatan dokumentasi teknis, user guide, laporan proyek |
| 3 | **Ghibran** | Documentation | Pembuatan dokumentasi teknis, user guide, laporan proyek |
| 4 | **Fatir** | UI/UX Designer | Desain antarmuka, wireframe, user experience, visual design |
| 5 | **Sinar** | QA / Testing | Pengujian aplikasi, bug tracking, quality assurance |

---

## 📝 Changelog

### v1.0.0 (2025-01-09)
- 🎉 Initial release
- ✨ Inventaris karya seni dengan galeri foto
- ✨ Manajemen kontak profesional
- ✨ Pipeline Kanban drag-and-drop
- ✨ Dashboard analitik real-time
- ✨ Laporan dengan AI generation
- ✨ Autentikasi multi-provider
- ✨ Tema gelap premium

---

## 📄 Lisensi

Proyek ini dikembangkan untuk keperluan akademik dalam rangka memenuhi tugas UAS mata kuliah **Pengembangan Aplikasi Berbasis Web**.

---

<p align="center">
  <sub>🎓 UAS Project - Pengembangan Aplikasi Berbasis Web</sub><br/>
  <sub>Built with ❤️ using React, TypeScript, and Supabase</sub>
</p>
