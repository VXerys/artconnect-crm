import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Moon, 
  Sun, 
  LogOut, 
  Globe, 
  ChevronRight,
  HelpCircle,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  // Mock states for UI demonstration
  const [darkMode, setDarkMode] = useState(true);
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

  const Section = ({ title, icon: Icon, children }: { title: string, icon: any, children: React.ReactNode }) => (
    <div className="space-y-4 mb-8 animate-slide-up">
      <div className="flex items-center gap-2 text-primary mb-2">
        <Icon className="w-5 h-5" />
        <h2 className="text-xl font-display font-semibold">{title}</h2>
      </div>
      <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden divide-y divide-border/50">
        {children}
      </div>
    </div>
  );

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
        "p-4 flex items-center justify-between transition-colors",
        onClick && "cursor-pointer hover:bg-white/5"
      )}
      onClick={onClick}
    >
      <div className="space-y-0.5">
        <div className="font-medium text-foreground">{label}</div>
        {description && <div className="text-sm text-muted-foreground">{description}</div>}
      </div>
      <div className="flex items-center gap-4">
        {value && <span className="text-sm text-muted-foreground">{value}</span>}
        {action}
        {onClick && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div className="space-y-2 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-foreground">Pengaturan</h1>
        <p className="text-muted-foreground">Kelola preferensi akun dan aplikasi Anda.</p>
      </div>

      <div className="grid gap-6">
        {/* Profile Section */}
        <div className="bg-gradient-to-br from-primary/20 via-card to-card border border-primary/20 rounded-2xl p-6 flex items-center gap-6 animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-primary/20 border-2 border-primary/30 flex items-center justify-center shrink-0">
            <User className="w-10 h-10 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <h2 className="text-2xl font-display font-bold">{user?.user_metadata?.full_name || "Pengguna"}</h2>
            <p className="text-muted-foreground">{user?.email}</p>
            <div className="flex gap-2 pt-2">
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 border border-primary/30 text-xs font-medium text-primary">
                Free Plan
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-xs font-medium text-green-500">
                Verified
              </span>
            </div>
          </div>
          <Button variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary">
            Edit Profil
          </Button>
        </div>

        {/* General Settings */}
        <Section title="Tampilan & Bahasa" icon={SettingsIcon}>
          <Row 
            label="Tema Gelap" 
            description="Aktifkan tampilan gelap untuk kenyamanan mata"
            action={
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
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
        <div className="pt-4 animate-slide-up">
          <Button 
            variant="destructive" 
            className="w-full h-12 text-base font-medium flex items-center justify-center gap-2"
            onClick={handleLogout}
            disabled={loading}
          >
            <LogOut className="w-5 h-5" />
            {loading ? "Keluar..." : "Keluar dari Aplikasi"}
          </Button>
          <p className="text-center text-sm text-muted-foreground mt-4">
            Anda akan diarahkan kembali ke halaman login.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
