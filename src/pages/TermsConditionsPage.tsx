import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  FileText,
  Scale,
  UserCheck,
  Ban,
  Shield,
  AlertTriangle,
  BookOpen,
  Globe,
  Mail,
  Heart,
  ChevronRight,
  Calendar,
  CheckCircle2
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";

// Terms sections data
const termsSections = [
  {
    id: "acceptance",
    icon: UserCheck,
    title: "Penerimaan Syarat",
    color: "from-blue-500 to-cyan-600",
    content: [
      {
        subtitle: "Persetujuan Penggunaan",
        items: [
          "Dengan mengakses dan menggunakan ArtConnect, Anda menyetujui untuk terikat dengan syarat dan ketentuan ini",
          "Jika Anda tidak menyetujui syarat ini, mohon untuk tidak menggunakan layanan kami",
          "Kami berhak mengubah syarat ini sewaktu-waktu tanpa pemberitahuan sebelumnya",
          "Penggunaan berkelanjutan setelah perubahan dianggap sebagai persetujuan terhadap syarat yang diperbarui"
        ]
      }
    ]
  },
  {
    id: "service-description",
    icon: BookOpen,
    title: "Deskripsi Layanan",
    color: "from-purple-500 to-violet-600",
    content: [
      {
        subtitle: "Apa itu ArtConnect",
        items: [
          "ArtConnect adalah platform CRM berbasis web untuk seniman visual independen",
          "Layanan ini menyediakan tools untuk mengelola inventaris karya seni",
          "Fitur manajemen kontak dan jejaring profesional",
          "Sistem pipeline Kanban untuk melacak progres karya",
          "Dashboard analitik dan pelaporan"
        ]
      },
      {
        subtitle: "Sifat Layanan",
        items: [
          "Layanan disediakan \"sebagaimana adanya\" tanpa garansi",
          "Merupakan proyek akademik untuk keperluan pembelajaran",
          "Tidak dimaksudkan untuk penggunaan komersial atau produksi",
          "Kami tidak bertanggung jawab atas kehilangan data atau kerusakan"
        ]
      }
    ]
  },
  {
    id: "user-obligations",
    icon: Scale,
    title: "Kewajiban Pengguna",
    color: "from-emerald-500 to-teal-600",
    content: [
      {
        subtitle: "Tanggung Jawab Anda",
        items: [
          "Menggunakan layanan hanya untuk tujuan yang sah dan legal",
          "Tidak mengunggah konten yang melanggar hak cipta atau merek dagang",
          "Tidak mengunggah konten yang bersifat ilegal, ofensif, atau berbahaya",
          "Bertanggung jawab atas keamanan akun dan password Anda",
          "Melakukan backup data secara berkala menggunakan fitur export"
        ]
      },
      {
        subtitle: "Konten yang Dilarang",
        items: [
          "Konten yang melanggar hukum atau hak kekayaan intelektual",
          "Konten yang mengandung virus, malware, atau kode berbahaya",
          "Konten yang bersifat spam atau promosi berlebihan",
          "Konten yang mengandung SARA, pornografi, atau kekerasan"
        ]
      }
    ]
  },
  {
    id: "intellectual-property",
    icon: Shield,
    title: "Hak Kekayaan Intelektual",
    color: "from-amber-500 to-orange-600",
    content: [
      {
        subtitle: "Hak Anda atas Konten",
        items: [
          "Anda tetap memiliki seluruh hak atas karya seni yang Anda unggah",
          "Kami tidak mengklaim kepemilikan atas konten yang Anda buat",
          "Anda bertanggung jawab memastikan Anda memiliki hak atas konten yang diunggah",
          "Anda dapat menghapus konten Anda kapan saja"
        ]
      },
      {
        subtitle: "Hak Kami atas Platform",
        items: [
          "Semua hak kekayaan intelektual platform ArtConnect adalah milik kami",
          "Logo, desain, kode, dan dokumentasi dilindungi hak cipta",
          "Anda tidak diizinkan menyalin, memodifikasi, atau mendistribusikan platform tanpa izin",
          "Penggunaan untuk tujuan pembelajaran diperbolehkan dalam konteks akademik"
        ]
      }
    ]
  },
  {
    id: "data-privacy",
    icon: Shield,
    title: "Data dan Privasi",
    color: "from-rose-500 to-pink-600",
    content: [
      {
        subtitle: "Penyimpanan Data",
        items: [
          "Data disimpan secara lokal di perangkat Anda menggunakan localStorage",
          "Kami tidak menyimpan data Anda di server pusat dalam versi saat ini",
          "Data dapat hilang jika Anda menghapus cache atau data browser",
          "Silakan baca Kebijakan Privasi kami untuk informasi lebih lengkap"
        ]
      }
    ]
  },
  {
    id: "limitations",
    icon: AlertTriangle,
    title: "Batasan Tanggung Jawab",
    color: "from-red-500 to-rose-600",
    content: [
      {
        subtitle: "Penafian",
        items: [
          "Layanan disediakan \"sebagaimana adanya\" tanpa jaminan apapun",
          "Kami tidak bertanggung jawab atas kehilangan data atau kerugian finansial",
          "Kami tidak menjamin layanan akan selalu tersedia atau bebas dari error",
          "Kami tidak bertanggung jawab atas keputusan bisnis yang dibuat berdasarkan data dari platform"
        ]
      },
      {
        subtitle: "Batasan Ganti Rugi",
        items: [
          "Dalam hal apapun, tanggung jawab kami terbatas pada biaya yang Anda bayarkan (jika ada)",
          "Kami tidak bertanggung jawab atas kerusakan tidak langsung atau kerusakan konsekuensial",
          "Batasan ini berlaku sejauh diizinkan oleh hukum yang berlaku"
        ]
      }
    ]
  },
  {
    id: "termination",
    icon: Ban,
    title: "Penghentian Layanan",
    color: "from-gray-500 to-slate-600",
    content: [
      {
        subtitle: "Hak Penghentian",
        items: [
          "Kami berhak menghentikan atau menangguhkan akses Anda kapan saja",
          "Penghentian dapat dilakukan tanpa pemberitahuan sebelumnya",
          "Anda dapat berhenti menggunakan layanan kapan saja",
          "Penghapusan akun akan menghapus semua data yang tersimpan secara permanen"
        ]
      }
    ]
  },
  {
    id: "changes",
    icon: FileText,
    title: "Perubahan Syarat",
    color: "from-indigo-500 to-purple-600",
    content: [
      {
        subtitle: "Pembaruan Syarat",
        items: [
          "Kami berhak mengubah syarat dan ketentuan kapan saja",
          "Perubahan akan efektif segera setelah dipublikasikan",
          "Tanggal pembaruan terakhir akan dicantumkan di halaman ini",
          "Penggunaan berkelanjutan dianggap sebagai persetujuan terhadap perubahan"
        ]
      }
    ]
  },
  {
    id: "governing-law",
    icon: Globe,
    title: "Hukum yang Berlaku",
    color: "from-cyan-500 to-sky-600",
    content: [
      {
        subtitle: "Yurisdiksi",
        items: [
          "Syarat ini diatur oleh hukum Republik Indonesia",
          "Setiap sengketa akan diselesaikan melalui pengadilan Indonesia",
          "Jika ada ketentuan yang tidak sah, ketentuan lain tetap berlaku"
        ]
      }
    ]
  }
];

