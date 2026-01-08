import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Palette, Users, FileText, X, Loader2, ArrowRight, Kanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { supabase, Artwork, Contact, PipelineItem, Report } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";

interface SearchResult {
  id: string;
  type: 'artwork' | 'contact' | 'report' | 'pipeline';
  title: string;
  subtitle?: string;
  href: string;
}

const formatCurrency = (amount: number | null): string => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'concept': return 'Konsep';
    case 'wip': return 'Proses';
    case 'finished': return 'Selesai';
    case 'sold': return 'Terjual';
    default: return status;
  }
};

const getContactTypeLabel = (type: string): string => {
  switch (type) {
    case 'gallery': return 'Galeri';
    case 'collector': return 'Kolektor';
    case 'museum': return 'Museum';
    case 'curator': return 'Kurator';
    default: return type;
  }
};

const getTypeIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'artwork': return Palette;
    case 'contact': return Users;
    case 'report': return FileText;
    case 'pipeline': return Kanban;
    default: return Palette;
  }
};

const getTypeLabel = (type: SearchResult['type']) => {
  switch (type) {
    case 'artwork': return 'Karya Seni';
    case 'contact': return 'Kontak';
    case 'report': return 'Laporan';
    case 'pipeline': return 'Pipeline';
    default: return 'Lainnya';
  }
};

const getTypeColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'artwork': return 'text-purple-400 bg-purple-500/20';
    case 'contact': return 'text-blue-400 bg-blue-500/20';
    case 'report': return 'text-emerald-400 bg-emerald-500/20';
    case 'pipeline': return 'text-orange-400 bg-orange-500/20';
    default: return 'text-primary bg-primary/20';
  }
};

interface GlobalSearchProps {
  className?: string;
  onResultSelect?: () => void;
}

const GlobalSearch = ({ className, onResultSelect }: GlobalSearchProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Perform search against Supabase
  const performSearch = useCallback(async (searchQuery: string): Promise<SearchResult[]> => {
    if (!searchQuery.trim() || !user) return [];
    
    const searchResults: SearchResult[] = [];
    const lowerQuery = `%${searchQuery.toLowerCase()}%`;

    try {
      // Search Artworks
      const { data: artworksData } = await supabase
        .from('artworks')
        .select('id, title, medium, price, status')
        .ilike('title', lowerQuery)
        .limit(3);

      const artworks = artworksData as Pick<Artwork, 'id' | 'title' | 'medium' | 'price' | 'status'>[] | null;
      if (artworks) {
        artworks.forEach(artwork => {
          searchResults.push({
            id: artwork.id,
            type: 'artwork',
            title: artwork.title,
            subtitle: [artwork.medium, artwork.price ? formatCurrency(artwork.price) : null, getStatusLabel(artwork.status)]
              .filter(Boolean).join(' • '),
            href: `/artworks?highlight=${artwork.id}`,
          });
        });
      }

      // Search Contacts
      const { data: contactsData } = await supabase
        .from('contacts')
        .select('id, name, type, location, company')
        .ilike('name', lowerQuery)
        .limit(3);

      const contacts = contactsData as Pick<Contact, 'id' | 'name' | 'type' | 'location' | 'company'>[] | null;
      if (contacts) {
        contacts.forEach(contact => {
          searchResults.push({
            id: contact.id,
            type: 'contact',
            title: contact.name,
            subtitle: [getContactTypeLabel(contact.type), contact.company, contact.location]
              .filter(Boolean).join(' • '),
            href: `/contacts?highlight=${contact.id}`,
          });
        });
      }

      // Search Pipeline Items
      const { data: pipelineData } = await supabase
        .from('pipeline_items')
        .select('id, title, medium, status, estimated_price')
        .ilike('title', lowerQuery)
        .limit(2);

      const pipelineItems = pipelineData as Pick<PipelineItem, 'id' | 'title' | 'medium' | 'status' | 'estimated_price'>[] | null;
      if (pipelineItems) {
        pipelineItems.forEach(item => {
          searchResults.push({
            id: item.id,
            type: 'pipeline',
            title: item.title,
            subtitle: [item.medium, getStatusLabel(item.status), item.estimated_price ? formatCurrency(item.estimated_price) : null]
              .filter(Boolean).join(' • '),
            href: `/pipeline?highlight=${item.id}`,
          });
        });
      }

      // Search Reports
      const { data: reportsData } = await supabase
        .from('reports')
        .select('id, name, type, created_at')
        .ilike('name', lowerQuery)
        .limit(2);

      const reports = reportsData as Pick<Report, 'id' | 'name' | 'type' | 'created_at'>[] | null;
      if (reports) {
        reports.forEach(report => {
          const createdDate = new Date(report.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
          });
          searchResults.push({
            id: report.id,
            type: 'report',
            title: report.name,
            subtitle: `${report.type} • Dibuat ${createdDate}`,
            href: `/reports?highlight=${report.id}`,
          });
        });
      }

    } catch (error) {
      console.error('Search error:', error);
    }

    return searchResults;
  }, [user]);

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
  }, [query, performSearch]);

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
    onResultSelect?.();
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
                    key={`${result.type}-${result.id}`}
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
