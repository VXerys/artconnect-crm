import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactSearchProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const ContactSearch = ({
  searchQuery,
  onSearchChange,
}: ContactSearchProps) => {
  return (
    <div className="relative group">
      <div className="relative flex items-center">
        {/* Search icon with animation */}
        <Search className={cn(
          "absolute left-3 sm:left-4 w-4 h-4 sm:w-4.5 sm:h-4.5 md:w-5 md:h-5 transition-all duration-300",
          searchQuery 
            ? "text-primary scale-110" 
            : "text-muted-foreground group-focus-within:text-primary group-focus-within:scale-110"
        )} />
        
        <input
          type="text"
          placeholder="Cari nama, email, atau lokasi..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className={cn(
            "w-full sm:w-auto sm:min-w-[280px] md:min-w-[320px] lg:min-w-[384px]",
            "h-10 sm:h-11 md:h-12 pl-9 sm:pl-11 md:pl-12 pr-9 sm:pr-11 md:pr-12 rounded-lg sm:rounded-xl",
            "bg-secondary/80",
            "border-2 border-border",
            "text-xs sm:text-sm placeholder:text-muted-foreground",
            "transition-all duration-300",
            "focus:outline-none focus:ring-0",
            "focus:border-primary/50 focus:bg-secondary",
            "hover:border-primary/30"
          )}
        />
        
        {/* Clear button */}
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className={cn(
              "absolute right-3 sm:right-4 p-0.5 sm:p-1 rounded-full",
              "text-muted-foreground hover:text-foreground",
              "hover:bg-primary/10 transition-all duration-200"
            )}
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>
      
      {/* Search hint */}
      {!searchQuery && (
        <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground/60 ml-0.5 sm:ml-1">
          Tekan untuk mencari kontak...
        </p>
      )}
    </div>
  );
};
