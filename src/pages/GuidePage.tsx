import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Palette, 
  ArrowLeft, 
  BookOpen,
  LayoutDashboard,
  Image,
  Users,
  Kanban,
  BarChart3,
  FileText,
  ChevronRight,
  ChevronDown,
  Play,
  CheckCircle2,
  Lightbulb,
  MousePointer,
  Sparkles,
  ArrowRight,
  Plus,
  Search,
  Filter,
  Download,
  Settings,
  Target,
  TrendingUp,
  Heart
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Feature guides data
const featureGuides = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    title: "Dashboard",
    subtitle: "Pusat Kontrol Utama",
    description: "Lihat ringkasan lengkap aktivitas bisnis seni Anda dalam satu tampilan.",
    color: "from-amber-500 to-orange-600",
    route: "/dashboard",
    features: [
      "Statistik karya seni (total karya, karya terjual, nilai portofolio)",
      "Grafik tren penjualan bulanan",
      "Daftar karya seni terbaru",
      "Ringkasan kontak/jejaring terkini",
      "Feed aktivitas realtime",
      "Aksi cepat (tambah karya, kontak baru)"
    ],
    tips: [
      "Cek dashboard setiap hari untuk melihat perkembangan bisnis Anda",
      "Gunakan grafik penjualan untuk merencanakan strategi harga"
    ]
  },
  {
    id: "artworks",
    icon: Image,
    title: "Inventaris Karya",
    subtitle: "Kelola Portofolio Seni",
    description: "Dokumentasikan dan kelola seluruh karya seni Anda dengan metadata lengkap.",
    color: "from-purple-500 to-violet-600",
    route: "/artworks",
    features: [
      "Tambah karya baru dengan foto dan detail lengkap",
      "Kategorisasi berdasarkan jenis (lukisan, patung, digital, fotografi)",
      "Status karya (konsep, sedang dikerjakan, selesai, terjual)",
      "Filter dan pencarian karya",
      "Mode tampilan grid dan list",
      "Edit dan hapus karya"
    ],
    tips: [
      "Upload foto berkualitas tinggi untuk setiap karya",
      "Tambahkan deskripsi detail untuk memudahkan pencarian",
      "Update status karya secara berkala"
    ]
  },
  {
    id: "contacts",
    icon: Users,
    title: "Jejaring Kontak",
    subtitle: "CRM untuk Seniman",
    description: "Kelola hubungan profesional dengan kolektor, galeri, kurator, dan museum.",
    color: "from-blue-500 to-cyan-600",
    route: "/contacts",
    features: [
      "Tambah kontak baru (kolektor, galeri, kurator, museum)",
      "Simpan informasi kontak lengkap (email, telepon, alamat)",
      "Kategorisasi berdasarkan tipe kontak",
      "Pencarian kontak cepat",
      "Statistik kontak per kategori",
      "Lihat, edit, dan hapus kontak"
    ],
    tips: [
      "Catat setiap interaksi penting dengan kontak",
      "Kategorikan kontak dengan benar untuk follow-up yang efektif",
      "Gunakan fitur pencarian untuk menemukan kontak dengan cepat"
    ]
  },
  {
    id: "pipeline",
    icon: Kanban,
    title: "Pipeline Karya",
    subtitle: "Visualisasi Kanban",
    description: "Lacak progres karya seni dari ide hingga terjual dengan metodologi Kanban.",
    color: "from-emerald-500 to-teal-600",
    route: "/pipeline",
    features: [
      "Papan Kanban dengan 4 kolom status",
      "Drag & drop untuk memindahkan karya antar status",
      "Status: Konsep → Pengerjaan → Selesai → Terjual",
      "Tambah karya langsung ke status tertentu",
      "Lihat detail dan edit karya dari pipeline",
      "Ringkasan jumlah karya per status"
    ],
    tips: [
      "Gunakan pipeline sebagai workflow harian",
      "Pindahkan karya ke status baru saat ada progress",
      "Pantau kolom 'Terjual' untuk melihat pencapaian"
    ]
  },
  {
    id: "analytics",
    icon: BarChart3,
    title: "Analitik",
    subtitle: "Data-Driven Insights",
    description: "Analisis performa bisnis seni Anda dengan visualisasi data interaktif.",
    color: "from-rose-500 to-pink-600",
    route: "/analytics",
    features: [
      "Grafik tren penjualan",
      "Distribusi status karya (pie chart)",
      "Grafik aktivitas kontak",
      "Daftar karya terlaris",
      "Sumber traffic/interaksi",
      "Insight dan rekomendasi otomatis"
    ],
    tips: [
      "Gunakan filter rentang waktu untuk analisis periodik",
      "Perhatikan insight untuk strategi bisnis",
      "Bandingkan performa antar periode"
    ]
  },
  {
    id: "reports",
    icon: FileText,
    title: "Laporan",
    subtitle: "Export & Dokumentasi",
    description: "Generate dan export laporan bisnis dalam format CSV dan PDF.",
    color: "from-cyan-500 to-sky-600",
    route: "/reports",
    features: [
      "Generate laporan penjualan, inventaris, kontak, aktivitas",
      "Export ke format CSV dan PDF",
      "Laporan kustom dengan filter",
      "Riwayat laporan yang dibuat",
      "Penjadwalan laporan otomatis",
      "Ringkasan performa bisnis"
    ],
    tips: [
      "Buat laporan bulanan untuk evaluasi bisnis",
      "Gunakan format PDF untuk presentasi profesional",
      "Simpan laporan CSV untuk analisis lebih lanjut"
    ]
  },
];

