import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Mail, MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DashboardContact } from "./types";
import { contactTypeConfig } from "./constants";

interface RecentContactsProps {
  contacts: DashboardContact[];
  maxHeight?: string; // Optional max height for scroll area
}

export const RecentContacts = ({ contacts, maxHeight = "340px" }: RecentContactsProps) => {
  return (
    <Card className="bg-card border-border overflow-hidden flex flex-col h-full w-full">
      {/* Header */}
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <Users className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <CardTitle className="font-display text-lg">Kontak Terbaru</CardTitle>
            <p className="text-xs text-muted-foreground mt-0.5">
              {contacts.length} kontak ditampilkan
            </p>
          </div>
        </div>
        <Link to="/contacts">
          <Button variant="ghost" size="sm" className="gap-2 text-blue-400 hover:text-blue-400">
            Lihat Semua
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardHeader>

      {/* Contacts List - Scrollable */}
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div 
          className="divide-y divide-border overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent h-full"
        >
          {contacts.map((contact, index) => {
            const typeConfig = contactTypeConfig[contact.type] || { 
              color: "text-muted-foreground", 
              bgColor: "bg-secondary" 
            };

            return (
              <div 
                key={contact.id} 
                className={cn(
                  "group flex items-center gap-4 px-6 py-4",
                  "hover:bg-secondary/30 transition-all duration-200",
                  "cursor-pointer"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  "transition-transform duration-300 group-hover:scale-105",
                  typeConfig.bgColor
                )}>
                  <span className={cn("text-lg font-bold", typeConfig.color)}>
                    {contact.name.charAt(0)}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate group-hover:text-primary transition-colors">
                    {contact.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={cn(
                      "px-2 py-0.5 rounded-md text-xs font-medium",
                      typeConfig.bgColor,
                      typeConfig.color
                    )}>
                      {contact.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {contact.lastContact}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {contact.email && (
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 hover:bg-primary/10 hover:text-primary"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