// Key highlights for quick reference
const keyHighlights = [
  {
    icon: FileText,
    title: "Syarat Jelas",
    description: "Ketentuan yang transparan dan mudah dipahami"
  },
  {
    icon: Shield,
    title: "Perlindungan IP",
    description: "Hak Anda atas karya seni tetap terlindungi"
  },
  {
    icon: UserCheck,
    title: "Fair Use",
    description: "Penggunaan wajar untuk keperluan akademik"
  },
  {
    icon: Scale,
    title: "Kepatuhan Hukum",
    description: "Sesuai dengan regulasi yang berlaku"
  },
];

// Section Card Component
const SectionCard = ({ section, index, isVisible }: {
  section: typeof termsSections[0];
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

const TermsConditionsPage = () => {
  const location = useLocation();
  const [heroVisible, setHeroVisible] = useState(false);
  const [keyPointsVisible, setKeyPointsVisible] = useState(false);
  const [sectionsVisible, setSectionsVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const keyPointsRef = useRef<HTMLElement>(null);
  const sectionsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);

  // Determine back route - if came from register or settings, go back there
  const from = (location.state as { from?: string })?.from;
  const navigate = useNavigate();
  
  const handleBack = () => {
    if (from === 'register') {
      navigate('/auth/register');
    } else if (from === 'settings') {
      navigate('/settings');
    } else {
      navigate('/');
    }
  };

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
    <div className="dark min-h-screen bg-background relative">
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
          <div className="container px-4 sm:px-6">
            <div className="flex items-center justify-between h-14 sm:h-16">
               <Logo size="sm" forceTheme="dark" />
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="gap-2"
                onClick={handleBack}
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section 
          ref={heroRef}
          className="pt-24 sm:pt-32 pb-12 sm:pb-16 relative"
        >
          <div className="container px-4 sm:px-6">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-700
              ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <Scale className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Syarat & Ketentuan</span>
              </div>

              <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4 sm:px-0">
                Syarat & Ketentuan
                <span className="text-gradient"> Penggunaan</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto mb-4 sm:mb-6 px-4 sm:px-0">
                Mohon baca dengan saksama syarat dan ketentuan penggunaan ArtConnect. 
                Dengan menggunakan layanan kami, Anda menyetujui semua ketentuan yang tercantum di bawah ini.
              </p>

              {/* Last Updated */}
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Terakhir diperbarui: 6 Januari 2026</span>
              </div>
            </div>
          </div>
        </section>

        {/* Key Highlights */}
        <section 
          ref={keyPointsRef}
          className="py-8 sm:py-12 relative"
        >
          <div className="container px-4 sm:px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-6xl mx-auto">
              {keyHighlights.map((point, index) => {
                const Icon = point.icon;
                return (
                  <div 
                    key={point.title}
                    className={`p-4 sm:p-5 rounded-xl bg-card/30 border border-border/30 text-center
                      transition-all duration-500
                      ${keyPointsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm sm:text-base text-foreground mb-1">{point.title}</h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">{point.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Table of Contents */}
        <section className="py-6 sm:py-8 relative">
          <div className="container px-4 sm:px-6">
            <div className={`max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl bg-card/30 border border-border/30 transition-all duration-700
              ${keyPointsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="font-display text-base sm:text-lg font-bold mb-3 sm:mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                Daftar Isi
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {termsSections.map((section, index) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-primary/5 transition-colors text-sm text-muted-foreground hover:text-primary group"
                  >
                    <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-xs font-bold text-primary group-hover:bg-primary group-hover:text-background transition-colors flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="truncate">{section.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Terms Sections */}
        <section 
          ref={sectionsRef}
          className="py-8 sm:py-12 relative"
        >
          <div className="container px-4 sm:px-6">
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              {termsSections.map((section, index) => (
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
        <section className="py-8 sm:py-12 relative">
          <div className="container px-4 sm:px-6">
            <div className={`max-w-4xl mx-auto p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/30 transition-all duration-700
              ${sectionsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm sm:text-base text-foreground mb-2">Catatan Penting</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    ArtConnect adalah proyek akademik untuk keperluan pembelajaran Pengembangan Aplikasi Berbasis Web. 
                    Platform ini tidak dimaksudkan untuk penggunaan komersial atau produksi. 
                    Kami tidak memberikan garansi atas ketersediaan layanan atau keamanan data. 
                    Gunakan dengan bijak dan selalu backup data Anda secara berkala.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section 
          ref={contactRef}
          className="py-8 sm:py-12 relative"
        >
          <div className="container px-4 sm:px-6">
            <div className={`max-w-4xl mx-auto p-6 sm:p-8 rounded-3xl bg-card/30 border border-border/30 text-center transition-all duration-700
              ${contactVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary to-amber-600 p-[1px] mx-auto mb-4 sm:mb-6">
                <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                  <Mail className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
                </div>
              </div>

              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
                Ada Pertanyaan?
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 max-w-2xl mx-auto">
                Jika Anda memiliki pertanyaan tentang syarat dan ketentuan ini, 
                jangan ragu untuk menghubungi tim kami.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <a href="mailto:legal@artconnect.id">
                  <Button variant="default" size="lg" className="gap-2 w-full sm:w-auto">
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">legal@artconnect.id</span>
                  </Button>
                </a>
                <Link to="/privacy">
                  <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                    <span className="text-sm sm:text-base">Kebijakan Privasi</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-6 sm:py-8 border-t border-border/30">
          <div className="container px-4 sm:px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
              <p className="text-center sm:text-left">© 2026 ArtConnect. Projek UAS Pengembangan Aplikasi Berbasis Web.</p>
              <div className="flex items-center gap-2">
                <span>Dibuat dengan</span>
                <Heart className="w-3 h-3 sm:w-4 sm:h-4 text-rose-500 fill-rose-500" />
                <span>di Indonesia</span>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default TermsConditionsPage;
