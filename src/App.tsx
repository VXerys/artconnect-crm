import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme-provider";

// Components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import ForceDarkMode from "./components/layout/ForceDarkMode";

// Public Pages
import Index from "./pages/Index";
import AboutPage from "./pages/AboutPage";
import GuidePage from "./pages/GuidePage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsConditionsPage from "./pages/TermsConditionsPage";
import NotFound from "./pages/NotFound";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage";
import AuthCallback from "./pages/auth/AuthCallback";

// Protected Pages (Dashboard)
import Dashboard from "./pages/Dashboard";
import Artworks from "./pages/Artworks";
import Contacts from "./pages/Contacts";
import Pipeline from "./pages/Pipeline";
import Analytics from "./pages/Analytics";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
          <AuthProvider>
            <Routes>
              {/* ============================================ */}
              {/* PUBLIC ROUTES - Always Dark Mode */}
              {/* ============================================ */}
              <Route path="/" element={<ForceDarkMode><Index /></ForceDarkMode>} />
              <Route path="/about" element={<ForceDarkMode><AboutPage /></ForceDarkMode>} />
              <Route path="/guide" element={<ForceDarkMode><GuidePage /></ForceDarkMode>} />
              <Route path="/privacy" element={<ForceDarkMode><PrivacyPolicyPage /></ForceDarkMode>} />
              <Route path="/terms" element={<ForceDarkMode><TermsConditionsPage /></ForceDarkMode>} />

              {/* ============================================ */}
              {/* AUTH ROUTES - Always Dark Mode */}
              {/* ============================================ */}
              <Route path="/auth/login" element={<ForceDarkMode><LoginPage /></ForceDarkMode>} />
              <Route path="/auth/register" element={<ForceDarkMode><RegisterPage /></ForceDarkMode>} />
              <Route path="/auth/forgot-password" element={<ForceDarkMode><ForgotPasswordPage /></ForceDarkMode>} />
              <Route path="/auth/reset-password" element={<ForceDarkMode><ResetPasswordPage /></ForceDarkMode>} />
              <Route path="/auth/callback" element={<ForceDarkMode><AuthCallback /></ForceDarkMode>} />

              {/* ============================================ */}
              {/* PROTECTED ROUTES (Require Authentication) */}
              {/* ============================================ */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/artworks"
                element={
                  <ProtectedRoute>
                    <Artworks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contacts"
                element={
                  <ProtectedRoute>
                    <Contacts />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/pipeline"
                element={
                  <ProtectedRoute>
                    <Pipeline />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <Reports />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* ============================================ */}
              {/* CATCH-ALL ROUTE */}
              {/* ============================================ */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
