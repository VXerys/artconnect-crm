import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Target, 
  Eye, 
  Heart,
  Code,
  Layers,
  Sparkles,
  GraduationCap,
  BookOpen,
  Users,
  Github,
  Linkedin,
  Mail,
  ChevronRight
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/button";

// Team members data
const teamMembers = [
  {
    name: "Moch. Sechan A.",
    role: "Lead Developer",
    description: "Bertanggung jawab atas arsitektur sistem dan koordinasi tim pengembangan.",
    avatar: "MSA",
    color: "from-amber-500 to-orange-600",
    skills: ["React", "TypeScript", "Node.js"],
    social: { github: "#", linkedin: "#", email: "sechan@artconnect.id" }
  },
  {
    name: "M. Akbar Rizky S.",
    role: "Frontend Developer",
    description: "Fokus pada pengembangan antarmuka pengguna dan pengalaman interaktif.",
    avatar: "MAR",
    color: "from-blue-500 to-cyan-600",
    skills: ["React", "Tailwind CSS", "Figma"],
    social: { github: "#", linkedin: "#", email: "akbar@artconnect.id" }
  },
  {
    name: "M. Fathir Bagas",
    role: "Backend Developer",
    description: "Mengelola logika bisnis, database, dan integrasi API.",
    avatar: "MFB",
    color: "from-emerald-500 to-teal-600",
    skills: ["Node.js", "PostgreSQL", "REST API"],
    social: { github: "#", linkedin: "#", email: "fathir@artconnect.id" }
  },
  {
    name: "M. Ghibran M.",
    role: "UI/UX Designer",
    description: "Merancang tampilan visual dan alur pengalaman pengguna yang intuitif.",
    avatar: "MGM",
    color: "from-purple-500 to-pink-600",
    skills: ["Figma", "Adobe XD", "Prototyping"],
    social: { github: "#", linkedin: "#", email: "ghibran@artconnect.id" }
  },
  {
    name: "M. Sinar Agusta",
    role: "Quality Assurance",
    description: "Memastikan kualitas produk melalui pengujian menyeluruh.",
    avatar: "MSA",
    color: "from-rose-500 to-red-600",
    skills: ["Testing", "Documentation", "Bug Tracking"],
    social: { github: "#", linkedin: "#", email: "sinar@artconnect.id" }
  },
];

// Values/Principles
const values = [
  {
    icon: Target,
    title: "Fokus pada Seniman",
    description: "Setiap fitur dirancang khusus untuk memenuhi kebutuhan unik seniman visual independen.",
    color: "from-amber-500 to-orange-500"
  },
  {
    icon: Heart,
    title: "User-Centric Design",
    description: "Mengutamakan pengalaman pengguna yang intuitif, mudah dipahami, dan menyenangkan.",
    color: "from-rose-500 to-pink-500"
  },
  {
    icon: Code,
    title: "Teknologi Modern",
    description: "Dibangun dengan stack teknologi terkini untuk performa dan keandalan optimal.",
    color: "from-blue-500 to-cyan-500"
  },
  {
    icon: Layers,
    title: "Solusi Terintegrasi",
    description: "Menggabungkan manajemen karya, jejaring, dan analitik dalam satu platform terpadu.",
    color: "from-purple-500 to-violet-500"
  },
];

// Tech stack
const techStack = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Vite", category: "Build Tool" },
  { name: "React Router", category: "Routing" },
  { name: "TanStack Query", category: "Data Fetching" },
  { name: "Shadcn/UI", category: "Components" },
  { name: "Lucide Icons", category: "Icons" },
];

