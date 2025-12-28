import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { 
  Palette, 
  ArrowLeft, 
  Shield,
  Lock,
  Eye,
  Database,
  Share2,
  Trash2,
  Bell,
  Cookie,
  Globe,
  Mail,
  FileText,
  CheckCircle2,
  AlertCircle,
  Heart,
  ChevronRight,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Privacy sections data
const privacySections = [
  {
    id: "data-collection",
    icon: Database,
    title: "Data yang Kami Kumpulkan",
    color: "from-blue-500 to-cyan-600",
    content: [
      {
        subtitle: "Informasi yang Anda Berikan",
        items: [
          "Informasi profil: nama, email (jika ada fitur login)",
          "Data karya seni: judul, deskripsi, kategori, harga, gambar",
          "Data kontak: nama, email, telepon, alamat kontak bisnis Anda",
          "Catatan dan aktivitas yang Anda input ke dalam sistem"
        ]
      },
      {
        subtitle: "Informasi Otomatis",
        items: [
          "Data penggunaan: halaman yang dikunjungi, fitur yang digunakan",
          "Informasi perangkat: jenis browser, sistem operasi",
          "Data performa: waktu loading, error logs"
        ]
      }
    ]
  },
  {
    id: "data-usage",
    icon: Eye,
    title: "Bagaimana Kami Menggunakan Data",
    color: "from-purple-500 to-violet-600",
    content: [
      {
        subtitle: "Tujuan Penggunaan",
        items: [
          "Menyediakan dan memelihara layanan ArtConnect",
          "Menyimpan dan menampilkan data karya seni Anda",
          "Mengelola database kontak profesional Anda",
          "Menghasilkan laporan dan analitik untuk penggunaan pribadi Anda",
          "Meningkatkan pengalaman pengguna dan performa aplikasi"
        ]
      }
    ]
  },
  {
    id: "data-storage",
    icon: Lock,
    title: "Penyimpanan Data",
    color: "from-emerald-500 to-teal-600",
    content: [
      {
        subtitle: "Lokasi Penyimpanan",
        items: [
          "Data disimpan secara lokal di browser Anda (localStorage)",
          "Tidak ada data yang dikirim ke server eksternal dalam versi saat ini",
          "Data tetap berada di perangkat Anda dan tidak dapat diakses oleh pihak lain"
        ]
      },
      {
        subtitle: "Keamanan Data",
        items: [
          "Data tersimpan dalam format terenkripsi di browser",
          "Hanya dapat diakses melalui perangkat dan browser yang sama",
          "Disarankan untuk backup data secara berkala menggunakan fitur export"
        ]
      }
    ]
  },
  {
    id: "data-sharing",
    icon: Share2,
    title: "Berbagi Data",
    color: "from-amber-500 to-orange-600",
    content: [
      {
        subtitle: "Kebijakan Berbagi",
        items: [
          "Kami TIDAK menjual data pribadi Anda kepada pihak ketiga",
          "Kami TIDAK membagikan data Anda ke platform iklan",
          "Data Anda hanya dapat diakses oleh Anda sendiri",
          "Fitur export memungkinkan Anda mengunduh data dalam format CSV/PDF"
        ]
      }
    ]
  },
  {
    id: "cookies",
    icon: Cookie,
    title: "Cookies & Penyimpanan Lokal",
    color: "from-rose-500 to-pink-600",
    content: [
      {
        subtitle: "Penggunaan Cookies",
        items: [
          "Kami menggunakan localStorage untuk menyimpan data aplikasi",
          "Cookies digunakan untuk preferensi tampilan (tema, bahasa)",
          "Tidak ada cookies tracking dari pihak ketiga",
          "Anda dapat menghapus cookies kapan saja melalui pengaturan browser"
        ]
      }
    ]
  },
  {
    id: "user-rights",
    icon: Shield,
    title: "Hak Anda",
    color: "from-cyan-500 to-sky-600",
    content: [
      {
        subtitle: "Kontrol Data",
        items: [
          "Hak untuk mengakses: lihat semua data yang tersimpan",
          "Hak untuk mengedit: ubah informasi kapan saja",
          "Hak untuk menghapus: hapus data karya, kontak, atau seluruh akun",
          "Hak untuk export: unduh data Anda dalam format standar (CSV/PDF)",
          "Hak untuk portabilitas: pindahkan data ke platform lain"
        ]
      }
    ]
  },
  {
    id: "data-deletion",
    icon: Trash2,
    title: "Penghapusan Data",
    color: "from-red-500 to-rose-600",
    content: [
      {
        subtitle: "Cara Menghapus Data",
        items: [
          "Hapus karya seni individual melalui halaman Inventaris",
          "Hapus kontak individual melalui halaman Jejaring",
          "Hapus seluruh data dengan membersihkan localStorage browser",
          "Data yang dihapus tidak dapat dipulihkan - pastikan backup terlebih dahulu"
        ]
      }
    ]
  },
  {
    id: "updates",
    icon: Bell,
    title: "Pembaruan Kebijakan",
    color: "from-indigo-500 to-purple-600",
    content: [
      {
        subtitle: "Perubahan Kebijakan",
        items: [
          "Kebijakan ini dapat diperbarui sewaktu-waktu",
          "Perubahan signifikan akan dinotifikasi melalui aplikasi",
          "Tanggal pembaruan terakhir tercantum di bagian atas halaman ini",
          "Penggunaan berkelanjutan dianggap sebagai persetujuan terhadap kebijakan terbaru"
        ]
      }
    ]
  },
];

// Key points for quick reference
const keyPoints = [
  {
    icon: Lock,
    title: "Data Lokal",
    description: "Semua data tersimpan di perangkat Anda"
  },
  {
    icon: Shield,
    title: "Tidak Dijual",
    description: "Data Anda tidak pernah dijual ke pihak ketiga"
  },
  {
    icon: Eye,
    title: "Transparan",
    description: "Anda tahu persis data apa yang disimpan"
  },
  {
    icon: Trash2,
    title: "Kontrol Penuh",
    description: "Hapus data kapan saja tanpa syarat"
  },
];

// Section Card Component
const SectionCard = ({ section, index, isVisible }: {
  section: typeof privacySections[0];
  index: number;
  isVisible: boolean;
}) => {
  const Icon = section.icon;

  return (
    <div 
      id={section.id}
      className={`p-6 md:p-8 rounded-2xl bg-card/30 border border-border/30 transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start gap-4 mb-6">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.color} p-[1px] flex-shrink-0`}>
          <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
            <Icon className="w-6 h-6 text-foreground" />
          </div>
        </div>
        <div>
          <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
            {section.title}
          </h2>
        </div>
      </div>

      <div className="space-y-6">
        {section.content.map((block, blockIndex) => (
          <div key={blockIndex}>
            <h3 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {block.subtitle}
            </h3>
            <ul className="space-y-2">
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ChevronRight className="w-4 h-4 text-primary/60 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const PrivacyPolicyPage = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [keyPointsVisible, setKeyPointsVisible] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const keyPointsRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

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
      { ref: keyPointsRef, setter: setKeyPointsVisible },
      { ref: sectionsRef, setter: setSectionsVisible },
      { ref: contactRef, setter: setContactVisible },
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
                <Shield className="w-4 h-4" />
                <span>Kebijakan Privasi</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Privasi Anda adalah
                <span className="text-gradient"> Prioritas Kami</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-6">
                Kami berkomitmen untuk melindungi privasi dan keamanan data Anda. 
                Dokumen ini menjelaskan bagaimana kami mengumpulkan, menggunakan, 
                dan melindungi informasi Anda saat menggunakan ArtConnect.
              </p>

              {/* Last Updated */}
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>Terakhir diperbarui: 27 Desember 2025</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Points */}
        <section 
          ref={keyPointsRef}
          className="py-12 relative"
        >
          <div className="container px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {keyPoints.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div 
                    key={point.title}
                    className={`p-5 rounded-xl bg-card/30 border border-border/30 text-center
                      transition-all duration-500
                      ${keyPointsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{point.title}</h3>
                    <p className="text-sm text-muted-foreground">{point.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-8 relative">
          <div className="container px-4">
            <div className={`max-w-4xl mx-auto p-6 rounded-2xl bg-card/30 border border-border/30 transition-all duration-700
              ${keyPointsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Daftar Isi
              </h2>
              <div className="grid md:grid-cols-2 gap-2">
                {privacySections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-colors text-sm text-muted-foreground hover:text-primary group"
                  >
                    <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary group-hover:bg-primary group-hover:text-background transition-colors">
                      {index + 1}
                    </span>
                    {section.title}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Sections */}
        <section 
          ref={sectionsRef}
          className="py-12 relative"
        >
          <div className="container px-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {privacySections.map((section, index) => (
                <SectionCard 
                  key={section.id}
                  section={section}
                  index={index}
                  isVisible={sectionsVisible}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Important Notice */}
        <section className="py-12 relative">
          <div className="container px-4">
            <div className={`max-w-4xl mx-auto p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 transition-all duration-700
              ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Catatan Penting</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    ArtConnect adalah proyek akademik yang dikembangkan untuk keperluan 
                    pembelajaran. Meskipun kami menerapkan praktik keamanan terbaik, 
                    disarankan untuk tidak menyimpan data sensitif atau rahasia di dalam aplikasi ini. 
                    Selalu backup data Anda secara berkala menggunakan fitur export.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          ref={contactRef}
          className="py-12 relative"
        >
          <div className="container px-4">
            <div className={`max-w-4xl mx-auto p-8 rounded-3xl bg-card/30 border border-border/30 text-center transition-all duration-700
              ${contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-amber-600 p-[1px] mx-auto mb-6">
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                  <Mail className="w-7 h-7 text-primary" />
                </div>
              </div>

              <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                Ada Pertanyaan tentang Privasi?
              </h2>

              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Jika Anda memiliki pertanyaan atau kekhawatiran tentang kebijakan privasi kami, 
                jangan ragu untuk menghubungi tim kami.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="mailto:privacy@artconnect.id">
                  <Button variant="default" size="lg" className="gap-2">
                    <Mail className="w-5 h-5" />
                    privacy@artconnect.id
                  </Button>
                </a>
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

export default PrivacyPolicyPage;
