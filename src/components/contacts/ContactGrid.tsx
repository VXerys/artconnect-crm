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
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {/* Empty state illustration */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
          <div className="relative p-6 rounded-full bg-secondary border-2 border-dashed border-border">
            <SearchX className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">Tidak ada kontak ditemukan</h3>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">
          Coba ubah filter atau kata kunci pencarian Anda, atau tambahkan kontak baru ke jejaring Anda
        </p>
        
        {onAddNew && (
          <Button onClick={onAddNew} className="gap-2">
            <Users className="w-4 h-4" />
            Tambah Kontak Baru
            <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Menampilkan <span className="font-medium text-foreground">{contacts.length}</span> kontak
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
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