// Team Member Card Component
const TeamMemberCard = ({ member, index, isVisible }: { 
  member: typeof teamMembers[0]; 
  index: number;
  isVisible: boolean;
}) => {
  return (
    <div 
      className={`group relative p-6 rounded-2xl bg-card/30 border border-border/30
        hover:border-primary/30 transition-all duration-500
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Avatar */}
      <div className="flex items-start gap-4 mb-4">
        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.color} p-[2px] flex-shrink-0
          ${index === 0 ? 'ring-2 ring-primary/50 ring-offset-2 ring-offset-background' : ''}`}>
          <div className="w-full h-full rounded-2xl bg-background/90 flex items-center justify-center">
            <span className="text-lg font-bold text-foreground">{member.avatar}</span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={`font-display text-lg font-bold mb-1 
            ${index === 0 ? 'text-primary' : 'text-foreground'}`}>
            {member.name}
            {index === 0 && <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Lead</span>}
          </h3>
          <p className="text-sm text-muted-foreground">{member.role}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {member.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2 mb-4">
        {member.skills.map((skill) => (
          <span 
            key={skill}
            className="px-2 py-1 text-xs rounded-md bg-secondary/50 text-muted-foreground"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Social Links */}
      <div className="flex items-center gap-2 pt-4 border-t border-border/30">
        <a 
          href={member.social.github}
          className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center
            hover:bg-primary/20 transition-colors group/icon"
          aria-label="GitHub"
        >
          <Github className="w-4 h-4 text-muted-foreground group-hover/icon:text-primary transition-colors" />
        </a>
        <a 
          href={member.social.linkedin}
          className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center
            hover:bg-primary/20 transition-colors group/icon"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-4 h-4 text-muted-foreground group-hover/icon:text-primary transition-colors" />
        </a>
        <a 
          href={`mailto:${member.social.email}`}
          className="w-8 h-8 rounded-lg bg-secondary/50 flex items-center justify-center
            hover:bg-primary/20 transition-colors group/icon"
          aria-label="Email"
        >
          <Mail className="w-4 h-4 text-muted-foreground group-hover/icon:text-primary transition-colors" />
        </a>
      </div>
    </div>
  );
};

const AboutPage = () => {
  const [heroVisible, setHeroVisible] = useState(false);
  const [missionVisible, setMissionVisible] = useState(false);
  const [teamVisible, setTeamVisible] = useState(false);
  const [valuesVisible, setValuesVisible] = useState(false);
  const [techVisible, setTechVisible] = useState(false);
  const [projectVisible, setProjectVisible] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const missionRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const techRef = useRef<HTMLElement>(null);
  const projectRef = useRef<HTMLElement>(null);

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
      { ref: missionRef, setter: setMissionVisible },
      { ref: teamRef, setter: setTeamVisible },
      { ref: valuesRef, setter: setValuesVisible },
      { ref: techRef, setter: setTechVisible },
      { ref: projectRef, setter: setProjectVisible },
    ];

    observers.forEach(({ ref, setter }) => {
      const observer = createObserver(setter);
      if (ref.current) observer.observe(ref.current);
    });

    // Set hero visible immediately
    setHeroVisible(true);

    return () => observers.forEach(({ ref }) => {
      if (ref.current) {
        // Cleanup would go here if needed
      }
    });
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
              <Logo size="sm" />
              
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
          className="pt-32 pb-20 relative"
        >
          <div className="container px-4">
            <div className={`max-w-4xl mx-auto text-center transition-all duration-700
              ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                <span>Tentang ArtConnect</span>
              </div>

              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Memberdayakan
                <span className="text-gradient"> Seniman Visual</span>
                <br />Indonesia
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                ArtConnect adalah platform CRM inovatif yang dirancang khusus untuk membantu 
                seniman visual independen mengelola karya, membangun jejaring profesional, 
                dan mengembangkan karier seni mereka secara efektif.
              </p>
            </div>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section 
          ref={missionRef}
          className="py-20 relative"
        >
          <div className="container px-4">
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {/* Mission */}
              <div className={`p-8 rounded-3xl bg-card/30 border border-border/30 transition-all duration-700
                ${missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-[1px] mb-6">
                  <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                    <Target className="w-7 h-7 text-primary" />
                  </div>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Misi Kami</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Menyediakan solusi digital terintegrasi yang memudahkan seniman visual dalam 
                  mendokumentasikan karya, mengelola relasi bisnis, dan menganalisis perkembangan 
                  karier mereka. Kami berkomitmen untuk menjadi partner teknologi terpercaya 
                  bagi komunitas seni Indonesia.
                </p>
              </div>

              {/* Vision */}
              <div className={`p-8 rounded-3xl bg-card/30 border border-border/30 transition-all duration-700 delay-200
                ${missionVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-[1px] mb-6">
                  <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                    <Eye className="w-7 h-7 text-purple-400" />
                  </div>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">Visi Kami</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Menjadi platform manajemen seni terdepan di Indonesia yang menghubungkan 
                  seniman dengan peluang, kolektor, dan galeri. Kami membayangkan ekosistem 
                  seni yang lebih terorganisir, profesional, dan berkelanjutan untuk 
                  generasi seniman masa depan.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section 
          ref={valuesRef}
          className="py-20 relative"
        >
          <div className="container px-4">
            <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700
              ${valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Nilai-Nilai <span className="text-gradient">Kami</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Prinsip-prinsip yang memandu setiap keputusan dan fitur yang kami bangun.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {values.map((value, index) => {
                const Icon = value.icon;
                return (
                  <div 
                    key={value.title}
                    className={`text-center p-6 rounded-2xl bg-card/30 border border-border/30
                      hover:border-primary/30 transition-all duration-500
                      ${valuesVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${value.color} p-[1px] mx-auto mb-4`}>
                      <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                        <Icon className="w-7 h-7 text-foreground" />
                      </div>
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section 
          ref={teamRef}
          className="py-20 relative"
        >
          <div className="container px-4">
            <div className={`text-center max-w-3xl mx-auto mb-16 transition-all duration-700
              ${teamVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
                <Users className="w-4 h-4" />
                <span>Tim Pengembang</span>
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Kenali <span className="text-gradient">Tim Kami</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Lima mahasiswa dengan passion yang sama: menciptakan solusi digital untuk komunitas seni Indonesia.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {teamMembers.map((member, index) => (
                <TeamMemberCard 
                  key={member.name} 
                  member={member} 
                  index={index}
                  isVisible={teamVisible}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section 
          ref={techRef}
          className="py-20 relative"
        >
          <div className="container px-4">
            <div className={`text-center max-w-3xl mx-auto mb-12 transition-all duration-700
              ${techVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                Teknologi yang <span className="text-gradient">Kami Gunakan</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Dibangun dengan teknologi web modern untuk performa dan pengalaman pengguna terbaik.
              </p>
            </div>

            <div className={`flex flex-wrap justify-center gap-3 max-w-4xl mx-auto transition-all duration-700 delay-200
              ${techVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              {techStack.map((tech, index) => (
                <div 
                  key={tech.name}
                  className="px-4 py-2 rounded-full bg-card/30 border border-border/30 
                    hover:border-primary/30 transition-colors"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <span className="text-sm font-medium text-foreground">{tech.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({tech.category})</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Project Info Section */}
        <section 
          ref={projectRef}
          className="py-20 relative"
        >
          <div className="container px-4">
            <div className={`max-w-4xl mx-auto transition-all duration-700
              ${projectVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              
              <div className="p-8 md:p-12 rounded-3xl bg-card/30 border border-border/30 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-amber-600 p-[1px] mx-auto mb-6">
                  <div className="w-full h-full rounded-2xl bg-background flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                </div>

                <h2 className="font-display text-2xl md:text-3xl font-bold mb-4">
                  Projek Akademik
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span>Pengembangan Aplikasi Berbasis Web</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    <span>Ujian Akhir Semester (UAS)</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                  ArtConnect dikembangkan sebagai projek UAS untuk mata kuliah Pengembangan 
                  Aplikasi Berbasis Web. Projek ini mendemonstrasikan penerapan teknologi 
                  web modern dalam membangun aplikasi CRM yang fungsional dan user-friendly.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link to="/dashboard">
                    <Button variant="default" size="lg" className="gap-2">
                      Jelajahi Platform
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline" size="lg" className="gap-2">
                      <ArrowLeft className="w-4 h-4" />
                      Kembali ke Beranda
                    </Button>
                  </Link>
                </div>
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

export default AboutPage;