// Getting started steps
const gettingStartedSteps = [
  {
    step: 1,
    title: "Tambahkan Karya Pertama",
    description: "Mulai dengan mendokumentasikan karya seni Anda di Inventaris Karya.",
    icon: Plus,
    action: "Tambah Karya",
    route: "/artworks"
  },
  {
    step: 2,
    title: "Bangun Jejaring",
    description: "Tambahkan kontak kolektor, galeri, dan kurator ke dalam sistem.",
    icon: Users,
    action: "Tambah Kontak",
    route: "/contacts"
  },
  {
    step: 3,
    title: "Kelola Pipeline",
    description: "Lacak progres karya dari ide hingga terjual dengan Kanban board.",
    icon: Kanban,
    action: "Lihat Pipeline",
    route: "/pipeline"
  },
  {
    step: 4,
    title: "Analisis Performa",
    description: "Pantau perkembangan bisnis seni Anda melalui dashboard analitik.",
    icon: BarChart3,
    action: "Lihat Analitik",
    route: "/analytics"
  },
];

// FAQ Data
const faqData = [
  {
    question: "Bagaimana cara menambahkan karya seni baru?",
    answer: "Buka halaman Inventaris Karya, klik tombol 'Tambah Karya', isi form dengan detail karya (judul, kategori, harga, deskripsi), upload foto, lalu klik Simpan."
  },
  {
    question: "Bagaimana cara menjual karya seni?",
    answer: "Setelah karya selesai, pindahkan ke status 'Terjual' di Pipeline. Karya yang terjual akan otomatis tercatat dalam statistik penjualan dan laporan."
  },
  {
    question: "Apa perbedaan status di Pipeline?",
    answer: "Konsep: ide awal karya. Pengerjaan: sedang dalam proses pembuatan. Selesai: karya sudah jadi dan siap dijual. Terjual: karya sudah laku terjual."
  },
  {
    question: "Bagaimana cara export data ke PDF/CSV?",
    answer: "Buka halaman Laporan, pilih tipe laporan yang diinginkan, pilih format (PDF/CSV), lalu klik Generate. File akan otomatis terunduh."
  },
  {
    question: "Apakah data saya aman?",
    answer: "Ya, data Anda disimpan secara lokal di browser. Untuk keamanan lebih, secara berkala backup data dengan fitur export di halaman Laporan."
  },
  {
    question: "Bagaimana cara menghubungi tim support?",
    answer: "Anda dapat menghubungi kami melalui email di support@artconnect.id atau melalui halaman Kontak di footer website."
  },
];

