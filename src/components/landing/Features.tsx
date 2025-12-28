import { 
  Palette, 
  Users, 
  Kanban, 
  BarChart3, 
  FileText, 
  Shield,
  Sparkles,
  Check
} from "lucide-react";
import { memo, useEffect, useRef, useState } from "react";

const features = [
  {
    icon: Palette,
    title: "Inventaris Karya Seni",
    description: "Dokumentasi visual lengkap dengan metadata, kategorisasi fleksibel, dan pelacakan status karya dari konsep hingga terjual.",
    color: "from-purple-500 to-violet-600",
    highlights: ["Galeri Visual", "Metadata Lengkap", "Status Tracking"],
  },
  {
    icon: Users,
    title: "Manajemen Jejaring",
    description: "Kelola database kontak kolektor, galeri, dan kurator. Lacak hubungan bisnis dan riwayat interaksi secara terstruktur.",
    color: "from-blue-500 to-cyan-600",
    highlights: ["Kontak Terstruktur", "Riwayat Interaksi", "Segmentasi"],
  },
  {
    icon: Kanban,
    title: "Pipeline Kanban",
    description: "Visualisasi siklus hidup karya seni menggunakan metodologi Kanban. Lacak progres dari ide hingga penjualan.",
    color: "from-emerald-500 to-teal-600",
    highlights: ["Drag & Drop", "Visual Pipeline", "Progress Tracking"],
  },
  {
    icon: BarChart3,
    title: "Dashboard Analitik",
    description: "Insight data-driven untuk pengembangan karier. Pantau performa bisnis dan aktivitas networking dalam satu tampilan.",
    color: "from-amber-500 to-orange-600",
    highlights: ["Real-time Data", "Visual Charts", "Export Report"],
  },
  {
    icon: FileText,
    title: "Pelaporan & Export",
    description: "Generate laporan visual tentang inventaris, penjualan, dan aktivitas. Export ke CSV dan PDF kapan saja.",
    color: "from-rose-500 to-pink-600",
    highlights: ["PDF Export", "CSV Download", "Laporan Custom"],
  },
  {
    icon: Shield,
    title: "Keamanan Data",
    description: "Autentikasi aman dengan perlindungan data tingkat enterprise. Workspace pribadi untuk setiap seniman.",
    color: "from-cyan-500 to-sky-600",
    highlights: ["Enkripsi Data", "Backup Otomatis", "Private Workspace"],
  },
];

// Memoized Feature Card
const FeatureCard = memo(({ feature, index, isVisible }: { 
  feature: typeof features[0]; 
  index: number;
  isVisible: boolean;
}) => {
  const Icon = feature.icon;
  
  return (
    <div
      className={`group relative h-full p-8 rounded-3xl bg-card/30 border border-border/30 
        hover:border-primary/30 transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Icon Container */}
      <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} p-[1px] mb-6`}>
        <div className="w-full h-full rounded-2xl bg-background/90 flex items-center justify-center">
          <Icon className="w-7 h-7 text-foreground" />
        </div>
      </div>

      {/* Content */}
      <h3 className="font-display text-xl font-bold mb-3 text-foreground group-hover:text-primary transition-colors">
        {feature.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-6">
        {feature.description}
      </p>

      {/* Feature Highlights */}
      <div className="flex flex-wrap gap-2">
        {feature.highlights.map((highlight) => (
          <span 
            key={highlight}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/50 text-xs font-medium text-muted-foreground"
          >
            <Check className="w-3 h-3 text-primary" />
            {highlight}
          </span>
        ))}
      </div>
    </div>
  );
});

FeatureCard.displayName = 'FeatureCard';

const Features = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className="py-28 relative"
    >      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-20 transition-all duration-700
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            <span>Fitur Unggulan</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Semua yang Anda
            <span className="text-gradient"> Butuhkan</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            ArtConnect mengintegrasikan manajemen inventaris, jejaring profesional, 
            dan analisis bisnis dalam satu platform yang intuitif dan powerful.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              feature={feature} 
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
