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
import { Container, Section, ResponsiveGrid } from "@/components/ui/responsive";

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
      className={`group relative h-full p-5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl glass-card
        hover:border-primary/40 hover:bg-card/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Icon Container */}
      <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-gradient-to-br ${feature.color} p-[1px] mb-4 sm:mb-6`}>
        <div className="w-full h-full rounded-xl sm:rounded-2xl bg-background/90 flex items-center justify-center">
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-foreground" />
        </div>
      </div>

      {/* Content */}
      <h3 className="font-display text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-foreground group-hover:text-primary transition-colors">
        {feature.title}
      </h3>
      <p className="text-muted-foreground text-sm leading-relaxed mb-4 sm:mb-6">
        {feature.description}
      </p>

      {/* Feature Highlights */}
      <div className="flex flex-wrap gap-2">
        {feature.highlights.map((highlight) => (
          <span 
            key={highlight}
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-secondary/50 text-xs font-medium text-muted-foreground"
          >
            <Check className="w-3 h-3 text-primary flex-shrink-0" />
            <span className="whitespace-nowrap">{highlight}</span>
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
    <Section 
      ref={sectionRef}
      id="features" 
      spacing="lg"
      className="relative"
    >      
      {/* Subtle Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
          backgroundSize: '40px 40px',
        }}
      />
      
      <Container className="relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-3xl mx-auto mb-12 sm:mb-16 md:mb-20 transition-all duration-700
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span>Fitur Unggulan</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 px-4 sm:px-0">
            Semua yang Anda
            <span className="text-gradient"> Butuhkan</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed px-4 sm:px-0">
            ArtConnect mengintegrasikan manajemen inventaris, jejaring profesional, 
            dan analisis bisnis dalam satu platform yang intuitif dan powerful.
          </p>
        </div>

        {/* Features Grid */}
        <ResponsiveGrid 
          cols={{ base: 1, sm: 2, lg: 3 }}
          gap="md"
        >
          {features.map((feature, index) => (
            <FeatureCard 
              key={feature.title} 
              feature={feature} 
              index={index}
              isVisible={isVisible}
            />
          ))}
        </ResponsiveGrid>
      </Container>
    </Section>
  );
};

export default Features;
