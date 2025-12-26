import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { QuickAction } from "./types";

interface QuickActionsProps {
  actions: QuickAction[];
}

export const QuickActions = ({ actions }: QuickActionsProps) => {
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
          {actions.map((action, index) => (
            <Link key={action.id} to={action.href}>
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
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
