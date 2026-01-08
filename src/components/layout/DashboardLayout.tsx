import { 
  LayoutDashboard, 
  Palette, 
  Users, 
  Kanban, 
  BarChart3, 
  FileText,
  Settings,
  LogOut,
  Search,
  ChevronLeft,
  Menu
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/lib/i18n";
import UserAvatar from "./UserAvatar";
import Logo from "@/components/ui/Logo";
import GlobalSearch from "./GlobalSearch";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { t } = useLanguage();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  // Dynamic nav items with translations
  const navItems = [
    { icon: LayoutDashboard, label: t.nav.dashboard, href: "/dashboard" },
    { icon: Palette, label: t.nav.artworks, href: "/artworks" },
    { icon: Kanban, label: t.nav.pipeline, href: "/pipeline" },
    { icon: Users, label: t.nav.contacts, href: "/contacts" },
    { icon: BarChart3, label: t.nav.analytics, href: "/analytics" },
    { icon: FileText, label: t.nav.reports, href: "/reports" },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/auth/login");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed lg:sticky top-0 left-0 h-screen bg-sidebar border-r border-sidebar-border z-50 transition-all duration-300",
          collapsed ? "w-[72px]" : "w-52",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Header - same height as top navbar (h-16) */}
          <div className={cn(
            "h-16 flex items-center border-b border-sidebar-border",
            collapsed ? "justify-center" : "justify-between px-3"
          )}>
            {/* Logo - only show when expanded */}
            {!collapsed && (
              <Link to="/" className="flex items-center">
                <Logo size="xs" showText={true} />
              </Link>
            )}
            
            {/* Collapse/Expand button */}
            <button 
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex w-8 h-8 rounded-md items-center justify-center hover:bg-sidebar-accent text-sidebar-foreground transition-colors flex-shrink-0"
            >
              <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                    isActive 
                      ? "bg-primary/10 text-primary border border-primary/20" 
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive && "text-primary")} />
                  {!collapsed && <span className="font-medium text-sm">{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="p-2 border-t border-sidebar-border space-y-1">
            <Link
              to="/settings"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors"
            >
              <Settings className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium text-sm">{t.nav.settings}</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors text-left"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium text-sm">{t.nav.logout}</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Mobile Search Modal */}
        {mobileSearchOpen && (
          <div className="fixed inset-0 bg-background z-50 sm:hidden">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center gap-3 p-3 border-b border-border">
                <button
                  onClick={() => setMobileSearchOpen(false)}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="flex-1">
                  <GlobalSearch onResultSelect={() => setMobileSearchOpen(false)} />
                </div>
              </div>
              {/* Hint */}
              <div className="flex-1 flex items-center justify-center p-6 text-center">
                <div className="text-muted-foreground">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="text-sm">{t.common.search}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top Bar */}
        <header className="h-12 sm:h-14 md:h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="h-full px-2 sm:px-3 md:px-4 flex items-center justify-between gap-2 sm:gap-3">
            {/* Mobile Menu */}
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 text-foreground hover:bg-secondary rounded-lg flex-shrink-0"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Search - Responsive: icon only on xs, GlobalSearch on sm+ */}
            <div className="flex-1 flex justify-start">
              {/* Mobile: Icon button that opens fullscreen search */}
              <button 
                onClick={() => setMobileSearchOpen(true)}
                className="sm:hidden p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg"
              >
                <Search className="w-4 h-4" />
              </button>
              
              {/* Tablet+: Full search with functionality */}
              <div className="hidden sm:block flex-1 max-w-xs md:max-w-sm lg:max-w-md">
                <GlobalSearch />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <UserAvatar size="sm" />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-3 sm:p-4 md:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
