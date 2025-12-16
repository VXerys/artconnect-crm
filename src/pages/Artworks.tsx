import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Grid3X3, 
  List, 
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const artworks = [
  { 
    id: 1, 
    title: "Sunset Horizon", 
    medium: "Acrylic on Canvas",
    dimensions: "100 x 80 cm",
    status: "finished", 
    price: 15000000,
    year: 2024,
    image: "https://images.unsplash.com/photo-1549289524-06cf8837ace5?w=400"
  },
  { 
    id: 2, 
    title: "Urban Dreams", 
    medium: "Oil on Canvas",
    dimensions: "120 x 90 cm",
    status: "wip", 
    price: null,
    year: 2024,
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400"
  },
  { 
    id: 3, 
    title: "Abstract Motion", 
    medium: "Mixed Media",
    dimensions: "150 x 100 cm",
    status: "sold", 
    price: 25000000,
    year: 2024,
    image: "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=400"
  },
  { 
    id: 4, 
    title: "Nature's Call", 
    medium: "Watercolor",
    dimensions: "60 x 40 cm",
    status: "concept", 
    price: null,
    year: 2024,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=400"
  },
  { 
    id: 5, 
    title: "Digital Echoes", 
    medium: "Digital Print",
    dimensions: "80 x 60 cm",
    status: "finished", 
    price: 8000000,
    year: 2024,
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400"
  },
  { 
    id: 6, 
    title: "Cosmic Dance", 
    medium: "Acrylic on Canvas",
    dimensions: "200 x 150 cm",
    status: "wip", 
    price: null,
    year: 2024,
    image: "https://images.unsplash.com/photo-1634017839464-5c339ez92a6?w=400"
  },
];

const statusConfig = {
  concept: { label: "Konsep", class: "status-concept" },
  wip: { label: "Proses", class: "status-wip" },
  finished: { label: "Selesai", class: "status-finished" },
  sold: { label: "Terjual", class: "status-sold" },
};

const formatCurrency = (value: number | null) => {
  if (!value) return "-";
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value);
};

const Artworks = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filter, setFilter] = useState<string>('all');

  const filteredArtworks = filter === 'all' 
    ? artworks 
    : artworks.filter(a => a.status === filter);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Karya Seni</h1>
            <p className="text-muted-foreground">Kelola inventaris karya seni Anda</p>
          </div>
          <Button variant="default" className="gap-2">
            <Plus className="w-4 h-4" />
            Tambah Karya
          </Button>
        </div>

        {/* Filters & View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Button 
              variant={filter === 'all' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setFilter('all')}
            >
              Semua
            </Button>
            {Object.entries(statusConfig).map(([key, value]) => (
              <Button 
                key={key}
                variant={filter === key ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter(key)}
              >
                {value.label}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </Button>
            <div className="flex items-center bg-secondary rounded-lg p-1">
              <button
                onClick={() => setView('grid')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  view === 'grid' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn(
                  "p-2 rounded-md transition-colors",
                  view === 'list' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Artworks Grid/List */}
        {view === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArtworks.map((artwork) => (
              <Card key={artwork.id} className="group bg-card border-border overflow-hidden hover:border-primary/30 transition-all duration-300">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <img 
                    src={artwork.image} 
                    alt={artwork.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium border ${statusConfig[artwork.status as keyof typeof statusConfig].class}`}>
                      {statusConfig[artwork.status as keyof typeof statusConfig].label}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="secondary" size="sm" className="gap-1">
                      <Eye className="w-3 h-3" /> Lihat
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Hapus</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-display font-semibold text-lg mb-1">{artwork.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{artwork.medium}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{artwork.dimensions}</span>
                    <span className="font-medium text-primary">{formatCurrency(artwork.price)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-card border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-secondary/50">
                    <th className="text-left p-4 font-medium text-sm">Karya</th>
                    <th className="text-left p-4 font-medium text-sm hidden md:table-cell">Medium</th>
                    <th className="text-left p-4 font-medium text-sm hidden lg:table-cell">Dimensi</th>
                    <th className="text-left p-4 font-medium text-sm">Status</th>
                    <th className="text-right p-4 font-medium text-sm">Harga</th>
                    <th className="text-right p-4 font-medium text-sm">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredArtworks.map((artwork) => (
                    <tr key={artwork.id} className="border-b border-border hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={artwork.image} 
                            alt={artwork.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <div className="font-medium">{artwork.title}</div>
                            <div className="text-sm text-muted-foreground md:hidden">{artwork.medium}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{artwork.medium}</td>
                      <td className="p-4 text-muted-foreground hidden lg:table-cell">{artwork.dimensions}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium border ${statusConfig[artwork.status as keyof typeof statusConfig].class}`}>
                          {statusConfig[artwork.status as keyof typeof statusConfig].label}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium">{formatCurrency(artwork.price)}</td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem><Eye className="w-4 h-4 mr-2" /> Lihat</DropdownMenuItem>
                            <DropdownMenuItem><Edit className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive"><Trash2 className="w-4 h-4 mr-2" /> Hapus</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Artworks;
