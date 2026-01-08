import { Contact } from "./types";
import { ContactCard } from "./ContactCard";
import { Users, SearchX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ContactGridProps {
  contacts: Contact[];
  onView: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
  onAddNew?: () => void;
}

export const ContactGrid = ({
  contacts,
  onView,
  onEdit,
  onDelete,
  onAddNew,
}: ContactGridProps) => {
  if (contacts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-center">
        {/* Empty state illustration */}
        <div className="relative mb-4 sm:mb-5 md:mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative p-4 sm:p-5 md:p-6 rounded-full bg-secondary border-2 border-dashed border-border">
            <SearchX className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-muted-foreground" />
          </div>
        </div>
        
        <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1.5 sm:mb-2">Tidak ada kontak ditemukan</h3>
        <p className="text-xs sm:text-sm text-muted-foreground max-w-xs sm:max-w-sm mb-4 sm:mb-5 md:mb-6 px-4">
          Coba ubah filter atau kata kunci pencarian Anda, atau tambahkan kontak baru ke jejaring Anda
        </p>
        
        {onAddNew && (
          <Button 
            onClick={onAddNew} 
            className="gap-1.5 sm:gap-2 h-9 sm:h-10 md:h-11 text-[11px] sm:text-xs md:text-sm px-3 sm:px-4"
          >
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Tambah Kontak Baru</span>
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">
          Menampilkan <span className="font-medium text-foreground">{contacts.length}</span> kontak
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
        {contacts.map((contact) => (
          <ContactCard
            key={contact.id}
            contact={contact}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
