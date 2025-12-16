const stats = [
  { value: "60%", label: "Peningkatan Efisiensi", description: "Otomatisasi pencatatan" },
  { value: "100+", label: "Fitur Lengkap", description: "Untuk manajemen karya" },
  { value: "24/7", label: "Akses Cloud", description: "Kapan saja, di mana saja" },
  { value: "99.9%", label: "Uptime", description: "Keandalan sistem" },
];

const Stats = () => {
  return (
    <section className="py-20 bg-secondary/30 border-y border-border">
      <div className="container px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={stat.label} 
              className="text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="font-display text-4xl md:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="font-semibold text-foreground mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