// Feature Card Component
const FeatureCard = ({ feature, index, isVisible, isExpanded, onToggle }: { 
  feature: typeof featureGuides[0]; 
  index: number;
  isVisible: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const Icon = feature.icon;
  
  return (
    <div 
      className={`rounded-3xl bg-card/30 border border-border/30 overflow-hidden
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Header - Clickable */}
      <button
        onClick={onToggle}
        className="w-full p-6 flex items-start gap-4 text-left hover:bg-card/50 transition-colors"
      >
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-[1px] flex-shrink-0`}>
          <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
            <Icon className="w-7 h-7 text-foreground" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-display text-xl font-bold text-foreground">{feature.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
              {feature.subtitle}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </div>
        
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 flex-shrink-0
          ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Expandable Content */}
      <div className={`overflow-hidden transition-all duration-300
        ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-6 pb-6 space-y-6">
          {/* Features List */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Fitur Tersedia
            </h4>
            <ul className="grid md:grid-cols-2 gap-2">
              {feature.features.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Tips */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
            <h4 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Tips Penggunaan
            </h4>
            <ul className="space-y-1">
              {feature.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-primary">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Button */}
          <Link to={feature.route}>
            <Button variant="default" size="sm" className="gap-2">
              <Play className="w-4 h-4" />
              Coba Sekarang
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// FAQ Item Component
const FaqItem = ({ faq, index, isVisible, isExpanded, onToggle }: {
  faq: typeof faqData[0];
  index: number;
  isVisible: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  return (
    <div 
      className={`rounded-xl bg-card/30 border border-border/30 overflow-hidden
        transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <button
        onClick={onToggle}
        className="w-full p-4 flex items-center gap-3 text-left hover:bg-card/50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
          <span className="text-sm font-bold text-primary">{index + 1}</span>
        </div>
        <span className="flex-1 font-medium text-foreground">{faq.question}</span>
        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300
          ${isExpanded ? 'rotate-180' : ''}`} 
        />
      </button>
      
      <div className={`overflow-hidden transition-all duration-300
        ${isExpanded ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="px-4 pb-4 pl-[52px]">
          <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
        </div>
      </div>
    </div>
  );
};

const GuidePage = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [stepsVisible, setStepsVisible] = useState(false);
  const [featuresVisible, setFeaturesVisible] = useState(false);
  const [faqVisible, setFaqVisible] = useState(false);
  const [expandedFeature, setExpandedFeature] = useState<string | null>("dashboard");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const heroRef = useRef<HTMLElement>(null);
  const stepsRef = useRef<HTMLElement>(null);
  const featuresRef = useRef<HTMLElement>(null);
  const faqRef = useRef<HTMLElement>(null);

  // Scroll to top on mount
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Intersection observers
  useEffect(() => {
    const createObserver = (setVisible: (v: boolean) => void) => {
      return new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
    };

    const observers = [
      { ref: heroRef, setter: setHeroVisible },
      { ref: stepsRef, setter: setStepsVisible },
      { ref: featuresRef, setter: setFeaturesVisible },
      { ref: faqRef, setter: setFaqVisible },
    ];

    observers.forEach(({ ref, setter }) => {
      const observer = createObserver(setter);
      if (ref.current) observer.observe(ref.current);
    });

    setHeroVisible(true);

    return () => {};
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      {/* Unified Background Glows */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-[30%] -left-[200px] w-[600px] h-[600px] bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute top-[60%] -right-[200px] w-[500px] h-[500px] bg-purple-500/3 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/50">
          <div className="container px-4">
            <div className="flex items-center justify-between h-16">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <span className="font-display text-xl font-bold">
                  Art<span className="text-primary">Connect</span>
                </span>
              </Link>
              
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali
                </Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="pt-32 pb-16 relative"
        >
          <div className="container px-4">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-700
              ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                <span>Panduan Penggunaan</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Pelajari Cara Menggunakan
                <span className="text-gradient"> ArtConnect</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-8">
                Panduan lengkap untuk memaksimalkan penggunaan platform CRM ArtConnect 
                dalam mengelola karya seni, membangun jejaring, dan mengembangkan bisnis seni Anda.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link to="/dashboard">
                  <Button variant="default" size="lg" className="gap-2">
                    <Play className="w-5 h-5" />
                    Mulai Sekarang
                  </Button>
                </Link>
                <a href="#getting-started">
                  <Button variant="outline" size="lg" className="gap-2">
                    <MousePointer className="w-5 h-5" />
                    Lihat Panduan
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Getting Started Section */}
        <section 
          ref={stepsRef}
          id="getting-started"
          className="py-20 relative"
        >
          <div className="container px-4">
            <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700
              ${stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium mb-6">
                <Target className="w-4 h-4" />
                <span>Mulai Dari Sini</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                4 Langkah <span className="text-gradient">Memulai</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Ikuti langkah-langkah sederhana ini untuk mulai menggunakan ArtConnect
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {gettingStartedSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div 
                    key={step.step}
                    className={`relative p-6 rounded-2xl bg-card/30 border border-border/30
                      hover:border-primary/30 transition-all duration-500
                      ${stepsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    {/* Step Number */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-background">
                      {step.step}
                    </div>

                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>

                    <h3 className="font-display text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">{step.description}</p>

                    <Link to={step.route}>
                      <Button variant="ghost" size="sm" className="gap-1 p-0 h-auto text-primary hover:text-primary/80">
                        {step.action}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </Link>

                    {/* Connector Line (except last) */}
                    {index < gettingStartedSteps.length - 1 && (
                      <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-border" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Feature Guides Section */}
        <section 
          ref={featuresRef}
          className="py-20 relative"
        >
          <div className="container px-4">
            <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700
              ${featuresVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Panduan Fitur</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Jelajahi Semua <span className="text-gradient">Fitur</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Klik setiap fitur untuk mempelajari cara penggunaannya secara detail
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
              {featureGuides.map((feature, index) => (
                <FeatureCard 
                  key={feature.id}
                  feature={feature}
                  index={index}
                  isVisible={featuresVisible}
                  isExpanded={expandedFeature === feature.id}
                  onToggle={() => setExpandedFeature(
                    expandedFeature === feature.id ? null : feature.id
                  )}
                />
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section 
          ref={faqRef}
          className="py-20 relative"
        >
          <div className="container px-4">
            <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700
              ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Pertanyaan <span className="text-gradient">Umum</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Temukan jawaban untuk pertanyaan yang sering diajukan
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-3">
              {faqData.map((faq, index) => (
                <FaqItem
                  key={index}
                  faq={faq}
                  index={index}
                  isVisible={faqVisible}
                  isExpanded={expandedFaq === index}
                  onToggle={() => setExpandedFaq(expandedFaq === index ? null : index)}
                />
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative">
          <div className="container px-4">
            <div className={`max-w-4xl mx-auto p-8 md:p-12 rounded-3xl bg-card/30 border border-border/30 text-center
              transition-all duration-700
              ${faqVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-6" />

              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Siap Memulai Perjalanan Seni Anda?
              </h2>

              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Mulai kelola karya seni Anda dengan lebih profesional menggunakan ArtConnect. 
                Platform ini gratis dan mudah digunakan.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/dashboard">
                  <Button variant="default" size="lg" className="gap-2">
                    Buka Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" size="lg" className="gap-2">
                    Tentang Kami
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-8 border-t border-border/30">
          <div className="container px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>© 2025 ArtConnect. Projek UAS Pengembangan Aplikasi Berbasis Web.</p>
              <div className="flex items-center gap-2">
                <span>Dibuat dengan</span>
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>di Indonesia</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default GuidePage;
