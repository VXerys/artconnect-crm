import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Search,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  Palette,
  Star
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const contacts = [
  {
    id: 1,
    name: "Galeri Nasional Indonesia",
    type: "gallery",
    email: "info@galnas.go.id",
    phone: "+62 21 1234 5678",
    location: "Jakarta",
    rating: 5,
    lastContact: "2 hari lalu",
    notes: "Tertarik dengan seri landscape"
  },
  {
    id: 2,
    name: "Ahmad Wijaya",
    type: "collector",
    email: "ahmad.w@email.com",
    phone: "+62 812 3456 7890",
    location: "Surabaya",
    rating: 4,
    lastContact: "1 minggu lalu",
    notes: "Koleksi fokus pada contemporary art"
  },
  {
    id: 3,
    name: "Museum Seni Rupa dan Keramik",
    type: "museum",
    email: "contact@museumsenirupa.id",
    phone: "+62 21 9876 5432",
    location: "Jakarta",
    rating: 5,
    lastContact: "3 hari lalu",
    notes: "Diskusi untuk pameran kolaborasi"
  },
  {
    id: 4,
    name: "Sarah Chen",
    type: "curator",
    email: "sarah.chen@artworld.com",
    phone: "+65 9123 4567",
    location: "Singapore",
    rating: 4,
    lastContact: "2 minggu lalu",
    notes: "Kurator untuk Singapore Art Week"
  },
  {
    id: 5,
    name: "Budi Santoso",
    type: "collector",
    email: "budi.s@company.com",
    phone: "+62 811 2233 4455",
    location: "Bandung",
    rating: 3,
    lastContact: "1 bulan lalu",
    notes: "Pemula dalam koleksi seni"
  },
  {
    id: 6,
    name: "Art Space Gallery",
    type: "gallery",
    email: "hello@artspace.id",
    phone: "+62 22 7654 3210",
    location: "Yogyakarta",
    rating: 4,
    lastContact: "5 hari lalu",
    notes: "Gallery fokus pada emerging artists"
  },
];

const typeConfig = {
  gallery: { label: "Galeri", icon: Building2, color: "text-purple-400", bg: "bg-purple-500/10" },
  collector: { label: "Kolektor", icon: User, color: "text-blue-400", bg: "bg-blue-500/10" },
  museum: { label: "Museum", icon: Palette, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  curator: { label: "Kurator", icon: Star, color: "text-primary", bg: "bg-primary/10" },
};

const Contacts = () => {
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredContacts = contacts.filter(contact => {
    const matchesFilter = filter === 'all' || contact.type === filter;
    const matchesSearch = contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const contactsByType = {
    all: contacts.length,
    gallery: contacts.filter(c => c.type === 'gallery').length,
    collector: contacts.filter(c => c.type === 'collector').length,
    museum: contacts.filter(c => c.type === 'museum').length,
    curator: contacts.filter(c => c.type === 'curator').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Kontak</h1>
            <p className="text-muted-foreground">Kelola jejaring profesional Anda</p>
          </div>
          <Button variant="default" className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Kontak
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card 
            className={cn(
              "bg-card border-border cursor-pointer transition-all",
              filter === 'all' && "border-primary/50 bg-primary/5"
            )}
            onClick={() => setFilter('all')}
          >
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{contactsByType.all}</div>
              <div className="text-sm text-muted-foreground">Semua</div>
            </CardContent>
          </Card>
          {Object.entries(typeConfig).map(([key, config]) => (
            <Card 
              key={key}
              className={cn(
                "bg-card border-border cursor-pointer transition-all",
                filter === key && "border-primary/50 bg-primary/5"
              )}
              onClick={() => setFilter(key)}
            >
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold">{contactsByType[key as keyof typeof contactsByType]}</div>
                <div className="text-sm text-muted-foreground">{config.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari kontak..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 bg-secondary border border-border rounded-lg text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
          />
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => {
            const config = typeConfig[contact.type as keyof typeof typeConfig];
            return (
              <Card key={contact.id} className="bg-card border-border hover:border-primary/30 transition-all">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", config.bg)}>
                        <config.icon className={cn("w-6 h-6", config.color)} />
                      </div>
                      <div>
                        <CardTitle className="text-base">{contact.name}</CardTitle>
                        <span className={cn("text-xs font-medium", config.color)}>{config.label}</span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem>Catat Aktivitas</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>{contact.location}</span>
                    </div>
                  </div>
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={cn(
                              "w-3 h-3",
                              i < contact.rating ? "text-primary fill-primary" : "text-muted-foreground"
                            )} 
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">{contact.lastContact}</span>
                    </div>
                    {contact.notes && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{contact.notes}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Contacts;
