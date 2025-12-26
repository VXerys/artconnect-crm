import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Mail, 
  Phone, 
  MapPin, 
  Star,
  Eye,
  Edit,
  Trash2,
  Calendar,
  ExternalLink,
  Sparkles
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Contact } from "./types";
import { typeConfig } from "./constants";

interface ContactCardProps {
  contact: Contact;
  onView: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contact: Contact) => void;
}

export const ContactCard = ({ 
  contact, 
  onView, 
  onEdit, 
  onDelete 
}: ContactCardProps) => {
  const config = typeConfig[contact.type];

  // Check if this is a new contact (just added today)
  const isNew = contact.lastContact === "Baru ditambahkan";
  
  // Check if high priority (5 star rating)
  const isHighPriority = contact.rating === 5;

  return (
    <Card className={cn(
      "relative overflow-hidden group",
      "bg-card border-border",
      "transition-all duration-300 ease-out",
      "hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5"
    )}>
      {/* Top gradient accent based on type */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1",
        "transition-all duration-300",
        "opacity-50 group-hover:opacity-100",
        contact.type === 'gallery' && "bg-gradient-to-r from-purple-500 to-purple-400",
        contact.type === 'collector' && "bg-gradient-to-r from-blue-500 to-blue-400",
        contact.type === 'museum' && "bg-gradient-to-r from-emerald-500 to-emerald-400",
        contact.type === 'curator' && "bg-gradient-to-r from-primary to-amber-400"
      )} />

      {/* Badges */}
      <div className="absolute top-3 right-12 flex items-center gap-1.5">
        {isNew && (
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Baru
          </span>
        )}
        {isHighPriority && (
          <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide rounded-full bg-primary/10 text-primary border border-primary/20 flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            VIP
          </span>
        )}
      </div>

      <CardHeader className="pb-3 pt-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {/* Icon with gradient background */}
            <div className={cn(
              "relative w-14 h-14 rounded-2xl flex items-center justify-center",
              "transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg",
              config.bg
            )}>
              {/* Glow effect */}
              <div className={cn(
                "absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity",
                config.bg
              )} />
              <config.icon className={cn("w-7 h-7 relative", config.color)} />
            </div>

            <div className="flex-1 min-w-0">
              <CardTitle className="text-base font-semibold truncate pr-8">
                {contact.name}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-md",
                  config.bg, config.color
                )}>
                  {config.label}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {contact.location}
                </span>
              </div>
            </div>
          </div>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn(
                  "h-8 w-8 absolute top-3 right-3",
                  "opacity-0 group-hover:opacity-100 transition-opacity"
                )}
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => onView(contact)} className="gap-2">
                <Eye className="w-4 h-4" />
                Lihat Detail
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(contact)} className="gap-2">
                <Edit className="w-4 h-4" />
                Edit Kontak
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Calendar className="w-4 h-4" />
                Catat Aktivitas
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDelete(contact)}
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
                Hapus Kontak
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        {/* Contact Details */}
        <div className="space-y-2.5">
          <a 
            href={`mailto:${contact.email}`}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
          >
            <div className="p-2 rounded-lg bg-secondary/50 group-hover/link:bg-primary/10 transition-colors">
              <Mail className="w-4 h-4" />
            </div>
            <span className="truncate">{contact.email}</span>
            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
          </a>
          
          <a 
            href={`tel:${contact.phone}`}
            className="flex items-center gap-3 text-sm text-muted-foreground hover:text-primary transition-colors group/link"
          >
            <div className="p-2 rounded-lg bg-secondary/50 group-hover/link:bg-primary/10 transition-colors">
              <Phone className="w-4 h-4" />
            </div>
            <span>{contact.phone}</span>
          </a>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            {/* Rating Stars */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star 
                  key={i} 
                  className={cn(
                    "w-4 h-4 transition-all duration-200",
                    i <= contact.rating 
                      ? "text-primary fill-primary" 
                      : "text-muted-foreground/30"
                  )} 
                />
              ))}
            </div>
            
            {/* Last contact with icon */}
            <span className="text-xs text-muted-foreground flex items-center gap-1.5 bg-secondary/50 px-2 py-1 rounded-md">
              <Calendar className="w-3 h-3" />
              {contact.lastContact}
            </span>
          </div>
          
          {/* Notes Preview */}
          {contact.notes && (
            <p className="text-xs text-muted-foreground mt-3 line-clamp-2 italic bg-secondary/30 p-2 rounded-lg border-l-2 border-primary/30">
              "{contact.notes}"
            </p>
          )}
        </div>
      </CardContent>

      {/* Hover glow effect */}
      <div className={cn(
        "absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500",
        "bg-gradient-to-t from-primary/5 via-transparent to-transparent"
      )} />
    </Card>
  );
};
