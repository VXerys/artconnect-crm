import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Palette, Users, FileText, BarChart3, X, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SearchResult {
  id: string;
  type: 'artwork' | 'contact' | 'report';
  title: string;
  subtitle?: string;
  href: string;
}

// Mock search function - in production, this would call Supabase
const performSearch = async (query: string): Promise<SearchResult[]> => {
  if (!query.trim()) return [];
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const lowerQuery = query.toLowerCase();
  
  // Mock data - replace with actual Supabase queries
  const mockData: SearchResult[] = [
    // Artworks
    { id: '1', type: 'artwork', title: 'Sunset Over Rice Fields', subtitle: 'Oil on Canvas • Rp 15.000.000', href: '/artworks?id=1' },
    { id: '2', type: 'artwork', title: 'Abstract Harmony', subtitle: 'Acrylic on Canvas • Rp 8.500.000', href: '/artworks?id=2' },
    { id: '3', type: 'artwork', title: 'Portrait of Silence', subtitle: 'Watercolor • Rp 5.000.000', href: '/artworks?id=3' },
    { id: '4', type: 'artwork', title: 'Urban Dreams', subtitle: 'Mixed Media • Rp 12.000.000', href: '/artworks?id=4' },
    // Contacts
    { id: '5', type: 'contact', title: 'Galeri Nasional Indonesia', subtitle: 'Galeri • Jakarta', href: '/contacts?id=5' },
    { id: '6', type: 'contact', title: 'Budi Santoso', subtitle: 'Kolektor • Surabaya', href: '/contacts?id=6' },
    { id: '7', type: 'contact', title: 'Maya Art Gallery', subtitle: 'Galeri • Bandung', href: '/contacts?id=7' },
    { id: '8', type: 'contact', title: 'Rina Kusuma', subtitle: 'Kurator • Yogyakarta', href: '/contacts?id=8' },
    // Reports
    { id: '9', type: 'report', title: 'Laporan Penjualan Q4 2024', subtitle: 'Dibuat 15 Des 2024', href: '/reports?id=9' },
    { id: '10', type: 'report', title: 'Inventaris Karya Seni', subtitle: 'Dibuat 10 Des 2024', href: '/reports?id=10' },
  ];
  
  // Filter by query
  return mockData.filter(item => 
    item.title.toLowerCase().includes(lowerQuery) ||
    item.subtitle?.toLowerCase().includes(lowerQuery)
  ).slice(0, 6);
};

const getTypeIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'artwork': return Palette;
    case 'contact': return Users;
    case 'report': return FileText;
    default: return BarChart3;
  }
};

const getTypeLabel = (type: SearchResult['type']) => {
  switch (type) {
    case 'artwork': return 'Karya Seni';
    case 'contact': return 'Kontak';
    case 'report': return 'Laporan';
    default: return 'Lainnya';
  }
};

const getTypeColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'artwork': return 'text-purple-400 bg-purple-500/20';
    case 'contact': return 'text-blue-400 bg-blue-500/20';
    case 'report': return 'text-emerald-400 bg-emerald-500/20';
    default: return 'text-primary bg-primary/20';
  }
};

interface GlobalSearchProps {
  className?: string;
}

const GlobalSearch = ({ className }: GlobalSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        const searchResults = await performSearch(query);
        setResults(searchResults);
        setIsLoading(false);
        setSelectedIndex(-1);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : results.length - 1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  }, [isOpen, results, selectedIndex]);

  const handleSelect = (result: SearchResult) => {
    navigate(result.href);
    setQuery("");
    setIsOpen(false);
    setResults([]);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Cari karya, kontak, laporan..."
          className="w-full h-8 md:h-9 pl-8 md:pl-9 pr-8 bg-secondary border border-border rounded-lg text-xs md:text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
        />
        {query && !isLoading && (
          <button
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
        {isLoading && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 animate-spin text-muted-foreground" />
        )}
      </div>

      {/* Results Dropdown */}
      {isOpen && (query.trim() || results.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto">
          {isLoading && results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground text-sm">
              <Loader2 className="w-5 h-5 animate-spin mx-auto mb-2" />
              Mencari...
            </div>
          ) : results.length > 0 ? (
            <div className="py-2">
              {results.map((result, index) => {
                const Icon = getTypeIcon(result.type);
                const isSelected = index === selectedIndex;
                
                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full px-3 py-2.5 flex items-center gap-3 text-left transition-colors",
                      isSelected ? "bg-primary/10" : "hover:bg-muted/50"
                    )}
                  >
                    <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0", getTypeColor(result.type))}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-foreground truncate">
                        {result.title}
                      </div>
                      {result.subtitle && (
                        <div className="text-xs text-muted-foreground truncate">
                          {result.subtitle}
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground bg-muted px-2 py-0.5 rounded-full flex-shrink-0">
                      {getTypeLabel(result.type)}
                    </span>
                    {isSelected && (
                      <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          ) : query.trim() ? (
            <div className="p-6 text-center">
              <Search className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Tidak ada hasil untuk "<span className="font-medium text-foreground">{query}</span>"
              </p>
              <p className="text-xs text-muted-foreground/70 mt-1">
                Coba kata kunci lain atau periksa ejaan
              </p>
            </div>
          ) : null}
          
          {/* Keyboard hints */}
          {results.length > 0 && (
            <div className="border-t border-border px-3 py-2 flex items-center justify-between text-[10px] text-muted-foreground bg-muted/30">
              <div className="flex items-center gap-3">
                <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">↑↓</kbd> Navigasi</span>
                <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> Pilih</span>
                <span><kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">Esc</kbd> Tutup</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
