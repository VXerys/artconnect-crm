import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  LogOut, 
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { useTheme } from "@/components/theme-provider";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [loading, setLoading] = useState(false);
  
  // Mock states for UI demonstration
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [pushNotifs, setPushNotifs] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { error } = await signOut();
      if (error) throw error;
      navigate("/auth/login");
      toast.success("Berhasil keluar");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Gagal keluar. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  // Responsive Section Component
  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="space-y-2 sm:space-y-3 md:space-y-4 mb-4 sm:mb-6 md:mb-8 animate-slide-up">
      <div className="flex items-center gap-1.5 sm:gap-2 text-primary mb-1 sm:mb-2">
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
        <h2 className="text-base sm:text-lg md:text-xl font-display font-semibold">{title}</h2>
      </div>
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg sm:rounded-xl overflow-hidden divide-y divide-border/50">
        {children}
      </div>
    </div>
  );

  // Responsive Row Component
  const Row = ({ 
    label, 
    value, 
    description, 
    action, 
    onClick 
  }: { 
    label: string, 
    value?: string, 
    description?: string, 
    action?: React.ReactNode,
    onClick?: () => void
  }) => (
    <div 
      className={cn(
        "p-3 sm:p-4 flex items-center justify-between gap-3 sm:gap-4 transition-colors",
        onClick && "cursor-pointer hover:bg-white/5 active:bg-white/10"
      )}
      onClick={onClick}
    >
      {/* Label & Description */}
      <div className="space-y-0.5 flex-1 min-w-0">
        <div className="font-medium text-sm sm:text-base text-foreground">{label}</div>
        {description && (
          <div className="text-[11px] sm:text-xs md:text-sm text-muted-foreground leading-tight">{description}</div>
        )}
      </div>
      
      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        {value && <span className="text-[11px] sm:text-xs md:text-sm text-muted-foreground">{value}</span>}
        {action}
        {onClick && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </div>
    </div>
  );

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 md:space-y-8 pb-6 sm:pb-8 md:pb-10">
        {/* Page Header */}
        <div className="space-y-1 sm:space-y-2 animate-fade-in">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-display font-bold text-foreground">Pengaturan</h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
            Kelola preferensi akun dan aplikasi Anda.
          </p>
        </div>

        <div className="grid gap-4 sm:gap-5 md:gap-6">
          {/* Profile Section */}
          <div className="bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 animate-scale-in">
            {/* Avatar */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />
            </div>
            
            {/* User Info */}
            <div className="flex-1 space-y-1 min-w-0">
              <h2 className="text-lg sm:text-xl md:text-2xl font-display font-bold truncate">
                {user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Pengguna"}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                {user?.email || "Email tidak tersedia"}
              </p>
              <div className="flex flex-wrap gap-2 pt-1.5 sm:pt-2">
                {user?.email_confirmed_at && (
                  <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] sm:text-xs font-medium text-green-500">
                    Email Terverifikasi
                  </span>
                )}
                <span className="px-2 sm:px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-[10px] sm:text-xs font-medium text-primary">
                  Free Plan
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <Button 
              variant="outline" 
              size="sm"
              className="border-primary/20 hover:bg-primary/10 hover:text-primary w-full sm:w-auto h-9 sm:h-10 text-xs sm:text-sm"
            >
              Edit Profil
            </Button>
          </div>

          {/* General Settings */}
          <Section title="Tampilan & Bahasa" icon={SettingsIcon}>
            <Row 
              label="Tema Gelap" 
              description="Aktifkan tampilan gelap untuk kenyamanan mata"
              action={
                <Switch 
                  checked={theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')} 
                />
              }
            />
            <Row 
              label="Bahasa" 
              value="Indonesia" 
              onClick={() => {}}
            />
          </Section>

          {/* Notifications */}
          <Section title="Notifikasi" icon={Bell}>
            <Row 
              label="Email Notifikasi" 
              description="Terima update mingguan tentang portofolio Anda"
              action={
                <Switch checked={emailNotifs} onCheckedChange={setEmailNotifs} />
              }
            />
            <Row 
              label="Push Notifikasi" 
              description="Pemberitahuan real-time untuk aktivitas baru"
              action={
                <Switch checked={pushNotifs} onCheckedChange={setPushNotifs} />
              }
            />
          </Section>

          {/* Privacy & Security */}
          <Section title="Keamanan" icon={Shield}>
            <Row 
              label="Ubah Password" 
              description="Perbarui kata sandi akun Anda secara berkala"
              onClick={() => {}}
            />
            <Row 
              label="Two-Factor Authentication" 
              description="Tambahkan lapisan keamanan ekstra"
              action={
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
              }
            />
          </Section>

          {/* Support */}
          <Section title="Bantuan" icon={HelpCircle}>
            <Row 
              label="Pusat Bantuan" 
              onClick={() => {}}
            />
            <Row 
              label="Syarat & Ketentuan" 
              onClick={() => navigate("/privacy")}
            />
            <Row 
              label="Tentang Aplikasi" 
              value="v1.0.0" 
            />
          </Section>

          {/* Logout Zone */}
          <div className="pt-2 sm:pt-4 animate-slide-up">
            <Button 
              variant="destructive" 
              className="w-full h-10 sm:h-11 md:h-12 text-sm sm:text-base font-medium flex items-center justify-center gap-2"
              onClick={handleLogout}
              disabled={loading}
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
              {loading ? "Keluar..." : "Keluar dari Aplikasi"}
            </Button>
            <p className="text-center text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-3 sm:mt-4">
              Anda akan diarahkan kembali ke halaman login.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
