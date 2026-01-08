import { TrendingUp, Layers, Clock, Server, Quote } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";

const stats = [
  { 
    value: 60, 
    suffix: "%",
    label: "Peningkatan Efisiensi", 
    description: "Otomatisasi pencatatan & manajemen",
    icon: TrendingUp,
    color: "from-emerald-500 to-teal-500"
  },
  { 
    value: 100, 
    suffix: "+",
    label: "Fitur Lengkap", 
    description: "Untuk manajemen karya seni",
    icon: Layers,
    color: "from-blue-500 to-indigo-500"
  },
  { 
    value: 24, 
    suffix: "/7",
    label: "Akses Cloud", 
    description: "Kapan saja, di mana saja",
    icon: Clock,
    color: "from-amber-500 to-orange-500"
  },
  { 
    value: 99.9, 
    suffix: "%",
    label: "Uptime", 
    description: "Keandalan sistem terjamin",
    icon: Server,
    color: "from-purple-500 to-pink-500"
  },
];

const testimonials = [
  {
    quote: "ArtConnect telah mengubah cara saya mengelola galeri virtual saya. Sangat intuitif dan powerful!",
    author: "Rina Kusuma",
    role: "Pelukis Kontemporer",
    avatar: "RK"
  },
  {
    quote: "Akhirnya ada platform yang benar-benar memahami kebutuhan seniman independen seperti saya.",
    author: "Budi Santoso",
    role: "Seniman Digital",
    avatar: "BS"
  },
  {
    quote: "Dashboard analitiknya sangat membantu untuk tracking penjualan dan mengembangkan bisnis seni saya.",
    author: "Maya Dewi",
    role: "Ilustrator Freelance",
    avatar: "MD"
  }
];

// Stat Card Component
const StatCard = ({ stat, index, displayValue, isVisible }: { 
  stat: typeof stats[0]; 
  index: number;
  displayValue: number;
  isVisible: boolean;
}) => {
  const Icon = stat.icon;
  
  return (
    <div 
      className={`group relative p-6 md:p-8 rounded-2xl glass-card 
        hover:border-primary/40 hover:bg-card/80 transition-all duration-500 hover:-translate-y-1 hover:shadow-glow
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Icon */}
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-[1px] mb-4`}>
        <div className="w-full h-full rounded-xl bg-background flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
      </div>

      {/* Value */}
      <div className="font-display text-4xl md:text-5xl font-bold mb-2">
        <span className="text-foreground">
          {stat.value === 99.9 ? displayValue.toFixed(1) : Math.floor(displayValue)}
        </span>
        <span className="text-primary">{stat.suffix}</span>
      </div>

      {/* Label */}
      <div className="font-semibold text-foreground mb-1">{stat.label}</div>
      <div className="text-sm text-muted-foreground">{stat.description}</div>
    </div>
  );
};

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          setIsVisible(true);
          hasAnimated.current = true;
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

  // Counter animation
  useEffect(() => {
    if (!isVisible) return;
    
    const duration = 1500;
    const startTime = performance.now();
    const targetValues = stats.map(s => s.value);
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      const newCounts = targetValues.map(target => 
        Math.round(easeOutQuart * target * 10) / 10
      );
      
      setCounts(newCounts);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isVisible]);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = useMemo(
    () => testimonials[activeTestimonial], 
    [activeTestimonial]
  );

  return (
    <section 
      ref={sectionRef}
      id="stats" 
      className="py-28 relative"
    >
      <div className="container px-4 relative z-10">
        {/* Section Header */}
        <div className={`text-center max-w-4xl mx-auto mb-16 px-4 transition-all duration-700
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Mengapa Seniman <span className="text-gradient">Memilih Kami?</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Solusi manajemen paling intuitif untuk mendukung ekosistem kreatif Anda.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-20">
          {stats.map((stat, index) => (
            <StatCard 
              key={stat.label} 
              stat={stat} 
              index={index}
              displayValue={counts[index]}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Testimonials Section */}
        <div className={`max-w-4xl mx-auto transition-all duration-700 delay-500
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="relative p-8 md:p-12 rounded-3xl glass-card">
            {/* Quote Icon */}
            <div className="absolute -top-6 left-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Quote className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="text-center pt-4">
              <p className="text-xl md:text-2xl text-foreground font-medium italic mb-8 leading-relaxed transition-opacity duration-300">
                "{currentTestimonial.quote}"
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-bold">
                  {currentTestimonial.avatar}
                </div>
                
                <div className="text-left">
                  <div className="font-semibold text-foreground">
                    {currentTestimonial.author}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentTestimonial.role}
                  </div>
                </div>
              </div>

              {/* Pagination Dots */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveTestimonial(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === activeTestimonial 
                        ? 'w-8 bg-primary' 
                        : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
