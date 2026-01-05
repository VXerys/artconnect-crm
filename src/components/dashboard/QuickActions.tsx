import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Loader2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { QuickAction } from "./types";
import { toast } from "sonner";

interface QuickActionsProps {
  actions: QuickAction[];
  onAddArtwork?: () => void;
  onAddContact?: () => void;
  isLoading?: boolean;
}

export const QuickActions = ({ 
  actions, 
  onAddArtwork, 
  onAddContact,
  isLoading = false 
}: QuickActionsProps) => {
  const navigate = useNavigate();
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Handle navigation actions with feedback
  const handleNavigate = (path: string, label: string): void => {
    toast.info(`Menuju ${label}...`, { duration: 1500 });
    navigate(path);
  };

  // Map action IDs to their handlers
  const getActionHandler = (action: QuickAction): (() => void) | undefined => {
    switch (action.id) {
      case 'add-artwork':
        return onAddArtwork ? () => {
          setActiveActionId(action.id);
          onAddArtwork();
          // Reset after a brief moment
          setTimeout(() => setActiveActionId(null), 300);
        } : undefined;
      case 'add-contact':
        return onAddContact ? () => {
          setActiveActionId(action.id);
          onAddContact();
          setTimeout(() => setActiveActionId(null), 300);
        } : undefined;
      case 'view-pipeline':
        return () => handleNavigate('/pipeline', action.label);
      case 'record-sale':
        return () => handleNavigate('/reports', action.label);
      default:
        // For any other action with a predefined onClick
        return action.onClick;
    }
  };

  // Check if an action should navigate via Link or trigger a handler
  const shouldUseHandler = (action: QuickAction): boolean => {
    return [
      'add-artwork', 
      'add-contact', 
      'view-pipeline', 
      'record-sale'
    ].includes(action.id) || !!action.onClick;
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-4 border-b border-border">
        <CardTitle className="font-display text-lg">Aksi Cepat</CardTitle>
        <p className="text-xs text-muted-foreground mt-0.5">
          Akses fitur utama dengan cepat
        </p>
      </CardHeader>
      
      <CardContent className="p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {actions.map((action, index) => {
            const handler = getActionHandler(action) || action.onClick;
            const content = (
              <div 
                className={cn(
                  "group relative p-4 rounded-xl",
                  "bg-secondary/30 border border-border",
                  "hover:border-primary/40 hover:bg-secondary/50",
                  "transition-all duration-300",
                  "cursor-pointer overflow-hidden"
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Gradient glow on hover */}
                <div className={cn(
                  "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                  "bg-gradient-to-br from-primary/5 via-transparent to-transparent"
                )} />

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center text-center gap-3">
                  {/* Icon */}
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center",
                    "transition-all duration-300 group-hover:scale-110",
                    action.bgColor
                  )}>
                    <action.icon className={cn("w-6 h-6", action.color)} />
                  </div>

                  {/* Label */}
                  <div>
                    <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 hidden md:block">
                      {action.description}
                    </p>
                  </div>

                  {/* Arrow that appears on hover */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            );

            // If action has a handler, render as button; otherwise render as Link
            if (handler) {
              return (
                <button
                  key={action.id}
                  type="button"
                  onClick={handler}
                  className="text-left w-full"
                >
                  {content}
                </button>
              );
            }

            return (
              <Link key={action.id} to={action.href || '#'}>
                {content}
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
