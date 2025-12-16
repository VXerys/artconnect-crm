import { 
  Palette, 
  Users, 
  Kanban, 
  BarChart3, 
  FileText, 
  Shield,
  ArrowUpRight
} from "lucide-react";

const features = [
  {
    icon: Palette,
    title: "Inventaris Karya Seni",
    description: "Dokumentasi visual lengkap dengan metadata, kategorisasi fleksibel, dan pelacakan status karya dari konsep hingga terjual.",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    icon: Users,
    title: "Manajemen Jejaring",
    description: "Kelola database kontak kolektor, galeri, dan kurator. Lacak hubungan bisnis dan riwayat interaksi secara terstruktur.",
    color: "text-blue-400",
    bg: "bg-blue-500/10",
  },
  {
    icon: Kanban,
    title: "Pipeline Kanban",
    description: "Visualisasi siklus hidup karya seni menggunakan metodologi Kanban. Lacak progres dari ide hingga penjualan.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analitik",
    description: "Insight data-driven untuk pengembangan karier. Pantau performa bisnis dan aktivitas networking dalam satu tampilan.",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: FileText,
    title: "Pelaporan & Export",
    description: "Generate laporan visual tentang inventaris, penjualan, dan aktivitas. Export ke CSV dan PDF kapan saja.",
    color: "text-rose-400",
    bg: "bg-rose-500/10",
  },
  {
    icon: Shield,
    title: "Keamanan Data",
    description: "Autentikasi aman dengan perlindungan data tingkat enterprise. Workspace pribadi untuk setiap seniman.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
  },
];

const Features = () => {
  return (
    <section className="py-24 bg-background relative">
      {/* Background accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="container px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Semua yang Anda Butuhkan
          </h2>
          <p className="text-lg text-muted-foreground">
            ArtConnect mengintegrasikan manajemen inventaris, jejaring profesional, 
            dan analisis bisnis dalam satu platform yang intuitif.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}>
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
              </div>

              {/* Content */}
              <h3 className="font-display text-xl font-semibold mb-2 flex items-center gap-2">
                {feature.title}
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover glow */}
              <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
